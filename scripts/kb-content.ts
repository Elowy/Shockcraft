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
import {OUT_DIR,buildModel,renderFiles} from './kb-content/generate';

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
 for(const p of model.pending)console.log([p.id.padEnd(34),p.risk,'--------','--------','     ','lektorra vár (szöveg nélküli csonk)'].join('  '));
}else if(cmd==='record'&&id){
 const a=model.articles.find(x=>x.meta.id===id);
 if(!a){console.error(model.pending.some(p=>p.id===id)?id+': R3 – a rekordot a szakmai lektor jóváhagyó lapja alapján kell kitölteni (docs/tudastar.md „R3 kiadása”).':'Ismeretlen tétel: '+id);process.exit(1)}
 console.log(a.meta.risk==='R3'
  ?`'${id}':{kind:'lektoralt',section:'${a.meta.section}',risk:'R3',qualification:'<jogosultság>',date:'<ÉÉÉÉ-HH-NN>',fingerprint:'${a.meta.fingerprint}',${a.meta.figures?`figures:'${a.meta.figures}',`:''}approvalRef:'<jóváhagyó lap>',secondReader:'<második olvasó jogosultsága>'},`
  :`'${id}':belso('${a.meta.section}','${a.meta.risk}','${a.meta.fingerprint}','${a.meta.figures}'),`);
 console.log('// A rekord beírása után: node_modules/.bin/tsx scripts/kb-content.ts build (a keresőindex csak a közzétett tételeket tartalmazza).');
}else{console.error('Használat: scripts/kb-content.ts build | check | list | record <id>');process.exit(1)}
