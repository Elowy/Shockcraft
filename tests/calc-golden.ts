// Kalkulátorok – golden tesztek. Futtatás: node_modules/.bin/tsx tests/calc-golden.ts
// 1) Minden definíció minden példája (a példák elvárt értékeit független Python-újraszámolás adta – belső kettős ellenőrzés).
// 2) Kiegészítő, kézzel/függetlenül számolt esetek (az alábbi EXTRA tábla; forrás: scratchpad indep/extra Python-szkript, a képletek a tesztben nem a motorból jönnek).
// 3) A terv (docs/tudastar-terv.md 5.3) golden értékei szó szerint.
import assert from 'node:assert/strict';
import {CALCULATORS,bySlug} from '../lib/calc/registry';
import {checkExample,closeTo,runCalc,type CalcDef,type Raw} from '../lib/calc/core';

type Golden={slug:string;input:Raw;expect:Record<string,number>};
const EXTRA:Golden[]=[
 {slug:"ohm-torveny",input:{"ismert": "UR", "U": "400", "R": "20"},expect:{"I": 20.0, "P": 8000.0}},
 {slug:"ohm-torveny",input:{"ismert": "UI", "U": "1,5", "I": "300", "I.e": "mA"},expect:{"R": 5.0, "P": 0.45}},
 {slug:"ohm-torveny",input:{"ismert": "PR", "P": "2", "P.e": "kW", "R": "26,45"},expect:{"U": 230.0, "I": 8.69565}},
 {slug:"ohm-torveny",input:{"ismert": "IR", "I": "16", "R": "0,5"},expect:{"U": 8.0, "P": 128.0}},
 {slug:"teljesitmeny",input:{"rendszer": "1f", "U": "230", "I": "16", "cos": "0,95"},expect:{"P": 3496.0, "S": 3680.0}},
 {slug:"teljesitmeny",input:{"rendszer": "3f", "Uv": "400", "I": "25", "cos": "1"},expect:{"P": 17320.5, "Q": 0.0}},
 {slug:"teljesitmeny",input:{"rendszer": "dc", "Udc": "12", "I": "8,5"},expect:{"P": 102.0}},
 {slug:"aram-teljesitmenybol",input:{"rendszer": "3f", "P": "22", "P.e": "kW", "Uv": "400", "cos": "0,9", "eta": "1"},expect:{"I": 35.2825, "mcb": 40.0}},
 {slug:"aram-teljesitmenybol",input:{"rendszer": "1f", "P": "1500", "U": "230", "cos": "1", "eta": "1"},expect:{"I": 6.52174, "mcb": 8.0}},
 {slug:"aram-teljesitmenybol",input:{"rendszer": "dc", "P": "300", "Udc": "24", "eta": "0,9"},expect:{"I": 13.8889}},
 {slug:"latszolagos-meddo-teljesitmeny",input:{"mod": "PQ", "P": "12", "P.e": "kW", "Q": "5", "Q.e": "kvar"},expect:{"S": 13000.0, "cos": 0.923077}},
 {slug:"latszolagos-meddo-teljesitmeny",input:{"mod": "Scos", "S": "100", "S.e": "kVA", "cos": "0,85"},expect:{"P": 85000.0, "Q": 52678.3}},
 {slug:"vezetek-ellenallas",input:{"anyag": "Cu", "mod": "rho20", "L": "50", "A": "1,5", "theta": "20", "ut": "2"},expect:{"R": 1.1494}},
 {slug:"vezetek-ellenallas",input:{"anyag": "Al", "mod": "rho20", "L": "200", "A": "25", "theta": "70", "ut": "1"},expect:{"R": 0.271674}},
 {slug:"vezetek-ellenallas",input:{"anyag": "Cu", "mod": "rho1", "L": "40", "A": "4", "ut": "2"},expect:{"R": 0.45}},
 {slug:"eredo-ellenallas",input:{"mod": "parhuzamos", "R": "1; 1; 1; 1", "R.e": "kohm"},expect:{"Re": 250.0}},
 {slug:"eredo-ellenallas",input:{"mod": "soros", "R": "0,5; 0,25", "R.e": "ohm"},expect:{"Re": 0.75}},
 {slug:"eredo-ellenallas",input:{"mod": "hianyzo", "Re": "50", "Re.e": "ohm", "Rk": "100; 300", "Rk.e": "ohm"},expect:{"Rx": 150.0}},
 {slug:"fogyasztas-koltseg",input:{"sorok": "800*2*1;40*10*5", "ar": "50"},expect:{"nap": 3.6, "ev": 1314.0, "ft_ev": 65700.0}},
 {slug:"fogyasztas-koltseg",input:{"sorok": "5*24*4"},expect:{"nap": 0.48, "ho": 14.6}},
 {slug:"fazisterheles",input:{"mod": "A", "L1": "32", "L2": "25", "L3": "16"},expect:{"IN": 13.8924, "imbalance": 34.2466}},
 {slug:"fazisterheles",input:{"mod": "W", "P1": "3", "P1.e": "kW", "P2": "3", "P2.e": "kW", "P3": "0", "P3.e": "kW"},expect:{"IN": 13.0435, "total": 6000.0}},
 {slug:"mertekegyseg-atvalto",input:{"mod": "teljesitmeny", "P": "1", "P.e": "hp"},expect:{"kW": 0.7457, "LE": 1.01387}},
 {slug:"mertekegyseg-atvalto",input:{"mod": "awg", "awg": "10"},expect:{"mm2": 5.26115}},
 {slug:"mertekegyseg-atvalto",input:{"mod": "awg", "awg": "14"},expect:{"mm2": 2.08091}},
 {slug:"mertekegyseg-atvalto",input:{"mod": "energia", "E": "18", "E.e": "MJ"},expect:{"kWh": 5.0}},
 {slug:"mertekegyseg-atvalto",input:{"mod": "atmero", "d": "2,26"},expect:{"mm2": 4.0115}},
 {slug:"eredo-kapacitas",input:{"mod": "soros", "C": "100; 100; 100", "C.e": "nF"},expect:{"Ce": 3.33333e-08}},
 {slug:"eredo-kapacitas",input:{"mod": "parhuzamos", "C": "4,7; 2,2; 1", "C.e": "uF"},expect:{"Ce": 7.9e-06}},
 {slug:"feszultsegoszto",input:{"mod": "kimenet", "Ube": "24", "R1": "33", "R1.e": "kohm", "R2": "10", "R2.e": "kohm"},expect:{"Uki": 5.5814}},
 {slug:"feszultsegoszto",input:{"mod": "r2", "Ube": "5", "R1": "10", "R1.e": "kohm", "Uki": "2,5"},expect:{"R2": 10000.0}},
 {slug:"ellenallas-szinkod",input:{"savok": "4", "s1": "barna", "s2": "zold", "szorzo": "piros", "tures": "arany"},expect:{"R": 1500.0}},
 {slug:"ellenallas-szinkod",input:{"savok": "5", "s1": "piros", "s2": "piros", "s3": "fekete", "szorzo": "narancs", "tures": "barna"},expect:{"R": 220000.0, "tol": 1.0}},
 {slug:"ellenallas-szinkod",input:{"savok": "4", "s1": "kek", "s2": "szurke", "szorzo": "zold", "tures": "ezust"},expect:{"R": 6800000.0, "tol": 10.0}},
 {slug:"lumen-lux",input:{"mod": "darab", "A": "50", "E": "300", "fi": "3000", "eta": "0,6", "k": "0,8"},expect:{"N": 11.0, "E": 316.8}},
 {slug:"lumen-lux",input:{"mod": "megvilagitas", "A": "8", "N": "2", "fi": "800", "eta": "0,5", "k": "0,8"},expect:{"E": 80.0}},
 {slug:"csillag-delta",input:{"mod": "y2d", "R1": "5", "R2": "5", "R3": "10"},expect:{"R12": 12.5, "R23": 25.0, "R31": 25.0}},
 {slug:"csillag-delta",input:{"mod": "d2y", "R12": "10", "R23": "20", "R31": "30"},expect:{"R1": 5.0, "R2": 3.33333, "R3": 10.0}},
 {slug:"transzformator",input:{"rendszer": "1f", "U1": "400", "U2": "230", "S": "2", "S.e": "kVA"},expect:{"a": 1.73913, "I1": 5.0, "I2": 8.69565}},
 {slug:"transzformator",input:{"rendszer": "3f", "U1": "20", "U1.e": "kV", "U2": "400", "S": "630", "S.e": "kVA"},expect:{"I1": 18.1865, "I2": 909.327}},
 {slug:"akkumulator-uzemido",input:{"C": "7", "C.e": "Ah", "U": "12", "dod": "100", "eta": "0,85", "P": "30"},expect:{"t": 2.38}},
 {slug:"akkumulator-uzemido",input:{"C": "280", "C.e": "Ah", "U": "48", "dod": "90", "eta": "0,95", "P": "2", "P.e": "kW"},expect:{"t": 5.7456}},
 {slug:"led-elotet-ellenallas",input:{"Us": "9", "Uf": "2,1", "I": "15", "I.e": "mA", "n": "1"},expect:{"R": 460.0, "Re24": 470.0}},
 {slug:"led-elotet-ellenallas",input:{"Us": "24", "Uf": "3,2", "I": "20", "I.e": "mA", "n": "6"},expect:{"R": 240.0, "Re24": 240.0}},
 {slug:"reaktancia-rezonancia",input:{"mod": "xc", "f": "1", "f.e": "kHz", "C": "100", "C.e": "nF"},expect:{"XC": 1591.55}},
 {slug:"reaktancia-rezonancia",input:{"mod": "f0", "L": "1", "L.e": "H", "C": "10", "C.e": "uF"},expect:{"f0": 50.3292}},
 {slug:"homerseklet",input:{"mod": "atvaltas", "T": "300", "egyseg": "K"},expect:{"C": 26.85, "F": 80.33}},
 {slug:"homerseklet",input:{"mod": "ellenallas", "anyag": "Cu", "R1": "2,5", "t1": "15", "t2": "95"},expect:{"R2": 3.30175}},
 {slug:"feszultseges",input:{"rendszer": "1f", "I": "10", "L": "50", "A": "2,5", "cos": "0,9", "hatar": "public-other"},expect:{"pct": 3.5369}},
 {slug:"feszultseges",input:{"rendszer": "3f", "I": "63", "L": "30", "A": "16", "cos": "1", "hatar": "private-other"},expect:{"pct": 1.15557, "Lmax": 207.69}},
 {slug:"motor-aram",input:{"rendszer": "3f", "P": "15", "P.e": "kW", "Uv": "400", "cos": "0,86", "eta": "0,91"},expect:{"I": 27.665}},
 {slug:"led-szalag-tapegyseg",input:{"L": "12", "pm": "19,2", "U": "24", "r": "20"},expect:{"P": 230.4, "I": 9.6, "psu": 320.0}},
 {slug:"fazisjavitas",input:{"P": "50", "P.e": "kW", "cos1": "0,8", "cos2": "0,95", "kotes": "delta", "Uv": "400", "f": "50"},expect:{"Qc": 21065.8}},
 {slug:"keresztmetszet",input:{"In": "40", "mod": "C", "szig": "PVC", "erek": "3", "temp": "30", "csop": "1"},expect:{"A": 6.0, "Iz": 41.0}},
 {slug:"keresztmetszet",input:{"In": "16", "mod": "B2", "szig": "PVC", "erek": "2", "temp": "45", "csop": "2"},expect:{"A": 4.0, "Iz": 18.96}},
 {slug:"kismegszakito",input:{"Ib": "30", "A": "6", "mod": "B2", "szig": "PVC", "erek": "3", "temp": "30", "csop": "1", "gorbe": "C"},expect:{"In": 32.0, "Iz": 34.0, "ZsMax": 0.71875}},
 {slug:"hurokimpedancia",input:{"Ze": "0,2", "L": "60", "A": "4", "gorbe": "B", "In": "20"},expect:{"Zs": 0.875, "Lmax": 186.667}},
 {slug:"terhelhetoseg-tablazat",input:{"mod": "A1", "szig": "PVC", "erek": "3", "temp": "40", "csop": "4"},expect:{"s10": 23.751, "s1_5": 7.63425}},
 // 4. ellenőrzési kör (review) kiegészítései – IEC 60062:2016 tűrésszín, nagy ellenállású hiányzó tag, °F → °C/K, W-os fázisterhelés, kis UR-ű LED
 {slug:"ellenallas-szinkod",input:{"savok": "4", "s1": "sarga", "s2": "ibolya", "szorzo": "piros", "tures": "sarga"},expect:{"R": 4700.0, "tol": 0.02}},
 {slug:"eredo-ellenallas",input:{"mod": "hianyzo", "Re": "999900", "Re.e": "Mohm", "Rk": "1000000", "Rk.e": "Mohm"},expect:{"Rx": 9999000000000000.0}},
 {slug:"homerseklet",input:{"mod": "atvaltas", "T": "212", "egyseg": "F"},expect:{"C": 100.0, "K": 373.15}},
 {slug:"fazisterheles",input:{"mod": "W", "P1": "2300", "P2": "0", "P3": "0"},expect:{"I1": 10.0, "IN": 10.0}},
 {slug:"led-elotet-ellenallas",input:{"Us": "10", "Uf": "3,3", "I": "20", "I.e": "mA", "n": "3"},expect:{"R": 5.0, "Re24": 5.1}},
];

// Relatív tűrés (closeTo): 1 alatti elvárt értéknél is ténylegesen ellenőriz (pl. 3,2e-7 F).
const near=(got:number|undefined,want:number,tol=1e-4)=>got!==undefined&&closeTo(got,want,tol);
const value=(slug:string,input:Raw,id:string)=>{const d=bySlug(slug)!;const r=runCalc(d,input);assert.ok(r.ok,slug+' '+JSON.stringify(input)+': '+(r.ok?'':r.issues.map(i=>i.text).join('; ')));return r.out.results.find(x=>x.id===id)?.value};

let cases=0;const failures:string[]=[];
// 1) A definíciók példái
for(const d of CALCULATORS){
 assert.ok(d.examples.length>=2,d.slug+': legalább 2 példa kell');
 for(const ex of d.examples){cases++;failures.push(...checkExample(d,ex))}
}
// 2) Kiegészítő esetek
for(const g of EXTRA){
 cases++;
 for(const [id,want] of Object.entries(g.expect)){const got=value(g.slug,g.input,id);if(!near(got,want))failures.push(g.slug+' '+JSON.stringify(g.input)+': '+id+' = '+got+', elvárt '+want)}
}
// 3) A terv 5.3 táblázatának golden értékei (a kijelzett kerekítés szerint)
const plan:[string,Raw,string,number,number][]=[
 ['ohm-torveny',{ismert:'UR',U:'230',R:'10'},'I',23,1e-9],['ohm-torveny',{ismert:'UR',U:'230',R:'10'},'P',5290,1e-9],
 ['teljesitmeny',{rendszer:'3f',Uv:'400',I:'16',cos:'0,9'},'P',9976.6,1e-5],
 ['aram-teljesitmenybol',{rendszer:'1f',P:'3000',U:'230',cos:'1',eta:'1'},'I',13.04,5e-4],
 ['feszultseges',{rendszer:'1f',I:'16',L:'23,4',A:'2,5',cos:'1',hatar:'public-other'},'dU',6.739,1e-4],
 ['feszultseges',{rendszer:'1f',I:'16',L:'23,4',A:'2,5',cos:'1',hatar:'public-other'},'pct',2.930,1e-4],
 ['feszultseges',{rendszer:'1f',I:'16',L:'23,4',A:'2,5',cos:'1',hatar:'public-other'},'Lmax',39.93,1e-4],
 ['fogyasztas-koltseg',{sorok:'2000*0,25*1',ar:'36'},'ev',182.5,1e-9],['fogyasztas-koltseg',{sorok:'2000*0,25*1',ar:'36'},'ft_ev',6570,1e-9],
 ['fazisterheles',{mod:'A',L1:'10',L2:'10',L3:'0'},'IN',10,1e-9],
 ['mertekegyseg-atvalto',{mod:'teljesitmeny',P:'7,5','P.e':'kW'},'LE',10.197,1e-4],['mertekegyseg-atvalto',{mod:'awg',awg:'12'},'mm2',3.309,2e-4],
 ['ellenallas-szinkod',{savok:'4',s1:'sarga',s2:'ibolya',szorzo:'piros',tures:'arany'},'R',4700,1e-9],['ellenallas-szinkod',{savok:'4',s1:'sarga',s2:'ibolya',szorzo:'piros',tures:'arany'},'tol',5,1e-9],
 ['lumen-lux',{mod:'darab',A:'20',E:'500',fi:'4000',eta:'0,5',k:'0,8'},'N',7,1e-9],['lumen-lux',{mod:'darab',A:'20',E:'500',fi:'4000',eta:'0,5',k:'0,8'},'E',560,1e-9],
 ['csillag-delta',{mod:'y2d',R1:'10',R2:'20',R3:'30'},'R12',36.67,2e-4],['csillag-delta',{mod:'y2d',R1:'10',R2:'20',R3:'30'},'R23',110,1e-9],['csillag-delta',{mod:'y2d',R1:'10',R2:'20',R3:'30'},'R31',55,1e-9],
 ['akkumulator-uzemido',{C:'100',U:'12',dod:'50',eta:'0,9',P:'60'},'t',9,1e-9],
 ['transzformator',{rendszer:'1f',U1:'230',U2:'12',S:'60'},'I2',5,1e-9],
 ['motor-aram',{rendszer:'3f',P:'5,5',Uv:'400',cos:'0,85',eta:'0,87'},'I',10.74,5e-4],
 ['led-szalag-tapegyseg',{L:'5',pm:'14,4',U:'24',r:'20'},'psu',100,1e-9],['led-szalag-tapegyseg',{L:'5',pm:'14,4',U:'24',r:'20'},'I',3,1e-9],
 ['keresztmetszet',{In:'20',mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'1'},'A',2.5,1e-9],['keresztmetszet',{In:'20',mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'1'},'Iz',23,1e-9],
 ['keresztmetszet',{In:'20',mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'3'},'A',4,1e-9],
 ['kismegszakito',{Ib:'14',A:'2.5',mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'1',gorbe:'B'},'ZsMax',2.875,1e-9],
 ['hurokimpedancia',{Ze:'0,35',L:'25',A:'2,5',gorbe:'B',In:'16'},'Zs',0.80,1e-9],['hurokimpedancia',{Ze:'0,35',L:'25',A:'2,5',gorbe:'B',In:'16'},'Ik',287.5,1e-9],
 ['hurokimpedancia',{Ze:'0,35',L:'25',A:'2,5',gorbe:'B',In:'16'},'Lmax',140.3,5e-4],
];
for(const [slug,input,id,want,tol] of plan){cases++;const got=value(slug,input,id);if(!near(got,want,tol))failures.push('terv 5.3: '+slug+' '+id+' = '+got+', elvárt '+want)}

assert.deepEqual(failures,[],failures.join('\n'));
// 4) Mutációs próba: a golden-ellenőrzés tényleg észreveszi a hibás motort (relatív tűrés, 1 alatti értéknél is).
//    Minden kalkulátornál: ha minden eredmény 0,1 %-kal eltér, legalább egy példa elbukik; az eredő kapacitásnál a soros és a párhuzamos képlet felcserélése, illetve ×2 is.
const mutate=(d:CalcDef,f:(x:number)=>number):CalcDef=>({...d,compute:v=>{const o=d.compute(v);return {...o,results:o.results.map(r=>({...r,value:f(r.value)}))}}});
for(const d of CALCULATORS)assert.ok(d.examples.some(ex=>checkExample(mutate(d,x=>x*1.001),ex).length>0),d.slug+': a példák nem veszik észre a 0,1 %-os eltérést');
const cap=bySlug('eredo-kapacitas')!;
assert.ok(cap.examples.some(ex=>checkExample(mutate(cap,x=>x*2),ex).length>0),'eredő kapacitás ×2 észrevétlen');
const swapped:CalcDef={...cap,compute:v=>cap.compute({...v,s:(id:string)=>id==='mod'?(v.s('mod')==='soros'?'parhuzamos':'soros'):v.s(id)})};
assert.ok(cap.examples.filter(ex=>checkExample(swapped,ex).length>0).length===cap.examples.length,'eredő kapacitás: a soros/párhuzamos csere minden példán elbukik');
assert.equal(near(3.2e-7*1.01,3.2e-7),false,'1 alatti elvárt érték: 1 % eltérés hiba');assert.equal(near(0,0),true);assert.equal(near(1e-9,0),false);
assert.ok(cases>=150,'legalább 150 golden eset kell (most: '+cases+')');
console.log('PASS: '+cases+' golden eset ('+CALCULATORS.reduce((s,d)=>s+d.examples.length,0)+' definíciós példa, '+EXTRA.length+' kiegészítő, '+plan.length+' tervbeli érték) – '+CALCULATORS.length+' kalkulátor.');
