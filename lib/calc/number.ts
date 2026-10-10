// Számbevitel és -kiírás a kalkulátorokhoz (tiszta modul, zod és lib/plan nélkül; kliensen is fut).
// A lib/catalog-csv.ts parseHuf-ja szándékosan nincs újrahasználva: ott „1.500” = 1500 Ft, itt „1.500” = 1,5.

export type NumOptions={min?:number;max?:number;integer?:boolean;allowNegative?:boolean;positive?:boolean};
export type NumParse={ok:true;value:number}|{ok:false;empty:boolean;message:string};

export const NUM_MESSAGES={
 empty:'Add meg az értéket.',
 invalid:'Csak számot írj; a mértékegységet mellette választhatod.',
 negative:'Nem lehet negatív.',
 positive:'Nullánál nagyobb számot adj meg.',
 integer:'Egész számot adj meg.',
} as const;

const SPACE='[\\u00a0\\u202f\\u2009\\u2007 ]',HAS_SPACE=new RegExp(SPACE),ALL_SPACE=new RegExp(SPACE,'g'),GROUPS=new RegExp('^\\d{1,3}(?:'+SPACE+'\\d{3})+$');
const fmtCache=new Map<string,Intl.NumberFormat>();
/** A hu-HU alapértelmezett csoportosítása: négyjegyű számnál nincs ezreselválasztó (6570), ötjegyűtől nem törő szóköz (12 345). */
function nf(min:number,max:number){
 const key=min+':'+max;let f=fmtCache.get(key);
 if(!f){f=new Intl.NumberFormat('hu-HU',{minimumFractionDigits:min,maximumFractionDigits:max});fmtCache.set(key,f)}
 return f;
}

/** Egy szám olvasása a beviteli mezőből.
 * - NFKC, trim; a szóköz, a nem törő és a vékony szóköz ezreselválasztó (csak szabályos hármas csoportokkal).
 * - Ha csak vessző vagy csak pont van, az a tizedesjel („1.500” = 1,5); ha mindkettő, az utolsó a tizedesjel, a másik csak ezres csoportot választhat el.
 * - Elfogadja a unicode mínuszt (−) és a normálalakot (1e3, 2,5e−3). */
export function parseNum(raw:string,opt:NumOptions={}):NumParse{
 let t=(raw??'').normalize('NFKC').trim().replace(/[\u2212\u2012\u2013]/g,'-');
 if(!t)return {ok:false,empty:true,message:NUM_MESSAGES.empty};
 const bad:NumParse={ok:false,empty:false,message:NUM_MESSAGES.invalid};
 let sign='';
 if(t[0]==='-'||t[0]==='+'){sign=t[0]==='-'?'-':'';t=t.slice(1).trim()}
 // Normálalak leválasztása (a kitevő maga is lehet negatív).
 let exp='';const m=t.match(/^(.*?)[eE]([+-]?\d{1,3})$/);
 if(m){t=m[1];exp='e'+m[2]}
 // Szóközös ezres csoportok: „1 000”, „12 345,5”.
 if(HAS_SPACE.test(t)){if(!GROUPS.test(t.split(/[,.]/)[0]))return bad;t=t.replace(ALL_SPACE,'')}
 const commas=(t.match(/,/g)||[]).length,dots=(t.match(/\./g)||[]).length;
 if(commas&&dots){
  const dec=t.lastIndexOf(',')>t.lastIndexOf('.')?',':'.',thou=dec===','?'.':',';
  const [int,frac]=[t.slice(0,t.lastIndexOf(dec)),t.slice(t.lastIndexOf(dec)+1)];
  if(!new RegExp('^\\d{1,3}(?:\\'+thou+'\\d{3})+$').test(int)||!/^\d+$/.test(frac))return bad;
  t=int.split(thou).join('')+'.'+frac;
 }else if(commas+dots>1)return bad;
 else t=t.replace(',','.');
 if(!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(t))return bad;
 const value=Number(sign+t+exp);
 if(!Number.isFinite(value))return bad;
 return checkRange(value===0?0:value,opt);
}

/** Tartomány- és egészérték-ellenőrzés magyar hibaüzenettel. */
export function checkRange(value:number,{min,max,integer,allowNegative,positive}:NumOptions={}):NumParse{
 if(!Number.isFinite(value))return {ok:false,empty:false,message:NUM_MESSAGES.invalid};
 if(value<0&&!allowNegative&&(min===undefined||min>=0))return {ok:false,empty:false,message:NUM_MESSAGES.negative};
 if(positive&&!(value>0))return {ok:false,empty:false,message:NUM_MESSAGES.positive};
 if(integer&&!Number.isInteger(value))return {ok:false,empty:false,message:NUM_MESSAGES.integer};
 if(min!==undefined&&value<min)return {ok:false,empty:false,message:'Legalább '+formatNum(min)+' legyen.'};
 if(max!==undefined&&value>max)return {ok:false,empty:false,message:'Legfeljebb '+formatNum(max)+' lehet.'};
 return {ok:true,value};
}

/** Tizedesjegyek száma a kiíráshoz: 1 fölött 4 értékes jegy, legfeljebb 3 tizedes (az egészrészt nem kerekítjük);
 * 1 alatt 4 értékes jegy, legfeljebb 6 tizedes. */
export function decimalsFor(n:number){
 const a=Math.abs(n);if(!(a>0)||!Number.isFinite(a))return 0;
 const mag=Math.floor(Math.log10(a));
 return a>=1?Math.max(0,Math.min(3,4-mag)):Math.max(0,Math.min(6,3-mag));
}
const minus=(s:string)=>s.replace(/^-/,'\u2212');
/** Magyar számformátum (tizedesvessző, nem törő szóköz ezreselválasztó, „−” mínuszjel). */
export function formatNum(n:number,decimals?:number):string{
 if(!Number.isFinite(n))return '–';
 const d=decimals??decimalsFor(n);
 const s=nf(0,d).format(n);
 return s==='-0'?'0':minus(s);
}
/** Rögzített tizedesjegyű kiírás (pl. pénznél 0, százaléknál 1–2). */
export const formatFixed=(n:number,decimals:number)=>Number.isFinite(n)?minus(nf(decimals,decimals).format(n)):'–';
export const formatInt=(n:number)=>formatNum(Math.round(n),0);

const PREFIXES:[number,string][]=[[1e9,'G'],[1e6,'M'],[1e3,'k'],[1,''],[1e-3,'m'],[1e-6,'µ'],[1e-9,'n'],[1e-12,'p']];
/** SI-előtagos kiírás: 0,0123 A → „12,3 mA”, 4700 Ω → „4,7 kΩ”. A `units` megadásával csak az ott felsorolt előtagok jöhetnek szóba. */
export function formatSI(n:number,unit:string,{allow}:{allow?:string[]}={}):string{
 if(!Number.isFinite(n))return '–';
 if(n===0)return '0\u00a0'+unit;
 const list=PREFIXES.filter(([,p])=>!allow||allow.includes(p));
 const a=Math.abs(n);
 const [f,p]=list.find(([f])=>a>=f*(1-1e-12))??list[list.length-1];
 return formatNum(n/f)+'\u00a0'+p+unit;
}
/** Mértékegységes kiírás nem törő szóközzel. */
export const withUnit=(text:string,unit:string)=>unit?text+'\u00a0'+unit:text;

/** Két szám összehasonlító kiírása: ha a kerekítés egyenlőséget mutatna („5 % > 5 %”), de a két érték eltér, több tizedessel. */
export function formatCompare(a:number,b:number,decimals?:number):[string,string]{
 let d=decimals??Math.max(decimalsFor(a),decimalsFor(b));
 let x=formatNum(a,d),y=formatNum(b,d);
 for(let k=d+1;x===y&&a!==b&&k<=9;k++){x=formatNum(a,k);y=formatNum(b,k);d=k}
 return [x,y];
}

/** Lebegőpontos tűréssel vett ≤ (a pontos egyenlőség, pl. 90 · 0,7 = 63, lebegőpontos hibával is teljesüljön). */
export const atMostTol=(a:number,b:number)=>a<=b+1e-9*Math.max(1,Math.abs(b));
