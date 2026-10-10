import type { NextConfig } from "next";

// Kézikönyv (Tudástár és Kalkulátorok): biztonsági fejlécek a gyökérre és az aloldalakra (a '/tudastar/:path*' a '/tudastar'-ra nem illeszkedik).
// Cache-Control-t itt nem adunk: ezeken az oldalakon a vinext felülírja; az élettartamot az oldalak revalidate-je szabja meg.
// Az 'unsafe-inline' oka: a vinext inline RSC-szkripteket ír ki, és nonce-szal az oldal nem lehetne gyorsítótárazható (docs/tudastar-terv.md 3.2).
const KEZIKONYV_SOURCES=['/:root(tudastar|kalkulatorok)','/tudastar/:path*','/kalkulatorok/:path*'];
const KEZIKONYV_CSP="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self'; manifest-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'";
const KEZIKONYV_HEADERS=[
  {key:'Content-Security-Policy',value:KEZIKONYV_CSP},
  {key:'X-Content-Type-Options',value:'nosniff'},
  {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
  {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
];

const nextConfig: NextConfig = {
  ...(process.env.SHOCKCRAFT_TARGET==='node'?{output:'standalone' as const}:{}),
  // A megosztott terv oldala: ne indexelődjön, ne kerüljön keretbe, és ne szivárogjon Referer.
  // Cache-Control-t itt nem adunk: a vinext a meglévőt nem írja felül; a no-store-t az oldal force-dynamic beállítása adja.
  async headers(){return [...KEZIKONYV_SOURCES.map(source=>({source,headers:KEZIKONYV_HEADERS})),{source:'/megosztas',headers:[
    {key:'X-Robots-Tag',value:'noindex, nofollow, noarchive'},
    {key:'Referrer-Policy',value:'no-referrer'},
    {key:'X-Frame-Options',value:'DENY'},
    {key:'X-Content-Type-Options',value:'nosniff'},
    {key:'Content-Security-Policy',value:"frame-ancestors 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; connect-src 'self'; img-src 'self' blob: data:"},
  ]}]},
};

export default nextConfig;
