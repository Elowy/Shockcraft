// Kalkulátorok kiadási állapota és ujjlenyomata.
// Használat (a repó gyökerében):
//   node_modules/.bin/tsx scripts/calc-release.ts list            – minden kalkulátor: szint, állapot, ujjlenyomat, ok
//   node_modules/.bin/tsx scripts/calc-release.ts record <slug>   – a lib/calc/release.ts-be másolandó rekordváz (lektori adatokkal kitöltendő)
// A szkript semmit nem ír: a kiadás a lib/calc/release.ts kézi szerkesztése (lásd docs/kalkulatorok.md).
import {CALCULATORS,bySlug,calcFingerprint,releaseInfo} from '../lib/calc/registry';
import {checkExample} from '../lib/calc/core';
import {TABLE_GATED} from '../lib/calc/release';
import {reviewText} from '../lib/sizing-tables';

const [cmd='list',slug]=process.argv.slice(2);
if(cmd==='list'){
 for(const d of CALCULATORS){
  const info=releaseInfo(d),errors=d.examples.flatMap(ex=>checkExample(d,ex));
  console.log([d.slug.padEnd(32),d.tier,calcFingerprint(d),info.state.padEnd(16),TABLE_GATED.has(d.slug)?'táblázat':'',errors.length?'PÉLDAHIBA: '+errors.join('; '):'',info.reason].filter(Boolean).join('  '));
 }
 console.log('\nMéretezési táblázatok: '+reviewText());
}else if(cmd==='record'&&slug){
 const d=bySlug(slug);if(!d){console.error('Ismeretlen kalkulátor: '+slug);process.exit(1)}
 const fp=calcFingerprint(d);
 console.log(d.tier==='T0'
  ?`'${d.slug}':internal('${fp}'),`
  :`'${d.slug}':{kind:'lektoralt',reviewer:'<név>',qualification:'<minősítés, pl. MMK villamos tervező>',registry:'<névjegyzéki szám>',date:'<ÉÉÉÉ-HH-NN>',fingerprint:'${fp}',approvalRef:'<jóváhagyó e-mail / jegyzőkönyv azonosítója>'},`);
}else{console.error('Használat: scripts/calc-release.ts list | record <slug>');process.exit(1)}
