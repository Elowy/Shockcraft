"use client";
import {useRef} from "react";
import {X} from "lucide-react";
// A címke a kijelölő lenyomás pillanatában jelenik meg: érintésnél a böngésző ugyanabból a koppintásból származó „szellemkattintása” a címke
// gombjára érkezhet (a nyitás vagy a kijelölés törlése magától megtörténne). Ezért csak az a kattintás számít, amelynek lenyomása is a gombon volt
// (vagy billentyűzetről / kisegítő technológiától jött: detail 0).
function ChipButton({onAct,...p}:Omit<React.ComponentProps<"button">,"onClick">&{onAct:()=>void}){const own=useRef(false);return <button {...p} onPointerDown={()=>{own.current=true}} onPointerCancel={()=>{own.current=false}} onClick={e=>{const mine=e.detail===0||own.current;own.current=false;if(mine)onAct()}}/>}
// Kijelölési címke keskeny szerkesztőablakban: a tulajdonságpanel nem nyílik meg magától, ezen a címkén át kérhető.
export function SelectionChip({label,onOpen,onClear}:{label:string;onOpen:()=>void;onClear:()=>void}){return <div className="selection-chip"><span role="status">{label}</span><ChipButton className="selection-open" onAct={onOpen}>Tulajdonságok</ChipButton><ChipButton className="selection-clear" aria-label="Kijelölés megszüntetése" title="Kijelölés megszüntetése" onAct={onClear}><X/></ChipButton></div>}
