// Alsó index a képletekben és a levezetésben: a definíciók szövegében „I_N”, „P_átl”, „A_PE” áll (így a másolt és a gépi szöveg is olvasható),
// a felületen ebből I<sub>N</sub>, P<sub>átl</sub> lesz. Szerver- és kliensoldalon is renderelhető, hook nélkül.
const SUB=/([A-Za-zΔΣθφη])_([0-9A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)/g;

export function Sub({text}:{text:string}){
 if(!text.includes('_'))return <>{text}</>;
 const parts:React.ReactNode[]=[];let last=0,k=0;
 for(const m of text.matchAll(SUB)){
  parts.push(text.slice(last,m.index)+m[1],<sub key={k++}>{m[2]}</sub>);
  last=m.index+m[0].length;
 }
 parts.push(text.slice(last));
 return <>{parts}</>;
}
/** A szöveges (másolt, felolvasott) alak: az aláhúzás nélkül, zárójelben – „I_N” → „I(N)”. */
export const plainSub=(text:string)=>text.replace(SUB,'$1($2)');
