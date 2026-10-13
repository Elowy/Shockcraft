// A Tudástár tartalommotorjának parancssori eszköze (docs/tudastar.md).
// Használat (a repó gyökerében):
//   node_modules/.bin/tsx scripts/kb-content.ts build          – a content/tudastar/*.md vázlatokból újragenerálja a lib/kb/content/generated fájlokat
//   node_modules/.bin/tsx scripts/kb-content.ts check          – csak ellenőriz: eltérés esetén hibakóddal lép ki (a generált fájl elavult)
//   node_modules/.bin/tsx scripts/kb-content.ts list           – minden tétel: kockázat, tartalmi és ábra-ujjlenyomat, kiadási állapot
//   node_modules/.bin/tsx scripts/kb-content.ts record <id>    – a lib/kb/release.ts-be másolandó rekordváz az aktuális ujjlenyomatokkal
// A kiadás a lib/kb/release.ts kézi szerkesztése; ez a szkript azt nem írja. A rekord beírása után a `build`-et újra kell futtatni:
// a böngészőbe töltődő keresőindex (lib/kb/content/generated/search.ts) csak a közzétett tételeket tartalmazza.
import {existsSync,mkdirSync,readFileSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {contentFingerprint} from '../lib/kb/content/fingerprint';
import {gateState} from '../lib/kb/content/gate';
import {KB_RELEASES,KB_SUSPENDED} from '../lib/kb/release';
import {OUT_DIR,articleFromDraft,buildModel,renderFiles} from './kb-content/generate';

const ROOT=resolve(dirname(new URL(import.meta.url).pathname),'..');
const [cmd='list',id]=process.argv.slice(2);

function stale(files:Record<string,string>){
 const out:string[]=[];
 for(const [p,c] of Object.entries(files)){const f=join(ROOT,p);if(!existsSync(f)||readFileSync(f,'utf8')!==c)out.push(p)}
 const bodies=join(ROOT,OUT_DIR,'bodies');
 if(existsSync(bodies))for(const f of readdirSync(bodies))if(!files[OUT_DIR+'/bodies/'+f])out.push(OUT_DIR+'/bodies/'+f+' (fölösleges)');
 return out;
}

const model=buildModel(ROOT);
if(cmd==='build'){
 const files=renderFiles(model);
 rmSync(join(ROOT,OUT_DIR,'bodies'),{recursive:true,force:true});
 for(const [p,c] of Object.entries(files)){const f=join(ROOT,p);mkdirSync(dirname(f),{recursive:true});writeFileSync(f,c)}
 console.log('Generálva: '+model.articles.length+' cikk, '+model.pending.length+' lektorra váró (R3) csonk → '+OUT_DIR);
}else if(cmd==='check'){
 const s=stale(renderFiles(model));
 if(s.length){console.error('Elavult generált fájl(ok) – futtasd: node_modules/.bin/tsx scripts/kb-content.ts build\n'+s.join('\n'));process.exit(1)}
 console.log('A generált tartalom naprakész ('+model.articles.length+' cikk).');
}else if(cmd==='list'){
 const LABEL={kozzeteve:'közzétett',vazlat:'vázlat (belső ellenőrzésre vár)','lektorra-var':'lektorra vár',ujraellenorzendo:'ÚJRAELLENŐRIZENDŐ',felfuggesztve:'felfüggesztve'} as const;
 for(const a of model.articles){
  const r=KB_RELEASES[a.meta.id],g=gateState(a.meta,contentFingerprint(a.meta,a.body),KB_RELEASES,KB_SUSPENDED);
  const state=LABEL[g.state]+(g.state==='kozzeteve'?(r?.kind==='lektoralt'?' – szakmailag lektorált':' – belsőleg ellenőrzött'):g.reason?' – '+g.reason:'')+(g.state==='ujraellenorzendo'&&r?' (rekord: '+r.fingerprint+'/'+(r.figures||'-')+')':'');
  console.log([a.meta.id.padEnd(34),a.meta.risk,a.meta.fingerprint,(a.meta.figures||'--------'),String(a.meta.words).padStart(5)+' szó',state].join('  '));
 }
 // R3: a vázlat ujjlenyomatai (a lektori jóváhagyó laphoz); ha a vázlatból még nem készülhet cikk (pl. hiányzó ábra), az ok.
 for(const p of model.pending){
  let fp='--------',fig='--------',note='lektorra vár (szöveg nélküli csonk)';
  try{const a=articleFromDraft(p.file,readFileSync(join(ROOT,p.file),'utf8'),ROOT);fp=a.meta.fingerprint;fig=a.meta.figures||'--------'}catch(e){note+=' – még nem adható ki: '+(e as Error).message}
  console.log([p.id.padEnd(34),p.risk,fp,fig,'     ',note].join('  '));
 }
}else if(cmd==='record'&&id){
 const a=model.articles.find(x=>x.meta.id===id);
 const pend=model.pending.find(p=>p.id===id);
 if(!a&&pend){
  // R3: a rekord vázát a szakmai lektor jóváhagyó lapja alapján KÉZZEL kell kitölteni (docs/lektoralas.md „4. rész”); fejlesztő vagy MI
  // „lektoralt” rekordot nem írhat. Az ujjlenyomatok a vázlatból és az ábrákból (netlista, elrendezés, rajzoló modulok) számolódnak.
  let r3;try{r3=articleFromDraft(pend.file,readFileSync(join(ROOT,pend.file),'utf8'),ROOT)}catch(e){console.error(id+': az R3 vázlatból még nem készülhet cikk – '+(e as Error).message);process.exit(1)}
  console.log('// CSAK a szakmai lektor (és a második olvasó) aláírt jóváhagyó lapja alapján; a <…> mezőket a lap adataival kell kitölteni.');
  console.log(`'${id}':{kind:'lektoralt',section:'${r3.meta.section}',risk:'R3',qualification:'<jogosultság>',date:'<ÉÉÉÉ-HH-NN>',fingerprint:'${r3.meta.fingerprint}',${r3.meta.figures?`figures:'${r3.meta.figures}',`:''}approvalRef:'<jóváhagyó lap>',secondReader:'<második olvasó jogosultsága>'},`);
  console.log('// A rekord beírása után: node_modules/.bin/tsx scripts/kb-content.ts build (a törzs, az ábrák és a keresőindex csak ekkor kerül a buildbe).');
  process.exit(0);
 }
 if(!a){console.error('Ismeretlen tétel: '+id);process.exit(1)}
 console.log(a.meta.risk==='R3'
  ?`'${id}':{kind:'lektoralt',section:'${a.meta.section}',risk:'R3',qualification:'<jogosultság>',date:'<ÉÉÉÉ-HH-NN>',fingerprint:'${a.meta.fingerprint}',${a.meta.figures?`figures:'${a.meta.figures}',`:''}approvalRef:'<jóváhagyó lap>',secondReader:'<második olvasó jogosultsága>'},`
  :`'${id}':belso('${a.meta.section}','${a.meta.risk}','${a.meta.fingerprint}','${a.meta.figures}'),`);
 console.log('// A rekord beírása után: node_modules/.bin/tsx scripts/kb-content.ts build (a keresőindex csak a közzétett tételeket tartalmazza).');
}else{console.error('Használat: scripts/kb-content.ts build | check | list | record <id>');process.exit(1)}
