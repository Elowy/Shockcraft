// Mértékegységek SI-szorzóval. Az `id` ASCII (az URL-ben `<mező>.e=<id>` alakban szerepel), a `label` a kiírt jel.
import {HP_W,LE_W} from './constants';

export type Unit={id:string;label:string;factor:number};
const u=(id:string,label:string,factor:number):Unit=>({id,label,factor});

export const UNITS={
 voltage:[u('V','V',1),u('mV','mV',1e-3),u('kV','kV',1e3)],
 current:[u('A','A',1),u('mA','mA',1e-3),u('kA','kA',1e3)],
 resistance:[u('ohm','Ω',1),u('mohm','mΩ',1e-3),u('kohm','kΩ',1e3),u('Mohm','MΩ',1e6)],
 power:[u('W','W',1),u('kW','kW',1e3),u('MW','MW',1e6)],
 motorPower:[u('kW','kW',1e3),u('W','W',1),u('LE','LE',LE_W),u('hp','hp',HP_W)],
 apparent:[u('VA','VA',1),u('kVA','kVA',1e3),u('MVA','MVA',1e6)],
 reactive:[u('var','var',1),u('kvar','kvar',1e3),u('Mvar','Mvar',1e6)],
 energy:[u('Wh','Wh',1),u('kWh','kWh',1e3),u('MWh','MWh',1e6)],
 /** Energia joule-lal is (alapegység: Wh; 1 kWh = 3,6 MJ). */
 energyAll:[u('kWh','kWh',1e3),u('Wh','Wh',1),u('MWh','MWh',1e6),u('J','J',1/3600),u('kJ','kJ',1/3.6),u('MJ','MJ',1e6/3600)],
 length:[u('m','m',1),u('km','km',1e3)],
 capacitance:[u('uF','µF',1e-6),u('nF','nF',1e-9),u('pF','pF',1e-12),u('mF','mF',1e-3),u('F','F',1)],
 inductance:[u('mH','mH',1e-3),u('uH','µH',1e-6),u('H','H',1)],
 frequency:[u('Hz','Hz',1),u('kHz','kHz',1e3),u('MHz','MHz',1e6)],
 charge:[u('Ah','Ah',1),u('mAh','mAh',1e-3)],
} as const satisfies Record<string,readonly Unit[]>;
export type UnitKind=keyof typeof UNITS;

export const unitById=(kind:UnitKind,id:string|undefined):Unit|undefined=>(UNITS[kind] as readonly Unit[]).find(x=>x.id===id);
