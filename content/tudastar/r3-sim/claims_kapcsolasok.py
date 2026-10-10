#!/usr/bin/env python3
"""A kapcsolások témacsoport cikkeiben „a szimuláció szerint” állított viselkedések ellenőrzése.

A cikkek „Gyakori hibák” és „Régi berendezésben” szakaszai hibás bekötések tüneteit írják le. Ez a szkript
a hibát beviszi a jó netlistába, a sim.py gráfmegoldójával (union-find) minden kapcsolóállásban kiszámolja a
lámpák állapotát és a zárlatot, és a cikkben szereplő állítást gépileg ellenőrzi. Futtatás:
  python3 claims_kapcsolasok.py            kilépési kód 1, ha bármelyik állítás nem igaz
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sim  # noqa: E402

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "r3")


def base(slug):
    with open(os.path.join(D, slug + ".netlist.json"), encoding="utf-8") as fh:
        return json.load(fh)


def W(d, wid):
    return next(w for w in d["wires"] if w.get("id") == wid)


def table(d):
    """[(állás, {lámpa: ég}, zárlat, {lámpa: L-kapcsa fázison})] minden kapcsolóállásra."""
    nl = sim.Netlist(d, "<állítás>")
    out = []
    for combo in nl.combos():
        f = nl.solve(combo).find
        L, N, PE = f("T.L"), f("T.N"), f("T.PE")
        lamps, live = {}, {}
        for ld in nl.loads:
            rl, rn = f(ld["id"] + ".L"), f(ld["id"] + ".N")
            lamps[ld["id"]] = (rl == L and rn == N) or (rl == N and rn == L)
            live[ld["id"]] = rl == L or rn == L
        out.append((combo, lamps, len({L, N, PE}) < 3, live))
    return out


def toggles(rows, lamp, sel):
    """Igaz, ha a választó átváltása a lámpa állapotát MINDEN állásban megfordítja."""
    idx = {tuple(sorted(c.items())): l[lamp] for c, l, _, _ in rows}
    for c, l, _, _ in rows:
        names = sorted({r[0][sel] for r in rows})
        other = dict(c)
        other[sel] = names[1] if c[sel] == names[0] else names[0]
        if idx[tuple(sorted(other.items()))] == l[lamp]:
            return False
    return True


def affects(rows, lamp, sel):
    """Igaz, ha van olyan állás, amelyben a választó átváltása megváltoztatja a lámpa állapotát."""
    idx = {tuple(sorted(c.items())): l[lamp] for c, l, _, _ in rows}
    for c, l, _, _ in rows:
        names = sorted({r[0][sel] for r in rows})
        other = dict(c)
        other[sel] = names[1] if c[sel] == names[0] else names[0]
        if idx[tuple(sorted(other.items()))] != l[lamp]:
            return True
    return False


CLAIMS = []


def claim(article, text):
    def deco(fn):
        CLAIMS.append((article, text, fn))
        return fn
    return deco


@claim("egypolusu-kapcsolo-101-bekotese", "kapcsoló a nullavezetőben: a lámpa működik, de kikapcsolva is fázis alatt marad")
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    # a kapcsoló a nullavezetőt bontja: KD.N → S1.L, S1.1 → KD.LK → E1.N; a fázis közvetlenül a lámpára
    W(d, "w4").update({"from": "KD.N"})
    W(d, "w6").update({"to": "E1.N"})
    W(d, "w7").update({"from": "KD.L", "to": "E1.L"})
    rows = table(d)
    works = [l["E1"] for c, l, _, _ in rows] == [False, True]
    return works and all(lv["E1"] for _, _, _, lv in rows) and not any(s for _, _, s, _ in rows)


@claim("egypolusu-kapcsolo-101-bekotese", "felcserélt vezetők a lámpánál: működik, de a fázis a lámpa N kapcsára (menetre) jut")
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    W(d, "w6").update({"to": "E1.N"})
    W(d, "w7").update({"to": "E1.L"})
    rows = table(d)
    rep = sim.Netlist(d, "x").run()
    return [l["E1"] for _, l, _, _ in rows] == [False, True] and any(e.startswith("[I5]") for e in rep["errors"])


@claim("ketpolusu-kapcsolo-102-bekotese", "keresztbe kötött pólusok: a fogyasztó működik, de bekapcsolva a nulla felőli kapcsára kerül a fázis")
def _():
    d = base("ketpolusu-kapcsolo-102-bekotese")
    W(d, "w4").update({"from": "S1.2"})
    W(d, "w5").update({"from": "S1.1"})
    rows = table(d)
    nl = sim.Netlist(d, "x")
    f = nl.solve({"S1": "be"}).find
    return [l["E1"] for _, l, _, _ in rows] == [False, True] and f("E1.N") == f("T.L")


@claim("csillarkapcsolo-105-bekotese", "kapcsolt fázis a nullavezetők összekötőjében: a billentyű bekapcsolásakor L–N zárlat")
def _():
    d = base("csillarkapcsolo-105-bekotese")
    W(d, "w6").update({"to": "KD.N"})
    rows = table(d)
    return all(s == (c["S1.b2"] == "be") for c, _, s, _ in rows)


@claim("valtokapcsolo-106-bekotese", "a betáp a K1 1-es kapcsára kerül: négy állásból csak egyben ég; K1 be-ki kapcsolóként, K2 csak K1 egy állásában hat")
def _():
    d = base("valtokapcsolo-106-bekotese")
    W(d, "w4").update({"to": "S1.1"})
    W(d, "w5").update({"from": "S1.C"})
    rows = table(d)
    on = [c for c, l, _, _ in rows if l["E1"]]
    k2_hat = {c["S1"] for c, l, _, _ in rows for c2, l2, _, _ in rows
              if c["S1"] == c2["S1"] and c["S2"] != c2["S2"] and l["E1"] != l2["E1"]}
    return len(on) == 1 and len(k2_hat) == 1


@claim("valtokapcsolo-106-bekotese", "ugyanez a tünet, ha K2-n a kapcsolt fázis nem a közös kapocsról indul")
def _():
    d = base("valtokapcsolo-106-bekotese")
    W(d, "w9").update({"from": "S2.1"})
    W(d, "w7").update({"to": "S2.C"})
    rows = table(d)
    return sum(l["E1"] for _, l, _, _ in rows) == 1


@claim("valtokapcsolo-106-bekotese", "a két váltóvezeték az egyik kapcsolónál felcserélve: ugyanúgy működik, csak az állások értelmezése fordul")
def _():
    d = base("valtokapcsolo-106-bekotese")
    W(d, "w7").update({"to": "S2.2"})
    W(d, "w8").update({"to": "S2.1"})
    rows = table(d)
    orig = {tuple(sorted(c.items())): l["E1"] for c, l, _, _ in table(base("valtokapcsolo-106-bekotese"))}
    inverted = all(l["E1"] != orig[tuple(sorted(c.items()))] for c, l, _, _ in rows)
    return inverted and toggles(rows, "E1", "S1") and toggles(rows, "E1", "S2")


@claim("valtokapcsolo-106-bekotese", "a lámpa fázisa a kötődobozban a betáp fázisára kerül: folyamatosan ég, egyik kapcsoló sem hat rá")
def _():
    d = base("valtokapcsolo-106-bekotese")
    W(d, "w10").update({"from": "KD.L"})
    return all(l["E1"] for _, l, _, _ in table(d))


@claim("valtokapcsolo-106-bekotese", "régi megoldás: nullavezető az egyik váltóvezetéken → bizonyos kapcsolóállásban zárlat")
def _():
    d = base("valtokapcsolo-106-bekotese")
    next(c for c in d["components"] if c["id"] == "KD")["bridges"] = [["K2", "N"]]
    rows = table(d)
    return any(s for _, _, s, _ in rows) and not all(s for _, _, s, _ in rows)


@claim("kettos-valtokapcsolo-106-6-bekotese", "hiányzó áthidaló: a 2. lámpa egyik állásban sem gyullad ki, az 1. kör működik")
def _():
    d = base("kettos-valtokapcsolo-106-6-bekotese")
    d["wires"] = [w for w in d["wires"] if w["conductor"] != "áthidaló"]
    rows = table(d)
    return not any(l["E2"] for _, l, _, _ in rows) and toggles(rows, "E1", "S1.b1") and toggles(rows, "E1", "S2.b1")


@claim("kettos-valtokapcsolo-106-6-bekotese", "B helyen 1a↔1b csere: az A hely mindkét billentyűje mindkét lámpára hat, a B helyről egyik lámpa sem kapcsolható minden állásban")
def _():
    d = base("kettos-valtokapcsolo-106-6-bekotese")
    W(d, "w10").update({"to": "S2.1b"})
    W(d, "w12").update({"to": "S2.1a"})
    rows = table(d)
    a_both = all(affects(rows, lamp, k) for lamp in ("E1", "E2") for k in ("S1.b1", "S1.b2"))
    b_none = not any(toggles(rows, lamp, k) for lamp in ("E1", "E2") for k in ("S2.b1", "S2.b2"))
    return a_both and b_none and not any(s for _, _, s, _ in rows)


@claim("kettos-valtokapcsolo-106-6-bekotese", "a két kör független: az 1. lámpát csak az 1., a 2. lámpát csak a 2. billentyűk kapcsolják")
def _():
    rows = table(base("kettos-valtokapcsolo-106-6-bekotese"))
    return (all(toggles(rows, "E1", k) for k in ("S1.b1", "S2.b1")) and not any(affects(rows, "E1", k) for k in ("S1.b2", "S2.b2"))
            and all(toggles(rows, "E2", k) for k in ("S1.b2", "S2.b2")) and not any(affects(rows, "E2", k) for k in ("S1.b1", "S2.b1")))


@claim("keresztkapcsolo-107-bekotese", "összekevert kapocspárok („a” pár A1+B1): „egyenes” állásban egyik helyről sem kapcsolható be, „keresztezett” állásban rendben működik")
def _():
    d = base("keresztkapcsolo-107-bekotese")
    W(d, "w8").update({"to": "X1.B1"})
    W(d, "w9").update({"from": "X1.A2"})
    rows = table(d)
    straight_dark = not any(l["E1"] for c, l, _, _ in rows if c["X1"] == "egyenes")
    crossed = [(c, l) for c, l, _, _ in rows if c["X1"] == "keresztezett"]
    crossed_ok = all(l["E1"] == (c["S1"] != c["S2"]) for c, l in crossed)
    return straight_dark and crossed_ok and not any(s for _, _, s, _ in rows)


@claim("keresztkapcsolo-107-bekotese", "egy páron belül felcserélt vezetők: ugyanúgy működik, csak az állások értelmezése fordul")
def _():
    d = base("keresztkapcsolo-107-bekotese")
    W(d, "w11").update({"to": "S2.2"})
    W(d, "w12").update({"to": "S2.1"})
    rows = table(d)
    return all(toggles(rows, "E1", s) for s in ("S1", "X1", "S2"))


def end_107(d, b1, b2, common):
    """A K2 (106) helyére keresztkapcsoló kerül: az 1b és a 2b váltóvezeték a b1, b2 kapocsra, a kapcsolt fázis
    a common kapocsról indul, a negyedik kapocs szabad."""
    k2 = next(c for c in d["components"] if c["id"] == "S2")
    x1 = next(c for c in d["components"] if c["id"] == "X1")
    k2.update({"type": "kapcsolo-107", "terminals": [dict(t) for t in x1["terminals"]], "states": json.loads(json.dumps(x1["states"]))})
    W(d, "w11").update({"to": "S2." + b1})
    W(d, "w12").update({"to": "S2." + b2})
    W(d, "w13").update({"from": "S2." + common})
    return d


@claim("keresztkapcsolo-107-bekotese", "keresztkapcsoló a sor végén, három kapcsát jól választva (közös: A1, váltóvezetékek: B1, B2): váltókapcsolóként működik")
def _():
    rows = table(end_107(base("keresztkapcsolo-107-bekotese"), "B1", "B2", "A1"))
    return all(toggles(rows, "E1", s) for s in ("S1", "X1", "S2")) and not any(s for _, _, s, _ in rows)


@claim("keresztkapcsolo-107-bekotese", "keresztkapcsoló a sor végén, a két váltóvezeték egy átkötés két végén (A1, B1): „egyenes” állásában a lámpa egyik helyről sem kapcsolható be")
def _():
    rows = table(end_107(base("keresztkapcsolo-107-bekotese"), "A1", "B1", "A2"))
    dark = not any(l["E1"] for c, l, _, _ in rows if c["S2"] == "egyenes")
    return dark and any(l["E1"] for _, l, _, _ in rows) and not any(s for _, _, s, _ in rows)


# --- [biztonsagi-ellenor v1] életvédelmi állítások: mi marad feszültség alatt a kikapcsolt lámpa mellett ---------
def live_terms(d):
    """[(állás, {lámpa: ég}, {kapocs: fázison})] minden kapcsolóállásra."""
    nl = sim.Netlist(d, "<állítás>")
    out = []
    for combo in nl.combos():
        f = nl.solve(combo).find
        L, N = f("T.L"), f("T.N")
        lamps = {ld["id"]: (f(ld["id"] + ".L") == L and f(ld["id"] + ".N") == N) for ld in nl.loads}
        out.append((combo, lamps, {k: f(k) == L for k in nl.terms}))
    return out


def one_live(rows, a, b):
    return all(live[a] != live[b] for _, _, live in rows)


@claim("valtokapcsolo-106-bekotese", "a két váltóvezeték közül minden állásban pontosan az egyik fázis alatt van, akkor is, ha a lámpa nem ég")
def _():
    rows = live_terms(base("valtokapcsolo-106-bekotese"))
    return one_live(rows, "KD.K1", "KD.K2") and any(not l["E1"] for _, l, _ in rows)


@claim("kettos-valtokapcsolo-106-6-bekotese", "mindkét körben a váltóvezeték-pár egyik ere minden állásban fázis alatt van, a lámpák állapotától függetlenül")
def _():
    rows = live_terms(base("kettos-valtokapcsolo-106-6-bekotese"))
    return one_live(rows, "KD.K1A", "KD.K2A") and one_live(rows, "KD.K1B", "KD.K2B") and any(not any(l.values()) for _, l, _ in rows)


@claim("keresztkapcsolo-107-bekotese", "1–4 keresztkapcsolónál minden szakasz váltóvezeték-párjának egyik ere minden állásban fázis alatt van, a lámpa állapotától függetlenül")
def _():
    for sfx in ("", "-2x107", "-3x107", "-4x107"):
        d = base("keresztkapcsolo-107-bekotese" + sfx)
        rows = live_terms(d)
        kd = next(c for c in d["components"] if c["id"] == "KD")
        firsts = [t["id"] for t in kd["terminals"] if t["role"] == "valto-1"]
        for t1 in firsts:
            t2 = t1.replace("K1", "K2", 1)
            if not one_live(rows, f"KD.{t1}", f"KD.{t2}"):
                return False
        if not any(not l["E1"] for _, l, _ in rows):
            return False
    return True


@claim("keresztkapcsolo-107-bekotese", "keresztkapcsoló a sor végén váltókapcsolóként (közös: A1): a szabadon maradó A2 kapocs bizonyos állásokban fázis alatt van")
def _():
    d = end_107(base("keresztkapcsolo-107-bekotese"), "B1", "B2", "A1")
    rows = live_terms(d)
    return any(live["S2.A2"] for _, _, live in rows) and not all(live["S2.A2"] for _, _, live in rows)


@claim("egypolusu-kapcsolo-101-bekotese", "106-os kapcsoló egypólusúként bekötve: a szabadon maradó kimenet pontosan akkor van fázis alatt, amikor a lámpa nem ég")
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    s1 = next(c for c in d["components"] if c["id"] == "S1")
    s1.update({"type": "kapcsolo-106", "terminals": [{"id": "C", "role": "kozos"}, {"id": "1", "role": "valto-1"}, {"id": "2", "role": "valto-2"}],
               "states": [{"name": "be", "connect": [["C", "1"]]}, {"name": "ki", "connect": [["C", "2"]]}]})
    W(d, "w4").update({"to": "S1.C"})
    rows = live_terms(d)
    rep = sim.Netlist(json.loads(json.dumps(d)), "x").run()
    works = sorted(l["E1"] for _, l, _ in rows) == [False, True]
    return works and rep["pass"] and all(live["S1.2"] == (not l["E1"]) for _, l, live in rows)


@claim("valtokapcsolo-106-bekotese", "más régi megoldás (fázis és nulla a váltóvezetékeken, a lámpa a két közös kapocs között): zárlat nincs, de az egyik kikapcsolt állásban a lámpa mindkét kapcsa fázis alatt van")
def _():
    d = base("valtokapcsolo-106-bekotese")
    # mindkét kapcsoló 1-es kapcsa a fázisra, 2-es kapcsa a nullára; a lámpa a két közös kapocs közé kerül
    d["wires"] = [w for w in d["wires"] if w["id"] in ("w1", "w2", "w3", "w12")]
    d["wires"] += [{"from": "KD.L", "to": "S1.1"}, {"from": "KD.N", "to": "S1.2"}, {"from": "KD.L", "to": "S2.1"},
                   {"from": "KD.N", "to": "S2.2"}, {"from": "S1.C", "to": "E1.L"}, {"from": "S2.C", "to": "E1.N"}]
    nl = sim.Netlist(d, "<állítás>")
    rows = []
    for combo in nl.combos():
        f = nl.solve(combo).find
        L, N, PE = f("T.L"), f("T.N"), f("T.PE")
        on = {f("E1.L"), f("E1.N")} == {L, N}
        both_live = f("E1.L") == L and f("E1.N") == L
        rows.append((on, both_live, len({L, N, PE}) < 3))
    works = sum(on for on, _, _ in rows) == 2
    return works and not any(s for _, _, s in rows) and any(bl and not on for on, bl, _ in rows)


@claim("vilagitasi-kapcsolasok", "váltó- és keresztkapcsolásban a váltóvezetékek egyike minden állásban fázis alatt van (106, 106+6, 107)")
def _():
    return all(fn() for art, text, fn in CLAIMS if "minden állásban" in text and "fázis alatt" in text and art != "vilagitasi-kapcsolasok")


@claim("vilagitasi-kapcsolasok", "a keresztkapcsolás 1–4 keresztkapcsolóval: minden kapcsoló átváltása minden állásban megfordítja a lámpát")
def _():
    for sfx in ("", "-2x107", "-3x107", "-4x107"):
        rows = table(base("keresztkapcsolo-107-bekotese" + sfx))
        for sel in rows[0][0]:
            if not toggles(rows, "E1", sel):
                return False
    return True


def main():
    bad = 0
    for art, text, fn in CLAIMS:
        try:
            ok = bool(fn())
        except Exception as e:  # noqa: BLE001
            ok = False
            text += f" (kivétel: {e!r})"
        bad += not ok
        print(f"{'OK  ' if ok else 'HIBA'} {art}: {text}")
    print("állítások:", "MIND IGAZ" if not bad else f"{bad} HAMIS")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
