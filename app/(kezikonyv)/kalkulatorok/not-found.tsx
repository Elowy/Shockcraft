import type {Metadata} from 'next';
import {AppBar} from '@/components/kezikonyv/shell';
import {CALC_HUB} from '@/lib/kb/categories';

export const metadata:Metadata={title:{absolute:'Nem található – Kalkulátorok – Villanyrajz'},robots:{index:false,follow:false}};

/** Ismeretlen vagy (még) kiadatlan kalkulátor. Egyoszlopos rács (nincs oldalsáv), hogy asztalon se szoruljon a 13rem-es oszlopba. */
export default function KalkulatorNotFound(){
 return <>
  <AppBar title="Kalkulátorok" back={{href:CALC_HUB,label:'Kalkulátorok'}}/>
  <div className="kk-page kk-page-single"><main id="tartalom" className="kk-main kk-notfound">
   <h1>Ez a kalkulátor nem található</h1>
   <p className="kk-lead">Lehet, hogy elírás van a címben, vagy a kalkulátor még szakmai lektorálás alatt áll.</p>
   <p><a className="kk-button primary" href={CALC_HUB}>Az összes kalkulátor</a> <a className="kk-button" href={CALC_HUB+'#kereses'} data-kb-open="search">Keresés</a></p>
  </main></div>
 </>;
}
