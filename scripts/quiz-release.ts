// A Tesztek kiadási eszköze (docs/tudastar.md „Tesztek”).
// Használat (a repó gyökerében):
//   node_modules/.bin/tsx scripts/quiz-release.ts check       – a kérdésbank forrásának ellenőrzése (séma, szabályok, hivatkozások) és annak
//                                                             vizsgálata, hogy a lib/quiz/release kiadás és az azonosítójegyzék naprakész
//   node_modules/.bin/tsx scripts/quiz-release.ts build       – a kiadás írása (lib/quiz/release/manifest.json + index.ts; a témaköri fájlok
//                                                             csak élesedéskor) és az azonosítójegyzék bővítése a jóváhagyott kérdések
//                                                             azonosítóival (lib/quiz/id-registry.json, csak bővülhet)
//   node_modules/.bin/tsx scripts/quiz-release.ts list        – témakörönként: vázlat / jóváhagyott / visszavont, a kapu állapota; sablonok
//   node_modules/.bin/tsx scripts/quiz-release.ts fingerprint <id>  – egy kérdés tartalmi ujjlenyomata (a lektori jóváhagyás ehhez kötődik)
//   node_modules/.bin/tsx scripts/quiz-release.ts templates   – a sablonok állapota és a lib/quiz/gate.ts TEMPLATE_CHECKS-be írható sorok
// A kiadás nem módosítja a content/tudastar/kerdesek/ forrásfájlokat; a jóváhagyást (review) a szerző/szerkesztő írja be a lektori lap alapján.
import {mkdirSync,rmSync,writeFileSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {BANK_MIN_PER_TOPIC,BANK_MIN_TOTAL,TEMPLATE_CHECKS} from '../lib/quiz/gate';
import {TEMPLATES,templateInfo} from '../lib/quiz/registry';
import {approvedQuestion,questionFingerprint} from '../lib/quiz/schema';
import {TOPICS} from '../lib/quiz/topics';
import {REGISTRY_FILE,allQuestions,extendRegistry,loadBank,readRegistry,registryShrinks,releaseModel,renderRegistry,staleRelease} from './quiz/bank';

const ROOT=resolve(dirname(new URL(import.meta.url).pathname),'..');
const [cmd='list',arg]=process.argv.slice(2);
const bank=loadBank(ROOT),model=releaseModel(bank),prev=readRegistry(ROOT),reg=extendRegistry(prev,allQuestions(bank));

if(cmd==='build'){
 if(bank.errors.length){console.error('A kérdésbank hibás – a kiadás nem készült el:\n'+bank.errors.join('\n'));process.exit(1)}
 if(reg.errors.length){console.error(reg.errors.join('\n'));process.exit(1)}
 const files={...model.files,[REGISTRY_FILE]:renderRegistry(reg.registry)};
 for(const s of staleRelease(ROOT,model.files).filter(s=>s.endsWith('(fölösleges)')))rmSync(join(ROOT,s.replace(/ \(fölösleges\)$/,'')),{force:true});
 for(const [p,c] of Object.entries(files)){const f=join(ROOT,p);mkdirSync(dirname(f),{recursive:true});writeFileSync(f,c)}
 console.log('Kiadás: '+model.manifest.total+' jóváhagyott kérdés; a bank '+(model.live?'ÉL':'nem él (legalább '+BANK_MIN_TOTAL+' és témakörönként '+BANK_MIN_PER_TOPIC+' kell)')+'. Azonosítójegyzék: +'+reg.added.length+' új.');
}else if(cmd==='check'){
 const problems=[...bank.errors,...reg.errors,...staleRelease(ROOT,model.files).map(s=>'elavult kiadás: '+s+' – futtasd: node_modules/.bin/tsx scripts/quiz-release.ts build'),...registryShrinks(prev,reg.registry)];
 const released=Object.values(model.approved).flat().filter(q=>!prev.ids[q.id]).map(q=>q.id);
 if(released.length)problems.push('a jegyzékből hiányzó jóváhagyott azonosító(k): '+released.join(', ')+' – futtasd a build-et');
 if(problems.length){console.error(problems.join('\n'));process.exit(1)}
 console.log('A kérdésbank rendben: '+allQuestions(bank).length+' kérdés '+bank.files.length+' fájlban, ebből '+model.manifest.total+' jóváhagyott; a bank '+(model.live?'él':'nem él')+'.');
}else if(cmd==='list'){
 for(const t of TOPICS){
  const qs=allQuestions(bank).filter(q=>q.topic===t.id);
  console.log(t.id.padEnd(26)+' kérdés: '+String(qs.length).padStart(4)+' · jóváhagyott: '+String(qs.filter(approvedQuestion).length).padStart(4)+' · lektorra vár: '+String(qs.filter(q=>q.review==='lektorra-var').length).padStart(4)+' · visszavont: '+qs.filter(q=>q.retired).length);
 }
 console.log('Bank: '+(model.live?'ÉL':'nem él')+' ('+model.manifest.total+'/'+BANK_MIN_TOTAL+', témakörönként legalább '+BANK_MIN_PER_TOPIC+')'+(bank.ignored.length?'; kihagyott fájlok: '+bank.ignored.join(', '):'')+(bank.errors.length?'; HIBÁK: '+bank.errors.length:''));
 for(const t of TEMPLATES){const i=templateInfo(t);console.log('sablon '+t.id.padEnd(26)+i.state.padEnd(18)+i.fingerprint+(i.reason?'  ('+i.reason+')':''))}
}else if(cmd==='fingerprint'){
 const q=allQuestions(bank).find(q=>q.id===arg);
 if(!q){console.error('Ismeretlen kérdés: '+arg);process.exit(1)}
 console.log(q.id+' v'+q.version+' ujjlenyomat: '+questionFingerprint(q)+(approvedQuestion(q)?' (jóváhagyott)':''));
 console.log("review: {state:'jovahagyott', qualification:'<a lap szerint>', date:'<ÉÉÉÉ-HH-NN>', approvalRef:'<jóváhagyó lap>', fingerprint:'"+questionFingerprint(q)+"'}");
}else if(cmd==='templates'){
 for(const t of TEMPLATES){
  const i=templateInfo(t),rec=TEMPLATE_CHECKS[t.id];
  console.log(t.id.padEnd(26)+i.state.padEnd(18)+'kalkulátor: '+i.calcState+(rec&&rec.fingerprint!==i.fingerprint?'  (rögzített: '+rec.fingerprint+')':''));
  if(i.state==='ellenorzesre-var'||i.state==='ujraellenorzendo')console.log("  sor a TEMPLATE_CHECKS-be (belső ellenőrzés után): '"+t.id+"':check('"+i.fingerprint+"'),");
 }
}else{console.error('Ismeretlen parancs: '+cmd);process.exit(2)}
