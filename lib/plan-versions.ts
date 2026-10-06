import type {Database,Statement} from '@/db/database';
export const HISTORY_LIMIT=30;
export type PlanVersion={revision:number;name:string;savedAt:string};
// Snapshot and update are one transaction: neither can commit alone.
export async function saveWithHistory(db:Database,key:string,data:string,revision:number,now:string){
 if(!db.batch)throw Error('Atomic database operations unavailable');
 const statements:Statement[]=[];
 // Serialize writers for this project before INSERT ... SELECT takes shared locks.
 if(db.kind==='mysql')statements.push({sql:'SELECT id FROM plans WHERE id = ? FOR UPDATE',params:[key]});
 statements.push({sql:"INSERT INTO plan_versions (project_id,revision,data,saved_at) SELECT id,revision,data,updated_at FROM plans WHERE id = ? AND revision = ? AND state = 'active'",params:[key,revision]});
 const updateIndex=statements.length;
 statements.push({sql:"UPDATE plans SET data = ?, revision = revision + 1, updated_at = ? WHERE id = ? AND revision = ? AND state = 'active'",params:[data,now,key,revision]});
 // Derived table with LIMIT is compatible with both SQLite and MySQL's target-table rule.
 statements.push({sql:`DELETE FROM plan_versions WHERE project_id = ? AND revision < COALESCE((SELECT revision FROM (SELECT revision FROM plan_versions WHERE project_id = ? ORDER BY revision DESC LIMIT 1 OFFSET ${HISTORY_LIMIT-1}) AS retained_version),0)`,params:[key,key]});
 return (await db.batch(statements))[updateIndex];
}
