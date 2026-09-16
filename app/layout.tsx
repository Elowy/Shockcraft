import type { Metadata } from "next";import "./globals.css";
export const metadata: Metadata={title:"ShockCraft – Villamos tervszerkesztő",description:"Épületek, szintek, villamos alaprajzok és lakáselosztók tervezése.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="hu"><body>{children}</body></html>}
