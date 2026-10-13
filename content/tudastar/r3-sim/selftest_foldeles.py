#!/usr/bin/env python3
"""A földelési bővítés ([foldeles-bovites v1]) önellenőrzése: a hibás netlistáknak a megadott hibakódok legalább egyikével
MEG KELL bukniuk, a jó netlistáknak át kell menniük. Futtatás: python3 selftest_foldeles.py"""
import copy
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sim  # noqa: E402

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "r3")
GOOD = ["foldelesi-rendszerek-tn-c", "foldelesi-rendszerek-tn-s", "foldelesi-rendszerek-tn-c-s", "foldelesi-rendszerek-tt",
        "foldelesi-rendszerek-it", "egyenpotencialra-hozas-eph"]


def base(slug):
    with open(os.path.join(D, slug + ".netlist.json"), encoding="utf-8") as fh:
        return json.load(fh)


def comp(d, cid):
    return next(c for c in d["components"] if c["id"] == cid)


def wire(d, wid):
    return next(w for w in d["wires"] if w["id"] == wid)


def run(d):
    return sim.EarthingNetlist(copy.deepcopy(d), "<önteszt>").run()


def codes(rep):
    return {e[1:e.index("]")] for e in rep["errors"]}


CASES = []


def case(name, expect):
    def deco(fn):
        CASES.append((name, expect, fn))
        return fn
    return deco


@case("TN-C-S: a szétválasztás után a fogyasztónál újra összekötik az N-t és a PE-t", {"E1"})
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    comp(d, "M1")["bridges"] = [["N", "PE"]]
    return d


@case("TN-C-S: két szétválasztási pont (a PEN a fogyasztónál is szétválik)", {"E1", "E6", "S7"})
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    d["components"].append({"id": "PSZ2", "type": "pen-szetvalaszto", "at": "M1",
                            "terminals": [{"id": "PEN", "role": "PEN"}, {"id": "N", "role": "N"}, {"id": "PE", "role": "PE"}],
                            "bridges": [["PEN", "N", "PE"]]})
    return d


@case("TN-C-S: a védővezető a kismegszakítón át", {"E2"})
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    f1 = comp(d, "F1")
    f1["terminals"] += [{"id": "3", "role": "PE"}, {"id": "4", "role": "PE"}]
    f1["states"][0]["connect"].append(["3", "4"])
    return d


@case("TN-C-S: a kismegszakító a nullavezetőt bontja", {"E2"})
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    f1 = comp(d, "F1")
    f1["terminals"] += [{"id": "3", "role": "N"}, {"id": "4", "role": "N"}]
    f1["states"][0]["connect"].append(["3", "4"])
    return d


@case("TN-C: áram-védőkapcsoló a PEN-vezetőben", {"E2"})
def _():
    d = base("foldelesi-rendszerek-tn-c")
    d["components"].append({"id": "Q9", "type": "fi-rele", "at": "EL", "poles": [["1", "2"], ["3", "4"]],
                            "terminals": [{"id": "1", "role": "L"}, {"id": "2", "role": "L"}, {"id": "3", "role": "PEN"}, {"id": "4", "role": "PEN"}],
                            "states": [{"name": "be", "connect": [["1", "2"], ["3", "4"]]}]})
    for r in d["truthTable"]:
        r["states"]["Q9"] = "be"
    return d


@case("TN-C: külön védővezető fut az elosztótól (ez már nem TN-C)", {"E1"})
def _():
    d = base("foldelesi-rendszerek-tn-c")
    xp = comp(d, "XPEN")
    xp["terminals"].append({"id": "PE", "role": "PE"})
    xp["bridges"] = [["PEN", "PE"]]
    wire(d, "w7").update({"from": "XPEN.PE", "section": "S2"})  # külön PE az elosztótól a fogyasztóig
    return d


@case("TN-S: a nulla- és a védővezetőt az épületben összekötik", {"E1", "E7", "E5"})
def _():
    d = base("foldelesi-rendszerek-tn-s")
    comp(d, "XN")["terminals"].append({"id": "PE", "role": "PE"})
    comp(d, "XN")["bridges"] = [["N", "PE"]]
    d["wires"].append({"id": "w99", "from": "XN.PE", "to": "XPE.PE", "conductor": "PE", "color": "zöld-sárga"})
    return d


@case("TT: a helyi PE-t a csillagpont földelőjéhez kötik (ez már nem TT)", {"E1"})
def _():
    d = base("foldelesi-rendszerek-tt")
    d["wires"].append({"id": "w99", "from": "XPE.PE", "to": "RB.K", "conductor": "földelővezető", "color": "zöld-sárga", "section": "S1"})
    return d


@case("TT: a fémház védővezetője hiányzik", {"E1", "I10"})
def _():
    d = base("foldelesi-rendszerek-tt")
    d["wires"] = [w for w in d["wires"] if w["id"] != "w8"]
    return d


@case("IT: a csillagpontot közvetlenül földelik", {"E1"})
def _():
    d = base("foldelesi-rendszerek-it")
    d["wires"].append({"id": "w99", "from": "TR.N", "to": "RA.K", "conductor": "földelővezető", "color": "zöld-sárga"})
    return d


@case("IT: hibás elvárás – az első testzárlatra a túláramvédelem lekapcsolna", {"I10"})
def _():
    d = base("foldelesi-rendszerek-it")
    for r in d["truthTable"]:
        if r["states"]["H1"] == "fennáll":
            r["overcurrent"]["Q1"] = True
    return d


@case("TN-C-S: hibás elvárás – PEN-szakadáskor a fémház érintése veszélytelen", {"I10"})
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    for r in d["truthTable"]:
        if r["states"]["SZ"] == "szakadt" and r["states"]["H1"] == "nincs":
            r["touch"]["U1"] = "nincs"
    return d


@case("TN-C-S: hibás elvárás – PEN-szakadáskor a FI-relé kioldana", {"I10"})
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    for r in d["truthTable"]:
        if r["states"]["SZ"] == "szakadt":
            r["trips"]["Q1"] = True
    return d


@case("TT: hibás elvárás – testzárlatkor a kismegszakító fémes hurokban", {"I10"})
def _():
    d = base("foldelesi-rendszerek-tt")
    for r in d["truthTable"]:
        if r["states"]["H1"] == "fennáll" and r["states"]["SZ"] == "ép":
            r["overcurrent"]["F1"] = True
            r["loops"]["H1"] = "femes"
    return d


@case("TN-C-S: kék védővezető", {"E6"})
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    wire(d, "w9")["color"] = "kék"
    return d


@case("TN-C-S: a fázisvezető a PE-sínre fut", {"E6"})
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    wire(d, "w7").update({"to": "M1.PE"})
    return d


@case("TN-C-S: zárlat a fogyasztóban vezetővel (L és N összekötve)", {"E4"})
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    comp(d, "M1")["bridges"] = [["L", "N"]]
    return d


@case("TN-C-S: a hibahely normál állapota aktív", {"E5"})
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    comp(d, "H1")["states"].reverse()
    return d


@case("EPH: a vízvezeték EPH-vezetője hiányzik, bár bekötöttnek jelölt", {"E1", "S6"})
def _():
    d = base("egyenpotencialra-hozas-eph")
    d["wires"] = [w for w in d["wires"] if w["id"] != "w7"]
    d["breaks"] = [b for b in d["breaks"] if b["id"] != "EPH1"]
    for r in d["truthTable"]:
        r["states"].pop("EPH1")
    seen, rows = set(), []
    for r in d["truthTable"]:
        k = tuple(sorted(r["states"].items()))
        if k not in seen:
            seen.add(k)
            rows.append(r)
    d["truthTable"] = rows
    return d


@case("EPH: hibás elvárás – EPH nélkül PEN-szakadáskor a fémház és a vízcsap között nincs feszültség", {"I10"})
def _():
    d = base("egyenpotencialra-hozas-eph")
    for r in d["truthTable"]:
        if r["states"]["EPH1"] == "hiányzik" and r["states"]["SZ"] == "szakadt" and r["states"]["H1"] == "nincs":
            r["touch"]["U1"] = "nincs"
    return d


@case("TN-C-S: a FI-relé védett nullája a FI előtti N-sínre kötve (a FI megkerülve)", {"E7", "E5"})
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    wire(d, "w8").update({"from": "PSZ.N"})
    return d


def main():
    bad = 0
    for slug in GOOD:
        rep = sim.analyse(os.path.join(D, slug + ".netlist.json"))[1]
        ok = rep["pass"]
        bad += not ok
        print(f"{'OK  ' if ok else 'HIBA'} PASS-t vár: {slug}.netlist.json")
    # visszafelé kompatibilitás: a régi (earthing nélküli) netlisták a régi osztállyal futnak
    for fn in sorted(os.listdir(D)):
        if fn.endswith(".netlist.json") and not any(fn.startswith(g) for g in GOOD):
            nl = sim.load(os.path.join(D, fn))
            if isinstance(nl, sim.EarthingNetlist):
                bad += 1
                print(f"HIBA a régi netlista a földelési bővítésbe került: {fn}")
    for name, expect, fn in CASES:
        rep = run(fn())
        got = codes(rep)
        ok = (not rep["pass"]) and bool(got & expect)
        bad += not ok
        print(f"{'OK  ' if ok else 'HIBA'} {name}: várt {sorted(expect)} közül legalább egy, kapott {sorted(got)}")
        if not ok:
            for e in rep["errors"][:6]:
                print("      ", e)
    print("önellenőrzés (földelés):", "SIKERES" if not bad else f"{bad} HIBA")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
