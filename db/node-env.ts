// Server-only replacement for Workers bindings in the Node standalone build.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
const root=resolve(process.env.SHOCKCRAFT_UPLOAD_DIR||'.shockcraft/uploads');
function file(key:string){if(!/^backgrounds\/[a-f0-9]{64}\/[a-f0-9-]{36}\.jpg$/.test(key))throw Error('Invalid asset key');return resolve(root,key)}
const BACKGROUNDS={async put(key:string,bytes:Uint8Array){const path=file(key);await mkdir(dirname(path),{recursive:true});await writeFile(path,bytes,{flag:'wx',mode:0o600})},async get(key:string){try{const bytes=await readFile(file(key));return {body:new Blob([bytes]).stream()}}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return null;throw e}}};
export const env={...process.env,SHOCKCRAFT_NODE_RUNTIME:'1',BACKGROUNDS};
