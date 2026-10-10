// A nyilvános oldalcím (APP_ORIGIN) a metadataBase-hez, a sitemaphez és a robots.txt-hez.
// Ugyanazt validálja, mint a lib/account-email.ts publicOrigin()-ja, de nem dob, és nem húzza be az auth/secrets/mail láncot.
// A Tudástár környezeti változót csak a cloudflare:workers env-en át olvas (Node-on ez a db/node-env.ts aliasra fut).
import {env} from 'cloudflare:workers';

const read=(name:string)=>{try{return (env as unknown as Record<string,unknown>)[name]}catch{return undefined}};

export function siteOrigin():string|null{
 const raw=read('APP_ORIGIN');if(typeof raw!=='string'||!raw)return null;
 try{const url=new URL(raw);if(url.origin!==raw||(url.protocol!=='https:'&&!['127.0.0.1','localhost'].includes(url.hostname)))return null;return raw}catch{return null}
}
/** Lektori előnézet: SHOCKCRAFT_KB_PREVIEW=1 (csak helyi vagy staging környezetben, élesben soha). */
export const kbPreview=()=>read('SHOCKCRAFT_KB_PREVIEW')==='1';
