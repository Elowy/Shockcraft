import type {Metadata} from 'next';
import {AppBar} from '@/components/kezikonyv/shell';
import {KB_HOME} from '@/lib/kb/categories';

export const metadata:Metadata={title:{absolute:'Nem található – Tudástár – Villanyrajz'},robots:{index:false,follow:false}};

/** A Sémák (bekötési rajzok) csak szakmai lektorálás után jelennek meg; addig minden Sémák-oldal ide jut. */
export default function SemakNotFound(){
 return <>
  <AppBar title="Sémák" back={{href:KB_HOME,label:'Tudástár'}} home={KB_HOME}/>
  <div className="kk-page kk-page-single"><main id="tartalom" className="kk-main kk-notfound">
   <h1>Ez az oldal nem található</h1>
   <p className="kk-lead">A bekötési rajzok (Sémák) csak szakmai lektorálás után jelennek meg, vagy elírás van a címben.</p>
   <p><a className="kk-button primary" href={KB_HOME}>Tudástár kezdőlap</a> <a className="kk-button" href={KB_HOME+'#kereses'} data-kb-open="search">Keresés</a></p>
  </main></div>
 </>;
}
