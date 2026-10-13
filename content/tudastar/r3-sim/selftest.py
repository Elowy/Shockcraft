#!/usr/bin/env python3
"""A szimulátor önellenőrzése: hibás bekötésekkel MEG KELL buknia (a megadott hibakóddal),
a jó netlistáknak át kell menniük. Futtatás: python3 selftest.py"""
import copy
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sim  # noqa: E402

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "r3")


def base(slug):
    with open(os.path.join(D, slug + ".netlist.json"), encoding="utf-8") as fh:
        return json.load(fh)


def wire(d, wid):
    return next(w for w in d["wires"] if w["id"] == wid)


def find_wire(d, frm=None, to=None):
    return next(w for w in d["wires"] if (frm is None or w["from"] == frm) and (to is None or w["to"] == to))


def run(d):
    nl = sim.Netlist(d, "<selftest>")
    return nl.run()


def codes(rep):
    return {e[1:e.index("]")] for e in rep["errors"]}


CASES = []


def case(name, expect):
    def deco(fn):
        CASES.append((name, expect, fn))
        return fn
    return deco


@case("101: a kapcsoló a nullavezetőt bontja (L közvetlenül a lámpára)", {"I4", "I6"})
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    # KD.L → S1.L helyett KD.N → S1.L; S1.1 → KD.LK → E1.N; KD.L → E1.L
    find_wire(d, "KD.L", "S1.L").update({"from": "KD.N", "conductor": "N", "color": "kék"})
    find_wire(d, "KD.LK", "E1.L").update({"to": "E1.N"})
    find_wire(d, "KD.N", "E1.N").update({"from": "KD.L", "to": "E1.L", "conductor": "L", "color": "barna"})
    return d


@case("101: ugyanez, de a vezetékszerepek 'álcázva' (fázisnak címkézve) – az elektromos szimuláció fogja meg", {"I4", "I6"})
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    find_wire(d, "KD.L", "S1.L").update({"from": "KD.N"})  # a vezető továbbra is 'L' barna – a szimuláció veszi észre
    find_wire(d, "KD.LK", "E1.L").update({"to": "E1.N", "conductor": "N", "color": "kék"})
    find_wire(d, "KD.N", "E1.N").update({"from": "KD.L", "to": "E1.L", "conductor": "L", "color": "barna"})
    return d


@case("101: a védővezető a kapcsolón át megy", {"I3"})
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    d["components"][2]["terminals"].append({"id": "PE", "role": "PE"})
    d["components"][2]["states"][1]["connect"].append(["PE", "1"])
    return d


@case("101: a PE megszakad (hiányzik a lámpa PE-vezetéke)", {"I2"})
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    d["wires"] = [w for w in d["wires"] if not (w["to"] == "E1.PE")]
    return d


@case("101: felcserélt polaritás a lámpán (a fázis a menetre jut)", {"I5"})
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    find_wire(d, "KD.LK", "E1.L").update({"to": "E1.N"})
    find_wire(d, "KD.N", "E1.N").update({"to": "E1.L"})
    return d


@case("101: N és PE összekötve a kötődobozban", {"I1"})
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    d["components"][1]["bridges"] = [["N", "PE"]]
    return d


@case("101: zöld-sárga ér kapcsolt fázisként", {"I8"})
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    find_wire(d, "S1.1", "KD.LK").update({"color": "zöld-sárga"})
    return d


@case("101: PE-vezeték a kapcsoló kimenetére kötve", {"I3"})
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    find_wire(d, "S1.1", "KD.LK").update({"conductor": "PE", "color": "zöld-sárga"})
    return d


@case("101: kék ér fázisként, jelölés nélkül", {"I8"})
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    find_wire(d, "S1.1", "KD.LK").update({"color": "kék"})
    return d


@case("101: hiányzó truthTable-sor", {"I10"})
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    d["truthTable"] = d["truthTable"][:1]
    return d


@case("101: hibás truthTable (fordított)", {"I10"})
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    for r in d["truthTable"]:
        r["lamps"]["E1"] = not r["lamps"]["E1"]
    return d


@case("102: a kapcsoló csak a fázist bontja, a nulla átköt", {"I7"})
def _():
    d = base("ketpolusu-kapcsolo-102-bekotese")
    d["components"][1]["states"][0]["connect"] = [["N", "2"]]
    return d


@case("102: L be – N ki keresztbe kötve (fázis a nullapóluson át)", {"I5"})
def _():
    d = base("ketpolusu-kapcsolo-102-bekotese")
    find_wire(d, "T.L", "S1.L").update({"to": "S1.N"})
    find_wire(d, "T.N", "S1.N").update({"to": "S1.L"})
    return d


@case("102: a két kimenet felcserélve (a fázis az N-oldali kapcsára jut)", {"I5"})
def _():
    d = base("ketpolusu-kapcsolo-102-bekotese")
    find_wire(d, "S1.1", "E1.L").update({"from": "S1.2", "conductor": "kapcsolt nulla", "color": "kék"})
    find_wire(d, "S1.2", "E1.N").update({"from": "S1.1", "conductor": "kapcsolt fázis", "color": "barna"})
    # a vezetők valódi útját követjük: a fázis az 1-es kimenetről a lámpa N kapcsára fut
    for w in d["wires"]:
        if w["from"] == "S1.1":
            w["to"] = "E1.N"
        if w["from"] == "S1.2":
            w["to"] = "E1.L"
    return d


@case("105: a 2-es kimenetre nullavezető került → zárlat bekapcsoláskor", {"I1"})
def _():
    d = base("csillarkapcsolo-105-bekotese")
    find_wire(d, "S1.2", "KD.LK2").update({"to": "KD.N", "conductor": "N", "color": "kék"})
    return d


@case("106: a betáp a 1-es kapocsra, nem a közösre került", {"I10"})
def _():
    d = base("valtokapcsolo-106-bekotese")
    find_wire(d, "KD.L", "S1.C").update({"to": "S1.1"})
    find_wire(d, "S1.1", "KD.K1").update({"from": "S1.C"})
    return d


@case("106: nullavezető az egyik váltóvezetéken (régi, tiltott megoldás)", {"I1", "I6"})
def _():
    d = base("valtokapcsolo-106-bekotese")
    # K2-es váltóvezetéket a nullára kötik: S1 1-es állásában a közös (L) a nullára kerül
    d["components"][1]["bridges"] = [["K2", "N"]]
    return d


@case("107: a keresztkapcsoló párjai összekeverve (bemenet A1+B1)", {"I10"})
def _():
    d = base("keresztkapcsolo-107-bekotese")
    find_wire(d, "KD.K2a", "X1.A2").update({"to": "X1.B1"})
    find_wire(d, "X1.B1", "KD.K1b").update({"from": "X1.A2"})
    return d


@case("106+6: a két közös kapocs között hiányzik az áthidaló", {"I10"})
def _():
    d = base("kettos-valtokapcsolo-106-6-bekotese")
    d["wires"] = [w for w in d["wires"] if w["conductor"] != "áthidaló"]
    return d


GOOD_VARIANTS = []


def good(name):
    def deco(fn):
        GOOD_VARIANTS.append((name, fn))
        return fn
    return deco


@good("106: a két váltóvezeték keresztbe kötve – működik, csak az állások értelmezése fordul")
def _():
    d = base("valtokapcsolo-106-bekotese")
    find_wire(d, "KD.K1", "S2.1").update({"to": "S2.2"})
    find_wire(d, "KD.K2", "S2.2").update({"to": "S2.1"})
    for r in d["truthTable"]:
        r["lamps"]["E1"] = r["states"]["S1"] != r["states"]["S2"]
    return d


@good("107: a kimenő pár keresztbe kötve – működik, a paritás fordul")
def _():
    d = base("keresztkapcsolo-107-bekotese")
    find_wire(d, "X1.B1", "KD.K1b").update({"to": "KD.K2b"})
    find_wire(d, "X1.B2", "KD.K2b").update({"to": "KD.K1b"})
    for r in d["truthTable"]:
        r["lamps"]["E1"] = not r["lamps"]["E1"]
    return d


def main():
    fails = 0
    for name, expect, fn in CASES:
        rep = run(fn())
        got = codes(rep)
        ok = (not rep["pass"]) and expect <= got
        fails += not ok
        print(f"{'OK  ' if ok else 'HIBA'} FAIL-t vár: {name} → {'FAIL' if not rep['pass'] else 'PASS'} {sorted(got)}")
        if not ok:
            for e in rep["errors"][:6]:
                print("       ", e)
    for name, fn in GOOD_VARIANTS:
        rep = run(fn())
        ok = rep["pass"]
        fails += not ok
        print(f"{'OK  ' if ok else 'HIBA'} PASS-t vár: {name} → {'PASS' if ok else 'FAIL'}")
        if not ok:
            for e in rep["errors"][:6]:
                print("       ", e)
    for f in sorted(os.listdir(D)):
        if f.endswith(".netlist.json"):
            rep = sim.analyse(os.path.join(D, f))[1]  # a netlista saját kezelőjével (pl. a földelési bővítés alosztálya)
            fails += not rep["pass"]
            print(f"{'OK  ' if rep['pass'] else 'HIBA'} PASS-t vár: {f}")
    print("önellenőrzés:", "SIKERES" if not fails else f"{fails} HIBA")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
