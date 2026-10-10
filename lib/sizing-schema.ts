import {z} from 'zod';
import {INSTALL_METHODS,INSULATIONS,SECTIONS} from './sizing-tables';
import {boards} from './board-size';
import type {Plan} from './plan';

// Méretezési segédszámítás – opcionális tervmezők. Egyik sem kap alapértéket (.default()): a régi tervek változatlanok.
export const circuitSizingSchema=z.object({
 method:z.enum(INSTALL_METHODS).optional(),          // minden szakaszra érvényes szerelési mód
 insulation:z.enum(INSULATIONS).optional(),
 ambient:z.number().int().min(10).max(60).optional(),  // °C, levegő
 grouped:z.number().int().min(1).max(20).optional(),   // együtt vezetett terhelt áramkörök száma
 length:z.number().finite().min(0.1).max(1000).optional(), // m, mértékadó hossz (felülírja a nyomvonalösszeget)
 cosPhi:z.number().finite().min(0.5).max(1).optional(),
 usage:z.enum(['lighting','other']).optional()
});
const boardSizingSchema=z.object({building:z.string().min(1).max(80),board:z.string().max(80),upstreamDrop:z.number().finite().min(0).max(10).optional(),zs:z.number().finite().min(0.01).max(20).optional()});
const overrideSchema=z.object({method:z.enum(INSTALL_METHODS),insulation:z.enum(INSULATIONS),loaded:z.union([z.literal(2),z.literal(3)]),section:z.number().refine(v=>(SECTIONS as readonly number[]).includes(v),'Nem szabványos keresztmetszet.'),iz:z.number().finite().min(1).max(1000),note:z.string().trim().min(3).max(200)});
export const planSizingSchema=z.object({
 methodInside:z.enum(INSTALL_METHODS).optional(),methodOutside:z.enum(INSTALL_METHODS).optional(),
 insulation:z.enum(INSULATIONS).optional(),
 ambient:z.number().int().min(10).max(60).optional(),grouped:z.number().int().min(1).max(20).optional(),
 supply:z.enum(['public','private']).optional(),   // G.52.1: közcélú hálózat / saját táppont
 earthing:z.enum(['TN','TT']).optional(),
 boards:z.array(boardSizingSchema).max(600).optional(),
 overrides:z.array(overrideSchema).max(100).optional()
});
export type CircuitSizing=z.infer<typeof circuitSizingSchema>;export type PlanSizing=z.infer<typeof planSizingSchema>;
export type BoardSizingEntry=NonNullable<PlanSizing['boards']>[number];
export type IzOverrideEntry=NonNullable<PlanSizing['overrides']>[number];
export const overrideKey=(o:{method:string;insulation:string;loaded:number;section:number})=>`${o.method}|${o.insulation}|${o.loaded}|${o.section}`;

/** Csendes rendrakás a validatePlan végén: árva/ismétlődő elosztó-beállítás és ismétlődő felülírás törlése (az első marad). Nem dob hibát. */
export function pruneSizing(p:Plan){
 const s=p.sizing;if(!s)return;
 if(s.boards){
  const seen=new Set<string>();
  s.boards=s.boards.filter(x=>{const key=x.building+'\u0000'+x.board;if(seen.has(key)||!p.buildings.some(b=>b.id===x.building&&boards(b).some(v=>v.id===x.board)))return false;seen.add(key);return true});
  if(!s.boards.length)delete s.boards;
 }
 if(s.overrides){
  const seen=new Set<string>();
  s.overrides=s.overrides.filter(o=>{const key=overrideKey(o);if(seen.has(key))return false;seen.add(key);return true});
  if(!s.overrides.length)delete s.overrides;
 }
 if(Object.values(s).every(v=>v===undefined))delete p.sizing;
}
