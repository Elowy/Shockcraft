import {labels,uid,type Device,type Floor,type Point} from './plan';
import {wallSnap} from './wall-snap';

function copyName(source:Device,devices:Device[]){
 const used=new Set(devices.map(d=>d.name.trim().toLocaleLowerCase('hu-HU')));
 const original=source.name.trim()||labels[source.kind];
 const numbered=original.match(/^(.*?)(\d+)$/);
 if(numbered&&Number.isSafeInteger(Number(numbered[2]))&&numbered[2].length<=8){
  for(let i=1;i<=devices.length+1;i++){
   const suffix=String(Number(numbered[2])+i).padStart(numbered[2].length,'0');
   const candidate=numbered[1].slice(0,120-suffix.length)+suffix;
   if(!used.has(candidate.toLocaleLowerCase('hu-HU')))return candidate;
  }
 }
 const base=original.replace(/ – másolat(?: \d+)?$/,'').slice(0,100);
 for(let i=1;i<=devices.length+1;i++){
  const candidate=base+' – másolat'+(i===1?'':' '+i);
  if(!used.has(candidate.toLocaleLowerCase('hu-HU')))return candidate;
 }
 throw Error('Nem sikerült egyedi nevet létrehozni.');
}

/** Makes a standalone device; existing route and plot references retain the original ID. */
export function copyDevice(floor:Floor,id:string):Device{
 const source=floor.devices.find(d=>d.id===id);
 if(!source)throw Error('A másolandó szerelvény nem található.');
 if(floor.devices.length>=2000)throw Error('Egy szinten legfeljebb 2000 szerelvény lehet.');
 const free=(p:Point)=>p.x>=0&&p.y>=0&&p.x<=2000&&p.y<=2000&&floor.devices.every(d=>Math.hypot(d.x-p.x,d.y-p.y)>=28);
 const candidates:Point[]=[];
 const wall=source.kind==='light'?null:wallSnap(source,floor,source.angle,1);
 // Prefer the original wall without changing the manually chosen symbol angle.
 if(wall){const angle=wall.angle*Math.PI/180;for(const distance of [40,-40,80,-80,120,-120]){
  const p={x:source.x+Math.cos(angle)*distance,y:source.y+Math.sin(angle)*distance};
  const match=wallSnap(p,floor,wall.angle,1);
  if(match&&Math.abs(match.angle-wall.angle)<.001)candidates.push(match.point);
 }}
 for(let distance=40;distance<=400;distance+=40)for(const [x,y] of [[1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,1],[-1,-1],[1,-1]])candidates.push({x:source.x+x*distance,y:source.y+y*distance});
 const position=candidates.find(free);
 if(!position)throw Error('A közelben nincs szabad hely a másolatnak. Mozgass el néhány szerelvényt, és próbáld újra.');
 return {...structuredClone(source),...position,id:uid(),name:copyName(source,floor.devices)};
}
