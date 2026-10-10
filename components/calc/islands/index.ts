// A kalkulátoronkénti kliensszigetek (mindegyik csak a saját definícióját húzza be, így a kalkulátoroldal JS-e kicsi marad).
// Szerveroldali térkép: a [slug] oldal ebből választja ki a szigetet. Új kalkulátornál ide is fel kell venni (a tests/calc.ts ellenőrzi).
import type {ComponentType} from 'react';
import akkumulatorUzemido from './akkumulator-uzemido';
import aramTeljesitmenybol from './aram-teljesitmenybol';
import csillagDelta from './csillag-delta';
import ellenallasSzinkod from './ellenallas-szinkod';
import eredoEllenallas from './eredo-ellenallas';
import eredoKapacitas from './eredo-kapacitas';
import fazisjavitas from './fazisjavitas';
import fazisterheles from './fazisterheles';
import feszultseges from './feszultseges';
import feszultsegoszto from './feszultsegoszto';
import fogyasztasKoltseg from './fogyasztas-koltseg';
import homerseklet from './homerseklet';
import hurokimpedancia from './hurokimpedancia';
import keresztmetszet from './keresztmetszet';
import kismegszakito from './kismegszakito';
import latszolagosMeddoTeljesitmeny from './latszolagos-meddo-teljesitmeny';
import ledElotetEllenallas from './led-elotet-ellenallas';
import ledSzalagTapegyseg from './led-szalag-tapegyseg';
import lumenLux from './lumen-lux';
import mertekegysegAtvalto from './mertekegyseg-atvalto';
import motorAram from './motor-aram';
import ohmTorveny from './ohm-torveny';
import reaktanciaRezonancia from './reaktancia-rezonancia';
import teljesitmeny from './teljesitmeny';
import terhelhetosegTablazat from './terhelhetoseg-tablazat';
import transzformator from './transzformator';
import vezetekEllenallas from './vezetek-ellenallas';
export const CALC_ISLANDS:Readonly<Record<string,ComponentType>>={
'akkumulator-uzemido':akkumulatorUzemido,'aram-teljesitmenybol':aramTeljesitmenybol,'csillag-delta':csillagDelta,'ellenallas-szinkod':ellenallasSzinkod,'eredo-ellenallas':eredoEllenallas,'eredo-kapacitas':eredoKapacitas,'fazisjavitas':fazisjavitas,'fazisterheles':fazisterheles,'feszultseges':feszultseges,'feszultsegoszto':feszultsegoszto,'fogyasztas-koltseg':fogyasztasKoltseg,'homerseklet':homerseklet,'hurokimpedancia':hurokimpedancia,'keresztmetszet':keresztmetszet,'kismegszakito':kismegszakito,'latszolagos-meddo-teljesitmeny':latszolagosMeddoTeljesitmeny,'led-elotet-ellenallas':ledElotetEllenallas,'led-szalag-tapegyseg':ledSzalagTapegyseg,'lumen-lux':lumenLux,'mertekegyseg-atvalto':mertekegysegAtvalto,'motor-aram':motorAram,'ohm-torveny':ohmTorveny,'reaktancia-rezonancia':reaktanciaRezonancia,'teljesitmeny':teljesitmeny,'terhelhetoseg-tablazat':terhelhetosegTablazat,'transzformator':transzformator,'vezetek-ellenallas':vezetekEllenallas,
};
