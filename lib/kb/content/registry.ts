// A Tudástár tartalomregisztere (szerveroldal és tesztek): a generált cikkek, a közzétételi kapu (lib/kb/release.ts) kiértékelése,
// linkfeloldás, kapcsolódók, előző/következő, szótár, keresőtételek. A kliensszigetek ezt a modult nem importálják (tests/kb-guards.ts):
// a cikktörzsek így nem kerülnek a böngészőbe; a kliens csak a szerver által átadott, közzétett metaadatot kapja.
import {KB_GLOSSARY,KB_HOME,kbCategoryPath} from '@/lib/kb/categories';
import {KB_RELEASES,KB_SUSPENDED,type KbExpertReview,type KbRelease} from '@/lib/kb/release';
import type {SearchItem} from '@/lib/kb/search';
import {KB_CATEGORIES,byArticleOrder,categoryById,type KbCategory} from './categories';
import {contentFingerprint} from './fingerprint';
import {gateState,type KbState} from './gate';
import type {DiagramSource} from '@/components/kezikonyv/diagram/diagram-figure';
import {KB_ARTICLES,KB_PENDING} from './generated/articles';
import {KB_BODIES} from './generated/bodies';
import {KB_DIAGRAMS} from './generated/diagrams';
import {GLOSSARY_ID,TERM_RANK,articleHref,searchItemsOf,termAliases,termsOf} from './search-items';
import type {KbBody,KbMeta,KbPending,KbSectionId,KbTerm} from './types';

export {KB_ARTICLES,KB_PENDING,KB_CATEGORIES,categoryById,GLOSSARY_ID,TERM_RANK,articleHref,termAliases};
export type {KbState};

const ORDERED:readonly KbMeta[]=[...KB_ARTICLES].sort(byArticleOrder);

export const articleById=(id:string)=>KB_ARTICLES.find(a=>a.id===id);
export const pendingById=(id:string):KbPending|undefined=>KB_PENDING.find(p=>p.id===id);
export const bodyOf=(meta:KbMeta):KbBody=>{const b=KB_BODIES[meta.id];if(!b)throw new Error('Hiányzó cikktörzs: '+meta.id);return b};

/** A cikk netlistás bekötési ábrái (ábra-id → a fő ábra és a változatai). Csak közzétett cikkhez van generált ábra
 * (lib/kb/content/generated/diagrams.ts); ha hiányzik, az ábra helyén csak a felirat és a szöveges megfelelő hiánya jelzése marad. */
export function diagramsOf(meta:KbMeta,source:Readonly<Record<string,DiagramSource>>=KB_DIAGRAMS):Record<string,DiagramSource[]>{
 const out:Record<string,DiagramSource[]>={};
 for(const d of meta.diagrams??[]){const xs=d.ids.map(id=>source[id]).filter((x):x is DiagramSource=>!!x);if(xs.length===d.ids.length)out[d.figure]=xs}
 return out;
}
/** A tartalom mostani ujjlenyomata (futásidőben újraszámolva a törzsből is – a generált meta értékét a CI veti össze). */
export const articleFingerprint=(meta:KbMeta)=>contentFingerprint(meta,bodyOf(meta));

export type KbReleaseInfo={state:KbState;record?:KbRelease;badge:string;reason:string};
/** A jelvény: belső ellenőrzésnél „Belsőleg ellenőrizve”; lektorálásnál a jogosultság és a dátum (név csak hozzájárulással, csak a saját oldalon). */
export const expertShown=(r:KbExpertReview,withName=true)=>{const name=withName&&r.showName===true?r.reviewer?.trim():'';return name?name+', '+r.qualification:r.qualification};
export const releaseBadge=(r:KbRelease,withName=true)=>r.kind==='lektoralt'?'Szakmailag lektorálta: '+expertShown(r,withName)+' · '+r.date:'Belsőleg ellenőrizve';

/** A közzétételi kapu (lib/kb/content/gate.ts, lib/kb/release.ts fejléce): rekord, egyező tartalmi és ábra-ujjlenyomat, a kategória
 * kockázati alsó korlátja, R3-nál lektori rekord, nincs felfüggesztve. A tartalom ujjlenyomatát a törzsből futásidőben is újraszámolja. */
export function releaseInfo(meta:KbMeta,records:Readonly<Record<string,KbRelease>>=KB_RELEASES,suspended:ReadonlySet<string>=KB_SUSPENDED):KbReleaseInfo{
 const g=gateState(meta,articleFingerprint(meta),records,suspended);
 return {...g,badge:g.state==='kozzeteve'&&g.record?releaseBadge(g.record):''};
}
export const isPublished=(meta:KbMeta)=>releaseInfo(meta).state==='kozzeteve';
/** A listák (kártyák, Sémák gyűjtőoldal) jelvénye: mindig név nélküli; nem közzétett (előnézeti) tételnél „Tervezet (előnézet)”. */
export const listBadgeOf=(meta:KbMeta)=>{const info=releaseInfo(meta);return info.state==='kozzeteve'&&info.record?releaseBadge(info.record,false):'Tervezet (előnézet)'};
const PUBLISHED_IDS:ReadonlySet<string>=new Set(KB_ARTICLES.filter(isPublished).map(a=>a.id));
export const isPublishedId=(id:string)=>PUBLISHED_IDS.has(id);

/** Közzétett cikkek (kategória- és cikksorrendben), opcionálisan szekcióra szűrve. */
export const publishedArticles=(section?:KbSectionId)=>ORDERED.filter(a=>PUBLISHED_IDS.has(a.id)&&(!section||a.section===section));
/** Előnézetben (SHOCKCRAFT_KB_PREVIEW=1) a generált, de nem közzétett cikkek is (az R3 törzse lektorálásig nem is generálódik). */
export const visibleArticles=(preview:boolean,section?:KbSectionId)=>preview?ORDERED.filter(a=>!section||a.section===section):publishedArticles(section);
/** A szakszótárnak saját útvonala van (/tudastar/szotar); a cikkoldal útvonala a többi cikké. */
export const articlePages=(preview:boolean,section:KbSectionId)=>visibleArticles(preview,section).filter(a=>a.id!==GLOSSARY_ID);

/** Belső link feloldása: közzétett cél → href (horgonnyal); lektorra váró vagy nem közzétett cél → `pending`; ismeretlen → null. */
export type LinkTarget={href:string;title:string}|{pending:true}|null;
export function resolveLink(id:string,anchor:string|null,preview=false):LinkTarget{
 const meta=articleById(id);
 if(meta&&(PUBLISHED_IDS.has(id)||preview))return {href:articleHref(meta)+(anchor?'#'+anchor:''),title:meta.title};
 if(meta||pendingById(id))return {pending:true};
 return null;
}

export const categoriesWithArticles=(section:KbSectionId,preview=false)=>KB_CATEGORIES.filter(c=>c.section===section&&visibleArticles(preview,section).some(a=>a.category===c.id));
export const categoryArticles=(category:string,preview=false)=>visibleArticles(preview).filter(a=>a.category===category);
/** A kategória oldala; a Sémák kategóriáinak nincs külön oldala: a gyűjtőoldal horgonya. */
export const categoryHref=(c:KbCategory)=>c.section==='semak'?KB_HOME+'/semak#'+c.id:kbCategoryPath(c.section,c.id);
/** Lektorra váró tételek száma kategóriánként (szöveg nélkül: csak a darabszám és a kategória saját felirata jelenik meg). */
export const pendingCount=(section?:KbSectionId)=>KB_PENDING.filter(p=>!section||p.section===section).length+KB_ARTICLES.filter(a=>!PUBLISHED_IDS.has(a.id)&&(!section||a.section===section)).length;

/** Előző/következő a kategórián belül (a közzétettek között). */
export function prevNext(meta:KbMeta,preview=false):{prev?:KbMeta;next?:KbMeta}{
 const list=categoryArticles(meta.category,preview),i=list.findIndex(a=>a.id===meta.id);
 return i<0?{}:{prev:list[i-1],next:list[i+1]};
}
/** Kapcsolódó cikkek: csak közzétett cél; a lektorra váróak darabszáma külön (szöveg nélkül). */
export function relatedArticles(meta:KbMeta,preview=false):{items:KbMeta[];pending:number}{
 const items:KbMeta[]=[];let pending=0;
 for(const id of meta.related){const t=resolveLink(id,null,preview);if(t&&'href' in t)items.push(articleById(id)!);else if(t)pending++}
 return {items,pending};
}
/** A kalkulátoroldal „Kapcsolódó cikkek” listája: azok a közzétett cikkek, amelyek a kalkulátort kapcsolódóként jelölik. */
export const articlesForCalc=(slug:string)=>publishedArticles().filter(a=>a.calculators.includes(slug));

/** A szakszótár tételei (a közzétett szótárból; ha a szótár nem közzétett, üres). */
export function glossaryTerms(preview=false):KbTerm[]{
 const meta=articleById(GLOSSARY_ID);if(!meta||!(PUBLISHED_IDS.has(meta.id)||preview))return [];
 return termsOf(bodyOf(meta).blocks);
}

/** Keresőtételek: közzétett cikkek (Elmélet) és szótári kifejezések. A törzs nem kerül bele, csak a könnyű metaadat. A böngésző ezt
 * a generált lib/kb/content/generated/search.ts-ből tölti be a kereső első megnyitásakor (a kettő egyezését a tests/kb-content.ts őrzi). */
export function kbSearchItems(preview=false):SearchItem[]{return searchItemsOf(visibleArticles(preview),glossaryTerms(preview))}
/** A böngészőnek átadott közzétett célok ('article:<id>', a szótár is): a kereső, a „Folytasd” és a Kedvencek-fiók csak ezekre linkel. */
export const publishedTargets=(preview=false)=>visibleArticles(preview).map(a=>'article:'+a.id);
export {KB_HOME,KB_GLOSSARY};
