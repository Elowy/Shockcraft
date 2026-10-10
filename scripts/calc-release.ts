// Kalkulátorok kiadási állapota és ujjlenyomata.
// Használat (a repó gyökerében):
//   node_modules/.bin/tsx scripts/calc-release.ts list            – minden kalkulátor: szint, állapot, tartalmi és forrás-ujjlenyomat, ok
//   node_modules/.bin/tsx scripts/calc-release.ts record <slug>   – a lib/calc/release.ts-be másolandó rekordváz (lektori adatokkal kitöltendő)
// A szkript semmit nem ír: a kiadás a lib/calc/release.ts kézi szerkesztése (lásd docs/kalkulatorok.md).
import {CALCULATORS,bySlug,calcFingerprint,releaseInfo} from '../lib/calc/registry';
import {checkExample} from '../lib/calc/core';
import {RELEASES,TABLE_GATED} from '../lib/calc/release';
import {reviewText} from '../lib/sizing-tables';
import {sourceFingerprint} from './calc-source';

const [cmd='list',slug]=process.argv.slice(2);
if(cmd==='list'){
 for(const d of CALCULATORS){
  const info=releaseInfo(d),errors=d.examples.flatMap(ex=>checkExample(d,ex)),src=sourceFingerprint(d.slug),rec=RELEASES[d.slug];
  const srcState=rec?(rec.source===src?'':'FORRÁS VÁLTOZOTT (rekord: '+rec.source+') – újra kell ellenőrizni'):'';
  console.log([d.slug.padEnd(32),d.tier,calcFingerprint(d),src,info.state.padEnd(16),TABLE_GATED.has(d.slug)?'táblázat':'',srcState,errors.length?'PÉLDAHIBA: '+errors.join('; '):'',info.reason].filter(Boolean).join('  '));
 }
 console.log('\nOszlopok: slug, szint, tartalmi ujjlenyomat (fingerprint), forrás-ujjlenyomat (source), állapot.');
 console.log('Méretezési táblázatok: '+reviewText());
}else if(cmd==='record'&&slug){
 const d=bySlug(slug);if(!d){console.error('Ismeretlen kalkulátor: '+slug);process.exit(1)}
 const fp=calcFingerprint(d),src=sourceFingerprint(d.slug);
 console.log(d.tier==='T0'
  ?`'${d.slug}':internal('${fp}','${src}'),`
  :`'${d.slug}':{kind:'lektoralt',reviewer:'<név>',qualification:'<minősítés, pl. MMK villamos tervező>',registry:'<névjegyzéki szám>',date:'<ÉÉÉÉ-HH-NN>',fingerprint:'${fp}',source:'${src}',approvalRef:'Lektori csomag LK-<n> (<kiadás dátuma>), csomag: <csomag-ujjlenyomat>, 3. rész: <kalkulátor-ujjlenyomat>; jóváhagyó lap: <iktatási hely>',showName:false},  // showName: true csak a jóváhagyó lapon jelölt hozzájárulással`);
}else{console.error('Használat: scripts/calc-release.ts list | record <slug>');process.exit(1)}
