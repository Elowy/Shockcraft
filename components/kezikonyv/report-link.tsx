/** „Hibát találtál?” – előre kitöltött e-mail (MVP; az anonim űrlap az 5. fázisban jön). */
export function ReportLink({id,version,fingerprint,url}:{id:string;version:number;fingerprint:string;url:string}){
 const subject='Kalkulátor hiba – '+id+' v'+version;
 const body=['Oldal: '+url,'Azonosító: '+id+' v'+version+' ('+fingerprint+')','Típus (biztonsági / szakmai / számítás / elírás): ','Leírás: ',''].join('\n');
 return <a className="kk-report" href={'mailto:info@luiz-tech.hu?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body)}>Hibát találtál? Írd meg</a>;
}
