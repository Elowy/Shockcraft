// A sorközi mini-jelölés renderelése (szerverkomponens, innerHTML nélkül). A belső link csak közzétett célra lesz <a>;
// lektorra váró célnál a link szövege marad, „(hamarosan – szakmai lektorálás alatt)” jelöléssel (docs/tudastar.md).
import {Fragment} from 'react';
import {parseInline,typo,type InlineNode} from '@/lib/kb/content/inline';
import type {LinkTarget} from '@/lib/kb/content/registry';

export type Resolve=(id:string,anchor:string|null)=>LinkTarget;
export const PENDING_NOTE='hamarosan – szakmai lektorálás alatt';

function nodes(list:readonly InlineNode[],resolve:Resolve):React.ReactNode[]{
 return list.map((n,i)=>{
  switch(n.k){
   case 'text':return <Fragment key={i}>{typo(n.v)}</Fragment>;
   case 'b':return <strong key={i}>{nodes(n.c,resolve)}</strong>;
   case 'i':return <em key={i}>{nodes(n.c,resolve)}</em>;
   case 'code':return <code key={i}>{n.v}</code>;
   case 'sub':return <sub key={i}>{n.v}</sub>;
   case 'sup':return <sup key={i}>{n.v}</sup>;
   case 'link':{
    const t=resolve(n.to,n.anchor),label=nodes(n.c,resolve);
    if(t&&'href' in t)return <a key={i} href={t.href}>{label}</a>;
    if(t)return <span key={i} className="kk-pending">{label}<span className="kk-pending-note" data-kb-extra=""> ({PENDING_NOTE})</span></span>;
    return <Fragment key={i}>{label}</Fragment>;
   }
  }
 });
}

export function Inline({text,resolve}:{text:string;resolve:Resolve}){return <>{nodes(parseInline(text),resolve)}</>}
