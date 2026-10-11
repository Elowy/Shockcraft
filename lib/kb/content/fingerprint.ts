// A Tudástár-tartalom ujjlenyomata (docs/tudastar-terv.md 3.3, 4.3): FNV-1a a lib/sizing-tables.ts fingerprint()-jével (importálva,
// nem duplikálva). Lefedi a szöveges metaadatot (cím, összefoglaló, kulcsszavak, kapcsolódók, kockázat, verzió …), az összes blokkot
// (az ábráknál a vázlat helyőrzőjét: cím, rajzleírás, desc) és a forrásmegjelöléseket. A ténylegesen kirajzolt SVG-t és a FIGURES
// szöveges megfelelőjét NEM – azt az ábra-ujjlenyomat (scripts/kb-content/figures.ts, a meta és a rekord `figures` mezője) fedi.
// NEM része: a forrás „ellenőrzés alatt” jelzése (szerkesztőségi állapot) és a változásnapló. Bármely tartalmi módosítás új
// ujjlenyomatot ad, ezért a kiadási rekord (lib/kb/release.ts) érvényét veszti.
import {fingerprint} from '@/lib/sizing-tables';
import type {KbBody,KbMeta} from './types';

export type KbContentMeta=Pick<KbMeta,'id'|'slug'|'section'|'category'|'title'|'navTitle'|'summary'|'risk'|'audience'|'keywords'|'synonyms'|'related'|'calculators'|'ai'|'version'|'updated'>;

export function contentFingerprint(meta:KbContentMeta,body:KbBody):string{
 const {id,slug,section,category,title,navTitle,summary,risk,audience,keywords,synonyms,related,calculators,ai,version,updated}=meta;
 return fingerprint({meta:{id,slug,section,category,title,navTitle,summary,risk,audience,keywords,synonyms,related,calculators,ai,version,updated},
  blocks:body.blocks,sources:body.sources.map(s=>({standard:s.standard,kiadas:s.kiadas,pont:s.pont}))});
}
