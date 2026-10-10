// Általános villamos képletek (tiszta függvények), valamint a méretezési képletek re-exportja.
// A méretezési képletek egyetlen forrása a lib/sizing-formulas.ts (és a lib/sizing-tables.ts); itt nem ismételjük őket.
export {designCurrent,correctedIz,voltageDropPercent,loopResistance,maxLoopImpedance,maxLengthForDrop,minSectionFor,parseCable,SIZING_DISCLAIMER,SIZING_DISCLAIMER_SHORT,SIZING_NOT_COVERED} from '../sizing-formulas';

export const SQRT3=Math.sqrt(3);
export const sinOf=(cos:number)=>Math.sqrt(Math.max(0,1-cos*cos));
export type AcSystem='1f'|'3f';export type System=AcSystem|'dc';

/** Látszólagos teljesítmény: 1f: S = U · I; 3f: S = √3 · U · I (U a vonali feszültség); DC: P = U · I. */
export const apparentPower=(system:System,U:number,I:number)=>(system==='3f'?SQRT3:1)*U*I;
/** Áram teljesítményből: I = P / (k · U · cos φ · η), k = √3 háromfázisnál (vonali feszültség), egyébként 1. */
export const currentFromPower=(system:System,P:number,U:number,cos=1,eta=1)=>P/((system==='3f'?SQRT3:1)*U*cos*eta);

export const seriesSum=(xs:readonly number[])=>xs.reduce((s,x)=>s+x,0);
/** Párhuzamos eredő: 1 / Σ(1/x). */
export const parallelSum=(xs:readonly number[])=>1/xs.reduce((s,x)=>s+1/x,0);

/** Nullavezető-áram szimmetrikus fázisszögek (azonos cos φ, szinuszos áramok) mellett:
 * I_N = √(I1² + I2² + I3² − I1·I2 − I2·I3 − I3·I1). */
export const neutralCurrent=(i1:number,i2:number,i3:number)=>Math.sqrt(Math.max(0,i1*i1+i2*i2+i3*i3-i1*i2-i2*i3-i3*i1));

/** Csillag → delta: R12 = Σ / R3, R23 = Σ / R1, R31 = Σ / R2, ahol Σ = R1·R2 + R2·R3 + R3·R1. */
export function starToDelta(r1:number,r2:number,r3:number){const s=r1*r2+r2*r3+r3*r1;return {r12:s/r3,r23:s/r1,r31:s/r2,sum:s}}
/** Delta → csillag: R1 = R12·R31 / ΣR, R2 = R12·R23 / ΣR, R3 = R23·R31 / ΣR. */
export function deltaToStar(r12:number,r23:number,r31:number){const s=r12+r23+r31;return {r1:r12*r31/s,r2:r12*r23/s,r3:r23*r31/s,sum:s}}

/** Vezeték-ellenállás: R = ρ20 · (1 + α · (θ − 20 °C)) · n · L / A. */
export const rhoAt=(rho20:number,alpha:number,theta:number)=>rho20*(1+alpha*(theta-20));
export const wireResistance=(rho:number,length:number,section:number,conductors=1)=>rho*length*conductors/section;
