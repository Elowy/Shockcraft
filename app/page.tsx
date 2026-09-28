import PlanEditor from '@/components/plan-editor';
import {isAdmin} from '@/lib/billing';
import {getAccount} from '@/lib/auth';
export const dynamic='force-dynamic';
export default async function Page(){
  try{const account=await getAccount();return <PlanEditor account={account} admin={isAdmin(account)}/>}
  catch{return <PlanEditor account={null} accountError="A fiókadatbázis jelenleg nem érhető el. A mintaterv szerkeszthető; a mentéshez próbáld újra a belépést."/>}
}
