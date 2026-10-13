// Saját SVG-ábrák: fényhasznosítás sávjai, lámpatalpak, lumen–lux–távolság, színhőmérséklet-skála.
import {Arrow,Svg,T,type FigProps} from './kit';

/** fenyforrasok-tipusai / abra-1: fényhasznosítás sávjai (lm/W, tájékoztató tartományok). Keskeny elrendezés: a felirat a sáv fölött,
 * így a 0–200-as tengely a teljes szélességet kapja, és 320 px-es képernyőn sem kell görgetni. */
export function FenyhasznositasSavok(p:FigProps){
 const x=(v:number)=>16+v*1.42;
 const rows=[['Izzólámpa',10,15],['Halogénlámpa',12,20],['Kompakt fénycső',50,70],['LED',80,200]] as const;
 return <Svg {...p} viewBox="0 0 320 300">
  {[0,50,100,150,200].map(v=><g key={v}><line x1={x(v)} y1={10} x2={x(v)} y2={256} className="s-border"/><T x={x(v)} y={272} size={12} anchor={v===0?'start':v===200?'end':'middle'} cls="t-muted">{v}</T></g>)}
  {rows.map(([l,a,b],i)=>{const y=40+i*58,led=l==='LED';return <g key={l}>
   <T x={16} y={y-8} size={13.5} cls="t-halo">{l}</T>
   <rect x={x(a)} y={y} width={Math.max(x(b)-x(a),4)} height={24} rx={4} className={led?'f-primary':'f-muted'} fillOpacity={led?1:0.6}/>
   {/* A tartomány felirata nem keresztez rácsvonalat, ezért kontúr (t-halo) nélkül: a kontúr a gondolatjel előtti számjegyet csonkította. */}
   {led?<T x={x(b)-8} y={y+17} size={12.5} anchor="end" cls="t-on-primary" bold>{a+'–'+b}</T>:<T x={x(b)+4} y={y+17} size={12.5}>{a+'–'+b}</T>}
  </g>})}
  <T x={x(100)} y={292} size={13} anchor="middle">lm/W</T>
 </Svg>;
}

/** A lámpatalp-ábra méretaránya (1 mm = 4 px) és a méretvonalak alapvonala. */
const LT_MM=4,LT_BASE=232;
const LTDim=({c,w,l}:{c:number;w:number;l:string})=><g>
  <Arrow x1={c-w/2} y1={LT_BASE} x2={c+w/2} y2={LT_BASE} both cls="s-primary" head="f-primary" w={1} size={5}/>
  <line x1={c-w/2} y1={LT_BASE-6} x2={c-w/2} y2={LT_BASE+6} className="s-primary"/><line x1={c+w/2} y1={LT_BASE-6} x2={c+w/2} y2={LT_BASE+6} className="s-primary"/>
  <T x={c} y={LT_BASE+16} size={12} anchor="middle" cls="t-primary">{l}</T>
 </g>;
const LTLabel=({c,name,v}:{c:number;name:string;v:string})=><g><T x={c} y={LT_BASE+36} size={14} anchor="middle" bold>{name}</T><T x={c} y={LT_BASE+54} size={12} anchor="middle" cls="t-muted">{v}</T></g>;
const LTScrew=({c,w,h}:{c:number;w:number;h:number})=>{const top=214-h;return <g>
  <path d={`M${c-w*0.5} ${top} C${c-w*0.85} ${top-75} ${c+w*0.85} ${top-75} ${c+w*0.5} ${top}`} className="s-muted f-none" strokeDasharray="4 3" strokeWidth={1.5}/>
  <rect x={c-w/2} y={top} width={w} height={h} className="f-surface2 s-fg" strokeWidth={2}/>
  {Array.from({length:Math.floor(h/10)},(_,i)=><line key={i} x1={c-w/2} y1={top+6+i*10} x2={c+w/2} y2={top+12+i*10} className="s-fg" strokeWidth={1}/>)}
  <path d={`M${c-w/2} ${214} L${c-w/4} ${222} H${c+w/4} L${c+w/2} ${214}`} className="f-surface s-fg" strokeWidth={1.5}/>
  <circle cx={c} cy={224} r={3.5} className="f-fg"/>
 </g>};
const LTPins=({c,gap,len,kind}:{c:number;gap:number;len:number;kind:'thick'|'thin'|'loop'})=><g>
  {[-1,1].map(s=>{const x=c+s*gap/2;return kind==='loop'
   ?<path key={s} d={`M${x-3} 196 V${196+len-4} A3 3 0 0 0 ${x+3} ${196+len-4} V196`} className="s-fg f-none" strokeWidth={1.5}/>
   :<g key={s}><line x1={x} y1={196} x2={x} y2={196+len} className="s-fg" strokeWidth={kind==='thick'?2.5:1.5}/>{kind==='thick'&&<circle cx={x} cy={196+len} r={3.5} className="f-fg"/>}</g>})}
 </g>;
const LTBody=({c,w,h,dash=false}:{c:number;w:number;h:number;dash?:boolean})=><rect x={c-w/2} y={196-h} width={w} height={h} rx={dash?w/2:3} className={dash?'s-muted f-none':'f-surface2 s-fg'} strokeWidth={dash?1.5:2} strokeDasharray={dash?'4 3':undefined}/>;

/** lampafoglalatok-es-lampatalpak / abra-1: gyakori lámpatalpak oldalnézetben, azonos méretarányban (1 mm = 4 px). Két panel
 * (menetes és GU10, illetve a kis csapos talpak): asztalon egymás mellett, telefonon egymás alatt – így minden talp látszik, görgetés nélkül. */
export function Lampatalpak(p:FigProps){
 const mm=LT_MM;
 return <div className="kk-fig-panels">
  <Svg uid={p.uid+'-a'} title={p.title+' – E27, E14, GU10'} desc="E27 és E14 menetes talp (27 és 14 mm-es menet) és GU10 csapos talp (10 mm csaptávolság), mindhárom 230 V-os." viewBox="0 0 310 300">
   <LTScrew c={64} w={27*mm} h={90}/><LTDim c={64} w={27*mm} l="27 mm"/><LTLabel c={64} name="E27" v="230 V"/>
   <LTScrew c={170} w={14*mm} h={70}/><LTDim c={170} w={14*mm} l="14 mm"/><LTLabel c={170} name="E14" v="230 V"/>
   <LTBody c={262} w={70} h={36}/><LTPins c={262} gap={10*mm} len={18} kind="thick"/><LTDim c={262} w={10*mm} l="10 mm"/><LTLabel c={262} name="GU10" v="230 V"/>
  </Svg>
  <Svg uid={p.uid+'-b'} title={p.title+' – GU5.3, G9, G4'} desc="GU5.3 (5,33 mm) és G4 (4 mm) csapos talp 12 V-ra – ezekhez transzformátor kell –, valamint a 230 V-os G9 (9 mm, hurkos csapok)." viewBox="0 0 320 300">
   <rect x={6} y={26} width={112} height={268} rx={6} className="s-warn f-none" strokeDasharray="5 4"/>
   <rect x={212} y={26} width={102} height={268} rx={6} className="s-warn f-none" strokeDasharray="5 4"/>
   <T x={62} y={44} size={12} anchor="middle" cls="t-warn" bold>transzformátor</T><T x={62} y={58} size={12} anchor="middle" cls="t-warn" bold>kell</T>
   <T x={263} y={44} size={12} anchor="middle" cls="t-warn" bold>transzformátor</T><T x={263} y={58} size={12} anchor="middle" cls="t-warn" bold>kell</T>
   <LTBody c={62} w={60} h={30}/><LTPins c={62} gap={5.33*mm} len={24} kind="thin"/><LTDim c={62} w={5.33*mm} l="5,33 mm"/><LTLabel c={62} name="GU5.3" v="12 V"/>
   <LTBody c={165} w={52} h={70} dash/><LTPins c={165} gap={9*mm} len={22} kind="loop"/><LTDim c={165} w={9*mm} l="9 mm"/><LTLabel c={165} name="G9" v="230 V"/>
   <LTBody c={263} w={34} h={50} dash/><LTPins c={263} gap={4*mm} len={20} kind="thin"/><LTDim c={263} w={4*mm} l="4 mm"/><LTLabel c={263} name="G4" v="12 V"/>
  </Svg>
 </div>;
}

/** lumen-es-lux / abra-1: 4000 lm 8 m²-en ≈ 500 lx; 1000 cd-s pontszerű forrás 1, 2, 3 m-ről 1000, 250, 111 lx. Két panel (asztalon
 * egymás mellett, telefonon egymás alatt); a távolságszintek szaggatott vonala a felirat előtt véget ér. */
export function LumenLux(p:FigProps){
 const lv=[[1,'1 m: 1000 lx',0.45],[2,'2 m: 250 lx',0.2],[3,'3 m: 111 lx',0.1]] as const,c=96;
 return <div className="kk-fig-panels">
  <Svg uid={p.uid+'-a'} title={p.title+' – fényáram és megvilágítás'} desc="Egy 4000 lumenes lámpa fénye 8 négyzetméterre esik: a megvilágítás veszteség nélkül 4000 / 8 = 500 lux." viewBox="0 0 300 300">
   <polygon points="126,44 174,44 260,250 40,250" className="f-primary" fillOpacity={0.15}/>
   <line x1={126} y1={44} x2={40} y2={250} className="s-primary" strokeWidth={1.5}/><line x1={174} y1={44} x2={260} y2={250} className="s-primary" strokeWidth={1.5}/>
   <rect x={120} y={30} width={60} height={14} rx={3} className="f-surface2 s-fg" strokeWidth={1.5}/>
   <T x={198} y={96} size={13.5}>Φ = 4000 lm</T>
   <line x1={14} y1={250} x2={286} y2={250} className="s-fg" strokeWidth={2}/>
   <line x1={40} y1={250} x2={260} y2={250} className="s-primary" strokeWidth={5}/>
   <T x={150} y={270} size={13.5} anchor="middle">A = 8 m²</T>
   <T x={150} y={290} size={12.5} anchor="middle" cls="t-muted">E = Φ / A = 500 lx (veszteség nélkül)</T>
  </Svg>
  <Svg uid={p.uid+'-b'} title={p.title+' – távolságtörvény'} desc="Egy 1000 kandelás pontszerű fényforrás 1, 2 és 3 méterről 1000, 250 és 111 luxot ad: ugyanaz a fény négyzetesen növekvő felületen oszlik el." viewBox="0 0 300 300">
   <circle cx={c} cy={40} r={8} className="f-primary"/>
   <T x={c+14} y={36} size={13}>1000 cd</T>
   <line x1={c} y1={48} x2={c} y2={276} className="s-muted" strokeDasharray="3 3"/>
   {lv.map(([d,l,o])=>{const y=40+70*d,s=20*d;return <g key={d}>
    <line x1={14} y1={y} x2={c+40} y2={y} className="s-border" strokeDasharray="4 3"/>
    <line x1={c} y1={40} x2={c-s/2} y2={y-s/2} className="s-muted" strokeWidth={0.8}/><line x1={c} y1={40} x2={c+s/2} y2={y-s/2} className="s-muted" strokeWidth={0.8}/>
    <rect x={c-s/2} y={y-s/2} width={s} height={s} className="f-primary s-primary" fillOpacity={o} strokeWidth={1}/>
    <T x={c+48} y={y+5} size={13}>{l}</T>
    <T x={14} y={y-6} size={12} cls="t-muted">{d} m</T>
   </g>})}
  </Svg>
 </div>;
}

/** A színhőmérséklet-skála közös adatai: a sáv valós fényszínei (mindkét témában azonos, rögzített színek), az osztások és a címkék. */
const SZ_STOPS:[number,string][]=[[1500,'#ff8a1f'],[2700,'#ffb46b'],[4000,'#ffe2c4'],[5500,'#fff6ec'],[6500,'#f2f4ff'],[10000,'#c9d8ff']];
const SZ_TICKS=[1500,2000,2700,3000,4000,5000,6500,10000];
const SZ_LABELS:[number,string][]=[[1900,'gyertya'],[2700,'izzó'],[3000,'halogén'],[4000,'semleges fehér'],[5500,'napfény'],[6500,'borult ég'],[10000,'kék ég']];
const SZ_GROUPS:[number,number,string][]=[[2700,3000,'melegfehér'],[3500,4500,'semleges'],[5000,6500,'hidegfehér']];
/** A mired szerint egyenletes beosztás 0..1 között (1500 K → 0, 10 000 K → 1). */
const mired=(K:number)=>(666.7-1e6/K)/566.7;
const szTick=(K:number)=>K===10000?'10 000 K':K===1500?'1500 K':String(K);

/** szinhomerseklet / abra-1: színhőmérséklet-skála 1500–10 000 K, mired szerint egyenletes beosztással. A sáv a valós fényszíneket
 * mutatja, ezért mindkét témában azonos (rögzített színek; a feliratok a tokenekből). Két változat: széles képernyőn vízszintes
 * (a 6500 és a „10 000 K” osztásfelirat között jól látható közzel), 600 px alatt függőleges – mindkettő ugyanazt az adatot mutatja,
 * a CSS egyszerre csak az egyiket jeleníti meg (a rejtett változat a képernyőolvasónak sem látszik). */
export function SzinhomersekletSkala(p:FigProps){
 const gid=p.uid+'-g',gv=p.uid+'-gv';
 const x=(K:number)=>20+540*mired(K),off=(K:number)=>(mired(K)*100).toFixed(1)+'%';
 const y=(K:number)=>22+350*mired(K);
 const row=[116,134];
 return <div className="kk-fig-variants">
  <Svg uid={p.uid+'-w'} title={p.title} desc="" viewBox="0 0 640 200" className="kk-fig-only-wide">
   <defs><linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">{SZ_STOPS.map(([K,c])=><stop key={K} offset={off(K)} stopColor={c}/>)}</linearGradient></defs>
   {SZ_GROUPS.map(([a,b,l])=><g key={l}><path d={`M${x(a)} 40 V34 H${x(b)} V40`} className="s-fg f-none" strokeWidth={1.2}/><T x={(x(a)+x(b))/2} y={27} size={13} anchor="middle" bold>{l}</T></g>)}
   {SZ_TICKS.map(K=><g key={K}><line x1={x(K)} y1={62} x2={x(K)} y2={70} className="s-fg"/><T x={x(K)} y={57} size={12} anchor={K===1500?'start':'middle'}>{szTick(K)}</T></g>)}
   <rect x={20} y={70} width={540} height={28} rx={4} fill={`url(#${gid})`} className="s-border"/>
   {SZ_LABELS.map(([K,l],i)=><g key={l}><line x1={x(K)} y1={98} x2={x(K)} y2={row[i%2]-11} className="s-muted"/><T x={x(K)} y={row[i%2]} size={12} anchor="middle" cls="t-muted">{l}</T></g>)}
   <T x={290} y={170} size={12} anchor="middle" cls="t-muted">A beosztás a mired (10⁶ / T) szerint egyenletes: a meleg tartomány hosszabb.</T>
  </Svg>
  <Svg uid={p.uid+'-n'} title={p.title} desc="" viewBox="0 0 300 440" className="kk-fig-only-narrow">
   <defs><linearGradient id={gv} x1="0" x2="0" y1="0" y2="1">{SZ_STOPS.map(([K,c])=><stop key={K} offset={off(K)} stopColor={c}/>)}</linearGradient></defs>
   {SZ_TICKS.map(K=><g key={K}><line x1={58} y1={y(K)} x2={66} y2={y(K)} className="s-fg"/><T x={54} y={y(K)+4} size={12} anchor="end">{szTick(K)}</T></g>)}
   <rect x={66} y={22} width={28} height={350} rx={4} fill={`url(#${gv})`} className="s-border"/>
   {SZ_LABELS.map(([K,l])=><g key={l}><line x1={94} y1={y(K)} x2={102} y2={y(K)} className="s-muted"/><T x={106} y={y(K)+4} size={12} cls="t-muted">{l}</T></g>)}
   {SZ_GROUPS.map(([a,b,l])=><g key={l}><path d={`M${206} ${y(a)} H212 V${y(b)} H206`} className="s-fg f-none" strokeWidth={1.2}/><T x={218} y={(y(a)+y(b))/2+4} size={13} bold>{l}</T></g>)}
   <T x={10} y={404} size={12} cls="t-muted">A beosztás a mired (10⁶ / T) szerint</T>
   <T x={10} y={420} size={12} cls="t-muted">egyenletes: a meleg tartomány hosszabb.</T>
  </Svg>
 </div>;
}
