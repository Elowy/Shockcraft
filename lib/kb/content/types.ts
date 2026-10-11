// A Tudástár tartalommodellje (docs/tudastar-terv.md 3.3, 4.4; docs/tudastar.md).
// A forrás a content/tudastar/<szekció>/*.md vázlat (YAML front matter + Markdown); ebből a scripts/kb-content.ts build-időben
// típusos TS-modulokat generál (lib/kb/content/generated). Futásidőben nincs Markdown-parser: a blokkok előre feldolgozottak,
// a sorközi mini-jelölést (lib/kb/content/inline.ts) csak szerverkomponens rendereli. Tiszta típusmodul (zod nélkül).

export type KbSectionId='elmelet'|'semak';
export type KbRisk='R1'|'R2'|'R3';
export type KbAudience='laikus'|'tanulo'|'szakember';

/** Forrásmegjelölés a front matterből (standard / kiadás / pont). `check`: a kiadás vagy a pontszám ellenőrzésre vár – a lektori
 * kérdéslistán szerepel, vagy a vázlat YAML-megjegyzése jelzi; a felületen visszafogott „kiadás ellenőrzés alatt” jelölés. */
export type KbSource={standard:string;kiadas:string;pont:string;check?:{reasons:readonly string[]}};

/** Szakszótár-tétel: `id` a horgony (/tudastar/szotar#<id>), `note` a zárójeles kiegészítés (jel, mértékegység, más néven …). */
export type KbTerm={id:string;term:string;note:string|null;text:string};

/** Tartalmi blokkok. A szövegmezők sorközi mini-jelölést tartalmaznak: **félkövér**, _dőlt_, `kód`, X_{alsó}, X^{felső}, [[id#horgony|szöveg]]. */
export type KbBlock=
 /** „Röviden:” doboz. */
 |{t:'rovid';text:string}
 /** A vázlat „> **Figyelem:** …” doboza (R2-nél kötelező). */
 |{t:'callout';kind:'figyelem';label:string;text:string}
 |{t:'h2';id:string;text:string}
 |{t:'h3';id:string;text:string}
 /** Bekezdés; a forrás sortörései megmaradnak (kidolgozott példák lépései). */
 |{t:'p';lines:readonly string[]}
 /** Önálló képletsor. */
 |{t:'formula';text:string}
 |{t:'ul';items:readonly string[]}
 |{t:'ol';items:readonly string[]}
 |{t:'table';head:readonly string[];rows:readonly (readonly string[])[]}
 /** Ábra a vázlat [ÁBRA: …] helyőrzőjéből: `caption` az ábraaláírás, `title`/`desc` a helyőrző title/desc mezője (ha volt),
  * `spec` a helyőrző teljes rajzleírása (nem jelenik meg; a components/kezikonyv/figures saját SVG-je ez alapján készült). */
 |{t:'figure';id:string;caption:string;title:string;desc:string|null;spec:string}
 /** Kidolgozott példa vagy számpélda: a „**Kidolgozott példa …**” bekezdés és a közvetlenül hozzá tartozó számítási sorok. */
 |{t:'example';blocks:readonly KbBlock[]}
 /** Szakszótár-tételek egy betű alatt. */
 |{t:'terms';items:readonly KbTerm[]};

export type KbBody={blocks:readonly KbBlock[];sources:readonly KbSource[]};

/** Könnyű, kliensre is átadható metaadat (kereső, menük, kártyák). `fingerprint`: a tartalom ujjlenyomata (lib/kb/content/fingerprint.ts);
 * `figures`: az ábrák forrás-ujjlenyomata (scripts/kb-content/figures.ts: a hivatkozott ábrakomponens modulja és helyi importjai – kit.tsx –,
 * a FIGURES-bejegyzés a szöveges megfelelővel, az ábraszínek a stíluslapból; '' ha a cikkben nincs ábra). Futásidőben nem számolható
 * újra (nincs fájlolvasás), ezért a generált értéket a CI veti össze a forrással (tests/kb-content.ts, scripts/kb-content.ts check). */
export type KbMeta={
 id:string;slug:string;section:KbSectionId;category:string;
 title:string;navTitle:string;summary:string;risk:KbRisk;audience:readonly KbAudience[];
 keywords:readonly string[];synonyms:readonly string[];related:readonly string[];calculators:readonly string[];
 /** MI-használat a front matter szerint (nincs | vázlat | nyelvi). */
 ai:string;version:string;updated:string;
 /** A H2-k (tartalomjegyzék, kereső, horgonyos linkek ellenőrzése). */
 anchors:readonly {id:string;title:string}[];
 words:number;fingerprint:string;figures:string;
};

/** Lektorra váró (R3) vázlat a regiszterben: SZÖVEG NÉLKÜL (se cím, se összefoglaló) – csak azonosítók, hogy a belső linkek
 * „hamarosan – szakmai lektorálás alatt” jelöléssel jelenhessenek meg, és a teszt a kaput ellenőrizhesse. A törzs nem kerül a buildbe. */
export type KbPending={id:string;slug:string;section:KbSectionId;category:string;risk:KbRisk};

/** Változásnapló-bejegyzés (lib/kb/content/changes.ts). */
export type KbChange={date:string;version:string;kind:'elso-kozzetetel'|'javitas'|'bovites'|'biztonsagi-javitas'|'felulvizsgalat';summary:string};
