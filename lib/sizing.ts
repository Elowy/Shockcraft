// Méretezési segédszámítás (tervezői ellenőrzést segítő, tájékoztató számítás).
// Tiszta modul: a tervet nem módosítja, kivéve a set*/upsert*/remove* segédeket (a szerkesztő change() draftján hívandók).
// Minden számérték és forrás a lib/sizing-tables.ts-ben van; itt csak a képletek és a kiértékelés.
import {circuitLoad} from './phase-load';
import {floorLength,floorPoints} from './geometry';
import {boards,boardName,inBoard} from './board-size';
import {planSchema,type Plan,type Floor} from './plan';
import type {SearchResult} from './plan-tools';
import {SIZING_TABLES as T,SECTIONS,capacity,temperatureFactor,groupingFactor,dropLimitRef,constantRef,conventionalRef,deviceSource,instantaneousRef,reviewText,type InstallMethod,type Insulation,type TableRef} from './sizing-tables';
import {SIZING_DISCLAIMER,SIZING_NOT_COVERED,fmtNum,atMost,fmtPair,fmtLimitPair,loopRemedies,cableLabel,parseCable,designCurrent,correctedIz,voltageDropPercent,loopResistance,maxLoopImpedance,maxLengthForDrop,minSectionFor,type CableSpec,type CableParse,type CableError} from './sizing-formulas';
import {circuitSizingSchema,overrideKey,planSizingSchema,type CircuitSizing,type PlanSizing,type IzOverrideEntry} from './sizing-schema';

// A képletek, a kábeljelölés-értelmezés és a felelősségi szövegek a lib/sizing-formulas.ts-ben vannak (zod nélkül, a kalkulátorok is használják); itt változatlan néven re-exportáljuk.
export {SIZING_DISCLAIMER,SIZING_DISCLAIMER_SHORT,SIZING_NOT_COVERED,fmtNum,atMost,fmtPair,fmtLimit,fmtLimitPair,loopRemedies,cableMessages,cableLabel,parseCable,designCurrent,correctedIz,voltageDropPercent,loopResistance,maxLoopImpedance,maxLengthForDrop,minSectionFor,type CableSpec,type CableParse,type CableError} from './sizing-formulas';
const LARGEST=SECTIONS[SECTIONS.length-1];

// ---------------------------------------------------------------- 3.1 Szövegek
export const statusLabels={ok:'Számítás szerint megfelel',warn:'Figyelmeztetés',fail:'Nem felel meg',na:'Nem számítható'} as const;
/** Ellenőrzésszintű címkék: az „ok” itt csak azt jelenti, hogy az adott feltétel teljesül / az adat rendben van. */
export const checkStatusLabels={...statusLabels,ok:'Rendben',skipped:'Nem vizsgált'} as const;
/** A PDF-táblák jelmagyarázata. */
export const SIZING_PDF_LEGEND='* = feltételezett érték; ≈ = becsült terhelés; n. sz. = nem számítható; – = nem vizsgált / nincs adat';
/** Tizedes szám a beviteli mezőből: vessző vagy pont, szóközzel tagolt ezresek („1 000”). Üres → null, hibás → NaN. */
export function parseDecimalInput(text:string):number|null{
 let t=text.trim().replace(/[\u00a0\u202f]/g,' ');if(!t)return null;
 if(/^\d{1,3}(?: \d{3})+(?:[.,]\d+)?$/.test(t))t=t.replace(/ /g,'');
 return /^(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(t)?Number(t.replace(',','.')):NaN;
}

// ---------------------------------------------------------------- 3.2 Típusok
export type SizingStatus='ok'|'warn'|'fail'|'na';export type CheckStatus=SizingStatus|'skipped';
export type Provenance='megadott'|'projekt'|'kábeljelölés'|'automatikus'|'alapérték';
export type Valued<T>={value:T;source:Provenance};
export type SizingCheckCode='cable'|'section'|'cores'|'length'|'design-current'|'overload'|'i2'|'voltage-drop'|'loop';
export type SizingCheck={code:SizingCheckCode;status:CheckStatus;title:string;clause:string;formula:string;calculation:string;detail:string};
export type Assumption={text:string;strong:boolean}; // strong = nem konzervatív, kiemelt
export type SizingSegment={routeId:string|null;floorId:string|null;name:string;mode:'inside'|'outside';length:number;cable:CableSpec|null;cableSource:'nyomvonal'|'áramkör'|null;method:Valued<InstallMethod>;insulation:Valued<Insulation>;iz0:number|null;iz:number|null;panelLinked:boolean;target:SearchResult|null};
export type CircuitSizingResult={circuitId:string;name:string;buildingId:string;boardId:string;phase:'L1'|'L2'|'L3'|'3P';loaded:2|3;status:SizingStatus;label:string;cableText:string;cable:CableSpec|null;segments:SizingSegment[];governing:SizingSegment|null;watts:number;ib:number;ibSource:'megadott'|'becsült';rating:number;curve:'B'|'C'|'D';device:'MCB'|'RCBO';deviceAssumed:boolean;rcd:boolean;ambient:Valued<number>;kTemp:number;grouped:Valued<number>;kGroup:number;iz:number|null;length:number|null;lengthSource:'megadott'|'nyomvonalak'|null;usage:Valued<'lighting'|'other'>;cosPhi:Valued<number>;dropCurrent:number;dropCurrentSource:'Ib'|'In';drop:number|null;upstreamDrop:Valued<number>;dropTotal:number|null;dropLimit:number;zsBoard:number|null;zs:number|null;zsMax:number;checks:SizingCheck[];assumptions:Assumption[];refs:TableRef[]};
type Route=Floor['routes'][number];

/** Az áramkör eredménycímkéje. „Megfelel” esetén jelzi a feltételezéseket és az el nem végzett ellenőrzéseket (Ib ≤ In terhelés nélkül, hurokimpedancia Zs nélkül vagy TT-rendszerben). */
export function resultLabel(r:{status:SizingStatus;assumptions:readonly Assumption[];checks?:readonly SizingCheck[]}){
 if(r.status!=='ok')return statusLabels[r.status];
 const skipped=(r.checks??[]).filter(c=>c.status==='skipped'&&(c.code==='design-current'||c.code==='loop')).map(c=>c.code==='loop'?'hurokimpedancia':c.title);
 const notes=[r.assumptions.length?'feltételezésekkel':'',skipped.length?'nem vizsgált: '+skipped.join(', '):''].filter(Boolean);
 return statusLabels.ok+(notes.length?' – '+notes.join('; '):'');
}

/** Ezeknél a kábelt nem helyettesítjük a nyomvonal / az áramkör (réz, azonos erű) kábelével: más vezetőről szólna a számítás. */
const BLOCKING:ReadonlySet<CableError>=new Set<CableError>(['aluminium','rubber','reduced','large']);
const blocks=(p:CableParse)=>!p.ok&&BLOCKING.has(p.code);


// ---------------------------------------------------------------- 3.5 Kiértékelés
export type SizingContext={routes:Map<string,{route:Route;floor:Floor}[]>;lighting:Set<string>;devices:Map<string,{device:Floor['devices'][number];floor:Floor}>};
/** Egy bejárással: áramkörönkénti nyomvonalak, világítási áramkörök és az első szerelvény. */
export function sizingContext(plan:Plan):SizingContext{
 const routes=new Map<string,{route:Route;floor:Floor}[]>(),lighting=new Set<string>(),devices=new Map<string,{device:Floor['devices'][number];floor:Floor}>();
 for(const b of plan.buildings)for(const f of b.floors){
  for(const r of f.routes)if(r.circuit){const list=routes.get(r.circuit);if(list)list.push({route:r,floor:f});else routes.set(r.circuit,[{route:r,floor:f}])}
  for(const d of f.devices)if(d.circuit){if(d.kind==='light')lighting.add(d.circuit);if(!devices.has(d.circuit))devices.set(d.circuit,{device:d,floor:f})}
 }
 return {routes,lighting,devices};
}
const center=(pts:{x:number;y:number}[])=>({x:pts.reduce((s,p)=>s+p.x,0)/pts.length,y:pts.reduce((s,p)=>s+p.y,0)/pts.length});
const worst=(list:CheckStatus[]):SizingStatus=>list.includes('fail')?'fail':list.includes('na')?'na':list.includes('warn')?'warn':'ok';
const tag=(r:TableRef)=>'['+r.short+' · '+r.status+']';
const pct=(n:number)=>fmtNum(n)+'%';
const quoted=(s:string)=>'„'+s+'”';

export function circuitSizing(plan:Plan,circuitId:string,ctx:SizingContext=sizingContext(plan)):CircuitSizingResult|null{
 // 1. Alapadatok
 const c=plan.circuits.find(c=>c.id===circuitId);if(!c)return null;
 const b=plan.buildings.find(b=>b.id===c.building);if(!b)return null;
 const boardId=c.board||'',S:PlanSizing=plan.sizing??{},cs:CircuitSizing=c.sizing??{};
 const loaded:2|3=c.phase==='3P'?3:2,bf=c.phase==='3P'?1:2;
 // 2. Védelmi készülék
 const protection=plan.modules.find(m=>m.building===b.id&&m.circuit===c.id&&(m.type==='MCB'||m.type==='RCBO'));
 const device:'MCB'|'RCBO'=protection?.type==='RCBO'?'RCBO':'MCB',deviceAssumed=!protection,rcd=!!c.rcd.trim()||protection?.type==='RCBO';
 const deviceStd=deviceSource(device).standard,deviceName=device==='RCBO'?'a kombinált védelem (RCBO)':'a kismegszakító';
 // 3. Terhelés (a teljesítmény a fázisterhelés-összesítéssel közös; az áram az U0-val a sizing-tables.ts-ből)
 const load=circuitLoad(plan,c);
 const cosPhi:Valued<number>=cs.cosPhi!==undefined?{value:cs.cosPhi,source:'megadott'}:{value:1,source:'alapérték'};
 const ib=designCurrent(load.watts,c.phase,cosPhi.value),ibSource=load.estimated?'becsült' as const:'megadott' as const;
 const noLoad=load.estimated&&load.watts===0;
 // 4–5. Szakaszok
 const cp=parseCable(c.cable),entries=ctx.routes.get(c.id)??[],real=entries.length>0;
 // Alumínium, gumiszigetelésű, csökkentett erű vagy túl nagy keresztmetszetű áramköri kábelnél a nyomvonalak (réz) kábelével sem számolunk.
 const cpBlocked=blocks(cp);
 const insulationOf=(cable:CableSpec|null):Valued<Insulation>=>cs.insulation?{value:cs.insulation,source:'megadott'}:cable?.insulation?{value:cable.insulation,source:'kábeljelölés'}:S.insulation?{value:S.insulation,source:'projekt'}:{value:'PVC',source:'alapérték'};
 const ambient:Valued<number>=cs.ambient!==undefined?{value:cs.ambient,source:'megadott'}:S.ambient!==undefined?{value:S.ambient,source:'projekt'}:{value:30,source:'alapérték'};
 const grouped:Valued<number>=cs.grouped!==undefined?{value:cs.grouped,source:'megadott'}:S.grouped!==undefined?{value:S.grouped,source:'projekt'}:{value:1,source:'alapérték'};
 const group=groupingFactor(grouped.value);
 type Meta={seg:SizingSegment;rp:CableParse|null;cap:ReturnType<typeof capacity>;temp:ReturnType<typeof temperatureFactor>};
 const metas:Meta[]=[];
 const finish=(seg:Omit<SizingSegment,'insulation'|'iz0'|'iz'>,rp:CableParse|null)=>{
  const insulation=insulationOf(seg.cable),cap=seg.cable?capacity(seg.method.value,insulation.value,loaded,seg.cable.section,S.overrides):null,temp=temperatureFactor(insulation.value,ambient.value);
  const iz0=cap?.value??null;
  metas.push({seg:{...seg,insulation,iz0,iz:iz0===null?null:correctedIz(iz0,temp.value,group.value)},rp,cap,temp});
 };
 for(const {route:r,floor:f} of entries){
  const rp=parseCable(r.cable);
  // Alumínium, gumi, csökkentett erű vagy 35 mm² feletti nyomvonal-kábelnél nem cseréljük az áramkör (réz) kábelére: más vezetőről szólna a számítás.
  const cable=cpBlocked?null:rp.ok?rp.cable:!blocks(rp)&&cp.ok?cp.cable:null,cableSource=!cable?null:rp.ok?'nyomvonal' as const:'áramkör' as const;
  const projectMethod=r.mode==='inside'?S.methodInside:S.methodOutside;
  const method:Valued<InstallMethod>=cs.method?{value:cs.method,source:'megadott'}:projectMethod?{value:projectMethod,source:'projekt'}:{value:'B2',source:'alapérték'};
  const panelLinked=[r.startId,r.endId].some(id=>!!id&&f.devices.some(d=>d.id===id&&d.kind==='panel'&&(d.board||'')===boardId));
  const pts=floorPoints(r,f),mid=center(pts);
  finish({routeId:r.id,floorId:f.id,name:r.name,mode:r.mode,length:floorLength(r,f).total,cable,cableSource,method,panelLinked,target:{id:r.id,type:'routes',buildingId:b.id,floorId:f.id,title:r.name,subtitle:b.name+' / '+f.name+' · Nyomvonal',x:mid.x,y:mid.y}},rp);
 }
 if(!real){
  const method:Valued<InstallMethod>=cs.method?{value:cs.method,source:'megadott'}:S.methodInside?{value:S.methodInside,source:'projekt'}:{value:'B2',source:'alapérték'};
  finish({routeId:null,floorId:null,name:'Nyomvonal nélkül (áramkör kábele)',mode:'inside',length:0,cable:cp.ok?cp.cable:null,cableSource:cp.ok?'áramkör':null,method,panelLinked:false,target:null},null);
 }
 const segments=metas.map(m=>m.seg);
 // 6. Tényezők
 const iz=segments.some(s=>s.iz===null)?null:Math.min(...segments.map(s=>s.iz!));
 const govIndex=iz===null?-1:segments.findIndex(s=>s.iz===iz),gov=govIndex<0?null:metas[govIndex];
 const governing=gov?.seg??null,kTemp=(gov??metas[0]).temp.value,kGroup=group.value;
 // 7. Hossz
 const length=cs.length!==undefined?cs.length:real?segments.reduce((s,x)=>s+x.length,0):null;
 const lengthSource=cs.length!==undefined?'megadott' as const:real?'nyomvonalak' as const:null;
 // 8. Felhasználás és határ
 const usage:Valued<'lighting'|'other'>=cs.usage?{value:cs.usage,source:'megadott'}:ctx.lighting.has(c.id)?{value:'lighting',source:'automatikus'}:{value:'other',source:'alapérték'};
 const supply=S.supply??'public',limitRef=dropLimitRef(supply,usage.value),dropLimit=limitRef.value;
 // 9. Elosztó-beállítás
 const bc=S.boards?.find(x=>x.building===b.id&&x.board===boardId);
 const upstreamDrop:Valued<number>=bc?.upstreamDrop!==undefined?{value:bc.upstreamDrop,source:'megadott'}:{value:0,source:'alapérték'};
 const zsBoard=bc?.zs??null;
 // 10. Feszültségesés. Becsült terhelésnél a védelem In-je és a becsült Ib közül a nagyobb (kedvezőtlen eset).
 const dropCurrent=load.estimated?Math.max(c.rating,ib):ib,dropCurrentSource=load.estimated&&c.rating>=ib?'In' as const:'Ib' as const;
 // Mértékadó keresztmetszet: a szakaszok legkisebbike (nyomvonal nélkül az áramkör kábele). Hossz-felülírásnál ezzel számolunk (konzervatív).
 const missingSection=segments.some(s=>!s.cable),sections=missingSection?[]:segments.map(s=>s.cable!.section);
 const govA=sections.length?Math.min(...sections):null,mixedSections=new Set(sections).size>1;
 const override=cs.length!==undefined;
 const terms=length===null||govA===null?null:override?[{name:'',L:length,A:govA}]:segments.map(s=>({name:s.name,L:s.length,A:s.cable!.section}));
 const drop=terms?terms.reduce((sum,t)=>sum+voltageDropPercent({b:bf,length:t.L,current:dropCurrent,section:t.A,cosPhi:cosPhi.value}),0):null;
 const dropTotal=drop===null?null:drop+upstreamDrop.value;
 // 11. Hurokimpedancia
 const earthing=S.earthing??'TN',zsMax=maxLoopImpedance(c.curve,c.rating);
 const zs=zsBoard===null||!terms?null:zsBoard+terms.reduce((sum,t)=>sum+loopResistance(t.L,t.A),0);
 const loopComputed=earthing==='TN'&&zs!==null;

 // 12. Ellenőrzések
 const checks:SizingCheck[]=[];
 const add=(code:SizingCheckCode,status:CheckStatus,title:string,clause:string,formula:string,calculation:string,detail:string)=>checks.push({code,status,title,clause,formula,calculation,detail});
 const recognised=[...new Set(segments.filter(s=>s.cable).map(s=>cableLabel(s.cable!)+(s.cable!.insulation?', '+s.cable!.insulation:'')))];
 const recognisedText=recognised.length?'Felismert: '+recognised.join('; '):'';
 {// cable
  const missing=metas.filter(m=>!m.seg.cable);
  if(cpBlocked)add('cable','na','Kábeljelölés','–','',recognisedText,'Az áramkör kábele: '+(cp.ok?'':cp.message)+(real?' A nyomvonalak kábeljelölésével nem helyettesítjük: a számítás más vezetőről szólna.':''));
  else if(missing.length){
   const details=missing.map(m=>m.seg.routeId===null||!m.rp?'Az áramkör kábele: '+(cp.ok?'':cp.message):quoted(m.seg.name)+' nyomvonal: '+(m.rp.ok?'':m.rp.message)+(blocks(m.rp)||cp.ok?'':' Az áramkör kábele: '+cp.message));
   add('cable','na','Kábeljelölés','–','',recognisedText,details.join(' '));
  }else{
   const warns:string[]=[];
   if(!cp.ok&&cp.code!=='empty')warns.push('Az áramkör kábeljelölése ('+quoted(c.cable.trim())+') nem értelmezhető: '+cp.message+' A nyomvonalak kábelével számoltunk.');
   for(const m of metas){
    if(m.rp&&!m.rp.ok&&m.rp.code!=='empty')warns.push(quoted(m.seg.name)+' nyomvonal kábeljelölése ('+quoted(entries.find(e=>e.route.id===m.seg.routeId)!.route.cable.trim())+') nem értelmezhető; az áramkör kábelével számoltunk.');
    else if(m.rp?.ok&&cp.ok&&m.rp.cable.section!==cp.cable.section)warns.push(quoted(m.seg.name)+' nyomvonal keresztmetszete ('+fmtNum(m.rp.cable.section)+' mm²) eltér az áramkörétől ('+fmtNum(cp.cable.section)+' mm²); '+(override?'a megadott mértékadó hossz miatt a feszültségesést és a hurokimpedanciát a legkisebb ('+fmtNum(govA!)+' mm²) keresztmetszettel számoltuk.':'szakaszonként a saját értékével számoltunk.'));
   }
   add('cable',warns.length?'warn':'ok','Kábeljelölés','–','',recognisedText,warns.join(' '));
  }
 }
 const cabled=segments.filter(s=>s.cable);
 {// section
  const minRef=constantRef('minSection'),title='Legkisebb keresztmetszet',clause='MSZ HD 60364-5-52 524.1, 52.2 táblázat',formula='A ≥ '+fmtNum(T.minSection)+' mm² (réz)';
  if(!cabled.length)add('section','skipped',title,clause,formula,'','Nincs értelmezhető kábeljelölés.');
  else{const a=Math.min(...cabled.map(s=>s.cable!.section)),ok=a>=T.minSection;
   add('section',ok?'ok':'fail',title,clause,formula,'A = '+fmtNum(a)+' mm² '+(ok?'≥':'<')+' '+fmtNum(minRef.value)+' mm²',ok?'':'Rézvezetőnél erősáramú és világítási áramkörben a legkisebb keresztmetszet '+fmtNum(T.minSection)+' mm².')}
 }
 {// cores
  const withCores=cabled.filter(s=>s.cable!.cores!==null),need=c.phase==='3P'?5:3;
  if(!cabled.length)add('cores','skipped','Erek száma','–','','','Nincs értelmezhető kábeljelölés.');
  else if(!withCores.length)add('cores','skipped','Erek száma','–','','','Egyerű vezetékeknél (pl. MCu) az erek száma nem ellenőrizhető.');
  else{const n=Math.min(...withCores.map(s=>s.cable!.cores!)),ok=n>=need;
   add('cores',ok?'ok':'warn','Erek száma','–','',n+' ér '+(ok?'≥':'<')+' '+need+(c.phase==='3P'?' (L1, L2, L3, N, PE)':' (L, N, PE)'),ok?'':c.phase==='3P'?'Háromfázisú áramkörhöz 5 ér (L1, L2, L3, N, PE) szükséges; N nélküli fogyasztónál 4 ér is elegendő lehet.':'Egyfázisú áramkörhöz legalább 3 ér (L, N, PE) szükséges.')}
 }
 {// length
  const sum='Σ nyomvonalhossz = '+fmtNum(segments.reduce((s,x)=>s+x.length,0),2)+' m (soros összegzés; elágazásnál felülbecsül)';
  if(length===null)add('length','na','Mértékadó hossz','–','','','Nincs az áramkörhöz rendelt alaprajzi nyomvonal és nincs megadott hossz.');
  else if(override)add('length','ok','Mértékadó hossz','–','','L = '+fmtNum(length)+' m (megadott mértékadó hossz)',real?'A megadott hossz felülírja a nyomvonalak összegét ('+fmtNum(segments.reduce((s,x)=>s+x.length,0))+' m).':'');
  else{
   const warns:string[]=[];
   if(!segments.some(s=>s.panelLinked))warns.push('Egyik nyomvonal sem csatlakozik az elosztó alaprajzi jeléhez; a hossz hiányos lehet. Kösd a nyomvonalat az elosztójelhez, vagy add meg a mértékadó hosszt.');
   if(new Set(segments.map(s=>s.floorId)).size>1)warns.push('Az áramkör több szinten fut; a szintek közötti szakasz nincs a tervben.');
   add('length',warns.length?'warn':'ok','Mértékadó hossz','–','',sum,warns.join(' '));
  }
 }
 const est='A terhelés nincs megadva; a szerelvényekből becsült értékkel számoltunk.';
 {// design-current
  const title='Ib ≤ In',clause='MSZ HD 60364-4-43 433.1 (1)',formula='Ib = P / (n · U0 · cos φ)',n=c.phase==='3P'?3:1;
  if(noLoad)add('design-current','skipped',title,clause,formula,'','Nincs megadott terhelés, és a hozzárendelt szerelvényekből sem becsülhető: az Ib ≤ In feltétel nem vizsgálható. Add meg a terhelést.');
  else{const over=!atMost(ib,c.rating),[ibT,inT]=fmtPair(ib,c.rating);
   add('design-current',over?(load.estimated?'warn':'fail'):'ok',title,clause,formula,
    'Ib = '+fmtNum(load.watts,0)+' W / ('+n+' · '+fmtNum(T.u0)+' V · '+fmtNum(cosPhi.value)+') '+(load.estimated?'≈ ':'= ')+ibT+' A '+(over?'>':'≤')+' In = '+inT+' A',
    [load.estimated?est:'',over?'A tervezett terhelési áram nagyobb a védelem névleges áramánál.':''].filter(Boolean).join(' '))}
 }
 const izCalc=gov?'Iz0 = '+fmtNum(gov.seg.iz0!)+' A '+tag(gov.cap!.ref)+' · kθ = '+fmtNum(gov.temp.value)+' '+tag(gov.temp.ref)+' · kcs = '+fmtNum(kGroup)+' '+tag(group.ref)+' = '+fmtNum(iz!)+' A':'';
 const govNote=governing&&segments.length>1?'Mértékadó szakasz: '+quoted(governing.name)+'.':'';
 const izMissing=()=>{
  if(cpBlocked&&!cp.ok)return 'A terhelhetőség nem határozható meg: az áramkör kábele – '+cp.message;
  const m=metas.find(m=>m.seg.iz===null)!;if(!m.seg.cable)return 'A terhelhetőség nem határozható meg: '+(m.seg.routeId?quoted(m.seg.name)+' nyomvonal kábele nem értelmezhető.':'az áramkör kábele nem értelmezhető.');
  return 'A terhelhetőség nem határozható meg: a '+fmtNum(m.seg.cable.section)+' mm² keresztmetszet nem szerepel a táblázatban ('+fmtNum(SECTIONS[0])+'–'+fmtNum(LARGEST)+' mm²).';
 };
 const k=T.conventionalFactor,i2Title='I2 ≤ '+fmtNum(k)+' · Iz',i2Clause='MSZ HD 60364-4-43 433.1 (2); '+deviceStd,i2Formula='I2 = '+fmtNum(k)+' · In ≤ '+fmtNum(k)+' · Iz';
 {// overload
  if(iz===null)add('overload','na','In ≤ Iz','MSZ HD 60364-4-43 433.1 (1)','In ≤ Iz = Iz0 · kθ · kcs','',izMissing());
  else{const ok=atMost(c.rating,iz),[inT,izT]=fmtPair(c.rating,iz);let detail=govNote;
   if(!ok){const g=gov!.seg,min=minSectionFor(c.rating,g.method.value,g.insulation.value,loaded,kTemp,kGroup,S.overrides);
    detail=[govNote,'A védelem névleges árama nagyobb a vezeték javított terhelhetőségénél.',min!==null?'Lehetséges megoldás: legalább '+fmtNum(min)+' mm² keresztmetszet ugyanilyen szerelési móddal, vagy kisebb névleges áramú védelem (ha Ib ≤ In teljesül). A választást a tervező ellenőrzi.':'Lehetséges megoldás: kisebb névleges áramú védelem (ha Ib ≤ In teljesül) vagy kedvezőbb szerelési mód; '+fmtNum(LARGEST)+' mm²-ig nincs megfelelő keresztmetszet ezzel a móddal. A választást a tervező ellenőrzi.'].filter(Boolean).join(' ')}
   add('overload',ok?'ok':'fail','In ≤ Iz','MSZ HD 60364-4-43 433.1 (1)','In ≤ Iz = Iz0 · kθ · kcs',izCalc+'; In = '+inT+' A '+(ok?'≤':'>')+' '+izT+' A',detail)}
 }
 {// i2
  if(iz===null)add('i2','na',i2Title,i2Clause,i2Formula,'',izMissing());
  else{const ok=atMost(k*c.rating,k*iz),[aT,bT]=fmtPair(k*c.rating,k*iz);
   add('i2',ok?'ok':'fail',i2Title,i2Clause,i2Formula,'I2 = '+fmtNum(k)+' · '+c.rating+' = '+aT+' A '+(ok?'≤':'>')+' '+fmtNum(k)+' · '+fmtNum(iz)+' = '+bT+' A',(deviceAssumed?'Kismegszakító feltételezve: ':device==='RCBO'?'Kombinált védelemnél (RCBO) ':'Kismegszakítónál ')+'I2 = '+fmtNum(k)+' · In ('+deviceStd+'), ezért ez a feltétel az In ≤ Iz feltétellel együtt '+(ok?'teljesül.':'sérül; a megoldás ugyanaz.'))}
 }
 const limitText=' ('+(usage.value==='lighting'?'világítás':'egyéb')+', '+(supply==='public'?'közcélú hálózat':'saját táppont')+')';
 {// voltage-drop
  const formula=bf+' · L · I · (ρ1 · cos φ / A + λ · sin φ) / U0 · 100';
  if(drop===null)add('voltage-drop','na','Feszültségesés','MSZ HD 60364-5-52 525, G.52.1, G.52.2','ΔU = '+formula,'',length===null?'A feszültségesés a mértékadó hossz nélkül nem számítható.':'A feszültségesés nem számítható: hiányzik egy szakasz keresztmetszete.');
  else{
   const sin=Math.sqrt(Math.max(0,1-cosPhi.value**2));
   const term=(t:{L:number;A:number})=>bf+' · '+fmtNum(t.L)+' m · '+fmtNum(dropCurrent)+' A · '+(cosPhi.value===1?fmtNum(T.rho1,4)+' Ω·mm²/m / '+fmtNum(t.A)+' mm²':'('+fmtNum(T.rho1,4)+' Ω·mm²/m · '+fmtNum(cosPhi.value)+' / '+fmtNum(t.A)+' mm² + '+fmtNum(T.lambda,5)+' Ω/m · '+fmtNum(sin)+')')+' / '+fmtNum(T.u0)+' V · 100';
   const pieces=terms!.map(t=>term(t)+' = '+pct(voltageDropPercent({b:bf,length:t.L,current:dropCurrent,section:t.A,cosPhi:cosPhi.value})));
   const over=!atMost(dropTotal!,dropLimit),[totalT,limitT]=fmtPair(dropTotal!,dropLimit);
   const calc='ΔU = '+(pieces.length>1?pieces.join(' + ')+' = '+pct(drop):pieces[0])+'; elosztó előtt '+pct(upstreamDrop.value)+', összesen '+totalT+'% '+(over?'>':'≤')+' '+limitT+'%'+limitText;
   const detail:string[]=[];
   if(load.estimated)detail.push(dropCurrentSource==='In'?'A terhelés nincs megadva, ezért a védelem névleges áramával számoltunk (kedvezőtlen eset).':'A terhelés nincs megadva; a szerelvényekből becsült áram nagyobb a védelem névleges áramánál, ezért azzal számoltunk.');
   if(over&&govA!==null){
    const budget=dropLimit-upstreamDrop.value;
    if(!(budget>0))detail.push('Az elosztó előtti feszültségesés ('+pct(upstreamDrop.value)+') önmagában eléri a határt.');
    // Lefelé kerekítve; vegyes keresztmetszetnél a legkisebbel (kedvezőtlen eset).
    else detail.push((mixedSections?'A legkisebb ('+fmtNum(govA)+' mm²) keresztmetszettel számolva':'Ezzel a kábellel')+' legfeljebb kb. '+fmtNum(Math.floor(maxLengthForDrop(budget,bf,dropCurrent,govA,cosPhi.value)*10)/10,1)+' m engedhető.');
   }
   add('voltage-drop',over?(load.estimated?'warn':'fail'):'ok','Feszültségesés','MSZ HD 60364-5-52 525, G.52.1, G.52.2','ΔU = '+formula,calc,detail.join(' '));
  }
 }
 {// loop
  const clause='MSZ HD 60364-4-41 411.4.4',formula='Zs = Zs,elosztó + ρ1 · L · (1/A + 1/A_PE) ≤ Zs,max = cmin · U0 / (m · In)';
  if(earthing==='TT')add('loop','skipped','Hurokimpedancia',clause,formula,'','TT-rendszerben a hurokimpedancia-ellenőrzés nem része a számításnak.');
  else if(zsBoard===null)add('loop','skipped','Hurokimpedancia',clause,formula,'','Az elosztó Zs-értéke nincs megadva – a hurokellenőrzés nem készült.');
  else if(zs===null)add('loop','na','Hurokimpedancia',clause,formula,'',length===null?'A hurokimpedancia a mértékadó hossz nélkül nem számítható.':'A hurokimpedancia nem számítható: hiányzik egy szakasz keresztmetszete.');
  else{const ok=atMost(zs,zsMax),m=T.instantaneous[c.curve],[zsT,maxT]=fmtLimitPair(zs,zsMax,3);
   const calc='Zs = '+fmtNum(zsBoard,3)+' Ω + '+terms!.map(t=>fmtNum(T.rho1,4)+' Ω·mm²/m · '+fmtNum(t.L)+' m · (1/'+fmtNum(t.A)+' + 1/'+fmtNum(t.A)+') 1/mm²').join(' + ')+' = '+zsT+' Ω '+(ok?'≤':'>')+' Zs,max = '+fmtNum(T.cmin)+' · '+fmtNum(T.u0)+' V / ('+m+' · '+c.rating+' A) = '+maxT+' Ω';
   add('loop',ok?'ok':rcd?'warn':'fail','Hurokimpedancia',clause,formula,calc,ok?'':rcd?'A hurokimpedancia nagyobb '+deviceName+' pillanatkioldásához tartozó értéknél, de az áramkör ÁVK-val védett; a 411.4.4 / 411.3 szerinti igazolás a tervező feladata.':'A hurokimpedancia nagyobb '+deviceName+' pillanatkioldásához tartozó értéknél. Lehetséges megoldás: '+loopRemedies(c.curve,zsBoard>=zsMax)+'.')}
 }
 // 13. Állapot
 const status=worst(checks.filter(x=>x.status!=='skipped').map(x=>x.status));

 // 14. Feltételezések (szöveg szerint deduplikálva; strong = nem a biztonság javára közelít)
 const assumptions:Assumption[]=[];
 const assume=(text:string,strong=false)=>{if(!assumptions.some(a=>a.text===text))assumptions.push({text,strong})};
 for(const s of segments){
  if(s.method.source==='alapérték'){if(s.mode==='inside')assume('Szerelési mód: B2 (alapérték, falon belüli nyomvonal). Hőszigetelt falban (A1, A2) kisebb a terhelhetőség.',true);else assume('Szerelési mód: B2 (alapérték, falon kívüli nyomvonal).')}
  if(s.cable&&s.insulation.source==='alapérték')assume('Szigetelés: PVC, 70 °C (alapérték; a kábeljelölésből nem állapítható meg). 60 °C-os (pl. gumiszigetelésű) vezetéknél kisebb a terhelhetőség.',true);
 }
 if(metas.some(m=>m.cap?.fallback))assume('XLPE-szigetelés: a programban nincs rögzített XLPE-táblázat; a PVC-táblázat értékeivel számoltunk (a hőmérsékleti tényezőt 30 °C alatt 1-re korlátozva), ami kedvezőtlenebb.');
 if(metas.some(m=>m.cap&&!m.cap.fallback&&m.temp.fallback))assume('XLPE-szigetelés: az Iz0 projekt-felülírásból származik; a hőmérsékleti tényező XLPE-táblázat hiányában a PVC-sorból (30 °C alatt 1-re korlátozva, kedvezőtlenebb irányban).');
 if(ambient.source==='alapérték')assume('Környezeti hőmérséklet: 30 °C (referenciaérték).',true);
 if(grouped.source==='alapérték')assume('Együtt vezetett áramkörök: 1 (nincs csoportosítási csökkentés).',true);
 if(load.estimated)assume('Terhelés: nincs megadva, a szerelvényekből becsült '+fmtNum(load.watts,0)+' W; a feszültségesést '+(dropCurrentSource==='In'?'a védelem névleges áramával ('+c.rating+' A)':'a becsült terhelési árammal ('+fmtNum(ib)+' A, nagyobb a névleges áramnál)')+' számoltuk.');
 else if(cosPhi.source==='alapérték')assume('cos φ = 1 (alapérték).',true);
 if(drop!==null){
  if(!S.supply)assume('Táplálás: közcélú kisfeszültségű hálózat (alapérték; G.52.1).');
  if(usage.source==='alapérték')assume('Felhasználás: egyéb fogyasztó (alapérték; az áramkörön nincs lámpakiállás). Világítási áramkörnél a határ szigorúbb.',true);
  if(upstreamDrop.source==='alapérték')assume('Az elosztó előtti (fővezeték) feszültségesés nincs megadva: 0%-kal számoltunk.',true);
 }
 if(deviceAssumed)assume('Nincs hozzárendelt kismegszakító-modul: MSZ EN 60898-1 szerinti kismegszakító (MCB) feltételezve.');
 if(!real)assume('Nincs nyomvonal: a terhelhetőség az áramkör kábelével, falon belüli szerelési móddal számolva.');
 if(loopComputed){assume('PE-keresztmetszet = fázisvezető-keresztmetszet.');if(!S.earthing)assume('Földelési rendszer: TN (alapérték).')}

 // 15. Felhasznált táblázati értékek
 const refs:TableRef[]=[];
 if(gov)refs.push(gov.cap!.ref,gov.temp.ref,group.ref);
 if(cabled.length)refs.push(constantRef('minSection'));
 if(iz!==null)refs.push(conventionalRef(device));
 refs.push(constantRef('u0'));
 if(drop!==null){refs.push(constantRef('rho1'),limitRef);if(cosPhi.value<1)refs.push(constantRef('lambda'))}
 else if(loopComputed)refs.push(constantRef('rho1'));
 if(loopComputed)refs.push(instantaneousRef(c.curve,T,device),constantRef('cmin'));

 const cable=governing?.cable??(cp.ok?cp.cable:segments.find(s=>s.cable)?.cable??null);
 const result:CircuitSizingResult={circuitId:c.id,name:c.name,buildingId:b.id,boardId,phase:c.phase,loaded,status,label:'',cableText:cable?cableLabel(cable):'nem értelmezhető',cable,segments,governing,watts:load.watts,ib,ibSource,rating:c.rating,curve:c.curve,device,deviceAssumed,rcd,ambient,kTemp,grouped,kGroup,iz,length,lengthSource,usage,cosPhi,dropCurrent,dropCurrentSource,drop,upstreamDrop,dropTotal,dropLimit,zsBoard,zs,zsMax,checks,assumptions,refs};
 result.label=resultLabel(result);
 return result;
}

// ---------------------------------------------------------------- 3.6 Összesítés és navigáció
export function boardSizing(plan:Plan,buildingId:string,boardId='',ctx:SizingContext=sizingContext(plan)):CircuitSizingResult[]{
 return plan.circuits.filter(c=>c.building===buildingId&&inBoard(c,boardId)).map(c=>circuitSizing(plan,c.id,ctx)).filter((r):r is CircuitSizingResult=>r!==null);
}
export function projectSizing(plan:Plan,area='all'){
 const ctx=sizingContext(plan);
 return plan.buildings.filter(b=>area==='all'||b.id===area).flatMap(b=>boards(b).map(board=>({building:b,board,results:boardSizing(plan,b.id,board.id,ctx)}))).filter(x=>x.results.length);
}
const protectionModule=(plan:Plan,buildingId:string,circuitId:string)=>plan.modules.find(m=>m.building===buildingId&&m.circuit===circuitId&&(m.type==='MCB'||m.type==='RCBO'));
/** Olcsó előzetes ellenőrzés: van-e ugrási cél (a „Ugrás” gomb tiltásához; a célt csak kattintáskor kell kiszámolni). */
export function hasSizingTarget(plan:Plan,circuitId:string,ctx:SizingContext):boolean{
 const c=plan.circuits.find(c=>c.id===circuitId);if(!c||!plan.buildings.some(b=>b.id===c.building))return false;
 return !!protectionModule(plan,c.building,c.id)||ctx.routes.has(c.id)||ctx.devices.has(c.id);
}
/** Ugrási cél: a hozzárendelt MCB/RCBO → a leghosszabb nyomvonal → az első szerelvény → null. */
export function sizingTarget(plan:Plan,circuitId:string,ctx:SizingContext=sizingContext(plan)):SearchResult|null{
 const c=plan.circuits.find(c=>c.id===circuitId),b=plan.buildings.find(b=>b.id===c?.building);if(!c||!b)return null;
 const where=b.name+' / '+boardName(b,c.board||'')+' · ';
 const m=protectionModule(plan,b.id,c.id);
 if(m)return {id:m.id,type:'modules',buildingId:b.id,floorId:b.floors[0]?.id||'',title:c.name,subtitle:where+m.name,x:0,y:0};
 const routes=ctx.routes.get(c.id)??[];
 if(routes.length){
  let best=routes[0],bestLength=-1;
  for(const x of routes){const l=floorLength(x.route,x.floor).total;if(l>bestLength){best=x;bestLength=l}}
  const {route:r,floor:f}=best,mid=center(floorPoints(r,f));return {id:r.id,type:'routes',buildingId:b.id,floorId:f.id,title:c.name,subtitle:where+r.name,x:mid.x,y:mid.y};
 }
 const d=ctx.devices.get(c.id);
 if(d)return {id:d.device.id,type:'devices',buildingId:b.id,floorId:d.floor.id,title:c.name,subtitle:where+d.device.name,x:d.device.x,y:d.device.y};
 return null;
}

// ---------------------------------------------------------------- PDF-sorok
export const SIZING_PDF_HEADERS=['Áramkör','Védelem / kábel / mód','Ib / In / Iz','Hossz','ΔU össz. / határ','Zs / Zs,max','Eredmény'];
export const SIZING_PDF_WIDTHS=[40,46,36,24,30,30,40];
export const SIZING_REASON_HEADERS=['Áramkör / tétel','Ellenőrzés','Számítás, határérték, forrás'];
export const SIZING_REASON_WIDTHS=[40,45,130];
const star=(v:Valued<unknown>)=>v.source==='alapérték'?'*':'';
/** Összesítő cellák (felület és PDF): a kerekítés nem mutathat egyenlőséget, ahol az ellenőrzés eltérést talált. */
export function sizingCells(r:CircuitSizingResult){
 const dc=r.checks.find(c=>c.code==='design-current'),loop=r.checks.find(c=>c.code==='loop');
 const ib=dc?.status==='skipped'?'–':(r.ibSource==='becsült'?'≈':'')+fmtPair(r.ib,r.rating)[0];
 const drop=r.dropTotal===null?null:fmtPair(r.dropTotal,r.dropLimit),zs=r.zs===null?null:fmtLimitPair(r.zs,r.zsMax);
 return {
  current:ib+' / '+r.rating+' / '+(r.iz===null?'n. sz.':fmtPair(r.iz,r.rating)[0])+' A',
  drop:drop?drop[0]+'% / '+drop[1]+'%':'–',
  zs:!loop||loop.status==='skipped'?'–':loop.status==='na'||!zs?'n. sz.':zs[0]+' / '+zs[1]+' Ω',
 };
}
export function sizingPdfRows(results:readonly CircuitSizingResult[]):string[][]{
 return results.map(r=>{
  const seg=r.governing??r.segments[0],cells=sizingCells(r);
  const cable=r.cable?r.cableText+(seg?', '+seg.insulation.value+star(seg.insulation):''):'nem értelmezhető';
  return [r.name+' ('+r.phase+')',r.curve+r.rating+' A'+(r.device==='RCBO'?' (RCBO)':'')+' · '+cable+(r.cable&&seg?' · '+seg.method.value+star(seg.method):''),
   cells.current,
   r.length===null?'–':fmtNum(r.length)+' m'+(r.lengthSource==='megadott'?' (megadott)':''),
   cells.drop,cells.zs,resultLabel(r)];
 });
}
export const refText=(r:TableRef)=>r.label+' = '+fmtNum(r.value,5)+(r.unit==='%'?'%':r.unit?' '+r.unit:'')+' – '+r.source+' ('+r.status+')';
const sentence=(s:string)=>s.replace(/\.$/,'');
/** Mondatok összefűzése: ha az előző rész nem írásjellel végződik, pont kerül közéjük. */
const sentences=(parts:string[])=>parts.map(s=>s.trim()).filter(Boolean).reduce((acc,s)=>acc?acc+(/[.!?:;…]$/.test(acc)?' ':'. ')+s:s,'');
const reasonText=(c:SizingCheck)=>sentences([c.calculation,c.detail])+(c.clause&&c.clause!=='–'?' ['+c.clause+']':'');
export function sizingReasonRows(results:readonly CircuitSizingResult[]):string[][]{
 const rows:string[][]=[['Felelősségi nyilatkozat','–',SIZING_DISCLAIMER],['Táblázatok','Állapot',reviewText()]];
 // A minden áramkörnél azonos okból elmaradt ellenőrzés (pl. az elosztó Zs-e nincs megadva) egy sorban.
 const key=(c:SizingCheck)=>c.code+'\u0000'+c.detail,shared=new Set<string>();
 if(results.length>1)for(const c of results[0].checks)if(c.status==='skipped'&&results.every(r=>r.checks.some(o=>o.status==='skipped'&&key(o)===key(c)))){shared.add(key(c));rows.push(['Minden áramkör',checkStatusLabels.skipped+': '+c.title,reasonText(c)])}
 for(const r of results){
  for(const c of r.checks)if(c.status==='warn'||c.status==='fail'||c.status==='na'||c.status==='skipped'&&!shared.has(key(c)))rows.push([r.name,checkStatusLabels[c.status]+': '+c.title,reasonText(c)]);
  rows.push([r.name,'Felhasznált értékek',r.refs.map(refText).join('; ')]);
  if(r.assumptions.length)rows.push([r.name,'Feltételezések',r.assumptions.map(a=>sentence(a.text)).join('; ')+'.']);
 }
 rows.push(['Nem vizsgált','–',SIZING_NOT_COVERED.join('; ')]);
 rows.push(['Tervezői ellenőrzés','Név, névjegyzéki szám, dátum, aláírás','..........................................................']);
 return rows;
}

// ---------------------------------------------------------------- Mutáló segédek (a change(fn) draftján)
type Patch<T>={[K in keyof T]?:T[K]|undefined};
function applyPatch<T extends object>(target:T,patch:Patch<T>){const t=target as Record<string,unknown>;for(const [k,v] of Object.entries(patch))if(v===undefined)delete t[k];else t[k]=v}
const isEmpty=(o:object)=>Object.values(o).every(v=>v===undefined);
// A séma kulcssorrendje. A szerkesztő a mentetlen állapotot nyers JSON-nal, az automatikus mentést validált JSON-nal hasonlítja:
// ha egy törölt, majd visszaírt kulcs a végére kerülne, a terv „nem mentett” maradna, miközben mentés nem indul.
const KEYS={
 plan:Object.keys(planSchema.shape),circuit:Object.keys(planSchema.shape.circuits.element.shape),
 circuitSizing:Object.keys(circuitSizingSchema.shape),planSizing:Object.keys(planSizingSchema.shape),
 board:Object.keys(planSizingSchema.shape.boards.unwrap().element.shape),override:Object.keys(planSizingSchema.shape.overrides.unwrap().element.shape),
};
/** Helyben a séma kulcssorrendjébe rendez (az ismeretlen kulcsok a végén, eredeti sorrendben), az undefined értékűeket elhagyja. */
function canonical<T extends object>(o:T,keys:readonly string[]):T{
 const t=o as Record<string,unknown>,rank=(k:string)=>{const i=keys.indexOf(k);return i<0?keys.length:i};
 const entries=Object.entries(t).filter(([,v])=>v!==undefined).sort((a,b)=>rank(a[0])-rank(b[0]));
 for(const k of Object.keys(t))delete t[k];
 for(const [k,v] of entries)t[k]=v;
 return o;
}
export function setCircuitSizing(p:Plan,circuitId:string,patch:Patch<CircuitSizing>){
 const c=p.circuits.find(c=>c.id===circuitId);if(!c)return;
 const s:CircuitSizing={...(c.sizing??{})};applyPatch(s,patch);
 if(isEmpty(s))delete c.sizing;else c.sizing=canonical(s,KEYS.circuitSizing);
 canonical(c,KEYS.circuit);
}
export function setCircuitLoad(p:Plan,circuitId:string,watts:number|undefined){
 const c=p.circuits.find(c=>c.id===circuitId);if(!c)return;
 if(watts===undefined)delete c.load;else c.load=watts;
 canonical(c,KEYS.circuit);
}
const tidy=(p:Plan)=>{
 const s=p.sizing;
 if(s){if(s.boards&&!s.boards.length)delete s.boards;if(s.overrides&&!s.overrides.length)delete s.overrides;if(isEmpty(s))delete p.sizing}
 if(p.sizing){canonical(p.sizing,KEYS.planSizing);for(const x of p.sizing.boards??[])canonical(x,KEYS.board);for(const x of p.sizing.overrides??[])canonical(x,KEYS.override)}
 canonical(p,KEYS.plan);
};
export type PlanSizingScalars=Omit<PlanSizing,'boards'|'overrides'>;
export function setPlanSizing(p:Plan,patch:Patch<PlanSizingScalars>){
 const s:PlanSizing={...(p.sizing??{})};const scalars:Patch<PlanSizingScalars>={};
 for(const k of ['methodInside','methodOutside','insulation','ambient','grouped','supply','earthing'] as const)if(k in patch)(scalars as Record<string,unknown>)[k]=patch[k];
 applyPatch(s,scalars);p.sizing=s;tidy(p);
}
export function setBoardSizing(p:Plan,building:string,board:string,patch:{upstreamDrop?:number|undefined;zs?:number|undefined}){
 const s:PlanSizing=p.sizing??{},list=[...(s.boards??[])],i=list.findIndex(x=>x.building===building&&x.board===board);
 const entry={...(i>=0?list[i]:{building,board})};
 if('upstreamDrop' in patch){if(patch.upstreamDrop===undefined)delete entry.upstreamDrop;else entry.upstreamDrop=patch.upstreamDrop}
 if('zs' in patch){if(patch.zs===undefined)delete entry.zs;else entry.zs=patch.zs}
 const empty=entry.upstreamDrop===undefined&&entry.zs===undefined;
 if(i>=0){if(empty)list.splice(i,1);else list[i]=entry}else if(!empty)list.push(entry);
 p.sizing={...s,boards:list};tidy(p);
}
export function upsertOverride(p:Plan,o:IzOverrideEntry){
 const s:PlanSizing=p.sizing??{},key=overrideKey(o),list=[...(s.overrides??[])],i=list.findIndex(x=>overrideKey(x)===key);
 if(i>=0)list[i]={...o};else list.push({...o});
 p.sizing={...s,overrides:list};tidy(p);
}
export function removeOverride(p:Plan,key:string){
 if(!p.sizing?.overrides)return;
 p.sizing={...p.sizing,overrides:p.sizing.overrides.filter(o=>overrideKey(o)!==key)};tidy(p);
}
