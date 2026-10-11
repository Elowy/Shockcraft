// Saját SVG-ábrák: Joule–Lenz (veszteség), Kirchhoff (csomópont, hurok), soros és párhuzamos kapcsolás, rövidzárlat (2), transzformátor.
import {Arrow,Sub,Svg,T,curve,path,type FigProps} from './kit';

/** joule-lenz-torveny / abra-1: P = I² · 0,4126 Ω, összevetve az arányos egyenessel. */
export function JouleParabola(p:FigProps){
 const x=(i:number)=>50+i*15,y=(w:number)=>185-w*(160/120),R=0.4126;
 const pts=[[4,'6,6 W'],[8,'26,4 W'],[12,'59,4 W'],[16,'105,6 W']] as const;
 return <Svg {...p} viewBox="0 0 320 222">
  {[0,20,40,60,80,100,120].map(w=><line key={w} x1={50} y1={y(w)} x2={290} y2={y(w)} className="s-track"/>)}
  {[0,4,8,12,16].map(i=><line key={i} x1={x(i)} y1={y(0)} x2={x(i)} y2={y(120)} className="s-track"/>)}
  <line x1={50} y1={y(0)} x2={296} y2={y(0)} className="s-fg" strokeWidth={1.5}/>
  <line x1={50} y1={y(0)} x2={50} y2={y(124)} className="s-fg" strokeWidth={1.5}/>
  {[0,20,40,60,80,100,120].map(w=><T key={w} x={45} y={y(w)+4} size={11} anchor="end" cls="t-muted">{w}</T>)}
  {[0,4,8,12,16].map(i=><T key={i} x={x(i)} y={y(0)+14} size={11} anchor="middle" cls="t-muted">{i===16?'16 A':i}</T>)}
  <line x1={x(0)} y1={y(0)} x2={x(16)} y2={y(16*16*R)} className="s-muted" strokeWidth={1.5} strokeDasharray="6 4"/>
  <T x={150} y={y(105.6*(100/240))-8} size={11.5} cls="t-muted" anchor="middle" rotate={-Math.atan2(16*16*R*160/120,240)*180/Math.PI}>ha arányos lenne</T>
  <path d={curve(i=>[x(i),y(i*i*R)],0,16,64)} className="s-primary f-none" strokeWidth={2.5}/>
  {pts.map(([i,l])=>{const px=x(i),py=y(i*i*R),pos=i===4?{x:px,y:py-9,a:'middle' as const}:i===16?{x:px-8,y:py+4,a:'end' as const}:{x:px+8,y:py+14,a:'start' as const};
   return <g key={i}><circle cx={px} cy={py} r={4} className="f-primary"/><T x={pos.x} y={pos.y} size={11} anchor={pos.a}>{l}</T></g>})}
  <T x={170} y={216} size={11.5} anchor="middle">Áram (A)</T>
  <T x={14} y={105} size={11.5} anchor="middle" rotate={-90}>Veszteség (W)</T>
 </Svg>;
}

/** kirchhoff-torvenyei / abra-1: csomópont – a befolyó (3 A + 5 A) és a kifolyó (6 A + 2 A) áramok összege egyaránt 8 A. */
export function KirchhoffCsomopont(p:FigProps){
 const cx=160,cy=105,d=63.6;
 const br=[[-1,-1,'in','I1 = 3 A'],[-1,1,'in','I2 = 5 A'],[1,-1,'out','I3 = 6 A'],[1,1,'out','I4 = 2 A']] as const;
 return <Svg {...p} viewBox="0 0 320 220">
  {br.map(([sx,sy,dir,l])=>{const ex=cx+sx*d,ey=cy+sy*d,mx=cx+sx*d*0.55,my=cy+sy*d*0.55,m2x=cx+sx*d*0.25,m2y=cy+sy*d*0.25;
   return <g key={l}>
    <line x1={cx} y1={cy} x2={ex} y2={ey} className="s-fg" strokeWidth={2.5}/>
    {dir==='in'?<Arrow x1={mx} y1={my} x2={m2x} y2={m2y} cls="s-primary" head="f-primary" w={3} size={11}/>:<Arrow x1={m2x} y1={m2y} x2={mx} y2={my} cls="s-warn" head="f-warn" w={3} size={11}/>}
    <T x={ex+sx*6} y={ey+(sy<0?-6:16)} size={13} anchor={sx<0?'end':'start'}>{l}</T>
   </g>})}
  <circle cx={cx} cy={cy} r={5} className="f-fg"/>
  <T x={cx} y={210} size={13} anchor="middle">3 A + 5 A = 6 A + 2 A</T>
 </Svg>;
}

/** kirchhoff-torvenyei / abra-2: hurok – 230 V = 227,42 V (vízforraló) + 2,58 V (a vezeték két fele együtt). Fogyasztói pozitív
 * irányrendszer: az I áram az óramutató járásával egyező körbejárás irányában folyik; a fogyasztón (vízforraló) a feszültségnyíl az áram
 * irányába, a magasabb potenciálú L felől az N felé mutat. */
export function KirchhoffHurok(p:FigProps){
 return <Svg {...p} viewBox="0 0 360 220">
  <line x1={70} y1={44} x2={120} y2={44} className="s-l1" strokeWidth={2.5}/><line x1={160} y1={44} x2={250} y2={44} className="s-l1" strokeWidth={2.5}/>
  <line x1={70} y1={164} x2={120} y2={164} className="s-n" strokeWidth={2.5}/><line x1={160} y1={164} x2={250} y2={164} className="s-n" strokeWidth={2.5}/>
  <line x1={70} y1={44} x2={70} y2={86} className="s-fg" strokeWidth={2}/><line x1={70} y1={122} x2={70} y2={164} className="s-fg" strokeWidth={2}/>
  <line x1={250} y1={44} x2={250} y2={74} className="s-fg" strokeWidth={2}/><line x1={250} y1={134} x2={250} y2={164} className="s-fg" strokeWidth={2}/>
  <circle cx={70} cy={104} r={18} className="f-bg s-fg" strokeWidth={2}/>
  <path d={curve(t=>[60+t*20,104-7*Math.sin(t*2*Math.PI)],0,1,24)} className="s-fg f-none" strokeWidth={1.5}/>
  <T x={46} y={109} size={13} anchor="end" bold>230 V</T>
  <rect x={120} y={36} width={40} height={16} className="f-bg s-fg" strokeWidth={1.5}/><T x={140} y={29} anchor="middle" size={12}>R<Sub>v</Sub>/2</T>
  <rect x={120} y={156} width={40} height={16} className="f-bg s-fg" strokeWidth={1.5}/><T x={140} y={190} anchor="middle" size={12}>R<Sub>v</Sub>/2</T>
  <T x={86} y={36} bold size={13}>L</T><T x={86} y={184} bold size={13}>N</T>
  <Arrow x1={194} y1={30} x2={234} y2={30} cls="s-fg" head="f-fg" w={2} size={8}/><T x={214} y={22} size={13} anchor="middle" bold>I</T>
  <path d="M168 50 Q174 50 174 60 V96 Q174 104 180 104 Q174 104 174 112 V148 Q174 158 168 158" className="s-primary f-none" strokeWidth={1.5}/>
  <T x={184} y={96} size={13} cls="t-primary" bold>2,58 V</T>
  <rect x={238} y={74} width={24} height={60} className="f-surface s-fg" strokeWidth={1.5}/>
  <T x={274} y={154} size={12}>vízforraló</T><T x={274} y={169} size={12}>R<Sub>t</Sub> = 26,45 Ω</T>
  <Arrow x1={272} y1={76} x2={272} y2={132} cls="s-primary" head="f-primary" w={1.5} size={7}/>
  <T x={280} y={108} size={13} cls="t-primary" bold>227,42 V</T>
  <path d="M105 86 A20 20 0 1 1 101 122" className="s-muted f-none" strokeWidth={1.3} strokeDasharray="4 3"/>
  <Arrow x1={104} y1={121} x2={99} y2={123} cls="s-muted" head="f-muted" w={1} size={7}/>
  <T x={180} y={212} size={13} anchor="middle">230 V = 227,42 V + 2,58 V</T>
 </Svg>;
}

/** Feszültségforrás (kör „U” felirattal). */
const Src=({x,y}:{x:number;y:number})=><g><circle cx={x} cy={y} r={14} className="f-bg s-fg" strokeWidth={2}/><T x={x} y={y+5} anchor="middle" size={13} bold>U</T></g>;
/** Ellenállás (vízszintes vagy függőleges téglalap felirattal). */
const Res=({x,y,w=46,h=16,l,vertical=false}:{x:number;y:number;w?:number;h?:number;l:string;vertical?:boolean})=>vertical
  ?<g><rect x={x-h/2} y={y-w/2} width={h} height={w} className="f-surface s-fg" strokeWidth={1.5}/><T x={x+h/2+5} y={y+4} size={12} bold>{l}</T></g>
  :<g><rect x={x-w/2} y={y-h/2} width={w} height={h} className="f-surface s-fg" strokeWidth={1.5}/><T x={x} y={y+4} size={11} anchor="middle" bold>{l}</T></g>;

/** soros-es-parhuzamos-kapcsolas / abra-1: két panel – soros (közös áram, U = U1 + U2) és párhuzamos (közös feszültség, I = I1 + I2).
 * Fogyasztói pozitív irányrendszer mindkét panelen: az ellenálláson a feszültségnyíl az áram irányába mutat (a párhuzamos panelen
 * a közös U is lefelé, mint az I1 és az I2). */
export function SorosParhuzamos(p:FigProps){
 return <div className="kk-fig-panels">
  <Svg uid={p.uid+'-a'} title={p.title+' – soros'} desc="Soros kapcsolás: a forrás után egymás mögött R1 és R2; egyetlen közös I áram folyik, a feszültség megoszlik: U = U1 + U2." viewBox="0 0 300 200">
   <T x={150} y={16} anchor="middle" bold size={13}>Soros</T>
   <path d="M40 86 V40 H260 V160 H40 V114" className="s-fg f-none" strokeWidth={2.5}/>
   <Src x={40} y={100}/>
   <Res x={115} y={40} l="R1"/><Res x={195} y={40} l="R2"/>
   <Arrow x1={92} y1={60} x2={138} y2={60} cls="s-warn" head="f-warn" w={1.5} size={7}/><T x={115} y={76} anchor="middle" size={12}>U1</T>
   <Arrow x1={172} y1={60} x2={218} y2={60} cls="s-warn" head="f-warn" w={1.5} size={7}/><T x={195} y={76} anchor="middle" size={12}>U2</T>
   <Arrow x1={260} y1={84} x2={260} y2={124} cls="s-primary" head="f-primary" w={3} size={10}/><T x={268} y={110} size={13} bold>I</T>
   <T x={150} y={190} anchor="middle" size={12}>I közös, U = U1 + U2</T>
  </Svg>
  <Svg uid={p.uid+'-b'} title={p.title+' – párhuzamos'} desc="Párhuzamos kapcsolás: R1 és R2 két külön ágon ugyanarra a két pontra csatlakozik; mindkettőn ugyanaz az U feszültség, az ágáramok összeadódnak: I = I1 + I2." viewBox="0 0 300 200">
   <T x={150} y={16} anchor="middle" bold size={13}>Párhuzamos</T>
   <path d="M40 86 V40 H230 V160 H40 V114" className="s-fg f-none" strokeWidth={2.5}/>
   <line x1={150} y1={40} x2={150} y2={160} className="s-fg" strokeWidth={2.5}/>
   <Src x={40} y={100}/>
   <Res x={150} y={100} l="R1" vertical/><Res x={230} y={100} l="R2" vertical/>
   <Arrow x1={62} y1={40} x2={112} y2={40} cls="s-primary" head="f-primary" w={3} size={10}/><T x={86} y={32} anchor="middle" size={13} bold>I</T>
   <Arrow x1={150} y1={46} x2={150} y2={70} cls="s-primary" head="f-primary" w={2} size={8}/><T x={140} y={62} anchor="end" size={12}>I1</T>
   <Arrow x1={230} y1={46} x2={230} y2={70} cls="s-primary" head="f-primary" w={2} size={8}/><T x={220} y={62} anchor="end" size={12}>I2</T>
   <Arrow x1={260} y1={50} x2={260} y2={150} cls="s-warn" head="f-warn" w={1.5} size={7}/><T x={268} y={104} size={13} bold>U</T>
   <T x={150} y={190} anchor="middle" size={12}>U közös, I = I1 + I2</T>
  </Svg>
 </div>;
}

/** Egy állapot-panel a rövidzárlat/túlterhelés ábrához. */
const Panel=({uid,title,k,name,desc,children,arrowCls,arrowW,label}:{uid:string;title:string;k:string;name:string;desc:string;children:React.ReactNode;arrowCls:string;arrowW:number;label:string})=>
  <Svg uid={uid+'-'+k} title={title+' – '+name} desc={desc} viewBox="0 0 220 166">
   <line x1={30} y1={30} x2={205} y2={30} className="s-l1" strokeWidth={2.5}/><line x1={30} y1={130} x2={205} y2={130} className="s-n" strokeWidth={2.5}/>
   <line x1={30} y1={30} x2={30} y2={66} className="s-fg" strokeWidth={2}/><line x1={30} y1={94} x2={30} y2={130} className="s-fg" strokeWidth={2}/>
   <circle cx={30} cy={80} r={14} className="f-bg s-fg" strokeWidth={2}/><path d={curve(t=>[22+t*16,80-5*Math.sin(t*2*Math.PI)],0,1,20)} className="s-fg f-none" strokeWidth={1.4}/>
   <T x={14} y={34} bold size={11}>L</T><T x={14} y={134} bold size={11}>N</T><T x={50} y={84} size={10} cls="t-muted">230 V</T>
   <Arrow x1={52} y1={20} x2={104} y2={20} cls={'s-'+arrowCls} head={'f-'+arrowCls} w={arrowW} size={6+arrowW*1.4}/>
   <T x={112} y={24} size={12} bold>{label}</T>
   {children}
   <T x={110} y={158} anchor="middle" size={12} bold>{name}</T>
  </Svg>;
/** Fogyasztó (függőleges ellenállás). */
const Load=({x,muted=false}:{x:number;muted?:boolean})=><g><line x1={x} y1={30} x2={x} y2={58} className={muted?'s-muted':'s-fg'} strokeWidth={2}/><rect x={x-8} y={58} width={16} height={44} className={(muted?'f-surface s-muted':'f-surface s-fg')} strokeWidth={1.5}/><line x1={x} y1={102} x2={x} y2={130} className={muted?'s-muted':'s-fg'} strokeWidth={2}/></g>;

/** rovidzarlat-es-tulterheles / abra-1: ugyanaz az áramkör normál üzemben, túlterhelésnél és rövidzárlatnál. */
export function RovidzarlatAllapotok(p:FigProps){
 return <div className="kk-fig-panels kk-fig-panels-3">
  <Panel uid={p.uid} title={p.title} k="a" name="Normál" desc="Normál üzem: egy fogyasztó, vékony áramnyíl, 8,7 A." arrowCls="primary" arrowW={2} label="8,7 A"><Load x={160}/></Panel>
  <Panel uid={p.uid} title={p.title} k="b" name="Túlterhelés" desc="Túlterhelés: három párhuzamos fogyasztó, közepes áramnyíl, 22,6 A; a vezeték melegszik." arrowCls="warn" arrowW={4} label="22,6 A">
   <Load x={130}/><Load x={160}/><Load x={190}/>
   <path d={curve(t=>[50+t*60,40+3*Math.sin(t*6*Math.PI)],0,1,40)} className="s-warn f-none" strokeWidth={1.5}/>
  </Panel>
  <Panel uid={p.uid} title={p.title} k="c" name="Rövidzárlat" desc="Rövidzárlat: a fogyasztó előtt az L és az N vezető között villám alakú, vastag összekötés; vastag áramnyíl, kb. 400 A; a fogyasztón nem folyik áram." arrowCls="danger" arrowW={8} label="≈ 400 A">
   <Load x={180} muted/>
   <path d={path([[120,30],[126,62],[112,74],[130,96],[116,108],[124,130]])} className="s-danger f-none" strokeWidth={5} strokeLinejoin="round"/>
  </Panel>
 </div>;
}

/** rovidzarlat-es-tulterheles / abra-2: B jelleggörbe időáram-sávja (sematikus, log–log). 320 széles: telefonon is legalább ~10 px-es feliratok. */
export function IdoaramSav(p:FigProps){
 const lx=(m:number)=>48+130*Math.log10(m),ly=(t:number)=>230-34*(Math.log10(t)+2);
 const fast:[number,number][]=[[1.135,10000],[1.2,800],[1.5,60],[2,10],[2.55,2],[3,1.2],[3,0.01]];
 const slow:[number,number][]=[[1.45,3600],[1.6,900],[2,200],[2.55,60],[3,25],[4,12],[5,7],[5,0.01]];
 const band=path([...fast.map(([m,t])=>[lx(m),ly(t)] as [number,number]),...[...slow].reverse().map(([m,t])=>[lx(m),ly(t)] as [number,number]),[lx(1.45),ly(10000)]])+' Z';
 const xt:[number,string][]=[[1,'1'],[3,'3'],[5,'5'],[10,'10'],[25,'25'],[100,'100']];
 const yt:[number,string][]=[[0.01,'0,01'],[0.1,'0,1'],[1,'1'],[10,'10'],[100,'100'],[1000,'1000'],[10000,'10 000']];
 const x1=lx(1),x2=lx(100),bot=ly(0.01);
 return <Svg {...p} viewBox="0 0 320 352">
  {yt.map(([t])=><line key={t} x1={x1} y1={ly(t)} x2={x2} y2={ly(t)} className="s-border"/>)}
  {[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100].map(m=><line key={m} x1={lx(m)} y1={ly(10000)} x2={lx(m)} y2={bot} className="s-border" strokeOpacity={m===1||m===10||m===100?1:0.45}/>)}
  <path d={band} className="f-primary s-primary" fillOpacity={0.25} strokeWidth={1.5}/>
  <line x1={x1} y1={ly(0.1)} x2={x2} y2={ly(0.1)} className="s-fg" strokeWidth={1} strokeDasharray="3 3"/>
  <line x1={x1} y1={ly(3600)} x2={x2} y2={ly(3600)} className="s-fg" strokeWidth={1} strokeDasharray="3 3"/>
  <T x={x2-2} y={ly(3600)-4} size={11.5} anchor="end" cls="t-halo">1 óra</T>
  <T x={x2-2} y={ly(0.1)-4} size={11.5} anchor="end" cls="t-halo">0,1 s</T>
  <line x1={lx(1.13)} y1={ly(10000)} x2={lx(1.13)} y2={bot} className="s-muted" strokeDasharray="2 3"/>
  <line x1={lx(1.45)} y1={ly(10000)} x2={lx(1.45)} y2={bot} className="s-muted" strokeDasharray="2 3"/>
  <line x1={lx(1.41)} y1={ly(10000)} x2={lx(1.41)} y2={bot} className="s-warn" strokeWidth={2} strokeDasharray="6 3"/>
  <line x1={lx(25)} y1={ly(10000)} x2={lx(25)} y2={bot} className="s-danger" strokeWidth={2} strokeDasharray="6 3"/>
  <T x={100} y={ly(300)} size={12} bold cls="t-halo">hőkioldó</T>
  <T x={148} y={bot-36} size={12} bold cls="t-halo">elektro-</T>
  <T x={148} y={bot-22} size={12} bold cls="t-halo">mágneses</T>
  <T x={148} y={bot-8} size={12} bold cls="t-halo">kioldó</T>
  <T x={lx(3)+4} y={ly(0.3)} size={12} bold cls="t-primary">B</T>
  {xt.map(([m,l])=><T key={m} x={lx(m)} y={bot+15} size={11} anchor="middle" cls="t-muted">{l}</T>)}
  <T x={lx(1.13)-1} y={bot+30} size={11} anchor="end" cls="t-muted">1,13</T>
  <T x={lx(1.45)+1} y={bot+30} size={11} anchor="start" cls="t-muted">1,45</T>
  {yt.map(([t,l])=><T key={t} x={x1-4} y={ly(t)+4} size={11} anchor="end" cls="t-muted">{l}</T>)}
  <T x={190} y={bot+30} size={12} anchor="middle">I / In</T>
  <T x={11} y={ly(1)} size={12} anchor="middle" rotate={-90}>kioldási idő (s)</T>
  <line x1={8} y1={bot+48} x2={30} y2={bot+48} className="s-warn" strokeWidth={2} strokeDasharray="6 3"/><T x={36} y={bot+52} size={12}>1,41 · In – túlterhelési példa (22,6 A, B16)</T>
  <line x1={8} y1={bot+66} x2={30} y2={bot+66} className="s-danger" strokeWidth={2} strokeDasharray="6 3"/><T x={36} y={bot+70} size={12}>25 · In – zárlati példa (≈ 400 A, B16)</T>
  <T x={160} y={bot+92} size={11.5} anchor="middle" cls="t-muted">Sematikus ábra, nem méretezésre;</T>
  <T x={160} y={bot+107} size={11.5} anchor="middle" cls="t-muted">a pontos görbe gyártónként eltér.</T>
 </Svg>;
}

/** transzformator-mukodese / abra-1: vasmag, primer (sűrűbb) és szekunder (ritkább) tekercs, fluxus, kivezetések. */
export function TranszformatorFelepites(p:FigProps){
 const turns=(x0:number,y0:number,y1:number,n:number,cls:string)=>{const step=(y1-y0)/(n-1);return Array.from({length:n},(_,i)=>{const y=y0+i*step;return <path key={i} d={`M${x0-4} ${y+5} Q${x0+8} ${y-7} ${x0+20} ${y+1}`} className={cls+' f-none'} strokeWidth={2.4} strokeLinecap="round"/>})};
 return <Svg {...p} viewBox="0 0 380 244">
  <g transform="translate(10 0)">
   <path d="M120 40 H240 V180 H120 Z M136 56 V164 H224 V56 Z" className="f-surface2 s-muted" fillRule="evenodd" strokeWidth={1.5}/>
   <path d="M128 48 H232 V172 H128 Z" className="s-warn f-none" strokeWidth={1.5} strokeDasharray="6 4"/>
   <polygon points="186,48 176,43 176,53" className="f-warn"/>
   <T x={180} y={34} size={15} anchor="middle" bold cls="t-warn">Φ</T>
   {turns(118,64,156,8,'s-l1')}
   {turns(222,78,146,4,'s-primary')}
   <path d="M118 64 H70 M118 156 H70" className="s-fg" strokeWidth={1.5}/>
   <circle cx={70} cy={64} r={3} className="f-fg"/><circle cx={70} cy={156} r={3} className="f-fg"/>
   <T x={62} y={106} size={13} anchor="end">U<Sub>1</Sub> = 230 V</T><T x={62} y={122} size={13} anchor="end">I<Sub>1</Sub> = 0,26 A</T>
   <path d="M242 78 H290 V96 M242 146 H290 V128" className="s-fg f-none" strokeWidth={1.5}/>
   <rect x={282} y={96} width={16} height={32} className="f-surface s-fg" strokeWidth={1.5}/>
   <T x={304} y={108} size={13}>U<Sub>2</Sub> = 12 V</T><T x={304} y={124} size={13}>I<Sub>2</Sub> = 5 A</T>
   <T x={118} y={200} size={13} anchor="middle">Primer, N<Sub>1</Sub> = 1000</T>
   <T x={250} y={200} size={13} anchor="middle">Szekunder, N<Sub>2</Sub> ≈ 52</T>
   <T x={180} y={230} size={13} anchor="middle">U<Sub>1</Sub> / U<Sub>2</Sub> = N<Sub>1</Sub> / N<Sub>2</Sub> = I<Sub>2</Sub> / I<Sub>1</Sub></T>
  </g>
 </Svg>;
}
