import type {Metadata} from 'next';
import {BadgeCheck,ShieldCheck} from 'lucide-react';
import {AppBar} from '@/components/kezikonyv/shell';
import {CalcIndex} from '@/components/calc/calc-index';
import {JsonLd,breadcrumbLd} from '@/components/kezikonyv/json-ld';
import {PlannerCta} from '@/components/kezikonyv/planner-cta';
import {CALC_CATEGORIES,calcMetas} from '@/lib/calc/registry';
import {kbPreview,siteOrigin} from '@/lib/site-origin';
import {CALC_HUB,HOME,OG_BASE} from '@/lib/kb/categories';

export const dynamic='force-static';
export const revalidate=3600;

const DESCRIPTION='Ingyenes villamos kalkulátorok belépés nélkül: Ohm-törvény, teljesítmény, áram, fogyasztás, fázisterhelés, átváltók – képlettel és levezetéssel.';
export async function generateMetadata():Promise<Metadata>{
 return {title:{absolute:'Villamos kalkulátorok – ingyen, belépés nélkül | Villanyrajz'},description:DESCRIPTION,alternates:{canonical:CALC_HUB},
  openGraph:{...OG_BASE,type:'website',title:'Villamos kalkulátorok – Villanyrajz',description:DESCRIPTION,url:CALC_HUB},...(kbPreview()?{robots:{index:false,follow:false}}:{})};
}

export default function KalkulatorokPage(){
 const preview=kbPreview(),metas=calcMetas(preview),origin=siteOrigin();
 const published=metas.filter(m=>m.status==='kozzeteve').length,soon=metas.filter(m=>m.status==='hamarosan').length;
 return <>
  <AppBar title="Kalkulátorok"/>
  <div className="kk-page kk-page-hub">
   <aside className="kk-side" aria-label="Kategóriák"><p className="kk-side-title">Kategóriák</p><ul>{CALC_CATEGORIES.map(c=><li key={c.id}><a href={'#'+c.id}>{c.label}</a></li>)}</ul></aside>
   <main id="tartalom" className="kk-main">
    <nav className="kk-crumbs" aria-label="Morzsamenü"><ol><li><a href={HOME}>Villanyrajz</a></li><li aria-current="page">Kalkulátorok</li></ol></nav>
    {preview&&<p className="kk-preview-banner" role="note">Lektori előnézet: a még nem közzétett (tervezet) kalkulátorok is látszanak. Élesben ez a mód soha nem kapcsolható be.</p>}
    <h1>Villamos kalkulátorok</h1>
    <p className="kk-lead">Ingyenes, belépés nélkül használható számítások villanyszerelőknek és tanulóknak – mértékegységgel, levezetéssel és forrással. {published} kalkulátor érhető el{soon?`, további ${soon} szakmai lektorálás alatt`:''}.</p>
    <CalcIndex metas={metas} categories={CALC_CATEGORIES}/>
    <section className="kk-method" id="modszertan" aria-labelledby="modszertan-cim">
     <h2 id="modszertan-cim">Hogyan ellenőrizzük a kalkulátorokat?</h2>
     <ul>
      <li><BadgeCheck aria-hidden="true"/><span><b>Belsőleg ellenőrizve:</b> tankönyvi összefüggés vagy átváltás. A kidolgozott példák elvárt értékeit független újraszámolással rögzítettük, és minden kiadás előtt automatikus teszt veti össze őket a kalkulátorral.</span></li>
      <li><ShieldCheck aria-hidden="true"/><span><b>Szakmailag lektorált:</b> szabványhoz vagy biztonsághoz kötött számítás (pl. feszültségesés, keresztmetszet, kismegszakító). Csak jogosult szakember jóváhagyása után kerül ki; addig „Hamarosan – szakmai lektorálás alatt” jelzéssel látszik.</span></li>
      <li><span>Ha a kalkulátor bármely tartalma megváltozik, az ellenőrzés érvényét veszti, és újra el kell végezni. Hibát találtál? Írd meg az <a href="mailto:info@luiz-tech.hu?subject=Kalkul%C3%A1tor%20hiba">info@luiz-tech.hu</a> címre.</span></li>
     </ul>
    </section>
    <PlannerCta/>
   </main>
  </div>
  <JsonLd data={breadcrumbLd(origin,[{name:'Villanyrajz',path:HOME},{name:'Kalkulátorok',path:CALC_HUB}])}/>
 </>;
}
