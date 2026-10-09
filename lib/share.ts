import {z} from 'zod';
import {validatePlan,type Plan,type Floor} from './plan';
import {validProjectId} from './projects';
import {floorPoints} from './geometry';

// Csak olvasható tervmegosztás: tiszta segédek (kliensen és szerveren is), cloudflare:workers, auth és billing nélkül.
export const SHARE_TOKEN_RE=/^[a-f0-9]{64}$/;
export const SHARE_TOKEN_KEY='shockcraft-share-token'; // sessionStorage-kulcs
export const SHARE_DAYS=[1,7,30,90] as const,DEFAULT_SHARE_DAYS=30;
export const SHARE_PROJECT_LIMIT=10,SHARE_LABEL_MAX=80;
export const SHARE_LIMITS={ip:120,link:300,create:30} as const; // 15 perces ablakonként
export const SHARE_VIEW_TOUCH_MS=10*60*1000;
export const SHARE_CLEANUP_RATE=.01; // a nyilvános megnyitások ennyi hányadában takarítjuk a lejárt keretsorokat

// A megtekintési IP-keret kulcsa. IPv6-nál a /64-es előtag számít: egy előfizető jellemzően egész /64-et kap, így a
// címek forgatása nem ad új keretet. IPv4-be leképezett IPv6-nál maga az IPv4. Hiányzó fejlécnél közös 'unknown' kulcs.
export function shareIpKey(raw:string):string{
 const ip=raw.trim().toLowerCase().replace(/^\[([^\]]*)\](?::\d+)?$/,'$1').replace(/%.*$/,'');
 if(!ip)return 'unknown';
 if(!ip.includes(':'))return ip;
 const hex=(g:string)=>{const v4=/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(g);return v4?[((+v4[1]<<8)|+v4[2]).toString(16),((+v4[3]<<8)|+v4[4]).toString(16)]:[g]};
 const part=(s:string)=>s?s.split(':').flatMap(hex):[];
 const halves=ip.split('::'),head=part(halves[0]),tail=halves.length===2?part(halves[1]):[];
 const groups=halves.length===2?[...head,...Array<string>(Math.max(0,8-head.length-tail.length)).fill('0'),...tail]:head;
 if(halves.length>2||groups.length!==8||!groups.every(g=>/^[0-9a-f]{1,4}$/.test(g)))return 'v6:'+ip.slice(0,64);
 const n=groups.map(g=>parseInt(g,16));
 if(n.slice(0,5).every(v=>v===0)&&n[5]===0xffff)return [n[6]>>8,n[6]&255,n[7]>>8,n[7]&255].join('.');
 return n.slice(0,4).map(v=>v.toString(16)).join(':')+'::/64';
}
export const newShareToken=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');

const HU={
 project:'Érvénytelen projektazonosító.',
 label:'A címke legfeljebb 80 karakter lehet.',
 control:'A címke nem tartalmazhat vezérlő- vagy láthatatlan karaktert.',
 days:'Az érvényesség 1, 7, 30 vagy 90 nap lehet.',
 revoke:'Adj meg pontosan egy linket, vagy kérd az összes visszavonását.',
 generic:'A megadott adatok érvénytelenek.',
} as const;
const OWN=new Set<string>(Object.values(HU));
// C0/C1 vezérlők, zero-width és bidi-vezérlő karakterek: a címke a tulajdonosi listában szövegként jelenik meg.
const CONTROL=/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff]/;
const projectId=z.string().refine(validProjectId,HU.project);
const userId=z.string().min(1).max(80);

export const shareCreateSchema=z.object({
 projectId,
 userId,
 label:z.string().default('').transform(s=>s.trim()).pipe(z.string().max(SHARE_LABEL_MAX,HU.label).refine(s=>!CONTROL.test(s),HU.control)),
 days:z.number().refine(v=>(SHARE_DAYS as readonly number[]).includes(v),HU.days).default(DEFAULT_SHARE_DAYS),
 allowPdf:z.boolean().default(false),
}).strict();
export const shareRevokeSchema=z.object({projectId,userId,id:z.string().uuid().optional(),all:z.literal(true).optional()}).strict().refine(v=>!!v.id!==!!v.all,HU.revoke);
export const shareViewSchema=z.object({token:z.string().regex(SHARE_TOKEN_RE),purpose:z.enum(['view','pdf']).default('view')}).strict();
export type ShareCreateInput=z.infer<typeof shareCreateSchema>;
// Csak a saját magyar üzeneteink juthatnak ki; minden más (angol Zod-szöveg, JSON-hiba) általános üzenet.
export function shareInputError(e:unknown):string{if(e instanceof z.ZodError){const message=e.issues[0]?.message;if(message&&OWN.has(message))return message}return HU.generic}

export type ShareProjectStatus='active'|'inactive'|'locked'|'missing';
export type ShareSummary={id:string;label:string;allowPdf:boolean;createdAt:number;expiresAt:number;lastViewedAt:number|null};
export type SharedView={plan:Plan;updatedAt:string;expiresAt:number;pdf:boolean;backgroundFloors:string[]};

// A megtekintő árajánlatot és háttéralaprajzot (assetId, fájlnév) nem kap; a szintek csak jelzést kapnak a háttér létéről.
export function sharedPlan(raw:unknown):{plan:Plan;backgroundFloors:string[]}{
 const plan=validatePlan(raw),backgroundFloors:string[]=[];
 delete plan.quote;
 for(const b of plan.buildings)for(const f of b.floors)if(f.background){backgroundFloors.push(f.id);delete f.background}
 return {plan,backgroundFloors};
}
export const shareLink=(origin:string,token:string)=>origin+'/megosztas#t='+token;
export function readShareToken(hash:string){const token=new URLSearchParams(hash.replace(/^#/,'')).get('t')||'';return SHARE_TOKEN_RE.test(token)?token:''}

// Az alaprajz befoglaló doboza. Ciklussal számolunk: nagy tervnél a Math.min(...spread) túllépné az argumentumkorlátot.
export function floorViewBox(f:Floor):{x:number;y:number;w:number;h:number}{
 let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
 const add=(x:number,y:number)=>{if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y};
 for(const r of f.rooms){add(r.x,r.y);add(r.x+r.w,r.y+r.h)}
 for(const w of f.walls){add(w.a.x,w.a.y);add(w.b.x,w.b.y)}
 for(const d of f.devices)add(d.x,d.y);
 for(const r of f.routes)for(const p of floorPoints(r,f))add(p.x,p.y);
 for(const d of f.dimensions||[]){const o=Math.abs(d.offset);for(const p of [d.a,d.b]){add(p.x-o,p.y-o);add(p.x+o,p.y+o)}}
 if(minX===Infinity)return {x:0,y:0,w:1000,h:720};
 const pad=80;let x=minX-pad,y=minY-pad,w=maxX-minX+2*pad,h=maxY-minY+2*pad;
 if(w<400){x-=(400-w)/2;w=400}
 if(h<288){y-=(288-h)/2;h=288}
 return {x,y,w,h};
}
