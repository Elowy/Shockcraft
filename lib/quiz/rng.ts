// Determinisztikus álvéletlen a Tesztekhez (tiszta modul, kliensen is fut): ugyanabból a seedből mindig ugyanaz a teszt.

export type Rng=()=>number;
/** mulberry32 – 32 bites állapot, egyenletes [0, 1) számok. A tesztkód seedje ezt indítja (lib/quiz/engine.ts). */
export function mulberry32(seed:number):Rng{
 let a=seed>>>0;
 return ()=>{a=(a+0x6d2b79f5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296};
}
export const randInt=(rng:Rng,n:number)=>Math.floor(rng()*n);
export const oneOf=<T,>(rng:Rng,list:readonly T[]):T=>list[randInt(rng,list.length)];
/** Új 32 bites seed (egy kérdés saját seedje a válaszlehetőségek kiválasztásához). */
export const nextSeed=(rng:Rng)=>Math.floor(rng()*4294967296)>>>0;
/** Fisher–Yates keverés (új tömb). */
export function shuffle<T>(list:readonly T[],rng:Rng):T[]{
 const a=[...list];
 for(let i=a.length-1;i>0;i--){const j=randInt(rng,i+1);[a[i],a[j]]=[a[j],a[i]]}
 return a;
}
