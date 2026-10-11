// Saját SVG-ábrák: elektromos áram, ellenállás, feszültség (2), teljesítmény, Ohm-háromszög. A vázlatok [ÁBRA: …] leírása alapján.
import {Arrow,Sub,Svg,T,curve,type FigProps} from './kit';

/** elektromos-aram / abra-1: egyenáram és 50 Hz-es váltakozó áram közös időtengelyen (I_eff = 10 A, Î ≈ 14,1 A). */
export function AramDcAc(p:FigProps){
 const x=(ms:number)=>40+ms*6.5,k=3.6,top0=88,bot0=185;
 const ticks=[0,10,20,30,40];
 return <Svg {...p} viewBox="0 0 320 262">
  {ticks.map(t=><line key={'a'+t} x1={x(t)} y1={28} x2={x(t)} y2={top0} className="s-track"/>)}
  {ticks.map(t=><line key={'b'+t} x1={x(t)} y1={125} x2={x(t)} y2={238} className="s-track"/>)}
  <T x={40} y={18} bold>Egyenáram</T>
  <line x1={40} y1={top0} x2={304} y2={top0} className="s-muted" strokeWidth={1.2}/>
  <line x1={40} y1={28} x2={40} y2={top0+4} className="s-muted" strokeWidth={1.2}/>
  <line x1={40} y1={top0-10*k} x2={300} y2={top0-10*k} className="s-primary" strokeWidth={2.5}/>
  <T x={300} y={top0-10*k-6} anchor="end">I = 10 A</T>
  {ticks.map(t=><T key={'c'+t} x={x(t)} y={top0+14} size={11} anchor="middle" cls="t-muted">{t===40?'40 ms':t}</T>)}
  <T x={40} y={120} bold>Váltakozó áram, 50 Hz</T>
  <line x1={40} y1={bot0} x2={304} y2={bot0} className="s-muted" strokeWidth={1.2}/>
  <line x1={40} y1={128} x2={40} y2={238} className="s-muted" strokeWidth={1.2}/>
  <line x1={40} y1={bot0-14.14*k} x2={300} y2={bot0-14.14*k} className="s-muted" strokeWidth={1.2} strokeDasharray="2 3"/>
  <line x1={40} y1={bot0-10*k} x2={300} y2={bot0-10*k} className="s-warn" strokeWidth={1.8} strokeDasharray="7 4"/>
  <path d={curve(t=>[x(t),bot0-14.14*k*Math.sin(2*Math.PI*t/20)],0,40,120)} className="s-primary f-none" strokeWidth={2.5}/>
  <T x={300} y={bot0-14.14*k-5} anchor="end" size={11}>Î ≈ 14,1 A</T>
  <T x={300} y={bot0-10*k+15} anchor="end" size={11}>I<Sub>eff</Sub> = 10 A</T>
  <Arrow x1={x(0)} y1={246} x2={x(20)} y2={246} both size={6} w={1.2}/>
  <T x={x(10)} y={258} anchor="middle" size={11}>T = 20 ms</T>
 </Svg>;
}

/** Henger (vezetékdarab) oldalnézetben. */
const Cyl=({x0,len,d,cy}:{x0:number;len:number;d:number;cy:number})=><g>
  <path d={`M${x0} ${cy-d/2} H${x0+len} A${d/4} ${d/2} 0 0 1 ${x0+len} ${cy+d/2} H${x0} A${d/4} ${d/2} 0 0 1 ${x0} ${cy-d/2} Z`} className="f-copper s-fg" strokeWidth={1.5}/>
  <ellipse cx={x0+len} cy={cy} rx={d/4} ry={d/2} className="f-copper-end s-fg" strokeWidth={1.5}/>
 </g>;
/** Méretvonal felirattal. */
const Dim=({x0,len,y,label}:{x0:number;len:number;y:number;label:string})=><g>
  <Arrow x1={x0} y1={y} x2={x0+len} y2={y} both size={6} w={1} cls="s-muted" head="f-muted"/>
  <line x1={x0} y1={y-5} x2={x0} y2={y+5} className="s-muted"/><line x1={x0+len} y1={y-5} x2={x0+len} y2={y+5} className="s-muted"/>
  <T x={x0+len/2} y={y+14} size={11} anchor="middle" cls="t-muted">{label}</T>
 </g>;

/** elektromos-ellenallas / abra-1: kétszeres hossz → kétszeres ellenállás, kétszeres keresztmetszet → fele ellenállás. */
export function EllenallasHenger(p:FigProps){
 return <Svg {...p} viewBox="0 0 320 222">
  <Cyl x0={20} len={100} d={16} cy={30}/><Dim x0={20} len={100} y={52} label="l"/>
  <T x={136} y={35} size={13}>l, A → R</T>
  <Cyl x0={20} len={200} d={16} cy={98}/><Dim x0={20} len={200} y={120} label="2 · l"/>
  <T x={230} y={103} size={13}>2 · l → 2 · R</T>
  <Cyl x0={20} len={100} d={22.6} cy={175}/><Dim x0={20} len={100} y={200} label="l"/>
  <T x={136} y={172} size={13}>2 · A → R / 2</T>
  <T x={136} y={188} size={11} cls="t-muted">(kétszeres keresztmetszet)</T>
 </Svg>;
}

/** elektromos-feszultseg / abra-1: a 230 V-os hálózati feszültség egy periódusa (Û ≈ 325 V, csúcstól csúcsig ≈ 650 V). */
export function FeszultsegPeriodus(p:FigProps){
 const x=(ms:number)=>50+ms*12.5,y=(v:number)=>95-v*0.2;
 return <Svg {...p} viewBox="0 0 320 220">
  {[-400,-300,-200,-100,0,100,200,300,400].map(v=><line key={v} x1={50} y1={y(v)} x2={300} y2={y(v)} className={v===0?'s-muted':'s-track'} strokeWidth={v===0?1.2:1}/>)}
  {[0,5,10,15,20].map(t=><line key={t} x1={x(t)} y1={y(400)} x2={x(t)} y2={y(-400)} className="s-track"/>)}
  {[-400,-200,0,200,400].map(v=><T key={v} x={45} y={y(v)+4} size={11} anchor="end" cls="t-muted">{v>0?'+'+v:v<0?'−'+(-v):'0'}</T>)}
  <T x={9} y={y(0)} size={11} anchor="middle" cls="t-muted" rotate={-90}>U (V)</T>
  {[0,5,10,15,20].map(t=><T key={t} x={x(t)} y={194} size={11} anchor="middle" cls="t-muted">{t===20?'20 ms':t}</T>)}
  <line x1={50} y1={y(325)} x2={300} y2={y(325)} className="s-muted" strokeDasharray="6 4" strokeWidth={1.3}/>
  <line x1={50} y1={y(-325)} x2={300} y2={y(-325)} className="s-muted" strokeDasharray="6 4" strokeWidth={1.3}/>
  <line x1={50} y1={y(230)} x2={300} y2={y(230)} className="s-warn" strokeWidth={1.5}/>
  <path d={curve(t=>[x(t),y(325*Math.sin(2*Math.PI*t/20))],0,20,100)} className="s-primary f-none" strokeWidth={2.5}/>
  <T x={x(17)-8} y={y(325)-4} anchor="end" size={11}>Û ≈ 325 V</T>
  <T x={x(17)-8} y={y(230)-4} anchor="end" size={11}>U<Sub>eff</Sub> = 230 V</T>
  <Arrow x1={x(17)} y1={y(325)} x2={x(17)} y2={y(-325)} both size={7} w={1.3}/>
  <T x={175} y={212} anchor="middle" size={11}>↕ csúcstól csúcsig ≈ 650 V</T>
 </Svg>;
}

/** elektromos-feszultseg / abra-2: háromfázisú feszültségek vektorábrája (120°, vonali ≈ 400 V). */
export function FazisVektor(p:FigProps){
 const cx=160,cy=140,L=90,pt=(deg:number)=>[cx+L*Math.cos(deg*Math.PI/180),cy-L*Math.sin(deg*Math.PI/180)] as const;
 const [l1,l2,l3]=[pt(90),pt(-30),pt(210)];
 const arc=(a0:number,a1:number,r:number)=>{const s=[cx+r*Math.cos(a0*Math.PI/180),cy-r*Math.sin(a0*Math.PI/180)],e=[cx+r*Math.cos(a1*Math.PI/180),cy-r*Math.sin(a1*Math.PI/180)];return `M${s[0].toFixed(1)} ${s[1].toFixed(1)} A${r} ${r} 0 0 1 ${e[0].toFixed(1)} ${e[1].toFixed(1)}`};
 return <Svg {...p} viewBox="0 0 320 236">
  <path d={arc(-30,-150,30)} className="s-muted f-none" strokeWidth={1.3}/>
  <T x={cx} y={cy+44} anchor="middle" size={11} cls="t-muted">120°</T>
  <line x1={l1[0]} y1={l1[1]} x2={l2[0]} y2={l2[1]} className="s-primary" strokeWidth={2} strokeDasharray="6 4"/>
  <Arrow x1={cx} y1={cy} x2={l1[0]} y2={l1[1]} cls="s-l1" head="f-l1" w={3} size={10}/>
  <Arrow x1={cx} y1={cy} x2={l2[0]} y2={l2[1]} cls="s-l2" head="f-l2" w={3} size={10}/>
  <Arrow x1={cx} y1={cy} x2={l3[0]} y2={l3[1]} cls="s-l3" head="f-l3" w={3} size={10}/>
  <circle cx={cx} cy={cy} r={4} className="f-fg"/>
  <T x={cx-10} y={cy+4} anchor="end" bold>N</T>
  <T x={l1[0]} y={l1[1]-8} anchor="middle" bold>L1 230 V</T>
  <T x={l2[0]+4} y={l2[1]+18} anchor="middle" bold>L2 230 V</T>
  <T x={l3[0]-4} y={l3[1]+18} anchor="middle" bold>L3 230 V</T>
  <T x={208} y={84} size={11}>U<Sub>v</Sub> = √3 · 230 V</T>
  <T x={208} y={98} size={11}>≈ 400 V</T>
 </Svg>;
}

/** elektromos-teljesitmeny / abra-1: teljesítményháromszög (230 V, 5 A, cos φ = 0,8). */
export function TeljesitmenyHaromszog(p:FigProps){
 const ang=Math.atan2(150,200),r=36;
 return <Svg {...p} viewBox="0 0 320 200">
  <line x1={40} y1={160} x2={240} y2={160} className="s-primary" strokeWidth={3}/>
  <line x1={240} y1={160} x2={240} y2={10} className="s-warn" strokeWidth={3} strokeDasharray="8 5"/>
  <line x1={40} y1={160} x2={240} y2={10} className="s-fg" strokeWidth={3}/>
  <path d="M230 160 V150 H240" className="s-fg f-none" strokeWidth={1.2}/>
  <path d={`M${40+r} 160 A${r} ${r} 0 0 0 ${(40+r*Math.cos(ang)).toFixed(1)} ${(160-r*Math.sin(ang)).toFixed(1)}`} className="s-muted f-none" strokeWidth={1.5}/>
  <T x={82} y={152} size={12}>φ ≈ 36,9°</T>
  <T x={140} y={180} anchor="middle">P = 920 W (hatásos)</T>
  <T x={248} y={82}>Q = 690 var</T>
  <T x={248} y={97} cls="t-muted">(meddő)</T>
  <T x={128} y={78} anchor="middle" rotate={-36.87}>S = 1150 VA (látszólagos)</T>
 </Svg>;
}

/** ohm-torvenye / abra-1: Ohm-háromszög. */
export function OhmHaromszog(p:FigProps){
 const h=180*Math.sqrt(3)/2,base=170,apexY=base-h,midY=base-h/2,hw=45;
 return <Svg {...p} viewBox="0 0 260 210">
  <polygon points={`40,${base} 220,${base} 130,${apexY.toFixed(1)}`} className="f-surface s-fg" strokeWidth={2}/>
  <line x1={130-hw} y1={midY} x2={130+hw} y2={midY} className="s-fg" strokeWidth={2}/>
  <line x1={130} y1={midY} x2={130} y2={base} className="s-fg" strokeWidth={2}/>
  <T x={130} y={midY-16} size={28} anchor="middle" bold cls="t-primary">U</T>
  <T x={96} y={base-22} size={28} anchor="middle" bold>R</T>
  <T x={164} y={base-22} size={28} anchor="middle" bold>I</T>
  <T x={50} y={198} size={13} anchor="middle" cls="t-muted">U = R · I</T>
  <T x={130} y={198} size={13} anchor="middle" cls="t-muted">I = U / R</T>
  <T x={210} y={198} size={13} anchor="middle" cls="t-muted">R = U / I</T>
 </Svg>;
}
