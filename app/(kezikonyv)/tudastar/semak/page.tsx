// A Sémák gyűjtőoldala (docs/tudastar-terv.md 2.4; docs/tudastar.md „Sémák és ábramotor”). CSAK akkor létezik, ha van közzétett séma
// (a Sémák szekció minden tétele R3: szakmai lektor jóváhagyása után – lib/kb/release.ts); addig 404, és a „Sémák” fül sem látszik.
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {AppBar} from '@/components/kezikonyv/shell';
import {JsonLd,breadcrumbLd} from '@/components/kezikonyv/json-ld';
import {PlannerCta} from '@/components/kezikonyv/planner-cta';
import {SemakIndex} from '@/components/kezikonyv/semak/semak-index';
import {bySlug,isPublished as calcPublished} from '@/lib/calc/registry';
import {articleHref,articlePages,bodyOf,categoriesWithArticles,diagramsOf,listBadgeOf} from '@/lib/kb/content/registry';
import {KB_HOME,OG_BASE} from '@/lib/kb/categories';
import {kbPreview,siteOrigin} from '@/lib/site-origin';

export const dynamic='force-static';
export const revalidate=3600;

const PATH=KB_HOME+'/semak';
const DESCRIPTION='Bekötési rajzok szakmailag lektorálva: világítási kapcsolók (101–107), dugalj, földelési rendszerek – vezetéktáblával és működéssel.';
export async function generateMetadata():Promise<Metadata>{
 if(!articlePages(kbPreview(),'semak').length)return {};
 return {title:{absolute:'Sémák – Villanyszerelő Tudástár – Villanyrajz'},description:DESCRIPTION,alternates:{canonical:PATH},
  openGraph:{...OG_BASE,type:'website',title:'Sémák – Villanyszerelő Tudástár',description:DESCRIPTION,url:PATH},...(kbPreview()?{robots:{index:false,follow:false}}:{})};
}

export default function SemakPage(){
 const preview=kbPreview(),list=articlePages(preview,'semak');
 if(!list.length)notFound();
 const origin=siteOrigin();
 const items=list.map(meta=>({meta,body:bodyOf(meta),href:articleHref(meta),listBadge:listBadgeOf(meta),diagrams:diagramsOf(meta)}));
 const calcs=[...new Set(list.flatMap(a=>a.calculators))].map(bySlug).filter((c):c is NonNullable<typeof c>=>!!c&&calcPublished(c)).map(c=>({slug:c.slug,title:c.title,short:c.short}));
 return <>
  <AppBar title="Sémák" home={KB_HOME}/>
  <div className="kk-page kk-page-single">
   <main id="tartalom" className="kk-main kk-semak">
    <nav className="kk-crumbs" aria-label="Morzsamenü"><ol><li><a href={KB_HOME}>Tudástár</a></li><li aria-current="page">Sémák</li></ol></nav>
    {preview&&<p className="kk-preview-banner" role="note">Lektori előnézet: a még nem közzétett tervezetek is látszanak. Élesben ez a mód soha nem kapcsolható be.</p>}
    <h1>Sémák – bekötési rajzok</h1>
    <p className="kk-lead">Szakmailag lektorált bekötési rajzok vezetékszintű ábrával, működés-szimulációval és szöveges vezetéktáblával. A részletoldalakon a szerelés lépései a feszültségmentesítéssel kezdődnek.</p>
    <SemakIndex categories={categoriesWithArticles('semak',preview)} items={items} calcs={calcs}/>
    <PlannerCta/>
   </main>
  </div>
  <JsonLd data={breadcrumbLd(origin,[{name:'Tudástár',path:KB_HOME},{name:'Sémák',path:PATH}])}/>
 </>;
}
