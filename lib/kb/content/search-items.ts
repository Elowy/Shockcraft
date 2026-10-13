// A Tudástár keresőtételei (cikkek és szótári kifejezések) – tiszta függvények, generált adat nélkül. A szerver (registry.ts
// kbSearchItems) és a generátor (scripts/kb-content/generate.ts → lib/kb/content/generated/search.ts, a böngészőbe a kereső első
// megnyitásakor töltődő, CSAK közzétett tételeket tartalmazó index) ugyanezt használja, így a kettő egyezik (tests/kb-content.ts).
// Csak könnyű metaadat kerül bele (cím, rövid cím, összefoglaló, kulcsszavak, szinonimák, a kifejezés első mondata), cikktörzs nem.
import {KB_GLOSSARY,kbArticlePath} from '@/lib/kb/categories';
import type {SearchItem} from '@/lib/kb/search';
import {inlinePlain} from './inline';
import type {KbBlock,KbMeta,KbTerm} from './types';

export const GLOSSARY_ID='szakszotar';
/** A szakszótárnak saját útvonala van (/tudastar/szotar); a cikkoldal útvonala a többi cikké. */
export const articleHref=(meta:Pick<KbMeta,'id'|'section'|'slug'>)=>meta.id===GLOSSARY_ID?KB_GLOSSARY:kbArticlePath(meta.section,meta.slug);

/** A szótári tételek egy törzsből (a betűs szakaszok `terms` blokkjai). */
export function termsOf(blocks:readonly KbBlock[]):KbTerm[]{
 const out:KbTerm[]=[];
 const walk=(bs:readonly KbBlock[])=>{for(const b of bs){if(b.t==='terms')out.push(...b.items);else if(b.t==='example')walk(b.blocks)}};
 walk(blocks);
 return out;
}
/** A szótári tétel kereső-szinonimái a zárójeles kiegészítésből („más néven: RCD, FI-kapcsoló” → RCD, FI-kapcsoló). */
export function termAliases(t:KbTerm):string[]{
 if(!t.note)return [];
 return t.note.split(/[;,]/).map(x=>x.replace(/^\s*(?:jele|egysége|más néven|köznyelven|régies|angol rövidítéssel|cserélhető része az|ez utóbbi köznyelven|és)\s*:?\s*/i,'').replace(/[()]/g,'').trim()).filter(x=>x.length>=2&&x.length<=40);
}
const firstSentence=(s:string)=>{const t=inlinePlain(s).replace(/\s+/g,' ').trim(),m=/^(.{40,180}?[.!?])(\s|$)/.exec(t);return m?m[1]:t.slice(0,180)};

/** A szótári kifejezés tételsúlya a keresőben (lib/kb/search.ts `rank`): egy szavas keresésnél a cikk és a kalkulátor előrébb kerül. */
export const TERM_RANK=0.6;
/** Keresőtételek a megadott (közzétett) cikkekből és szótári kifejezésekből. */
export function searchItemsOf(articles:readonly KbMeta[],terms:readonly KbTerm[]):SearchItem[]{
 const arts=articles.map(a=>({id:a.id,title:a.title,href:articleHref(a),group:a.id===GLOSSARY_ID?'Szakkifejezések':'Elmélet',keywords:a.keywords,synonyms:[a.navTitle,...a.synonyms],summary:a.summary}));
 const items=terms.map(t=>({id:'szotar-'+t.id,title:t.term,href:KB_GLOSSARY+'#'+t.id,group:'Szakkifejezések',keywords:[] as string[],synonyms:termAliases(t),summary:firstSentence(t.text),rank:TERM_RANK}));
 return [...arts,...items];
}
