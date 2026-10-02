import type {PointerEvent} from 'react';
import {dimensionGeometry,type Dimension} from '@/lib/dimensions';
export function DimensionMark({dimension,selected=false,onPick}:{dimension:Dimension;selected?:boolean;onPick?:(e:PointerEvent<SVGGElement|SVGCircleElement>,handle?:number)=>void}){
 const g=dimensionGeometry(dimension),color=selected?'#258574':'var(--foreground)';
 return <g data-dimension-id={dimension.id} aria-label={dimension.name+': '+g.text}>
  <g onPointerDown={onPick?e=>onPick(e):undefined} style={{cursor:onPick?'move':undefined}}>
   <line x1={g.a.x} y1={g.a.y} x2={g.b.x} y2={g.b.y} stroke="transparent" strokeWidth="18"/>
   {g.lines.map(([a,b],i)=><line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={i<2?1:1.8}/>)}
   <text x={g.label.x} y={g.label.y} textAnchor="middle" fontSize="14" fill={color} stroke="var(--plan-room)" strokeWidth="5" strokeLinejoin="round" style={{paintOrder:'stroke'}}>{g.text}</text>
  </g>
  {selected&&onPick&&<g data-editor-guide="dimension-handles">{[dimension.a,dimension.b].map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="7" fill="var(--plan-room)" stroke="#258574" strokeWidth="2" style={{cursor:'crosshair'}} onPointerDown={e=>onPick(e,i)}/>)}</g>}
 </g>;
}
