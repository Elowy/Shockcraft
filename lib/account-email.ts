import {env} from 'cloudflare:workers';
import type {Database} from '@/db/database';
import {digest,hashPassword,passwordValid} from './auth';
import {unseal} from './secrets';

export type MailConfig={enabled:boolean;apiKey:string;from:string};
export type MailUser={id:string;email:string;auth_version:number;email_verified_at:number|null};
export async function mailConfig(db:Database){const row=await db.first<{data:string;revision:number}>('SELECT data, revision FROM mail_settings WHERE id = ?',['resend']);return {config:row?await unseal<MailConfig>(row.data):{enabled:false,apiKey:'',from:''},revision:row?.revision||0}}
export function mailReady(config:MailConfig){return config.enabled&&!!config.apiKey&&!!config.from}
export function publicOrigin(){const raw=(env as unknown as Record<string,string>).APP_ORIGIN;if(!raw)throw Error('Az oldal címe nincs beállítva.');const url=new URL(raw);if(url.origin!==raw||(url.protocol!=='https:'&&!['127.0.0.1','localhost'].includes(url.hostname)))throw Error('Az oldal címe hibás.');return raw}
export async function deliver(config:MailConfig,to:string,subject:string,text:string,id:string){
 if(!mailReady(config))throw Error('A levélküldés még nincs beállítva.');
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+config.apiKey,'Content-Type':'application/json','Idempotency-Key':id},body:JSON.stringify({from:config.from,to:[to],subject,text}),signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw Error('A levélküldő szolgáltatás nem fogadta el a levelet.');
 const result=await response.json() as {id?:string};if(!result.id)throw Error('A levélküldés nem igazolható.');
}
export async function sendAccountLink(db:Database,user:MailUser,purpose:'verify'|'reset',config:MailConfig){
 const now=Date.now();
 // A database constraint makes the one-minute send cooldown safe across concurrent requests.
 const slot='mail:'+user.id+':'+purpose+':'+Math.floor(now/60000);
 const sql=db.kind==='mysql'?'INSERT IGNORE INTO auth_limits (`key`,attempts,expires_at) VALUES (?,1,?)':'INSERT INTO auth_limits (`key`,attempts,expires_at) VALUES (?,1,?) ON CONFLICT DO NOTHING';
 const throttleKey=await digest(slot);if(!await db.run(sql,[throttleKey,now+60000]))return false;
 const token=Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');
 const tokenHash=await digest(token),expires=now+(purpose==='reset'?30*60*1000:24*60*60*1000);
 const link=publicOrigin()+(purpose==='reset'?'/fiok/jelszo':'/fiok/megerosites')+'#token='+token;
 await db.run('DELETE FROM account_tokens WHERE expires_at <= ?',[now]);
 await db.run('INSERT INTO account_tokens (token_hash,user_id,email,purpose,auth_version,expires_at,created_at) VALUES (?,?,?,?,?,?,?)',[tokenHash,user.id,user.email,purpose,user.auth_version,expires,now]);
 try{await deliver(config,user.email,purpose==='reset'?'ShockCraft – Jelszó visszaállítása':'ShockCraft – E-mail-cím megerősítése',purpose==='reset'?`Új jelszó megadásához nyisd meg ezt a hivatkozást:\n\n${link}\n\nA link 30 percig érvényes, és egyszer használható. A jelszó megváltoztatása kijelentkezteti a fiók korábbi munkameneteit. Ha nem te kérted, hagyd figyelmen kívül ezt a levelet.`:`Erősítsd meg a ShockCraft-fiókod e-mail-címét:\n\n${link}\n\nA link 24 óráig érvényes. Csak akkor erősítsd meg, ha te hoztad létre a fiókot. Ha nem te regisztráltál, hagyd figyelmen kívül ezt a levelet.`,tokenHash)}
 catch{await db.run('DELETE FROM account_tokens WHERE token_hash = ?',[tokenHash]);await db.run('DELETE FROM auth_limits WHERE `key` = ?',[throttleKey]);throw Error('A levelet nem sikerült elküldeni. Próbáld újra később.')}
 return true;
}
export async function consumeAccountLink(db:Database,token:string,purpose:'verify'|'reset',password?:string){
 if(!/^[a-f0-9]{64}$/.test(token))return false;
 const tokenHash=await digest(token),now=Date.now();
 const row=await db.first<{user_id:string;email:string;auth_version:number}>('SELECT user_id,email,auth_version FROM account_tokens WHERE token_hash = ? AND purpose = ? AND expires_at > ?',[tokenHash,purpose,now]);if(!row)return false;
 if(purpose==='reset'&&(!password||!passwordValid(password)))throw Error('A jelszó legalább 12 karakter és legfeljebb 72 bájt legyen.');
 // The user version is the compare-and-swap guard. It invalidates every old session
 // and reset link in the same atomic statement, including a simultaneous login.
 const changed=purpose==='reset'
  ?await db.run('UPDATE users SET password_hash = ?, auth_version = auth_version + 1 WHERE id = ? AND email = ? AND auth_version = ? AND EXISTS (SELECT 1 FROM account_tokens WHERE token_hash = ? AND purpose = ? AND expires_at > ?)',[await hashPassword(password!),row.user_id,row.email,row.auth_version,tokenHash,purpose,Date.now()])
  :await db.run('UPDATE users SET email_verified_at = ? WHERE id = ? AND email = ? AND auth_version = ? AND email_verified_at IS NULL AND EXISTS (SELECT 1 FROM account_tokens WHERE token_hash = ? AND purpose = ? AND expires_at > ?)',[now,row.user_id,row.email,row.auth_version,tokenHash,purpose,Date.now()]);
 if(changed){await db.run('DELETE FROM account_tokens WHERE user_id = ? AND auth_version = ? AND purpose = ?',[row.user_id,row.auth_version,purpose]);}
 return !!changed;
}
