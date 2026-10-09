import type {PointerEvent} from 'react';
import {openingGeometry,openingLabel,type WallHost,type Opening} from '@/lib/architecture';
export function OpeningMark({host,opening,onPick}:{host:WallHost;opening:Opening;onPick?:(e:PointerEvent<SVGGElement>)=>void}){
 const g=openingGeometry(host,opening),color=opening.kind==='door'?'var(--plan-wall)':'#477f9b';
 return <g data-opening-id={opening.id} aria-label={openingLabel(opening)+' · '+opening.width+' cm'} onPointerDown={onPick} style={{cursor:onPick?'pointer':undefined}}>
  <line x1={g.start.x} y1={g.start.y} x2={g.end.x} y2={g.end.y} stroke="transparent" strokeWidth={Math.max(18,host.thickness*.4+8)}/>
  {g.lines.map((points,i)=><polyline key={i} points={points.map(p=>p.x+','+p.y).join(' ')} fill="none" stroke={color} strokeWidth="1.6"/>)}
 </g>;
}
