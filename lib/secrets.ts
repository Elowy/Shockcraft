import {env} from 'cloudflare:workers';
async function key(){
 const raw=(env as unknown as Record<string,string>).BILLING_ENCRYPTION_KEY;
 if(!raw||!/^[a-f0-9]{64}$/i.test(raw))throw Error('A szerver titkosítókulcsa nincs beállítva.');
 return crypto.subtle.importKey('raw',Uint8Array.from(raw.match(/../g)!,v=>parseInt(v,16)),{name:'AES-GCM'},false,['encrypt','decrypt']);
}
export async function seal(value:unknown){const iv=crypto.getRandomValues(new Uint8Array(12));const data=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},await key(),new TextEncoder().encode(JSON.stringify(value))));return JSON.stringify({v:1,iv:Array.from(iv),data:Array.from(data)})}
export async function unseal<T>(raw:string):Promise<T>{const v=JSON.parse(raw);const data=await crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(v.iv)},await key(),new Uint8Array(v.data));return JSON.parse(new TextDecoder().decode(data)) as T}
