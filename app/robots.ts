// robots.txt: minden nyilvános oldal indexelhető; az API, az admin, a fiókoldalak és a (később érkező) könyvjelzőoldal nem.
// A /megosztas szándékosan nincs tiltva: a robotnak látnia kell az X-Robots-Tag: noindex fejlécet.
import type {MetadataRoute} from 'next';
import {siteOrigin} from '@/lib/site-origin';

export default function robots():MetadataRoute.Robots{
 const origin=siteOrigin();
 return {rules:[{userAgent:'*',allow:'/',disallow:['/api/','/admin','/fiok/','/tudastar/konyvjelzok']}],...(origin?{sitemap:origin+'/sitemap.xml'}:{})};
}
