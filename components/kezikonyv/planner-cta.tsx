import {ArrowUpRight,Zap} from 'lucide-react';

/** Oldalanként legfeljebb egy tervező-blokk, a tartalom után (CTA-szabály: docs/tudastar-terv.md 2.8). */
export function PlannerCta(){
 return <aside className="kk-cta" aria-label="Villanyrajz tervező">
  <Zap aria-hidden="true"/>
  <div><strong>Tervezd meg a ház villamos tervét</strong><p>Alaprajz, nyomvonalak, lakáselosztó és méretezési segédszámítás egy projektben. Ingyenes fiókkal; az első projekt ingyenes. <span className="kk-cta-mobile">A tervezőt számítógépen ajánljuk – regisztrálni most is tudsz.</span></p></div>
  <a className="kk-button primary" href="/tervezo?auth=register">Ingyenes fiók <ArrowUpRight aria-hidden="true"/></a>
 </aside>;
}
