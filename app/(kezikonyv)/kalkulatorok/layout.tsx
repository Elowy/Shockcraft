import type {Metadata} from 'next';
import {Shell} from '@/components/kezikonyv/shell';

export const metadata:Metadata={title:{template:'%s – Kalkulátorok – Villanyrajz',default:'Villamos kalkulátorok – Villanyrajz'}};

export default function KalkulatorokLayout({children}:{children:React.ReactNode}){
 return <Shell section="kalkulatorok">{children}</Shell>;
}
