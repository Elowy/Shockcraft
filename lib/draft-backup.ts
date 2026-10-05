import {type Plan,validatePlan} from './plan';
import {validProjectId} from './projects';
export type DraftBackup={version:1;owner:string;projectId:string;writer:string;revision:number;updatedAt:string;plan:Plan};
export type BackupStore=Pick<Storage,'length'|'key'|'getItem'|'setItem'|'removeItem'>;
const prefix='shockcraft-recovery-v1:';
export const backupKey=(owner:string,projectId:string,writer:string)=>prefix+JSON.stringify([owner,projectId,writer]);
export function listBackups(storage:BackupStore,owner:string):DraftBackup[]{
 const rows:DraftBackup[]=[];
 for(let i=0;i<storage.length;i++){const key=storage.key(i);if(!key?.startsWith(prefix))continue;
  try{const identity=JSON.parse(key.slice(prefix.length));if(identity[0]!==owner)continue;const value=JSON.parse(storage.getItem(key)||'null');
   if(value?.version!==1||value.owner!==owner||!validProjectId(value.projectId)||typeof value.writer!=='string'||key!==backupKey(owner,value.projectId,value.writer)||!Number.isInteger(value.revision)||value.revision<0||!Number.isFinite(Date.parse(value.updatedAt)))continue;
   rows.push({...value,plan:validatePlan(value.plan)});
  }catch{/* One damaged draft must not hide the other drafts. */}
 }
 return rows.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
}
export function writeBackup(storage:BackupStore,backup:DraftBackup){
 if(!backup.owner||!validProjectId(backup.projectId)||!backup.writer||!Number.isInteger(backup.revision)||backup.revision<0)throw Error('Érvénytelen helyreállítási adat.');
 const safe={...backup,version:1,plan:validatePlan(backup.plan)};
 storage.setItem(backupKey(backup.owner,backup.projectId,backup.writer),JSON.stringify(safe));
}
export function clearSavedBackups(storage:BackupStore,owner:string,projectId:string,saved:string){
 for(const b of listBackups(storage,owner))if(b.projectId===projectId&&JSON.stringify(b.plan)===saved)storage.removeItem(backupKey(owner,projectId,b.writer));
}
export function discardBackup(storage:BackupStore,backup:DraftBackup){
 const key=backupKey(backup.owner,backup.projectId,backup.writer),current=storage.getItem(key);
 if(current&&JSON.parse(current).updatedAt!==backup.updatedAt)throw Error('A másolat közben frissült. Nyisd meg újra a Helyreállítás listát.');
 storage.removeItem(key);
}
export function recoveryDestination(backup:DraftBackup,currentRevision:number|null){
 // Never apply a stale draft over a newer server revision.
 return currentRevision===backup.revision||(currentRevision===null&&backup.revision===0)?'original':'copy';
}
