import type {CategoryId} from './core';

/** A kalkulátorok kategóriái a /kalkulatorok oldalon (sorrend = megjelenési sorrend). Kliensbiztos, tiszta adat. */
export const CALC_CATEGORIES:readonly {id:CategoryId;label:string;description:string}[]=[
 {id:'alapok',label:'Alapok',description:'Ohm-törvény, eredő ellenállás, csillag–delta.'},
 {id:'teljesitmeny',label:'Teljesítmény és energia',description:'Teljesítmény, áram, cos φ, fogyasztás, fázisterhelés.'},
 {id:'vezetekek',label:'Vezetékek',description:'Ellenállás, feszültségesés, keresztmetszet, terhelhetőség.'},
 {id:'vedelem',label:'Védelem',description:'Kismegszakító, hurokimpedancia.'},
 {id:'vilagitas',label:'Világítás',description:'Lumen és lux, LED-szalag.'},
 {id:'gepek',label:'Gépek és akkuk',description:'Motor, transzformátor, akkumulátor.'},
 {id:'elektronika',label:'Elektronika',description:'Színkód, osztó, kondenzátor, LED-előtét, rezonancia.'},
 {id:'atvaltok',label:'Átváltók',description:'kW–LE, AWG–mm², kWh–MJ, hőmérséklet.'},
];
export const categoryLabel=(id:string)=>CALC_CATEGORIES.find(c=>c.id===id)?.label??id;
