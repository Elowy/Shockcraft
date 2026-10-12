// A földelési rendszerek jelölése (TN-C, TN-S, TN-C-S) a megjelenített címekben nem törhető: a kötőjelnél tört sor („TN-” / „C-S”)
// félreolvasást okozna, holott éppen a TN-C és a TN-C-S különbsége a lényeg. A <title>, a kereső és a szöveg tartalma változatlan
// (a span csak a törést tiltja). Szerverkomponens, kliens-JS nélkül.
import type {ReactNode} from 'react';

// Állapot nélküli minta (nincs `g` jelző, így nincs `lastIndex` sem): a felosztás a találatot rögzítő csoporttal adja a törhetetlen részeket.
const TERMS=/(TN-C-S|TN-C|TN-S)/;
export function NoWrap({text}:{text:string}):ReactNode{
 if(!TERMS.test(text))return text;
 return <>{text.split(/(TN-C-S|TN-C|TN-S)/).map((p,i)=>i%2?<span key={i} className="kk-nowrap">{p}</span>:p)}</>;
}
