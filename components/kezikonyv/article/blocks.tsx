// A cikktörzs blokkjainak renderelése (szerverkomponens, kliens-JS nélkül). A szöveg a forrásvázlattal azonos (tests/kb-content.ts
// hűségteszt); a renderelő csak formát ad: dobozok, képletsor, táblázat, kidolgozott példa, ábra, szótári tételek.
import {TriangleAlert} from 'lucide-react';
import {inlinePlain} from '@/lib/kb/content/inline';
import type {KbBlock} from '@/lib/kb/content/types';
import {ArticleFigure} from '../figures';
import {Inline,type Resolve} from './inline';

export type BlockContext={slug:string;resolve:Resolve};

function figureNumbers(blocks:readonly KbBlock[]){
 const map=new Map<string,number>();let n=0;
 const walk=(bs:readonly KbBlock[])=>{for(const b of bs){if(b.t==='figure')map.set(b.id,++n);else if(b.t==='example')walk(b.blocks)}};
 walk(blocks);return map;
}

function Block({b,ctx,figNo}:{b:KbBlock;ctx:BlockContext;figNo:Map<string,number>}){
 const I=(text:string)=><Inline text={text} resolve={ctx.resolve}/>;
 switch(b.t){
  case 'rovid':return <aside className="kk-rovid" aria-label="Röviden"><p><strong>Röviden:</strong> {I(b.text)}</p></aside>;
  case 'callout':return <aside className="kk-callout kk-callout-warn" role="note" aria-label={b.label}><TriangleAlert aria-hidden="true"/><div><p><strong>{b.label}:</strong> {I(b.text)}</p></div></aside>;
  case 'h2':return <h2 id={b.id}>{I(b.text)}</h2>;
  case 'h3':return <h3 id={b.id}>{I(b.text)}</h3>;
  case 'p':return <p>{b.lines.map((l,i)=><span key={i}>{i>0&&<br/>}{I(l)}</span>)}</p>;
  case 'formula':return <p className="kk-formula">{I(b.text)}</p>;
  case 'ul':return <ul>{b.items.map((x,i)=><li key={i}>{I(x)}</li>)}</ul>;
  case 'ol':return <ol>{b.items.map((x,i)=><li key={i}>{I(x)}</li>)}</ol>;
  case 'table':{
   const label='Táblázat: '+b.head.map(inlinePlain).filter(Boolean).join(', ');
   return <div className="kk-table-wrap" role="region" aria-label={label} tabIndex={0}><table className="kk-table">
    <thead><tr>{b.head.map((h,i)=><th key={i} scope="col">{h?I(h):null}</th>)}</tr></thead>
    <tbody>{b.rows.map((r,i)=><tr key={i}>{r.map((c,j)=>j===0?<th key={j} scope="row">{I(c)}</th>:<td key={j}>{I(c)}</td>)}</tr>)}</tbody>
   </table></div>;
  }
  case 'figure':return <ArticleFigure slug={ctx.slug} block={b} n={figNo.get(b.id)??0}/>;
  case 'example':return <div className="kk-example-box" role="group" aria-label="Kidolgozott példa">{b.blocks.map((x,i)=><Block key={i} b={x} ctx={ctx} figNo={figNo}/>)}</div>;
  case 'terms':return <dl className="kk-terms">{b.items.map(t=><div key={t.id} className="kk-term" id={t.id}>
   <dt><dfn>{t.term}</dfn>{t.note&&<span className="kk-term-note"> ({t.note})</span>}</dt>
   <dd>{I(t.text)}</dd>
  </div>)}</dl>;
 }
}

/** A cikk törzse (data-kb-body: a hűségteszt ezt a részt veti össze a forrásvázlattal). */
export function ArticleBlocks({blocks,ctx}:{blocks:readonly KbBlock[];ctx:BlockContext}){
 const figNo=figureNumbers(blocks);
 return <div className="kk-prose" data-kb-body="">{blocks.map((b,i)=><Block key={i} b={b} ctx={ctx} figNo={figNo}/>)}</div>;
}
