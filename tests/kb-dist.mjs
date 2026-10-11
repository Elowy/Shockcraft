// Build utáni őr (mindkét target után futtatható): az R3 (lektorra váró) vázlatok szövege nem kerül a build kimenetébe – sem a kliens-
// sem a szervercsomagba (docs/tudastar.md „Közzétételi kapu”). Pozitív kontroll: egy közzétett cikk mondata MEGVAN a szervercsomagban
// (különben a keresés a kódolás miatt vak lenne), a kliens-JS-ben viszont cikktörzs sincs (a cikk SSR-ben készül).
// Használat: npm run build (vagy build:node) után: node tests/kb-dist.mjs   (DIST=dist alapból)
import assert from 'node:assert/strict';
import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {join} from 'node:path';
import {r3Needles} from './kb-r3-needles.mjs';

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
const hits=[];
let bytes=0;
for(const f of files){
 const s=readFileSync(f,'utf8');bytes+=s.length;
 for(const n of needles)for(const v of forms(n))if(s.includes(v)){hits.push(f+': „'+n.slice(0,70)+'…”');break}
}
assert.deepEqual(hits,[],'R3 szöveg a build kimenetében');

// Pozitív kontroll: egy közzétett cikk („Ohm törvénye”) Röviden-mondata a szervercsomagban megvan, a kliens-JS-ben nincs.
const ohm=readFileSync('content/tudastar/elmelet/ohm-torvenye.md','utf8');
// Az első 40–80 karakter, amelyben nincs szám, írásjel vagy szorzópont (a tipográfiai igazítás ezeket nem érinti).
const probe=/\*\*Röviden:\*\*\s+([^·:;,.\d]{40,80})/.exec(ohm)?.[1]?.trim();
assert.ok(probe,'kontrollmondat');
const has=(f)=>{const s=readFileSync(f,'utf8');return forms(probe).some(v=>s.includes(v))};
const server=files.filter(f=>!/[\\/]client[\\/]/.test(f)),client=files.filter(f=>/[\\/]client[\\/]/.test(f)&&/\.m?js$/.test(f));
assert.ok(server.some(has),'a közzétett cikk szövege a szervercsomagban ('+probe+')');
assert.ok(!client.some(has),'cikktörzs nem kerül a kliens-JS-be: '+client.filter(has).join(', '));
console.log('PASS: '+DIST+' ('+files.length+' fájl, '+(bytes/1048576).toFixed(1)+' MB): '+needles.length+' R3-szövegminta egyike sincs benne; a közzétett cikk szövege csak a szervercsomagban.');
