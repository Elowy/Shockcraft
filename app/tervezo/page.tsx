import PlanEditor from '@/components/plan-editor';
import {isAdmin} from '@/lib/billing';
import {getAccount} from '@/lib/auth';
import {PlannerAccess} from '@/components/planner-access';
export const dynamic='force-dynamic';
export const metadata={title:'Tervező – Villanyrajz'};
export default async function Page(){
 try{const account=await getAccount();if(!account)return <PlannerAccess/>;return <PlanEditor account={account} admin={isAdmin(account)}/>}
 catch{return <PlannerAccess error="A bejelentkezés most nem ellenőrizhető. Próbáld újra később."/>}
}
