// Kalkulátormotor: számbevitel, formázás, URL, futtatás (fuzz), tulajdonságtesztek, registry, kiadási kapu, tervezői linkek, egyezés a Méretezés és a Fázisterhelés számításával.
// Futtatás: node_modules/.bin/tsx tests/calc.ts
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {parseNum,formatNum,formatSI,formatCompare,formatFixed,floorTo,decimalsFor} from '../lib/calc/number';
import {runCalc,defaultRaw,visibleFields,type CalcDef,type Raw} from '../lib/calc/core';
import {decodeState,encodeState} from '../lib/calc/url';
import {UNITS} from '../lib/calc/units';
import {CALCULATORS,CALC_CATEGORIES,bySlug,calcFingerprint,calcMeta,calcMetas,expertMeta,isPublished,publishedCalcs,releaseInfo,visibleCalcs} from '../lib/calc/registry';
import {RELEASES,T1_SLUGS,TABLE_GATED,type ExpertReview,type ReleaseRecord} from '../lib/calc/release';
import {REVIEW_DECL,REVIEW_FILE,calcSourceFiles,sourceFingerprint,sourceText} from '../scripts/calc-source';
import {calcHref,calcLinkable,calcQuery} from '../lib/kb/links';
import {calcSeoTitle} from '../lib/kb/categories';
import {SIZING_NOT_COVERED,voltageDropPercent,maxLengthForDrop,minSectionFor,loopResistance,maxLoopImpedance} from '../lib/sizing-formulas';
import {SIZING_REVIEW,tablesApproved,tablesFingerprint,temperatureFactor,groupingFactor} from '../lib/sizing-tables';
import {phaseLoad} from '../lib/phase-load';
import {seed,validatePlan} from '../lib/plan';

const out=(def:CalcDef,raw:Raw)=>{const r=runCalc(def,raw);assert.ok(r.ok,def.slug+' '+JSON.stringify(raw)+' → '+(r.ok?'':r.issues.map(i=>i.text).join('; ')));return r.out};
const val=(def:CalcDef,raw:Raw,id:string)=>out(def,raw).results.find(r=>r.id===id)!.value;
const near=(a:number,b:number,e=1e-9)=>assert.ok(Math.abs(a-b)<=e*Math.max(1,Math.abs(b)),a+' ≠ '+b);
// mulberry32 – determinisztikus véletlen
function rng(seed:number){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}

// ---------------------------------------------------------------- 1. parseNum (terv 10.6)
const ok=(s:string,v:number,opt={})=>{const r=parseNum(s,opt);assert.ok(r.ok&&r.value===v,JSON.stringify(s)+' → '+JSON.stringify(r))};
const bad=(s:string,opt={})=>{const r=parseNum(s,opt);assert.ok(!r.ok,JSON.stringify(s)+' elfogadva');return r.message};
ok('2,5',2.5);ok('2.5',2.5);ok('1 000',1000);ok('1\u00a0000',1000);ok('1\u202f000,5',1000.5);ok('1.234,5',1234.5);ok('1,234.5',1234.5);ok('1.500',1.5);
ok('1e3',1000);ok('2,5e-3',0.0025);ok('−3',-3,{allowNegative:true});ok(' 7 ',7);ok('.5',0.5);ok('0',0);
assert.equal(bad('abc'),'Csak számot írj; a mértékegységet mellette választhatod.');
assert.equal(bad('-1'),'Nem lehet negatív.');
assert.equal(bad(''),'Add meg az értéket.');
for(const s of ['10 00','1.234.567','1,2,3','2,5 V','1..2','1e','e3','++1','1-2'])bad(s);
assert.equal(bad('2,5',{integer:true}),'Egész számot adj meg.');
assert.equal(bad('0',{positive:true}),'Nullánál nagyobb számot adj meg.');
assert.match(bad('120',{max:100}),/^Legfeljebb 100 lehet\.$/);
// ---------------------------------------------------------------- 2. Formázás
assert.equal(formatNum(9976.61),'9976,6');assert.equal(formatNum(6570),'6570');assert.equal(formatNum(12345.6),'12\u00a0346');
assert.equal(formatNum(2.93009),'2,93');assert.equal(formatNum(0.68966),'0,6897');assert.equal(formatNum(-3.25),'−3,25');assert.equal(formatNum(NaN),'–');
assert.equal(formatSI(4700,'Ω'),'4,7\u00a0kΩ');assert.equal(formatSI(0.0123,'A'),'12,3\u00a0mA');assert.equal(formatSI(0,'W'),'0\u00a0W');
assert.deepEqual(formatCompare(5,5.0004),['5','5,0004']);assert.notEqual(...formatCompare(4.99999,5));
assert.equal(decimalsFor(1234),1);assert.equal(decimalsFor(12345),0);assert.equal(decimalsFor(0.01234),5);
// Kiírás: 1–10 között 4, 10 fölött 10 000-ig 5 értékes jegy (dokumentált viselkedés, terv 5.3: 9976,6 W; 10,197 LE).
assert.equal(formatNum(9.97712),'9,977');assert.equal(formatNum(12.34567),'12,346');assert.equal(formatNum(185.6712),'185,67');assert.equal(formatNum(123456.7),'123\u00a0457');
// Lebegőpontos zaj: félértéknél helyes kerekítés, lefelé kerekítés műtermék nélkül, SI-előtag határán nincs „1000 mΩ”, nagyon kicsi érték normálalakban.
assert.equal(formatFixed(18651.499999999996,0),'18\u00a0652');assert.equal(formatNum(139.99999999999997),'140');
assert.equal(floorTo(139.99999999999997,1),140);assert.equal(floorTo(39.93055,1),39.9);assert.equal(floorTo(140.278,1),140.2);
assert.equal(formatSI(1/(1+1e-6),'Ω'),'1\u00a0Ω');assert.equal(formatSI(0.9999996,'A'),'1\u00a0A');assert.equal(formatSI(999999.6,'Ω'),'1\u00a0MΩ');assert.equal(formatSI(999.4,'Ω'),'999,4\u00a0Ω');
assert.equal(formatSI(0.9999,'Ω',{sig:6}),'999,9\u00a0mΩ');assert.equal(formatSI(1.0001,'Ω',{sig:6}),'1,0001\u00a0Ω');
assert.equal(formatNum(5e-15),'5\u00b710\u207b\u00b9\u2075');assert.equal(formatNum(2.5e-7),'2,5\u00b710\u207b\u2077');assert.equal(formatNum(-9.99999e-7),'\u22121\u00b710\u207b\u2076');assert.equal(formatNum(0.0000012),'0,000001');

// ---------------------------------------------------------------- 3. Registry és definíciók
const slugs=CALCULATORS.map(c=>c.slug);
assert.equal(new Set(slugs).size,slugs.length,'egyedi slug');
assert.ok(slugs.every(s=>/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)),'ékezet nélküli, kötőjeles slug');
assert.equal(CALCULATORS.length,27);
assert.equal(CALCULATORS.filter(c=>c.tier==='T0').length,19);assert.equal(CALCULATORS.filter(c=>c.tier==='T1').length,8);
assert.equal(CALCULATORS.filter(c=>c.tier==='T2').length,0,'T2 kalkulátor (motor-kondenzátor, teljesítményigény) lektori jóváhagyás nélkül nem épülhet meg');
assert.ok(!bySlug('motor-kondenzator')&&!bySlug('teljesitmenyigeny'));
const FORBIDDEN=/szabványos|megfelel a szabványnak|garantáltan|szakmailag ellenőrzött|hivatalos vizsgakérdés|bárki elvégezheti|csináld magad|GFCI|\b120 V\b|60 Hz/i;
for(const d of CALCULATORS){
 const tag=d.slug;
 assert.ok(d.title.length<=60,tag+': cím ≤ 60');
 assert.ok(calcSeoTitle(d.title).length<=60,tag+': a kiadott <title> (sablonnal együtt) ≤ 60: '+calcSeoTitle(d.title));
 assert.ok(!/_/.test(d.short),tag+': a meta description (short) nem tartalmaz programozói alsóindex-jelölést');
 assert.ok(d.short.length>=80&&d.short.length<=160,tag+': a leírás 80–160 karakter ('+d.short.length+')');
 assert.ok(CALC_CATEGORIES.some(c=>c.id===d.category),tag+': kategória');
 assert.ok(d.keywords.length>=3&&d.sources.length>=1&&d.formulas.length>=1&&d.notes.good.length&&d.notes.bad.length,tag+': metaadat');
 assert.ok(d.examples.length>=2,tag+': legalább 2 példa');
 assert.ok(d.related.every(s=>!!bySlug(s)&&s!==d.slug),tag+': a kapcsolódó kalkulátorok léteznek');
 assert.ok(d.safety.includes('alap'),tag+': alapfigyelmeztetés');
 const ids=d.fields.map(f=>f.id);assert.equal(new Set(ids).size,ids.length,tag+': egyedi mezőazonosítók');
 for(const f of d.fields)if(f.showIf)assert.ok(d.fields.some(x=>x.id===f.showIf!.field&&x.kind==='select'),tag+'.'+f.id+': showIf választómezőre mutat');
 // Az alapállapot és minden példa számolható; a példák bemenete csak létező mezőre hivatkozik.
 assert.ok(runCalc(d,{}).ok,tag+': az alapértékekkel számol');
 for(const ex of d.examples)for(const k of Object.keys(ex.input))assert.ok(ids.includes(k.replace(/\.e$/,'')),tag+': ismeretlen példamező '+k);
 // Szóhasználat: T1-nél „számítás szerint”, soha nem „megfelel” vagy „szabványos”.
 const texts=[d.title,d.short,...d.formulas,...d.notes.good,...d.notes.bad,...(d.notCovered??[]),...d.examples.flatMap(ex=>{const r=runCalc(d,ex.input);return r.ok?[...r.out.results.map(x=>x.label+' '+(x.text??'')),...(r.out.issues??[]).map(i=>i.text),...(r.out.assumptions??[]),r.out.verdict?.text??'',...r.out.steps.map(s=>s.label+' '+s.result)]:[]})];
 for(const t of texts)assert.ok(!FORBIDDEN.test(t),tag+': tiltott kifejezés: '+t);
 if(d.tier!=='T0'){
  for(const t of texts)assert.ok(!/megfelel/i.test(t),tag+': T1-nél nincs „megfelel”: '+t);
  assert.ok(d.notCovered&&d.notCovered.length>=3,tag+': „nem vizsgált” lista');
  assert.ok(d.safety.includes('meretezes')||d.safety.includes('kalkulator'),tag+': T1 figyelmeztetés');
  for(const ex of d.examples){const r=runCalc(d,ex.input);if(r.ok&&r.out.verdict)assert.match(r.out.verdict.text,/^Számítás szerint/,tag+': verdikt')}
 }
 if(d.tables){
  // A méretezés teljes „nem vizsgált” listája; eltérni csak a kábeltételtől lehet, ha a kalkulátor maga kezeli a csökkentett
  // védővezetőt és 35 mm² felett nem enged bevitelt (Hurokimpedancia) – ekkor a saját változata szerepel.
  const missing=SIZING_NOT_COVERED.filter(x=>!d.notCovered?.includes(x));
  assert.ok(missing.every(x=>x.startsWith('alumínium vezető'))&&(!missing.length||d.notCovered!.some(x=>x.startsWith('alumínium vezető'))),tag+': a méretezés teljes „nem vizsgált” listája');
  assert.ok(d.safety.includes('meretezes'));
 }
 // A „Nem vizsgált” lista nem mondhat ellent a bevitelnek: ha 35 mm² feletti keresztmetszetet nem vizsgál, a keresztmetszet-mező
 // legfeljebb 35 mm²; ha a csökkentett PE-eret nem vizsgálja, nincs külön PE-keresztmetszet mező.
 const nc=(d.notCovered??[]).join(' | '),mm2=d.fields.filter(f=>f.kind==='number'&&f.unit==='mm²');
 if(/35 mm² feletti keresztmetszet/.test(nc))for(const f of mm2)assert.ok(f.kind==='number'&&f.max!==undefined&&f.max<=35,tag+'.'+f.id+': a „Nem vizsgált” lista szerint 35 mm² felett nem számol, a mező mégis enged');
 if(/csökkentett keresztmetszetű N- vagy PE-ér/.test(nc))assert.ok(!d.fields.some(f=>f.id==='Ape'),tag+': a csökkentett PE-eret nem vizsgálja, mégis külön A_PE mezője van');
}
// A kalkulátoronkénti kliensszigetek térképe minden definíciót lefed.
const islands=readFileSync('components/calc/islands/index.ts','utf8');
for(const s of slugs){assert.ok(islands.includes(`from './${s}'`),'sziget hiányzik: '+s);assert.match(readFileSync('components/calc/islands/'+s+'.tsx','utf8'),new RegExp(`from '@/lib/calc/defs/${s}'`))}
assert.equal(readdirSync('lib/calc/defs').filter(f=>f.endsWith('.ts')).length,slugs.length,'minden def a registryben');

// ---------------------------------------------------------------- 4. Kiadási kapu (egyetlen konfigurációs pont: lib/calc/release.ts)
// Az elvárt állapotot a RELEASES táblából vezetjük le (nem beégetett listából): egy T1 kiadásához csak a release.ts-t kell szerkeszteni.
const T0=CALCULATORS.filter(c=>c.tier==='T0'),T1=CALCULATORS.filter(c=>c.tier==='T1');
assert.deepEqual([...T1_SLUGS].sort(),T1.map(c=>c.slug).sort(),'a release.ts T1_SLUGS listája a definíciók T1 szintjével egyezik');
for(const s of TABLE_GATED)assert.ok(bySlug(s)?.tables,s+': táblázatalapú');
// Minden táblázatértéket használó kalkulátor (tables: true) táblázat-kapus: a felhasznált értékeket a lektori csomag 1. része fedi.
assert.deepEqual([...TABLE_GATED].sort(),CALCULATORS.filter(c=>c.tables&&c.tier!=='T0').map(c=>c.slug).sort());
// Minden rekord: ismert kalkulátor, egyező tartalmi és forrás-ujjlenyomat (különben: újra kell ellenőrizni / lektoráltatni –
// node_modules/.bin/tsx scripts/calc-release.ts list), T1-hez csak lektori rekord.
for(const [slug,rec] of Object.entries(RELEASES)){
 const d=bySlug(slug);assert.ok(d,'ismeretlen rekord: '+slug);
 assert.equal(rec.fingerprint,calcFingerprint(d!),slug+': az ujjlenyomat eltér – a tartalom a jóváhagyás óta változott');
 assert.equal(rec.source,sourceFingerprint(slug),slug+': a forrás-ujjlenyomat eltér – a számítás kódja (definíció vagy importált modul) a jóváhagyás óta változott ('+calcSourceFiles(slug).join(', ')+')');
 if(d!.tier!=='T0')assert.equal(rec.kind,'lektoralt',slug+': T1-hez lektori rekord kell');
 if(rec.kind==='lektoralt'){
  assert.ok(rec.qualification.trim()&&rec.approvalRef.trim()&&/^\d{4}-\d{2}-\d{2}$/.test(rec.date)&&!/[<>]/.test(rec.qualification+rec.approvalRef+(rec.reviewer??'')+(rec.registry??'')),slug+': a lektori rekord kitöltött (jogosultság, dátum, hivatkozás)');
  // Adatvédelem: a release.ts a kliensoldali kódba is bekerül – név és névjegyzéki szám csak a megjelenítéshez adott hozzájárulással.
  if(rec.showName===true)assert.ok(rec.reviewer?.trim()&&rec.registry?.trim(),slug+': hozzájárulással a név és a névjegyzéki szám kitöltött');
  else assert.ok(!rec.reviewer?.trim()&&!rec.registry?.trim(),slug+': hozzájárulás (showName: true) nélkül a lektor neve és névjegyzéki száma nem szerepelhet a release.ts-ben');
 }
}
// A forrás-ujjlenyomatból csak a SIZING_REVIEW-blokk (a táblázatjóváhagyás adatai) marad ki: a jóváhagyás rögzítése nem
// érvényteleníti a táblázatokat használó kalkulátorok lektori rekordját; minden más változás (a sablonszövegek is) igen.
{
 const src=readFileSync(REVIEW_FILE,'utf8'),at=src.indexOf(REVIEW_DECL);assert.ok(at>0,'a SIZING_REVIEW deklarációja megtalálható');
 const end=src.indexOf('};',at)+2,approvedDecl=REVIEW_DECL+`{
 status:'jóváhagyott',
 qualification:'épületvillamossági tervező (MMK)',date:'2026-11-01',fingerprint:'0123abcd',showName:true,reviewer:'Minta Tervező',registry:'00-0000',
 approvalRef:'Lektori csomag LK-3 {kapcsos} zárójellel; "idézet" és \\'aposztróf\\'',note:'megjegyzés'
};`;
 const approvedSrc=src.slice(0,at)+approvedDecl+src.slice(end);
 assert.notEqual(approvedSrc,src);assert.equal(sourceText(REVIEW_FILE,approvedSrc),sourceText(REVIEW_FILE,src),'a jóváhagyás rögzítése nem változtatja a forrás-ujjlenyomatot');
 assert.notEqual(sourceText(REVIEW_FILE,src.replace('A táblázatértékeket szakmailag lektorálta','A táblázatértékeket lektorálta')),sourceText(REVIEW_FILE,src),'a megjelenő szöveg sablonja része a lenyomatnak');
 assert.notEqual(sourceText(REVIEW_FILE,src.replace('cmin:1,','cmin:0.95,')),sourceText(REVIEW_FILE,src),'a táblázatértékek részei a lenyomatnak');
 assert.equal(sourceText('lib/calc/core.ts','a\r\nb'),'a\nb','más fájl: csak a sorvég egységesül');
 assert.equal(sourceText(REVIEW_FILE,src+'\n'+REVIEW_DECL+'{};'),src+'\n'+REVIEW_DECL+'{};','kétszeres deklarációnál a teljes szöveg marad');
 assert.ok(calcSourceFiles('keresztmetszet').includes(REVIEW_FILE)&&!calcSourceFiles('motor-aram').includes(REVIEW_FILE));
}
const expectedState=(d:CalcDef)=>{
 const rec=RELEASES[d.slug];
 if(!rec)return 'kiadatlan';
 if(d.tier==='T1'&&rec.kind!=='lektoralt')return 'kiadatlan';
 if(TABLE_GATED.has(d.slug)&&!tablesApproved())return 'tablazatra-var';
 return 'kozzeteve';
};
// A feladat szerint minden T0 közzétett („Belsőleg ellenőrizve” vagy lektorált).
for(const d of T0){assert.equal(releaseInfo(d).state,'kozzeteve',d.slug+': T0 közzétéve ('+releaseInfo(d).reason+')');assert.match(releaseInfo(d).badge,/^(Belsőleg ellenőrizve|Szakmailag lektorálta: )/)}
for(const d of CALCULATORS)assert.equal(releaseInfo(d).state,expectedState(d),d.slug+': kiadási állapot a RELEASES szerint');
const expectedPublished=CALCULATORS.filter(d=>expectedState(d)==='kozzeteve');
assert.deepEqual(publishedCalcs().map(c=>c.slug),expectedPublished.map(c=>c.slug));
// A kapu viselkedése szintetikus rekordokkal.
const fesz=bySlug('feszultseges')!,ker=bySlug('keresztmetszet')!,ohm=bySlug('ohm-torveny')!,motor=bySlug('motor-aram')!;
const expert=(d:CalcDef,fp=calcFingerprint(d)):ReleaseRecord=>({kind:'lektoralt',qualification:'villamos tervező',date:'2026-11-01',fingerprint:fp,source:sourceFingerprint(d.slug),approvalRef:'Lektori csomag LK-9'});
const named=(d:CalcDef):ExpertReview=>({...(expert(d) as ExpertReview),showName:true,reviewer:'Teszt Elek',registry:'00-0000'});
const inner=(d:CalcDef):ReleaseRecord=>({kind:'belso',by:'teszt',date:'2026-11-01',fingerprint:calcFingerprint(d),source:sourceFingerprint(d.slug),note:''});
assert.equal(releaseInfo(fesz,{feszultseges:inner(fesz)}).state,'kiadatlan','T1 belső ellenőrzéssel nem adható ki');
assert.equal(releaseInfo(fesz,{feszultseges:expert(fesz)},true).state,'kozzeteve','T1 lektori jóváhagyással kiadható');
assert.equal(releaseInfo(fesz,{feszultseges:expert(fesz)},false).state,'tablazatra-var','a Feszültségesés is táblázat-kapus (ρ1, λ, U0, G.52.1)');
assert.equal(releaseInfo(fesz,{feszultseges:named(fesz)},true).badge,'Szakmailag lektorálta: Teszt Elek, villamos tervező · 2026-11-01','név csak hozzájárulással');
assert.equal(releaseInfo(fesz,{feszultseges:expert(fesz)},true).badge,'Szakmailag lektorálta: villamos tervező · 2026-11-01','hozzájárulás nélkül a jogosultság');
assert.equal(releaseInfo(fesz,{feszultseges:{...named(fesz),reviewer:''}},true).badge,'Szakmailag lektorálta: villamos tervező · 2026-11-01','név nélkül a hozzájárulás sem jelenít meg nevet');
assert.equal(expertMeta(named(fesz)),'Szakmai lektor: Teszt Elek, villamos tervező');assert.equal(expertMeta(expert(fesz) as ExpertReview),'Szakmai lektor: villamos tervező');
// A kalkulátorlista (hub) és a kereső jelvénye hozzájárulással is név nélküli: a név csak a kalkulátor saját oldalán jelenik meg.
assert.equal(calcMeta(fesz,false,{feszultseges:named(fesz)},true).note,'Szakmailag lektorálta: villamos tervező · 2026-11-01');
assert.equal(calcMeta(fesz,false,{feszultseges:named(fesz)},true).status,'kozzeteve');
assert.equal(releaseInfo(fesz,{feszultseges:expert(fesz,'deadbeef')}).state,'ujraellenorzendo','módosult tartalom → újra kell lektorálni');
assert.equal(releaseInfo(ker,{keresztmetszet:expert(ker)},false).state,'tablazatra-var','táblázatalapú T1: tablesApproved() is kell');
assert.equal(releaseInfo(ker,{keresztmetszet:expert(ker)},true).state,'kozzeteve');
assert.equal(releaseInfo(ohm,{}).state,'kiadatlan');
assert.equal(releaseInfo({...ohm,version:2}).state,'ujraellenorzendo','verzióemelés → új ellenőrzés');
assert.equal(releaseInfo({...ohm,tier:'T2'}).state,'tiltott');
assert.equal(tablesApproved(),SIZING_REVIEW.status==='jóváhagyott'&&SIZING_REVIEW.fingerprint===tablesFingerprint(),'a táblázatkapu állapota a SIZING_REVIEW szerint');
// A tervezői link (links.ts) ugyanezt a szabályt követi a definíciók nélkül: T1-hez lektori rekord kell, a táblázatalapúhoz tablesApproved().
assert.equal(calcLinkable('motor-aram',{'motor-aram':inner(motor)}),false,'T1 belső rekorddal nem kap tervezői linket');
assert.equal(calcLinkable('motor-aram',{'motor-aram':expert(motor)}),true);
assert.equal(calcLinkable('keresztmetszet',{keresztmetszet:expert(ker)},false),false);assert.equal(calcLinkable('keresztmetszet',{keresztmetszet:expert(ker)},true),true);
assert.equal(calcLinkable('ohm-torveny',{'ohm-torveny':inner(ohm)}),true);assert.equal(calcLinkable('ohm-torveny',{}),false);
// Hub-metaadat: a kiadatlan kalkulátor link nélküli „Hamarosan” kártya; előnézetben tervezet.
for(const d of CALCULATORS.filter(d=>expectedState(d)!=='kozzeteve')){const m=calcMeta(d);assert.equal(m.href,null,d.slug);assert.equal(m.status,'hamarosan');assert.match(m.note,/^Hamarosan – /);assert.equal(!!m.detail,TABLE_GATED.has(d.slug)&&!tablesApproved())}
for(const d of expectedPublished){const m=calcMeta(d);assert.equal(m.href,'/kalkulatorok/'+d.slug);assert.equal(m.status,'kozzeteve')}
if(expectedState(fesz)==='kiadatlan'){assert.equal(calcMeta(fesz).note,'Hamarosan – szakmai lektorálás alatt');assert.equal(calcMeta(fesz,true).status,'tervezet');assert.equal(calcMeta(fesz,true).href,'/kalkulatorok/feszultseges')}
assert.equal(visibleCalcs(false).length,expectedPublished.length);assert.equal(visibleCalcs(true).length,27);assert.equal(calcMetas().length,27);
// Statikus oldalak és sitemap: csak a közzétettek (az oldal és a sitemap ugyanazt a publishedCalcs/visibleCalcs-t használja).
const page=readFileSync('app/(kezikonyv)/kalkulatorok/[slug]/page.tsx','utf8'),sitemap=readFileSync('app/sitemap.ts','utf8');
assert.match(page,/export function generateStaticParams\(\)\{return visibleCalcs\(kbPreview\(\)\)/);assert.match(page,/export const dynamicParams=false/);assert.match(page,/export const dynamic='force-static'/);assert.match(page,/export const revalidate=3600/);
assert.match(sitemap,/publishedCalcs\(\)/);
// ---------------------------------------------------------------- 5. Tervezői linkek (lib/kb/links.ts): csak közzétett célra
for(const d of CALCULATORS)assert.equal(calcLinkable(d.slug),isPublished(d),d.slug+': a tervezői link és a közzététel egyezik');
for(const d of CALCULATORS)assert.equal(calcHref(d.slug)!==null,expectedState(d)==='kozzeteve',d.slug+': calcHref');
assert.equal(calcHref('nincs-ilyen'),null);
if(expectedState(fesz)!=='kozzeteve')assert.equal(calcHref('feszultseges',{I:16}),null);
assert.equal(calcHref('fazisterheles',{mod:'W',P1:600,P2:400.5,P3:0}),'/kalkulatorok/fazisterheles?mod=W&P1=600&P2=400,5&P3=0');
assert.equal(calcQuery({a:2.5,b:'x;y',c:undefined}),'?a=2,5&b=x;y');
console.log('Kiadási állapot: '+expectedPublished.length+' közzétett ('+T0.length+' T0, '+expectedPublished.filter(d=>d.tier==='T1').length+' T1); kiadatlan: '+CALCULATORS.filter(d=>expectedState(d)!=='kozzeteve').map(d=>d.slug).join(', '));

// ---------------------------------------------------------------- 6. URL oda-vissza (veszteségmentes)
const r=rng(42);
for(const d of CALCULATORS){
 for(let i=0;i<40;i++){
  const raw:Raw=defaultRaw(d);
  for(const f of d.fields){
   if(f.kind==='select')raw[f.id]=f.options[Math.floor(r()*f.options.length)].value;
   else if(f.kind==='number')raw[f.id]=r()<0.1?'':(r()*1000).toFixed(Math.floor(r()*3)).replace('.',r()<0.5?',':'.');
   else if(f.kind==='list')raw[f.id]=Array.from({length:2+Math.floor(r()*4)},()=>(1+r()*100).toFixed(1).replace('.',',')).join('; ');
   else raw[f.id]=Array.from({length:1+Math.floor(r()*4)},()=>f.columns.map(()=>(r()*20).toFixed(1).replace('.',',')).join('*')).join(';');
   if((f.kind==='number'||f.kind==='list')&&f.units&&r()<0.5){const us=UNITS[f.units];raw[f.id+'.e']=us[Math.floor(r()*us.length)].id}
  }
  const back={...defaultRaw(d),...decodeState(d,encodeState(d,raw))};
  for(const f of visibleFields(d,raw)){assert.equal(back[f.id],f.kind==='select'?raw[f.id]:(raw[f.id]??'').trim(),d.slug+'.'+f.id);if((f.kind==='number'||f.kind==='list')&&f.units&&(raw[f.id]??'').trim())assert.equal(back[f.id+'.e'],raw[f.id+'.e'],d.slug+'.'+f.id+'.e')}
  assert.deepEqual(runCalc(d,back),runCalc(d,raw),d.slug+': az URL-ből visszaállított állapot ugyanazt adja');
 }
}
// Ismeretlen, túl hosszú vagy érvénytelen paraméter eldobva.
assert.deepEqual(decodeState(ohm,'?x=1&U='+'9'.repeat(41)+'&ismert=XX&U.e=GV'),{});
assert.deepEqual(decodeState(ohm,'?ismert=PU&P=60&P.e=kW&U=230'),{ismert:'PU',P:'60','P.e':'kW',U:'230'});
assert.equal(encodeState(bySlug('feszultseges')!,{rendszer:'1f',I:'16',L:'23,4',A:'2,5'}),'?rendszer=1f&I=16&L=23,4&L.e=m&A=2,5&cos=1&hatar=public-other');

// ---------------------------------------------------------------- 7. Fuzz: soha nem dob, NaN/Infinity nem jut ki, a hiba magyar
const junk=['','abc','-','1e999','NaN','Infinity','−0','0','1,2,3',';;;','**','9'.repeat(30),'-5','1e-300','<script>','0,0001','1e9'];
const rf=rng(7);let runs=0;
for(const d of CALCULATORS)for(let i=0;i<300;i++){
 const raw:Raw={};
 for(const f of d.fields){
  if(f.kind==='select')raw[f.id]=rf()<0.9?f.options[Math.floor(rf()*f.options.length)].value:'xx';
  else raw[f.id]=rf()<0.5?junk[Math.floor(rf()*junk.length)]:String(+(rf()*10**Math.floor(rf()*6-2)).toPrecision(3));
  if(f.kind==='rows'&&rf()<0.5)raw[f.id]=Array.from({length:Math.floor(rf()*60)},()=>junk[Math.floor(rf()*junk.length)]+'*'+rf()*30).join(';');
 }
 const res=runCalc(d,raw);runs++;
 if(res.ok){for(const x of res.out.results)assert.ok(Number.isFinite(x.value),d.slug+' '+x.id+' nem véges');assert.ok(!JSON.stringify(res.out).match(/NaN|Infinity|undefined/),d.slug+': NaN/undefined a kimenetben '+JSON.stringify(raw))}
 else assert.ok(res.issues.length&&res.issues.every(i=>/[áéíóöőúüű]|[A-Z]/.test(i.text)&&!/undefined|NaN/.test(i.text)),d.slug+': magyar hibaüzenet');
}

// ---------------------------------------------------------------- 8. Tulajdonságtesztek (10 000 seed)
const P=rng(2026);const ohmD=bySlug('ohm-torveny')!,eredo=bySlug('eredo-ellenallas')!,meddo=bySlug('latszolagos-meddo-teljesitmeny')!;
for(let i=0;i<10000;i++){
 const U=+(0.1+P()*1000).toPrecision(6),R=+(0.1+P()*10000).toPrecision(6);
 // Ohm oda-vissza: U, R → I → (I, R) → U
 const I=val(ohmD,{ismert:'UR',U:String(U),R:String(R)},'I');
 near(val(ohmD,{ismert:'IR',I:String(I),R:String(R)},'U'),U,1e-12*1e3);
 // Soros ≥ max, párhuzamos ≤ min
 const list=Array.from({length:2+Math.floor(P()*5)},()=>+(0.5+P()*1000).toPrecision(4));
 const s=val(eredo,{mod:'soros',R:list.join('; ')},'Re'),p=val(eredo,{mod:'parhuzamos',R:list.join('; ')},'Re');
 assert.ok(s>=Math.max(...list)-1e-9&&p<=Math.min(...list)+1e-9,'soros ≥ max, párhuzamos ≤ min');
 // S² = P² + Q²
 const Pw=+(P()*1e4).toPrecision(5),Q=+(P()*1e4).toPrecision(5);
 if(Pw+Q>0){const o=out(meddo,{mod:'PQ',P:String(Pw),'P.e':'W',Q:String(Q),'Q.e':'var'}),S=o.results.find(x=>x.id==='S')!.value;near(S*S,Pw*Pw+Q*Q,1e-9)}
 // ΔU monoton a hosszban és az áramban
 const L=1+P()*200,Ia=1+P()*60,A=[1.5,2.5,4,6,10][Math.floor(P()*5)],c=0.5+P()*0.5;
 const d1=voltageDropPercent({b:2,length:L,current:Ia,section:A,cosPhi:c}),d2=voltageDropPercent({b:2,length:L*1.1,current:Ia,section:A,cosPhi:c}),d3=voltageDropPercent({b:2,length:L,current:Ia*1.1,section:A,cosPhi:c});
 assert.ok(d2>d1&&d3>d1,'ΔU monoton');
}
// ---------------------------------------------------------------- 9. Egyezés a tervező számításaival
// Feszültségesés = a Méretezés fül képlete (lib/sizing-formulas.ts), 2,930 %.
near(val(fesz,{rendszer:'1f',I:'16',L:'23,4',A:'2,5',cos:'1'},'pct'),voltageDropPercent({b:2,length:23.4,current:16,section:2.5,cosPhi:1}));
near(voltageDropPercent({b:2,length:23.4,current:16,section:2.5,cosPhi:1}),2.930086956521739,1e-12);
near(val(fesz,{rendszer:'3f',I:'32',L:'50',A:'6',cos:'0,9'},'Lmax'),maxLengthForDrop(5,1,32,6,0.9));
// Keresztmetszet = minSectionFor; hurokimpedancia = loopResistance + maxLoopImpedance.
for(const [In,m,n,amb,g] of [[20,'B2',2,30,1],[20,'B2',2,30,3],[32,'C',3,30,1],[25,'A1',2,40,2]] as const)
 assert.equal(val(ker,{In:String(In),mod:m,szig:'PVC',erek:String(n),temp:String(amb),csop:String(g)},'A'),minSectionFor(In,m,'PVC',n,temperatureFactor('PVC',amb).value,groupingFactor(g).value));
const hur=bySlug('hurokimpedancia')!;
near(val(hur,{Ze:'0,35',L:'25',A:'2,5',gorbe:'B',In:'16'},'Zs'),0.35+loopResistance(25,2.5));near(val(hur,{Ze:'0,35',L:'25',A:'2,5',gorbe:'C',In:'16'},'ZsMax'),maxLoopImpedance('C',16));
// Fázisterhelés = a tervező phaseLoad-ja a mintatervre.
const plan=validatePlan(structuredClone(seed)),pl=phaseLoad(plan,'house');
const fz=out(bySlug('fazisterheles')!,{mod:'W',P1:String(pl.phases.L1.watts),P2:String(pl.phases.L2.watts),P3:String(pl.phases.L3.watts)});
near(fz.results.find(x=>x.id==='imbalance')!.value,pl.imbalance);near(fz.results.find(x=>x.id==='total')!.value,pl.total);
near(fz.results.find(x=>x.id==='I1')!.value,pl.phases.L1.current);
// A tervező mélylinkje ugyanezt nyitja meg (előtöltve).
const link=calcHref('fazisterheles',{mod:'W',P1:pl.phases.L1.watts,P2:pl.phases.L2.watts,P3:pl.phases.L3.watts})!;
near(runCalc(bySlug('fazisterheles')!,{...defaultRaw(bySlug('fazisterheles')!),...decodeState(bySlug('fazisterheles')!,link.slice(link.indexOf('?')))}).ok?val(bySlug('fazisterheles')!,decodeState(bySlug('fazisterheles')!,link.slice(link.indexOf('?'))),'imbalance'):NaN,pl.imbalance);

// ---------------------------------------------------------------- 10. Ellenőrzési észrevételek regressziója (4. kör)
const errText=(slug:string,raw:Raw)=>{const r=runCalc(bySlug(slug)!,raw);assert.ok(!r.ok,slug+' '+JSON.stringify(raw)+': hibát kellett volna adnia');return r.issues.map(i=>i.text).join(' ')};
const res=(slug:string,raw:Raw)=>out(bySlug(slug)!,raw);
const txt=(slug:string,raw:Raw,id:string)=>res(slug,raw).results.find(x=>x.id===id)!.text!;
const stepText=(o:ReturnType<typeof out>)=>o.steps.map(s=>s.label+' '+s.formula+' '+s.substituted+' '+s.result).join('\n');
// LED: az egzakt UR = 0 lebegőpontosan sem ad értelmetlen (pikoohmos) eredményt.
assert.match(errText('led-elotet-ellenallas',{Us:'9,9',Uf:'3,3',I:'20','I.e':'mA',n:'3'}),/nincs mire méretezni/);
assert.match(errText('led-elotet-ellenallas',{Us:'0,9',Uf:'0,3',I:'20','I.e':'mA',n:'3'}),/nincs mire méretezni/);
assert.match(errText('led-elotet-ellenallas',{Us:'13,8',Uf:'2,76',I:'20','I.e':'mA',n:'5'}),/nincs mire méretezni/);
// LED-fuzz: századvoltos bemenetre, ha az egzakt UR = 0, mindig hiba; ha UR ≥ 0,01 V, mindig eredmény.
{const L=rng(99);for(let i=0;i<20000;i++){const n=1+Math.floor(L()*8),uf=Math.round(100+L()*300),us=Math.round(n*uf+(L()<0.5?0:L()*300-150));if(us<=0)continue;const r=runCalc(bySlug('led-elotet-ellenallas')!,{Us:(us/100).toFixed(2).replace('.',','),Uf:(uf/100).toFixed(2).replace('.',','),I:'20','I.e':'mA',n:String(n)});assert.equal(r.ok,us>n*uf,us+' / '+n+' × '+uf)}}
// Eredő ellenállás, hiányzó tag: relatív küszöb – az egyenlőség hiba, a nagy ellenállású valós eset nem.
assert.match(errText('eredo-ellenallas',{mod:'hianyzo',Re:'0,1','Re.e':'ohm',Rk:Array(9).fill('0,9').join(';'),'Rk.e':'ohm'}),/nem lehet nagyobb vagy egyenlő/);
assert.match(errText('eredo-ellenallas',{mod:'hianyzo',Re:'0,0375','Re.e':'ohm',Rk:Array(8).fill('0,3').join(';'),'Rk.e':'ohm'}),/nem lehet nagyobb vagy egyenlő/);
near(val(bySlug('eredo-ellenallas')!,{mod:'hianyzo',Re:'999900','Re.e':'Mohm',Rk:'1000000','Rk.e':'Mohm'},'Rx'),9.999e15,1e-6);
{const E=rng(5);const units=[['ohm',1],['mohm',1e-3],['kohm',1e3],['Mohm',1e6]] as const;for(let i=0;i<5000;i++){const n=2+Math.floor(E()*18),[ue]=units[Math.floor(E()*4)],R=+(0.1+E()*999).toPrecision(3),Re=R/n;const r=runCalc(bySlug('eredo-ellenallas')!,{mod:'hianyzo',Re:String(Re),'Re.e':ue,Rk:Array(n).fill(String(R)).join(';'),'Rk.e':ue});if(String(Re).length<=40)assert.ok(!r.ok,'egyenlőség: '+n+' × '+R+' '+ue)}}
// Transzformátor: háromfázisú módban nincs (kapcsolási csoporttól függő) menetszám.
assert.ok(!res('transzformator',{rendszer:'3f',U1:'10','U1.e':'kV',U2:'400',S:'100','S.e':'kVA',N1:'1000'}).results.some(x=>x.id==='N2'));
near(val(bySlug('transzformator')!,{rendszer:'1f',U1:'230',U2:'12',S:'60',N1:'1000'},'N2'),1000*12/230);
// Lmax: lefelé kerekítve, lebegőpontos műtermék nélkül, a levezetéssel összhangban.
assert.equal(txt('hurokimpedancia',{Ze:'0,4',L:'10',A:'1,5',gorbe:'B',In:'10'},'Lmax'),'140\u00a0m');
assert.equal(txt('hurokimpedancia',{Ze:'0,35',L:'25',A:'2,5',gorbe:'B',In:'16'},'Lmax'),'140,2\u00a0m (lefelé kerekítve)');
assert.match(stepText(res('hurokimpedancia',{Ze:'0,35',L:'25',A:'2,5',gorbe:'B',In:'16'})),/140,28\u00a0m → lefelé kerekítve 140,2\u00a0m/);
assert.match(stepText(res('hurokimpedancia',{Ze:'3',L:'25',A:'2,5',gorbe:'B',In:'16'})),/Lmax = max\(0; \(2,875/);
assert.equal(txt('feszultseges',{rendszer:'1f',I:'16',L:'23,4',A:'2,5',cos:'1',hatar:'public-other'},'Lmax'),'39,9\u00a0m (lefelé kerekítve)');
// Fogyasztás: félértékhatáron helyes kerekítés; havi lépések.
assert.equal(txt('fogyasztas-koltseg',{sorok:'2000*0,25*1;60*5*3',ar:'36,5'},'ft_ev'),'18\u00a0652\u00a0Ft');
assert.match(stepText(res('fogyasztas-koltseg',{sorok:'2000*0,25*1',ar:'36'})),/E_hó = 182,5\u00a0kWh \/ 12[\s\S]*K_hó = /);
// Eredő ellenállás: az előtag határán nincs „1000 mΩ”.
assert.equal(txt('eredo-ellenallas',{mod:'parhuzamos',R:'1; 1000000','R.e':'ohm'},'Re'),'1\u00a0Ω');
// Fázisterhelés: teljesen behelyettesített levezetés, egységes %-írás, W módban a cos φ = 1 feltételezés.
{const o=res('fazisterheles',{mod:'A',L1:'16',L2:'8',L3:'8'}),t=stepText(o);
 assert.match(t,/L1: 16\u00a0A · 230 V/);assert.match(t,/max\(1,227\u00a0kW; 613,33\u00a0W; 613,33\u00a0W\)/);assert.match(t,/1,227\u00a0kW \/ 2,453\u00a0kW · 100/);
 assert.match(t,/√\(16² \+ 8² \+ 8² − 16·8 − 8·8 − 8·16\)/);assert.ok(!/…|max eltérés/.test(t),t);
 assert.match(o.issues![0].text,/50\u00a0% \(tájékoztató határ: 20\u00a0%\)/);
 assert.ok(res('fazisterheles',{mod:'W',P1:'2300',P2:'0',P3:'0'}).assumptions!.some(a=>/cos φ = 1/.test(a)));}
// Hőmérséklet: egységenként behelyettesített levezetés.
assert.match(stepText(res('homerseklet',{mod:'atvaltas',T:'212',egyseg:'F'})),/°C = \(212\u00a0°F − 32\) · 5\/9[\s\S]*K = 100\u00a0°C \+ 273,15/);
assert.match(stepText(res('homerseklet',{mod:'atvaltas',T:'20',egyseg:'C'})),/K = 20\u00a0°C \+ 273,15/);
assert.match(stepText(res('homerseklet',{mod:'atvaltas',T:'300',egyseg:'K'})),/°C = 300\u00a0K − 273,15/);
// AWG: negatív szám zárójelben, unicode mínusszal.
assert.match(stepText(res('mertekegyseg-atvalto',{mod:'awg',awg:'-3'})),/\(36 − \(−3\)\) \/ 39/);
// Feszültségosztó: az E24-lépés számokkal.
assert.match(stepText(res('feszultsegoszto',{mod:'r2',Ube:'12',R1:'10','R1.e':'kohm',Uki:'3,3'})),/Uki = 12\u00a0V · 3,9\u00a0kΩ \/ \(10\u00a0kΩ \+ 3,9\u00a0kΩ\)/);
// Színkód: IEC 60062:2016 tűrésszínek, a tűréssáv a tűréshez illő pontossággal.
{const o=res('ellenallas-szinkod',{savok:'5',s1:'barna',s2:'fekete',s3:'fekete',szorzo:'ezust',tures:'szurke'});
 assert.equal(o.results.find(x=>x.id==='min')!.text,'999,9\u00a0mΩ');assert.equal(o.results.find(x=>x.id==='max')!.text,'1,0001\u00a0Ω');}
assert.deepEqual(['narancs','sarga','szurke'].map(c=>val(bySlug('ellenallas-szinkod')!,{savok:'4',s1:'barna',s2:'fekete',szorzo:'fekete',tures:c},'tol')),[0.05,0.02,0.01]);
// LED-szalag: a betáplálási javaslat a tényleges feszültséggel; tápegység nélkül a szükséges teljesítmény a fő eredmény.
assert.match(res('led-szalag-tapegyseg',{L:'6',pm:'4,8',U:'5',r:'20'}).issues!.map(i=>i.text).join(' '),/5\u00a0V-os szalagnál jellemzően 1–2 m-enként/);
assert.ok(!/12 V-os|24 V-os/.test(res('led-szalag-tapegyseg',{L:'12',pm:'10',U:'48',r:'20'}).issues!.map(i=>i.text).join(' ')));
assert.deepEqual(res('led-szalag-tapegyseg',{L:'50',pm:'14,4',U:'24',r:'20'}).results.filter(x=>x.primary).map(x=>x.id),['Pmin']);
// Akkumulátor: nagyon kicsi üzemidő nem „0 h (0 perc)”.
assert.match(txt('akkumulator-uzemido',{C:'1','C.e':'mAh',U:'1',dod:'1',eta:'0,05',P:'100','P.e':'MW'},'t'),/10⁻¹⁵\u00a0h \(kevesebb mint 1 perc\)/);
// Minden példa levezetése behelyettesített: nincs „…” és szöveges számláló, minden behelyettesítésben van szám.
for(const d of CALCULATORS)for(const ex of d.examples){const r=runCalc(d,ex.input);if(!r.ok)continue;for(const st of r.out.steps){assert.ok(!/…/.test(st.substituted),d.slug+': „…” a behelyettesítésben: '+st.substituted);assert.match(st.substituted,/\d/,d.slug+': behelyettesítés szám nélkül: '+st.label)}}

console.log('PASS: parseNum/formázás, '+CALCULATORS.length+' definíció ellenőrzése (szóhasználat, metaadat, szigetek), kiadási kapu (állapot a RELEASES-ből, T0 közzétéve, tartalmi és forrás-ujjlenyomat, T1 csak lektori rekorddal, táblázat-kapu, T2 tiltva), tervezői linkek, URL oda-vissza, '+runs+' fuzz-futás, 10 000 seedes tulajdonságteszt, egyezés a Méretezés és a Fázisterhelés számításával, a 4. ellenőrzési kör regressziói.');
