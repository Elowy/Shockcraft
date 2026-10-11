// Sorközi mini-jelölés (docs/tudastar-terv.md 3.3): saját, tiszta tokenizáló – a szerverkomponens React-elemekké alakítja
// (components/kezikonyv/article/inline.tsx), innerHTML nélkül; a nem értelmezhető jelölés sima szöveg marad (a „<script>” is).
//   **félkövér**  _dőlt_  `kód`  X_{alsó index}  X^{felső index}  [[cél-id#horgony|szöveg]]  [[cél-id]]
// A dőlt jelölés csak szóhatáron nyílik és zárul („_meleg_”), így a szó belsejében álló aláhúzás nem dőlt.
// Kliensoldali kód nem importálja (tests/kb-guards.ts): a cikkek szövege SSR-ben készül, a böngészőbe nem kerül parser.

export type InlineNode=
 |{k:'text';v:string}
 |{k:'b';c:InlineNode[]}
 |{k:'i';c:InlineNode[]}
 |{k:'code';v:string}
 |{k:'sub';v:string}
 |{k:'sup';v:string}
 |{k:'link';to:string;anchor:string|null;c:InlineNode[]};

const OPEN_BEFORE=/[\s(„"'\-–—/]/u,CLOSE_AFTER=/[\s.,;:!?)”"'\-–—/]/u;

function pushText(out:InlineNode[],v:string){if(!v)return;const last=out[out.length-1];if(last&&last.k==='text')last.v+=v;else out.push({k:'text',v})}

/** A szöveg sorközi elemei. Soha nem dob; ismeretlen vagy lezáratlan jelölés szövegként marad. */
export function parseInline(s:string):InlineNode[]{
 const out:InlineNode[]=[];let i=0,buf='';
 const flush=()=>{pushText(out,buf);buf=''};
 while(i<s.length){
  const c=s[i];
  if(c==='*'&&s[i+1]==='*'){
   const j=s.indexOf('**',i+2);
   if(j>i+2){flush();out.push({k:'b',c:parseInline(s.slice(i+2,j))});i=j+2;continue}
  }else if(c==='['&&s[i+1]==='['){
   const j=s.indexOf(']]',i+2);
   if(j>i+2){
    const body=s.slice(i+2,j),bar=body.indexOf('|'),target=bar<0?body:body.slice(0,bar),label=bar<0?'':body.slice(bar+1);
    const m=/^([a-z0-9-]+)(?:#([a-z0-9-]+))?$/.exec(target.trim());
    if(m){flush();out.push({k:'link',to:m[1],anchor:m[2]??null,c:label?parseInline(label):[{k:'text',v:m[1]}]});i=j+2;continue}
   }
  }else if(c==='`'){
   const j=s.indexOf('`',i+1);
   if(j>i+1){flush();out.push({k:'code',v:s.slice(i+1,j)});i=j+1;continue}
  }else if((c==='_'||c==='^')&&s[i+1]==='{'){
   const j=s.indexOf('}',i+2);
   if(j>i+2){flush();out.push({k:c==='_'?'sub':'sup',v:s.slice(i+2,j)});i=j+1;continue}
  }else if(c==='_'&&(i===0||OPEN_BEFORE.test(s[i-1]))&&s[i+1]&&!/\s/.test(s[i+1])){
   let j=i+1;
   while((j=s.indexOf('_',j))>0){if(!/\s/.test(s[j-1])&&(j+1===s.length||CLOSE_AFTER.test(s[j+1])))break;j++}
   if(j>i+1){flush();out.push({k:'i',c:parseInline(s.slice(i+1,j))});i=j+1;continue}
  }
  buf+=c;i++;
 }
 flush();
 return out;
}

/** A csomópontok olvasható szövege (a jelölés nélkül). */
export function plainText(nodes:readonly InlineNode[]):string{
 let s='';
 for(const n of nodes)s+=n.k==='text'||n.k==='code'||n.k==='sub'||n.k==='sup'?n.v:plainText(n.c);
 return s;
}
export const inlinePlain=(s:string)=>plainText(parseInline(s));

/** A szövegben szereplő belső linkek. */
export function inlineLinks(s:string):{to:string;anchor:string|null}[]{
 const out:{to:string;anchor:string|null}[]=[];
 const walk=(ns:readonly InlineNode[])=>{for(const n of ns){if(n.k==='link'){out.push({to:n.to,anchor:n.anchor});walk(n.c)}else if(n.k==='b'||n.k==='i')walk(n.c)}};
 walk(parseInline(s));
 return out;
}

/** Ékezet nélküli, kisbetűs, kötőjeles azonosító (címsor-horgony, szótári horgony). */
export const slugify=(s:string)=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

/** Tipográfia a megjelenítéshez: nem törő szóköz a szám és a mértékegység, illetve az ezres csoportok között (2,5 mm², 3 600 000 J). */
const UNIT='(?:[kMmµ]?(?:Wh|VA|var|Hz|Ah|Wb|lm|lx|cd|Ω|V|A|W|J|C|F|K|T|s|h|g|l)|mm²|m²|mm|km|cm|m|°C|%|perc|Ft|db|nm|mired|mWb)';
const UNIT_RE=new RegExp('(\\d) (?='+UNIT+'(?![\\p{L}\\p{N}]))','gu');
export const typo=(s:string)=>s.replace(/(\d) (?=\d{3}(?!\d))/g,'$1 ').replace(UNIT_RE,'$1 ');
