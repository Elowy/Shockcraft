// A bekötési ábra jelenete (tiszta modul, React nélkül): a netlista (lib/kb/circuit.ts) és az elrendezés
// (content/tudastar/diagramok/<id>.json → közzétételkor lib/kb/content/generated/diagrams) alapján a rajzelemek, a vezetékek (ér
// szerepe, színe, felirata, statikus hálózata), a kapocsjelek, a csomópontpöttyök, a jelmagyarázat, a szöveges leírás és a Működés
// nézet állapottáblája. Ugyanebből készül az SVG (bekotes.tsx), a lektori csomag PDF-ábrája és a rajz = netlista teszt.
//
// RAJZ = NETLISTA: a vezetékek útvonalát az elrendezés pontosan (a végpontokkal együtt) rögzíti, a jelenet NEM igazítja a kapcsokhoz.
// Így egy kapocs vagy egy útvonal téves megadása nem „javul ki” észrevétlenül: a tests/kb-diagram.ts a kirajzolt SVG-ből visszafejti
// az összeköttetéseket, és a netlistával (valamint a Python-szimulátor vezetéktáblájával) veti össze.
import {CONDUCTOR_CLASS,loadNetlist,runNetlist,simulate,staticNets,tkey,wireTable,type Circuit,type Combo,type Netlist,type NlComponent,type NlOutputs,type NlWire,type WireRow} from '@/lib/kb/circuit';
import {P,arc,primCircle,primLine,primPoly,primRect,primText,symbolOf,type DgPart,type Prim,type Pt} from './symbols';

export const LAYOUT_FORMAT='kb-diagram/1';
/** Az elrendezés (content/tudastar/diagramok/<id>.json). */
export type DgLayout={
 format:string;id:string;netlist:string;
 /** Annak a netlistának az ujjlenyomata, amelyhez az elrendezés készült (eltérésnél a rajzot újra kell nézni). */
 fingerprint:string;
 viewBox:readonly [number,number,number,number];
 /** A legkisebb megjelenítési szélesség (px): keskenyebb képernyőn az ábra a keretén belül vízszintesen görgethető. */
 minWidth:number;
 parts:Readonly<Record<string,DgPart>>;
 /** Vezetékenként a teljes útvonal (a két végpont a két kapocs helye) – kötelező minden netlistavezetékhez. */
 wires:Readonly<Record<string,readonly Pt[]>>;
 /** A vezetékfeliratok helye (alapból a leghosszabb szakasz közepe). */
 labels?:Readonly<Record<string,Pt>>;
 /** Érintési pontok (földelési netlisták) nyílútvonala (alapból egyenes a két pont között) és a felirat helye. */
 touch?:Readonly<Record<string,{pts:readonly Pt[];at:Pt}>>;
 /** Helyek (kötődoboz, elosztó, épület, fogyasztó) kerete és felirata, ha nem egy alkatrész doboza. */
 places?:readonly {x:number;y:number;w:number;h:number;label:string;at:Pt;anchor?:'start'|'middle'|'end';lines?:readonly string[]}[];
 /** Kiegészítő feliratok (pl. „Innen külön N és PE – újra nem köthető össze”). */
 notes?:readonly {at:Pt;text:string;anchor?:'start'|'middle'|'end';cls?:string}[];
};

export type WireKind='er'|'belso'|'hibahely'|'erintes';
export type SceneWire={id:string;from:string;to:string;net:string;conductor:string;color:string;role:string;kind:WireKind;
 cls:string;pts:readonly Pt[];label?:{text:string;at:Pt};section?:string};
export type SceneTerm={key:string;at:Pt;net:string;wires:number;label?:{text:string;at:Pt;anchor:'start'|'middle'|'end'}};
export type LegendItem={tag:string;color:string;cls:string;text:string};
export type DiagramState={key:string;states:Combo;cur:string[];live:string[];broken:string[];on:string[];text:string[]};
export type Scene={
 id:string;title:string;viewBox:readonly [number,number,number,number];minWidth:number;
 parts:{id:string;prims:Prim[];contacts:Prim[]}[];wires:SceneWire[];terminals:SceneTerm[];dots:Pt[];
 bridges:{comp:string;terms:string[];pts:Pt[]}[];touches:{id:string;label:string;pts:readonly Pt[];at:Pt}[];texts:Prim[];
 /** Helyek (kötődoboz-, kapcsolódoboz-, épület-) keretei: szaggatott téglalap, a rajz legalsó rétege. */
 frames:Prim[];
 legend:LegendItem[];desc:string;
 /** A Működés nézet: választók (gombok) és állapotonként a kiemelendő vezetékek, a működő elemek és a szöveges állapot. */
 selectors:{id:string;label:string;scenario:boolean;states:{name:string;label:string;pressed:boolean}[]}[];
 states:DiagramState[];
 /** Az alapállás (minden választó az első állásában) – a Bekötés nézet ezt mutatja. */
 initial:Combo;
};

// ---------------------------------------------------------------- Vezetékek: szín, felirat, jelmagyarázat
/** Netlistaszín → ér-osztály (a kezikonyv.css ér-tokenjei: barna = L1, fekete = L2, szürke = L3, kék = N, zöld-sárga = PE). */
export const COLOR_CLS:Readonly<Record<string,string>>={barna:'w-l1',fekete:'w-l2',szürke:'w-l3',kék:'w-n','zöld-sárga':'w-pe'};
const MEANING:Readonly<Record<string,string>>={L:'fázis',L1:'L1 fázis',L2:'L2 fázis',L3:'L3 fázis',N:'nullavezető',PE:'védővezető',PEN:'PEN-vezető (védő- és nullavezető)',
 'kapcsolt fázis':'kapcsolt fázis','kapcsolt nulla':'kapcsolt nullavezető','váltóvezeték':'váltóvezeték','áthidaló':'áthidaló (fázis)','földelővezető':'földelővezető','EPH-vezető':'EPH-vezető (egyenpotenciálra hozó)'};
/** Az ér felirata a rajzon (a szín sosem az egyetlen jel): L, N, PE, PEN, L1–L3; kapcsolt fázis: Lk(+szám); kapcsolt nulla: Nk;
 * váltóvezeték: a száma; földelővezető: FV; EPH-vezető: EPH. A nem valódi kapcsolatok (belső, hibahely, érintés) felirat nélkül. */
export function wireTag(w:NlWire):string{
 const c=w.conductor,lab=(w.label??'').trim();
 if(CONDUCTOR_CLASS[c]==='virtualis')return '';
 if(c==='kapcsolt fázis')return 'Lk'+(/^\d+$/.test(lab)?lab:'');
 if(c==='kapcsolt nulla')return 'Nk';
 if(c==='váltóvezeték')return lab||'V';
 if(c==='áthidaló')return 'L';
 if(c==='földelővezető')return 'FV';
 if(c==='EPH-vezető')return 'EPH';
 return c;
}
export const wireKind=(w:NlWire):WireKind=>w.conductor==='belső'?'belso':w.conductor==='hibahely'?'hibahely':w.conductor==='érintés'?'erintes':'er';

/** A szakasz leghosszabb darabjának közepe (a felirat alapértelmezett helye; a vízszintes szakaszt előnyben részesíti). */
function labelSpot(pts:readonly Pt[]):Pt{
 let best=0,at:Pt=pts[0];
 for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],len=Math.hypot(b[0]-a[0],b[1]-a[1])*(Math.abs(a[1]-b[1])<0.01?1.3:1);if(len>best){best=len;at=P((a[0]+b[0])/2,(a[1]+b[1])/2)}}
 return at;
}

// ---------------------------------------------------------------- Csomópontpöttyök
const key=(p:Pt)=>p[0].toFixed(1)+','+p[1].toFixed(1);
const near=(a:Pt,b:Pt)=>Math.abs(a[0]-b[0])<0.05&&Math.abs(a[1]-b[1])<0.05;
/** A p pont a szakasz belsejében van-e (a végpontokat nem számítva). */
export function onSegment(p:Pt,a:Pt,b:Pt,eps=0.05):boolean{
 const cross=(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);
 const len=Math.hypot(b[0]-a[0],b[1]-a[1]);
 if(len<eps||Math.abs(cross)/len>eps)return false;
 const t=((p[0]-a[0])*(b[0]-a[0])+(p[1]-a[1])*(b[1]-a[1]))/(len*len);
 return t>eps/len&&t<1-eps/len;
}
/** Egy hálózat szakaszaiból azok a (kapcson kívüli) pontok, ahol legalább három különböző irányú ág találkozik: ide csomópontpötty kell. */
export function junctionPoints(segs:readonly [Pt,Pt][],terminals:readonly Pt[]):Pt[]{
 const cand=new Map<string,Pt>();
 for(const [a,b] of segs){cand.set(key(a),a);cand.set(key(b),b)}
 const out:Pt[]=[];
 for(const p of cand.values()){
  if(terminals.some(t=>near(t,p)))continue;
  const dirs=new Set<string>();
  for(const [a,b] of segs){
   const add=(q:Pt)=>{const dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy);if(l>0.05)dirs.add((dx/l).toFixed(3)+','+(dy/l).toFixed(3))};
   if(near(a,p))add(b);else if(near(b,p))add(a);else if(onSegment(p,a,b)){add(a);add(b)}
  }
  if(dirs.size>=3)out.push(p);
 }
 return out.sort((x,y)=>x[0]-y[0]||x[1]-y[1]);
}

// ---------------------------------------------------------------- Állapotszövegek (a sim.py szóhasználatával)
const WORDS={
 lampa:['ég','nem ég'],fogyaszto:['működik','nem működik'],dugalj:['feszültség alatt','nem ad feszültséget'],ember:['áram folyik át rajta','nem folyik áram'],hibaut:['hibaáram folyik','nincs hibaáram'],
 consumers:{mukodik:'működik',rendellenes:'rendellenesen (a földön át)','nem-mukodik':'nem működik'} as Record<string,string>,
 loops:{'nincs-hiba':'nincs hiba',femes:'fémes hurok','fold':'a földön át','nincs-hurok':'nincs zárt hurok'} as Record<string,string>,
 touch:{nincs:'nincs veszély',lekapcsolasig:'veszélyes lehet a lekapcsolásig',erintesre:'veszélyes lehet, tartósan; a FI-relé legfeljebb a testen átfolyó áramra old ki',tartosan:'veszélyes lehet, tartósan'} as Record<string,string>,
} as const;
const nameOf=(c:NlComponent|undefined,id:string)=>c?.outputLabel??c?.short??c?.label??id;
/** Egy állás szöveges összegzése (aria-live): fogyasztók, dugaljak, hibahelyek, érintések, védelmek. */
export function stateText(c:Circuit,out:NlOutputs):string[]{
 const lines:string[]=[],comp=(id:string)=>c.comps.get(id);
 if(c.kind==='earthing'){
  for(const [id,v] of Object.entries(out.consumers??{}))lines.push(nameOf(comp(id),id)+': '+(WORDS.consumers[v]??v));
 }else for(const [id,v] of Object.entries(out.lamps??{})){const t=comp(id)?.type==='lampa'?WORDS.lampa:WORDS.fogyaszto;lines.push(nameOf(comp(id),id)+': '+(v?t[0]:t[1]))}
 for(const [id,v] of Object.entries(out.outlets??{}))lines.push(nameOf(comp(id),id)+': '+(v?WORDS.dugalj[0]:WORDS.dugalj[1]));
 for(const [id,v] of Object.entries(out.currents??{})){const t=comp(id)?.type==='ember'?WORDS.ember:WORDS.hibaut;lines.push(nameOf(comp(id),id)+': '+(v?t[0]:t[1]))}
 for(const [id,v] of Object.entries(out.loops??{}))lines.push(nameOf(comp(id),id)+': '+(WORDS.loops[v]??v));
 for(const [id,v] of Object.entries(out.overcurrent??{}))lines.push((comp(id)?.short??id)+' túláramvédelem: '+(v?'lekapcsolhat':'nem kapcsol le'));
 for(const [id,v] of Object.entries(out.trips??{}))lines.push((comp(id)?.short??id)+' FI-relé: '+(v?'kiold':'nem old ki'));
 for(const [id,v] of Object.entries(out.imd??{}))lines.push((comp(id)?.short??id)+': '+(v?'jelez':'nem jelez'));
 const touches=c.data.touch??[];
 for(const [id,v] of Object.entries(out.touch??{}))lines.push('Érintés – '+(touches.find(t=>t.id===id)?.label??id)+': '+(WORDS.touch[v]??v));
 return lines;
}
/** Egy választóállás felirata: „név (felirat)”, ha a netlista ad feliratot (a sim.py state_cell-je). */
export const stateLabel=(s:{name:string;label?:string})=>s.label?s.name+' ('+s.label+')':s.name;

// ---------------------------------------------------------------- Jelenet
export function buildScene(netlist:Netlist,layout:DgLayout):Scene{
 const c=loadNetlist(netlist),rep=runNetlist(c);
 if(!rep.pass)throw new Error(netlist.id+': a netlista szimulációja hibás – ábra nem készülhet ('+rep.errors.slice(0,3).join('; ')+')');
 const earthing=c.kind==='earthing',nets=staticNets(c);
 const termPt=(k:string):Pt=>{const [cid,tid]=[k.slice(0,k.indexOf('.')),k.slice(k.indexOf('.')+1)],p=layout.parts[cid]?.terms[tid];if(!p)throw new Error(layout.id+': nincs helye a kapocsnak: '+k);return p};
 // Alkatrészek
 const parts:Scene['parts']=[];
 const texts:Prim[]=[];
 for(const comp of c.comps.values()){
  const part=layout.parts[comp.id];
  if(!part)throw new Error(layout.id+': nincs helye az alkatrésznek: '+comp.id);
  for(const t of comp.terminals)termPt(tkey(comp.id,t.id));
  for(const tid of Object.keys(part.terms))if(!comp.terminals.some(t=>t.id===tid))throw new Error(layout.id+': ismeretlen kapocs az elrendezésben: '+comp.id+'.'+tid);
  const sym=symbolOf({comp,part,term:tid=>termPt(tkey(comp.id,tid))},earthing);
  parts.push({id:comp.id,prims:sym.prims.map(p=>({...p,data:{...p.data,part:comp.id}})),contacts:sym.contacts});
  if(part.label){
   const lines=part.label.lines??[comp.label??comp.id];
   lines.forEach((s,i)=>texts.push(primText(P(part.label!.at[0],part.label!.at[1]+i*13),s,part.label!.anchor??'middle',11.5,'t-part',{label:comp.id})));
  }
 }
 // Vezetékek
 const wires:SceneWire[]=[];
 const real=new Set<string>();
 (c.data.wires??[]).forEach((w,i)=>{
  const id=w.id||'#'+(i+1),pts=layout.wires[id];
  if(!pts||pts.length<2)throw new Error(layout.id+': nincs útvonala a vezetéknek: '+id);
  const kind=wireKind(w),tag=wireTag(w);
  const cls=kind==='er'?COLOR_CLS[w.color??'']:kind==='hibahely'?'w-fault':kind==='erintes'?'w-touch':'w-inner';
  if(!cls)throw new Error(layout.id+': ismeretlen érszín: '+w.color);
  if(kind==='er')real.add(id);
  wires.push({id,from:w.from,to:w.to,net:nets.get(w.from)!,conductor:w.conductor+(w.label?' '+w.label:''),color:w.color??'',role:w.role??'',kind,cls,pts,
   ...(tag?{label:{text:tag,at:layout.labels?.[id]??labelSpot(pts)}}:{}),...(w.section?{section:w.section}:{})});
 });
 for(const id of Object.keys(layout.wires))if(!wires.some(w=>w.id===id))throw new Error(layout.id+': fölösleges útvonal (nincs ilyen vezeték): '+id);
 // Kapocsjelek: kitöltött, ha legalább két vezeték csatlakozik (csomópont a kapcson), különben üres kör.
 const count=new Map<string,number>();
 for(const w of wires){count.set(w.from,(count.get(w.from)??0)+1);count.set(w.to,(count.get(w.to)??0)+1)}
 const terminals:SceneTerm[]=[];
 for(const comp of c.comps.values()){
  const part=layout.parts[comp.id];
  for(const t of comp.terminals){
   const k=tkey(comp.id,t.id),at=termPt(k),side=part.sides?.[t.id]??part.side??'left';
   const text=part.tt?.[t.id]??t.id,spot=part.tl?.[t.id];
   let label:SceneTerm['label'];
   if(text){
    if(spot&&!Array.isArray(spot)){const s=spot as {at:Pt;anchor?:'start'|'middle'|'end'};label={text,at:s.at,anchor:s.anchor??'middle'}}
    else if(spot)label={text,at:spot as Pt,anchor:'middle'};
    // A fémtest PE-kapcsánál a felirat a védőföldelés-csonk fölé kerül (a csonk a kapocstól vízszintesen indul).
    else if(t.role==='PE'&&(comp.type==='lampa'||comp.type==='fogyaszto')&&(side==='left'||side==='right'))label={text,at:P(at[0]+(side==='left'?5:-5),at[1]-4),anchor:side==='left'?'start':'end'};
    else if((side==='top'||side==='bottom')&&(comp.type==='lampa'||comp.type==='fogyaszto'))label={text,at:P(at[0]+4,side==='top'?at[1]+12:at[1]-5),anchor:'start'};
    else label=side==='right'?{text,at:P(at[0]-5,at[1]+4),anchor:'end'}:side==='left'?{text,at:P(at[0]+5,at[1]+4),anchor:'start'}:side==='top'?{text,at:P(at[0],part.y+part.h-4),anchor:'middle'}:side==='bottom'?{text,at:P(at[0],part.y+9),anchor:'middle'}:{text,at:P(at[0],at[1]-6),anchor:'middle'};
   }
   if(part.tt&&part.tt[t.id]==='')label=undefined;
   terminals.push({key:k,at,net:nets.get(k)!,wires:count.get(k)??0,...(label?{label}:{})});
  }
 }
 // Belső összeköttetések (hidak): vastag sáv a kapcsokon át, a kapcsok sorrendjében.
 const bridges:Scene['bridges']=[];
 for(const comp of c.comps.values())for(const g of comp.bridges??[]){const terms=g.map(t=>tkey(comp.id,t));bridges.push({comp:comp.id,terms,pts:terms.map(termPt)})}
 // Csomópontpöttyök hálózatonként (a kapcsokon kívül, ahol legalább három irányú ág találkozik).
 const dots:Pt[]=[];
 const termPts=terminals.map(t=>t.at);
 for(const net of new Set(wires.map(w=>w.net))){
  const segs:[Pt,Pt][]=[];
  for(const w of wires.filter(x=>x.net===net))for(let i=1;i<w.pts.length;i++)segs.push([w.pts[i-1],w.pts[i]]);
  for(const b of bridges.filter(x=>nets.get(x.terms[0])===net))for(let i=1;i<b.pts.length;i++)segs.push([b.pts[i-1],b.pts[i]]);
  dots.push(...junctionPoints(segs,termPts));
 }
 // Érintési pontok (földelési netlisták): szaggatott kettős nyíl a két pont között.
 const touches=(c.data.touch??[]).map(t=>{const l=layout.touch?.[t.id];const pts=l?.pts??[termPt(t.a),termPt(t.b)];return {id:t.id,label:t.id,pts,at:l?.at??labelSpot(pts)}});
 const frames:Prim[]=[];
 for(const p of layout.places??[]){
  frames.push(primRect(p.x,p.y,p.w,p.h,'sym-place',5));
  (p.lines??[p.label]).forEach((s,i)=>texts.push(primText(P(p.at[0],p.at[1]+i*12),s,p.anchor??'start',11,'t-place')));
 }
 for(const n of layout.notes??[])texts.push(primText(n.at,n.text,n.anchor??'start',10.5,n.cls??'t-note'));
 // Jelmagyarázat (a valódi erekből, a netlista sorrendjében; a nem valódi kapcsolatok külön).
 const legend:LegendItem[]=[];
 for(const w of c.data.wires??[]){
  const kind=wireKind(w);
  if(kind==='er'){
   const tag=wireTag(w),cond=w.conductor,meaning=MEANING[cond]??cond;
   const ex=legend.find(l=>l.text===meaning&&l.color===(w.color??''));
   if(ex){if(!ex.tag.split(', ').includes(tag))ex.tag+=', '+tag}else legend.push({tag,color:w.color??'',cls:COLOR_CLS[w.color??''],text:meaning});
  }else{
   const text=kind==='belso'?'készüléken belüli kötés (nem szerelt ér)':kind==='hibahely'?'jelképes hibahely (nem szerelt ér)':'érintési pont (nem szerelt ér)';
   if(!legend.some(l=>l.text===text))legend.push({tag:'',color:'',cls:kind==='belso'?'w-inner':kind==='hibahely'?'w-fault':'w-touch',text});
  }
 }
 // Szöveges leírás (az SVG <desc>): alkatrészek és szakaszonként az erek.
 const comps=[...c.comps.values()].filter(x=>x.type!=='fold').map(x=>x.label??x.id);
 const secs=rep.sections.map(s=>s.label+': '+s.conductors.join(', ')+' ('+s.count+' ér)');
 const desc='Bekötési rajz: '+c.data.title+'. Alkatrészek: '+comps.join('; ')+'.'+(secs.length?' Szakaszok: '+secs.join('; ')+'.':'')+' A teljes összeköttetés-lista a vezetéktáblában.';
 // Működés: választók és állapotonként a kiemelés.
 const selectors=c.selectors.map(s=>{
  const type=s.comp?c.comps.get(s.comp)?.type??'':'';
  // „Benyomott” (aria-pressed) állás: hibahelyzetnél/érintésnél a fennálló (active), védelmi készüléknél és nyomógombnál a zárt,
  // szakadásnál a szakadt, kapcsolónál az átbillentett (nem alap-) állás.
  const pressed=(x:typeof s.states[number],i:number)=>s.states.some(y=>y.active!==undefined)?!!x.active:['kismegszakito','fi-rele','nyomogomb'].includes(type)?(x.connect??[]).length>0:x.broken!==undefined||s.states.some(y=>y.broken)?!!x.broken:i===1;
  return {id:s.id,label:s.label,scenario:!!(s.scenario??(s.comp?['ember','hibaut'].includes(type)||!!c.comps.get(s.comp)?.scenario:true)),states:s.states.map((x,i)=>({name:x.name,label:stateLabel(x),pressed:pressed(x,i)}))};
 });
 const states:DiagramState[]=c.combos().map(combo=>{
  const sim=simulate(c,combo),inNet=(sets:string[][])=>{const s=new Set(sets.flat());return wires.filter(w=>s.has(w.from)&&s.has(w.to)).map(w=>w.id)};
  const broken=(c.data.breaks??[]).filter(b=>b.states.find(s=>s.name===combo[b.id])?.broken).map(b=>b.wire);
  const out=sim.outputs,on=[...Object.entries(out.lamps??{}),...Object.entries(out.outlets??{}),...Object.entries(out.currents??{})].filter(([,v])=>v).map(([k])=>k);
  for(const [k,v] of Object.entries(out.trips??{}))if(v)on.push(k+':kiold');
  return {key:c.selectors.map(s=>combo[s.id]).join('|'),states:combo,cur:sim.currentWires.filter(w=>!broken.includes(w)),live:inNet(sim.live).filter(w=>!broken.includes(w)),broken,on,text:stateText(c,out)};
 });
 return {id:c.data.id,title:c.data.title,viewBox:layout.viewBox,minWidth:layout.minWidth,parts,wires,terminals,dots,bridges,touches,texts,frames,legend,desc,selectors,states,
  initial:Object.fromEntries(c.selectors.map(s=>[s.id,s.states[0].name]))};
}

/** A PEN-vezető kék végjelölése: a két végén egy-egy rövid kék szakasz (a netlista színe zöld-sárga). */
function capsOf(w:SceneWire):Prim[]{
 if(!/^PEN\b/.test(w.conductor))return [];
 const seg=(a:Pt,b:Pt)=>{const l=Math.hypot(b[0]-a[0],b[1]-a[1]),t=Math.min(1,7/Math.max(l,0.01));return [a,P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t)] as [Pt,Pt]};
 const n=w.pts.length,[a0,a1]=seg(w.pts[0],w.pts[1]),[b0,b1]=seg(w.pts[n-1],w.pts[n-2]);
 return [primLine(a0,a1,'w-cap',{cap:w.id}),primLine(b0,b1,'w-cap',{cap:w.id})];
}
/**
 * Az ábra rajzelemei egy listában (az SVG, a PDF és a teszt ezt használja), rétegsorrendben: alkatrészek, vezetékek (a fekete és a barna ér alatt
 * sötét témában világos halo, a zöld-sárga ér fölött sárga csíkozás, a PEN végein kék jelölés), hidak, érintkezők, érintési nyilak,
 * kapcsok, csomópontpöttyök, feliratok. `contacts`: 'all' – minden állás érintkezője (a nem aktív „is-off” osztállyal, a Működés nézet
 * váltja); 'state' – csak a megadott állásé (PDF).
 */
export function scenePrims(s:Scene,{contacts='all',combo=s.initial,state}:{contacts?:'all'|'state';combo?:Combo;state?:DiagramState}={}):Prim[]{
 if(state)combo=state.states;
 const cur=new Set(state?.cur??[]),live=new Set(state?.live??[]),broken=new Set(state?.broken??[]),on=new Set(state?.on??[]);
 // Működés nézet: az áramút erei „is-cur”, a fázis alatt álló erek „is-live”, a szakadt ér „is-broken”, a működő fogyasztó „is-on”.
 const mark=(id:string)=>!state?'':cur.has(id)?' is-cur':broken.has(id)?' is-broken':live.has(id)?' is-live':'';
 const markOut=(p:Prim):Prim=>state&&p.data?.out&&on.has(p.data.out)?{...p,cls:p.cls+' is-on'}:p;
 const out:Prim[]=[...s.frames];
 for(const p of s.parts)out.push(...p.prims.map(markOut));
 for(const w of s.wires){
  const data={wire:w.id,net:w.net,from:w.from,to:w.to,role:w.role,color:w.color,kind:w.kind},m=mark(w.id);
  // Minden valódi ér alatt háttérszínű sáv: a később rajzolt ér így megszakítja a korábbit a keresztezésnél (nem csomópont).
  if(w.kind==='er')out.push(primPoly(w.pts,'w-gap',false,{gap:w.id}));
  if(w.cls==='w-l2'||w.cls==='w-l1')out.push(primPoly(w.pts,'w-halo'+m,false,{halo:w.id}));
  out.push(primPoly(w.pts,'w '+w.cls+m,false,data));
  if(w.cls==='w-pe')out.push(primPoly(w.pts,'w-pes'+m,false,{stripe:w.id}));
  out.push(...capsOf(w));
 }
 for(const b of s.bridges)out.push(primPoly(b.pts,'bridge',false,{bridge:b.comp,terms:b.terms.join(' ')}));
 for(const p of s.parts)for(const ct of p.contacts){
  const sel=ct.data?.sel,on=!!sel&&combo[sel]===ct.data?.state;
  if(contacts==='state'&&!on)continue;
  out.push(on||contacts==='state'?ct:{...ct,cls:ct.cls+' is-off'});
 }
 for(const t of s.touches){
  out.push(primPoly(t.pts,'touch',false,{touch:t.id}));
  const head=(a:Pt,b:Pt)=>{const ang=Math.atan2(b[1]-a[1],b[0]-a[0]),s2=5;return primPoly([P(b[0]-s2*Math.cos(ang-0.45),b[1]-s2*Math.sin(ang-0.45)),b,P(b[0]-s2*Math.cos(ang+0.45),b[1]-s2*Math.sin(ang+0.45))],'touch-head')};
  const n=t.pts.length;out.push(head(t.pts[1],t.pts[0]),head(t.pts[n-2],t.pts[n-1]));
  out.push(primText(t.at,t.label,'start',10.5,'t-touch',{for:t.id}));
 }
 for(const t of s.terminals)out.push(primCircle(t.at,2.6,t.wires>=2?'term-j':'term',{term:t.key,net:t.net}));
 for(const d of s.dots)out.push(primCircle(d,3,'dot',{junction:key(d)}));
 for(const w of s.wires)if(w.label)out.push(primText(P(w.label.at[0],w.label.at[1]-3),w.label.text,'middle',10.5,'t-wire t-'+w.cls,{for:w.id}));
 for(const t of s.terminals)if(t.label)out.push(primText(t.label.at,t.label.text,t.label.anchor,10,'t-term',{for:t.key}));
 out.push(...s.texts);
 return out;
}
export {primLine,arc};
export type {WireRow};
export {wireTable};
