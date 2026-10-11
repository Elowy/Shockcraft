'use client';
import def from '@/lib/calc/defs/vezetek-ellenallas';
import {Calculator} from '../calculator';
export default function Island(){return <Calculator def={def}/>}
/** A definíció a Tesztek számolós feladataihoz is (components/quiz/calc-defs.ts lustán, ebből a szigetből tölti: közös csomag a kalkulátoroldallal). */
export {def};
