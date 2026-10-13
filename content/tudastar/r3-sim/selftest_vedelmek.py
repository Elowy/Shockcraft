#!/usr/bin/env python3
"""A védelmi bővítés önellenőrzése (FI-relé, kismegszakító, dugalj, hibahelyzetek): a hibás bekötéseknek
a megadott hibakóddal MEG KELL bukniuk, a jó netlistáknak át kell menniük. Futtatás: python3 selftest_vedelmek.py"""
import copy
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sim  # noqa: E402

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "r3")
GOOD = ["dugalj-bekotese", "dugalj-bekotese-leagaztatas", "kismegszakito", "aram-vedokapcsolo-fi-rele",
        "aram-vedokapcsolo-fi-rele-hibahelyzetek"]


def base(slug):
    with open(os.path.join(D, slug + ".netlist.json"), encoding="utf-8") as fh:
        return json.load(fh)


def fw(d, frm, to):
    return next(w for w in d["wires"] if w["from"] == frm and w["to"] == to)


def comp(d, cid):
    return next(c for c in d["components"] if c["id"] == cid)


def codes(rep):
    return {e[1:e.index("]")] for e in rep["errors"]}


CASES = []


def case(name, expect):
    def deco(fn):
        CASES.append((name, expect, fn))
        return fn
    return deco


@case("FI: a védett kör nullája a FI előtti nullára kötve (a FI megkerülve)", {"I11", "I12"})
def _():
    d = base("aram-vedokapcsolo-fi-rele")
    fw(d, "XN.N", "X1.N").update({"from": "T.N"})
    return d


@case("FI: nulla és PE összekötve a dugaljban (a FI után)", {"I1"})
def _():
    d = base("dugalj-bekotese")
    comp(d, "X2")["bridges"] = [["N", "PE"]]
    return d


@case("kismegszakító a nullavezetőben, a fázis közvetlenül a dugaljra", {"I6"})
def _():
    d = base("dugalj-bekotese")
    fw(d, "Q1.2", "F1.1").update({"to": "X1.L", "section": "W1"})
    fw(d, "F1.2", "X1.L").update({"from": "XN.N", "to": "F1.1", "conductor": "N", "role": "N", "color": "kék"})
    fw(d, "XN.N", "X1.N").update({"from": "F1.2"})
    del fw(d, "XN.N", "F1.1")["section"]
    return d


@case("PE-vezető a kismegszakítón át", {"I3"})
def _():
    d = base("dugalj-bekotese")
    comp(d, "F1")["terminals"] += [{"id": "3", "role": "PE"}, {"id": "4", "role": "PE"}]
    comp(d, "F1")["states"][0]["connect"].append(["3", "4"])
    return d


@case("áthurkolás: a továbbmenő PE hiányzik az X2-höz", {"I2"})
def _():
    d = base("dugalj-bekotese")
    d["wires"] = [w for w in d["wires"] if not (w["from"] == "X1.PE" and w["to"] == "X2.PE")]
    return d


@case("dugalj: L és N felcserélve az X1-en", {"I5"})
def _():
    d = base("dugalj-bekotese")
    fw(d, "F1.2", "X1.L").update({"to": "X1.N"})
    fw(d, "XN.N", "X1.N").update({"to": "X1.L"})
    return d


@case("FI: hibás elvárás – a próbagomb nem oldana ki", {"I10"})
def _():
    d = base("aram-vedokapcsolo-fi-rele")
    for r in d["truthTable"]:
        r["trips"]["Q1"] = False
    return d


@case("FI: hibás elvárás – a fázis–nulla érintésre kioldana", {"I10"})
def _():
    d = base("aram-vedokapcsolo-fi-rele-hibahelyzetek")
    for r in d["truthTable"]:
        if r["states"]["P2"] == "fennáll":
            r["trips"]["Q1"] = True
    return d


@case("FI: a próbaáramkör mindkét vége a védett oldalon (nem ad különbözeti áramot)", {"I10"})
def _():
    d = base("aram-vedokapcsolo-fi-rele")
    fw(d, "R1.b", "Q1.N-be").update({"to": "Q1.N-ki"})
    return d


@case("FI: pólusok megadása nélkül", {"S7"})
def _():
    d = base("aram-vedokapcsolo-fi-rele")
    del comp(d, "Q1")["poles"]
    return d


@case("hibahelyzet: a mosógép PE-ere hiányzik (testzárlatnál a FI nem érzékel)", {"I2", "I10"})
def _():
    d = base("aram-vedokapcsolo-fi-rele-hibahelyzetek")
    d["wires"] = [w for w in d["wires"] if not (w["from"] == "X1.PE" and w["to"] == "M1.PE")]
    return d


@case("kismegszakító-netlista: a konyhai dugalj a nappali kismegszakítójáról (hibás elvárt tábla)", {"I10"})
def _():
    d = base("kismegszakito")
    fw(d, "F2.2", "X2.L").update({"from": "F1.2"})
    return d


@case("kismegszakító-netlista: a konyhai dugaljkör nullája a FI-relé előtti nullán (a FI megkerülve)", {"I11", "I12"})
def _():
    d = base("kismegszakito")
    fw(d, "XN.N", "X2.N").update({"from": "T.N", "section": "W2"})
    return d


@case("dugalj: a fázis a védőérintkező kapcsára, a védővezető a fázis kapcsára kerül (X1)", {"I3", "I1"})
def _():
    d = base("dugalj-bekotese")
    fw(d, "F1.2", "X1.L").update({"to": "X1.PE"})
    fw(d, "XPE.PE", "X1.PE").update({"to": "X1.L"})
    return d


@case("dugalj: „nullázott” dugalj – a védőérintkező kapcsa a nullavezetőre kötve, védővezető nélkül", {"I1", "I2", "I3"})
def _():
    d = base("dugalj-bekotese-leagaztatas")
    d["wires"] = [w for w in d["wires"] if not (w["from"] == "K.PE" and w["to"] == "X1.PE")]
    comp(d, "X1")["bridges"] = [["N", "PE"]]
    return d


@case("dugalj: zöld-sárga ér nullavezetőként", {"I8"})
def _():
    d = base("dugalj-bekotese-leagaztatas")
    fw(d, "K.N", "X1.N").update({"color": "zöld-sárga"})
    return d


@case("érintés-kapcsolat színnel (nem valódi ér)", {"S3"})
def _():
    d = base("aram-vedokapcsolo-fi-rele-hibahelyzetek")
    fw(d, "P1.a", "M1.L")["color"] = "barna"
    return d


def main():
    ok = True
    for slug in GOOD:
        rep = sim.Netlist(base(slug), slug).run()
        good = rep["pass"]
        ok &= good
        print(f"{'OK  ' if good else 'HIBA'} PASS-t vár: {slug}.netlist.json")
        if not good:
            for e in rep["errors"]:
                print("      ", e)
    for name, expect, fn in CASES:
        rep = sim.Netlist(copy.deepcopy(fn()), "<selftest>").run()
        got = codes(rep)
        good = (not rep["pass"]) and bool(expect & got)
        ok &= good
        print(f"{'OK  ' if good else 'HIBA'} {name}: várt {sorted(expect)} közül legalább egy, kapott {sorted(got) or 'PASS'}")
    print("önellenőrzés (védelmek):", "SIKERES" if ok else "SIKERTELEN")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
