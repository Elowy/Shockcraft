import {headers} from 'next/headers';
import {env} from 'cloudflare:workers';
import {compare,hash} from 'bcryptjs';
import {withDatabase,type Database} from '@/db/database';

export type Account={userId:string;displayName:string;email:string};
const lifetime=7*24*60*60;
export const privateHeaders={'Cache-Control':'private, no-store','Vary':'Cookie'};
export function localHost(host:string){return /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host)}
export function cookieName(host:string){return localHost(host)?'shockcraft_session':'__Host-shockcraft_session'}
export function readToken(h:Headers){const name=cookieName(h.get('host')||'');const raw=(h.get('cookie')||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(name+'='))?.slice(name.length+1);return raw&&/^[a-f0-9]{64}$/.test(raw)?raw:null}
export function sessionCookie(host:string,token:string,age=lifetime){return `${cookieName(host)}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${localHost(host)?'':'; Secure'}`}
export async function digest(value:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),b=>b.toString(16).padStart(2,'0')).join('')}
export async function accountFromHeaders(db:Database,h:Headers):Promise<Account|null>{
  const token=readToken(h);if(!token)return null;
  const row=await db.first<{id:string;name:string;email:string}>('SELECT u.id, u.name, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?',[await digest(token),Date.now()]);
  return row?{userId:row.id,displayName:row.name,email:row.email}:null;
}
export async function getAccount(){const h=await headers();if(!readToken(h))return null;return withDatabase(db=>accountFromHeaders(db,h))}
export async function makeSession(db:Database,userId:string,h:Headers){
  const token=Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');
  await db.run('INSERT INTO sessions (token_hash,user_id,expires_at,created_at) VALUES (?,?,?,?)',[await digest(token),userId,Date.now()+lifetime*1000,Date.now()]);
  const old=readToken(h);if(old)await db.run('DELETE FROM sessions WHERE token_hash = ?',[await digest(old)]);
  await db.run('DELETE FROM sessions WHERE expires_at <= ?',[Date.now()]);
  return sessionCookie(h.get('host')||'',token);
}
export function sameOrigin(req:Request){const configured=(env as unknown as Record<string,string>).APP_ORIGIN;return req.headers.get('origin')===(configured?new URL(configured).origin:new URL(req.url).origin)&&req.headers.get('sec-fetch-site')!=='cross-site'}
export function passwordValid(password:string){return password.length>=12&&new TextEncoder().encode(password).length<=72&&!password.includes('\0')}
export const hashPassword=(password:string)=>hash(password,12);
// Dummy hash keeps unknown-account and wrong-password verification on the same path.
const dummy='$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW';
export const verifyPassword=(password:string,encoded?:string)=>compare(password,encoded||dummy);
export async function allowAttempt(db:Database,req:Request,email:string){
  const now=Date.now(),windowMs=15*60*1000,bucket=Math.floor(now/windowMs),expires=(bucket+1)*windowMs;
  const identifiers:[string,number][]=[['email:'+email,12]];
  const node=(env as unknown as Record<string,string>).SHOCKCRAFT_NODE_RUNTIME==='1';
  const ip=req.headers.get(node?'x-real-ip':'cf-connecting-ip');if(ip)identifiers.push(['ip:'+ip,40]);
  for(const [identity,limit] of identifiers){const key=await digest(identity+':'+bucket);
    const sql=db.kind==='mysql'?'INSERT INTO auth_limits (`key`,attempts,expires_at) VALUES (?,1,?) ON DUPLICATE KEY UPDATE attempts=attempts+1':'INSERT INTO auth_limits (`key`,attempts,expires_at) VALUES (?,1,?) ON CONFLICT(`key`) DO UPDATE SET attempts=attempts+1';
    await db.run(sql,[key,expires]);const row=await db.first<{attempts:number}>('SELECT attempts FROM auth_limits WHERE `key` = ?',[key]);if(!row||row.attempts>limit)return false;
  }
  await db.run('DELETE FROM auth_limits WHERE expires_at <= ?',[now]);return true;
}
