// A cikktörzs blokkjainak renderelése (szerverkomponens, kliens-JS nélkül). A szöveg a forrásvázlattal azonos (tests/kb-content.ts
// hűségteszt); a renderelő csak formát ad: dobozok, képletsor, táblázat, kidolgozott példa, ábra, szótári tételek.
import {ShieldAlert,TriangleAlert} from 'lucide-react';
import {inlinePlain} from '@/lib/kb/content/inline';
import type {KbBlock} from '@/lib/kb/content/types';
import {DiagramFigure,type DiagramSource} from '../diagram/diagram-figure';
import {ArticleFigure} from '../figures';
import {Inline,type Resolve} from './inline';

/** `diagrams`: a cikk netlistás bekötési ábrái (ábra-id → fő ábra és változatai; csak közzétett R3 cikknél – registry.diagramsOf). */
export type BlockContext={slug:string;resolve:Resolve;diagrams?:Readonly<Record<string,readonly DiagramSource[]>>};

function figureNumbers(blocks:readonly KbBlock[]){
 const map=new Map<string,number>();let n=0;
 const walk=(bs:readonly KbBlock[])=>{for(const b of bs){if(b.t==='figure')map.set(b.id,++n);else if(b.t==='example'||b.t==='sim')walk(b.blocks)}};
 walk(blocks);return map;
}

/** A cikk sim-blokkjainak vezetéktáblázatai: netlistafájl-nevek (a figura saját „Vezetékek táblázatban” része ezeknél elmarad). */
function wireSrcs(blocks:readonly KbBlock[]):Set<string>{
 const out=new Set<string>();
 const walk=(bs:readonly KbBlock[])=>{for(const b of bs){if(b.t==='sim'){if(b.kind==='vezetekek')for(const x of b.src)out.add(x);walk(b.blocks)}else if(b.t==='example')walk(b.blocks)}};
 walk(blocks);return out;
}
/** Táblázatonként egyedi hozzáférhető név (landmark-unique): azonos fejléc esetén sorszám (1/2, 2/2) kerül a névbe. */
function tableLabels(blocks:readonly KbBlock[]):Map<KbBlock,string>{
 const base=new Map<KbBlock,string>(),count=new Map<string,number>(),seen=new Map<string,number>(),out=new Map<KbBlock,string>();
 const walk=(bs:readonly KbBlock[])=>{for(const b of bs){
  if(b.t==='table'){const l='Táblázat: '+b.head.map(inlinePlain).filter(Boolean).join(', ');base.set(b,l);count.set(l,(count.get(l)??0)+1)}
  else if(b.t==='example'||b.t==='sim')walk(b.blocks);
 }};
 walk(blocks);
 for(const [b,l] of base){const total=count.get(l)!,i=(seen.get(l)??0)+1;seen.set(l,i);out.set(b,total>1?l+' ('+i+'/'+total+')':l)}
 return out;
}

function Block({b,ctx,figNo,labels,wired}:{b:KbBlock;ctx:BlockContext;figNo:Map<string,number>;labels:Map<KbBlock,string>;wired:Set<string>}){
 const I=(text:string)=><Inline text={text} resolve={ctx.resolve}/>;
 switch(b.t){
  case 'rovid':return <aside className="kk-rovid" aria-label="Röviden"><p><strong>Röviden:</strong> {I(b.text)}</p></aside>;
  case 'callout':return b.kind==='veszely'
   // R3: nem zárható felső veszély-doboz (a figyelmeztetés-könyvtár tételét tartalmazza – scripts/kb-content/generate.ts checkR3).
   ?<aside className="kk-callout kk-callout-danger" role="note" aria-label="Életveszély"><ShieldAlert aria-hidden="true"/><div><p><strong>{b.label}.</strong> {I(b.text)}</p></div></aside>
   :<aside className="kk-callout kk-callout-warn" role="note" aria-label={b.label}><TriangleAlert aria-hidden="true"/><div><p><strong>{b.label}:</strong> {I(b.text)}</p></div></aside>;
  case 'h2':return <h2 id={b.id}>{I(b.text)}</h2>;
  case 'h3':return <h3 id={b.id}>{I(b.text)}</h3>;
  case 'p':return <p>{b.lines.map((l,i)=><span key={i}>{i>0&&<br/>}{I(l)}</span>)}</p>;
  case 'formula':return <p className="kk-formula">{I(b.text)}</p>;
  case 'ul':return <ul>{b.items.map((x,i)=><li key={i}>{I(x)}</li>)}</ul>;
  case 'ol':return <ol>{b.items.map((x,i)=><li key={i}>{I(x)}</li>)}</ol>;
  case 'table':{
   const label=labels.get(b)??'Táblázat: '+b.head.map(inlinePlain).filter(Boolean).join(', ');
   return <div className="kk-table-wrap" role="region" aria-label={label} tabIndex={0}><table className="kk-table">
    <thead><tr>{b.head.map((h,i)=><th key={i} scope="col">{h?I(h):null}</th>)}</tr></thead>
    <tbody>{b.rows.map((r,i)=><tr key={i}>{r.map((c,j)=>j===0?<th key={j} scope="row">{I(c)}</th>:<td key={j}>{I(c)}</td>)}</tr>)}</tbody>
   </table></div>;
  }
  case 'figure':{
   const dg=ctx.diagrams?.[b.id],n=figNo.get(b.id)??0;
   // Netlistás bekötési ábra (R3, csak közzétéve): a fő ábra, alatta a változatok (pl. 2 × 107) – mind egymás alatt, saját nézetváltóval
   // (változatválasztó nincs). Felirat: „1. ábra, 2. változat.” + a változat címe; a figura saját vezetéktáblája elmarad, ha a cikk
   // ugyanazt a táblázatot sim-blokkban adja.
   if(dg)return <>{dg.map((src,i)=><DiagramFigure key={src.netlist.id} src={src} figId={i?b.id+'-'+(i+1):b.id} n={n} caption={b.caption}
    wires={!(src.file&&wired.has(src.file))} {...(dg.length>1?{variant:{no:i+1,text:i?src.netlist.title:b.caption}}:{})}/>)}</>;
   return <ArticleFigure slug={ctx.slug} block={b} n={n}/>;
  }
  case 'sim':return <div className="kk-sim" data-sim={b.kind}>{b.blocks.map((x,i)=><Block key={i} b={x} ctx={ctx} figNo={figNo} labels={labels} wired={wired}/>)}</div>;
  case 'example':return <div className="kk-example-box" role="group" aria-label="Kidolgozott példa">{b.blocks.map((x,i)=><Block key={i} b={x} ctx={ctx} figNo={figNo} labels={labels} wired={wired}/>)}</div>;
  case 'terms':return <dl className="kk-terms">{b.items.map(t=><div key={t.id} className="kk-term" id={t.id}>
   <dt><dfn>{t.term}</dfn>{t.note&&<span className="kk-term-note"> ({t.note})</span>}</dt>
   <dd>{I(t.text)}</dd>
  </div>)}</dl>;
 }
}

/** A cikk törzse (data-kb-body: a hűségteszt ezt a részt veti össze a forrásvázlattal). */
export function ArticleBlocks({blocks,ctx}:{blocks:readonly KbBlock[];ctx:BlockContext}){
 const figNo=figureNumbers(blocks),labels=tableLabels(blocks),wired=wireSrcs(blocks);
 return <div className="kk-prose" data-kb-body="">{blocks.map((b,i)=><Block key={i} b={b} ctx={ctx} figNo={figNo} labels={labels} wired={wired}/>)}</div>;
}
