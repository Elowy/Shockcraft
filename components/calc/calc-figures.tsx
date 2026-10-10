// Saját SVG-ábrák a kalkulátorokhoz (szerver- és kliensoldalon is renderelhető, hook nélkül):
// teljesítményháromszög, ΔU-sáv, fázissávok, ellenállássávok. A szín sosem egyedüli jel: minden elemen felirat.
import type {Figure} from '@/lib/calc/core';
import {formatNum,formatSI} from '@/lib/calc/number';

const pct=(n:number)=>formatNum(n)+'\u00a0%';

function PowerTriangle({f,id}:{f:Extract<Figure,{kind:'power-triangle'}>;id:string}){
 // A befogók arányosak; a vízszintes legfeljebb 170, a függőleges legfeljebb 120 egység, hogy a Q-felirat jobbra elférjen.
 const W=170,H=120,ox=30,oy=150;
 const k=Math.min(W/Math.max(f.P,1e-12),f.Q>0?H/f.Q:Infinity);
 const px=ox+Math.max(f.P*k,4),qy=oy-f.Q*k;
 const [pu,qu,su]=f.units;
 const desc=`Teljesítményháromszög: hatásos teljesítmény P = ${formatSI(f.P,pu)} vízszintesen, meddő teljesítmény Q = ${formatSI(f.Q,qu)} függőlegesen, látszólagos teljesítmény S = ${formatSI(f.S,su)} az átfogón, φ = ${formatNum(f.phi,2)}°.`;
 return <svg className="kk-figure-svg" viewBox="0 0 320 190" role="img" aria-labelledby={id+'-t '+id+'-d'}>
  <title id={id+'-t'}>Teljesítményháromszög</title><desc id={id+'-d'}>{desc}</desc>
  <line x1={ox} y1={oy} x2={px} y2={oy} className="fig-p"/>
  {f.Q>0&&<line x1={px} y1={oy} x2={px} y2={qy} className="fig-q"/>}
  <line x1={ox} y1={oy} x2={px} y2={qy} className="fig-s"/>
  {f.Q>0&&<path d={`M${ox+34} ${oy} A34 34 0 0 0 ${ox+34*Math.cos(f.phi*Math.PI/180)} ${oy-34*Math.sin(f.phi*Math.PI/180)}`} className="fig-arc"/>}
  <text x={(ox+px)/2} y={oy+20} textAnchor="middle" className="fig-label">P = {formatSI(f.P,pu)}</text>
  {f.Q>0&&<text x={px+6} y={(oy+qy)/2} className="fig-label">Q = {formatSI(f.Q,qu)}</text>}
  <text x={(ox+px)/2-8} y={(oy+qy)/2-8} textAnchor="end" className="fig-label">S = {formatSI(f.S,su)}</text>
  <text x={ox+40} y={oy-8} className="fig-small">φ = {formatNum(f.phi,2)}°</text>
 </svg>;
}

function DropBar({f,id}:{f:Extract<Figure,{kind:'drop-bar'}>;id:string}){
 const max=Math.max(f.limit*1.5,f.value*1.1,1),x=(v:number)=>20+Math.min(v,max)/max*280,over=f.value>f.limit;
 return <svg className="kk-figure-svg" viewBox="0 0 320 90" role="img" aria-labelledby={id+'-t '+id+'-d'}>
  <title id={id+'-t'}>Feszültségesés a határhoz képest</title><desc id={id+'-d'}>{`${f.label}: ${pct(f.value)}; határ: ${pct(f.limit)}; ${over?'meghaladja a határt':'a határon belül'}.`}</desc>
  <rect x="20" y="30" width="280" height="22" rx="4" className="fig-track"/>
  <rect x="20" y="30" width={x(f.value)-20} height="22" rx="4" className={over?'fig-bad':'fig-good'}/>
  <line x1={x(f.limit)} y1="22" x2={x(f.limit)} y2="60" className="fig-limit"/>
  <text x={x(f.limit)} y="16" textAnchor="middle" className="fig-small">határ {pct(f.limit)}</text>
  <text x="20" y="78" className="fig-label">{f.label}: {pct(f.value)} {over?'(a határ fölött)':'(a határon belül)'}</text>
 </svg>;
}

function PhaseBars({f,id}:{f:Extract<Figure,{kind:'phase-bars'}>;id:string}){
 const bars=[...f.phases.map((p,i)=>({...p,cls:'fig-l'+(i+1)})),...(f.neutral!==undefined?[{label:'N',value:f.neutral,cls:'fig-n'}]:[])];
 const max=Math.max(1e-9,...bars.map(b=>b.value));
 return <svg className="kk-figure-svg" viewBox={`0 0 320 ${bars.length*34+12}`} role="img" aria-labelledby={id+'-t '+id+'-d'}>
  <title id={id+'-t'}>Fázisáramok és nullavezető-áram</title><desc id={id+'-d'}>{bars.map(b=>`${b.label}: ${formatNum(b.value)} ${f.unit}`).join('; ')}</desc>
  {bars.map((b,i)=><g key={b.label} transform={`translate(0 ${i*34+8})`}>
   <text x="4" y="17" className="fig-label">{b.label}</text>
   <rect x="34" y="4" width="200" height="18" rx="3" className="fig-track"/>
   <rect x="34" y="4" width={Math.max(b.value>0?2:0,b.value/max*200)} height="18" rx="3" className={b.cls}/>
   <text x="242" y="17" className="fig-label">{formatNum(b.value)} {f.unit}</text>
  </g>)}
 </svg>;
}

function Resistor({f,id}:{f:Extract<Figure,{kind:'resistor'}>;id:string}){
 const gap=f.bands.length>4?24:28;
 return <svg className="kk-figure-svg" viewBox="0 0 320 90" role="img" aria-labelledby={id+'-t '+id+'-d'}>
  <title id={id+'-t'}>Ellenállás színsávjai</title><desc id={id+'-d'}>{'Sávok balról jobbra: '+f.label}</desc>
  <line x1="10" y1="40" x2="310" y2="40" className="fig-lead"/>
  <rect x="70" y="18" width="180" height="44" rx="18" className="fig-body"/>
  {f.bands.map((c,i)=><rect key={i} x={i===f.bands.length-1&&f.bands.length>3?210:96+i*gap} y="18" width="12" height="44" fill={c} className="fig-band"/>)}
  <text x="160" y="82" textAnchor="middle" className="fig-small">{f.label}</text>
 </svg>;
}

export function CalcFigure({figure,id}:{figure:Figure;id:string}){
 switch(figure.kind){
  case 'power-triangle':return <PowerTriangle f={figure} id={id}/>;
  case 'drop-bar':return <DropBar f={figure} id={id}/>;
  case 'phase-bars':return <PhaseBars f={figure} id={id}/>;
  case 'resistor':return <Resistor f={figure} id={id}/>;
 }
}
