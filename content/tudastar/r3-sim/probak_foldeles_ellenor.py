#!/usr/bin/env python3
"""Független biztonsági ellenőr próbái a földelési bővítéshez ([foldeles-bovites]).

Minden próba egy szándékosan hibás (vagy hibás elvárású) netlista; a szimulátornak MEG KELL buknia rajta. A jó
netlistáknak továbbra is PASS-t kell adniuk. A próbák nem a szerző selftest_foldeles.py-jából származnak.
Futtatás: python3 probak_foldeles_ellenor.py"""
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
    return sim.EarthingNetlist(copy.deepcopy(d), "<próba>").run()


def kotodoboz(cid, at, roles):
    return {"id": cid, "type": "kotodoboz", "label": f"{cid} kötődoboz", "at": at,
            "terminals": [{"id": f"k{i}", "role": r} for i, r in enumerate(roles)]}


CASES = []


def case(name):
    def deco(fn):
        CASES.append((name, fn))
        return fn
    return deco


# --- rövidzár vezetőkkel (nem hibahely-választóval) -----------------------------------------------------
@case("IT: tartós L1–PE összekötés egy kötődobozban (állandó első hiba, rejtve)")
def _():
    d = base("foldelesi-rendszerek-it")
    kd = kotodoboz("KD", "M1", ["L1", "PE"])
    kd["bridges"] = [["k0", "k1"]]
    d["components"].append(kd)
    d["wires"] += [{"id": "x1", "from": "M1.L1", "to": "KD.k0", "conductor": "L1", "color": "barna"},
                   {"id": "x2", "from": "M1.PE", "to": "KD.k1", "conductor": "PE", "color": "zöld-sárga"}]
    return d


@case("TT: tartós L–PE összekötés egy kötődobozban")
def _():
    d = base("foldelesi-rendszerek-tt")
    kd = kotodoboz("KD", "M1", ["L", "PE"])
    kd["bridges"] = [["k0", "k1"]]
    d["components"].append(kd)
    d["wires"] += [{"id": "x1", "from": "M1.L", "to": "KD.k0", "conductor": "L", "color": "barna"},
                   {"id": "x2", "from": "M1.PE", "to": "KD.k1", "conductor": "PE", "color": "zöld-sárga"}]
    return d


@case("TN-C-S: L–N rövidzár egy kapcsolóállásban")
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    d["components"].append({"id": "S1", "type": "kapcsolo-101", "label": "S1", "at": "M1",
                            "terminals": [{"id": "L", "role": "L"}, {"id": "N", "role": "N"}],
                            "states": [{"name": "ki", "connect": []}, {"name": "be", "connect": [["L", "N"]]}]})
    d["wires"] += [{"id": "x1", "from": "M1.L", "to": "S1.L", "conductor": "L", "color": "barna"},
                   {"id": "x2", "from": "M1.N", "to": "S1.N", "conductor": "N", "color": "kék"}]
    for r in d["truthTable"]:
        pass
    d["truthTable"] = [dict(r, states=dict(r["states"], S1=s)) for r in d["truthTable"] for s in ("ki", "be")]
    return d


@case("TN-C-S: L–PE rövidzár egy passzív sorkapocs belső hídján")
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    kd = kotodoboz("KD", "M1", ["L", "PE"])
    kd["bridges"] = [["k0", "k1"]]
    d["components"].append(kd)
    d["wires"] += [{"id": "x1", "from": "M1.L", "to": "KD.k0", "conductor": "L", "color": "barna"},
                   {"id": "x2", "from": "M1.PE", "to": "KD.k1", "conductor": "PE", "color": "zöld-sárga"}]
    return d


# --- fázis helyett nulla kapcsolása -------------------------------------------------------------------
@case("TN-C-S: a kismegszakító a nullát bontja, a fázis közvetlenül megy (szerepek „helyesen” jelölve)")
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    f1 = comp(d, "F1")
    for t in f1["terminals"]:
        t["role"] = "N"
    # Q1.2 → F1.1 (fázis) helyett: Q1.2 → M1.L közvetlenül; Q1.N-ki → F1.1, F1.2 → M1.N
    d["wires"] = [w for w in d["wires"] if w["id"] not in ("w6", "w7", "w8")]
    d["wires"] += [{"id": "x1", "from": "Q1.2", "to": "M1.L", "conductor": "L", "color": "barna", "section": "S2"},
                   {"id": "x2", "from": "Q1.N-ki", "to": "F1.1", "conductor": "N", "color": "kék"},
                   {"id": "x3", "from": "F1.2", "to": "M1.N", "conductor": "N", "color": "kék", "section": "S2"}]
    return d


# --- PE megszakítása ------------------------------------------------------------------------------------
@case("TN-C-S: a fogyasztó PE-vezetője hiányzik (a fémház sehová sem kötött)")
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    d["wires"] = [w for w in d["wires"] if w["id"] != "w9"]
    return d


@case("TN-S: a hálózati PE-vezető hiányzik (a PE-sín csak a fogyasztóhoz kötött)")
def _():
    d = base("foldelesi-rendszerek-tn-s")
    d["wires"] = [w for w in d["wires"] if w["id"] != "w4"]
    return d


@case("TN-C-S: a PE egy kapcsolón át (nem hibahely-választó) – kapcsolt védővezető")
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    d["components"].append({"id": "S1", "type": "kapcsolo-101", "label": "S1", "at": "EL",
                            "terminals": [{"id": "1", "role": "PE"}, {"id": "2", "role": "PE"}],
                            "states": [{"name": "be", "connect": [["1", "2"]]}]})
    w9 = wire(d, "w9")
    w9["from"] = "S1.2"
    d["wires"].append({"id": "x1", "from": "PSZ.PE", "to": "S1.1", "conductor": "PE", "color": "zöld-sárga"})
    d["truthTable"] = [dict(r, states=dict(r["states"], S1="be")) for r in d["truthTable"]]
    return d


@case("TT: a helyi földelő (RA) hiányzik – a PE-sín nincs földelve")
def _():
    d = base("foldelesi-rendszerek-tt")
    d["components"] = [c for c in d["components"] if c["id"] != "RA"]
    d["wires"] = [w for w in d["wires"] if w["id"] != "w4"]
    d.pop("breaks", None)
    d["compare"] = [d["compare"][0]]
    d["truthTable"] = [{k: v for k, v in r.items()} for r in d["truthTable"] if r["states"]["SZ"] == "ép"]
    for r in d["truthTable"]:
        r["states"] = {k: v for k, v in r["states"].items() if k != "SZ"}
    return d


# --- PEN és FI-relé --------------------------------------------------------------------------------------
@case("TN-C-S: a PEN a FI-relén át (PEN-pólus)")
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    q1 = comp(d, "Q1")
    for t in q1["terminals"]:
        if t["id"] in ("N-be", "N-ki"):
            t["role"] = "PEN"
    return d


@case("TN-C-S: a szétválasztás után N és PE újra összekötve egy kötődobozban (passzív híd)")
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    kd = kotodoboz("KD", "M1", ["N", "PE"])
    kd["bridges"] = [["k0", "k1"]]
    d["components"].append(kd)
    d["wires"] += [{"id": "x1", "from": "M1.N", "to": "KD.k0", "conductor": "N", "color": "kék"},
                   {"id": "x2", "from": "M1.PE", "to": "KD.k1", "conductor": "PE", "color": "zöld-sárga"}]
    return d


@case("TN-C-S: az épület földelője az N-sínre kötve (nem a PE-sínre)")
def _():
    d = base("foldelesi-rendszerek-tn-c-s")
    wire(d, "w5")["from"] = "PSZ.N"
    return d


@case("EPH: az EPH-vezető a vízvezetéket a nullasínre köti")
def _():
    d = base("egyenpotencialra-hozas-eph")
    wire(d, "w7")["from"] = "PSZ.N"
    return d


# --- hibás elvárások (a truthTable kézzel írt) --------------------------------------------------------
@case("TT: hibás elvárás – szakadt földelővezető mellett a testzárlatnál a FI-relé magától kiold")
def _():
    d = base("foldelesi-rendszerek-tt")
    for r in d["truthTable"]:
        if r["states"]["H1"] == "fennáll" and r["states"]["SZ"] == "szakadt":
            r["trips"] = {"Q1": True}
    return d


@case("TN-C: hibás elvárás – PEN-szakadáskor a fémház veszélytelen")
def _():
    d = base("foldelesi-rendszerek-tn-c")
    for r in d["truthTable"]:
        if r["states"]["SZ"] == "szakadt":
            r["touch"] = {"U1": "nincs"}
    return d


@case("TN-S: hibás elvárás – testzárlatkor a FI-relé nem old ki")
def _():
    d = base("foldelesi-rendszerek-tn-s")
    for r in d["truthTable"]:
        if r["states"]["H1"] == "fennáll":
            r["trips"] = {"Q1": False}
    return d


@case("IT: hibás elvárás – kettős testzárlatnál a szigetelésfigyelő nem jelez, és nincs érintési veszély")
def _():
    d = base("foldelesi-rendszerek-it")
    for r in d["truthTable"]:
        if r["states"]["H1"] == "fennáll" and r["states"]["H2"] == "fennáll":
            r["touch"] = {"U1": "nincs"}
    return d


@case("TT: hibás elvárás – szakadt földelővezetőnél a fémház „a lekapcsolásig” veszélyes (valójában tartósan; a FI-relé legfeljebb a testen átfolyó áramra old ki)")
def _():
    d = base("foldelesi-rendszerek-tt")
    for r in d["truthTable"]:
        if r["states"]["H1"] == "fennáll" and r["states"]["SZ"] == "szakadt":
            r["touch"] = {"U1": "lekapcsolasig"}
    return d


@case("TN-C: zöld-sárga helyett barna PEN")
def _():
    d = base("foldelesi-rendszerek-tn-c")
    wire(d, "w3")["color"] = "barna"
    return d


def selfconsistent(d):
    """A hibás netlista elvárt tábláját a szimuláció kimenetével tölti ki: a szerkezeti hibát ekkor is el kell kapni."""
    rep = run(d)
    d2 = copy.deepcopy(d)
    if rep.get("rows"):
        d2["truthTable"] = [{"states": r["states"], **{k: r[k] for k in sim.foldeles_ext.OUT_KEYS if k in r}} for r in rep["rows"]]
    return d2


def main():
    ok = True
    for slug in GOOD:
        rep = run(base(slug))
        print(("OK  " if rep["pass"] else "HIBA") + f" PASS-t vár: {slug}")
        ok &= rep["pass"]
    for name, fn in CASES:
        rep = run(fn())
        caught = not rep["pass"]
        first = rep["errors"][0] if rep["errors"] else "—"
        print(("OK  " if caught else "HIBA") + f" elkapva: {name}\n       → {first[:200]}")
        ok &= caught
        if not name.split(": ", 1)[-1].startswith("hibás elvárás"):
            rep2 = run(selfconsistent(fn()))
            c2 = sorted({e[1:e.index("]")] for e in rep2["errors"]})
            print(("OK  " if not rep2["pass"] else "HIBA") + f"   önkonzisztens elvárt táblával is elkapva: {c2}")
            ok &= not rep2["pass"]
    print("ellenőri próbák (földelés): " + ("SIKERES" if ok else "SIKERTELEN"))
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
