# Fázisterhelés

Az **Eszközök → Fázisterhelés** nézet elosztónként összesíti az áramkörök terhelését L1, L2 és L3 fázisra.

## Terhelés megadása

Az elosztó **Áramkörjegyzék** táblázatában minden áramkörnél megadható a **Terhelés (W)**. Ha a mező üres, a hozzárendelt szerelvényekből becsülünk:

| Szerelvény | Becsült teljesítmény |
|---|---|
| Dugalj | 200 W |
| Kettős dugalj | 400 W |
| Lámpakiállás | 100 W |
| Egyéb (kapcsoló, kötődoboz, RJ45 stb.) | 0 W |

A becsült értéket a mező szürke helyőrzője mutatja (pl. „≈ 600”). Beírt érték esetén a becslés nem számít; a 0 W is érvényes megadott érték. A mező törlésével visszaáll a becslés.

## Számítás

- Egyfázisú áramkör: a teljes terhelés a kiválasztott fázisra kerül, I = P / 230 V.
- Háromfázisú (3P) áramkör: a terhelés egyenlően oszlik a három fázis között, fázisonként I = P / 3 / 230 V.
- cos φ = 1, egyidejűségi tényező nincs.
- **Aszimmetria:** a legnagyobb fázis eltérése az átlagtól, az átlag százalékában.

## Figyelmeztetések

- **Kiegyenlítetlen fázisterhelés:** 20% feletti aszimmetria.
- **Túlterhelés:** az áramkör számított árama nagyobb a kismegszakító névleges áramánál.
- **Nincs terhelés:** az áramkörnek sem megadott terhelése, sem becsülhető szerelvénye nincs, vagy a megadott érték 0 W.

## PDF

Az elosztó PDF-exportja (Elosztó és Teljes projekt hatókör) „Elosztó - fázisterhelés” táblázatot tartalmaz: áramkörönkénti terhelés és áram, a becsült értékek jelölésével, fázisonkénti összesítés, összes teljesítmény és aszimmetria.

## Korlátok

Tájékoztató összesítés, nem villamos méretezés. Nem számol egyidejűséggel, teljesítménytényezővel, indítási árammal, feszültségeséssel vagy vezeték-terhelhetőséggel. A végleges méretezés a tervező felelőssége. A vezeték-terhelhetőség és a feszültségesés tervezői ellenőrzést segítő számítását lásd: `docs/meretezes.md`.

Kód: `lib/phase-load.ts`, `components/phase-load-report.tsx`. Teszt: `tests/phase-load.ts`.
