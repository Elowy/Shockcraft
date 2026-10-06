'use client';
import {useState} from 'react';
import {toast} from 'sonner';
import type {Plan} from '@/lib/plan';
import {boardSize,boardSizeIssue} from '@/lib/board-size';
export function BoardSizeSettings({plan,buildingId,boardId='',change}:{plan:Plan;buildingId:string;boardId?:string;change:(fn:(p:Plan)=>void)=>void}){
 const size=boardSize(plan.buildings.find(b=>b.id===buildingId),boardId);
 const [rows,setRows]=useState(String(size.rows)),[columns,setColumns]=useState(String(size.modulesPerRow)),[error,setError]=useState('');
 return <details className="board-size-settings"><summary>Elosztó mérete · {size.rows} sor × {size.modulesPerRow} modul</summary><form onSubmit={e=>{e.preventDefault();const next={rows:Number(rows),modulesPerRow:Number(columns)},issue=boardSizeIssue(plan,buildingId,next,boardId);if(issue){setError(issue);return}change(p=>{const b=p.buildings.find(b=>b.id===buildingId)!;if(boardId)Object.assign(b.extraBoards!.find(v=>v.id===boardId)!,next);else b.board=next});setError('');toast.success('Elosztóméret módosítva.')}}><label className="field"><span>Sorok száma</span><input aria-label="Elosztó sorainak száma" type="number" min="1" max="12" step="1" required value={rows} onChange={e=>{setRows(e.target.value);setError('')}}/></label><label className="field"><span>Modulhely soronként</span><input aria-label="Elosztó modulhelyei soronként" type="number" min="1" max="36" step="1" required value={columns} onChange={e=>{setColumns(e.target.value);setError('')}}/></label><button type="submit" className="primary">Méret alkalmazása</button></form><p>A készülékek és bekötések a helyükön maradnak. Csökkentés előtt a kilógó készülékeket át kell helyezni.</p>{error&&<p role="alert" className="auth-error">{error}</p>}</details>;
}
