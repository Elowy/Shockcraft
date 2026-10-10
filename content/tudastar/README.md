# Tudástár – tartalom-forrásvázlatok

Ez a mappa a Villanyszerelő Tudástár cikkeinek **forrásvázlatait** tartalmazza (Markdown + YAML front matter). A közzétett oldalak ezekből készülnek a tartalommotorral (lásd `docs/tudastar-terv.md` 3.3 és 4.4).

- `elmelet/` – Elmélet: 12 R1 és 6 R2 cikk, valamint a szakszótár. Állapot: `ai: vázlat`, független szakmai ellenőrzés után (1. kör, 2026-10-10).
- `lektori-kerdesek-elmelet.md` – a szakmai lektornak szóló nyitott kérdések (szabványkiadások, hazai gyakorlat).
- `r3/` – R3 (biztonságkritikus) vázlatok: világítási kapcsolások 101–107, dugalj, kismegszakító, FI-relé, földelési rendszerek, EPH, feszültségmentesítés öt szabálya; bekötési netlisták (`*.netlist.json`). Állapot: **lektorra vár – nem közzétehető.**
- `r3-sim/` – a netlisták szimulátora és önellenőrzései (python3, függőség nélkül): `python3 -I selftest.py`, `selftest_vedelmek.py`, `selftest_foldeles.py`, `claims_kapcsolasok.py`, `check_articles.py ../r3/*.md`; független biztonsági próbák: `probak_biztonsag.py`, `probak_vedelmek.py`, `probak_foldeles_ellenor.py`.
- `lektori-kerdesek-r3.md` – nyitott kérdések az R3-vázlatokhoz.

Kiadási szabály (`docs/tudastar-dontesek.md`): R1/R2 belső kettős ellenőrzéssel közzétehető; R3 (bekötések, FI-relé, földelés, feszültségmentesítés) csak szakmai lektor jóváhagyása után. Saját szöveg; külső forrás csak témaforrás, szabványszöveget nem idézünk.
