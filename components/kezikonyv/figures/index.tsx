// A Tudástár-cikkek ábráinak jegyzéke: a vázlat [ÁBRA: abra-N …] helyőrzője → saját SVG-komponens (szerverkomponens).
// Minden helyőrzőhöz kell bejegyzés (tests/kb-content.ts). A `desc` a szöveges megfelelő, ha a helyőrző nem adott meg desc-et;
// a `wide` (px) a keskeny képernyőn vízszintesen görgethető, billentyűzettel is elérhető ábra legkisebb szélessége (görgetési árnyékkal
// jelezve). Most egyik ábra sem ilyen: a széles ábrák keskeny képernyőn panelekre bomlanak vagy saját keskeny változatot kapnak.
import type {KbBlock} from '@/lib/kb/content/types';
import type {FigProps} from './kit';
import {AramDcAc,EllenallasHenger,FazisVektor,FeszultsegPeriodus,OhmHaromszog,TeljesitmenyHaromszog} from './alapfogalmak-1';
import {IdoaramSav,JouleParabola,KirchhoffCsomopont,KirchhoffHurok,RovidzarlatAllapotok,SorosParhuzamos,TranszformatorFelepites} from './alapfogalmak-2';
import {FenyhasznositasSavok,Lampatalpak,LumenLux,SzinhomersekletSkala} from './vilagitas';
import {IpKod,IpProbatestek,KabelJeloles,OtosKabel,SzinjelolesMa} from './vezetekek-ip';

export type FigureDef={C:(p:FigProps)=>React.ReactElement;desc?:string;wide?:number};
export const FIGURES:Readonly<Record<string,FigureDef>>={
 'elektromos-aram/abra-1':{C:AramDcAc},
 'elektromos-ellenallas/abra-1':{C:EllenallasHenger},
 'elektromos-feszultseg/abra-1':{C:FeszultsegPeriodus},
 'elektromos-feszultseg/abra-2':{C:FazisVektor},
 'elektromos-teljesitmeny/abra-1':{C:TeljesitmenyHaromszog},
 'ohm-torvenye/abra-1':{C:OhmHaromszog},
 'joule-lenz-torveny/abra-1':{C:JouleParabola},
 'kirchhoff-torvenyei/abra-1':{C:KirchhoffCsomopont,desc:'Egy csomópontba két áram folyik be (I1 = 3 A és I2 = 5 A), és kettő folyik ki belőle (I3 = 6 A és I4 = 2 A). A befolyó és a kifolyó áramok összege egyaránt 8 A: 3 A + 5 A = 6 A + 2 A.'},
 'kirchhoff-torvenyei/abra-2':{C:KirchhoffHurok,desc:'Zárt hurok: 230 V-os váltakozó feszültségű forrás, a fázisvezetőben (L) és a nullavezetőben (N) egy-egy Rv/2 vezeték-ellenállás, a hurok végén a 26,45 Ω-os vízforraló. A két vezetékrészen együtt 2,58 V, a vízforralón 227,42 V esik; összegük a forrás 230 V-ja.'},
 'soros-es-parhuzamos-kapcsolas/abra-1':{C:SorosParhuzamos,desc:'Bal oldalon soros kapcsolás: R1 és R2 egymás után, közös I áram, a feszültség megoszlik (U = U1 + U2). Jobb oldalon párhuzamos kapcsolás: R1 és R2 külön ágon, közös U feszültség, az ágáramok összeadódnak (I = I1 + I2).'},
 'rovidzarlat-es-tulterheles/abra-1':{C:RovidzarlatAllapotok,desc:'Ugyanaz az áramkör három állapotban. Normál: egy fogyasztó, 8,7 A. Túlterhelés: három párhuzamos fogyasztó, 22,6 A, a vezeték melegszik. Rövidzárlat: a fogyasztó előtt az L és az N vezető összeér, kb. 400 A folyik, a fogyasztón nem folyik áram. Az áram nagyságát a nyíl vastagsága és a felirat is jelzi.'},
 'rovidzarlat-es-tulterheles/abra-2':{C:IdoaramSav,desc:'Sematikus log–log időáram-diagram: vízszintesen az áram a névleges áram többszörösében (I / In, 1-től 100-ig), függőlegesen a kioldási idő (0,01 s-tól 10 000 s-ig). A B jelleggörbe sávja 1,13 · In és 1,45 · In között, az egyórás vonal körül indul (hőkioldó, késleltetve), és 3 · In, illetve 5 · In között esik 0,1 s alá (elektromágneses kioldó, azonnal). Jelölve: 1,41 · In túlterhelési és 25 · In zárlati példa.'},
 'transzformator-mukodese/abra-1':{C:TranszformatorFelepites,desc:'Egyszerűsített transzformátor: zárt vasmag; a bal oszlopon sűrűbb primer tekercs (N1 = 1000, U1 = 230 V, I1 = 0,26 A), a jobb oszlopon ritkább szekunder tekercs (N2 ≈ 52, U2 = 12 V, I2 = 5 A) a terheléssel; a vasmagban körbefutó Φ fluxus. U1 / U2 = N1 / N2 = I2 / I1.'},
 'fenyforrasok-tipusai/abra-1':{C:FenyhasznositasSavok},
 'lampafoglalatok-es-lampatalpak/abra-1':{C:Lampatalpak},
 'lumen-es-lux/abra-1':{C:LumenLux},
 'szinhomerseklet/abra-1':{C:SzinhomersekletSkala},
 'ip-vedettseg/abra-1':{C:IpKod,desc:'Az IP-kód részei balról jobbra: az IP betűjel; az első számjegy (szilárd testek és por elleni védelem, 0–6); a második számjegy (víz elleni védelem, 0–9); a nem kötelező kiegészítő betű (A–D) és a nem kötelező pótbetű (H, M, S, W). Ha egy jellemzőt nem adnak meg, a számjegy helyén X áll, például IPX4.'},
 'ip-vedettseg/abra-2':{C:IpProbatestek,desc:'Az első számjegy próbatestei méretarányosan: 50 mm-es golyó (kézfej, 1), 12,5 mm-es golyó (ujj, 2), 2,5 mm-es (szerszám, 3) és 1 mm-es (huzal, 4) próbatest; a két legkisebb ötszörös nagyításban is. Az 5. és a 6. fokozatot finom porral vizsgálják.'},
 'vezetek-es-kabeljelolesek/abra-1':{C:KabelJeloles,desc:'A H05VV-F 3G1,5 jelölés tagjai: H – harmonizált; 05 – 300/500 V; V – PVC szigetelés; V – PVC köpeny; -F – finomhuzalos, hajlékony vezető; 3G1,5 – 3 ér, ebből 1 zöld-sárga, egyenként 1,5 mm². Alul a vezetők felépítése: U – tömör (egy szál), R – sodrott (7 szál), F és K – finomhuzalos (sok vékony szál); 1., 2. és 5. vezetőosztály.'},
 'vezetekek-szinjelolese/abra-1':{C:SzinjelolesMa,desc:'Öt ér színmintája felirattal: L1 barna, L2 fekete, L3 szürke, N kék, PE zöld-sárga (zöld alapon sárga csíkok). A tervező alaprajzán a PE egyszínű zöld.'},
 'vezetekek-szinjelolese/abra-2':{C:OtosKabel,desc:'Ötös kábel keresztmetszete. Ma (5G): PE zöld-sárga, N kék, L1 barna, L2 fekete, L3 szürke. Régebbi kábel (példa): zöld-sárga, kék, fekete, barna és még egy fekete ér; a fázisereken kérdőjel áll, mert a fázisok a színből nem különböztethetők meg.'},
};

export const figureDesc=(slug:string,block:Extract<KbBlock,{t:'figure'}>)=>block.desc??FIGURES[slug+'/'+block.id]?.desc??'';

/** Egy ábra a cikkben: <figure id="abra-N"> saját SVG-vel, ábraaláírással és szöveges megfelelővel. A figure akadálymentes neve az
 * „N. ábra. Cím”, a leírása a szöveges megfelelő (egyszer); az egyetlen SVG-ből álló ábra SVG-je csak a címet kapja névként. */
export function ArticleFigure({slug,block,n}:{slug:string;block:Extract<KbBlock,{t:'figure'}>;n:number}){
 const def=FIGURES[slug+'/'+block.id],desc=figureDesc(slug,block),uid='fig-'+block.id,cap=uid+'-cap',txt=uid+'-txt';
 const frame=def?.wide?{tabIndex:0,role:'group' as const,'aria-label':'Vízszintesen görgethető ábra: '+block.title,style:{'--kk-fig-min':def.wide+'px'} as React.CSSProperties}:{};
 return <figure className={'kk-fig'+(def?.wide?' kk-fig-wide':'')} id={block.id} aria-labelledby={cap} aria-describedby={txt}>
  <div className="kk-fig-frame" {...frame}>{def?<def.C uid={uid} title={block.title} desc=""/>:<p className="kk-fig-missing">Az ábra hamarosan elkészül.</p>}</div>
  <figcaption><span id={cap}><strong>{n}. ábra.</strong> {block.title}</span><span className="kk-fig-text" id={txt}>{desc}</span></figcaption>
 </figure>;
}
