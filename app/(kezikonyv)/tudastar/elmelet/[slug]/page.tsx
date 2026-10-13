import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {ArticleView} from '@/components/kezikonyv/article/article-view';
import {JsonLd,breadcrumbLd} from '@/components/kezikonyv/json-ld';
import {articleHref,articlePages,bodyOf,categoryById,categoryHref,diagramsOf,releaseInfo} from '@/lib/kb/content/registry';
import {KB_HOME,OG_BASE,kbSeoTitle} from '@/lib/kb/categories';
import {kbPreview,siteOrigin} from '@/lib/site-origin';

export const dynamic='force-static';
export const revalidate=3600;
export const dynamicParams=false;

/** Csak a közzétett cikkek (lib/kb/release.ts kapu); előnézetben a generált tervezetek is. Az R3 vázlat törzse nem is generálódik: 404. */
export function generateStaticParams(){return articlePages(kbPreview(),'elmelet').map(a=>({slug:a.slug}))}
const find=(slug:string)=>articlePages(kbPreview(),'elmelet').find(a=>a.slug===slug);

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params,meta=find(slug);if(!meta)return {};
 const url=articleHref(meta),draft=releaseInfo(meta).state!=='kozzeteve';
 return {title:{absolute:kbSeoTitle(meta.title,meta.navTitle)},description:meta.summary,keywords:[...meta.keywords],alternates:{canonical:url},
  openGraph:{...OG_BASE,type:'article',title:meta.title,description:meta.summary,url,modifiedTime:meta.updated},...(draft?{robots:{index:false,follow:false}}:{})};
}

export default async function ArticlePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,meta=find(slug);
 if(!meta)notFound();
 const preview=kbPreview(),origin=siteOrigin(),info=releaseInfo(meta),url=articleHref(meta),cat=categoryById(meta.category);
 return <>
  <ArticleView meta={meta} body={bodyOf(meta)} info={info} preview={preview} origin={origin} diagrams={diagramsOf(meta)}/>
  <JsonLd data={breadcrumbLd(origin,[{name:'Tudástár',path:KB_HOME},{name:'Elmélet',path:KB_HOME+'/elmelet'},...(cat?[{name:cat.label,path:categoryHref(cat)}]:[]),{name:meta.navTitle,path:url}])}/>
  <JsonLd data={{'@context':'https://schema.org','@type':'TechArticle',headline:meta.title,description:meta.summary,url:(origin??'')+url,mainEntityOfPage:(origin??'')+url,inLanguage:'hu',
   datePublished:info.record?.date??meta.updated,dateModified:meta.updated,keywords:meta.keywords.join(', '),isAccessibleForFree:true,
   author:{'@type':'Organization',name:'Villanyrajz szerkesztőség'},publisher:{'@type':'Organization',name:'Villanyrajz'}}}/>
 </>;
}
