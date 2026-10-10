// A kézikönyv (Tudástár és Kalkulátorok) közös útvonalcsoportja. Nincs benne getAccount, adatbázis, auth vagy next/headers:
// az oldalak statikusak (ISR), belépés, süti és előfizetés nélkül használhatók (tests/kb-guards.ts ellenőrzi).
import type {Metadata,Viewport} from 'next';
import {ThemeBoot} from '@/components/kezikonyv/theme-boot';
import {siteOrigin} from '@/lib/site-origin';
import './kezikonyv.css';

export async function generateMetadata():Promise<Metadata>{
 const origin=siteOrigin();
 return {metadataBase:origin?new URL(origin):undefined,openGraph:{siteName:'Villanyrajz',locale:'hu_HU'}};
}
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:[{media:'(prefers-color-scheme: light)',color:'#ffffff'},{media:'(prefers-color-scheme: dark)',color:'#17222c'}]};

export default function KezikonyvLayout({children}:{children:React.ReactNode}){
 return <><ThemeBoot/>{children}</>;
}
