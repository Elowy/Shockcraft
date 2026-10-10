import {z} from 'zod';
const price=z.number().finite().min(0).max(1_000_000).nullable();
const date=z.string().refine(s=>s===''||/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s,'Érvénytelen dátum.');
export const isoDay=date;
// Termékpillanatkép a katalógusból: a választáskor a tervbe másolódik, a katalógus későbbi változása nem hat rá.
export const unitPrice=price;
export const productDisplays=['none','brand','sku'] as const;
// Láthatatlan és irányváltó karakterek (C1 vezérlők, nulla szélességű jelek, bidi-felülírók és -izolálók, BOM): a katalógus és a
// pillanatkép csendben elhagyja őket, így a megjelenítés nem hamisítható, és a már tárolt adat is betölthető marad.
const INVISIBLE=/[\u0080-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff]/g;
export const stripInvisible=(s:string)=>s.replace(INVISIBLE,'');
// A pillanatkép idegen JSON-ból (importált terv) is érkezhet: a vezérlőkarakter kimarad, a sortörés és a tabulátor szóköz lesz.
// A kimenet újra érvényes bemenet (a név nem válhat üressé), ezért a többszöri parse sem hibázik.
const snapText=(s:string)=>stripInvisible(s).replace(/[\t\r\n]+/g,' ').replace(/[\x00-\x1f\x7f]/g,'');
export const productSnapshotSchema=z.object({id:z.string().min(1).max(80),manufacturer:z.string().max(80).transform(snapText),family:z.string().max(120).transform(snapText),sku:z.string().max(60).transform(snapText),name:z.string().min(1).max(240).transform(s=>snapText(s)||'Névtelen termék'),unit:z.enum(['db','m']),price,labor:price,sample:z.literal(true).optional()});
export type ProductSnapshot=z.infer<typeof productSnapshotSchema>;
export type ProductDisplay=typeof productDisplays[number];
export const quoteLineSchema=z.object({id:z.string().min(1).max(80),sourceKey:z.string().max(1500).optional(),name:z.string().max(240),detail:z.string().max(500),unit:z.enum(['db','m','óra','tétel']),quantity:z.number().finite().min(0).max(10000),material:price,labor:price,included:z.boolean(),allowance:z.boolean(),product:productSnapshotSchema.optional(),productPinned:z.literal(true).optional()});
export const travelSchema=z.object({mode:z.enum(['per_km','fixed']),km:z.number().finite().min(0).max(9999),ratePerKm:z.number().finite().min(0).max(100000),fixed:z.number().finite().min(0).max(10_000_000)});
export const quoteSchema=z.object({version:z.literal(1),number:z.string().max(80),date,validUntil:date,supplier:z.string().max(1500),customer:z.string().max(1500),site:z.string().max(500),notes:z.string().max(5000),vat:z.enum(['AAM','0','5','18','27']),discount:z.number().finite().min(0).max(100),allowance:z.number().finite().min(0).max(50),travel:travelSchema.optional(),productDefaults:z.array(z.object({ref:z.string().min(1).max(120),product:productSnapshotSchema})).max(300).optional(),productDisplay:z.enum(productDisplays).optional(),sourceSignature:z.string().max(1_000_000),lines:z.array(quoteLineSchema).max(500)}).superRefine((q,ctx)=>{if(new Set(q.lines.map(l=>l.id)).size!==q.lines.length)ctx.addIssue({code:'custom',message:'Ismétlődő ajánlati tétel.'});if(q.productDefaults&&new Set(q.productDefaults.map(d=>d.ref)).size!==q.productDefaults.length)ctx.addIssue({code:'custom',message:'Ismétlődő termékválasztás.'});if(q.date&&q.validUntil&&q.validUntil<q.date)ctx.addIssue({code:'custom',message:'Az érvényesség vége nem lehet korábbi a kiállításnál.'})});
export type Quote=z.infer<typeof quoteSchema>;
export type QuoteLine=z.infer<typeof quoteLineSchema>;
export type Travel=z.infer<typeof travelSchema>;
