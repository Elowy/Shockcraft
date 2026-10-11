import {ArrowLeft,Blocks,BookOpen,Bookmark,Calculator,ClipboardCheck,Menu,PlugZap,Search,Zap} from 'lucide-react';
import {PublicFooter,PublicHeader} from '@/components/public-shell';
import {CALC_HUB,HOME,KB_GLOSSARY,KB_HOME,KB_NAME,visibleSections,type Section,type SectionIcon,type SectionId} from '@/lib/kb/categories';
import type {SearchItem} from '@/lib/kb/search';
import {calcMetas} from '@/lib/calc/registry';
import {glossaryTerms,kbSearchItems,publishedTargets,visibleArticles} from '@/lib/kb/content/registry';
import {kbPreview} from '@/lib/site-origin';
import {KbChrome} from './kb-chrome';
import {BaseNotice} from './safety-notice';

const ICONS:Record<SectionIcon,typeof BookOpen>={'book-open':BookOpen,'plug-zap':PlugZap,calculator:Calculator,'clipboard-check':ClipboardCheck,blocks:Blocks};
const navLabel=KB_NAME+' részei';

function SectionLinks({sections,current,className}:{sections:readonly Section[];current:SectionId|'tudastar';className:string}){
 return <nav className={className} aria-label={navLabel}>{sections.map(s=>{const Icon=ICONS[s.icon];return <a key={s.id} href={s.href} aria-current={s.id===current?'page':undefined}><Icon aria-hidden="true"/><span>{s.label}</span></a>})}</nav>;
}

/** Mobil alkalmazásfejléc (950 px alatt): bal oldalt a Villanyrajz-jel (szekció gyökerén) vagy „←” a szülőlistára; középen a szekció neve; jobbra Keresés, Kedvencek, Menü. */
export function AppBar({title,back,home=CALC_HUB}:{title:string;back?:{href:string;label:string};home?:string}){
 return <header className="kk-appbar">
  {back?<a className="kk-icon-btn" href={back.href} aria-label={'Vissza: '+back.label}><ArrowLeft aria-hidden="true"/></a>:<a className="kk-icon-btn kk-mark" href={HOME} aria-label="Villanyrajz főoldal"><Zap aria-hidden="true"/></a>}
  <span className="kk-appbar-title">{title}</span>
  <a className="kk-icon-btn" href={home+'#kereses'} data-kb-open="search" aria-label="Keresés"><Search aria-hidden="true"/></a>
  <a className="kk-icon-btn" href={home+'#kedvencek'} data-kb-open="bookmarks" aria-label="Kedvencek és előzmények"><Bookmark aria-hidden="true"/></a>
  <a className="kk-icon-btn" href="#lablec" data-kb-open="menu" aria-label="Menü"><Menu aria-hidden="true"/></a>
 </header>;
}

/** A keret adatai (fülek, keresőtételek, közzétett célok, menü) – folyamatonként egyszer számolva, és mindig ugyanaz az objektum: így ha egy
 * oldal RSC-adatában a keret többször szerepel (a vinext a not-found határok fáját is beágyazza), a kliensnek átadott adat csak egyszer kerül bele.
 * A Tudástár keresőindexe (cikkek, szótári kifejezések) NEM kerül az oldalba: a kereső az első megnyitáskor tölti be a generált, csak közzétett
 * tételeket tartalmazó modulból (lib/kb/content/generated/search.ts), és a `valid` listára szűri. Előnézetben (SHOCKCRAFT_KB_PREVIEW) a
 * tervezetek is kellenek, ezért ott a Tudástár-tételek is itt érkeznek. A kalkulátorok tételei (kicsik, a kiadási kapu futásidejű) maradnak. */
type ChromeData={sections:readonly Section[];items:readonly SearchItem[];valid:readonly string[];menu:readonly {label:string;href:string}[]};
const CHROME=new Map<boolean,ChromeData>();
function chromeData(preview:boolean):ChromeData{
 const hit=CHROME.get(preview);if(hit)return hit;
 const metas=calcMetas(preview);
 const sections=visibleSections({elmelet:visibleArticles(preview,'elmelet').length,kalkulatorok:metas.filter(m=>m.href).length});
 const items:SearchItem[]=[...(preview?kbSearchItems(true):[]),...metas.map(m=>({id:m.slug,title:m.title,href:m.href,group:'Kalkulátorok',keywords:m.keywords,synonyms:m.synonyms,summary:m.short,note:m.note}))];
 const valid=[...publishedTargets(preview),...metas.filter(m=>m.href).map(m=>'calc:'+m.slug)];
 const menu=[{label:KB_NAME+' kezdőlap',href:KB_HOME},...sections.map(s=>({label:s.label,href:s.href})),...(glossaryTerms(preview).length?[{label:'Szakszótár',href:KB_GLOSSARY}]:[])];
 const data={sections,items,valid,menu};CHROME.set(preview,data);return data;
}

/** A kézikönyv közös kerete egy szekcióhoz: asztali fejléc szekciófülekkel, lábléc alapfigyelmeztetéssel, mobil alsó navigáció és a kliensoldali keret (kereső, menü, kedvencek).
 * Az asztali fejléc műveletei ugyanazok, mint a mobil alkalmazásfejlécé: Keresés, Kedvencek és előzmények (törléssel), Menü (háromállású téma, „/” kapcsoló).
 * Csak a közzétett tartalmú szekció kap fület (Elmélet: a közzétett cikkek; Kalkulátorok: a közzétett kalkulátorok). `tudastar`: a kezdőlap (nincs kiemelt fül). */
export function Shell({section,children}:{section:SectionId|'tudastar';children:React.ReactNode}){
 const {sections,items,valid,menu}=chromeData(kbPreview());
 const home=section==='kalkulatorok'?CALC_HUB:KB_HOME;
 const actions=<span className="kk-head-actions">
  <a className="kk-head-btn" href={home+'#kereses'} data-kb-open="search" aria-label="Keresés (/ vagy Ctrl+K)"><Search aria-hidden="true"/><kbd>/</kbd></a>
  <a className="kk-head-btn" href={home+'#kedvencek'} data-kb-open="bookmarks" aria-label="Kedvencek és előzmények"><Bookmark aria-hidden="true"/></a>
  <a className="kk-head-btn" href="#lablec" data-kb-open="menu" aria-label="Menü (megjelenés, beállítások)"><Menu aria-hidden="true"/></a>
 </span>;
 return <div className="kk" data-section={section}>
  <a className="kk-skip" href="#tartalom">Ugrás a tartalomra</a>
  <div className="kk-desktop-head"><PublicHeader current={section==='kalkulatorok'?'kalkulatorok':'tudastar'} actions={actions}/><SectionLinks sections={sections} current={section} className="kk-tabs"/></div>
  {children}
  <aside className="kk-foot" id="fontos" aria-label="Fontos tudnivaló"><BaseNotice/></aside>
  <PublicFooter/>
  <SectionLinks sections={sections} current={section} className="kk-bottom-nav"/>
  <KbChrome items={items} valid={valid} sections={menu}/>
 </div>;
}
