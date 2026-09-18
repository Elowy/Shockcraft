import PlanEditor from '@/components/plan-editor';
import {getAccount} from '@/lib/auth';
export const dynamic='force-dynamic';
export default async function Page(){
  try{return <PlanEditor account={await getAccount()}/>}
  catch{return <PlanEditor account={null} accountError="A fiókadatbázis jelenleg nem érhető el. A mintaterv szerkeszthető; a mentéshez próbáld újra a belépést."/>}
}
