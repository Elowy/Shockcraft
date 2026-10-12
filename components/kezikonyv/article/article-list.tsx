// Cikk-kártyák és kategórialista a Tudástár listaoldalaihoz (szerverkomponens; JS nélkül is teljes).
import {NoWrap} from './nowrap';
import {BadgeCheck} from 'lucide-react';
import {articleHref,categoryArticles,categoryHref,releaseBadge,releaseInfo} from '@/lib/kb/content/registry';
import type {KbCategory} from '@/lib/kb/content/categories';
import type {KbMeta} from '@/lib/kb/content/types';

/** Cikk-kártya. A jelvény a listán mindig név nélküli (a lektor neve hozzájárulással is csak a cikk saját oldalán jelenhet meg). */
export function ArticleCard({a}:{a:KbMeta}){
 const info=releaseInfo(a),draft=info.state!=='kozzeteve'||!info.record;
 return <a className={'kk-card'+(draft?' draft':'')} href={articleHref(a)}>
  <b><NoWrap text={a.title}/></b><p>{a.summary}</p>
  <span className={'kk-badge'+(draft?' draft':'')}>{draft?'Tervezet (előnézet)':<><BadgeCheck aria-hidden="true"/>{releaseBadge(info.record!,false)}</>}</span>
 </a>;
}

export function CategorySection({c,preview,heading='h2',link=true}:{c:KbCategory;preview:boolean;heading?:'h2'|'h3';link?:boolean}){
 const list=categoryArticles(c.id,preview);if(!list.length)return null;
 const H=heading;
 return <section className="kk-category" id={c.id} aria-labelledby={'kat-'+c.id}>
  <H id={'kat-'+c.id}>{link?<a href={categoryHref(c)}>{c.label}</a>:c.label}</H>
  <p className="kk-muted">{c.description}</p>
  <div className="kk-cards">{list.map(a=><ArticleCard key={a.id} a={a}/>)}</div>
 </section>;
}
