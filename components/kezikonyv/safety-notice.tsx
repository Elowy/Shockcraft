import {ShieldAlert,TriangleAlert,Info} from 'lucide-react';
import type {SafetyId} from '@/lib/calc/core';
import {SAFETY} from '@/lib/kb/safety';

/** Nem bezárható figyelmeztető doboz (role="note"); ikon, keret és szöveg együtt jelöl, nem csak a szín. */
export function SafetyNotice({id,tone='info',extra}:{id:SafetyId;tone?:'info'|'warn'|'danger';extra?:React.ReactNode}){
 const s=SAFETY[id],Icon=tone==='danger'?ShieldAlert:tone==='warn'?TriangleAlert:Info;
 return <aside className={'kk-callout kk-callout-'+tone} role="note" aria-label={s.title}><Icon aria-hidden="true"/><div><strong>{s.title}</strong><p>{s.text}</p>{extra}</div></aside>;
}
/** A minden oldal láblécében álló alapfigyelmeztetés. */
export function BaseNotice(){return <p className="kk-base-notice" role="note"><ShieldAlert aria-hidden="true"/><span>{SAFETY.alap.text}</span></p>}
