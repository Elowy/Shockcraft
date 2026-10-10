// Fizikai állandók és előnyös értéksorok a kalkulátorokhoz – minden érték forrással.
// A szabványhoz kötött méretezési számok (ρ1 = 0,0225, λ, U0, G.52.1 határok, pillanatkioldás, cmin, Iz0, kθ, kcs)
// kizárólag a lib/sizing-tables.ts-ből jönnek; itt nem ismételjük őket.

export type Sourced<T>={value:T;source:string};

/** Réz és alumínium fajlagos ellenállása 20 °C-on (Ω·mm²/m) és hőmérsékleti tényezője (1/K). */
export const MATERIALS={
 Cu:{label:'Réz (Cu)',rho20:0.017241,alpha:0.00393,source:'IEC 60028 (lágyított réz, 20 °C: 1/58 Ω·mm²/m; α20 = 0,00393 1/K)'},
 Al:{label:'Alumínium (Al)',rho20:0.028264,alpha:0.00403,source:'IEC 60889 (keményhúzott alumínium, 20 °C: 0,028264 Ω·mm²/m; α20 = 0,00403 1/K)'},
} as const;
export type Material=keyof typeof MATERIALS;

/** 1 LE (metrikus lóerő) = 75 kp·m/s = 735,49875 W (definíció). */
export const LE_W=735.49875;
/** 1 hp (mechanikai, angolszász lóerő) = 550 ft·lbf/s ≈ 745,69987 W (definíció). */
export const HP_W=745.69987158227022;
/** 1 kWh = 3,6 MJ (definíció). */
export const KWH_J=3.6e6;
/** 0 °C = 273,15 K (definíció). */
export const KELVIN_OFFSET=273.15;
/** Hálózati névleges feszültségek: 230/400 V (MSZ EN 60038). */
export const NOMINAL={phase:230,line:400,source:'MSZ EN 60038 (230/400 V)'} as const;

/** Kismegszakítók előnyös névleges áramai (A): MSZ EN 60898-1, 5.3.2. */
export const MCB_RATINGS:Sourced<readonly number[]>={value:[6,8,10,13,16,20,25,32,40,50,63,80,100,125],source:'MSZ EN 60898-1, 5.3.2 (előnyös névleges áramok)'};

/** E12 és E24 értéksor (IEC 60063). */
export const E12=[1,1.2,1.5,1.8,2.2,2.7,3.3,3.9,4.7,5.6,6.8,8.2] as const;
export const E24=[1,1.1,1.2,1.3,1.5,1.6,1.8,2,2.2,2.4,2.7,3,3.3,3.6,3.9,4.3,4.7,5.1,5.6,6.2,6.8,7.5,8.2,9.1] as const;
export const E_SERIES_SOURCE='IEC 60063 (E12, E24 értéksor)';
/** A legkisebb olyan E-sorbeli érték, amely ≥ x. */
export function nextSeriesValue(x:number,series:readonly number[]=E24){
 if(!(x>0)||!Number.isFinite(x))return NaN;
 let decade=10**Math.floor(Math.log10(x));
 for(let i=0;i<2;i++,decade*=10)for(const v of series){const c=+(v*decade).toPrecision(6);if(c>=x*(1-1e-9))return c}
 return NaN;
}

/** AWG-huzalátmérő: d = 0,127 mm · 92^((36 − n)/39) (ASTM B258); n = −3 a 0000 (4/0). */
export const AWG_SOURCE='ASTM B258: d = 0,127 mm · 92^((36 − n)/39)';
export const awgDiameter=(n:number)=>0.127*92**((36-n)/39);
export const awgLabel=(n:number)=>n>=0?String(n):'0'.repeat(1-n)+' ('+(1-n)+'/0)';

/** Ellenállás-színkód (IEC 60062:2016). `digit`: számjegy; `mult`: szorzó; `tol`: tűrés %.
 * A 2016-os kiadás tűrésszínei: szürke ±0,01 %, narancs ±0,05 %, sárga ±0,02 %; a régebbi EIA RS-279 jelölésben a szürke ±0,05 % volt. */
export const COLOR_SOURCE='IEC 60062:2016 (ellenállások színkódja)';
export const COLORS=[
 {id:'fekete',label:'fekete',hex:'#1b1b1b',digit:0,mult:1},
 {id:'barna',label:'barna',hex:'#7a4a24',digit:1,mult:10,tol:1},
 {id:'piros',label:'piros',hex:'#c62828',digit:2,mult:100,tol:2},
 {id:'narancs',label:'narancs',hex:'#ef7d14',digit:3,mult:1e3,tol:0.05},
 {id:'sarga',label:'sárga',hex:'#f4cf1b',digit:4,mult:1e4,tol:0.02},
 {id:'zold',label:'zöld',hex:'#2e7d32',digit:5,mult:1e5,tol:0.5},
 {id:'kek',label:'kék',hex:'#1e5bb8',digit:6,mult:1e6,tol:0.25},
 {id:'ibolya',label:'ibolya',hex:'#7b3fb0',digit:7,mult:1e7,tol:0.1},
 {id:'szurke',label:'szürke',hex:'#8a8a8a',digit:8,mult:1e8,tol:0.01},
 {id:'feher',label:'fehér',hex:'#f7f7f7',digit:9,mult:1e9},
 {id:'arany',label:'arany',hex:'#c9a227',mult:0.1,tol:5},
 {id:'ezust',label:'ezüst',hex:'#b8bec4',mult:0.01,tol:10},
 {id:'nincs',label:'nincs (±20 %)',hex:'transparent',tol:20},
] as const satisfies readonly {id:string;label:string;hex:string;digit?:number;mult?:number;tol?:number}[];
export type ColorId=typeof COLORS[number]['id'];

/** LED-tápegységek jellemző kereskedelmi teljesítménysora (W) – tájékoztató, gyártónként eltér. */
export const PSU_SIZES:Sourced<readonly number[]>={value:[15,25,35,50,60,75,100,120,150,200,240,320,480,600],source:'Jellemző kereskedelmi teljesítménysor (tájékoztató, gyártónként eltér)'};
/** Ellenállások szokásos névleges teljesítménye (W) – tájékoztató. */
export const RESISTOR_POWERS:Sourced<readonly number[]>={value:[0.125,0.25,0.5,1,2,3,5,10],source:'Szokásos névleges teljesítménysor (tájékoztató)'};
/** A legkisebb listaelem, amely ≥ x (nincs ilyen: null). */
export const nextAtLeast=(x:number,list:readonly number[])=>list.find(v=>v>=x*(1-1e-9))??null;
