// Check every operation, including an already-open PDF dialog or file chooser.
export async function checkTransferAccess(userId:string):Promise<{allowed:boolean;subscriptionRequired?:boolean;error?:string}>{
 try{
  const response=await fetch('/api/transfer-access',{cache:'no-store'});
  const data=await response.json() as {userId?:string;paidUntil?:number;error?:string};
  if(!response.ok)return {allowed:false,subscriptionRequired:response.status===402,error:data.error||'Az előfizetés nem ellenőrizhető.'};
  if(data.userId!==userId)return {allowed:false,error:'A bejelentkezett fiók megváltozott. Frissítsd az oldalt.'};
  if(!data.paidUntil||data.paidUntil<=Date.now())return {allowed:false,subscriptionRequired:true,error:'Az előfizetés lejárt. Az importáláshoz újítsd meg.'};
  return {allowed:true};
 }catch{return {allowed:false,error:'Az előfizetés most nem ellenőrizhető. Ellenőrizd az internetkapcsolatot, és próbáld újra.'}}
}

// Export is checked server-side for the specific saved project on every operation.
export async function checkExportAccess(userId:string,projectId:string):Promise<{allowed:boolean;subscriptionRequired?:boolean;error?:string}>{
 try{
  const response=await fetch('/api/transfer-access?purpose=export&projectId='+encodeURIComponent(projectId),{cache:'no-store'});
  const data=await response.json() as {userId?:string;projectId?:string;export?:boolean;error?:string;code?:string};
  if(!response.ok)return {allowed:false,subscriptionRequired:data.code==='SUBSCRIPTION_REQUIRED',error:data.error||'Az exportálási jogosultság nem ellenőrizhető.'};
  if(data.userId!==userId)return {allowed:false,error:'A bejelentkezett fiók megváltozott. Frissítsd az oldalt.'};
  if(data.projectId!==projectId||data.export!==true)return {allowed:false,error:'A projekt közben megváltozott. Próbáld újra.'};
  return {allowed:true};
 }catch{return {allowed:false,error:'Az exportálási jogosultság most nem ellenőrizhető. Ellenőrizd az internetkapcsolatot, és próbáld újra.'}}
}
