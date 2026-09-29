// Check every operation, including an already-open PDF dialog or file chooser.
export async function checkTransferAccess(userId:string):Promise<{allowed:boolean;subscriptionRequired?:boolean;error?:string}>{
 try{
  const response=await fetch('/api/transfer-access',{cache:'no-store'});
  const data=await response.json() as {userId?:string;paidUntil?:number;error?:string};
  if(!response.ok)return {allowed:false,subscriptionRequired:response.status===402,error:data.error||'Az előfizetés nem ellenőrizhető.'};
  if(data.userId!==userId)return {allowed:false,error:'A bejelentkezett fiók megváltozott. Frissítsd az oldalt.'};
  if(!data.paidUntil||data.paidUntil<=Date.now())return {allowed:false,subscriptionRequired:true,error:'Az előfizetés lejárt. Az importáláshoz és exportáláshoz újítsd meg.'};
  return {allowed:true};
 }catch{return {allowed:false,error:'Az előfizetés most nem ellenőrizhető. Ellenőrizd az internetkapcsolatot, és próbáld újra.'}}
}
