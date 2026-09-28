import {redirect} from 'next/navigation';
import {HomePage} from '@/components/home-page';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const params=await searchParams;
 // Preserve returns from Checkout sessions created before the planner moved.
 if(typeof params.payment==='string'&&['success','cancelled','manage'].includes(params.payment)){
  const next=new URLSearchParams({payment:params.payment});
  if(typeof params.session_id==='string')next.set('session_id',params.session_id);
  redirect('/tervezo?'+next.toString());
 }
 return <HomePage/>;
}
