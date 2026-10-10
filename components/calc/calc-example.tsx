// Kidolgozott példa: szerveroldalon renderelt levezetés az első golden példából – JS nélkül is olvasható.
import {mainResults,runCalc,type CalcDef} from '@/lib/calc/core';
import {CalcFigure} from './calc-figures';
import {Sub} from './sub';

export function CalcExample({def}:{def:CalcDef}){
 const ex=def.examples[0];if(!ex)return null;
 const run=runCalc(def,ex.input);if(!run.ok)return null;
 return <section className="kk-example" id="pelda" aria-labelledby="pelda-cim">
  <h2 id="pelda-cim">Kidolgozott példa: {ex.title}</h2>
  <ol className="kk-steps">{run.out.steps.map((s,i)=><li key={i}><b>{s.label}</b><code><Sub text={s.formula}/></code><span><Sub text={s.substituted}/></span><strong>= <Sub text={s.result}/></strong>{s.ref&&<small>Forrás: {s.ref}</small>}</li>)}</ol>
  <p className="kk-example-result"><b>Eredmény:</b> {mainResults(run.out).map(r=>r.label+': '+(r.text??r.value)).join('; ')}</p>
  {run.out.figure&&<figure className="kk-figure"><CalcFigure figure={run.out.figure} id={'pelda-abra-'+def.slug}/></figure>}
 </section>;
}
