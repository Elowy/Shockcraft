import type {Database} from '@/db/database';
import type {Account} from '@/lib/auth';
import {projectAccessChecker} from '@/lib/billing';
import {projectKey,type ProjectState} from '@/lib/projects';
import type {ProjectStateRow} from '@/lib/workbook';
// Csak a saját account:{userId} prefix alatti tervek; idegen vagy nem mentett azonosító a kliens felé 'missing'.
export async function projectStates(db:Database,user:Account):Promise<ProjectStateRow[]>{
 const prefix=projectKey(user.userId,'default');
 const rows=await db.all<{id:string;state:ProjectState}>('SELECT id, state FROM plans WHERE id = ? OR (id >= ? AND id < ?)',[prefix,prefix+':project:',prefix+':project;']);
 const allowed=await projectAccessChecker(db,user);
 return rows.map(r=>({id:r.id===prefix?'default':r.id.slice((prefix+':project:').length),state:r.state,locked:!allowed(r.id)}));
}
