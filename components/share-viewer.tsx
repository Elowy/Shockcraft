'use client';
import {useEffect,useRef,useState} from 'react';
import {Minus,Moon,Plus,RefreshCw,Sun} from 'lucide-react';
import {Toaster} from '@/components/ui/sonner';
import {toast} from 'sonner';
import {PublicHeader,PublicFooter} from './public-shell';
import {Choice} from './plan-controls';
import {FloorShapes,RoomLabels,ScaleBar,PlanLegend} from './floor-drawing';
import {DimensionMark} from './dimension-mark';
import {PlotEditor} from './plot-editor';
import {SchematicView} from './schematic-view';
import {CircuitReport} from './circuit-report';
import {RouteRegister} from './route-register';
import {PhaseLoadReport} from './phase-load-report';
import {PdfDialog} from './pdf-dialog';
import {boards} from '@/lib/board-size';
import {SHARE_TOKEN_KEY,floorViewBox,readShareToken,type SharedView} from '@/lib/share';
import {ShareError,checkSharedPdf,openSharedPlan} from '@/lib/share-client';
import type {RouteTarget} from '@/lib/route-register';
import type {FloorSelection} from '@/lib/floor-selection';

// Csak olvasható, bejelentkezés nélküli nézet. A token a címsor fragmentjéből jön, utána csak sessionStorage-ban él;
// a szerkesztőt (és annak írási ágait) szándékosan nem importáljuk.
type Tab='plan'|'plot'|'board'|'lists';
type ListTab='circuits'|'routes'|'phases';
type Failure={message:string;retry:boolean};
const tabs:[Tab,string][]=[['plan','Alaprajz'],['plot','Telek'],['board','Elosztó'],['lists','Jegyzékek']];
const listTabs:[ListTab,string][]=[['circuits','Áramkörök'],['routes','Nyomvonalak'],['phases','Fázisterhelés']];
const MISSING='Hiányzó vagy hibás link. Ellenőrizd, hogy a teljes linket nyitottad-e meg, vagy kérj újat a tervezőtől.';
const stamp=(value:string|number)=>new Date(value).toLocaleString('hu-HU',{year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'});
const highlightable=(type:RouteTarget['type']):type is 'rooms'|'devices'|'routes'=>type==='rooms'||type==='devices'||type==='routes';
export default function ShareViewer(){
 const [token,setToken]=useState(''),[view,setView]=useState<SharedView|null>(null),[loading,setLoading]=useState(true),[failure,setFailure]=useState<Failure|null>(null),[dark,setDark]=useState(false);
 const [tab,setTab]=useState<Tab>('plan'),[listTab,setListTab]=useState<ListTab>('circuits'),[bid,setBid]=useState(''),[fid,setFid]=useState(''),[chosenBoard,setChosenBoard]=useState(''),[mode,setMode]=useState<'single'|'multi'>('single'),[zoom,setZoom]=useState(100),[highlight,setHighlight]=useState<FloorSelection|null>(null),[siteRoute,setSiteRoute]=useState('');
 const started=useRef(false),canvas=useRef<HTMLDivElement>(null),pendingScroll=useRef<{x:number;y:number}|null>(null),shown=useRef<SharedView|null>(null);
 function show(next:SharedView|null){shown.current=next;setView(next)}
 async function load(t:string){
  setLoading(true);
  try{const next=await openSharedPlan(t);show(next);setFailure(null)}
  catch(e){
   const message=e instanceof Error?e.message:'A megosztott terv most nem tölthető be. Próbáld újra később.';
   // 404: a link megszűnt vagy szünetel – a tárolt token sem használható tovább.
   if(e instanceof ShareError&&e.status===404){try{sessionStorage.removeItem(SHARE_TOKEN_KEY)}catch{}show(null);setFailure({message,retry:false})}
   // Megnyitott tervnél (Frissítés) a nézet marad, a hiba csak értesítés.
   else if(shown.current)toast.error(message);
   else setFailure({message,retry:true});
  }finally{setLoading(false)}
 }
 // Indulás: téma, token a fragmentből (vagy a lap sessionStorage-ából), majd a token eltávolítása a címsorból.
 function start(){
  let isDark=false;try{const theme=localStorage.getItem('shockcraft-theme');isDark=theme?theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches}catch{}
  document.documentElement.dataset.theme=isDark?'dark':'light';setDark(isDark);
  const fromHash=readShareToken(location.hash);let current=fromHash;
  try{if(fromHash)sessionStorage.setItem(SHARE_TOKEN_KEY,fromHash);else current=readShareToken('#t='+(sessionStorage.getItem(SHARE_TOKEN_KEY)||''))}catch{}
  // A token ne maradjon a címsorban, az előzményekben vagy egy továbbmásolt URL-ben.
  if(location.hash)window.history.replaceState(null,'',location.pathname);
  setToken(current);
  if(current)void load(current);else{setLoading(false);setFailure({message:MISSING,retry:false})}
 }
 // Egyszer, mountkor fut; a ref-őr a fejlesztői kettős futtatást is kiszűri.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 useEffect(()=>{if(started.current)return;started.current=true;start()},[]);
 // Új link ugyanabban a lapon: ha csak a fragment változik, a böngésző nem tölti újra az oldalt.
 useEffect(()=>{
  const onHash=()=>{const next=readShareToken(location.hash);if(location.hash)window.history.replaceState(null,'',location.pathname);if(!next)return;try{sessionStorage.setItem(SHARE_TOKEN_KEY,next)}catch{}setToken(next);show(null);setFailure(null);setHighlight(null);setSiteRoute('');void load(next)};
  window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 useEffect(()=>{
  const target=pendingScroll.current,el=canvas.current;if(!target||!el||tab!=='plan')return;pendingScroll.current=null;
  const f=view?.plan.buildings.find(b=>b.id===bid)?.floors.find(f=>f.id===fid);if(!f)return;const vb=floorViewBox(f);
  requestAnimationFrame(()=>{el.scrollTo({left:Math.max(0,(target.x-vb.x)/vb.w*el.scrollWidth-el.clientWidth/2),top:Math.max(0,(target.y-vb.y)/vb.h*el.scrollHeight-el.clientHeight/2)})});
 },[tab,bid,fid,zoom,highlight,view]);
 function toggleTheme(){setDark(v=>{const next=!v;document.documentElement.dataset.theme=next?'dark':'light';try{localStorage.setItem('shockcraft-theme',next?'dark':'light')}catch{}return next})}
 const pdfAccess=async()=>{const r=await checkSharedPdf(token);if(!r.allowed)toast.error(r.error||'A letöltés most nem érhető el.');return r.allowed};
 const plan=view?.plan,building=plan?.buildings.find(b=>b.id===bid)||plan?.buildings[0],floor=building?.floors.find(f=>f.id===fid)||building?.floors[0];
 const boardList=boards(building),boardId=boardList.some(b=>b.id===chosenBoard)?chosenBoard:'';
 function chooseBuilding(id:string){setBid(id);setFid('');setChosenBoard('');setHighlight(null)}
 function locate(r:RouteTarget){
  if(r.type==='siteRoutes'){setSiteRoute(r.id);setTab('plot');return}
  setBid(r.buildingId);
  if(r.type==='modules'){setChosenBoard(plan?.modules.find(m=>m.id===r.id)?.board||'');setTab('board');return}
  setFid(r.floorId);setHighlight(highlightable(r.type)?{type:r.type,id:r.id}:null);setTab('plan');setZoom(z=>Math.max(z,200));pendingScroll.current={x:r.x,y:r.y};
 }
 const pdfView=tab==='plot'?'plot':tab==='board'?mode:'plan';
 function floorTab(){
  if(!plan||!building||!floor)return <p className="share-note">A megosztott tervben még nincs épület vagy szint.</p>;
  const vb=floorViewBox(floor);
  return <div className="share-section">
   <div className="share-controls">
    {plan.buildings.length>1&&<Choice label="Épület" value={building.id} onChange={chooseBuilding} items={plan.buildings.map(b=>[b.id,b.name])}/>}
    <Choice label="Szint" value={floor.id} onChange={v=>{setFid(v);setHighlight(null)}} items={[...building.floors].sort((a,b)=>b.elevation-a.elevation).map(f=>[f.id,f.name])}/>
    <div className="share-zoom" role="group" aria-label="Nagyítás"><button aria-label="Kicsinyítés" disabled={zoom<=100} onClick={()=>setZoom(z=>Math.max(100,z-50))}><Minus/></button><span>{zoom}%</span><button aria-label="Nagyítás" disabled={zoom>=400} onClick={()=>setZoom(z=>Math.min(400,z+50))}><Plus/></button></div>
   </div>
   {view?.backgroundFloors.includes(floor.id)&&<p className="share-note">Ezen a szinten háttéralaprajz is van; a megosztott nézetben nem jelenik meg.</p>}
   <div className="share-canvas" ref={canvas} tabIndex={0} aria-label="Görgethető alaprajz">
    <svg viewBox={vb.x+' '+vb.y+' '+vb.w+' '+vb.h} style={{width:zoom+'%',maxHeight:zoom===100?'calc(75dvh - 2px)':undefined}} role="img" aria-label={'Alaprajz: '+building.name+' / '+floor.name}>
     <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill="var(--plan-bg)"/>
     <FloorShapes floor={floor} isSelected={(t,id)=>highlight?.type===t&&highlight.id===id}/>
     {(floor.dimensions||[]).map(d=><DimensionMark key={d.id} dimension={d} handles={false}/>)}
     <RoomLabels floor={floor}/>
     <ScaleBar x={vb.x+24} y={vb.y+vb.h-24}/>
    </svg>
   </div>
   <PlanLegend/>
  </div>;
 }
 function boardTab(){
  if(!plan||!building)return <p className="share-note">A megosztott tervben még nincs épület vagy szint.</p>;
  return <div className="share-section">
   <div className="share-controls">
    <Choice label="Épület" value={building.id} onChange={chooseBuilding} items={plan.buildings.map(b=>[b.id,b.name])}/>
    <Choice label="Elosztó" value={boardId} onChange={setChosenBoard} items={boardList.map(b=>[b.id,b.name])}/>
    <Choice label="Rajz" value={mode} onChange={v=>setMode(v==='multi'?'multi':'single')} items={[['single','Egyvonalas'],['multi','Többvonalas']]}/>
   </div>
   <SchematicView key={building.id+mode+boardId} plan={plan} buildingId={building.id} boardId={boardId} mode={mode} requireAccess={view?.pdf?pdfAccess:undefined}/>
  </div>;
 }
 function listsTab(){
  if(!plan)return null;
  return <div className="share-section">
   <div className="share-tabs" role="group" aria-label="Jegyzékek">{listTabs.map(([id,label])=><button key={id} className={listTab===id?'active':''} aria-pressed={listTab===id} onClick={()=>setListTab(id)}>{label}</button>)}</div>
   {listTab==='circuits'?<CircuitReport plan={plan} onLocate={locate}/>:listTab==='routes'?<RouteRegister plan={plan} onLocate={locate}/>:<PhaseLoadReport plan={plan}/>}
  </div>;
 }
 return <div className="share-site"><PublicHeader/><main className="share-page">
  {loading&&!view&&<p className="share-note" role="status">Megosztott terv betöltése…</p>}
  {failure&&!view&&<div className="share-failure"><p className="auth-error" role="alert">{failure.message}</p>{failure.retry&&<button disabled={loading} onClick={()=>void load(token)}><RefreshCw/> Újrapróbálás</button>}</div>}
  {plan&&view&&<>
   <div className="share-head">
    <div><h1>{plan.name}</h1><p className="share-meta">Csak megtekinthető terv · Utoljára mentve: {stamp(view.updatedAt)} · A link érvényes: {stamp(view.expiresAt)}-ig</p></div>
    <div className="share-actions">
     <button disabled={loading} onClick={()=>void load(token)}><RefreshCw/> {loading?'Frissítés…':'Frissítés'}</button>
     {view.pdf&&<PdfDialog plan={plan} buildingId={building?.id||''} floorId={floor?.id||''} boardId={boardId} view={pdfView} requireAccess={pdfAccess} note="A PDF a megosztott terv legutóbb mentett változatából készül, árajánlat és háttéralaprajz nélkül."/>}
     <button className="iconbutton" aria-label={dark?'Világos mód':'Sötét mód'} title={dark?'Világos mód':'Sötét mód'} onClick={toggleTheme}>{dark?<Sun/>:<Moon/>}</button>
    </div>
   </div>
   <p className="share-notice" role="note">Ezt a tervet egy Villanyrajz-felhasználó osztotta meg veled. A tartalmáért a megosztó felel. Ezen az oldalon soha nem kérünk jelszót vagy fizetési adatot. <a href={'mailto:info@luiz-tech.hu?subject='+encodeURIComponent('Visszaélés bejelentése – megosztott terv')}>Visszaélés bejelentése</a></p>
   <div className="share-tabs" role="group" aria-label="Nézet">{tabs.map(([id,label])=><button key={id} className={tab===id?'active':''} aria-pressed={tab===id} onClick={()=>setTab(id)}>{label}</button>)}</div>
   {tab==='plan'?floorTab():tab==='plot'?<div className="share-plot"><PlotEditor readOnly key={'plot:'+siteRoute} plan={plan} change={()=>{}} buildingId={building?.id||''} floorId={floor?.id||''} initialRouteId={siteRoute||undefined} onPanel={()=>{}} onBuilding={()=>{}} undo={()=>{}} redo={()=>{}} canUndo={false} canRedo={false}/></div>:tab==='board'?boardTab():listsTab()}
   <p className="report-note">Csak olvasható nézet. A terv nem helyettesíti a szakember helyszíni ellenőrzését.</p>
  </>}
 </main><PublicFooter/><Toaster position="top-center"/></div>;
}
