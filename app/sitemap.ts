// Oldaltérkép: a főoldal, a jogi oldalak, a /kalkulatorok és CSAK a közzétett kalkulátorok (a kiadatlan T1 nem kerül bele).
// Ha nincs érvényes APP_ORIGIN, üres listát ad (relatív URL nem kerülhet a sitemapbe). A Tudástár-szekciók a tartalommal együtt kerülnek ide.
import type {MetadataRoute} from 'next';
import {publishedCalcs} from '@/lib/calc/registry';
import {RELEASES} from '@/lib/calc/release';
import {siteOrigin} from '@/lib/site-origin';

export default function sitemap():MetadataRoute.Sitemap{
 const origin=siteOrigin();if(!origin)return [];
 const calcs=publishedCalcs();
 const latest=calcs.map(c=>RELEASES[c.slug]?.date??c.updated).sort().at(-1);
 return [
  {url:origin+'/',changeFrequency:'monthly',priority:1},
  {url:origin+'/kalkulatorok',changeFrequency:'weekly',priority:0.8,...(latest?{lastModified:latest}:{})},
  ...calcs.map(c=>({url:origin+'/kalkulatorok/'+c.slug,lastModified:RELEASES[c.slug]?.date??c.updated,changeFrequency:'monthly' as const,priority:0.6})),
  {url:origin+'/aszf',changeFrequency:'yearly',priority:0.2},
  {url:origin+'/adatvedelem',changeFrequency:'yearly',priority:0.2},
  {url:origin+'/sutik',changeFrequency:'yearly',priority:0.2},
 ];
}
