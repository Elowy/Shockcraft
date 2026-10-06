'use client';
import {useState,useEffect} from 'react';
import {Plus,Settings2,Trash2} from 'lucide-react';
import {toast} from 'sonner';
import {uid,type Plan} from '@/lib/plan';
import {boards,boardName,boardDeleteIssue,DEFAULT_BOARD} from '@/lib/board-size';
export function BoardManager({plan,buildingId,boardId,onSelect,change}:{plan:Plan;buildingId:string;boardId:string;onSelect:(id:string)=>void;change:(fn:(p:Plan)=>void)=>void}){
 const building=plan.buildings.find(b=>b.id===buildingId)!;
 const [name,setName]=useState(boardName(building,boardId));
 useEffect(()=>setName(boardName(building,boardId)),[building.boardName,building.extraBoards,boardId]);
 function rename(){const value=name.trim();if(!value){toast.error('Adj nevet az elosztónak.');return}change(p=>{const b=p.buildings.find(b=>b.id===buildingId)!;if(boardId)b.extraBoards!.find(v=>v.id===boardId)!.name=value;else b.boardName=value});toast.success('Elosztó átnevezve.')}
 return <div className="board-manager"><label>Elosztó<select aria-label="Aktuális elosztó" value={boardId} onChange={e=>onSelect(e.target.value)}>{boards(building).map(b=><option key={b.id} value={b.id}>{b.name} · {b.rows} × {b.modulesPerRow}</option>)}</select></label><button disabled={(building.extraBoards?.length||0)>=19} onClick={()=>{const id=uid();change(p=>{const b=p.buildings.find(b=>b.id===buildingId)!;b.extraBoards??=[];b.extraBoards.push({id,name:'Alelosztó '+(b.extraBoards.length+1),...DEFAULT_BOARD})});onSelect(id);toast.success('Új alelosztó létrehozva.')}}><Plus/> Új alelosztó</button><details><summary><Settings2 size={16}/> Elosztó kezelése</summary><form onSubmit={e=>{e.preventDefault();rename()}}><label>Elosztó neve<input aria-label="Elosztó neve" maxLength={120} required value={name} onChange={e=>setName(e.target.value)}/></label><button type="submit">Átnevezés</button>{boardId&&<button type="button" className="danger" onClick={()=>{const issue=boardDeleteIssue(plan,buildingId,boardId);if(issue){toast.error(issue);return}change(p=>{const b=p.buildings.find(b=>b.id===buildingId)!;b.extraBoards=b.extraBoards?.filter(v=>v.id!==boardId)});onSelect('');toast.success('Az üres alelosztó törölve. A művelet visszavonható.')}}><Trash2/> Üres elosztó törlése</button>}</form><p>Épületenként legfeljebb 20 elosztó. Mindegyiknek saját készülékei, áramkörei és kapcsolási rajzai vannak. Az alaprajzi elosztójel tulajdonságainál választhatod ki a hozzá tartozó szekrényt.</p></details></div>;
}
