// RAJZ = NETLISTA – a bekötési ábra visszafejtése a kirajzolt SVG-ből (renderToStaticMarkup) és összevetése a netlistával
// (docs/tudastar.md „Sémák és ábramotor”). Csak a tesztek (tests/kb-diagram.ts) és a generátor használják.
//
// A visszafejtés két forrásból dolgozik, és a kettőnek egyeznie kell:
//  - az attribútumokból (data-wire, data-from, data-to, data-net, data-role, data-color, data-term, data-bridge, data-sel/state/pair),
//  - a GEOMETRIÁBÓL: a vezeték két végpontja a két kapocs körének középpontjára esik; a vezeték belseje egyetlen kapcson sem fut át;
//    két különböző hálózat vezetéke (és hídja) nem fedi egymást hosszában, és nem is érinti egymást (csak keresztezheti); ugyanazon
//    hálózat ágai csak csomópontpöttyel ágaznak el, és pötty csak valódi csomóponton van; a kapocsjel kitöltött, ha legalább két ér
//    csatlakozik; az érintkezők a csonkok belső végpontjait kötik; az érszín-osztály a netlista színe; a felirat a saját vezetékén ül.
// Az eredmény a hibák listája (üres: a rajz a netlistát mutatja).
import {COLORS,CONDUCTOR_CLASS,ROLE_CLASS,ROLE_CLASS_E,loadNetlist,staticNets,tkey,type Netlist} from '../../lib/kb/circuit';

export type Pt=[number,number];
export type El={tag:string;attrs:Record<string,string>;text:string};

/** A renderToStaticMarkup kimenetének (jól formált, idézőjeles attribútumok) egyszerű elemlistája. */
export function parseSvg(svg:string):El[]{
 const out:El[]=[];
 const re=/<([a-z]+)((?:\s+[a-zA-Z0-9:-]+="[^"]*")*)\s*(\/?)>(?:([^<]*)<\/\1>)?/g;
 for(const m of svg.matchAll(re)){
  const attrs:Record<string,string>={};
  for(const a of m[2].matchAll(/([a-zA-Z0-9:-]+)="([^"]*)"/g))attrs[a[1]]=a[2].replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#x27;/g,"'");
  out.push({tag:m[1],attrs,text:(m[4]??'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#x27;/g,"'").replace(/&quot;/g,'"')});
 }
 return out;
}
const pts=(s:string):Pt[]=>s.trim().split(/\s+/).map(p=>{const [x,y]=p.split(',').map(Number);return [x,y]});
const ptsOf=(e:El):Pt[]=>e.tag==='line'?[[+e.attrs.x1,+e.attrs.y1],[+e.attrs.x2,+e.attrs.y2]]:pts(e.attrs.points??'');
const EPS=0.06;
const same=(a:Pt,b:Pt)=>Math.abs(a[0]-b[0])<EPS&&Math.abs(a[1]-b[1])<EPS;
const cls=(e:El)=>(e.attrs.class??'').split(/\s+/);
/** p a szakasz belsejében (a végpontokat nem számítva)? */
export function interior(p:Pt,a:Pt,b:Pt):boolean{
 const len=Math.hypot(b[0]-a[0],b[1]-a[1]);if(len<EPS)return false;
 const cross=((b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]))/len;
 if(Math.abs(cross)>EPS)return false;
 const t=((p[0]-a[0])*(b[0]-a[0])+(p[1]-a[1])*(b[1]-a[1]))/(len*len);
 return t>EPS/len&&t<1-EPS/len;
}
/** Két szakasz közös, pozitív hosszúságú (kollineáris) része. */
export function overlapLen(a:Pt,b:Pt,c:Pt,d:Pt):number{
 const len=Math.hypot(b[0]-a[0],b[1]-a[1]);if(len<EPS)return 0;
 const crossC=((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/len,crossD=((b[0]-a[0])*(d[1]-a[1])-(b[1]-a[1])*(d[0]-a[0]))/len;
 if(Math.abs(crossC)>EPS||Math.abs(crossD)>EPS)return 0;
 const proj=(p:Pt)=>((p[0]-a[0])*(b[0]-a[0])+(p[1]-a[1])*(b[1]-a[1]))/len;
 const t0=Math.max(0,Math.min(proj(c),proj(d))),t1=Math.min(len,Math.max(proj(c),proj(d)));
 return Math.max(0,t1-t0);
}
/** Két szakasz érintkezése (közös pont), a valódi (belső–belső, nem kollineáris) keresztezést nem számítva. */
export function touching(a:Pt,b:Pt,c:Pt,d:Pt):boolean{
 for(const [p,q,r] of [[a,c,d],[b,c,d],[c,a,b],[d,a,b]] as [Pt,Pt,Pt][])if(same(p,q)||same(p,r)||interior(p,q,r))return true;
 return false;
}
const distSeg=(p:Pt,a:Pt,b:Pt)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l2=dx*dx+dy*dy;const t=l2?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/l2)):0;return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)};

/** Az érszín (netlista) → az ábra ér-osztálya; a teszt saját táblája (a jelenettől független). */
export const WIRE_CLASS:Readonly<Record<string,string>>={barna:'kk-dg-w-l1',fekete:'kk-dg-w-l2',szürke:'kk-dg-w-l3',kék:'kk-dg-w-n','zöld-sárga':'kk-dg-w-pe'};
/** A szerep (role) → megengedett színek (a sim.py CLASS_COLORS-a szerint; a földelési bővítés vezetői is). */
const ROLE_COLORS:Readonly<Record<string,readonly string[]>>={L:['barna','fekete','szürke'],Lk:['barna','fekete','szürke'],K1:['barna','fekete','szürke'],K2:['barna','fekete','szürke'],
 L1:['barna'],L2:['fekete'],L3:['szürke'],N:['kék'],Nk:['kék'],PE:['zöld-sárga'],PEN:['zöld-sárga','kék']};
/** Az ér felirata a rajzon (a teszt saját szabálya, a jelenettől független). */
export function expectedTag(conductor:string,label?:string):string{
 if(['belső','hibahely','érintés'].includes(conductor))return '';
 const l=(label??'').trim();
 return conductor==='kapcsolt fázis'?'Lk'+(/^\d+$/.test(l)?l:''):conductor==='kapcsolt nulla'?'Nk':conductor==='váltóvezeték'?l:conductor==='áthidaló'?'L':conductor==='földelővezető'?'FV':conductor==='EPH-vezető'?'EPH':conductor;
}

export type CheckReport={problems:string[];wires:number;terminals:number;dots:number;crossings:number;bridges:number;contacts:number};
/**
 * A teljes ellenőrzés. `pyWires`: a Python-szimulátor vezetéktáblája (tests/fixtures/kb-circuit-reference.json) – a független
 * összevetéshez (honnan, hová, vezető, szín). `viewBox`: a rajz határai.
 */
export function checkDiagramSvg(svg:string,netlist:Netlist,pyWires?:readonly {fromLabel:string;toLabel:string;conductor:string;color:string}[]):CheckReport{
 const P:string[]=[],els=parseSvg(svg),c=loadNetlist(netlist),nets=staticNets(c);
 const problem=(s:string)=>{if(P.length<200)P.push(s)};
 const root=els.find(e=>e.tag==='svg');
 const vb=(root?.attrs.viewBox??'0 0 0 0').split(' ').map(Number);
 const inside=(p:Pt)=>p[0]>=vb[0]-EPS&&p[1]>=vb[1]-EPS&&p[0]<=vb[0]+vb[2]+EPS&&p[1]<=vb[1]+vb[3]+EPS;
 // --- Kapcsok
 const termEls=els.filter(e=>e.attrs['data-term']);
 const term=new Map<string,{at:Pt;filled:boolean}>();
 for(const e of termEls){
  const k=e.attrs['data-term'];if(term.has(k))problem('kétszer rajzolt kapocs: '+k);
  term.set(k,{at:[+e.attrs.cx,+e.attrs.cy],filled:cls(e).includes('kk-dg-term-j')});
  if(!c.terms.has(k))problem('ismeretlen kapocs a rajzon: '+k);
  else if(e.attrs['data-net']!==nets.get(k))problem(k+': a kapocs data-net-je ('+e.attrs['data-net']+') nem a statikus hálózata ('+nets.get(k)+')');
 }
 for(const k of c.terms.keys())if(!term.has(k))problem('hiányzó kapocsjel: '+k);
 // --- Vezetékek (attribútumok)
 const wireEls=els.filter(e=>e.attrs['data-wire']);
 const drawn=new Map<string,{from:string;to:string;net:string;pts:Pt[];el:El}>();
 for(const e of wireEls){
  const id=e.attrs['data-wire'];
  if(drawn.has(id)){problem('kétszer rajzolt vezeték: '+id);continue}
  drawn.set(id,{from:e.attrs['data-from'],to:e.attrs['data-to'],net:e.attrs['data-net'],pts:ptsOf(e),el:e});
 }
 const nlWires=(c.data.wires??[]).map((w,i)=>({...w,id:w.id||'#'+(i+1)}));
 for(const w of nlWires){
  const d=drawn.get(w.id);
  if(!d){problem('hiányzó vezeték a rajzon: '+w.id+' ('+w.from+' → '+w.to+')');continue}
  if(d.from!==w.from||d.to!==w.to)problem(w.id+': a rajz '+d.from+' → '+d.to+' kapcsokat köt, a netlista '+w.from+' → '+w.to);
  if(d.net!==nets.get(w.from))problem(w.id+': data-net eltér a statikus hálózattól');
  const e=d.el,virtual=CONDUCTOR_CLASS[w.conductor]==='virtualis';
  if((e.attrs['data-role']??'')!==(w.role??''))problem(w.id+': a rajz szerepe ('+e.attrs['data-role']+') eltér a netlistáétól ('+w.role+')');
  if((e.attrs['data-color']??'')!==(w.color??''))problem(w.id+': a rajz színe ('+e.attrs['data-color']+') eltér a netlistáétól ('+w.color+')');
  if(!virtual){
   if(!COLORS.has(w.color??''))problem(w.id+': ismeretlen érszín '+w.color);
   if(!cls(e).includes(WIRE_CLASS[w.color??'']))problem(w.id+': az ér színosztálya ('+e.attrs.class+') nem a netlista színe ('+w.color+')');
   if(w.role&&ROLE_COLORS[w.role]&&!ROLE_COLORS[w.role].includes(w.color??''))problem(w.id+': a '+w.role+' szerepű ér nem lehet '+w.color);
   if(cls(e).filter(x=>/^kk-dg-w-(l[123]|n|pe)$/.test(x)).length!==1)problem(w.id+': pontosan egy érszín-osztály kell');
  }else if(!cls(e).some(x=>/^kk-dg-w-(inner|fault|touch)$/.test(x)))problem(w.id+': a nem valódi kapcsolat ('+w.conductor+') jelölése hiányzik');
  // A végpontok kapocsosztálya egyezik a vezető osztályával (a sim.py ROLE_CLASS szerint) – ez a szerepcsere mutációt is megfogja.
  const tcl=(k:string)=>{const r=c.terms.get(k)?.role??'';return c.kind==='earthing'?ROLE_CLASS_E[r]:ROLE_CLASS[r]};
  if(!virtual&&c.kind==='basic'&&CONDUCTOR_CLASS[w.conductor]&&(tcl(w.from)!==CONDUCTOR_CLASS[w.conductor]||tcl(w.to)!==CONDUCTOR_CLASS[w.conductor]))problem(w.id+': '+w.conductor+' vezető '+tcl(w.from)+'/'+tcl(w.to)+' szerepű kapcsokat köt');
 }
 for(const id of drawn.keys())if(!nlWires.some(w=>w.id===id))problem('a netlistában nem szereplő vezeték a rajzon: '+id);
 // Független összevetés a Python-szimulátor vezetéktáblájával (honnan, hová, vezető, szín – sorrendben, a valódi erekre).
 if(pyWires){
  const real=nlWires.filter(w=>CONDUCTOR_CLASS[w.conductor]!=='virtualis');
  if(real.length!==pyWires.length)problem('a valódi erek száma ('+real.length+') eltér a Python-vezetéktábláétól ('+pyWires.length+')');
  real.forEach((w,i)=>{const py=pyWires[i],d=drawn.get(w.id);if(!py||!d)return;
   const lab=(k:string)=>c.tlabel(k);
   if(lab(d.from)!==py.fromLabel||lab(d.to)!==py.toLabel)problem(w.id+': a rajz '+lab(d.from)+' → '+lab(d.to)+', a Python-vezetéktábla '+py.fromLabel+' → '+py.toLabel);
   if(d.el.attrs['data-color']!==py.color)problem(w.id+': a rajz színe '+d.el.attrs['data-color']+', a Python-vezetéktábláé '+py.color);
   if(!cls(d.el).includes(WIRE_CLASS[py.color]))problem(w.id+': a rajz érszín-osztálya nem a Python-vezetéktábla színe ('+py.color+')');
  });
 }
 // --- Geometria
 type Seg={a:Pt;b:Pt;net:string;owner:string};
 const segs:Seg[]=[];
 let crossings=0;
 for(const [id,d] of drawn){
  if(d.pts.length<2){problem(id+': legalább két pont kell');continue}
  for(const p of d.pts)if(!inside(p))problem(id+': a pont ('+p.join(',')+') kilóg a rajzból');
  const tf=term.get(d.from),tt=term.get(d.to);
  if(tf&&!same(d.pts[0],tf.at))problem(id+': a kezdőpont ('+d.pts[0].join(',')+') nem a(z) '+d.from+' kapocs ('+tf.at.join(',')+')');
  if(tt&&!same(d.pts[d.pts.length-1],tt.at))problem(id+': a végpont ('+d.pts[d.pts.length-1].join(',')+') nem a(z) '+d.to+' kapocs ('+tt.at.join(',')+')');
  for(let i=1;i<d.pts.length;i++){
   if(same(d.pts[i-1],d.pts[i]))problem(id+': nulla hosszú szakasz');
   segs.push({a:d.pts[i-1],b:d.pts[i],net:d.net,owner:id});
  }
  // A vezeték belseje (a két végpontján kívül) egyetlen kapcson sem halad át.
  for(const [k,t] of term){
   if(k===d.from&&same(t.at,d.pts[0])||k===d.to&&same(t.at,d.pts[d.pts.length-1]))continue;
   const hit=d.pts.slice(1,-1).some(p=>same(p,t.at))||d.pts.slice(1).some((p,i)=>interior(t.at,d.pts[i],p))||(k!==d.from&&same(t.at,d.pts[0]))||(k!==d.to&&same(t.at,d.pts[d.pts.length-1]));
   if(hit)problem(id+': a vezeték átfut a(z) '+k+' kapcson'+(nets.get(k)!==d.net?' (idegen hálózat!)':''));
  }
 }
 // Hidak (belső összeköttetés): a netlista hídjai, a kapcsokon át.
 const bridgeEls=els.filter(e=>e.attrs['data-bridge']);
 const nlBridges=[...c.comps.values()].flatMap(comp=>(comp.bridges??[]).map(g=>({comp:comp.id,terms:g.map(t=>tkey(comp.id,t))})));
 for(const b of nlBridges){
  const e=bridgeEls.find(x=>x.attrs['data-bridge']===b.comp&&x.attrs['data-terms']===b.terms.join(' '));
  if(!e){problem('hiányzó híd: '+b.comp+' '+b.terms.join(' '));continue}
  const ps=ptsOf(e);
  if(ps.length!==b.terms.length||ps.some((p,i)=>!term.get(b.terms[i])||!same(p,term.get(b.terms[i])!.at)))problem(b.comp+': a híd nem a kapcsokon át fut');
  for(let i=1;i<ps.length;i++)segs.push({a:ps[i-1],b:ps[i],net:nets.get(b.terms[0])!,owner:'híd:'+b.comp});
 }
 if(bridgeEls.length!==nlBridges.length)problem('a hidak száma ('+bridgeEls.length+') eltér a netlistáétól ('+nlBridges.length+')');
 // Két különböző hálózat: nem fedi és nem érinti egymást (csak valódi keresztezés megengedett).
 for(let i=0;i<segs.length;i++)for(let j=i+1;j<segs.length;j++){
  const s=segs[i],t=segs[j];if(s.net===t.net)continue;
  if(overlapLen(s.a,s.b,t.a,t.b)>EPS)problem(s.owner+' és '+t.owner+': két különböző hálózat vezetéke fedi egymást');
  else if(touching(s.a,s.b,t.a,t.b))problem(s.owner+' és '+t.owner+': két különböző hálózat vezetéke érintkezik (csomópontnak látszik)');
  else{
   // valódi keresztezés számlálása
   const o=(p:Pt,q:Pt,r:Pt)=>Math.sign((q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]));
   if(o(s.a,s.b,t.a)*o(s.a,s.b,t.b)<0&&o(t.a,t.b,s.a)*o(t.a,t.b,s.b)<0)crossings++;
  }
 }
 // Csomópontpöttyök: csak ott, ahol ugyanazon hálózat legalább három irányú ága találkozik (kapcson kívül); ott kötelező.
 const dotEls=els.filter(e=>e.attrs['data-junction']);
 const dots:Pt[]=dotEls.map(e=>[+e.attrs.cx,+e.attrs.cy]);
 const termPts=[...term.values()].map(t=>t.at);
 const branchPoints=(net:string)=>{
  const ss=segs.filter(s=>s.net===net),cand:Pt[]=[];
  for(const s of ss)for(const p of [s.a,s.b])if(!cand.some(q=>same(p,q)))cand.push(p);
  return cand.filter(p=>!termPts.some(t=>same(t,p))).filter(p=>{
   const dirs=new Set<string>();
   for(const s of ss){const add=(q:Pt)=>{const dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy);if(l>EPS)dirs.add((dx/l).toFixed(3)+','+(dy/l).toFixed(3))};if(same(s.a,p))add(s.b);else if(same(s.b,p))add(s.a);else if(interior(p,s.a,s.b)){add(s.a);add(s.b)}}
   return dirs.size>=3;
  });
 };
 const needed:Pt[]=[];for(const n of new Set(segs.map(s=>s.net)))needed.push(...branchPoints(n));
 for(const p of needed)if(!dots.some(d=>same(d,p)))problem('hiányzó csomópontpötty: '+p.join(','));
 for(const d of dots){
  if(!needed.some(p=>same(p,d)))problem('csomópontpötty nem valódi csomóponton: '+d.join(','));
  const touchNets=new Set(segs.filter(s=>same(s.a,d)||same(s.b,d)||interior(d,s.a,s.b)).map(s=>s.net));
  if(touchNets.size>1)problem('a csomópontpötty több hálózatot köt: '+d.join(','));
 }
 // Kapocsjel: kitöltött, ha legalább két ér (vezeték) csatlakozik.
 const count=new Map<string,number>();for(const w of nlWires){count.set(w.from,(count.get(w.from)??0)+1);count.set(w.to,(count.get(w.to)??0)+1)}
 for(const [k,t] of term)if(t.filled!==((count.get(k)??0)>=2))problem(k+': a kapocsjel '+(t.filled?'kitöltött':'üres')+', de '+(count.get(k)??0)+' vezeték csatlakozik');
 // Átfedő jelölések: a halo, a csíkozás és a PEN-végjelölés a saját vezetékén.
 for(const e of els.filter(x=>x.attrs['data-halo']||x.attrs['data-stripe']||x.attrs['data-gap'])){const id=e.attrs['data-halo']??e.attrs['data-stripe']??e.attrs['data-gap'],d=drawn.get(id);const ps=ptsOf(e);if(!d||ps.length!==d.pts.length||ps.some((p,i)=>!same(p,d.pts[i])))problem(id+': a halo/csíkozás/rés nem a vezetéken fut')}
 for(const e of els.filter(x=>x.attrs['data-cap'])){const d=drawn.get(e.attrs['data-cap']),[a,b]=ptsOf(e);const on=(q:Pt,s0:Pt,s1:Pt)=>same(q,s0)||same(q,s1)||interior(q,s0,s1);if(!d||!d.pts.slice(1).some((p,i)=>on(a,d.pts[i],p)&&on(b,d.pts[i],p))||!(same(a,d.pts[0])||same(a,d.pts[d.pts.length-1])))problem(e.attrs['data-cap']+': a PEN-végjelölés nem a vezeték végén van')}
 // Fekete ér: sötét témához világos halo; zöld-sárga: sárga csíkozás.
 for(const w of nlWires){if(w.color==='fekete'&&!els.some(e=>e.attrs['data-halo']===w.id))problem(w.id+': a fekete érhez nincs halo');if(w.color==='zöld-sárga'&&!els.some(e=>e.attrs['data-stripe']===w.id))problem(w.id+': a zöld-sárga érhez nincs csíkozás')}
 // Érintkezők: állásonként a netlista párjai, a csonkok belső végpontjai között; pontosan egy állás látható választónként.
 const stub=new Map<string,Pt>();
 for(const e of els.filter(x=>x.attrs['data-stub'])){const ps=ptsOf(e),k=e.attrs['data-stub'],t=term.get(k);if(t&&!same(ps[0],t.at))problem(k+': a csonk nem a kapocsból indul');stub.set(k,ps[ps.length-1])}
 const contactEls=els.filter(e=>e.attrs['data-sel']);
 let contacts=0;
 for(const sel of c.selectors){
  if(!sel.comp||!['kapcsolo-','kismegszakito','fi-rele','nyomogomb'].some(p=>(c.comps.get(sel.comp!)?.type??'').startsWith(p)))continue;
  const mine=contactEls.filter(e=>e.attrs['data-sel']===sel.id);
  const visible=new Set(mine.filter(e=>!cls(e).includes('is-off')).map(e=>e.attrs['data-state']));
  if(visible.size!==1||!visible.has(sel.states[0].name))problem(sel.id+': az alapállás ('+sel.states[0].name+') érintkezői látszanak, a többi rejtve ('+[...visible].join(',')+')');
  for(const st of sel.states){
   const pairs=mine.filter(e=>e.attrs['data-state']===st.name&&e.attrs['data-pair']).map(e=>({pair:e.attrs['data-pair'],pts:ptsOf(e)}));
   const want=(st.connect??[]).map(p=>tkey(sel.comp!,p[0])+' '+tkey(sel.comp!,p[1]));
   if(JSON.stringify(pairs.map(p=>p.pair).sort())!==JSON.stringify([...want].sort()))problem(sel.id+'/'+st.name+': a rajz érintkezői ('+pairs.map(p=>p.pair).join('; ')+') nem a netlista párjai ('+want.join('; ')+')');
   for(const p of pairs){const [a,b]=p.pair.split(' '),sa=stub.get(a),sb=stub.get(b);if(!sa||!sb||!same(p.pts[0],sa)||!same(p.pts[1],sb))problem(sel.id+'/'+st.name+': a(z) '+p.pair+' érintkező nem a két kapocs csonkját köti');contacts++}
   if(!(st.connect??[]).length&&!mine.some(e=>e.attrs['data-state']===st.name&&e.attrs['data-open']))problem(sel.id+'/'+st.name+': a nyitott állás érintkezője hiányzik');
   // Nyitott érintkező: nem köti össze a két csonkot (az emelő a forgópontnál maradhat, a nyomógomb hídja mindkettőtől elemelkedik).
   for(const e of mine.filter(x=>x.attrs['data-state']===st.name&&x.attrs['data-open'])){const [a,b]=e.attrs['data-open'].split(' '),ps=ptsOf(e),sa=stub.get(a)??[NaN,NaN] as Pt,sb=stub.get(b)??[NaN,NaN] as Pt;const at=(p:Pt)=>same(p,sa)?'a':same(p,sb)?'b':'';if(new Set(ps.map(at).filter(Boolean)).size>=2||ps.some((p,i)=>i>0&&(interior(sa,ps[i-1],p)&&(at(ps[i-1])==='b'||at(p)==='b')||interior(sb,ps[i-1],p)&&(at(ps[i-1])==='a'||at(p)==='a'))))problem(sel.id+'/'+st.name+': a nyitott érintkező zár ('+e.attrs['data-open']+')')}
  }
 }
 // Vezetékfeliratok: a szerep szerinti szöveg, a saját vezetékén (közelebb hozzá, mint bármely más hálózat vezetékéhez).
 const labels=els.filter(e=>e.tag==='text'&&e.attrs['data-for']&&drawn.has(e.attrs['data-for']));
 for(const w of nlWires){
  const want=expectedTag(w.conductor,w.label),lab=labels.filter(e=>e.attrs['data-for']===w.id);
  if(!want){if(lab.length)problem(w.id+': a nem valódi kapcsolatnak nincs felirata');continue}
  if(lab.length!==1){problem(w.id+': pontosan egy érfelirat kell ('+lab.length+')');continue}
  if(lab[0].text!==want)problem(w.id+': az érfelirat „'+lab[0].text+'”, a szerep szerint „'+want+'”');
  const at:Pt=[+lab[0].attrs.x,+lab[0].attrs.y+3],d=drawn.get(w.id)!;
  const own=Math.min(...d.pts.slice(1).map((p,i)=>distSeg(at,d.pts[i],p)));
  const other=Math.min(Infinity,...segs.filter(s=>s.net!==d.net).map(s=>distSeg(at,s.a,s.b)));
  if(own>6)problem(w.id+': az érfelirat nincs a vezetéken ('+own.toFixed(1)+')');
  if(other<own+0.5)problem(w.id+': az érfelirat közelebb van egy másik hálózat vezetékéhez');
 }
 // Feliratok: nem fedik egymást (becsült szövegdoboz).
 const boxes=els.filter(e=>e.tag==='text').map(e=>{const s=+(e.attrs['font-size']??11),w=e.text.length*s*0.56,x=+e.attrs.x,y=+e.attrs.y,anc=e.attrs['text-anchor']??'start';const x0=anc==='middle'?x-w/2:anc==='end'?x-w:x;return {t:e.text,x0,x1:x0+w,y0:y-s*0.78,y1:y+s*0.2}});
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];const ox=Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0),oy=Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0);if(ox>1.2&&oy>1.2)problem('egymást fedő feliratok: „'+a.t+'” és „'+b.t+'”')}
 for(const b of boxes)if(b.x0<vb[0]-1||b.x1>vb[0]+vb[2]+1||b.y0<vb[1]-1||b.y1>vb[1]+vb[3]+1)problem('a felirat kilóg a rajzból: „'+b.t+'”');
 // Olvashatóság keskeny képernyőn: 48rem alatt a rajz a min-width alá nem kicsinyedik (alatta a keret vízszintesen görget), így a
 // legkisebb felirat ott is legalább 10 px (a többi ábra mércéje 390 px-en – tests/kb-figures.mjs; a stíluslap .kk-dg-svg szabálya).
 const minW=+(root?.attrs.style?.match(/min-width:\s*([\d.]+)px/)?.[1]??0);
 const minFont=Math.min(...els.filter(e=>e.tag==='text').map(e=>+(e.attrs['font-size']??11)));
 if(vb[2]>0&&minW*minFont/vb[2]<10-EPS)problem('keskeny képernyőn a legkisebb felirat '+(minW*minFont/vb[2]).toFixed(1)+' px (10 px alatt) – az elrendezés minWidth-je legalább '+Math.ceil(vb[2]*10/minFont)+' legyen');
 return {problems:P,wires:drawn.size,terminals:term.size,dots:dots.length,crossings,bridges:bridgeEls.length,contacts};
}
