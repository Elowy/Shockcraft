// A Bekötés nézet (szerverkomponens, kliens-JS nélkül): vezetékszintű, kapcsokkal, színes erekkel (a kezikonyv.css ér-tokenjeivel),
// minden éren felirattal (a szín sosem az egyetlen jel). Minden vezeték data-wire / data-net / data-from / data-to / data-role /
// data-color attribútumot kap, a kapcsok data-term-et, a csomópontpöttyök data-junction-t, a hidak data-bridge-et, az állásfüggő
// érintkezők data-sel / data-state / data-pair-t: ebből fejti vissza a tests/kb-diagram.ts az összeköttetéseket (rajz = netlista).
// Ugyanez az SVG a Működés nézet alapja is (`state`: a kiemelt áramút, a feszültség alatti erek és a működő fogyasztók az adott állásban).
import {Prims} from './symbols';
import {scenePrims,type DiagramState,type Scene} from './scene';

/** Az ábra SVG-je: role="img", név a <title>, leírás a netlistából generált <desc>. `minWidth`: keskeny képernyőn a keret görget. */
export function BekotesSvg({scene,uid,title,state,view='bekotes'}:{scene:Scene;uid:string;title:string;state?:DiagramState;view?:'bekotes'|'mukodes'}){
 const [x,y,w,h]=scene.viewBox;
 return <svg viewBox={[x,y,w,h].join(' ')} role="img" aria-labelledby={uid+'-t'} aria-describedby={uid+'-d'} className="kk-dg-svg" data-diagram={scene.id} data-view={view}
  style={{minWidth:scene.minWidth+'px'}} xmlns="http://www.w3.org/2000/svg">
  <title id={uid+'-t'}>{title}</title>
  <desc id={uid+'-d'}>{scene.desc}</desc>
  <Prims prims={scenePrims(scene,state?{state}:{})}/>
 </svg>;
}
