import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {AppBar} from '@/components/kezikonyv/shell';
import {ArticleCard} from '@/components/kezikonyv/article/article-list';
import {JsonLd,breadcrumbLd} from '@/components/kezikonyv/json-ld';
import {PlannerCta} from '@/components/kezikonyv/planner-cta';
import {categoriesWithArticles,categoryArticles,categoryHref} from '@/lib/kb/content/registry';
import {KB_HOME,OG_BASE,kbSeoTitle} from '@/lib/kb/categories';
import {kbPreview,siteOrigin} from '@/lib/site-origin';

export const dynamic='force-static';
export const revalidate=3600;
export const dynamicParams=false;

/** Csak az a kategória kap oldalt, amelyben van közzétett cikk. */
export function generateStaticParams(){return categoriesWithArticles('elmelet',kbPreview()).map(c=>({kategoria:c.id}))}
const find=(id:string)=>categoriesWithArticles('elmelet',kbPreview()).find(c=>c.id===id);

export async function generateMetadata({params}:{params:Promise<{kategoria:string}>}):Promise<Metadata>{
 const {kategoria}=await params,c=find(kategoria);if(!c)return {};
 const url=categoryHref(c),description=c.label+' – a Villanyszerelő Tudástár Elmélet szekciója: '+c.description+' Ingyen, belépés nélkül.';
 return {title:{absolute:kbSeoTitle(c.label+' – Elmélet')},description,alternates:{canonical:url},openGraph:{...OG_BASE,type:'website',title:c.label+' – Tudástár',description,url},...(kbPreview()?{robots:{index:false,follow:false}}:{})};
}

export default async function CategoryPage({params}:{params:Promise<{kategoria:string}>}){
 const {kategoria}=await params,c=find(kategoria);
 if(!c)notFound();
 const preview=kbPreview(),origin=siteOrigin(),all=categoriesWithArticles('elmelet',preview);
 return <>
  <AppBar title="Elmélet" back={{href:KB_HOME+'/elmelet',label:'Elmélet'}} home={KB_HOME}/>
  <div className="kk-page kk-page-hub">
   <aside className="kk-side" aria-label="Kategóriák"><p className="kk-side-title">Kategóriák</p><ul>{all.map(x=><li key={x.id}><a href={categoryHref(x)} aria-current={x.id===c.id?'page':undefined}>{x.label}</a></li>)}</ul><a className="kk-side-all" href={KB_HOME+'/elmelet'}>Elmélet: összes cikk</a></aside>
   <main id="tartalom" className="kk-main">
    <nav className="kk-crumbs" aria-label="Morzsamenü"><ol><li><a href={KB_HOME}>Tudástár</a></li><li><a href={KB_HOME+'/elmelet'}>Elmélet</a></li><li aria-current="page">{c.label}</li></ol></nav>
    <h1>{c.label}</h1>
    <p className="kk-lead">{c.description}</p>
    <section aria-label={c.label+': cikkek'} className="kk-category"><div className="kk-cards">{categoryArticles(c.id,preview).map(a=><ArticleCard key={a.id} a={a}/>)}</div></section>
    <PlannerCta/>
   </main>
  </div>
  <JsonLd data={breadcrumbLd(origin,[{name:'Tudástár',path:KB_HOME},{name:'Elmélet',path:KB_HOME+'/elmelet'},{name:c.label,path:categoryHref(c)}])}/>
 </>;
}
