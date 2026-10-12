// Saját SVG-ábrák: IP-kód felépítése, próbatestek méretaránya, a H05VV-F 3G1,5 jelölés, a mai színjelölés, ötös kábel régen és ma.
import {Svg,T,type FigProps} from './kit';

/** ip-vedettseg / abra-1: az IP-kód felépítése (IP, 1. és 2. számjegy, nem kötelező kiegészítő és pótbetű). Keskeny (300 széles) elrendezés:
 * a vezetővonalas feliratok lépcsőzetesen, a hosszúak két sorban, hogy telefonon is legalább ~10 px-esek maradjanak. */
export function IpKod(p:FigProps){
 const boxes=[{x:6,w:42,t:'IP',cls:'f-bg s-border',sw:1.5,dash:false},{x:56,w:28,t:'4',cls:'f-info s-info',sw:2,dash:false},{x:90,w:28,t:'4',cls:'f-info s-n',sw:2,dash:false},{x:124,w:26,t:'',cls:'f-none s-muted',sw:1.5,dash:true},{x:156,w:26,t:'',cls:'f-none s-muted',sw:1.5,dash:true}];
 const labels=[{i:4,y:80,t:['pótbetű (H, M, S, W,','nem kötelező)'],muted:true},{i:3,y:118,t:['kiegészítő betű (A–D,','nem kötelező)'],muted:true},{i:2,y:156,t:['2. számjegy: víz (0–9)'],muted:false},{i:1,y:180,t:['1. számjegy: szilárd testek,','por (0–6)'],muted:false},{i:0,y:218,t:['a kód jele'],muted:false}];
 return <Svg {...p} viewBox="0 0 300 268">
  {boxes.map((b,i)=><g key={i}><rect x={b.x} y={14} width={b.w} height={40} rx={4} className={b.cls} strokeWidth={b.sw} strokeDasharray={b.dash?'5 4':undefined}/>{b.t&&<T x={b.x+b.w/2} y={44} size={24} anchor="middle" bold>{b.t}</T>}</g>)}
  {labels.map(l=>{const b=boxes[l.i],cx=b.x+b.w/2;return <g key={l.i}>
   <path d={`M${cx} 54 V${l.y-4} H${cx+6}`} className="s-muted f-none" strokeWidth={1.2}/>
   {l.t.map((t,j)=><T key={j} x={cx+10} y={l.y+j*15} size={12} cls={l.muted?'t-muted':''}>{t}</T>)}
  </g>})}
  <T x={6} y={246} size={12} cls="t-muted">Ha egy jellemzőt nem adnak meg, a számjegy</T>
  <T x={6} y={261} size={12} cls="t-muted">helyén X áll, pl. IPX4.</T>
 </Svg>;
}

/** ip-vedettseg / abra-2: az első számjegy próbatestei méretarányosan (1 mm = 2,6 px), a két legkisebb 5× nagyítva is. */
export function IpProbatestek(p:FigProps){
 const k=2.6,base=176;
 const items=[{x:70,d:50,n:'1',l:'kézfej'},{x:154,d:12.5,n:'2',l:'ujj'},{x:204,d:2.5,n:'3',l:'szerszám'},{x:262,d:1,n:'4',l:'huzal'}];
 const dots=[[0,0],[6,3],[12,1],[17,6],[3,9],[9,11],[15,13],[1,16],[7,18],[13,19],[18,15],[10,5]] as const;
 return <Svg {...p} viewBox="0 0 340 254">
  <line x1={4} y1={base} x2={336} y2={base} className="s-border" strokeWidth={1.5}/>
  {items.map(it=>{const r=it.d*k/2;return <g key={it.n}>
   <circle cx={it.x} cy={base-r} r={Math.max(r,1.2)} className="f-surface2 s-fg" strokeWidth={r<3?0.8:1.5}/>
   <T x={it.x} y={base+18} size={14} anchor="middle" bold>{it.n}</T>
   <T x={it.x} y={base+34} size={12.5} anchor="middle">{it.l}</T>
  </g>})}
  <g transform={`translate(296 ${base-22})`}>{dots.map(([dx,dy],i)=><circle key={i} cx={dx} cy={dy} r={1.3} className="f-muted"/>)}</g>
  <T x={306} y={base+18} size={14} anchor="middle" bold>5–6</T>
  <T x={306} y={base+34} size={12.5} anchor="middle">por</T>
  <rect x={180} y={14} width={106} height={92} rx={4} className="s-muted f-none" strokeDasharray="5 4"/>
  <T x={233} y={30} size={12} anchor="middle" cls="t-muted">5× nagyítás</T>
  <circle cx={206} cy={68} r={2.5*k*5/2} className="f-surface2 s-fg" strokeWidth={1.5}/><T x={206} y={100} size={12} anchor="middle">3</T>
  <circle cx={260} cy={68} r={1*k*5/2} className="f-surface2 s-fg" strokeWidth={1.5}/><T x={260} y={100} size={12} anchor="middle">4</T>
  <line x1={206} y1={104} x2={204} y2={base-8} className="s-muted" strokeDasharray="2 3"/><line x1={260} y1={104} x2={262} y2={base-4} className="s-muted" strokeDasharray="2 3"/>
  <T x={4} y={232} size={12} cls="t-muted">Méretarányos rajz; a por bejutását</T>
  <T x={4} y={247} size={12} cls="t-muted">az 5-ös és a 6-os fokozat különbözteti meg.</T>
 </Svg>;
}

/** vezetek-es-kabeljelolesek / abra-1: a H05VV-F 3G1,5 jelölés felbontása és a vezetők felépítése (tömör, sodrott, finomhuzalos).
 * A feliratok három szinten (fent, lent, a 3G1,5-é lejjebb), hogy 12,5 egységes betűvel se fedjék egymást. */
export function KabelJeloles(p:FigProps){
 // A tagok egyenletes, kb. 20 egységes közzel (a 22 egységes félkövér betű mért szélességével), az elválasztók a közök felezőpontjában.
 const tok=[{x:44,t:'H',l:['harmonizált'],y:58},{x:87,t:'05',l:['300/500 V'],y:140},{x:129,t:'V',l:['PVC','szigetelés'],y:34},{x:166,t:'V',l:['PVC köpeny'],y:140},{x:206,t:'-F',l:['finomhuzalos,','hajlékony'],y:34},{x:268,t:'3G1,5',l:['3 ér, ebből 1 zöld-sárga,','egyenként 1,5 mm²'],y:164}];
 const seps=[62,111,147.5,184.5,227.5];
 const fine:[number,number][]=[];for(let r=0;r<=17;r+=5.2)for(let a=0;a<(r?Math.round(2*Math.PI*r/5.4):1);a++){const ang=a*2*Math.PI/Math.max(1,Math.round(2*Math.PI*r/5.4));fine.push([r*Math.cos(ang),r*Math.sin(ang)])}
 const hex:[number,number][]=[[0,0],...Array.from({length:6},(_,i)=>[14.4*Math.cos(i*Math.PI/3),14.4*Math.sin(i*Math.PI/3)] as [number,number])];
 const cy=232;
 return <Svg {...p} viewBox="0 0 360 296">
  {seps.map(x=><T key={x} x={x} y={103} size={20} anchor="middle" cls="t-muted">|</T>)}
  {tok.map((t,i)=>{const up=t.y<100,last=t.y+(t.l.length-1)*15;return <g key={i}>
   <T x={t.x} y={104} size={22} anchor="middle" bold>{t.t}</T>
   <line x1={t.x} y1={up?82:110} x2={t.x} y2={up?last+6:t.y-14} className="s-muted"/>
   {t.l.map((s,j)=><T key={j} x={t.x} y={t.y+j*15} size={12.5} anchor="middle">{s}</T>)}
  </g>})}
  <g transform={`translate(70 ${cy})`}><circle r={22} className="f-copper s-fg" strokeWidth={1.5}/></g>
  <g transform={`translate(180 ${cy})`}><circle r={22} className="f-bg s-fg" strokeWidth={1.5}/>{hex.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={7} className="f-copper s-fg" strokeWidth={0.8}/>)}</g>
  <g transform={`translate(290 ${cy})`}><circle r={22} className="f-bg s-fg" strokeWidth={1.5}/>{fine.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={2.5} className="f-copper s-fg" strokeWidth={0.5}/>)}</g>
  <T x={70} y={cy+38} size={12.5} anchor="middle">U – tömör</T>
  <T x={180} y={cy+38} size={12.5} anchor="middle">R – sodrott</T>
  <T x={290} y={cy+38} size={12.5} anchor="middle">F, K – finomhuzalos</T>
  <T x={180} y={cy+58} size={12} anchor="middle" cls="t-muted">1., 2. és 5. vezetőosztály (MSZ EN 60228)</T>
 </Svg>;
}

/** Zöld-sárga (PE) csíkminta: zöld alapon 45°-os sárga csíkok, 8 px-es periódussal. */
function PePattern({id}:{id:string}){
 return <pattern id={id} width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width={8} height={8} className="f-pe"/><rect width={4} height={8} className="f-pe-stripe"/></pattern>;
}

/** vezetekek-szinjelolese / abra-1: a mai színjelölés – L1 barna, L2 fekete, L3 szürke, N kék, PE zöld-sárga. */
export function SzinjelolesMa(p:FigProps){
 const pe=p.uid+'-pe';
 const rows=[['L1','barna','f-l1-swatch'],['L2','fekete','f-l2-swatch'],['L3','szürke','f-l3'],['N','kék','f-n'],['PE','zöld-sárga','pe']] as const;
 return <Svg {...p} viewBox="0 0 320 236">
  <defs><PePattern id={pe}/></defs>
  {rows.map(([l,c,cls],i)=>{const y=12+i*42;return <g key={l}>
   <T x={56} y={y+19} size={14} anchor="end" bold>{l}</T>
   <rect x={70} y={y} width={160} height={28} rx={14} className={cls==='pe'?'s-fg':cls+' s-fg'} fill={cls==='pe'?`url(#${pe})`:undefined} strokeWidth={/-swatch$/.test(cls)?1.5:0.8}/>
   <T x={240} y={y+19} size={13}>{c}</T>
  </g>})}
  <T x={10} y={230} size={11.5} cls="t-muted">Így látod a tervezőben: a PE egyszínű zöld.</T>
 </Svg>;
}

/** Az ötös kábel ereinek iránya (72°-onként, felülről indulva). */
const ang=(k:number)=>(-90+72*k)*Math.PI/180;
/** Kábel-keresztmetszet: köpeny, öt ér felirattal; a PE a `pe` azonosítójú csíkos mintával. */
const Cable=({pe,cx,title,cores}:{pe:string;cx:number;title:string;cores:readonly (readonly [string,string])[]})=><g>
  <circle cx={cx} cy={95} r={68} className="f-surface2 s-border" strokeWidth={1.5}/>
  {cores.map(([cls,l],k)=>{const x=cx+38*Math.cos(ang(k)),y=95+38*Math.sin(ang(k));return <g key={k}>
   <circle cx={x} cy={y} r={18} className={cls==='pe'?'s-fg':cls+' s-fg'} fill={cls==='pe'?`url(#${pe})`:undefined} strokeWidth={/-swatch$/.test(cls)?1.5:0.8}/>
   <T x={cx+80*Math.cos(ang(k))} y={95+80*Math.sin(ang(k))+5} size={14} anchor="middle" bold>{l}</T>
  </g>})}
  <T x={cx} y={198} size={13} anchor="middle" bold>{title}</T>
 </g>;

/** vezetekek-szinjelolese / abra-2: ötös kábel keresztmetszete ma (5G) és egy régebbi kábelben. */
export function OtosKabel(p:FigProps){
 const pe=p.uid+'-pe';
 return <Svg {...p} viewBox="0 0 360 246">
  <defs><PePattern id={pe}/></defs>
  <Cable pe={pe} cx={92} title="Ma (5G)" cores={[['pe','PE'],['f-n','N'],['f-l1-swatch','L1'],['f-l2-swatch','L2'],['f-l3','L3']]}/>
  <Cable pe={pe} cx={268} title="Régebbi kábel (példa)" cores={[['pe','PE'],['f-n','N'],['f-l2-swatch','?'],['f-l1-swatch','?'],['f-l2-swatch','?']]}/>
  <T x={180} y={222} size={12} anchor="middle" cls="t-muted">Két fekete ér: a fázisok a színből</T>
  <T x={180} y={238} size={12} anchor="middle" cls="t-muted">nem különböztethetők meg.</T>
 </Svg>;
}
