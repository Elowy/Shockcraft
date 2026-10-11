// Az R3 (lektorra váró) vázlatok szövegmintái: a címek, az összefoglalók és a legalább 50 karakteres mondatok
// (content/tudastar/r3/*.md). A tests/kb-content.ts a build bemeneteit (lib, components, app), a tests/kb-dist.mjs a build
// kimenetét (dist/), a tests/kb-routes.mjs a kiszolgált HTML-t nézi végig ezekkel: az R3 szövege sehol nem jelenhet meg.
// A közzétett R1/R2 vázlatok saját szövege kimarad (pl. az R3 cikk címe egy R2 cikkben linkfeliratként áll, és ott „hamarosan –
// szakmai lektorálás alatt” jelöléssel, szövegként jelenik meg).
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';

const md=(dir)=>readdirSync(dir).filter(f=>f.endsWith('.md')).sort().map(f=>join(dir,f));

/** @returns {{slug:string,section:string,category:string}[]} az R3 vázlatok azonosítói */
export function r3Items(root='.'){
 return md(join(root,'content/tudastar/r3')).map(f=>{const s=readFileSync(f,'utf8');return {slug:/^slug:\s*(\S+)/m.exec(s)[1],section:/^section:\s*(\S+)/m.exec(s)[1],category:/^category:\s*(\S+)/m.exec(s)[1]}});
}

/** @returns {string[]} az R3 szövegmintái (legfeljebb 120 karakteres, önmagukban is egyedi részletek) */
export function r3Needles(root='.'){
 const out=new Set();
 for(const f of md(join(root,'content/tudastar/r3'))){
  const src=readFileSync(f,'utf8').replace(/\r\n/g,'\n'),m=/^---\n([\s\S]*?)\n---\n/.exec(src),yaml=m?m[1]:'',body=m?src.slice(m[0].length):src;
  for(const k of ['title','summary']){const v=new RegExp('^'+k+':\\s*"(.*)"$','m').exec(yaml);if(v&&v[1].length>=25)out.add(v[1])}
  for(const line of body.split('\n')){
   const t=line.replace(/^[#>\-\s\d.|]+/,'').replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g,'$1').replace(/\*\*|`/g,'').trim();
   if(t.startsWith('[ÁBRA')||t.startsWith('<!--'))continue;
   for(const s of t.split(/(?<=[.!?])\s+/))if(s.length>=50&&!/^[|:\-\s]+$/.test(s))out.add(s.slice(0,120));
  }
 }
 const own=md(join(root,'content/tudastar/elmelet')).map(f=>readFileSync(f,'utf8')).join('\n');
 return [...out].filter(n=>!own.includes(n));
}

/** A HTML-ben a szöveg entitásokkal is állhat; a keresés a szövegcsomópontok egyszerűsített alakján fut. */
export const htmlText=(html)=>html.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;| /g,' ').replace(/\s+/g,' ');
/** A minta egyszerűsített alakja (a szóközök és a nem törő szóközök egységesen). */
export const needleText=(n)=>n.replace(/ /g,' ').replace(/\s+/g,' ');
