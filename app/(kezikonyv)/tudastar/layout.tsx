import type {Metadata} from 'next';

export const metadata:Metadata={title:{template:'%s – Tudástár – Villanyrajz',default:'Villanyszerelő Tudástár – Villanyrajz'}};

/** A Tudástár útvonalai. A Shell-t (fejléc, fülek, lábléc, kereső) a szekció-layoutok, illetve a kezdőlap és a 404-oldal adják. */
export default function TudastarLayout({children}:{children:React.ReactNode}){
 return children;
}
