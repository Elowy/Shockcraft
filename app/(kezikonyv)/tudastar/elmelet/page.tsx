import type {Metadata} from 'next';
import {BadgeCheck} from 'lucide-react';
import {AppBar} from '@/components/kezikonyv/shell';
import {CategorySection} from '@/components/kezikonyv/article/article-list';
import {JsonLd,breadcrumbLd} from '@/components/kezikonyv/json-ld';
import {PlannerCta} from '@/components/kezikonyv/planner-cta';
import {KB_CATEGORIES,articlePages,categoriesWithArticles,glossaryTerms,pendingCount} from '@/lib/kb/content/registry';
import {KB_HOME,OG_BASE} from '@/lib/kb/categories';
import {kbPreview,siteOrigin} from '@/lib/site-origin';

export const dynamic='force-static';
export const revalidate=3600;

const PATH=KB_HOME+'/elmelet';
const DESCRIPTION='Villamos alapfogalmak, vezetékszínek és -jelölések, IP-védettség, világítás és szakszótár – ingyen, belépés nélkül, ábrákkal és számpéldákkal.';
export async function generateMetadata():Promise<Metadata>{
 return {title:{absolute:'Elmélet – Villanyszerelő Tudástár – Villanyrajz'},description:DESCRIPTION,alternates:{canonical:PATH},
  openGraph:{...OG_BASE,type:'website',title:'Elmélet – Villanyszerelő Tudástár',description:DESCRIPTION,url:PATH},...(kbPreview()?{robots:{index:false,follow:false}}:{})};
}

export default function ElmeletPage(){
 const preview=kbPreview(),origin=siteOrigin(),cats=categoriesWithArticles('elmelet',preview),n=articlePages(preview,'elmelet').length,terms=glossaryTerms(preview).length,pending=pendingCount('elmelet');
 const pendingCats=KB_CATEGORIES.filter(c=>c.section==='elmelet'&&!cats.includes(c));
 return <>
  <AppBar title="Elmélet" home={KB_HOME}/>
  <div className="kk-page kk-page-hub">
   <aside className="kk-side" aria-label="Kategóriák"><p className="kk-side-title">Kategóriák</p><ul>{cats.map(c=><li key={c.id}><a href={'#'+c.id}>{c.label}</a></li>)}</ul><a className="kk-side-all" href={KB_HOME}>Tudástár kezdőlap</a></aside>
   <main id="tartalom" className="kk-main">
    <nav className="kk-crumbs" aria-label="Morzsamenü"><ol><li><a href={KB_HOME}>Tudástár</a></li><li aria-current="page">Elmélet</li></ol></nav>
    {preview&&<p className="kk-preview-banner" role="note">Lektori előnézet: a még nem közzétett tervezetek is látszanak. Élesben ez a mód soha nem kapcsolható be.</p>}
    <h1>Elmélet</h1>
    <p className="kk-lead">Villamos alapfogalmak és gyakorlati tudnivalók saját ábrákkal, kidolgozott példákkal és forrásokkal. {n} cikk{terms?` és a szakszótár (${terms} kifejezés)`:''} érhető el{pending?`, további ${pending} szakmai lektorálás alatt`:''}.</p>
    {cats.map(c=><CategorySection key={c.id} c={c} preview={preview}/>)}
    {pending>0&&<section className="kk-category kk-pending-cats" aria-labelledby="hamarosan-cim">
     <h2 id="hamarosan-cim">Hamarosan – szakmai lektorálás alatt</h2>
     <p className="kk-muted">A biztonságkritikus témák (például a kismegszakító, az áram-védőkapcsoló és a feszültségmentesítés) csak szakmai lektor jóváhagyása után jelennek meg.{pendingCats.length?' Érintett kategóriák: '+pendingCats.map(c=>c.label).join(', ')+'.':''}</p>
    </section>}
    <section className="kk-method" aria-labelledby="ellenorzes-cim">
     <h2 id="ellenorzes-cim">Hogyan ellenőrizzük a cikkeket?</h2>
     <ul><li><BadgeCheck aria-hidden="true"/><span><b>Belsőleg ellenőrizve:</b> alacsony kockázatú elméleti és gyakorlati tudnivaló; a szerzői vázlatot tőle független szakmai ellenőrzés nézte át, a számpéldákat újraszámoltuk. Részletek: <a href={KB_HOME+'#ellenorzes'}>a Tudástár kezdőlapján</a>.</span></li></ul>
    </section>
    <PlannerCta/>
   </main>
  </div>
  <JsonLd data={breadcrumbLd(origin,[{name:'Tudástár',path:KB_HOME},{name:'Elmélet',path:PATH}])}/>
 </>;
}
