import {type Plan,validatePlan} from './plan';
import {type ProjectSummary,validProjectId} from './projects';
type Record={plan:Plan;revision:number;updatedAt:string};
const key='shockcraft-guest-projects-v1';
export function localProjects():{[id:string]:Record}{const raw=localStorage.getItem(key);if(!raw)return {};const rows=JSON.parse(raw);if(!rows||typeof rows!=='object'||Array.isArray(rows))throw Error('A helyi projektlista nem olvasható.');return rows}
export function localProjectList():ProjectSummary[]{return Object.entries(localProjects()).filter(([id])=>validProjectId(id)).map(([id,r])=>({id,name:r.plan.name,revision:r.revision,updatedAt:r.updatedAt})).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))}
export function readLocalProject(id:string){const row=localProjects()[id];return row?{...row,plan:validatePlan(row.plan)}:null}
export function saveLocalProject(id:string,plan:Plan,revision:number){const rows=localProjects();if((rows[id]?.revision??0)!==revision)throw Error('A projekt egy másik ablakban módosult. Exportáld a munkádat, majd nyisd meg újra a mentett változatot.');const next=revision+1;rows[id]={plan:validatePlan(plan),revision:next,updatedAt:new Date().toISOString()};localStorage.setItem(key,JSON.stringify(rows));return next}
