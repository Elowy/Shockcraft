// A méretezési képletek kiemelése (lib/sizing.ts → lib/sizing-formulas.ts) viselkedésváltozás nélkül:
// a lib/sizing.ts ugyanazokat a függvényobjektumokat re-exportálja, az értékek a kézi képletekkel egyeznek, és a modul zod/lib/plan nélküli.
// Futtatás: node_modules/.bin/tsx tests/sizing-formulas.ts
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as F from '../lib/sizing-formulas';
import * as S from '../lib/sizing';
import * as C from '../lib/calc/formulas';
import {SIZING_TABLES as T} from '../lib/sizing-tables';
import {seed,validatePlan} from '../lib/plan';

const NAMES=['SIZING_DISCLAIMER','SIZING_DISCLAIMER_SHORT','SIZING_NOT_COVERED','fmtNum','atMost','fmtPair','cableMessages','cableLabel','parseCable','designCurrent','correctedIz','voltageDropPercent','loopResistance','maxLoopImpedance','maxLengthForDrop','minSectionFor'] as const;
for(const n of NAMES){assert.ok(n in F,'hiányzik: '+n);assert.equal((S as Record<string,unknown>)[n],(F as Record<string,unknown>)[n],'a lib/sizing.ts ugyanazt re-exportálja: '+n)}
// A lib/calc/formulas.ts szándékosan NEM adja tovább a méretezési képleteket (a T1 definíciók közvetlenül a lib/sizing-formulas.ts-ből importálnak),
// így a T0 kalkulátorok forrás-ujjlenyomata és kliensszigete nem függ a méretezési moduloktól.
for(const n of ['designCurrent','correctedIz','voltageDropPercent','loopResistance','maxLoopImpedance','maxLengthForDrop','minSectionFor','parseCable','SIZING_NOT_COVERED','SIZING_DISCLAIMER_SHORT'] as const)assert.ok(!(n in C),'a lib/calc/formulas.ts nem re-exportálja: '+n);
assert.ok(!/sizing/.test(readFileSync('lib/calc/formulas.ts','utf8').replace(/\/\/.*$/gm,'')),'a lib/calc/formulas.ts nem importál méretezési modult');
// A modul csak a sizing-tables-t importálja (zod és lib/plan nélkül: a kalkulátorok kliensoldalán is fut).
const src=readFileSync('lib/sizing-formulas.ts','utf8');
assert.deepEqual([...src.matchAll(/from\s+'([^']+)'/g)].map(m=>m[1]),['./sizing-tables']);
assert.ok(!/from\s+'(?:zod|\.\/plan|\.\/sizing-schema)'/.test(src));
// A lib/sizing.ts-ben nem maradt kettős definíció.
const sizing=readFileSync('lib/sizing.ts','utf8');
for(const n of NAMES)assert.ok(!new RegExp('export (?:const|function) '+n+'\\b').test(sizing),'kettős definíció: '+n);

// Kézi képletek rácson (a kiemelés előtti képletekkel azonosan).
const rho=T.rho1,lam=T.lambda,U0=T.u0;let n=0;
for(const L of [1,10,23.4,100])for(const I of [1,6,16,32])for(const A of [1.5,2.5,6,16])for(const cos of [1,0.9,0.6])for(const b of [1,2]){
 const sin=Math.sqrt(1-cos*cos),want=b*L*I*(rho*cos/A+lam*sin)/U0*100,got=F.voltageDropPercent({b,length:L,current:I,section:A,cosPhi:cos});
 assert.ok(Math.abs(got-want)<1e-12*Math.max(1,want),'ΔU');
 const Lm=F.maxLengthForDrop(5,b,I,A,cos);assert.ok(Math.abs(F.voltageDropPercent({b,length:Lm,current:I,section:A,cosPhi:cos})-5)<1e-9,'Lmax visszaszámolva 5 %');
 n++;
}
for(const [w,ph,cos,want] of [[2300,'L1',1,10],[6900,'3P',1,10],[2300,'L2',0.5,20]] as const)assert.ok(Math.abs(F.designCurrent(w,ph,cos)-want)<1e-12);
assert.equal(F.loopResistance(10,2.5),rho*10*(2/2.5));assert.equal(F.loopResistance(10,2.5,1.5),rho*10*(1/2.5+1/1.5));
assert.equal(F.maxLoopImpedance('B',16),230/80);assert.equal(F.maxLoopImpedance('C',16),230/160);assert.equal(F.maxLoopImpedance('D',16),230/320);
assert.equal(F.correctedIz(23,0.94,0.7),23*0.94*0.7);
assert.equal(F.minSectionFor(25,'B2','PVC',2,1,1),4);assert.equal(F.minSectionFor(16,'B2','PVC',2,0.87,0.7),4);assert.equal(F.minSectionFor(200,'A2','PVC',3,1,1),null);
assert.equal(F.minSectionFor(20,'B2','PVC',2,1,1,[{method:'B2',insulation:'PVC',loaded:2,section:1.5,iz:21,note:'gyártói adat'}]),1.5,'projekt-felülírás');
assert.deepEqual(F.parseCable('NYM-J 3x1,5'),{ok:true,cable:{text:'NYM-J 3x1,5',cores:3,section:1.5,insulation:'PVC'}});
assert.equal(F.cableLabel({text:'',cores:3,section:2.5,insulation:null}),'3 × 2,5 mm²');
// A tervező Méretezés fülének eredménye változatlan (mintaterv, c1: 2,930 %).
const r=S.circuitSizing(validatePlan(structuredClone(seed)),'c1')!;
assert.ok(Math.abs(r.drop!-2.930086956521739)<1e-12);assert.equal(r.iz,23);
console.log('PASS: '+NAMES.length+' név azonos objektumként re-exportálva, csak sizing-tables import, '+n+' rácspont (ΔU, Lmax), Ib, hurok, Zs,max, Iz, minSectionFor, parseCable, Méretezés-eredmény változatlan.');
