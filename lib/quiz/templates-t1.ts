// A T1-kalkulátorra (szakmai lektorra váró: feszültségesés, kismegszakító, hurokimpedancia) épülő számolós sablonok. Külön modul, hogy a
// böngésző csak akkor töltse be, ha a szerver valamelyiket közzétettként adja át (components/quiz/quiz-runner.tsx, dinamikus import):
// amíg a kalkulátor lektori kiadása és a sablon belső ellenőrzése (lib/quiz/gate.ts) nincs meg, a kérdésszövegük csak ebben a külön,
// be nem töltött csomagban van (mint a T1-kalkulátorszigetek) – a tesztoldal kezdeti és futtató csomagjában nem (tests/kb-dist.mjs).
// A kismegszakító- és a Zs,max-sablon cikke („kismegszakito”) R3 – lektorra vár; a link csak a cikk közzététele után jelenik meg.
// Szabályok (paraméterek, hibamodellek, előtaghiba): a lib/quiz/templates.ts fejléce.
import {MCB_RATINGS} from '@/lib/calc/constants';
import {floorTo,formatNum} from '@/lib/calc/number';
import {NB,SQRT3,U1,UV,V1,VV,asDiameter,template,uu,type Template} from './templates';

/** A pillanatkioldás szokásos szorzója (MSZ EN 60898-1: B 5 · In, C 10 · In, D 20 · In) – csak a tévesztők modelljéhez. */
const M_FACTOR:Readonly<Record<string,number>>={B:5,C:10,D:20};
/** A feszültségesés-sablon áramai keresztmetszetenként legfeljebb a szokásos kismegszakító névleges áramáig (1,5 mm² → 16 A). */
const I_MAX:Readonly<Record<string,number>>={'1.5':16,'2.5':20,'4':25};

export const T1_TEMPLATES:readonly Template[]=[
 template<{I:number;L:number;A:number}>({
  id:'feszultseges-1f',title:'Feszültségesés (egyfázisú)',short:'ΔU = 2 · L · I · ρ1 / A egyfázisú, ohmos terhelésű körben.',topic:'kabelek-vezetekek',
  calc:'feszultseges',result:'dU',unit:'V',difficulty:2,version:1,
  space:{I:[10,13,16,20,25],L:[10,15,20,25,30,40],A:[1.5,2.5,4]},valid:p=>p.I<=I_MAX[String(p.A)],
  raw:p=>({rendszer:'1f',I:String(p.I),L:String(p.L),'L.e':'m',A:String(p.A),cos:'1',hatar:'public-other'}),
  stem:p=>`Egyfázisú, ${V1}-os áramkörben ${uu(p.I,'A')} áramú ohmos terhelés (cos φ = 1) van egy ${uu(p.L,'m')} hosszú, ${uu(p.A,'mm²')}-es rézvezeték végén. Mekkora a feszültségesés voltban, a méretezési táblázat ρ1 értékével (üzemi hőmérséklet) számolva?`,
  fmt:v=>uu(v,'V'),
  explain:(_p,ok)=>`Egyfázisú körben az áram az oda- és a visszavezetőn is átfolyik, ezért ΔU = 2 · L · I · ρ1 / A (cos φ = 1 mellett a reaktancia hatása elhanyagolható). Az eredmény ${ok}; a behelyettesítés a levezetésben látható.`,
  models:[
   {id:'egy-vezeto',why:'csak az egyik vezetővel számolunk (kimarad a ×2)',value:(_p,ok)=>ok/2},
   {id:'negyszeres',why:'kétszer is duplázzuk a hosszt (×4)',value:(_p,ok)=>ok*2},
   {id:'szazalek',why:'a százalékos esést adjuk meg voltként',value:(_p,ok)=>ok/U1*100},
   {id:'sqrt3',why:'a háromfázisú √3-as szorzót is alkalmazzuk',value:(_p,ok)=>ok*SQRT3},
   {id:'szorzas-A',why:'a keresztmetszettel szorzunk osztás helyett',value:(p,ok)=>ok*p.A*p.A},
   {id:'atmero',why:'a keresztmetszet (mm²) értékét átmérőnek (mm) vesszük, és abból számolunk felületet',value:(p,ok)=>ok*p.A/asDiameter(p.A)},
  ],
 }),
 template<{Ib:number;A:string;gorbe:string}>({
  id:'kismegszakito-valasztas',title:'Kismegszakító-választás (Ib ≤ In ≤ Iz)',short:'A legkisebb előnyös névleges áram a terhelőáram és a vezeték terhelhetősége között.',topic:'vedelmi-eszkozok',
  calc:'kismegszakito',result:'In',unit:'A',difficulty:3,version:1,article:{id:'kismegszakito',anchor:'az-ib-in-iz-elve'},
  space:{Ib:[6,8,9,10,11,12,14,15,16,18,20,24,28,30],A:['1.5','2.5','4','6'],gorbe:['B','C']},
  raw:p=>({Ib:String(p.Ib),A:p.A,mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'1',gorbe:p.gorbe}),
  stem:(p,res)=>`Egy egyfázisú áramkör tervezett terhelőárama Ib = ${uu(p.Ib,'A')}. A ${uu(Number(p.A),'mm²')}-es, PVC-szigetelésű rézvezeték javított terhelhetősége a szerelési körülmények között Iz = ${uu(res.Iz,'A')}. Melyik a legkisebb választható ${p.gorbe} jelleggörbéjű kismegszakító?`,
  fmt:(v,p)=>p.gorbe+v+' ('+v+NB+'A)',
  shown:text=>Number(/^[A-Z](\d+)/.exec(text)?.[1]??NaN),
  explain:(p,ok,res)=>`A kismegszakító névleges árama a terhelőáram és a vezeték terhelhetősége közé essen: Ib ≤ In ≤ Iz. Itt ${uu(p.Ib,'A')} ≤ In ≤ ${uu(res.Iz,'A')}, ebből a legkisebb előnyös érték ${ok}.`,
  models:[
   {id:'ib-alatt',why:'Ib-nél kisebb névleges áramot választunk – ez a tartós terhelést sem viselné',value:p=>[...MCB_RATINGS.value].reverse().find(r=>r<p.Ib)??NaN},
   {id:'ib-alatt-2',why:'Ib-nél jóval kisebb névleges áramot választunk',value:p=>MCB_RATINGS.value.filter(r=>r<p.Ib).at(-2)??NaN},
   {id:'ib-alatt-3',why:'Ib-nél három fokozattal kisebb névleges áramot választunk',value:p=>MCB_RATINGS.value.filter(r=>r<p.Ib).at(-3)??NaN},
   {id:'iz-felett',why:'Iz-nél nagyobb névleges áramot választunk – ez a vezetéket nem védené a túlterhelés ellen',value:(_p,_ok,res)=>MCB_RATINGS.value.find(r=>r>res.Iz)??NaN},
   {id:'iz-felett-2',why:'Iz-nél jóval nagyobb névleges áramot választunk',value:(_p,_ok,res)=>MCB_RATINGS.value.filter(r=>r>res.Iz)[1]??NaN},
   {id:'iz-felett-3',why:'Iz-nél három fokozattal nagyobb névleges áramot választunk',value:(_p,_ok,res)=>MCB_RATINGS.value.filter(r=>r>res.Iz)[2]??NaN},
  ],
 }),
 template<{gorbe:string;In:number}>({
  id:'zs-max',title:'Megengedett hurokimpedancia (Zs,max)',short:'Zs,max = cmin · U0 / (m · In) kismegszakítóval védett körben, TN-rendszerben.',topic:'erintesvedelem',
  calc:'hurokimpedancia',result:'ZsMax',unit:'Ω',difficulty:3,version:1,article:{id:'kismegszakito',anchor:'b-c-es-d-jelleggorbe'},
  space:{gorbe:['B','C'],In:[6,10,13,16,20,25,32]},
  raw:p=>({Ze:'0,35',L:'25',A:'2,5',gorbe:p.gorbe,In:String(p.In)}),
  stem:p=>`Mekkora a megengedett legnagyobb hurokimpedancia (Zs,max) TN-rendszerben egy ${p.gorbe}${p.In} kismegszakítóval védett áramkörben, ha a kismegszakító pillanatkioldási tartományának felső határával számolunk (U0 = ${V1})?`,
  fmt:v=>formatNum(floorTo(v,3),3)+NB+'Ω',
  explain:(_p,ok)=>`A lekapcsolás feltétele, hogy a hibaáram elérje a kismegszakító pillanatkioldási áramát: Zs,max = cmin · U0 / (m · In), ahol m = 5 a B és 10 a C jelleggörbénél. Az eredmény ${ok} (a felső határt lefelé kerekítjük); a behelyettesítés a levezetésben látható.`,
  models:[
   {id:'rossz-m',why:'felcseréljük a B és a C jelleggörbe m-szorzóját (B: 5, C: 10)',value:(p,ok)=>ok*M_FACTOR[p.gorbe]/(p.gorbe==='B'?M_FACTOR.C:M_FACTOR.B)},
   {id:'m-nelkul',why:'kihagyjuk az m-szorzót, és csak a névleges árammal osztunk',value:(p,ok)=>ok*M_FACTOR[p.gorbe]},
   {id:'vonali',why:`a ${VV}-os vonali feszültséggel számolunk a ${V1}-os U0 helyett`,value:(_p,ok)=>ok*UV/U1},
   {id:'d-gorbe',why:'a D jelleggörbe szorzójával (20) számolunk',value:(p,ok)=>ok*M_FACTOR[p.gorbe]/M_FACTOR.D},
   {id:'fazis',why:`a ${V1}-ot vonali feszültségnek véve √3-mal osztjuk`,value:(_p,ok)=>ok/SQRT3},
   {id:'i2',why:'a pillanatkioldási áram (m · In) helyett a hőkioldó I2 = 1,45 · In kioldóáramával számolunk',value:(p,ok)=>ok*M_FACTOR[p.gorbe]/1.45},
  ],
 }),
];
