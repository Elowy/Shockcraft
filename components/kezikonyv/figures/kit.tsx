// Közös segédek a Tudástár saját SVG-ábráihoz (szerverkomponensek, kliens-JS nélkül). Színek csak a kezikonyv.css tokenjeiből
// (osztályokkal: f-* kitöltés, s-* körvonal, t-* szöveg), így az ábra világos és sötét témában, valamint nyomtatásban is helyes.
// Minden ábra `<svg role="img">` <title> elemmel (a több panelből állók panelenként <desc>-kel is); a szöveges megfelelő a figcaption-ben
// olvasható, és az a <figure> akadálymentes leírása (aria-describedby), így a képernyőolvasó egyszer olvassa fel.
// Betűméret: keskeny képernyőn (320 px) is legalább kb. 9, 390 px-en legalább 10 px tényleges méret (a viewBox szélességéhez mérve:
// 320 széles ábrán ≥ 11, 360 szélesen ≥ 12 egység) – a tests/kb-figures.mjs Playwright-próbája ellenőrzi.

export type FigProps={uid:string;title:string;desc:string};

/** Az ábra SVG-gyökere: role="img", az akadálymentes név a <title> (aria-labelledby). A <desc> és az aria-describedby csak akkor kerül
 * rá, ha `desc` nem üres: a cikk egyetlen SVG-ből álló ábráinál a szöveges megfelelő a figcaption-ben áll (a <figure> leírása), ezért ott
 * az SVG-n nem ismétlődik; a több panelből álló ábráknál a panelek saját, rövid leírást kapnak. */
export function Svg({uid,title,desc,viewBox,children,className,label,maxWidth}:FigProps&{viewBox:string;children:React.ReactNode;className?:string;label?:string;maxWidth?:number}){
 const t=uid+'-t',d=uid+'-d',w=Number(viewBox.split(' ')[2])||320;
 // Legfeljebb a rajzolt méret másfélszerese: a kis ábra nem nő óriásira a széles hasábban (a szöveg ~12–20 px marad).
 return <svg viewBox={viewBox} role="img" aria-labelledby={t} aria-describedby={desc?d:undefined} className={'kk-fig-svg'+(className?' '+className:'')} style={{maxWidth:(maxWidth??Math.round(w*1.5))+'px'}} xmlns="http://www.w3.org/2000/svg">
  <title id={t}>{label??title}</title>{desc?<desc id={d}>{desc}</desc>:null}
  {children}
 </svg>;
}

/** Nyílhegy (háromszög) az (x1,y1)→(x2,y2) szakasz végén; a szín az osztályból. */
export function Head({x1,y1,x2,y2,size=8,className='f-fg'}:{x1:number;y1:number;x2:number;y2:number;size?:number;className?:string}){
 const a=Math.atan2(y2-y1,x2-x1),w=size*0.55;
 const p=(dx:number,dy:number)=>(x2+dx).toFixed(1)+','+(y2+dy).toFixed(1);
 const bx=-Math.cos(a)*size,by=-Math.sin(a)*size,nx=-Math.sin(a)*w,ny=Math.cos(a)*w;
 return <polygon points={[p(0,0),p(bx+nx,by+ny),p(bx-nx,by-ny)].join(' ')} className={className}/>;
}
/** Nyíl: szakasz + hegy (a hegy a vonal végén). `both`: kettős nyíl. */
export function Arrow({x1,y1,x2,y2,cls='s-fg',head='f-fg',w=1.5,size=8,both=false,dash}:{x1:number;y1:number;x2:number;y2:number;cls?:string;head?:string;w?:number;size?:number;both?:boolean;dash?:string}){
 const a=Math.atan2(y2-y1,x2-x1),sx=Math.cos(a)*size*0.7,sy=Math.sin(a)*size*0.7;
 return <g>
  <line x1={both?x1+sx:x1} y1={both?y1+sy:y1} x2={x2-sx} y2={y2-sy} className={cls} strokeWidth={w} strokeDasharray={dash}/>
  <Head x1={x1} y1={y1} x2={x2} y2={y2} size={size} className={head}/>
  {both&&<Head x1={x2} y1={y2} x2={x1} y2={y1} size={size} className={head}/>}
 </g>;
}
/** Szöveg (alapból 12 px, előtérszín); `anchor`: start | middle | end. */
export function T({x,y,children,size=12,anchor='start',cls='',bold=false,rotate}:{x:number;y:number;children:React.ReactNode;size?:number;anchor?:'start'|'middle'|'end';cls?:string;bold?:boolean;rotate?:number}){
 return <text x={x} y={y} fontSize={size} textAnchor={anchor} fontWeight={bold?700:undefined} className={cls||undefined} transform={rotate!==undefined?`rotate(${rotate} ${x} ${y})`:undefined}>{children}</text>;
}
/** Pontsorozat SVG-útvonallá. */
export const path=(pts:readonly (readonly [number,number])[])=>pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
/** Az x(t) / y(t) függvény mintavételezett útvonala. */
export function curve(f:(t:number)=>[number,number],t0:number,t1:number,n=80){const pts:[number,number][]=[];for(let i=0;i<=n;i++)pts.push(f(t0+(t1-t0)*i/n));return path(pts)}
/** Alsó index a szövegben (SVG <tspan>). */
export const Sub=({children}:{children:React.ReactNode})=><><tspan dy={3} fontSize="0.78em">{children}</tspan><tspan dy={-3}>{'\u200b'}</tspan></>;
