// Kidolgozott példa: szerveroldalon renderelt levezetés az első golden példából – JS nélkül is olvasható.
import {runCalc,type CalcDef} from '@/lib/calc/core';
import {CalcFigure} from './calc-figures';

export function CalcExample({def}:{def:CalcDef}){
 const ex=def.examples[0];if(!ex)return null;
 const run=runCalc(def,ex.input);if(!run.ok)return null;
 return <section className="kk-example" id="pelda" aria-labelledby="pelda-cim">
  <h2 id="pelda-cim">Kidolgozott példa: {ex.title}</h2>
  <ol className="kk-steps">{run.out.steps.map((s,i)=><li key={i}><b>{s.label}</b><code>{s.formula}</code><span>{s.substituted}</span><strong>= {s.result}</strong>{s.ref&&<small>Forrás: {s.ref}</small>}</li>)}</ol>
  <p className="kk-example-result"><b>Eredmény:</b> {run.out.results.filter(r=>r.primary).map(r=>r.label+': '+(r.text??r.value)).join('; ')}</p>
  {run.out.figure&&<figure className="kk-figure"><CalcFigure figure={run.out.figure} id={'pelda-abra-'+def.slug}/></figure>}
 </section>;
}
