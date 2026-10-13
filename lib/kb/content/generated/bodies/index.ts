// GENERÁLT FÁJL – ne szerkeszd kézzel. Forrás: content/tudastar/*; generátor: node_modules/.bin/tsx scripts/kb-content.ts build (docs/tudastar.md).
// A cikktörzsek – CSAK szerveroldal (lib/kb/content/registry.ts) importálja; kliensszigetbe nem kerülhet (tests/kb-guards.ts).
import type {KbBody} from '../../types';
import b_elektromos_aram from './elektromos-aram';
import b_elektromos_ellenallas from './elektromos-ellenallas';
import b_elektromos_feszultseg from './elektromos-feszultseg';
import b_elektromos_teljesitmeny from './elektromos-teljesitmeny';
import b_fenyforrasok_tipusai from './fenyforrasok-tipusai';
import b_ip_vedettseg from './ip-vedettseg';
import b_joule_lenz_torveny from './joule-lenz-torveny';
import b_kirchhoff_torvenyei from './kirchhoff-torvenyei';
import b_lampafoglalatok_es_lampatalpak from './lampafoglalatok-es-lampatalpak';
import b_lumen_es_lux from './lumen-es-lux';
import b_ohm_torvenye from './ohm-torvenye';
import b_rovidzarlat_es_tulterheles from './rovidzarlat-es-tulterheles';
import b_soros_es_parhuzamos_kapcsolas from './soros-es-parhuzamos-kapcsolas';
import b_szakszotar from './szakszotar';
import b_szinhomerseklet from './szinhomerseklet';
import b_transzformator_mukodese from './transzformator-mukodese';
import b_vezetek_es_kabeljelolesek from './vezetek-es-kabeljelolesek';
import b_vezetekek_szinjelolese from './vezetekek-szinjelolese';

export const KB_BODIES:Readonly<Record<string,KbBody>>={
 'elektromos-aram':b_elektromos_aram,
 'elektromos-ellenallas':b_elektromos_ellenallas,
 'elektromos-feszultseg':b_elektromos_feszultseg,
 'elektromos-teljesitmeny':b_elektromos_teljesitmeny,
 'fenyforrasok-tipusai':b_fenyforrasok_tipusai,
 'ip-vedettseg':b_ip_vedettseg,
 'joule-lenz-torveny':b_joule_lenz_torveny,
 'kirchhoff-torvenyei':b_kirchhoff_torvenyei,
 'lampafoglalatok-es-lampatalpak':b_lampafoglalatok_es_lampatalpak,
 'lumen-es-lux':b_lumen_es_lux,
 'ohm-torvenye':b_ohm_torvenye,
 'rovidzarlat-es-tulterheles':b_rovidzarlat_es_tulterheles,
 'soros-es-parhuzamos-kapcsolas':b_soros_es_parhuzamos_kapcsolas,
 'szakszotar':b_szakszotar,
 'szinhomerseklet':b_szinhomerseklet,
 'transzformator-mukodese':b_transzformator_mukodese,
 'vezetek-es-kabeljelolesek':b_vezetek_es_kabeljelolesek,
 'vezetekek-szinjelolese':b_vezetekek_szinjelolese,
};
