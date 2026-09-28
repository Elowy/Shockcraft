'use client';
import {Printer} from 'lucide-react';
export function LegalPrint(){return <button className="legal-print" onClick={()=>window.print()}><Printer size={16}/>Nyomtatás / PDF mentése</button>}
