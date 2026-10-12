// RAJZ = NETLISTA (docs/tudastar.md „Sémák és ábramotor”, docs/tudastar-terv.md 3.4): a 20 bekötési ábra kirajzolt SVG-jét
// (renderToStaticMarkup) visszafejtjük, és összevetjük a netlistával, valamint a Python-szimulátor vezetéktáblájával:
//  1. minden netlistának van naprakész elrendezése (content/tudastar/diagramok/<id>.json, a netlista ujjlenyomatára szólóan),
//  2. a Bekötés nézet: a data-* attribútumok ÉS a geometria (vezetékvégpont a kapocs körén, csomópontpötty csak valódi csomóponton
//     és ott kötelező, egy vezeték nem fut át más kapcson, két hálózat vezetéke nem fedi és nem érinti egymást, érszín-osztály = a
//     netlista színe, a szerep és a szín összeillik, minden éren a szerep szerinti felirat, az érintkezők a netlista párjai) –
//     scripts/kb-content/diagram-check.ts,
//  3. a Működés nézet: minden állásban a kiemelt áramút, a feszültség alatti és a szakadt erek, valamint a működő fogyasztók a
//     szimuláció (lib/kb/circuit.ts simulate) szerint – a tesztben függetlenül újraszámolva –, és az SVG osztályai ezt mutatják,
//  4. a figura (DiagramFigure): nézetváltó (tablist), kapcsológombok aria-pressed-del, aria-live állapot, kapcsolóállás-táblázat minden
//     állással, vezetéktábla minden érrel, jelmagyarázat, „Így látod a tervezőben”, nincs `hidden` attribútum (osztállyal rejt),
//  5. MUTÁCIÓS PRÓBA: a netlistában vagy az elrendezésben felcserélt / áthelyezett kapocs, felcserélt szerep vagy útvonal, illetve a
//     kirajzolt SVG elrontott színe, végpontja, csomópontja, érintkezője vagy felirata – a teszt mindet kiszűri (vagy a szimuláció
//     már az ábra elkészítése előtt megbukik),
//  6. az ábra ujjlenyomata (scripts/kb-content/diagrams.ts) a netlista, az elrendezés, a rajzoló modulok és a stíluslap ér- és
//     ábraszabályainak bármely változására megváltozik,
//  7. az ér-tokenek kontrasztja világos és sötét témában is legalább 3:1 a háttérhez (a fekete ér sötét témában világos halóval).
// Futtatás: node --no-warnings --import tsx tests/kb-diagram.ts
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ROLE_CLASS,ROLE_CLASS_E,loadNetlist,netlistFingerprint,runNetlist,simulate,tkey,wireTable,type Netlist} from '../lib/kb/circuit';
import {buildScene,type DgLayout,type Scene} from '../components/kezikonyv/diagram/scene';
import {BekotesSvg} from '../components/kezikonyv/diagram/bekotes';
import {DiagramFigure} from '../components/kezikonyv/diagram/diagram-figure';
import {checkDiagramSvg,parseSvg} from '../scripts/kb-content/diagram-check';
import {DIAGRAM_RENDERER,LAYOUT_DIR,NETLIST_DIR,diagramCss,diagramFiles,diagramSource,netlistFiles,rendererFiles} from '../scripts/kb-content/diagrams';
import {FIG_CSS} from '../scripts/kb-content/figures';

const ROOT=process.cwd();
const ref=JSON.parse(readFileSync('tests/fixtures/kb-circuit-reference.json','utf8')) as {netlists:{file:string;wires:{fromLabel:string;toLabel:string;conductor:string;color:string}[]}[]};
const clone=<T,>(x:T):T=>JSON.parse(JSON.stringify(x)) as T;
const svgOf=(scene:Scene,state?:Scene['states'][number])=>renderToStaticMarkup(createElement(BekotesSvg,{scene,uid:'t',title:scene.title,...(state?{state,view:'mukodes' as const}:{})}));

// ------------------------------------------------------------------ 1. Elrendezések
const files=netlistFiles(ROOT);
assert.equal(files.length,20,'20 netlista');
const layouts=readdirSync(LAYOUT_DIR).filter(f=>f.endsWith('.json')).sort();
const all=files.map(f=>diagramFiles(ROOT,f));
assert.deepEqual(layouts,all.map(d=>d.netlist.id+'.json').sort(),'minden netlistának pontosan egy elrendezése van, fölösleges elrendezés nincs');
for(const d of all)assert.equal(d.layout.fingerprint,netlistFingerprint(d.netlist),d.layoutPath+': a netlista ujjlenyomatára szól');

// ------------------------------------------------------------------ 2–3. Bekötés és Működés
let wires=0,terms=0,dots=0,crossings=0,contacts=0,stateCount=0;
const scenes=new Map<string,{d:typeof all[number];scene:Scene}>();
for(const d of all){
 const scene=buildScene(d.netlist,d.layout);scenes.set(d.file,{d,scene});
 const py=ref.netlists.find(n=>n.file===d.file)!.wires;
 const rep=checkDiagramSvg(svgOf(scene),d.netlist,py);
 assert.deepEqual(rep.problems,[],d.file+': a rajz eltér a netlistától:\n'+rep.problems.join('\n'));
 assert.equal(rep.wires,d.netlist.wires.length);
 assert.equal(rep.terminals,d.netlist.components.reduce((n,c)=>n+c.terminals.length,0));
 wires+=rep.wires;terms+=rep.terminals;dots+=rep.dots;crossings+=rep.crossings;contacts+=rep.contacts;
 // Működés: állásonként a szimuláció szerint (függetlenül újraszámolva).
 const c=loadNetlist(d.netlist);
 assert.equal(scene.states.length,runNetlist(c).combinations,d.file+': minden állás');
 const ids=(d.netlist.wires).map((w,i)=>({...w,id:w.id||'#'+(i+1)}));
 for(const st of scene.states){
  const sim=simulate(c,st.states);
  const inSets=(sets:string[][])=>{const s=new Set(sets.flat());return ids.filter(w=>s.has(w.from)&&s.has(w.to)).map(w=>w.id)};
  const broken=(d.netlist.breaks??[]).filter(b=>b.states.find(x=>x.name===st.states[b.id])?.broken).map(b=>b.wire);
  assert.deepEqual([...st.cur].sort(),sim.currentWires.filter(w=>!broken.includes(w)).sort(),d.file+' '+st.key+': az áramút');
  const curNets=new Set(inSets(sim.current));
  for(const w of st.cur)assert.ok(curNets.has(w),d.file+' '+st.key+': '+w+' áramút-ér, de a hálózata nem visz áramot');
  assert.deepEqual([...st.live].sort(),inSets(sim.live).filter(w=>!broken.includes(w)).sort(),d.file+' '+st.key+': a feszültség alatti erek');
  assert.deepEqual([...st.broken].sort(),[...broken].sort(),d.file+' '+st.key+': a szakadt erek');
  const out=sim.outputs,want=new Set([...Object.entries(out.lamps??{}),...Object.entries(out.outlets??{}),...Object.entries(out.currents??{})].filter(([,v])=>v).map(([k])=>k));
  assert.deepEqual(st.on.filter(x=>!x.includes(':')).sort(),[...want].sort(),d.file+' '+st.key+': a működő fogyasztók');
  // Az SVG osztályai: is-cur pontosan az áramút vezetékein, az érintkezők közül csak az aktuális állásé látszik.
  const els=parseSvg(svgOf(scene,st));
  const curDrawn=els.filter(e=>e.attrs['data-wire']&&/\bis-cur\b/.test(e.attrs.class??'')).map(e=>e.attrs['data-wire']).sort();
  assert.deepEqual(curDrawn,[...st.cur].sort(),d.file+' '+st.key+': a kiemelt áramút a rajzon');
  for(const e of els.filter(x=>x.attrs['data-sel']))assert.equal(/\bis-off\b/.test(e.attrs.class??''),st.states[e.attrs['data-sel']]!==e.attrs['data-state'],d.file+' '+st.key+': az érintkező állása');
  for(const e of els.filter(x=>x.attrs['data-out']))assert.equal(/\bis-on\b/.test(e.attrs.class??''),want.has(e.attrs['data-out']),d.file+' '+st.key+': a fogyasztó jelzése');
  stateCount++;
 }
}

// ------------------------------------------------------------------ 4. A figura
for(const {d,scene} of scenes.values()){
 const html=renderToStaticMarkup(createElement(DiagramFigure,{src:{netlist:d.netlist,layout:d.layout},figId:'abra-1',n:1,caption:d.netlist.title}));
 const els=parseSvg(html.replace(/<(\/?)(figure|figcaption|div|p|ul|li|button|table|thead|tbody|tr|th|td|details|summary|b|span|small|fieldset|legend)\b/g,'<$1$2'));
 assert.ok(!/\shidden(=|\s|>)/.test(html),d.file+': a nézetek osztállyal rejtettek, nem hidden attribútummal');
 assert.equal((html.match(/role="tablist"/g)??[]).length,1);
 assert.equal((html.match(/role="tab"/g)??[]).length,2);
 assert.equal((html.match(/role="tabpanel"/g)??[]).length,2);
 assert.ok(html.includes('aria-live="polite"'),d.file+': élő régió');
 const toggles=scene.selectors.filter(s=>s.states.length===2).length;
 assert.equal((html.match(/aria-pressed="(true|false)"/g)??[]).length,toggles,d.file+': kapcsológomb aria-pressed-del');
 assert.equal((html.match(/<tr data-key="/g)??[]).length,scene.states.length,d.file+': a kapcsolóállás-táblázat minden állása');
 const realWires=wireTable(loadNetlist(d.netlist)).length;
 const wt=/<details class="kk-dg-wires">[\s\S]*?<\/details>/.exec(html)![0];
 assert.equal((wt.match(/<tr><th scope="row">/g)??[]).length,realWires,d.file+': a vezetéktábla minden ere');
 assert.equal((html.match(/data-diagram="/g)??[]).length,2,'két SVG: Bekötés és Működés');
 if(d.netlist.wires.some(w=>w.color==='zöld-sárga'))assert.ok(html.includes('Így látod a tervezőben'),d.file+': „Így látod a tervezőben” sor');
 assert.ok(html.includes(netlistFingerprint(d.netlist)),d.file+': a netlista ujjlenyomata az ábraaláírásban');
 void els;
}

// ------------------------------------------------------------------ 5. Mutációs próba
type Mut={name:string;kill:()=>boolean};
const killed=(f:()=>string[]):boolean=>{try{return f().length>0}catch{return true}};
const check=(nl:Netlist,lay:DgLayout,file:string,svgMut?:(s:string)=>string)=>{
 const scene=buildScene(nl,lay);let svg=svgOf(scene);if(svgMut){const m=svgMut(svg);if(m===svg)throw new Error('a mutáció nem változtatott');svg=m}
 return checkDiagramSvg(svg,nl,ref.netlists.find(n=>n.file===file)!.wires).problems;
};
let mutants=0,kills=0;
const kinds=new Map<string,number>();
for(const {d} of scenes.values()){
 const muts:Mut[]=[];
 const real=d.netlist.wires.filter(w=>w.color);
 const add=(name:string,f:()=>string[])=>muts.push({name,kill:()=>killed(f)});
 // (a) netlista: egy vezeték végpontja ugyanazon alkatrész másik kapcsára kerül
 for(const [k,w] of real.slice(0,6).entries()){
  const comp=d.netlist.components.find(c=>w.to.startsWith(c.id+'.'))!,other=comp.terminals.find(t=>tkey(comp.id,t.id)!==w.to);
  if(other)add('netlista-kapocs',()=>{const nl=clone(d.netlist);nl.wires.find(x=>x.id===w.id)!.to=tkey(comp.id,other.id);return check(nl,d.layout,d.file)});
  void k;
 }
 // (b) netlista: két, különböző vezetőosztályú kapocs szerepének cseréje egy alkatrészen belül (pl. L ↔ N, N ↔ PE)
 const cls=(r:string)=>(d.netlist.earthing?ROLE_CLASS_E:ROLE_CLASS)[r]??r;
 for(const c of d.netlist.components.filter(x=>new Set(x.terminals.map(t=>cls(t.role))).size>=2).slice(0,3)){
  const a=c.terminals[0],b=c.terminals.find(t=>cls(t.role)!==cls(a.role))!;
  add('netlista-szerep',()=>{const nl=clone(d.netlist),cc=nl.components.find(x=>x.id===c.id)!;cc.terminals.find(t=>t.id===a.id)!.role=b.role;cc.terminals.find(t=>t.id===b.id)!.role=a.role;return check(nl,d.layout,d.file)});
 }
 // (c) netlista: egy ér színe a szerepéhez nem illő színre (L barna → kék, N kék → barna, PE → barna)
 for(const w of real.slice(0,4))add('netlista-szín',()=>{const nl=clone(d.netlist);const x=nl.wires.find(y=>y.id===w.id)!;x.color=x.color==='kék'?'barna':'kék';return check(nl,d.layout,d.file)});
 // (d) elrendezés: két különböző hálózatú ér útvonalának cseréje
 const nets=new Map<string,string>();for(const t of buildScene(d.netlist,d.layout).wires)nets.set(t.id,t.net);
 for(let i=0;i+1<real.length&&i<8;i+=2){const a=real[i].id!,b=real.find(x=>nets.get(x.id!)!==nets.get(a))?.id;if(b)add('elrendezés-útvonalcsere',()=>{const l=clone(d.layout) as DgLayout&{wires:Record<string,unknown>};const t=l.wires[a];l.wires[a]=l.wires[b];l.wires[b]=t;return check(d.netlist,l as DgLayout,d.file)})}
 // (e) elrendezés: egy kapocs áthelyezése (a vezetékek a régi helyen maradnak)
 const wired=(k:string)=>d.netlist.wires.some(w=>w.from===k||w.to===k);
 for(const [cid,p] of Object.entries(d.layout.parts).filter(([cid,p])=>Object.keys(p.terms).some(t=>wired(cid+'.'+t))).slice(0,4)){const tid=Object.keys(p.terms).find(t=>wired(cid+'.'+t))!;add('elrendezés-kapocs',()=>{const l=clone(d.layout) as DgLayout;const pt=(l.parts[cid].terms as Record<string,[number,number]>)[tid];pt[0]+=8;return check(d.netlist,l,d.file)})}
 // (f) elrendezés: két kapocs helyének cseréje egy alkatrészen belül (a vezetékek útvonala marad)
 for(const [cid,p] of Object.entries(d.layout.parts).filter(([cid,p])=>Object.keys(p.terms).filter(t=>wired(cid+'.'+t)).length>=2).slice(0,3)){
  const [t1,t2]=Object.keys(p.terms).filter(t=>wired(cid+'.'+t));
  add('elrendezés-kapocscsere',()=>{const l=clone(d.layout) as DgLayout;const ts=l.parts[cid].terms as Record<string,[number,number]>;const x=ts[t1];ts[t1]=ts[t2];ts[t2]=x;return check(d.netlist,l,d.file)});
 }
 // (g) elrendezés: egy ér útvonala egy idegen hálózat kapcsán át fut
 const sc=buildScene(d.netlist,d.layout);
 for(const w of sc.wires.filter(x=>x.kind==='er').slice(0,4)){
  const foreign=sc.terminals.find(t=>t.net!==w.net);if(!foreign)continue;
  add('elrendezés-idegen-kapocs',()=>{const l=clone(d.layout) as DgLayout&{wires:Record<string,[number,number][]>};const pts=l.wires[w.id];l.wires[w.id]=[pts[0],[foreign.at[0],pts[0][1]],[foreign.at[0],foreign.at[1]],[pts[pts.length-1][0],foreign.at[1]],pts[pts.length-1]];return check(d.netlist,l as DgLayout,d.file)});
 }
 // (g2) elrendezés: egy ér útvonala hosszában egy idegen hálózat vezetékszakaszán halad (átfedés)
 for(const w of sc.wires.filter(x=>x.kind==='er').slice(0,4)){
  const other=sc.wires.find(o=>o.kind==='er'&&o.net!==w.net);if(!other)continue;
  add('elrendezés-átfedés',()=>{const l=clone(d.layout) as DgLayout&{wires:Record<string,[number,number][]>};const pts=l.wires[w.id];l.wires[w.id]=[pts[0],[...other.pts[0]] as [number,number],[...other.pts[1]] as [number,number],pts[pts.length-1]];return check(d.netlist,l as DgLayout,d.file)});
 }
 // (g3) elrendezés: a minWidth a 10 px-es legkisebb felirat határa alá csökken (keskeny képernyőn olvashatatlan felirat)
 add('elrendezés-minWidth',()=>{const l=clone(d.layout) as DgLayout&{minWidth:number};l.minWidth=Math.floor(l.viewBox[2]*0.9);return check(d.netlist,l as DgLayout,d.file)});
 // (h) SVG: érszín-osztály csere, végpontcsere (data-to), felirat-csere, csomópontpötty törlése/hozzáadása, érintkezőpár csere
 const svg=svgOf(sc);
 const wl=[...svg.matchAll(/data-wire="([^"]+)"/g)].map(m=>m[1]);
 for(const id of wl.slice(0,3)){
  add('svg-szín',()=>check(d.netlist,d.layout,d.file,s=>s.replace(new RegExp('class="kk-dg-w kk-dg-w-(l1|l2|l3|n|pe)" data-wire="'+id+'"'),(_m,c)=>'class="kk-dg-w kk-dg-w-'+(c==='n'?'l1':'n')+'" data-wire="'+id+'"')));
  add('svg-végpont',()=>check(d.netlist,d.layout,d.file,s=>s.replace(new RegExp('(data-wire="'+id+'"[^>]*data-to=")([^"]+)"'),(_m,p,t)=>p+(t.endsWith('.N')?t.slice(0,-1)+'L':t.slice(0,t.lastIndexOf('.'))+'.N')+'"')));
 }
 const labs=[...svg.matchAll(/<text[^>]*class="kk-dg-t-wire[^"]*"[^>]*data-for="([^"]+)"[^>]*>([^<]*)<\/text>/g)];
 if(labs.length>=2){const a=labs.find(m=>m[2]!==labs[0][2]);if(a)add('svg-felirat',()=>check(d.netlist,d.layout,d.file,s=>s.replace(labs[0][0],labs[0][0].replace('>'+labs[0][2]+'<','>'+a[2]+'<'))))}
 const dot=/<circle[^>]*data-junction="[^"]*"[^>]*>(<\/circle>)?/.exec(svg);
 if(dot)add('svg-pötty-törlés',()=>check(d.netlist,d.layout,d.file,s=>s.replace(dot[0],'')));
 // pötty egy valódi keresztezésre: két különböző hálózatú, egymást keresztező szakasz metszéspontja
 const segs=sc.wires.filter(w=>w.kind==='er').flatMap(w=>w.pts.slice(1).map((p,i)=>({a:w.pts[i],b:p,net:w.net})));
 const cross=(()=>{for(const s of segs)for(const t of segs){if(s.net===t.net)continue;const h=s.a[1]===s.b[1]&&t.a[0]===t.b[0];if(!h)continue;const x=t.a[0],y=s.a[1];if(x>Math.min(s.a[0],s.b[0])&&x<Math.max(s.a[0],s.b[0])&&y>Math.min(t.a[1],t.b[1])&&y<Math.max(t.a[1],t.b[1]))return [x,y]}return null})();
 if(cross)add('svg-pötty-keresztezésen',()=>check(d.netlist,d.layout,d.file,s=>s.replace('</svg>','<circle cx="'+cross[0]+'" cy="'+cross[1]+'" r="3" class="kk-dg-dot" data-junction="x"/></svg>')));
 const pair=/data-pair="([^"]+) ([^"]+)"/.exec(svg);
 if(pair)add('svg-érintkező',()=>check(d.netlist,d.layout,d.file,s=>s.replace(pair[0],'data-pair="'+pair[2]+' '+pair[1]+'"')));
 for(const m of muts){mutants++;const k=m.kill();if(k)kills++;else assert.fail(d.file+': a mutáció nem bukott meg: '+m.name);kinds.set(m.name,(kinds.get(m.name)??0)+1)}
}
assert.equal(kills,mutants);
assert.ok(mutants>=400,'mutánsok: '+mutants);

// ------------------------------------------------------------------ 6. Az ábra ujjlenyomata
{
 const f='valtokapcsolo-106-bekotese.netlist.json',base=diagramSource(ROOT,[f]);
 assert.match(base,/^[0-9a-f]{8}$/);
 assert.equal(diagramSource(ROOT,[f]),base,'determinisztikus');
 assert.ok(rendererFiles(ROOT).includes(DIAGRAM_RENDERER)&&rendererFiles(ROOT).includes('components/kezikonyv/diagram/symbols.tsx')&&rendererFiles(ROOT).includes('lib/kb/circuit.ts')&&rendererFiles(ROOT).includes('components/kezikonyv/diagram/diagram-run.tsx'),'a rajzoló modulok a lenyomatban');
 assert.ok(!rendererFiles(ROOT).includes('lib/sizing-tables.ts'));
 const disk=(root:string,p:string)=>readFileSync(join(root,p),'utf8');
 const mut=(target:string,edit:(s:string)=>string)=>diagramSource(ROOT,[f],(root,p)=>p===target?edit(disk(root,p)):disk(root,p));
 assert.notEqual(mut(LAYOUT_DIR+'/valtokapcsolo-106.json',s=>s.replace('"w7":[[124,118],[268,118]','"w7":[[124,118],[268,119]')),base,'az elrendezés változása');
 assert.notEqual(mut(NETLIST_DIR+'/'+f,s=>s+' '),base,'a netlista szövegének változása');
 assert.notEqual(mut('components/kezikonyv/diagram/symbols.tsx',s=>s.replace('depthC=Number(part.opt?.contact??11)','depthC=Number(part.opt?.contact??12)')),base,'egy szimbólum változása');
 assert.notEqual(mut('lib/kb/circuit.ts',s=>s+'\n'),base,'a szimulátor változása');
 assert.notEqual(mut(FIG_CSS,s=>s.replace('--kk-wire-n:#2563b8','--kk-wire-n:#8a4b22')),base,'az N ér színtokenje');
 assert.notEqual(mut(FIG_CSS,s=>s.replace('.kk-dg-w-l1{stroke:var(--kk-wire-l1)}','.kk-dg-w-l1{stroke:var(--kk-wire-n)}')),base,'az ér-osztály színe');
 assert.ok(diagramCss(readFileSync(FIG_CSS,'utf8')).some(x=>x.includes('.kk-dg-w-pes')));
 // elavult elrendezés: a netlista változott, az elrendezés ujjlenyomata nem
 assert.throws(()=>diagramFiles(ROOT,f,(root,p)=>p===NETLIST_DIR+'/'+f?disk(root,p).replace(/"title":\s*"/,'"title":"X'):disk(root,p)),/elavult elrendezés/);
}

// ------------------------------------------------------------------ 7. Kontraszt (WCAG relatív fénysűrűség)
{
 const css=readFileSync(FIG_CSS,'utf8'),globals=readFileSync('app/globals.css','utf8');
 const tok=(block:string,name:string)=>{const m=new RegExp('--'+name+':#([0-9a-f]{6}|[0-9a-f]{3})\\b').exec(block);assert.ok(m,name);const h=m![1];return '#'+(h.length===3?[...h].map(c=>c+c).join(''):h)};
 const light=css.slice(css.indexOf('.kk,.kk-layer{'),css.indexOf('[data-theme=dark] .kk,'));
 const dark=css.slice(css.indexOf('[data-theme=dark] .kk,'),css.indexOf('.kk{min-height'));
 const bgL=tok(globals.slice(0,globals.indexOf('}')),'background'),bgD=tok(globals.slice(globals.indexOf('[data-theme=dark]{')),'background');
 const lum=(h:string)=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4);return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]};
 const ratio=(a:string,b:string)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)};
 for(const [name,block,bg] of [['világos',light,bgL],['sötét',dark,bgD]] as const){
  for(const t of ['kk-wire-l1','kk-wire-l3','kk-wire-n','kk-wire-pe'])assert.ok(ratio(tok(block,t),bg)>=3,name+' téma: '+t+' kontrasztja '+ratio(tok(block,t),bg).toFixed(2));
  // fekete ér: a mag (l2-swatch) világos témában a háttérhez, sötétben a halóhoz (--kk-wire-l2) legalább 3:1, a haló a háttérhez is
  const core=tok(block,'kk-wire-l2-swatch');
  if(name==='világos')assert.ok(ratio(core,bg)>=3);else{const halo=tok(block,'kk-wire-l2');assert.ok(ratio(halo,bg)>=3&&ratio(core,halo)>=3,'sötét téma: fekete ér halóval')}
 }
 assert.ok(css.includes('[data-theme=dark] .kk .kk-dg-w-halo{stroke:var(--kk-wire-l2)}'),'sötét témában a fekete ér halója világos');
}

console.log('PASS: rajz = netlista – 20 ábra ('+wires+' vezeték, '+terms+' kapocs, '+dots+' csomópontpötty, '+crossings+' keresztezés, '+contacts+' érintkező; a Python-vezetéktáblával is), Működés '+stateCount+' állásban a szimuláció szerint, figura (nézetváltó, aria-pressed, aria-live, táblák), mutációs próba: '+kills+'/'+mutants+' kiszűrve ('+[...kinds].map(([k,v])=>k+' '+v).join(', ')+'), ábra-ujjlenyomat, kontraszt.');
