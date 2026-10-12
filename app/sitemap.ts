// Oldaltérkép: a főoldal, a jogi oldalak, a Tudástár kezdőlapja, az Elmélet és kategóriái, CSAK a közzétett cikkek és a szakszótár
// (lib/kb/release.ts kapu; az R3 vázlat nem kerül bele), a /tudastar/tesztek (csak ha van közzétett tartalma, lib/quiz/gate.ts; tesztkódos
// vagy kérdésenkénti URL nincs), a /kalkulatorok és CSAK a közzétett kalkulátorok (a kiadatlan T1 nem).
// Ha nincs érvényes APP_ORIGIN, üres listát ad (relatív URL nem kerülhet a sitemapbe).
import type {MetadataRoute} from 'next';
import {publishedCalcs} from '@/lib/calc/registry';
import {RELEASES} from '@/lib/calc/release';
import {articleHref,categoriesWithArticles,categoryArticles,categoryHref,publishedArticles} from '@/lib/kb/content/registry';
import {KB_HOME} from '@/lib/kb/categories';
import {KB_RELEASES} from '@/lib/kb/release';
import {QUIZ_PATH,quizLastModified,quizPublishedCount} from '@/lib/quiz/registry';
import {siteOrigin} from '@/lib/site-origin';

export default function sitemap():MetadataRoute.Sitemap{
 const origin=siteOrigin();if(!origin)return [];
 const calcs=publishedCalcs();
 const latest=calcs.map(c=>RELEASES[c.slug]?.date??c.updated).sort().at(-1);
 const articles=publishedArticles();
 const modified=(id:string,updated:string)=>[KB_RELEASES[id]?.date??updated,updated].sort().at(-1)!;
 const kbLatest=articles.map(a=>modified(a.id,a.updated)).sort().at(-1);
 const cats=categoriesWithArticles('elmelet');
 return [
  {url:origin+'/',changeFrequency:'monthly',priority:1},
  {url:origin+KB_HOME,changeFrequency:'weekly',priority:0.8,...(kbLatest?{lastModified:kbLatest}:{})},
  ...(articles.some(a=>a.section==='elmelet')?[{url:origin+KB_HOME+'/elmelet',changeFrequency:'weekly' as const,priority:0.7,...(kbLatest?{lastModified:kbLatest}:{})}]:[]),
  // Sémák: csak ha van közzétett (szakmailag lektorált) séma
  ...(articles.some(a=>a.section==='semak')?[{url:origin+KB_HOME+'/semak',changeFrequency:'weekly' as const,priority:0.7,...(kbLatest?{lastModified:kbLatest}:{})}]:[]),
  ...cats.map(c=>({url:origin+categoryHref(c),changeFrequency:'monthly' as const,priority:0.5,lastModified:categoryArticles(c.id).map(a=>modified(a.id,a.updated)).sort().at(-1)})),
  ...articles.map(a=>({url:origin+articleHref(a),lastModified:modified(a.id,a.updated),changeFrequency:'monthly' as const,priority:0.6})),
  ...(quizPublishedCount()?[{url:origin+QUIZ_PATH,changeFrequency:'monthly' as const,priority:0.6,...(quizLastModified()?{lastModified:quizLastModified()}:{})}]:[]),
  {url:origin+'/kalkulatorok',changeFrequency:'weekly',priority:0.8,...(latest?{lastModified:latest}:{})},
  ...calcs.map(c=>({url:origin+'/kalkulatorok/'+c.slug,lastModified:RELEASES[c.slug]?.date??c.updated,changeFrequency:'monthly' as const,priority:0.6})),
  {url:origin+'/aszf',changeFrequency:'yearly',priority:0.2},
  {url:origin+'/adatvedelem',changeFrequency:'yearly',priority:0.2},
  {url:origin+'/sutik',changeFrequency:'yearly',priority:0.2},
 ];
}
