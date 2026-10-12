// Netlistás bekötési ábra a cikkben (szerverkomponens; docs/tudastar-terv.md 2.4 és 3.4, docs/tudastar.md „Sémák és ábramotor”):
// nézetváltó (Bekötés | Működés – a Szerelési rajz nézet nem készült el, lásd a dokumentációt), jelmagyarázat, „Így látod a tervezőben”
// sor, ábraaláírás az ábra azonosítójával és a netlista ujjlenyomatával, alatta a szöveges megfelelő: „Vezetékek táblázatban”
// (<details>, a lib/kb/circuit.ts wireTable()-jéből) és a Működés nézetben a kapcsolóállás-táblázat (a szimuláció minden állása).
// Csak a kapu szerint közzétett cikk ábrája kerül ide (a generált lib/kb/content/generated/diagrams.ts csak ezeket tartalmazza);
// a lektori csomag és a tesztek ugyanezt a komponenst renderelik.
import {loadNetlist,netlistFingerprint,wireTable,type Netlist} from '@/lib/kb/circuit';
import {BekotesSvg} from './bekotes';
import {DiagramViews,type RunData} from './diagram-run';
import {buildScene,type DgLayout,type Scene} from './scene';

/** Egy ábra forrása: a netlista (content/tudastar/r3/*.netlist.json) és az elrendezés (content/tudastar/diagramok/<id>.json). */
export type DiagramSource={netlist:Netlist;layout:DgLayout};

export function Legend({scene}:{scene:Scene}){
 return <ul className="kk-dg-legend" aria-label="Jelmagyarázat">{scene.legend.map((l,i)=><li key={i}><span className={'kk-dg-sw '+l.cls} aria-hidden="true"/>{l.tag&&<b>{l.tag}</b>}<span>{l.text}{l.color?' ('+l.color+')':''}</span></li>)}</ul>;
}
export function WireTable({src,scene}:{src:DiagramSource;scene:Scene}){
 const rows=wireTable(loadNetlist(src.netlist));
 return <details className="kk-dg-wires"><summary>Vezetékek táblázatban ({rows.length} ér)</summary>
  <div className="kk-table-wrap" role="region" aria-label={'Vezetékek táblázatban: '+scene.title} tabIndex={0}><table className="kk-table">
   <thead><tr><th scope="col">#</th><th scope="col">Honnan</th><th scope="col">Hová</th><th scope="col">Vezető</th><th scope="col">Szín</th><th scope="col">Szakasz</th></tr></thead>
   <tbody>{rows.map(r=><tr key={r.no}><th scope="row">{r.no}</th><td>{r.fromLabel}</td><td>{r.toLabel}</td><td>{r.conductor}</td><td>{r.color}</td><td>{r.section}</td></tr>)}</tbody>
  </table></div>
 </details>;
}
/** A kapcsolóállás-táblázat: a választók állása és az eredmény (a szimuláció szövegével). Sok állásnál összecsukva. */
export function TruthTable({scene}:{scene:Scene}){
 const n=scene.states.length;
 const table=<div className="kk-table-wrap" role="region" aria-label={'Kapcsolóállás-táblázat: '+scene.title} tabIndex={0}><table className="kk-table kk-dg-truth-table">
  <thead><tr>{scene.selectors.map(s=><th key={s.id} scope="col">{s.label}</th>)}<th scope="col">Eredmény</th></tr></thead>
  <tbody>{scene.states.map(st=><tr key={st.key} data-key={st.key}>{scene.selectors.map((s,i)=><td key={s.id}>{i===0?<b>{s.states.find(x=>x.name===st.states[s.id])?.label}</b>:s.states.find(x=>x.name===st.states[s.id])?.label}</td>)}<td>{st.text.join('; ')}</td></tr>)}</tbody>
 </table></div>;
 return <div className="kk-dg-truth">{n>12?<details><summary>Kapcsolóállás-táblázat ({n} állás)</summary>{table}</details>:<><p className="kk-dg-truth-title">Kapcsolóállás-táblázat ({n} állás)</p>{table}</>}</div>;
}

/** Az ábra (a cikk `figure` blokkja helyén). `n`: az ábra sorszáma a cikkben; `variant`: változat felirata (pl. „2 × 107”). */
export function DiagramFigure({src,figId,n,caption,variant}:{src:DiagramSource;figId:string;n:number|string;caption:string;variant?:string}){
 const scene=buildScene(src.netlist,src.layout),uid='dg-'+scene.id;
 const title=caption+(variant?' – '+variant:'');
 const init=scene.states.find(s=>Object.entries(scene.initial).every(([k,v])=>s.states[k]===v))!;
 const data:RunData={uid,selectors:scene.selectors,initial:scene.initial,states:scene.states.map(s=>({key:s.key,cur:s.cur,live:s.live,broken:s.broken,on:s.on,text:s.text}))};
 const pe=scene.wires.some(w=>w.color==='zöld-sárga');
 const frame=(view:'bekotes'|'mukodes')=><div className="kk-dg-frame" role="region" aria-label={(view==='bekotes'?'Bekötési rajz':'Működés')+': '+title+' (keskeny képernyőn vízszintesen görgethető)'} tabIndex={0}>
  <BekotesSvg scene={scene} uid={uid+'-'+view} title={(view==='bekotes'?'Bekötési rajz: ':'Működés, alapállás: ')+title} view={view} {...(view==='mukodes'?{state:init}:{})}/>
 </div>;
 return <figure className="kk-dg" id={figId} aria-labelledby={uid+'-cap'} data-diagram-figure={scene.id}>
  <DiagramViews data={data}
   bekotes={<>{frame('bekotes')}<Legend scene={scene}/>{pe&&<p className="kk-dg-planner">Így látod a tervezőben: a védővezető (PE) a tervező alaprajzán egyszínű zöld; itt, a bekötési rajzon zöld alapon sárga csíkos, ahogy a valódi ér.</p>}</>}
   mukodes={<>{frame('mukodes')}<p className="kk-dg-nojs">A kapcsolók és a hibahelyzetek gombjai JavaScripttel működnek; nélküle az alapállás és a teljes kapcsolóállás-táblázat látszik.</p></>}
   truth={<TruthTable scene={scene}/>}/>
  <figcaption id={uid+'-cap'}><span className="kk-dg-no">{n}. ábra.</span> {title} <small>Ábra: {scene.id} · netlista-ujjlenyomat: {netlistFingerprint(src.netlist)}</small></figcaption>
  <WireTable src={src} scene={scene}/>
 </figure>;
}
