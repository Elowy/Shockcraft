// A Tesztek kliensszigetének közös segédei (a beállítás – quiz-app.tsx – és a lustán töltődő futtató – quiz-runner.tsx – is használja).
import type {ResultMode} from '@/lib/quiz/storage';

export const PATH='/tudastar/tesztek';
export const MIN=60_000;
export const MODE_LABEL:Record<ResultMode,string>={gyakorlo:'Gyakorló',vizsga:'Vizsga',hibaim:'Hibáim'};
/** A teszt (#teszt) a képernyő tetejére görget (a ragadós fejléc alá, CSS scroll-margin), a fókusz a megadott címre kerül görgetés nélkül. */
export function toTop(head:HTMLElement|null){
 try{document.getElementById('teszt')?.scrollIntoView({block:'start'})}catch{}
 head?.focus({preventScroll:true});
}
export const randomSeed=()=>{try{return crypto.getRandomValues(new Uint32Array(1))[0]>>>0}catch{return Math.floor(Math.random()*4294967296)>>>0}};
