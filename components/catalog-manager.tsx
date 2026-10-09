"use client";
import {useMemo,useRef,useState} from 'react';
import {Archive,Download,FileUp,Plus,RotateCcw,Save,Sparkles,Trash2} from 'lucide-react';
import {toast} from 'sonner';
import {Field} from './plan-controls';
import {useCatalog} from './use-catalog';
import {CATALOG_LIMIT,CSV_BYTES,catalogError,catalogErrorMap,productLabel,productSchema,removeProduct,searchProducts,setAccountDefault,setProductArchived,upsertProduct,type Catalog,type Product} from '@/lib/catalog';
import {catalogCsv,decodeCsv,mergeCatalogCsv,parseCatalogCsv,type CsvEncoding,type CsvMerge,type CsvParse} from '@/lib/catalog-csv';
import {addSampleProducts} from '@/lib/catalog-sample';
import {refLabel} from '@/lib/product-refs';
import {money} from '@/lib/quote';

type Save=(next:Catalog,message:string)=>Promise<boolean>;
const SHOWN=200;
const priceText=(n:number|null)=>n===null?'nincs ár':money(n);

// Vendég módban nincs lekérés: a katalógus a szerveren, fiókhoz kötve tárolódik.
export function CatalogManager({userId}:{userId:string}){
 if(!userId)return <p className="billing-notice">A termékkatalógus fiókhoz kötött: a szerveren tároljuk, hogy minden eszközödön elérd. Jelentkezz be vagy regisztrálj a Fiók menüben.</p>;
 return <CatalogPanel userId={userId}/>;
}

type Source={file:string;encoding:CsvEncoding;text:string};
type Analysis={parse:CsvParse;merge:CsvMerge|null;error:string};
// Eseménykezelőből hívjuk (fájlválasztás, opcióváltás, importálás): itt keletkezik az időbélyeg és az új azonosító.
function analyze(text:string,c:Catalog,markupPercent:number,gross:boolean):Analysis{
 const parse=parseCatalogCsv(text,{markupPercent,gross});
 try{return {parse,merge:mergeCatalogCsv(c,parse.drafts,new Date().toISOString(),()=>crypto.randomUUID()),error:''}}catch(e){return {parse,merge:null,error:catalogError(e)}}
}

function CatalogPanel({userId}:{userId:string}){
 const state=useCatalog(userId),{catalog,status,error,conflict,saving,reload,save}=state;
 const [query,setQuery]=useState(''),[archived,setArchived]=useState(false),[editing,setEditing]=useState<Product|null>(null),[source,setSource]=useState<{id:string;source:Source;first:Analysis}|null>(null),[confirmSample,setConfirmSample]=useState(false);
 const fileRef=useRef<HTMLInputElement>(null);
 const found=useMemo(()=>catalog?searchProducts(catalog.products,query,{archived}):[],[catalog,query,archived]);
 const full=!!catalog&&catalog.products.length>=CATALOG_LIMIT;
 function blank():Product{return {id:crypto.randomUUID(),manufacturer:'',family:'',sku:'',name:'',unit:'db',price:null,labor:null,archived:false,sample:false,updatedAt:''}}
 async function pick(file:File|undefined){
  if(fileRef.current)fileRef.current.value='';if(!file||!catalog)return;
  if(file.size>CSV_BYTES){toast.error('A CSV legfeljebb 2 MB lehet.');return}
  try{const {text,encoding}=decodeCsv(new Uint8Array(await file.arrayBuffer()));setEditing(null);setConfirmSample(false);setSource({id:crypto.randomUUID(),source:{file:file.name,encoding,text},first:analyze(text,catalog,0,false)})}catch{toast.error('A fájl nem olvasható be.')}
 }
 function download(){if(!catalog)return;const url=URL.createObjectURL(new Blob([catalogCsv(catalog)],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Villanyrajz-termekkatalogus.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 async function loadSample(){
  if(!catalog)return;let r:{catalog:Catalog;added:number};
  try{r=addSampleProducts(catalog,new Date().toISOString(),()=>crypto.randomUUID())}catch(e){toast.error(catalogError(e));return}
  if(JSON.stringify(r.catalog)===JSON.stringify(catalog)){setConfirmSample(false);toast.info('A mintakészlet már be van töltve.');return}
  if(await save(r.catalog,`Mintakészlet betöltve: ${r.added} termék.`))setConfirmSample(false);
 }
 const defaults=catalog?catalog.defaults.map(d=>({d,p:catalog.products.find(p=>p.id===d.productId)})):[];
 return <div className="catalog-manager">
  <div><h3>Termékkatalógus</h3><p className="report-note">Saját, fiókszintű termék- és árlistád, minden projektedben használható. Valós gyártói árlistát a Villanyrajz nem szállít: a termékeket te veszed fel, vagy CSV-ből importálod (például a nagykereskedőd árlistájából). Az árak nettó, ajánlati Ft/egység értékek. A katalógus módosításai nem vonhatók vissza a tervező Visszavonás gombjával.</p>
   {catalog&&<p className="report-note">{catalog.products.length} / {CATALOG_LIMIT} termék · {catalog.defaults.length} fiók-alapértelmezés</p>}</div>
  {status==='loading'&&<p role="status">Katalógus betöltése…</p>}
  {status==='error'&&<div><p className="auth-error" role="alert">{error}</p><button type="button" onClick={reload}><RotateCcw/> Újrapróbálás</button></div>}
  {conflict&&<div className="warning-banner catalog-conflict" role="alert"><span>A termékkatalógus egy másik ablakban megváltozott.</span><button type="button" onClick={reload}><RotateCcw/> Lista frissítése</button></div>}
  {catalog&&status==='ready'&&<fieldset className="catalog-body" disabled={saving}>
   <div className="catalog-actions">
    <button type="button" className="primary" disabled={full} onClick={()=>{setSource(null);setConfirmSample(false);setEditing(blank())}}><Plus/> Új termék</button>
    <button type="button" onClick={()=>fileRef.current?.click()}><FileUp/> CSV importálása…</button>
    <input ref={fileRef} type="file" accept=".csv,.txt,text/csv" hidden aria-label="Termék-CSV kiválasztása" onChange={e=>void pick(e.target.files?.[0])}/>
    <button type="button" disabled={!catalog.products.some(p=>!p.archived)} onClick={download}><Download/> CSV letöltése</button>
    <button type="button" onClick={()=>{setEditing(null);setSource(null);setConfirmSample(true)}}><Sparkles/> Mintakészlet betöltése</button>
   </div>
   {confirmSample&&<div className="project-state-confirm"><b>Mintakészlet betöltése</b><p>A mintakészlet 25 általános, ár nélküli tételt ad a katalógushoz „(minta)” jelöléssel, és ahol még nincs, fiók-alapértelmezésnek állítja őket. Az árakat neked kell megadnod; a mintatermék adatai nem kerülnek az ajánlat PDF-jébe.</p><div className="project-actions"><button type="button" onClick={()=>setConfirmSample(false)}>Mégse</button><button type="button" className="primary" onClick={()=>void loadSample()}>Betöltés</button></div></div>}
   {source&&<ImportPanel key={source.id} source={source.source} first={source.first} catalog={catalog} save={save} onClose={()=>setSource(null)}/>}
   {editing&&<ProductForm key={editing.id} draft={editing} catalog={catalog} save={save} onClose={()=>setEditing(null)}/>}
   <div className="catalog-search"><Field label="Keresés (gyártó, család, cikkszám, megnevezés)" value={query} onChange={setQuery}/><label className="copy-option"><input type="checkbox" checked={archived} onChange={e=>setArchived(e.target.checked)}/>Archivált termékek is</label></div>
   {!catalog.products.length?<p className="report-note">A katalógus üres. Vegyél fel terméket, importálj CSV-t, vagy tölts be mintakészletet.</p>:<>
    <div className="catalog-table"><table><thead><tr><th>Megnevezés</th><th>Gyártó / család</th><th>Cikkszám</th><th>Egység</th><th>Anyagár</th><th>Munkadíj</th><th><span className="sr-only">Művelet</span></th></tr></thead><tbody>{found.slice(0,SHOWN).map(p=><tr key={p.id}><td><b>{p.name}</b>{p.sample&&<span className="catalog-badge">Minta</span>}{p.archived&&<span className="catalog-badge">Archivált</span>}</td><td>{[p.manufacturer,p.family].filter(Boolean).join(' ')||'–'}</td><td>{p.sku||'–'}</td><td>{p.unit}</td><td>{priceText(p.price)}</td><td>{priceText(p.labor)}</td><td><button type="button" onClick={()=>{setSource(null);setConfirmSample(false);setEditing(p)}}>Szerkesztés</button></td></tr>)}</tbody></table>{!found.length&&<p className="report-note">Nincs találat.</p>}</div>
    {found.length>SHOWN&&<p className="report-note">Az első 200 találat látható. Pontosítsd a keresést.</p>}</>}
   <div className="catalog-defaults"><h4>Fiók-alapértelmezések (új projektekhez)</h4><p className="report-note">Ezt a terméket ajánlja a Villanyrajz típusonként új projektekben. Beállítani az Árazás / árajánlat fül termékválasztójában lehet.</p>
    {defaults.length?<div className="catalog-table"><table><tbody>{defaults.map(({d,p})=><tr key={d.ref}><td><b>{refLabel(d.ref,d.label)}</b></td><td>{p?productLabel(p):'–'}{p?.archived&&<span className="catalog-badge">Archivált</span>}</td><td><button type="button" onClick={()=>void save(setAccountDefault(catalog,d.ref,null,''),'Fiók-alapértelmezés törölve.')}>Eltávolítás</button></td></tr>)}</tbody></table></div>:<p className="report-note">Még nincs fiók-alapértelmezés.</p>}
   </div>
  </fieldset>}
 </div>;
}

const encodings:Record<CsvEncoding,string>={'utf-8':'UTF-8','utf-16le':'UTF-16 (Unicode szöveg)','windows-1250':'Windows-1250'};
const delimiters={';':'pontosvessző',',':'vessző','\t':'tabulátor'};
function ImportPanel({source,first,catalog,save,onClose}:{source:Source;first:Analysis;catalog:Catalog;save:Save;onClose:()=>void}){
 const [markup,setMarkup]=useState('0'),[gross,setGross]=useState(false),[result,setResult]=useState(first);
 const options=(m:string,g:boolean)=>{setMarkup(m);setGross(g);const n=Number(m);setResult(analyze(source.text,catalog,Number.isFinite(n)?Math.max(0,Math.min(300,n)):0,g))};
 async function run(){
  // Az importálás a pillanatnyi katalógusra fut újra, hogy a közben betöltött változások ne vesszenek el.
  const n=Number(markup),r=analyze(source.text,catalog,Number.isFinite(n)?Math.max(0,Math.min(300,n)):0,gross);setResult(r);
  if(!r.merge){toast.error(r.error||'A CSV nem importálható.');return}
  if(await save(r.merge.catalog,`CSV importálva: ${r.merge.added} új, ${r.merge.updated} módosított termék.`))onClose();
 }
 const {parse,merge,error}=result,errors=parse.errors;
 return <div className="catalog-import"><b>CSV importálása: {source.file}</b>
  <p className="report-note">Kódolás: {encodings[source.encoding]} · Elválasztó: {delimiters[parse.delimiter]}{parse.headerLine?` · Fejléc: ${parse.headerLine}. sor`:''}</p>
  <div className="catalog-import-options"><Field label="Árrés az importált anyagárakra (%)" type="number" min={0} max={300} step={1} value={markup} onChange={v=>options(v,gross)}/><label className="copy-option"><input type="checkbox" checked={gross} onChange={e=>options(markup,e.target.checked)}/>Az árlista bruttó (27% áfát tartalmaz)</label></div>
  {merge&&<p role="status">{merge.added} új, {merge.updated} módosított, {merge.unchanged} változatlan termék; {errors.length} hibás sor kimarad.</p>}
  {!merge&&!errors.length&&<p role="status">A CSV-ben nincs importálható sor.</p>}
  {error&&<p className="auth-error" role="alert">{error}</p>}
  {!!errors.length&&<ul>{errors.slice(0,20).map((e,i)=><li key={i}>{e.line?`${e.line}. sor: `:''}{e.message}</li>)}{errors.length>20&&<li>…és további {errors.length-20} hiba.</li>}</ul>}
  {!!parse.ignored.length&&<p className="report-note">Figyelmen kívül hagyott oszlopok: {parse.ignored.join(', ')}</p>}
  <div className="project-actions"><button type="button" onClick={onClose}>Mégse</button><button type="button" className="primary" disabled={!merge||merge.added+merge.updated===0} onClick={()=>void run()}><FileUp/> Importálás</button></div>
  <details><summary>CSV-formátum</summary><p className="report-note">Oszlopok (a sorrend tetszőleges, a fejléc kötelező, a fejléc fölött legfeljebb 9 címsor lehet): Azonosító; Gyártó; Termékcsalád; Cikkszám; Megnevezés*; Egység* (db vagy m); Nettó anyagár (Ft); Munkadíj (Ft). Ugyanazzal az azonosítóval, vagy azonos gyártóval és cikkszámmal érkező sor a meglévő terméket frissíti, a többi új termék lesz. Hiányzó oszlop vagy üres cella a meglévő értéket nem változtatja. Magyar Excelből a „CSV (pontosvesszővel tagolt)”, a „CSV UTF-8” és a „Unicode szöveg” mentés is működik. A „12.500” alak 12 500 Ft-nak számít. Dobos vagy csomagos árnál előbb számold át egységárra (Ft/m, Ft/db).</p></details>
 </div>;
}

type Text='name'|'manufacturer'|'family'|'sku';
type Draft=Omit<Product,'price'|'labor'>&{price:string;labor:string};
function ProductForm({draft:initial,catalog,save,onClose}:{draft:Product;catalog:Catalog;save:Save;onClose:()=>void}){
 const [draft,setDraft]=useState<Draft>(()=>({...initial,price:initial.price===null?'':String(initial.price),labor:initial.labor===null?'':String(initial.labor)})),[errors,setErrors]=useState<Record<string,string>>({}),[confirm,setConfirm]=useState(false);
 const stored=catalog.products.find(p=>p.id===initial.id);
 const num=(s:string)=>s.trim()===''?null:Number(s);
 async function submit(){
  const now=new Date().toISOString(),r=productSchema.safeParse({...draft,price:num(draft.price),labor:num(draft.labor),sample:false,updatedAt:now},{errorMap:catalogErrorMap});
  if(!r.success){const next:Record<string,string>={};for(const i of r.error.issues){const k=String(i.path[0]);next[k]??=i.message}setErrors(next);return}
  let next:Catalog;try{next=upsertProduct(catalog,r.data,now)}catch(e){setErrors({form:catalogError(e)});return}
  setErrors({});if(await save(next,'A termék mentve.'))onClose();
 }
 async function archive(v:boolean){if(!stored)return;if(await save(setProductArchived(catalog,stored.id,v,new Date().toISOString()),v?'A termék archiválva.':'A termék visszaállítva.'))onClose()}
 async function remove(){if(!stored)return;if(await save(removeProduct(catalog,stored.id),'A termék törölve.'))onClose()}
 const text=(label:string,key:Text,wide=false)=><label className={'field'+(wide?' wide':'')}><span>{label}</span><input aria-label={label} value={draft[key]} maxLength={key==='name'?240:key==='family'?120:key==='sku'?60:80} onChange={e=>setDraft(d=>({...d,[key]:e.target.value}))}/>{errors[key]&&<small className="auth-error">{errors[key]}</small>}</label>;
 const price=(label:string,key:'price'|'labor')=><label className="field"><span>{label}</span><input aria-label={label} type="number" min={0} max={1000000} step={0.01} value={draft[key]} onChange={e=>setDraft(d=>({...d,[key]:e.target.value}))}/>{errors[key]&&<small className="auth-error">{errors[key]}</small>}</label>;
 return <form className="catalog-form" noValidate onSubmit={e=>{e.preventDefault();void submit()}}>
  <b className="wide">{stored?'Termék szerkesztése':'Új termék'}{stored?.sample&&<span className="catalog-badge">Minta</span>}</b>
  {text('Megnevezés*','name',true)}{text('Gyártó','manufacturer')}{text('Termékcsalád','family')}{text('Cikkszám','sku')}
  <label className="field"><span>Egység</span><select aria-label="Egység" value={draft.unit} onChange={e=>setDraft(d=>({...d,unit:e.target.value as Product['unit']}))}><option value="db">db</option><option value="m">m</option></select>{errors.unit&&<small className="auth-error">{errors.unit}</small>}</label>
  {price('Nettó anyagár (Ft/egység)','price')}{price('Munkadíj-javaslat (Ft/egység)','labor')}
  <p className="report-note wide">Üresen hagyott ár = nincs ár; ingyenes tételnél 0-t adj meg.{stored?.sample?' Mentéskor a minta saját termékké válik, és az adatai az ajánlat PDF-jébe is bekerülnek: a „(minta)” jelölés helyett add meg a valós termék nevét.':''}</p>
  {errors.form&&<small className="auth-error wide" role="alert">{errors.form}</small>}
  {confirm&&stored?<div className="project-state-confirm wide"><p>Törlöd: {stored.name}? A már elkészült ajánlatokban a termék pillanatképe és ára megmarad; a fiók-alapértelmezésekből kikerül.</p><div className="project-actions"><button type="button" onClick={()=>setConfirm(false)}>Mégse</button><button type="button" className="danger" onClick={()=>void remove()}><Trash2/> Törlés</button></div></div>
  :<div className="project-actions wide"><button type="submit" className="primary"><Save/> Mentés</button><button type="button" onClick={onClose}>Mégse</button>{stored&&<button type="button" onClick={()=>void archive(!stored.archived)}>{stored.archived?<><RotateCcw/> Visszaállítás</>:<><Archive/> Archiválás</>}</button>}{stored&&<button type="button" className="danger" onClick={()=>setConfirm(true)}><Trash2/> Törlés</button>}</div>}
 </form>;
}
