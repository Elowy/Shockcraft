import {env} from 'cloudflare:workers';
import {mysqlOptions} from './mysql-config';

type Params=(string|number|null)[];
export interface Database {
  kind:'d1'|'mysql';
  first<T>(sql:string,params?:Params):Promise<T|null>;
  run(sql:string,params?:Params):Promise<number>;
}

// Connections belong to a request; Workers sockets must not be shared across requests.
export async function withDatabase<T>(fn:(db:Database)=>Promise<T>):Promise<T>{
  const config=env as unknown as Record<string,unknown>;
  if(config.MYSQL_URL){
    const {createConnection}=await import('mysql2/promise');
    const connection=await createConnection(mysqlOptions(String(config.MYSQL_URL),config.MYSQL_SSL_CA?String(config.MYSQL_SSL_CA):undefined));
    try{return await fn({kind:'mysql',async first<R>(sql:string,params:Params=[]){const [rows]=await connection.execute(sql,params);return (rows as R[])[0]??null},async run(sql,params=[]){const [result]=await connection.execute(sql,params);return (result as {affectedRows:number}).affectedRows}})}finally{await connection.end()}
  }
  if(!env.DB)throw Error('Database unavailable');
  const db=env.DB;
  return fn({kind:'d1',first:<R>(sql:string,params:Params=[])=>db.prepare(sql).bind(...params).first<R>(),async run(sql,params=[]){const result=await db.prepare(sql).bind(...params).run();return result.meta.changes}});
}

export function insertPlanSql(db:Database){return db.kind==='mysql'?'INSERT IGNORE INTO plans (id,data,revision,updated_at) VALUES (?,?,1,?)':'INSERT INTO plans (id,data,revision,updated_at) VALUES (?,?,1,?) ON CONFLICT(id) DO NOTHING'}
