'use client';
// A kalkulátor kliensszigete: bemenetek (tizedesvessző is), eredménykártya élő régióval, levezetés, ábra, kedvenc, link, másolás, nyomtatás.
// Az URL-paramétereket kliensoldalon olvassuk (useSyncExternalStore, üres szerver-pillanatkép): a statikus/ISR oldal így minden lekérdezésre ugyanaz.
// Az űrlap a keresési sztringből `key`-vel mountolódik újra (nincs setState effectben). Számolás közben nincs hálózati kérés.
import {useEffect,useId,useMemo,useRef,useState,useSyncExternalStore} from 'react';
import {Copy,Link2,Plus,Printer,Star,Trash2} from 'lucide-react';
import {chosenUnit,defaultRaw,fieldUnits,isVisible,rawValue,runCalc,selectValue,splitRows,type CalcDef,type CalcRun,type FieldDef,type ListField,type NumberField,type Raw,type RowsField,type SelectField} from '@/lib/calc/core';
import {decodeState,encodeState} from '@/lib/calc/url';
import {calcPath} from '@/lib/kb/categories';
import {addBookmark,addRecent,bookmarkStore,isBookmarked,removeBookmark,type KbEntry} from '@/lib/kb/storage';
import {showToast,useKbStore} from '@/components/kezikonyv/kb-client';
import {CalcFigure} from './calc-figures';

// ---- URL-pillanatkép: csak az első olvasáskor és visszalépéskor (popstate) frissül, a saját replaceState-ünkre nem (különben gépelés közben újramountolna).
let urlSnap:string|null=null;
const getSearch=()=>{if(urlSnap===null)urlSnap=window.location.search;return urlSnap};
const subscribeUrl=(fn:()=>void)=>{const h=()=>{urlSnap=window.location.search;fn()};window.addEventListener('popstate',h);return ()=>window.removeEventListener('popstate',h)};

const resultText=(def:CalcDef,run:CalcRun)=>run.ok?def.title+': '+run.out.results.filter(r=>r.primary).map(r=>r.label+' = '+(r.text??r.value)).join('; '):'Hibás bemenet: '+run.issues.map(i=>i.text).join(' ');

function FieldError({id,text}:{id:string;text?:string}){return text?<p className="kk-field-error" id={id}>{text}</p>:null}

function NumberInput({f,raw,set,error}:{f:NumberField;raw:Raw;set:(k:string,v:string)=>void;error?:string}){
 const id=useId(),units=fieldUnits(f),unit=chosenUnit(f,raw);
 return <div className="kk-field">
  <label htmlFor={id}>{f.label}{f.symbol&&<span className="kk-sym"> {f.symbol}</span>}{f.optional&&<span className="kk-opt"> (nem kötelező)</span>}</label>
  <div className="kk-input-row">
   <input id={id} type="text" inputMode={f.integer&&!f.allowNegative?'numeric':'decimal'} autoComplete="off" spellCheck={false} value={rawValue(f,raw)} placeholder={f.placeholder} aria-invalid={!!error||undefined} aria-describedby={[error?id+'-e':'',f.help?id+'-h':''].filter(Boolean).join(' ')||undefined} onChange={e=>set(f.id,e.target.value)}/>
   {units.length>1?<select aria-label={f.label+' mértékegysége'} value={unit!.id} onChange={e=>set(f.id+'.e',e.target.value)}>{units.map(u=><option key={u.id} value={u.id}>{u.label}</option>)}</select>:(unit?.label??f.unit)?<span className="kk-unit">{unit?.label??f.unit}</span>:null}
  </div>
  <FieldError id={id+'-e'} text={error}/>
  {f.help&&<p className="kk-help" id={id+'-h'}>{f.help}</p>}
 </div>;
}

function SelectInput({f,raw,set}:{f:SelectField;raw:Raw;set:(k:string,v:string)=>void}){
 const id=useId(),value=selectValue(f,raw);
 if(f.style==='segmented')return <fieldset className="kk-field kk-seg"><legend>{f.label}</legend><div>{f.options.map(o=><label key={o.value} className={o.value===value?'on':undefined}><input type="radio" name={id} value={o.value} checked={o.value===value} onChange={()=>set(f.id,o.value)}/>{o.label}</label>)}</div>{f.help&&<p className="kk-help">{f.help}</p>}</fieldset>;
 return <div className="kk-field"><label htmlFor={id}>{f.label}</label><select id={id} className="kk-select" value={value} onChange={e=>set(f.id,e.target.value)}>{f.options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>{f.help&&<p className="kk-help">{f.help}</p>}</div>;
}

function ListInput({f,raw,set,error}:{f:ListField;raw:Raw;set:(k:string,v:string)=>void;error?:string}){
 const id=useId(),units=fieldUnits(f),unit=chosenUnit(f,raw);
 return <div className="kk-field">
  <label htmlFor={id}>{f.label}{f.symbol&&<span className="kk-sym"> {f.symbol}</span>}</label>
  <div className="kk-input-row">
   <input id={id} type="text" inputMode="decimal" autoComplete="off" spellCheck={false} value={rawValue(f,raw)} aria-invalid={!!error||undefined} aria-describedby={[error?id+'-e':'',id+'-h'].filter(Boolean).join(' ')} onChange={e=>set(f.id,e.target.value)}/>
   {units.length>1?<select aria-label={f.label+' mértékegysége'} value={unit!.id} onChange={e=>set(f.id+'.e',e.target.value)}>{units.map(u=><option key={u.id} value={u.id}>{u.label}</option>)}</select>:f.unit?<span className="kk-unit">{f.unit}</span>:null}
  </div>
  <FieldError id={id+'-e'} text={error}/>
  <p className="kk-help" id={id+'-h'}>{f.help??'Pontosvesszővel elválasztva.'} {f.minItems}–{f.maxItems} érték.</p>
 </div>;
}

function RowsInput({f,raw,set,error}:{f:RowsField;raw:Raw;set:(k:string,v:string)=>void;error?:string}){
 const id=useId();
 const rows=splitRows(rawValue(f,raw));const grid=rows.length?rows:[f.columns.map(c=>c.default??'')];
 const write=(g:string[][])=>set(f.id,g.map(r=>r.map(c=>c.replace(/[*;]/g,'')).join('*')).join(';'));
 const cell=(i:number,j:number,v:string)=>write(grid.map((r,a)=>a===i?f.columns.map((_,b)=>b===j?v:r[b]??''):r));
 return <fieldset className="kk-field kk-rows" aria-describedby={error?id+'-e':undefined}>
  <legend>{f.label}</legend>
  <table><thead><tr>{f.columns.map(c=><th key={c.id} scope="col">{c.label}{c.unit&&<small> ({c.unit})</small>}</th>)}<th scope="col"><span className="sr-only">Sor törlése</span></th></tr></thead>
   <tbody>{grid.map((r,i)=><tr key={i}>{f.columns.map((c,j)=><td key={c.id}><input type="text" inputMode="decimal" autoComplete="off" aria-label={(i+1)+'. sor, '+c.label} value={r[j]??''} onChange={e=>cell(i,j,e.target.value)}/></td>)}<td><button type="button" className="kk-icon-btn" aria-label={(i+1)+'. sor törlése'} disabled={grid.length<=f.minRows} onClick={()=>write(grid.filter((_,a)=>a!==i))}><Trash2 aria-hidden="true"/></button></td></tr>)}</tbody>
  </table>
  <button type="button" className="kk-button" disabled={grid.length>=f.maxRows} onClick={()=>write([...grid,f.columns.map(c=>c.default??'')])}><Plus aria-hidden="true"/> Sor hozzáadása</button>
  <FieldError id={id+'-e'} text={error}/>
  {f.help&&<p className="kk-help">{f.help}</p>}
 </fieldset>;
}

function Field({def,f,raw,set,error}:{def:CalcDef;f:FieldDef;raw:Raw;set:(k:string,v:string)=>void;error?:string}){
 if(!isVisible(def,f,raw))return null;
 switch(f.kind){
  case 'number':return <NumberInput f={f} raw={raw} set={set} error={error}/>;
  case 'select':return <SelectInput f={f} raw={raw} set={set}/>;
  case 'list':return <ListInput f={f} raw={raw} set={set} error={error}/>;
  case 'rows':return <RowsInput f={f} raw={raw} set={set} error={error}/>;
 }
}

function Result({def,run}:{def:CalcDef;run:CalcRun}){
 const figId=useId();
 if(!run.ok)return <div className="kk-result invalid"><p className="kk-result-title">Nincs eredmény</p>{run.issues.filter(i=>!i.field).map((i,n)=><p key={n} className="kk-field-error">{i.text}</p>)}{run.issues.some(i=>i.field)&&<p>Javítsd a pirossal jelölt mezőket.</p>}</div>;
 const {out}=run,primary=out.results.filter(r=>r.primary),rest=out.results.filter(r=>!r.primary);
 return <div className="kk-result">
  <p className="kk-result-title">Eredmény{def.tier!=='T0'?' (számítás szerint)':''}</p>
  <div className="kk-result-main">{primary.map(r=><div key={r.id}><span>{r.label}</span><strong>{r.text??r.value}</strong>{r.note&&<small>{r.note}</small>}</div>)}</div>
  {!!rest.length&&<dl className="kk-result-list">{rest.map(r=><div key={r.id}><dt>{r.label}</dt><dd>{r.text??r.value}</dd></div>)}</dl>}
  {out.verdict&&<p className={'kk-verdict '+(out.verdict.ok?'ok':'bad')}>{out.verdict.text}</p>}
  {run.issues.map((i,n)=><p key={n} className={'kk-issue '+i.level}>{i.text}</p>)}
  {out.figure&&<figure className="kk-figure"><CalcFigure figure={out.figure} id={figId}/></figure>}
  {out.table&&<div className="kk-table-wrap"><table className="kk-table"><caption>{out.table.caption}</caption><thead><tr>{out.table.head.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{out.table.rows.map((r,i)=><tr key={i}>{r.map((c,j)=>j===0?<th key={j} scope="row">{c}</th>:<td key={j}>{c}</td>)}</tr>)}</tbody></table></div>}
 </div>;
}

export function Steps({run}:{run:CalcRun}){
 if(!run.ok)return <p className="kk-muted">A levezetés a helyes bemenetek után jelenik meg.</p>;
 return <ol className="kk-steps">{run.out.steps.map((s,i)=><li key={i}><b>{s.label}</b><code>{s.formula}</code><span>{s.substituted}</span><strong>= {s.result}</strong>{s.ref&&<small>Forrás: {s.ref}</small>}</li>)}</ol>;
}

function CalcForm({def,initial}:{def:CalcDef;initial:Raw}){
 const [raw,setRaw]=useState<Raw>(initial);
 const [announce,setAnnounce]=useState('');
 const [printInfo,setPrintInfo]=useState<{url:string;date:string}|null>(null);
 const touched=useRef(false);
 const run=useMemo(()=>runCalc(def,raw),[def,raw]);
 const favs=useKbStore(bookmarkStore),fav=isBookmarked(favs,'calc',def.slug);
 const set=(k:string,v:string)=>{touched.current=true;setRaw(r=>({...r,[k]:v}))};
 const query=encodeState(def,raw),href=calcPath(def.slug);
 const errors=run.ok?{}:Object.fromEntries(run.issues.filter(i=>i.field).map(i=>[i.field!,i.text]));
 // URL frissítése 600 ms tétlenség után (csak a felhasználó módosítása után).
 useEffect(()=>{if(!touched.current)return;const h=setTimeout(()=>{const url=window.location.pathname+query+window.location.hash;window.history.replaceState(window.history.state,'',url)},600);return ()=>clearTimeout(h)},[query]);
 // Élő régió: 700 ms tétlenség után olvassa fel az eredményt.
 useEffect(()=>{if(!touched.current)return;const h=setTimeout(()=>setAnnounce(resultText(def,run)),700);return ()=>clearTimeout(h)},[def,run]);
 // Előzmények: 1,5 s után (a lekérdezéssel együtt).
 useEffect(()=>{if(!run.ok)return;const h=setTimeout(()=>addRecent({type:'calc',id:def.slug,href:href+query,title:def.title,detail:run.summary,at:Date.now()}),1500);return ()=>clearTimeout(h)},[def,run,href,query]);
 useEffect(()=>{const before=()=>setPrintInfo({url:window.location.origin+href+query,date:new Date().toLocaleString('hu-HU')});window.addEventListener('beforeprint',before);return ()=>window.removeEventListener('beforeprint',before)},[href,query]);
 const entry=():KbEntry=>({type:'calc',id:def.slug,href,title:def.title,at:Date.now()});
 function toggleFav(){
  if(fav){removeBookmark('calc',def.slug);showToast('Eltávolítva a kedvencek közül.',{label:'Visszavonás',run:()=>addBookmark(entry())})}
  else{addBookmark(entry());showToast('Hozzáadva a kedvencekhez.',{label:'Visszavonás',run:()=>removeBookmark('calc',def.slug)})}
 }
 async function copy(text:string,ok:string){try{await navigator.clipboard.writeText(text);showToast(ok)}catch{showToast('A böngésző nem engedte a másolást.')}}
 const copyResult=()=>copy([def.title,run.ok?run.summary:'',resultText(def,run),window.location.origin+href+query].filter(Boolean).join('\n'),'Az eredmény a vágólapra került.');
 return <div className="kk-calc">
  <div className="kk-actions" role="group" aria-label="Műveletek">
   <button type="button" className={'kk-button'+(fav?' on':'')} aria-pressed={fav} onClick={toggleFav}><Star aria-hidden="true"/> Kedvenc</button>
   <button type="button" className="kk-button" onClick={()=>copy(window.location.origin+href+query,'A link a vágólapra került.')}><Link2 aria-hidden="true"/> Link másolása</button>
   <button type="button" className="kk-button" onClick={copyResult}><Copy aria-hidden="true"/> Eredmény másolása</button>
   <button type="button" className="kk-button" onClick={()=>window.print()}><Printer aria-hidden="true"/> Nyomtatás</button>
  </div>
  <form className="kk-calc-form" onSubmit={e=>e.preventDefault()} noValidate aria-label={def.title+' – bemenetek'}>
   {def.fields.map(f=><Field key={f.id} def={def} f={f} raw={raw} set={set} error={errors[f.id]}/>)}
   <button type="button" className="kk-link kk-reset" onClick={()=>{touched.current=true;setRaw(defaultRaw(def))}}>Alapértékek visszaállítása</button>
  </form>
  <section className="kk-result-wrap" aria-label="Eredmény" id="eredmeny"><Result def={def} run={run}/></section>
  <p className="sr-only" aria-live="polite">{announce}</p>
  <details className="kk-derivation" id="levezetes" open><summary>Levezetés</summary><Steps run={run}/></details>
  {run.ok&&!!run.out.assumptions?.length&&<details className="kk-assumptions" open><summary>Feltételezések</summary><ul>{run.out.assumptions.map(a=><li key={a}>{a}</li>)}</ul></details>}
  {printInfo&&<p className="kk-print-only">Nyomtatva: {printInfo.date} · {printInfo.url}</p>}
 </div>;
}

export function Calculator({def}:{def:CalcDef}){
 const search=useSyncExternalStore(subscribeUrl,getSearch,()=>'');
 const initial=useMemo(()=>({...defaultRaw(def),...decodeState(def,search)}),[def,search]);
 return <CalcForm key={search} def={def} initial={initial}/>;
}
