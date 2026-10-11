// Lektori kérdéscsomagok CSV-ben (docs/tudastar.md „Tesztek – kérdésbank”).
// Használat (a repó gyökerében):
//   node_modules/.bin/tsx scripts/quiz-csv.ts export [--out outputs/lektori-kerdesek] [--datum ÉÉÉÉ-HH-NN]
//       – a lektorálandó kérdések (vázlat, illetve a jóváhagyás óta módosult) témakörönként 25 kérdéses csomagokban: <témakör>-<NN>.csv
//   node_modules/.bin/tsx scripts/quiz-csv.ts import <kitöltött.csv> [...] [--apply]
//       – a lektor döntéseinek beolvasása (UTF-8, UTF-16LE vagy Windows-1250; pontosvessző, vessző vagy tabulátor); jelentés a
//         jóváhagyott, javítandó, elvetett és döntés nélküli kérdésekről. --apply: a jóváhagyások beírása a content/tudastar/kerdesek/
//         forrásfájlokba (review mező; „AI-tervezet” → „AI-tervezet, lektorált”), csak egyező ujjlenyomatra és kitöltött lektori fejléccel.
//         Utána: node_modules/.bin/tsx scripts/quiz-release.ts build.
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {allQuestions,loadBank} from './quiz/bank';
import {applyReviews,readReviewCsv,reviewOutcome,reviewPackages} from './quiz/csv';

const ROOT=resolve(dirname(new URL(import.meta.url).pathname),'..');
const args=process.argv.slice(2),cmd=args[0];
const opt=(name:string)=>{const i=args.indexOf(name);return i>=0?args[i+1]:undefined};
const bank=loadBank(ROOT);
if(bank.errors.length){console.error('A kérdésbank hibás – előbb javítsd:\n'+bank.errors.join('\n'));process.exit(1)}

if(cmd==='export'){
 const out=resolve(ROOT,opt('--out')??'outputs/lektori-kerdesek'),issued=opt('--datum')??new Date().toISOString().slice(0,10);
 const packages=reviewPackages(allQuestions(bank),issued);
 mkdirSync(out,{recursive:true});
 for(const p of packages)writeFileSync(join(out,p.file),p.csv);
 console.log(packages.length?packages.map(p=>p.file+': '+p.questions.length+' kérdés').join('\n')+'\n→ '+out:'Nincs lektorálandó kérdés.');
}else if(cmd==='import'){
 const files=args.slice(1).filter(a=>!a.startsWith('--'));
 if(!files.length){console.error('Adj meg legalább egy kitöltött CSV-fájlt.');process.exit(2)}
 const approved:Record<string,unknown>={};let failed=false;
 for(const f of files){
  const sheet=readReviewCsv(new Uint8Array(readFileSync(f))),res=reviewOutcome(sheet,allQuestions(bank));
  console.log(f+' ('+sheet.encoding+', csomag: '+(sheet.package||'?')+'): jóváhagyott '+Object.keys(res.approved).length+', javítandó '+res.fix.length+', elvetett '+res.rejected.length+', döntés nélkül '+res.open.length);
  for(const r of [...res.fix,...res.rejected])console.log('  '+r.id+' – '+(r.decision==='javitando'?'javítandó':'elvetve')+(r.comment?': '+r.comment:''));
  if(res.errors.length){failed=true;console.error(res.errors.map(e=>'  HIBA: '+e).join('\n'))}
  Object.assign(approved,res.approved);
 }
 if(failed){console.error('A hibás csomagok jóváhagyásai nem kerültek át.');process.exit(1)}
 if(args.includes('--apply')){
  const changed=applyReviews(ROOT,approved as Parameters<typeof applyReviews>[1]);
  console.log(changed.length?'Módosítva: '+changed.join(', ')+'\nKövetkező lépés: node_modules/.bin/tsx scripts/quiz-release.ts build':'Nem volt átvihető jóváhagyás.');
 }else if(Object.keys(approved).length)console.log('Próbafuttatás – a forrásfájlok nem változtak. Átvitelhez: --apply');
}else{console.error('Használat: scripts/quiz-csv.ts export [--out <mappa>] | import <fájl.csv> [...] [--apply]');process.exit(2)}
