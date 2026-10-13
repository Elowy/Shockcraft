import type {Metadata} from 'next';
import {AppBar,Shell} from '@/components/kezikonyv/shell';
import {KB_HOME} from '@/lib/kb/categories';

export const metadata:Metadata={title:{absolute:'Nem található – Tudástár – Villanyrajz'},robots:{index:false,follow:false}};

export default function TudastarNotFound(){
 return <Shell section="tudastar">
  <AppBar title="Tudástár" back={{href:KB_HOME,label:'Tudástár'}} home={KB_HOME}/>
  <div className="kk-page kk-page-single"><main id="tartalom" className="kk-main kk-notfound">
   <h1>Ez az oldal nem található</h1>
   <p className="kk-lead">Lehet, hogy elírás van a címben, vagy a tartalom még szakmai lektorálás alatt áll.</p>
   <p><a className="kk-button primary" href={KB_HOME}>A Tudástár kezdőlapja</a> <a className="kk-button" href={KB_HOME+'#kereses'} data-kb-open="search">Keresés</a></p>
  </main></div>
 </Shell>;
}
