// GENERÁLT FÁJL – node_modules/.bin/tsx scripts/quiz-release.ts build (a content/tudastar/kerdesek/*.json jóváhagyott kérdéseiből). Kézzel ne szerkeszd.
// A kérdésbank élesedéséig (lib/quiz/gate.ts: legalább 150 jóváhagyott kérdés, témakörönként legalább 10) témaköri fájl nem készül,
// és a betöltők listája üres: kérdésszöveg így nem kerülhet a build bemeneteibe. Élesedés után a kliens témakörönként, lustán tölti be a kérdéseket.
import type {BankQuestion} from '../engine';
import type {BankManifest} from '../gate';

export const BANK_MANIFEST:BankManifest={"version":1,"release":"14b8f096","live":false,"total":0,"topics":{"alapfogalmak-szamitasok":0,"kapcsolasok":0,"vedelmi-eszkozok":0,"erintesvedelem":0,"foldelesi-rendszerek":0,"kabelek-vezetekek":0,"meres":0,"gepek":0,"vilagitas":0,"munkabiztonsag":0},"minTotal":150,"minPerTopic":10};
export const BANK_LOADERS:Readonly<Record<string,()=>Promise<readonly BankQuestion[]>>>={
};
