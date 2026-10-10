import type { Metadata } from "next";import "./globals.css";import "./public.css";import {CookieNotice} from '@/components/cookie-notice';
export const metadata: Metadata={title:"Villanyrajz – Villamos tervszerkesztő",description:"Épületek, szintek, villamos alaprajzok és lakáselosztók tervezése.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="hu" suppressHydrationWarning><body>{children}<CookieNotice/></body></html>}
