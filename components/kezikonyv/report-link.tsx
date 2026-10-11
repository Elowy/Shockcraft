/** „Hibát találtál?” – előre kitöltött e-mail (MVP; az anonim űrlap az 5. fázisban jön). */
export function ReportLink({id,version,fingerprint,url,kind='calc',anchor}:{id:string;version:number|string;fingerprint:string;url:string;kind?:'calc'|'kb';anchor?:string}){
 const subject=(kind==='kb'?'Tudástár hiba – ':'Kalkulátor hiba – ')+id+' v'+version;
 const body=['Oldal: '+url,...(anchor?['Horgony: #'+anchor]:[]),'Azonosító: '+id+' v'+version+' ('+fingerprint+')',kind==='kb'?'Típus (biztonsági / szakmai / ábra / számítás / elírás): ':'Típus (biztonsági / szakmai / számítás / elírás): ','Leírás: ',''].join('\n');
 return <a className="kk-report" href={'mailto:info@luiz-tech.hu?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body)}>Hibát találtál? Írd meg</a>;
}
