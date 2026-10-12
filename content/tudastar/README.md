# Tudástár – tartalom-forrásvázlatok

Ez a mappa a Villanyszerelő Tudástár cikkeinek **forrásvázlatait** tartalmazza (Markdown + YAML front matter). A közzétett oldalak ezekből készülnek a tartalommotorral (lásd `docs/tudastar-terv.md` 3.3 és 4.4).

- `elmelet/` – Elmélet: 12 R1 és 6 R2 cikk, valamint a szakszótár. Állapot: `ai: vázlat`, független szakmai ellenőrzés után (1. kör, 2026-10-10).
- `lektori-kerdesek-elmelet.md` – a szakmai lektornak szóló nyitott kérdések (szabványkiadások, hazai gyakorlat).
- `r3/` – R3 (biztonságkritikus) vázlatok: világítási kapcsolások 101–107, dugalj, kismegszakító, FI-relé, földelési rendszerek, EPH, feszültségmentesítés öt szabálya; bekötési netlisták (`*.netlist.json`). Állapot: **lektorra vár – nem közzétehető.**
- `r3-sim/` – a netlisták szimulátora és önellenőrzései (python3, függőség nélkül): `python3 -I selftest.py`, `selftest_vedelmek.py`, `selftest_foldeles.py`, `claims_kapcsolasok.py`, `check_articles.py ../r3/*.md`; független biztonsági próbák: `probak_biztonsag.py`, `probak_vedelmek.py`, `probak_foldeles_ellenor.py`.
- `lektori-kerdesek-r3.md` – nyitott kérdések az R3-vázlatokhoz.
- `kerdesek/` – a Tesztek (vizsgaszimuláció) kérdésbankjának forrása, témakörönként egy JSON-tömb (`<tema>.json`, a séma: `docs/tudastar-terv.md` 7. pont, ellenőrzés: `lib/quiz/schema.ts`, `node_modules/.bin/tsx scripts/quiz-release.ts check`). Az 1. kör 204 kérdése (10 témakör, témakörönként 20–22; ebből egy, a q-kap-0020, a független ellenőrzés után visszavonva) AI-tervezet, saját szöveggel, a fenti cikkekre és R3-vázlatokra hivatkozva; mindegyik `review: "lektorra-var"`, ezért egyik sem kerül a kiadásba. Közzétenni csak szakmai lektor jóváhagyása után lehet (a jóváhagyás a kérdés tartalmi ujjlenyomatához kötött); az R3-vázlatra hivatkozó és a biztonsági témakörök kérdései az R3-szabály szerint csak lektor után.
- `lektori-kerdesek-kerdesbank.md` – a kérdésbank vitatható, kiadás- vagy hazai gyakorlattól függő tételei és a lektori döntést igénylő általános kérdések.

Kiadási szabály (`docs/tudastar-dontesek.md`): R1/R2 belső kettős ellenőrzéssel közzétehető; R3 (bekötések, FI-relé, földelés, feszültségmentesítés) csak szakmai lektor jóváhagyása után. Saját szöveg; külső forrás csak témaforrás, szabványszöveget nem idézünk.
