import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.SHOCKCRAFT_TARGET==='node'?{output:'standalone' as const}:{}),
  // A megosztott terv oldala: ne indexelődjön, ne kerüljön keretbe, és ne szivárogjon Referer.
  // Cache-Control-t itt nem adunk: a vinext a meglévőt nem írja felül; a no-store-t az oldal force-dynamic beállítása adja.
  async headers(){return [{source:'/megosztas',headers:[
    {key:'X-Robots-Tag',value:'noindex, nofollow, noarchive'},
    {key:'Referrer-Policy',value:'no-referrer'},
    {key:'X-Frame-Options',value:'DENY'},
    {key:'X-Content-Type-Options',value:'nosniff'},
    {key:'Content-Security-Policy',value:"frame-ancestors 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; connect-src 'self'; img-src 'self' blob: data:"},
  ]}]},
};

export default nextConfig;
