// Build utáni őr (mindkét target után futtatható): az R3 (lektorra váró) vázlatok szövege és a statikus kérdésbank kiadatlan
// (lektorálatlan) kérdéseinek szövege nem kerül a build kimenetébe – sem a kliens-, sem a szervercsomagba (docs/tudastar.md
// „Közzétételi kapu” és „Tesztek”). Pozitív kontroll: egy közzétett cikk mondata MEGVAN a szervercsomagban
// (különben a keresés a kódolás miatt vak lenne), a kliens-JS-ben viszont cikktörzs sincs (a cikk SSR-ben készül).
// Használat: npm run build (vagy build:node) után: node tests/kb-dist.mjs   (DIST=dist alapból)
import assert from 'node:assert/strict';
import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {join} from 'node:path';
import {DIAGRAM_MARKERS,netlistNeedles,r3Needles} from './kb-r3-needles.mjs';
import {quizNeedles,unreleasedQuestions} from './kb-quiz-needles.mjs';

const DIST=process.env.DIST||'dist';
assert.ok(existsSync(DIST),DIST+' hiányzik – előbb: npm run build vagy npm run build:node');
const walk=(d)=>readdirSync(d).flatMap(f=>{const p=join(d,f);return statSync(p).isDirectory()?(f==='node_modules'?[]:walk(p)):/\.(m?js|cjs|html|json|css|txt|rsc|map)$/.test(f)?[p]:[]});
const files=walk(DIST);
assert.ok(files.length>20,'build-kimenet: '+files.length+' fájl');

// A JS-csomagban a nem ASCII karakter \uXXXX alakban is állhat: mindkét alakot keressük.
const esc=(s)=>s.replace(/[^\x20-\x7e]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'));
const forms=(s)=>[s,esc(s),esc(s).replace(/\\u([0-9a-f]{4})/g,(_,h)=>'\\u'+h.toUpperCase())];
const needles=r3Needles();
assert.ok(needles.length>300,'R3 szövegminták: '+needles.length);
// A kérdésbank kiadatlan kérdései (ha a forrás már létezik; amíg nincs, a lista üres).
const qNeedles=quizNeedles(),qCount=unreleasedQuestions().length;
assert.ok(!qCount||qNeedles.length>=qCount,'kérdésbank-szövegminták: '+qNeedles.length+' ('+qCount+' kiadatlan kérdés)');
const hits=[],qHits=[];
let bytes=0;
const texts=new Map();
for(const f of files){
 const s=readFileSync(f,'utf8');bytes+=s.length;texts.set(f,s);
 for(const n of needles)for(const v of forms(n))if(s.includes(v)){hits.push(f+': „'+n.slice(0,70)+'…”');break}
 for(const n of qNeedles)for(const v of forms(n))if(s.includes(v)){qHits.push(f+': „'+n.slice(0,70)+'…”');break}
}
assert.deepEqual(hits,[],'R3 szöveg a build kimenetében');
// A lektorra váró bekötési ábrák: a netlisták feliratai és a kirajzolt ábra jelölői sincsenek a build kimenetében (a generált
// lib/kb/content/generated/diagrams.ts lektorálásig üres; a rajzoló kód benne lehet, a tartalom nem).
const nNeedles=netlistNeedles();assert.ok(nNeedles.length>=150,'netlista-feliratminták: '+nNeedles.length);
const nHits=[];
for(const [f,s] of texts){for(const n of nNeedles)if(forms(n).some(v=>s.includes(v))){nHits.push(f+': „'+n+'”');break}for(const m of DIAGRAM_MARKERS)if(s.includes(m))nHits.push(f+': '+m)}
assert.deepEqual(nHits,[],'netlista-felirat vagy bekötési ábra a build kimenetében');
assert.deepEqual(qHits,[],'kiadatlan kérdésbank-szöveg a build kimenetében');
// Pozitív kontroll a kérdésbank-keresőhöz: a közzétett számolós sablon szövege a kliens-JS-ben megvan (a Tesztek szigete), így a keresés nem vak.
const tplProbe='ellenállású ohmos fogyasztóra';
assert.ok(files.filter(f=>/[\\/]client[\\/]/.test(f)&&/\.m?js$/.test(f)).some(f=>forms(tplProbe).some(v=>texts.get(f).includes(v))),'a számolós sablon szövege a kliens-JS-ben ('+tplProbe+')');

// A T1-kalkulátorra épülő (lektorra váró) számolós sablonok szövege a kliens-JS-ben csak a saját, külön csomagjukban lehet
// (lib/quiz/templates-t1.ts – a böngésző csak akkor tölti be, ha a szerver valamelyiket közzétettként adja át), a tesztoldal kezdeti és
// futtató csomagjában nem. Minták: a három sablon kérdésének egy-egy jellemző részlete.
const t1Probes=['legnagyobb hurokimpedancia (Zs,max) TN-rendszerben','legkisebb választható','Mekkora a feszültségesés voltban'];
const clientJs=files.filter(f=>/[\\/]client[\\/]/.test(f)&&/\.m?js$/.test(f));
const t1Files=clientJs.filter(f=>t1Probes.some(p=>forms(p).some(v=>texts.get(f).includes(v))));
assert.ok(t1Files.length>=1,'a T1-sablonok külön csomagja megvan (különben a minta elavult)');
for(const f of t1Files){
 const s=texts.get(f);
 assert.ok(t1Probes.every(p=>forms(p).some(v=>s.includes(v))),f+': a T1-sablonok szövege egy csomagban együtt');
 assert.ok(!forms(tplProbe).some(v=>s.includes(v))&&!/RunView|ResultView|loadPool/.test(s),f+': a T1-sablonok szövege a T0-sablonok vagy a futtató csomagjában');
}

// Pozitív kontroll: egy közzétett cikk („Ohm törvénye”) Röviden-mondata a szervercsomagban megvan, a kliens-JS-ben nincs.
const ohm=readFileSync('content/tudastar/elmelet/ohm-torvenye.md','utf8');
// Az első 40–80 karakter, amelyben nincs szám, írásjel vagy szorzópont (a tipográfiai igazítás ezeket nem érinti).
const probe=/\*\*Röviden:\*\*\s+([^·:;,.\d]{40,80})/.exec(ohm)?.[1]?.trim();
assert.ok(probe,'kontrollmondat');
const has=(f)=>{const s=readFileSync(f,'utf8');return forms(probe).some(v=>s.includes(v))};
const server=files.filter(f=>!/[\\/]client[\\/]/.test(f)),client=files.filter(f=>/[\\/]client[\\/]/.test(f)&&/\.m?js$/.test(f));
assert.ok(server.some(has),'a közzétett cikk szövege a szervercsomagban ('+probe+')');
assert.ok(!client.some(has),'cikktörzs nem kerül a kliens-JS-be: '+client.filter(has).join(', '));
console.log('PASS: '+DIST+' ('+files.length+' fájl, '+(bytes/1048576).toFixed(1)+' MB): '+needles.length+' R3-szövegminta, '+nNeedles.length+' netlista-feliratminta és a bekötési ábra jelölői, valamint '+qNeedles.length+' kérdésbank-szövegminta ('+qCount+' kiadatlan kérdés) egyike sincs benne; a közzétett cikk szövege csak a szervercsomagban, a számolós sablon szövege a kliens-JS-ben, a T1-sablonoké csak a saját, külön csomagjukban ('+t1Files.length+' fájl).');
