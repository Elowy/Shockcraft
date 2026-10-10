'use client';
import {Calculator,LockKeyhole} from 'lucide-react';
import {CALC_HUB} from '@/lib/kb/categories';
import {AccountMenu} from './account-menu';
import {PublicHeader,PublicFooter} from './public-shell';

export function PlannerAccess({error=''}:{error?:string}){
 return <div className="public-site"><PublicHeader/><main className="account-page"><section className="account-card"><div className="account-symbol"><LockKeyhole/></div><h1>A tervezéshez jelentkezz be</h1><p>Lépj be a Villanyrajz-fiókodba, vagy regisztrálj a saját e-mail-címeddel. Az első projekted ingyenes.</p>{error&&<p role="alert" className="auth-error">{error}</p>}<div className="planner-access-actions"><AccountMenu account={null} initialOpen={!error} onAuthenticated={()=>window.location.reload()} dirty={false} save={async()=>true} storeDraft={()=>true} dbState=""/><a href="/">Vissza a főoldalra</a></div><aside className="planner-free" aria-label="Belépés nélkül"><Calculator aria-hidden="true"/><p><b>Belépés nélkül is használhatod:</b> a <a href={CALC_HUB}>villamos kalkulátorok</a> (Ohm-törvény, teljesítmény, fogyasztás, fázisterhelés, átváltók) ingyenesek, fiók nélkül.</p></aside></section></main><PublicFooter/></div>;
}
