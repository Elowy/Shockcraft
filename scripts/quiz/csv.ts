// Lektori kérdéscsomagok CSV-ben (docs/tudastar-terv.md 7. pont: „Lektori kör CSV-ben, 25 kérdéses csomagokban”) – tiszta függvények a
// scripts/quiz-csv.ts parancssori eszközhöz és a tests/quiz.ts-hez. zod itt engedett (csak szkript és teszt).
// Kimenet: témakörönként 25 kérdéses csomagok, Excel-barát CSV (UTF-8 BOM, pontosvessző, CRLF, képletvédelem a lib/plan-tools.ts csvCell-jével).
// Visszaolvasás: a lib/catalog-csv.ts dekódolójával (decodeCsv: UTF-8 / UTF-16LE / Windows-1250) és tagolójával (csvRows: ; , tab), így a
// lektor Excelben megnyithatja, kitöltheti és bármelyik szokásos CSV-formátumban visszaküldheti.
// A jóváhagyás a kérdés tartalmi ujjlenyomatára szól (questionFingerprint): ha a kérdés a csomag kiadása óta változott, a döntés nem
// vihető át, újra kell lektorálni. A szkript csak a lektor döntését írja át; saját hatáskörben jóváhagyást nem rögzít.
import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {csvRows,decodeCsv} from '../../lib/catalog-csv';
import {csvCell} from '../../lib/plan-tools';
import {approvalSchema,approvedQuestion,questionFingerprint,type Approval,type DraftQuestion} from '../../lib/quiz/schema';
import {TOPIC_IDS,topicLabel} from '../../lib/quiz/topics';
import {BANK_DIR} from './bank';

export const PACKAGE_SIZE=25;
const LETTERS=['A','B','C','D','E'];
const TYPE_LABEL:Record<DraftQuestion['type'],string>={single:'egy helyes',multi:'több helyes',truefalse:'igaz/hamis'};
const HEADER=['Sor','Azonosító','Verzió','Témakör','Nehézség','Típus','Kérdés','A','B','C','D','E','Helyes','Indoklások','Magyarázat','Hivatkozás','Kalkulátor','Forrás','Ujjlenyomat','Döntés','Megjegyzés'];
const META={qualification:'Lektor jogosultsága',date:'Dátum (ÉÉÉÉ-HH-NN)',approvalRef:'Jóváhagyó lap hivatkozása'} as const;
const INSTRUCTIONS='A Döntés oszlopba: jóváhagyom / javítandó / elvetem; a Megjegyzés oszlopba a javítás vagy az ok. A többi oszlopot ne módosítsd: az Ujjlenyomat a kérdés pontos szövegére szól. A fenti három sort (jogosultság, dátum, jóváhagyó lap) a jóváhagyáshoz ki kell tölteni.';

/** Lektorálandó: a még nem jóváhagyott, nem visszavont kérdés, és az a jóváhagyott, amelynek a tartalma a jóváhagyás óta változott. */
export const needsReview=(q:DraftQuestion)=>!q.retired&&!approvedQuestion(q);

export type CsvPackage={id:string;file:string;topic:string;questions:DraftQuestion[];csv:string};
/** A csomagok: témakörönként, azonosító szerint rendezve, legfeljebb 25 kérdéssel; a fájlnév „<témakör>-<NN>.csv”. */
export function reviewPackages(questions:readonly DraftQuestion[],issued:string,size=PACKAGE_SIZE):CsvPackage[]{
 const out:CsvPackage[]=[];
 for(const t of TOPIC_IDS){
  const qs=questions.filter(q=>q.topic===t&&needsReview(q)).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
  for(let i=0;i<qs.length;i+=size){
   const part=qs.slice(i,i+size),id=t+'-'+String(i/size+1).padStart(2,'0');
   out.push({id,file:id+'.csv',topic:t,questions:part,csv:packageCsv(id,t,part,issued)});
  }
 }
 return out;
}
function row(q:DraftQuestion,n:number):string[]{
 const choice=(i:number)=>q.choices[i]?.text??'';
 const correct=q.choices.map((c,i)=>c.correct?LETTERS[i]:'').filter(Boolean).join(', ');
 const why=q.choices.map((c,i)=>c.why?LETTERS[i]+': '+c.why:'').filter(Boolean).join(' | ');
 return [String(n),q.id,String(q.version),topicLabel(q.topic),String(q.difficulty),TYPE_LABEL[q.type],q.stem,choice(0),choice(1),choice(2),choice(3),choice(4),correct,why,q.explanation,q.ref,q.calc??'',q.source,questionFingerprint(q),'',''];
}
export function packageCsv(id:string,topic:string,qs:readonly DraftQuestion[],issued:string):string{
 const lines:string[][]=[
  ['Villanyrajz – Tudástár, Tesztek: lektori kérdéscsomag'],['Csomag',id],['Témakör',topicLabel(topic)],['Kiadva',issued],['Kérdések',String(qs.length)],
  [META.qualification,''],[META.date,''],[META.approvalRef,''],['Kitöltés',INSTRUCTIONS],[],HEADER,...qs.map((q,i)=>row(q,i+1)),
 ];
 return '\uFEFF'+lines.map(r=>r.map(csvCell).join(';')).join('\r\n')+'\r\n';
}

// ---------------------------------------------------------------------------------------------------- Visszaolvasás
export type Decision='jovahagyom'|'javitando'|'elvetem';
export type ReviewRow={line:number;id:string;fingerprint:string;decision:Decision|null;comment:string};
export type ReviewSheet={package:string;qualification:string;date:string;approvalRef:string;rows:ReviewRow[];errors:string[];encoding:string};
const plain=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const DECISIONS:Record<string,Decision>={jovahagyom:'jovahagyom',jovahagyva:'jovahagyom',jovahagyott:'jovahagyom',igen:'jovahagyom',ok:'jovahagyom',javitando:'javitando',javitas:'javitando',javitani:'javitando',elvetem:'elvetem',elvetve:'elvetem',elvet:'elvetem',nem:'elvetem'};
/** A kitöltött csomag beolvasása (bájtokból: UTF-8, UTF-16LE vagy Windows-1250; pontosvessző, vessző vagy tabulátor). */
export function readReviewCsv(bytes:Uint8Array):ReviewSheet{
 const {text,encoding}=decodeCsv(bytes),{rows,unclosed}=csvRows(text),errors:string[]=[];
 const sheet:ReviewSheet={package:'',qualification:'',date:'',approvalRef:'',rows:[],errors,encoding};
 if(unclosed){errors.push('Lezáratlan idézőjel a(z) '+unclosed+'. sorban.');return sheet}
 const hi=rows.findIndex(r=>r.cells.map(plain).includes('azonosito')&&r.cells.map(plain).includes('ujjlenyomat'));
 if(hi<0){errors.push('Nem található a fejlécsor (Azonosító, Ujjlenyomat, Döntés …).');return sheet}
 for(const r of rows.slice(0,hi)){
  const k=plain(r.cells[0]??''),v=(r.cells[1]??'').trim();
  if(k==='csomag')sheet.package=v;
  else if(k===plain(META.qualification))sheet.qualification=v;
  else if(k===plain(META.date))sheet.date=v;
  else if(k===plain(META.approvalRef))sheet.approvalRef=v;
 }
 const head=rows[hi].cells.map(plain),col=(name:string)=>head.indexOf(plain(name));
 const [ci,cf,cd,cm]=[col('Azonosító'),col('Ujjlenyomat'),col('Döntés'),col('Megjegyzés')];
 if(cd<0)errors.push('Hiányzik a Döntés oszlop.');
 for(const r of rows.slice(hi+1)){
  const id=(r.cells[ci]??'').trim();if(!id&&r.cells.every(c=>!c.trim()))continue;
  const raw=(r.cells[cd]??'').trim(),key=plain(raw),decision=raw?DECISIONS[key]??null:null;
  if(raw&&!decision)errors.push(r.line+'. sor ('+id+'): ismeretlen döntés: „'+raw+'” (jóváhagyom / javítandó / elvetem).');
  sheet.rows.push({line:r.line,id,fingerprint:(r.cells[cf]??'').trim(),decision,comment:(cm>=0?r.cells[cm]??'':'').trim()});
 }
 return sheet;
}

export type ReviewOutcome={approved:Record<string,Approval>;fix:ReviewRow[];rejected:ReviewRow[];open:ReviewRow[];errors:string[]};
/** A döntések egyeztetése a mostani kérdésbankkal: jóváhagyás csak egyező ujjlenyomatra, kitöltött lektori fejléccel. */
export function reviewOutcome(sheet:ReviewSheet,questions:readonly DraftQuestion[]):ReviewOutcome{
 const out:ReviewOutcome={approved:{},fix:[],rejected:[],open:[],errors:[...sheet.errors]};
 const approve=sheet.rows.filter(r=>r.decision==='jovahagyom');
 if(approve.length){
  if(!sheet.qualification)out.errors.push('A csomag fejlécéből hiányzik: '+META.qualification+'.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(sheet.date))out.errors.push('A csomag fejlécéből hiányzik vagy hibás: '+META.date+'.');
  if(!sheet.approvalRef)out.errors.push('A csomag fejlécéből hiányzik: '+META.approvalRef+'.');
 }
 for(const r of sheet.rows){
  const q=questions.find(x=>x.id===r.id);
  if(!q){out.errors.push(r.line+'. sor: ismeretlen kérdés: '+(r.id||'(üres azonosító)'));continue}
  if(r.decision==='javitando')out.fix.push(r);
  else if(r.decision==='elvetem')out.rejected.push(r);
  else if(!r.decision)out.open.push(r);
  else{
   const fp=questionFingerprint(q);
   if(r.fingerprint!==fp){out.errors.push(r.line+'. sor ('+r.id+'): a kérdés a csomag kiadása óta változott (ujjlenyomat: csomagban '+r.fingerprint+', most '+fp+') – újra kell lektorálni.');continue}
   const review={state:'jovahagyott' as const,qualification:sheet.qualification,date:sheet.date,approvalRef:(sheet.approvalRef+' · csomag: '+(sheet.package||'?')+' · '+r.line+'. sor').slice(0,400),fingerprint:fp};
   const ok=approvalSchema.safeParse(review);
   if(ok.success)out.approved[r.id]=ok.data;
  }
 }
 if(out.errors.length)out.approved={};
 return out;
}

/** A jóváhagyások beírása a forrásfájlokba (csak --apply-jal, a szerkesztő futtatja): a `review` mező, és az „AI-tervezet” forrásból
 * „AI-tervezet, lektorált” lesz. Más mező nem változik. Visszaad: a módosított fájlok. */
export function applyReviews(root:string,approved:Readonly<Record<string,Approval>>,dir=BANK_DIR):string[]{
 const changed:string[]=[];
 for(const t of TOPIC_IDS){
  const f=join(root,dir,t+'.json');let json:unknown;
  try{json=JSON.parse(readFileSync(f,'utf8'))}catch{continue}
  const list=(Array.isArray(json)?json:(json as {questions?:unknown[]}).questions)??[];
  let n=0;
  for(const q of list as Record<string,unknown>[]){
   const r=approved[String(q?.id)];if(!r)continue;
   q.review=r;if(q.source==='AI-tervezet')q.source='AI-tervezet, lektorált';n++;
  }
  if(n){writeFileSync(f,JSON.stringify(json,null,2)+'\n');changed.push(dir+'/'+t+'.json')}
 }
 return changed;
}
