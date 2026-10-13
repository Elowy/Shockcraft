import type {Metadata} from 'next';
import {AppBar} from '@/components/kezikonyv/shell';
import {KB_HOME} from '@/lib/kb/categories';

export const metadata:Metadata={title:{absolute:'Nem található – Tudástár – Villanyrajz'},robots:{index:false,follow:false}};

/** Ismeretlen vagy még nem közzétett (pl. szakmai lektorálás alatt álló) cikk. */
export default function ElmeletNotFound(){
 return <>
  <AppBar title="Elmélet" back={{href:KB_HOME+'/elmelet',label:'Elmélet'}} home={KB_HOME}/>
  <div className="kk-page kk-page-single"><main id="tartalom" className="kk-main kk-notfound">
   <h1>Ez a cikk nem található</h1>
   <p className="kk-lead">Lehet, hogy elírás van a címben, vagy a cikk még szakmai lektorálás alatt áll.</p>
   <p><a className="kk-button primary" href={KB_HOME+'/elmelet'}>Az Elmélet cikkei</a> <a className="kk-button" href={KB_HOME+'#kereses'} data-kb-open="search">Keresés</a></p>
  </main></div>
 </>;
}
