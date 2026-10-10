import {boardName} from './board-size';
import {moduleLabels} from "./board";
import {labels,siteLabels,type Plan} from './plan';
import {floorLength,siteLength,floorPoints} from './geometry';
import {cableRef,deviceRef,moduleRef,siteRef} from './product-refs';
import type {ProductSnapshot} from './quote-schema';
// A ref gépi típuskulcs a termékválasztáshoz; az add()-kulcsnak és a materialKey-nek nem része.
export type MaterialRow={category:string;location:string;item:string;detail:string;unit:'db'|'m';quantity:number;ref?:string};
export function materialList(plan:Plan,buildingId='all'):MaterialRow[]{
 const rows=new Map<string,MaterialRow>();
 function add(row:MaterialRow){const key=JSON.stringify([row.category,row.location,row.item,row.detail,row.unit]);const old=rows.get(key);if(old)old.quantity+=row.quantity;else rows.set(key,row)}
 for(const b of plan.buildings.filter(b=>buildingId==='all'||b.id===buildingId)){
  for(const f of b.floors){const location=b.name+' / '+f.name;
   for(const d of f.devices)add({category:'Szerelvény',location,item:labels[d.kind],detail:d.height+' cm',unit:'db',quantity:1,ref:deviceRef(d.kind)});
   for(const r of f.routes){const ref=cableRef(r.cable);add({category:'Kábel',location,item:r.cable.trim()||'Nincs kábeltípus',detail:r.mode==='inside'?'Falon belül':'Falon kívül',unit:'m',quantity:floorLength(r,f).total,...(ref?{ref}:{})})}
  }
  for(const m of plan.modules.filter(m=>m.building===b.id)){const c=plan.circuits.find(c=>c.id===m.circuit);add({category:'Elosztókészülék',location:b.name+' / '+boardName(b,m.board),item:moduleLabels[m.type],detail:m.width+' modul'+(c?' · '+c.curve+c.rating+' A':m.type==='RCD'||m.type==='SPD'?' · '+m.name:''),unit:'db',quantity:1,ref:moduleRef(m.type,m.width,c)})}
 }
 if(buildingId==='all'){
  // A linked panel already appears in the floor device count.
  for(const n of plan.plot.nodes.filter(n=>!n.deviceId))add({category:'Telki pont',location:'Telek',item:siteLabels[n.kind],detail:'',unit:'db',quantity:1,ref:siteRef(n.kind)});
  for(const r of plan.plot.routes){const ref=cableRef(r.cable);add({category:'Kábel',location:'Telek',item:r.cable.trim()||'Nincs kábeltípus',detail:({underground:'Föld alatt',surface:'Felszínen',overhead:'Légvezeték'})[r.mode],unit:'m',quantity:siteLength(r,plan).total,...(ref?{ref}:{})})}
 }
 return [...rows.values()].sort((a,b)=>(a.category+a.location+a.item+a.detail).localeCompare(b.category+b.location+b.item+b.detail,'hu'));
}
export function withAllowance(row:MaterialRow,percent:number){return row.quantity*(row.unit==='m'?1+Math.max(0,Math.min(50,Number.isFinite(percent)?percent:0))/100:1)}
// Képletinjekció ellen: a =, +, @, - kezdetű cella elé ' kerül (a katalógus-CSV importja visszafordítja).
export const csvCell=(s:string)=>'"'+(/^[\s]*[=+@-]/.test(s)?"'"+s:s).replaceAll('"','""')+'"';
export const csvNumber=(n:number)=>n.toFixed(2).replace('.',',');
export function materialsCsv(rows:MaterialRow[],percent:number,product?:(r:MaterialRow)=>ProductSnapshot|undefined){
 const extra=(r:MaterialRow)=>{const p=product?.(r);return p?[p.manufacturer,p.family,p.sku,p.name]:['','','','']};
 const data=[['Csoport','Hely','Megnevezés','Részletek','Egység','Terv szerinti mennyiség','Ráhagyás (%)','Ráhagyással',...(product?['Gyártó','Termékcsalád','Cikkszám','Termék megnevezése']:[])],...rows.map(r=>[r.category,r.location,r.item,r.detail,r.unit,csvNumber(r.quantity),r.unit==='m'?String(percent):'0',csvNumber(withAllowance(r,percent)),...(product?extra(r):[])])];
 return '\uFEFF'+data.map(row=>row.map(csvCell).join(';')).join('\r\n');
}
export type SearchResult={id:string;type:'rooms'|'devices'|'routes'|'modules';buildingId:string;floorId:string;title:string;subtitle:string;x:number;y:number};
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('hu');
export function searchPlan(plan:Plan,query:string):SearchResult[]{
 const terms=normalize(query.trim()).split(/\s+/).filter(Boolean);if(!terms.length)return [];
 const found:SearchResult[]=[];
 function add(r:SearchResult){if(terms.every(t=>normalize(r.title+' '+r.subtitle).includes(t)))found.push(r)}
 for(const b of plan.buildings){for(const f of b.floors){const location=b.name+' / '+f.name;
  for(const r of f.rooms)add({id:r.id,type:'rooms',buildingId:b.id,floorId:f.id,title:r.name,subtitle:location+' · Szoba',x:r.x+r.w/2,y:r.y+r.h/2});
  for(const d of f.devices)add({id:d.id,type:'devices',buildingId:b.id,floorId:f.id,title:d.name,subtitle:location+' · '+labels[d.kind]+' · '+d.height+' cm · '+(plan.circuits.find(c=>c.id===d.circuit)?.name||'Nincs áramkör'),x:d.x,y:d.y});
  for(const r of f.routes){const pts=floorPoints(r,f);add({id:r.id,type:'routes',buildingId:b.id,floorId:f.id,title:r.name,subtitle:location+' · Nyomvonal · '+r.cable+' · '+(plan.circuits.find(c=>c.id===r.circuit)?.name||''),x:pts.reduce((s,p)=>s+p.x,0)/pts.length,y:pts.reduce((s,p)=>s+p.y,0)/pts.length})}
 }for(const m of plan.modules.filter(m=>m.building===b.id))add({id:m.id,type:'modules',buildingId:b.id,floorId:b.floors[0]?.id||'',title:m.name,subtitle:b.name+' · '+boardName(b,m.board)+' · Elosztó · '+moduleLabels[m.type]+' · '+(m.row+1)+'. sor · '+(plan.circuits.find(c=>c.id===m.circuit)?.name||''),x:0,y:0})}
 return found;
}
