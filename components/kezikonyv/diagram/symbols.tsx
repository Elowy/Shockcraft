// A Tudástár bekötési ábráinak saját, IEC 60617-stílusú szimbólumkészlete (docs/tudastar-terv.md 3.4; docs/tudastar.md „Sémák és
// ábramotor”). Tiszta geometria: minden szimbólum rajzelemek (Prim) listája abszolút koordinátákkal, így ugyanaz a lista adja a
// szerveroldali SVG-t (Bekötés nézet), a lektori csomag vektoros PDF-ábráját (scripts/lektori-csomag.ts) és a rajz = netlista teszt
// (tests/kb-diagram.ts) alapját. Színek csak osztályokkal (kezikonyv.css .kk-dg …), a vezetékszínek az ér-tokenekből.
//
// A kapcsok helyét az elrendezés (content/tudastar/diagramok/<id>.json) adja; a szimbólum a kapocspontokhoz igazodva rajzolja a belső
// csonkokat és – a kapcsolóknál, védelmeknél – a választó állásonkénti érintkezőit (data-sel, data-state, data-pair). Saját rajz, külső
// ábra vagy betűkép nincs.
import type {NlComponent} from '@/lib/kb/circuit';

export type Pt=readonly [number,number];
export type PrimCls=string;
export type Prim=
 |{k:'line';a:Pt;b:Pt;cls:PrimCls;data?:Record<string,string>}
 |{k:'poly';pts:readonly Pt[];closed?:boolean;cls:PrimCls;data?:Record<string,string>}
 |{k:'rect';x:number;y:number;w:number;h:number;rx?:number;cls:PrimCls;data?:Record<string,string>}
 |{k:'circle';c:Pt;r:number;cls:PrimCls;data?:Record<string,string>}
 |{k:'text';at:Pt;s:string;anchor?:'start'|'middle'|'end';size?:number;cls?:PrimCls;data?:Record<string,string>};

/** Az elrendezés egy alkatrésze: doboz (x, y, w, h), a kapcsok abszolút helye, és opcionálisan a feliratok helye. `side`: melyik
 * oldalon vannak a kapcsok (a belső rajz és a kapocsfeliratok iránya – ez a „forgatás”); `mirror`: tükrözött belső rajz. */
export type DgSide='left'|'right'|'top'|'bottom';
export type DgPart={
 x:number;y:number;w:number;h:number;side?:DgSide|'inside';mirror?:boolean;
 terms:Readonly<Record<string,Pt>>;
 /** Kapcsonkénti oldal (felülírja a `side`-ot): pl. a kétpólusú kapcsoló bemenetei balra, kimenetei jobbra. */
 sides?:Readonly<Record<string,DgSide>>;
 /** A kapocsfeliratok szövege (alapból a kapocs azonosítója) és helye (alapból az oldal szerint). */
 tt?:Readonly<Record<string,string>>;tl?:Readonly<Record<string,Pt|{at:Pt;anchor?:'start'|'middle'|'end'}>>;
 /** Az alkatrész felirata (alapból a netlista label mezője) és helye; `lines`: több soros felirat. */
 label?:{at:Pt;anchor?:'start'|'middle'|'end';lines?:readonly string[]};
 /** Szimbólumfüggő beállítások (pl. a kapcsoló belső rajzának mélysége, a föld vonalának hossza). */
 opt?:Readonly<Record<string,number|string|boolean>>;
};
export type SymCtx={comp:NlComponent;part:DgPart;term:(tid:string)=>Pt};

const r1=(n:number)=>Math.round(n*10)/10;
export const P=(x:number,y:number):Pt=>[r1(x),r1(y)];
const line=(a:Pt,b:Pt,cls='sym',data?:Record<string,string>):Prim=>({k:'line',a,b,cls,...(data?{data}:{})});
const poly=(pts:readonly Pt[],cls='sym',closed=false,data?:Record<string,string>):Prim=>({k:'poly',pts,closed,cls,...(data?{data}:{})});
const rect=(x:number,y:number,w:number,h:number,cls='sym',rx=0,data?:Record<string,string>):Prim=>({k:'rect',x,y,w,h,rx,cls,...(data?{data}:{})});
const circle=(c:Pt,r:number,cls='sym',data?:Record<string,string>):Prim=>({k:'circle',c,r,cls,...(data?{data}:{})});
const text=(at:Pt,s:string,anchor:'start'|'middle'|'end'='middle',size=11,cls='t',data?:Record<string,string>):Prim=>({k:'text',at,s,anchor,size,cls,...(data?{data}:{})});
const add=(a:Pt,dx:number,dy:number)=>P(a[0]+dx,a[1]+dy);
/** Ív sokszögként (a PDF és a teszt egyszerű elemeket kap): középpont, sugár, kezdő és záró szög fokban. */
export function arc(c:Pt,r:number,a0:number,a1:number,n=14):Pt[]{const out:Pt[]=[];for(let i=0;i<=n;i++){const a=(a0+(a1-a0)*i/n)*Math.PI/180;out.push(P(c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)))}return out}

/** A kapocs oldala (kapcsonkénti felülírással). */
export const sideOf=(part:DgPart,tid?:string)=>(tid!==undefined?part.sides?.[tid]:undefined)??part.side??'left';
/** A kapcsok belső végpontja: a kapocsponttól a doboz belseje felé `depth` egységgel (a kapocs oldala szerint). */
export function inward(part:DgPart,t:Pt,depth:number,tid?:string):Pt{
 const s=sideOf(part,tid);
 return s==='top'?add(t,0,depth):s==='bottom'?add(t,0,-depth):s==='right'?add(t,-depth,0):s==='left'?add(t,depth,0):t;
}
/** A szimbólum rajzelemei a kapcsokhoz igazítva. Az állásfüggő érintkezők data-sel/data-state attribútumot kapnak (Működés nézet). */
export type SymbolOut={prims:Prim[];contacts:Prim[]};

// ---------------------------------------------------------------- Érintkezők (kapcsolók, kismegszakító, FI-relé, nyomógomb)
type Sel={id:string;states:readonly {name:string;connect?:readonly (readonly string[])[]}[]};
/** A választók (states vagy keys) a netlista szerint, a sim.py elnevezésével (kulcsos: „<komp>.<kulcs>”). */
export function selectorsOf(c:NlComponent):Sel[]{
 if(c.states)return [{id:c.id,states:c.states}];
 return (c.keys??[]).map(k=>({id:c.id+'.'+k.id,states:k.states}));
}
/**
 * Egy választó állásonkénti érintkezőrajza. Zárt pár: emelő a forgópontból (a pár első kapcsa, `pivot`) a másik kapocs érintkezőpontjáig;
 * nyitott állás: ugyanaz az emelő elforgatva és rövidebben (rés az érintkezőpont előtt). `pivotOf` / `contactOf`: a kapcsok belső pontjai.
 */
function levers(ctx:SymCtx,pivotOf:(tid:string)=>Pt,contactOf:(tid:string)=>Pt,openAngle=-26):Prim[]{
 const out:Prim[]=[];
 for(const sel of selectorsOf(ctx.comp)){
  const all:(readonly string[])[]=[];
  for(const s of sel.states)for(const p of s.connect??[])if(!all.some(q=>q[0]===p[0]&&q[1]===p[1]))all.push(p);
  for(const s of sel.states){
   const data=(extra:Record<string,string>)=>({sel:sel.id,state:s.name,...extra});
   if((s.connect??[]).length){
    for(const [a,b] of s.connect!)out.push(line(pivotOf(a),contactOf(b),'contact',data({pair:ctx.comp.id+'.'+a+' '+ctx.comp.id+'.'+b})));
   }else{
    // Nyitott állás: minden, más állásban zárt pár emelője nyitva (a mozgó érintkező a forgópontnál marad).
    for(const [a,b] of all){
     const p0=pivotOf(a),p1=contactOf(b),ang=Math.atan2(p1[1]-p0[1],p1[0]-p0[0])+(ctx.part.mirror?-1:1)*openAngle*Math.PI/180,len=Math.hypot(p1[0]-p0[0],p1[1]-p0[1])*0.86;
     out.push(line(p0,P(p0[0]+len*Math.cos(ang),p0[1]+len*Math.sin(ang)),'contact',data({open:ctx.comp.id+'.'+a+' '+ctx.comp.id+'.'+b})));
    }
   }
  }
 }
 return out;
}
/** A kapcsok csonkjai: a kapocsponttól a belső pontig (data-stub = a kapocs kulcsa). */
const stubs=(ctx:SymCtx,ids:readonly string[],to:(tid:string)=>Pt)=>ids.map(id=>line(ctx.term(id),to(id),'sym',{stub:ctx.comp.id+'.'+id}));
const tids=(c:NlComponent)=>c.terminals.map(t=>t.id);
const box=(p:DgPart,cls='sym-box',rx=3)=>rect(p.x,p.y,p.w,p.h,cls,rx);

/** Kapcsoló (101, 102, 105, 106, 106+6, 107): doboz, a kapcsok a doboz egyik oldalán; forgópont a kapcsoló mélyén, érintkezőpont a csonk végén. */
function switchSymbol(ctx:SymCtx):SymbolOut{
 const {comp,part}=ctx,ty=comp.type,depthC=Number(part.opt?.contact??11),depthP=Number(part.opt?.pivot??25);
 const pivots=new Set<string>(),sels=selectorsOf(comp);
 // Forgópont: a választó minden zárt párjában első helyen álló kapocs (101: L, 105: L, 106: C, 106+6: C1/C2); a 107-esnél és a
 // 102-esnél a pár első kapcsa (A1/A2, illetve L/N) – ott a „forgópont” a bemenő oldal.
 for(const s of sels)for(const st of s.states)for(const p of st.connect??[])pivots.add(p[0]);
 const ids=tids(comp);
 const prims:Prim[]=[box(part)];
 const pivotPt=(id:string)=>inward(part,ctx.term(id),pivots.has(id)&&ty!=='kapcsolo-107'&&ty!=='kapcsolo-102'?depthP:depthC,id);
 const contactPt=(id:string)=>inward(part,ctx.term(id),ty==='kapcsolo-107'?Number(part.opt?.out??depthP):depthC,id);
 // 107: a bemenő pár (A) csonkja rövid, a kimenő páré (B) hosszú, így az egyenes állás két párhuzamos, a keresztezett két metsző emelő.
 const stubEnd=(id:string)=>ty==='kapcsolo-107'?(id.startsWith('A')?pivotPt(id):contactPt(id)):pivots.has(id)?pivotPt(id):contactPt(id);
 prims.push(...stubs(ctx,ids,stubEnd));
 for(const id of ids)if(pivots.has(id)&&ty!=='kapcsolo-107')prims.push(circle(stubEnd(id),1.8,'sym-dot'));
 // A 102-es két pólusa együtt mozog: szaggatott mechanikus kapcsolat a két (zárt állású) emelő közepe között.
 if(ty==='kapcsolo-102'){
  const closed=sels[0]?.states.find(st=>(st.connect??[]).length===2)?.connect??[];
  if(closed.length===2){
   const mid=(p:readonly string[])=>{const a=pivotPt(p[0]),b=contactPt(p[1]);return P((a[0]+b[0])/2,(a[1]+b[1])/2)};
   const m0=mid(closed[0]),m1=mid(closed[1]),off=Number(part.opt?.link??0);
   prims.push(line(add(m0,off,0),add(m1,off,0),'sym-link'));
  }
 }
 if(ty==='kapcsolo-106-6'&&part.opt?.divider!==undefined){const x=Number(part.opt.divider);prims.push(line(P(x,part.y+3),P(x,part.y+part.h-3),'sym-thin'))}
 return {prims,contacts:levers(ctx,pivotPt,contactPt)};
}

/** Kismegszakító (egy- vagy háromfázisú): kapcsok két szemközti oldalon, pólusonként érintkező és „×” jel; több pólusnál mechanikus kapcsolat. */
function breakerSymbol(ctx:SymCtx):SymbolOut{
 const {comp,part}=ctx,prims:Prim[]=[box(part)];
 const sel=selectorsOf(comp)[0];
 const pairs:(readonly string[])[]=[];for(const s of sel?.states??[])for(const p of s.connect??[])if(!pairs.some(q=>q[0]===p[0]))pairs.push(p);
 const depth=Number(part.opt?.depth??8);
 const into=(id:string)=>{const t=ctx.term(id);const horiz=Math.abs(t[0]-part.x)<0.01||Math.abs(t[0]-(part.x+part.w))<0.01;return horiz?(t[0]<part.x+part.w/2?add(t,depth,0):add(t,-depth,0)):(t[1]<part.y+part.h/2?add(t,0,depth):add(t,0,-depth))};
 prims.push(...stubs(ctx,tids(comp),into));
 for(const [a,b] of pairs){
  const pa=into(a),pb=into(b),mx=(pa[0]+pb[0])/2,my=(pa[1]+pb[1])/2,horiz=Math.abs(pa[1]-pb[1])<0.01;
  // „×” a mozgó érintkező rögzített végénél (IEC: megszakító); a hő- és mágneses kioldóra utaló kis négyzet a pólus mellett.
  const xc=horiz?P(pb[0]-1,pb[1]):P(pb[0],pb[1]-1),s=3;
  prims.push(line(add(xc,-s,-s),add(xc,s,s),'sym'),line(add(xc,-s,s),add(xc,s,-s),'sym'));
  prims.push(horiz?rect(mx-4,my-12,8,5,'sym-thin',1):rect(mx+7,my-4,5,8,'sym-thin',1));
 }
 if(pairs.length>1){const ms=pairs.map(([a,b])=>{const pa=into(a),pb=into(b);return P((pa[0]+pb[0])/2,(pa[1]+pb[1])/2)});prims.push(poly(ms.map(m=>add(m,0,-5)),'sym-link'))}
 return {prims,contacts:levers(ctx,into,into,-24)};
}

/** Áram-védőkapcsoló (FI-relé): a táp oldali kapcsok balra, a védett oldaliak jobbra; pólusonként érintkező (a két pólus együtt
 * mozog: szaggatott mechanikus kapcsolat), a védett oldalon mindkét pólusvezetőt körülfogó összegáramváltó (ellipszis) és „IΔn” jelölés. */
function rcdSymbol(ctx:SymCtx):SymbolOut{
 const {comp,part}=ctx,prims:Prim[]=[box(part)];
 const depth=Number(part.opt?.depth??8);
 const into=(id:string)=>{const t=ctx.term(id);return t[0]<part.x+part.w/2?add(t,depth,0):add(t,-depth,0)};
 prims.push(...stubs(ctx,tids(comp),into));
 const poles=(comp.poles??[]).map(p=>[into(p[0]),into(p[1])] as const);
 if(poles.length){
  const ys=poles.map(p=>p[0][1]),y0=Math.min(...ys),y1=Math.max(...ys),cy=(y0+y1)/2;
  const xl=Math.min(...poles.map(p=>p[0][0])),xr=Math.max(...poles.map(p=>p[1][0])),ex=xr-6,ry=(y1-y0)/2+6;
  const ell:Pt[]=[];for(let i=0;i<=28;i++){const a=i/28*2*Math.PI;ell.push(P(ex+4.5*Math.cos(a),cy+ry*Math.sin(a)))}
  prims.push(poly(ell,'sym-thin',true));
  const mx=xl+(ex-4.5-xl)*0.55;
  prims.push(line(P(mx,y0+5),P(mx,y1-5),'sym-link'),text(P(part.x+part.w/2-3,cy+4),'IΔn','middle',10,'t-muted'));
 }
 // Kioldás: a Működés nézetben a kioldó FI-relé doboza vastag, veszélyszínű kerettel kiemelt (a szöveges állapot: „FI-relé: kiold”).
 prims.push(rect(part.x-3,part.y-3,part.w+6,part.h+6,'trip',6,{out:comp.id+':kiold'}));
 return {prims,contacts:levers(ctx,into,into,-22)};
}

/** Lámpa (IEC: kör X-szel) a lámpatestben; a kapcsok a lámpatest egyik oldalán, a PE a fémtesthez (védőföldelés jele). */
function lampSymbol(ctx:SymCtx):SymbolOut{
 const {comp,part}=ctx,prims:Prim[]=[box(part,'sym-body',4)];
 const l=comp.terminals.find(t=>t.role==='L'),n=comp.terminals.find(t=>t.role==='N'),pe=comp.terminals.find(t=>t.role==='PE');
 if(!l||!n)return {prims,contacts:[]};
 const tl=ctx.term(l.id),tn=ctx.term(n.id),vert=sideOf(part,l.id)==='top'||sideOf(part,l.id)==='bottom';
 // A „ég” állapot nem csak színváltás: az X vonalai vastagodnak (.kk-dg-sym.is-on), és sugárkoszorú jelenik meg a lámpa körül (.kk-dg-ray.is-on).
 const rays=(c:Pt,r:number)=>[45,135,225,315].map(a=>{const t=a*Math.PI/180,ux=Math.cos(t),uy=Math.sin(t);return line(add(c,ux*(r+2.5),uy*(r+2.5)),add(c,ux*(r+7),uy*(r+7)),'ray',{out:comp.id})});
 const cross=(c:Pt,r:number)=>[circle(c,r,'lamp',{out:comp.id}),line(add(c,-r*0.7,-r*0.7),add(c,r*0.7,r*0.7),'sym',{out:comp.id}),line(add(c,-r*0.7,r*0.7),add(c,r*0.7,-r*0.7),'sym',{out:comp.id}),...rays(c,r)];
 if(vert){
  // A kapcsok felül (vagy alul): a lámpa a két kapocs között, a kapcsok alatt.
  const r=Number(part.opt?.r??Math.min(10,Math.abs(tn[0]-tl[0])/2-4)),down=sideOf(part,l.id)==='top'?1:-1;
  const cy=Number(part.opt?.cy??tl[1]+down*20),c=P((tl[0]+tn[0])/2,cy),left=tl[0]<tn[0];
  prims.push(...cross(c,r));
  prims.push(poly([tl,P(tl[0],cy),add(c,left?-r:r,0)],'sym',false,{stub:comp.id+'.'+l.id}));
  prims.push(poly([tn,P(tn[0],cy),add(c,left?r:-r,0)],'sym',false,{stub:comp.id+'.'+n.id}));
 }else{
  const r=Number(part.opt?.r??Math.min(10,Math.abs(tn[1]-tl[1])/2-5));
  const cx=Number(part.opt?.cx??(part.side==='right'?part.x+22:part.x+part.w-22)),c=P(cx,(tl[1]+tn[1])/2);
  prims.push(...cross(c,r));
  const up=tl[1]<tn[1];
  prims.push(poly([tl,P(cx,tl[1]),add(c,0,up?-r:r)],'sym',false,{stub:comp.id+'.'+l.id}));
  prims.push(poly([tn,P(cx,tn[1]),add(c,0,up?r:-r)],'sym',false,{stub:comp.id+'.'+n.id}));
 }
 if(pe)prims.push(...peMark(ctx,ctx.term(pe.id)));
 return {prims,contacts:[]};
}
/** A fémtest (I. érintésvédelmi osztály) védővezető-bekötése: a PE kapocstól a doboz belsejébe, a védőföldelés jelével. */
function peMark(ctx:SymCtx,t:Pt):Prim[]{
 const {part,comp}=ctx,pe=comp.terminals.find(x=>x.role==='PE')!,s=sideOf(part,pe.id);
 if(s==='top'||s==='bottom'){
  const end=P(t[0],s==='top'?Math.max(t[1]+8,part.y+part.h-16):Math.min(t[1]-8,part.y+16));
  return [line(t,end,'sym-pe',{stub:comp.id+'.'+pe.id}),...earthSign(end,5,'sym-pe')];
 }
 const right=t[0]<=part.x+part.w/2,end=P(right?part.x+part.w-12:part.x+12,t[1]);
 return [line(t,end,'sym-pe',{stub:comp.id+'.'+pe.id}),...earthSign(end,5,'sym-pe')];
}
/** Föld/védőföldelés jele (⏚): függőleges csonk és három csökkenő vízszintes vonal. */
function earthSign(top:Pt,s:number,cls='sym'):Prim[]{
 return [line(top,add(top,0,s),cls),line(add(top,-s,s),add(top,s,s),cls),line(add(top,-s*0.62,s+2.6),add(top,s*0.62,s+2.6),cls),line(add(top,-s*0.25,s+5.2),add(top,s*0.25,s+5.2),cls)];
}

/** Dugalj (védőérintkezős): a dugaljdoboz, benne az aljzat jele (félkör a két érintkezővel és a védőérintkező), a kapcsok oszlopa átmenő vezetékekkel. */
function socketSymbol(ctx:SymCtx):SymbolOut{
 const {comp,part}=ctx,prims:Prim[]=[box(part,'sym-place',4)];
 const cx=Number(part.opt?.fx??part.x+part.w/2),cy=Number(part.opt?.fy??part.y+14),r=9;
 prims.push(poly(arc(P(cx,cy),r,180,360),'sym',false,{out:comp.id}),line(P(cx-r,cy),P(cx+r,cy),'sym'),line(P(cx-3.5,cy-r+2),P(cx-3.5,cy-3),'sym'),line(P(cx+3.5,cy-r+2),P(cx+3.5,cy-3),'sym'));
 prims.push(line(P(cx,cy+2),P(cx,cy+6),'sym-pe'));
 return {prims,contacts:[]};
}
/** Fogyasztó (fémház): a ház (I. osztálynál szaggatott fémház-keret), benne a fogyasztó (téglalap) a fázis- és nullakapocs között, a PE a házhoz
 * (opt.pe = 'none': a PE-kapocs a ház szélén áll, belső csonk és földjel nélkül – a ház maga a fémtest; pl. a testzárlatot a PE-kapocs mellett mutató IT-ábrán). */
function loadSymbol(ctx:SymCtx):SymbolOut{
 const {comp,part}=ctx,prims:Prim[]=[box(part,comp.class==='II'?'sym-body':'sym-housing',4)];
 const act=comp.terminals.filter(t=>t.role!=='PE'),pe=comp.terminals.find(t=>t.role==='PE');
 const bx=Number(part.opt?.bx??part.x+part.w-30),bw=18;
 const ys=act.map(t=>ctx.term(t.id)[1]),y0=Math.min(...ys)-4,y1=Math.max(...ys)+4;
 prims.push(rect(bx,y0,bw,y1-y0,'sym-load',2,{out:comp.id}));
 if(part.opt?.letter)prims.push(text(P(bx+bw/2,(y0+y1)/2+4),String(part.opt.letter),'middle',10,'t-muted'));
 for(const t of act){const p=ctx.term(t.id);prims.push(line(p,P(bx,p[1]),'sym',{stub:comp.id+'.'+t.id}))}
 if(pe&&part.opt?.pe!=='none')prims.push(...peMark(ctx,ctx.term(pe.id)));
 return {prims,contacts:[]};
}
/** Betáp (az áramkör betápja az elosztóból) vagy gyűjtősín: keret a kapocsfeliratokkal. */
function supplySymbol(ctx:SymCtx):SymbolOut{
 return {prims:[box(ctx.part,'sym-body',4)],contacts:[]};
}
/** Transzformátor kisfeszültségű tekercse csillagkapcsolásban: három tekercs (hullámvonal) a csillagponttól a fáziskapcsokig. */
function transformerSymbol(ctx:SymCtx):SymbolOut{
 const {comp,part}=ctx,prims:Prim[]=[box(part,'sym-body',4)];
 const star=comp.terminals.find(t=>t.role==='N'||t.role==='PEN'),ph=comp.terminals.filter(t=>/^L[123]$/.test(t.role));
 if(!star)return {prims,contacts:[]};
 const sp=P(Number(part.opt?.sx??part.x+18),Number(part.opt?.sy??part.y+part.h-16));
 prims.push(circle(sp,2,'sym-dot'));
 for(const t of ph){
  const p=ctx.term(t.id),mid=P(sp[0],p[1]);
  // tekercs: a csillagponttól fölfelé a fázis magasságáig, majd vízszintesen a kapocsig; a vízszintes szakaszon hullámos tekercs
  const x0=sp[0]+8,x1=Math.min(p[0]-6,x0+22),pts:Pt[]=[sp,P(sp[0],p[1]),P(x0,p[1])];
  for(let i=0;i<=12;i++){const x=x0+(x1-x0)*i/12;pts.push(P(x,p[1]-Math.abs(Math.sin(i*Math.PI/4))*4))}
  pts.push(P(x1,p[1]),p);
  // a csonk a kapocsból indul (a rajz = netlista teszt így követi a kapcsot)
  prims.push(poly(pts.reverse(),'sym',false,{stub:comp.id+'.'+t.id}));
  void mid;
 }
 const st=ctx.term(star.id);
 prims.push(line(st,sp,'sym',{stub:comp.id+'.'+star.id}));
 return {prims,contacts:[]};
}
/** Sín (N-sín, PE-sín, fő EPH-sín): vastag rövid sáv, a kapocs rajta. */
function busbarSymbol(ctx:SymCtx):SymbolOut{
 const {part}=ctx,horiz=part.w>=part.h;
 return {prims:[horiz?line(P(part.x,part.y+part.h/2),P(part.x+part.w,part.y+part.h/2),'sym-bar'):line(P(part.x+part.w/2,part.y),P(part.x+part.w/2,part.y+part.h),'sym-bar')],contacts:[]};
}
/** Kötődoboz és szerelvénydoboz: szaggatott keret; a kötőelemek (vezetékösszekötők) a kapcsok. */
function placeSymbol(ctx:SymCtx):SymbolOut{return {prims:[box(ctx.part,'sym-place',5)],contacts:[]}}
/** Sorkapocs, kötőelem: keskeny kapocsléc. */
function terminalBlockSymbol(ctx:SymCtx):SymbolOut{return {prims:[box(ctx.part,'sym-block',2)],contacts:[]}}
/** Ellenállás (IEC: téglalap) a két kapocs között. */
function resistorSymbol(ctx:SymCtx):SymbolOut{
 const {part}=ctx,ids=tids(ctx.comp);
 const prims:Prim[]=[rect(part.x,part.y,part.w,part.h,'sym-load',1)];
 for(const id of ids){const t=ctx.term(id),inner=t[0]<=part.x?P(part.x,t[1]):t[0]>=part.x+part.w?P(part.x+part.w,t[1]):t[1]<=part.y?P(t[0],part.y):P(t[0],part.y+part.h);prims.push(line(t,inner,'sym',{stub:ctx.comp.id+'.'+id}))}
 return {prims,contacts:[]};
}
/** Nyomógomb (próbagomb): záróérintkező, rugós működtetővel (T alakú gomb). */
function buttonSymbol(ctx:SymCtx):SymbolOut{
 const {comp,part}=ctx,[a,b]=tids(comp),pa=ctx.term(a),pb=ctx.term(b);
 const prims:Prim[]=[];
 const ia=inward(part,pa,6,a),ib=inward(part,pb,6,b);
 prims.push(line(pa,ia,'sym',{stub:comp.id+'.'+a}),line(pb,ib,'sym',{stub:comp.id+'.'+b}));
 const m=P((ia[0]+ib[0])/2,Math.min(ia[1],ib[1])-9);
 prims.push(line(m,add(m,0,-6),'sym-thin'),line(add(m,-4,-6),add(m,4,-6),'sym'));
 return {prims,contacts:levers(ctx,()=>ia,()=>ib,-30).map(p=>p.k==='line'&&p.data?.open?{...p,a:add(ia,0,-5),b:add(ib,0,-5)}:p)};
}
/** Hibahely (testzárlat): impedancia (cikcakk) a fázisoldali pont és a fémház között; veszélyszínű, szaggatott jelöléssel. */
function faultSymbol(ctx:SymCtx):SymbolOut{
 const {comp,part}=ctx,[a,b]=tids(comp),pa=ctx.term(a),pb=ctx.term(b);
 const vert=Math.abs(pa[0]-pb[0])<Math.abs(pa[1]-pb[1]),pts:Pt[]=[pa];
 const n=6,len=vert?pb[1]-pa[1]:pb[0]-pa[0];
 for(let i=1;i<n;i++){const t=0.2+0.6*i/n,off=(i%2?1:-1)*4;pts.push(vert?P(pa[0]+off,pa[1]+len*t):P(pa[0]+len*t,pa[1]+off))}
 pts.push(pb);
 return {prims:[poly(pts,'fault',false,{out:comp.id})],contacts:[]};
 void part;
}
/** Emberi test (érintés): pálcikaember a két érintési pont között. */
function personSymbol(ctx:SymCtx):SymbolOut{
 const {comp,part}=ctx,cx=part.x+part.w/2,y=part.y;
 const o={out:comp.id};
 const prims:Prim[]=[circle(P(cx,y+5),4.5,'person',o),line(P(cx,y+9.5),P(cx,y+22),'person',o),line(P(cx-8,y+14),P(cx+8,y+14),'person',o),line(P(cx,y+22),P(cx-6,y+32),'person',o),line(P(cx,y+22),P(cx+6,y+32),'person',o)];
 return {prims,contacts:[]};
}
/** Talaj: hosszú vízszintes vonal ferde sraffozással. */
function soilSymbol(ctx:SymCtx):SymbolOut{
 const {part}=ctx,prims:Prim[]=[line(P(part.x,part.y),P(part.x+part.w,part.y),'soil')];
 for(let x=part.x+4;x<part.x+part.w;x+=9)prims.push(line(P(x,part.y),P(x-6,part.y+6),'soil-hatch'));
 return {prims,contacts:[]};
}
/** Földelő (üzemi vagy védőföldelő): a földelés jele a kapocs alatt, a talajba nyúló földelőrúddal. */
function electrodeSymbol(ctx:SymCtx):SymbolOut{
 const {comp,part}=ctx,t=ctx.term(tids(comp)[0]);
 const top=P(t[0],t[1]+Number(part.opt?.stub??6));
 return {prims:[line(t,top,'sym',{stub:comp.id+'.'+tids(comp)[0]}),...earthSign(top,6,'sym')],contacts:[]};
}
/** PEN-szétválasztás és PEN-kapocs: két sín (N és PE) vagy kapocsléc, a belső összeköttetés (híd) külön jelölve. */
function splitSymbol(ctx:SymCtx):SymbolOut{return {prims:[box(ctx.part,'sym-block',2)],contacts:[]}}
/** Idegen vezetőképes rész (fém vízvezeték): kettős vonalú cső csaptelepre, a talajba futó szakasszal (ha a talajjal érintkezik). */
function pipeSymbol(ctx:SymCtx):SymbolOut{
 const {comp,part}=ctx,x=part.x,y=part.y,w=part.w,h=part.h;
 const prims:Prim[]=[rect(x,y,w,8,'pipe',2),rect(x+w-10,y-12,8,12,'pipe',1),line(P(x+w-14,y-12),P(x+w+2,y-12),'sym')];
 if(comp.earthContact)prims.push(rect(x+4,y+8,8,h-8,'pipe',1));
 return {prims,contacts:[]};
}
/** Szigetelésfigyelő: doboz „R>” jelöléssel (IT-hálózat). */
function imdSymbol(ctx:SymCtx):SymbolOut{
 const {part}=ctx;
 return {prims:[box(part,'sym-body',3),text(P(part.x+part.w/2,part.y+part.h/2+4),'R>','middle',11,'t')],contacts:[]};
}

const SYMBOLS:Readonly<Record<string,(ctx:SymCtx)=>SymbolOut>>={
 'kapcsolo-101':switchSymbol,'kapcsolo-102':switchSymbol,'kapcsolo-103':switchSymbol,'kapcsolo-105':switchSymbol,'kapcsolo-106':switchSymbol,'kapcsolo-106-6':switchSymbol,'kapcsolo-107':switchSymbol,
 kismegszakito:breakerSymbol,'fi-rele':rcdSymbol,nyomogomb:buttonSymbol,ellenallas:resistorSymbol,
 lampa:lampSymbol,fogyaszto:loadSymbol,dugalj:socketSymbol,
 kotodoboz:placeSymbol,kotoelem:terminalBlockSymbol,sorkapocs:terminalBlockSymbol,'pen-kapocs':splitSymbol,'pen-szetvalaszto':splitSymbol,
 'n-sin':busbarSymbol,'pe-sin':busbarSymbol,'fofoldelo-sin':busbarSymbol,
 hibaut:faultSymbol,ember:personSymbol,fold:soilSymbol,foldelo:electrodeSymbol,idegen:pipeSymbol,szigetelesfigyelo:imdSymbol,
};
/** Egy alkatrész szimbóluma (a tápnál: földelési netlistában transzformátor, különben betáp-keret). */
export function symbolOf(ctx:SymCtx,earthing:boolean):SymbolOut{
 const t=ctx.comp.type;
 if(t==='tap')return earthing?transformerSymbol(ctx):supplySymbol(ctx);
 const f=SYMBOLS[t];
 if(!f)throw new Error('Nincs szimbólum ehhez a komponenstípushoz: '+t+' ('+ctx.comp.id+')');
 return f(ctx);
}
export const SYMBOL_TYPES=['tap',...Object.keys(SYMBOLS)];

// ---------------------------------------------------------------- Rajzolás (SVG)
const fmt=(n:number)=>String(r1(n));
const dataAttrs=(d?:Record<string,string>)=>d?Object.fromEntries(Object.entries(d).map(([k,v])=>['data-'+k,v])):{};
/** Rajzelemek → SVG-elemek (szerver- és kliensoldalon is; kulcs: az index). */
export function Prims({prims,prefix=''}:{prims:readonly Prim[];prefix?:string}){
 return <>{prims.map((p,i)=>{
  const key=prefix+i,cls=p.cls?p.cls.split(' ').map(c=>c.startsWith('is-')?c:'kk-dg-'+c).join(' '):undefined,data=dataAttrs(p.data);
  switch(p.k){
   case 'line':return <line key={key} x1={fmt(p.a[0])} y1={fmt(p.a[1])} x2={fmt(p.b[0])} y2={fmt(p.b[1])} className={cls} {...data}/>;
   case 'poly':return p.closed?<polygon key={key} points={p.pts.map(q=>fmt(q[0])+','+fmt(q[1])).join(' ')} className={cls} {...data}/>:<polyline key={key} points={p.pts.map(q=>fmt(q[0])+','+fmt(q[1])).join(' ')} className={cls} {...data}/>;
   case 'rect':return <rect key={key} x={fmt(p.x)} y={fmt(p.y)} width={fmt(p.w)} height={fmt(p.h)} rx={p.rx?fmt(p.rx):undefined} className={cls} {...data}/>;
   case 'circle':return <circle key={key} cx={fmt(p.c[0])} cy={fmt(p.c[1])} r={fmt(p.r)} className={cls} {...data}/>;
   case 'text':return <text key={key} x={fmt(p.at[0])} y={fmt(p.at[1])} fontSize={p.size??11} textAnchor={p.anchor??'middle'} className={cls} {...data}>{p.s}</text>;
  }
 })}</>;
}
export {line as primLine,poly as primPoly,rect as primRect,circle as primCircle,text as primText};
