import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {ArticleView} from '@/components/kezikonyv/article/article-view';
import {JsonLd,breadcrumbLd} from '@/components/kezikonyv/json-ld';
import {GLOSSARY_ID,articleById,bodyOf,categoryById,categoryHref,glossaryTerms,releaseInfo} from '@/lib/kb/content/registry';
import {inlinePlain} from '@/lib/kb/content/inline';
import {KB_GLOSSARY,KB_HOME,OG_BASE,kbSeoTitle} from '@/lib/kb/categories';
import {kbPreview,siteOrigin} from '@/lib/site-origin';

export const dynamic='force-static';
export const revalidate=3600;

/** A szakszótár (a content/tudastar/elmelet/szakszotar.md vázlatból), kifejezésenkénti horgonnyal: /tudastar/szotar#<kifejezés>. */
const visible=()=>{const m=articleById(GLOSSARY_ID),p=kbPreview();return m&&(p||releaseInfo(m).state==='kozzeteve')?m:undefined};

export async function generateMetadata():Promise<Metadata>{
 const meta=visible();if(!meta)return {};
 const draft=releaseInfo(meta).state!=='kozzeteve';
 return {title:{absolute:kbSeoTitle(meta.title,meta.navTitle)},description:meta.summary,alternates:{canonical:KB_GLOSSARY},
  openGraph:{...OG_BASE,type:'website',title:meta.title,description:meta.summary,url:KB_GLOSSARY},...(draft?{robots:{index:false,follow:false}}:{})};
}

export default function SzotarPage(){
 const meta=visible();if(!meta)notFound();
 const preview=kbPreview(),origin=siteOrigin(),url=(origin??'')+KB_GLOSSARY,cat=categoryById(meta.category);
 return <>
  <ArticleView meta={meta} body={bodyOf(meta)} info={releaseInfo(meta)} preview={preview} origin={origin} glossary/>
  <JsonLd data={breadcrumbLd(origin,[{name:'Tudástár',path:KB_HOME},{name:'Elmélet',path:KB_HOME+'/elmelet'},...(cat?[{name:cat.label,path:categoryHref(cat)}]:[]),{name:meta.navTitle,path:KB_GLOSSARY}])}/>
  <JsonLd data={{'@context':'https://schema.org','@type':'DefinedTermSet',name:meta.title,description:meta.summary,url,inLanguage:'hu',
   hasDefinedTerm:glossaryTerms(preview).map(t=>({'@type':'DefinedTerm',name:t.term,description:inlinePlain(t.text),url:url+'#'+t.id,inDefinedTermSet:url}))}}/>
 </>;
}
