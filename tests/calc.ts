// Kalkulátormotor: számbevitel, formázás, URL, futtatás (fuzz), tulajdonságtesztek, registry, kiadási kapu, tervezői linkek, egyezés a Méretezés és a Fázisterhelés számításával.
// Futtatás: node_modules/.bin/tsx tests/calc.ts
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {parseNum,formatNum,formatSI,formatCompare,decimalsFor} from '../lib/calc/number';
import {runCalc,defaultRaw,visibleFields,type CalcDef,type Raw} from '../lib/calc/core';
import {decodeState,encodeState} from '../lib/calc/url';
import {UNITS} from '../lib/calc/units';
import {CALCULATORS,CALC_CATEGORIES,bySlug,calcFingerprint,calcMeta,calcMetas,isPublished,publishedCalcs,releaseInfo,visibleCalcs} from '../lib/calc/registry';
import {RELEASES,TABLE_GATED,type ReleaseRecord} from '../lib/calc/release';
import {calcHref,calcLinkable,calcQuery} from '../lib/kb/links';
import {SIZING_NOT_COVERED,voltageDropPercent,maxLengthForDrop,minSectionFor,loopResistance,maxLoopImpedance} from '../lib/sizing-formulas';
import {tablesApproved,temperatureFactor,groupingFactor} from '../lib/sizing-tables';
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
 if(d.tables){assert.ok(SIZING_NOT_COVERED.every(x=>d.notCovered?.includes(x)),tag+': a méretezés teljes „nem vizsgált” listája');assert.ok(d.safety.includes('meretezes'))}
}
// A kalkulátoronkénti kliensszigetek térképe minden definíciót lefed.
const islands=readFileSync('components/calc/islands/index.ts','utf8');
for(const s of slugs){assert.ok(islands.includes(`from './${s}'`),'sziget hiányzik: '+s);assert.match(readFileSync('components/calc/islands/'+s+'.tsx','utf8'),new RegExp(`from '@/lib/calc/defs/${s}'`))}
assert.equal(readdirSync('lib/calc/defs').filter(f=>f.endsWith('.ts')).length,slugs.length,'minden def a registryben');

// ---------------------------------------------------------------- 4. Kiadási kapu (egyetlen konfigurációs pont: lib/calc/release.ts)
const T0=CALCULATORS.filter(c=>c.tier==='T0'),T1=CALCULATORS.filter(c=>c.tier==='T1');
for(const d of T0){assert.equal(releaseInfo(d).state,'kozzeteve',d.slug+': T0 közzétéve ('+releaseInfo(d).reason+')');assert.equal(releaseInfo(d).badge,'Belsőleg ellenőrizve')}
for(const d of T1)assert.equal(releaseInfo(d).state,'kiadatlan',d.slug+': T1 a lektori jóváhagyásig kiadatlan');
assert.deepEqual(publishedCalcs().map(c=>c.slug),T0.map(c=>c.slug));
// Minden rekord ujjlenyomata egyezik (különben: újra kell ellenőrizni / lektoráltatni – node_modules/.bin/tsx scripts/calc-release.ts list).
for(const [slug,rec] of Object.entries(RELEASES)){const d=bySlug(slug);assert.ok(d,'ismeretlen rekord: '+slug);assert.equal(rec.fingerprint,calcFingerprint(d!),slug+': az ujjlenyomat eltér – a tartalom a jóváhagyás óta változott');if(d!.tier!=='T0')assert.equal(rec.kind,'lektoralt',slug+': T1-hez lektori rekord kell')}
for(const s of TABLE_GATED)assert.ok(bySlug(s)?.tables,s+': táblázatalapú');
assert.deepEqual([...TABLE_GATED].sort(),CALCULATORS.filter(c=>c.tables&&!['feszultseges'].includes(c.slug)).map(c=>c.slug).sort());
// A kapu viselkedése szintetikus rekordokkal.
const fesz=bySlug('feszultseges')!,ker=bySlug('keresztmetszet')!,ohm=bySlug('ohm-torveny')!;
const expert=(d:CalcDef,fp=calcFingerprint(d)):ReleaseRecord=>({kind:'lektoralt',reviewer:'Teszt Elek',qualification:'villamos tervező',registry:'00-0000',date:'2026-11-01',fingerprint:fp});
assert.equal(releaseInfo(fesz,{feszultseges:{...RELEASES['ohm-torveny'],fingerprint:calcFingerprint(fesz)}}).state,'kiadatlan','T1 belső ellenőrzéssel nem adható ki');
assert.equal(releaseInfo(fesz,{feszultseges:expert(fesz)}).state,'kozzeteve','T1 lektori jóváhagyással kiadható');
assert.match(releaseInfo(fesz,{feszultseges:expert(fesz)}).badge,/^Szakmailag lektorálta: Teszt Elek/);
assert.equal(releaseInfo(fesz,{feszultseges:expert(fesz,'deadbeef')}).state,'ujraellenorzendo','módosult tartalom → újra kell lektorálni');
assert.equal(releaseInfo(ker,{keresztmetszet:expert(ker)},false).state,'tablazatra-var','táblázatalapú T1: tablesApproved() is kell');
assert.equal(releaseInfo(ker,{keresztmetszet:expert(ker)},true).state,'kozzeteve');
assert.equal(releaseInfo(ohm,{}).state,'kiadatlan');
assert.equal(releaseInfo({...ohm,version:2}).state,'ujraellenorzendo','verzióemelés → új ellenőrzés');
assert.equal(releaseInfo({...ohm,tier:'T2'}).state,'tiltott');
assert.equal(tablesApproved(),false,'a méretezési táblázatok jóváhagyása függőben (SIZING_REVIEW)');
// Hub-metaadat: a kiadatlan T1 link nélküli „Hamarosan” kártya; előnézetben tervezet.
for(const d of T1){const m=calcMeta(d);assert.equal(m.href,null);assert.equal(m.status,'hamarosan');assert.equal(m.note,'Hamarosan – szakmai lektorálás alatt');assert.equal(!!m.detail,TABLE_GATED.has(d.slug))}
assert.equal(calcMeta(fesz,true).status,'tervezet');assert.equal(calcMeta(fesz,true).href,'/kalkulatorok/feszultseges');
assert.equal(visibleCalcs(false).length,19);assert.equal(visibleCalcs(true).length,27);assert.equal(calcMetas().length,27);
// Statikus oldalak és sitemap: csak a közzétettek (az oldal és a sitemap ugyanazt a publishedCalcs/visibleCalcs-t használja).
const page=readFileSync('app/(kezikonyv)/kalkulatorok/[slug]/page.tsx','utf8'),sitemap=readFileSync('app/sitemap.ts','utf8');
assert.match(page,/export function generateStaticParams\(\)\{return visibleCalcs\(kbPreview\(\)\)/);assert.match(page,/export const dynamicParams=false/);assert.match(page,/export const dynamic='force-static'/);assert.match(page,/export const revalidate=3600/);
assert.match(sitemap,/publishedCalcs\(\)/);
// ---------------------------------------------------------------- 5. Tervezői linkek (lib/kb/links.ts): csak közzétett célra
for(const d of CALCULATORS)assert.equal(calcLinkable(d.slug),isPublished(d),d.slug+': a tervezői link és a közzététel egyezik');
assert.equal(calcHref('feszultseges',{I:16}),null);assert.equal(calcHref('nincs-ilyen'),null);
assert.equal(calcHref('fazisterheles',{mod:'W',P1:600,P2:400.5,P3:0}),'/kalkulatorok/fazisterheles?mod=W&P1=600&P2=400,5&P3=0');
assert.equal(calcQuery({a:2.5,b:'x;y',c:undefined}),'?a=2,5&b=x;y');

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

console.log('PASS: parseNum/formázás, '+CALCULATORS.length+' definíció ellenőrzése (szóhasználat, metaadat, szigetek), kiadási kapu (T0 közzétéve, T1 kiadatlan, ujjlenyomat, táblázat-kapu, T2 tiltva), tervezői linkek, URL oda-vissza, '+runs+' fuzz-futás, 10 000 seedes tulajdonságteszt, egyezés a Méretezés és a Fázisterhelés számításával.');
