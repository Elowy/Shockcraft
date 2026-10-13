// Az éles build előfeltétele (npm run build, npm run build:node): a Tudástár közzétételi kapujának ígéretei – „az ábra, a szimbólum, az
// elrendezés vagy a rajzoló kód módosítása után a cikk nem közzétett” – nem a fejlesztői fegyelmen állnak. Build előtt lefut:
//  1. `scripts/kb-content.ts check`: a generált modulok (a cikk-metaadat tartalmi és ábra-ujjlenyomata, a közzétett ábrák, a kereső)
//     naprakészek-e a forrással; elavult generált fájl (pl. módosított symbols.tsx újragenerálás nélkül) esetén a build megáll;
//  2. `scripts/lektori-csomag.ts --check`: a docs/lektori-csomag.md és .pdf naprakész-e (a lektor a kiküldött csomagot hagyja jóvá,
//     az ujjlenyomatok pontosan arra szólnak).
// Hibakóddal áll meg, a javítás parancsát kiírja. A tsx a repó fejlesztői függősége (a tesztek is ezt használják).
import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('..',import.meta.url));
const CHECKS=[
 {name:'Tudástár-tartalom (generált modulok, kapu)',args:['scripts/kb-content.ts','check'],fix:'node --import tsx scripts/kb-content.ts build  (és a kapu rekordjának újraellenőrzése: docs/tudastar.md)'},
 {name:'Lektori csomag (docs/lektori-csomag.md és .pdf)',args:['scripts/lektori-csomag.ts','--check'],fix:'node --import tsx scripts/lektori-csomag.ts  (docs/lektoralas.md)'},
];
export function runBuildGuard(){
 if(!existsSync(root+'node_modules/tsx')){
  console.error('A build-őr a tsx csomagot használja (npm run install:ci); hiányában a Tudástár kapuja nem ellenőrizhető, a build megáll.');
  process.exit(69);
 }
 for(const c of CHECKS){
  const r=spawnSync(process.execPath,['--import','tsx',...c.args],{cwd:root,stdio:'inherit'});
  if(r.error||r.status!==0){
   console.error('\nBUILD MEGÁLLT – '+c.name+' elavult vagy hibás.\nJavítás: '+c.fix);
   process.exit(r.status??1);
  }
 }
}
