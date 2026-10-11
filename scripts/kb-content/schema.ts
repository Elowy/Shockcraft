// A forrásvázlatok front matterének sémája (docs/tudastar-terv.md 4.4). Zod – csak a generátor és a tesztek használják,
// a futó alkalmazásba nem kerül (a kézikönyv-kód zod nélküli: tests/kb-guards.ts).
import {z} from 'zod';

const slug=z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,'ékezet nélküli, kisbetűs, kötőjeles slug');
const text=(min:number,max:number)=>z.string().trim().min(min).max(max);
export const frontMatterSchema=z.object({
 slug,
 title:text(10,70),
 navTitle:text(3,34),
 summary:text(80,160),
 section:z.enum(['elmelet','semak']),
 category:slug,
 risk:z.enum(['R1','R2','R3']),
 audience:z.array(z.enum(['laikus','tanulo','szakember'])).min(1),
 keywords:z.array(text(1,80)).min(3),
 synonyms:z.array(text(1,80)),
 related:z.array(slug),
 calculators:z.array(slug),
 sources:z.array(z.object({standard:text(3,200),kiadas:text(1,200),pont:text(1,400),comments:z.array(z.string())})).min(1),
 ai:z.enum(['nincs','vázlat','nyelvi']),
 version:z.string().regex(/^\d+(?:\.\d+)?$/),
 updated:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).strict();
export type FrontMatterChecked=z.infer<typeof frontMatterSchema>;
