// Ékezet- és kisbetűfüggetlen kereső szinonimákkal és egy elírás tűrésével (tiszta modul, zod nélkül; kliensen fut).
// Rangsor: cím > szinonima > kulcsszó > összefoglaló. Most a kalkulátorok metaadatain fut; a Tudástár cikkei és a szótár ugyanide kerülnek.

export type SearchItem={id:string;title:string;href:string|null;group:string;keywords:readonly string[];synonyms:readonly string[];summary:string;note?:string};
export type SearchHit={item:SearchItem;score:number};

/** Ugyanaz a normalizálás, mint a lib/catalog.ts normalizeSearch-e (NFD, ékezet nélkül, kisbetű, × → x), szóközökkel tagolva. */
export const normalize=(s:string)=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLocaleLowerCase('hu').replace(/×/g,'x').replace(/²/g,'2').replace(/[^\p{L}\p{N}]+/gu,' ').trim();

/** Szinonimacsoportok (normalizált alakban): a lekérdezésben talált tagot a csoport többi tagjával is keressük. */
export const SYNONYM_GROUPS:readonly (readonly string[])[]=[
 ['fi rele','aram vedokapcsolo','avk','rcd','aramvedo'],
 ['konnektor','dugalj','aljzat'],
 ['villanyora','fogyasztasmero'],
 ['106','valtokapcsolo'],
 ['nullazas','tn rendszer'],
 ['biztositek','kismegszakito','automata','mcb'],
 ['kabel vastagsag','vezetek vastagsag','keresztmetszet','hany negyzetes'],
 ['loero','le','hp'],
 ['trafo','transzformator'],
 ['akku','akkumulator'],
 ['cosfi','cos fi','cos phi','teljesitmenytenyezo'],
 ['meddokompenzalas','fazisjavitas','kompenzalas'],
 ['feszultseg eses','feszultseges'],
 ['villanyszamla','fogyasztas'],
];

/** Damerau–Levenshtein (optimális illesztés) távolság, korlátozott (≥ max+1 esetén korán kilép). */
export function editDistance(a:string,b:string,max=2):number{
 if(Math.abs(a.length-b.length)>max)return max+1;
 const d:number[][]=Array.from({length:a.length+1},(_,i)=>[i,...Array(b.length).fill(0)]);
 for(let j=1;j<=b.length;j++)d[0][j]=j;
 for(let i=1;i<=a.length;i++){
  let rowMin=Infinity;
  for(let j=1;j<=b.length;j++){
   const cost=a[i-1]===b[j-1]?0:1;
   d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+cost);
   if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1);
   rowMin=Math.min(rowMin,d[i][j]);
  }
  if(rowMin>max)return max+1;
 }
 return d[a.length][b.length];
}

/** Egy szó illeszkedése: 1 = teljes szó, 0,85 = előtag (1–2 betűs keresőszónál 0,3, hogy egy teljes kulcsszó-találat megelőzze),
 * 0,7 = egy elírással (5 betűnél hosszabb szónál), 0 = nincs. `exact`: a szinonimaváltozatok rövid (1–2 betűs) tagja csak teljes szóra illeszkedik
 * (különben a „hp” → „le” bővítés minden „led…”, „levezetés…” szót megtalálna). */
function wordMatch(token:string,word:string,exact=false){
 if(word===token)return 1;
 if(exact&&token.length<3)return 0;
 if(word.startsWith(token))return token.length>=3?0.85:0.3;
 if(token.length>5&&(editDistance(token,word.slice(0,token.length),1)<=1||editDistance(token,word,1)<=1))return 0.7;
 return 0;
}
const WEIGHTS={title:8,synonym:6,keyword:4,summary:1} as const;
type Prepared={item:SearchItem;title:string;fields:{w:number;words:string[];text:string}[]};
const prepCache=new WeakMap<SearchItem,Prepared>();
function prepare(item:SearchItem):Prepared{
 let p=prepCache.get(item);if(p)return p;
 const title=normalize(item.title),syn=item.synonyms.map(normalize).join(' '),kw=item.keywords.map(normalize).join(' '),sum=normalize(item.summary);
 p={item,title,fields:[{w:WEIGHTS.title,words:title.split(' '),text:title},{w:WEIGHTS.synonym,words:syn.split(' '),text:syn},{w:WEIGHTS.keyword,words:kw.split(' '),text:kw},{w:WEIGHTS.summary,words:sum.split(' '),text:sum}]};
 prepCache.set(item,p);return p;
}
function scoreQuery(p:Prepared,q:string,variant=false){
 const tokens=q.split(' ').filter(Boolean);if(!tokens.length)return 0;
 let total=0;
 for(const t of tokens){
  let best=0;
  for(const f of p.fields){for(const w of f.words){const m=wordMatch(t,w,variant);if(m)best=Math.max(best,m*f.w)}}
  if(!best)return 0;
  total+=best;
 }
 // A címben szereplő teljes lekérdezés: a rövidebb (általánosabb) cím előrébb kerül („teljesítmény” → Villamos teljesítmény).
 if(p.title===q)total+=20;else if(q.length>=3&&(' '+p.title).includes(' '+q))total+=10+2*q.length/p.title.length;
 else if(p.fields.slice(1,3).some(f=>(' '+f.text+' ').includes(' '+q+' ')))total+=6;
 return total;
}
/** A lekérdezés változatai a szinonimacsoportok szerint (az eredeti mindig az első). */
export function expandQuery(query:string):string[]{
 const q=normalize(query),out=[q];
 for(const group of SYNONYM_GROUPS)for(const term of group){
  if((' '+q+' ').includes(' '+term+' '))for(const alt of group)if(alt!==term){const v=(' '+q+' ').replace(' '+term+' ',' '+alt+' ').trim();if(!out.includes(v))out.push(v)}
 }
 return out;
}
export function search(items:readonly SearchItem[],query:string,limit=20):SearchHit[]{
 const variants=expandQuery(query);if(!variants[0])return [];
 const hits:SearchHit[]=[];
 for(const item of items){
  const p=prepare(item);
  let score=0;variants.forEach((v,i)=>{score=Math.max(score,scoreQuery(p,v,i>0)*(i?0.95:1))});
  if(score>0)hits.push({item,score:item.href?score:score*0.9});
 }
 return hits.sort((a,b)=>b.score-a.score||a.item.title.localeCompare(b.item.title,'hu')).slice(0,limit);
}
/** „Erre gondoltál?” – a legközelebbi címszó legfeljebb két elírással (5 betűnél rövidebb keresésnél legfeljebb eggyel), ha a keresés üres. */
export function suggest(items:readonly SearchItem[],query:string):SearchItem|null{
 const q=normalize(query);if(q.length<3)return null;
 let best:SearchItem|null=null,bestD=q.length<5?2:3;
 for(const item of items){for(const w of normalize(item.title).split(' ').concat(item.synonyms.map(normalize))){const d=editDistance(q,w.slice(0,Math.max(q.length,w.length)),2);if(d<bestD){bestD=d;best=item}}}
 return best;
}
