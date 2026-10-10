#!/usr/bin/env python3
"""Független biztonsági ellenőrzés a VÉDELMEK csoport netlistáihoz (dugalj, kismegszakító, FI-relé).

Három rész:
  1. PRÓBANETLISTÁK – szándékosan hibás bekötések (fázis helyett nulla bontása, PE megszakítása, zárlat egyetlen
     állásban, nullázott dugalj, FI-megkerülés, dugalj FI vagy kismegszakító nélkül, hibás készülékmodellek).
     Mindegyik próbát KÉTSZER futtatjuk:
       a) az eredeti igazságtáblával – a szimulátornak FAIL-t kell adnia;
       b) „csaló szerző” módban: az igazságtáblát a szimulált kimenetre írjuk át, így az I10 (eltérés a
          táblától) nem mentheti meg – a hibát egy igazságtáblától FÜGGETLEN invariánsnak kell elkapnia.
     A próbák a probak-vedelmek/ mappába is kiíródnak, hogy a lektor megnézhesse őket.
  2. FÜGGETLEN FIZIKAI ORÁKULUM + MUTÁCIÓS TESZT – csomóponti potenciálok módszerével (numpy, a sim.py
     kódja nélkül) kiszámolja minden állásban a dugaljak feszültségét, a FI-relé pólusain átfolyó áramok
     összegét (különbözeti áram), a hibahelyek/érintések áramát; gráffal a zárlatot, a PE-folytonosságot,
     a nullavezető útját és a kismegszakító/FI helyét. Minden jó netlistából sok hibás változatot készít
     (vezetékvég áthelyezése, vezeték törlése, két vezetékvég cseréje, készüléken belüli áthidalás). Ha az
     orákulum szerint a változat veszélyes vagy másképp működik, mint a táblája, a sim.py nem adhat PASS-t.
  3. A jó netlisták az orákulum szerint is hibátlanok, és az orákulum kimenete egyezik a truthTable-lel.
Futtatás: python3 probak_vedelmek.py [--gyors]   kilépési kód 1, ha bármelyik ellenőrzés hibás
"""
import copy
import itertools
import json
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import sim  # noqa: E402

D = os.path.join(HERE, "..", "r3")
PROBE_DIR = os.path.join(HERE, "probak-vedelmek")
GOOD = ["dugalj-bekotese", "dugalj-bekotese-leagaztatas", "kismegszakito", "aram-vedokapcsolo-fi-rele",
        "aram-vedokapcsolo-fi-rele-hibahelyzetek"]


def base(slug):
    with open(os.path.join(D, slug + ".netlist.json"), encoding="utf-8") as fh:
        return json.load(fh)


def fw(d, frm, to):
    return next(w for w in d["wires"] if w["from"] == frm and w["to"] == to)


def C(d, cid):
    return next(c for c in d["components"] if c["id"] == cid)


def codes(rep):
    return {e[1:e.index("]")] for e in rep["errors"]}


def sim_run(d):
    return sim.Netlist(copy.deepcopy(d), "<próba>").run()


def cheat(d):
    """A truthTable átírása a szimulált kimenetre (a „csaló szerző” modellje)."""
    rep = sim_run(d)
    if not rep.get("rows"):
        return None
    d2 = copy.deepcopy(d)
    d2["truthTable"] = []
    for r in rep["rows"]:
        row = {"states": r["states"], "lamps": r["lamps"]}
        for k in ("outlets", "currents", "trips"):
            if k in r:
                row[k] = r[k]
        d2["truthTable"].append(row)
    return d2


# =====================================================================================================
# 1. Próbanetlisták
# =====================================================================================================
PROBES = []


def probe(name, expect, note):
    def deco(fn):
        PROBES.append((name, expect, note, fn))
        return fn
    return deco


@probe("v01-mcb-a-nullaban", {"I4", "I6", "I7"},
       "Fázis helyett nulla bontása: a kismegszakító a nullavezetőben, a dugalj fázisa közvetlenül a FI-relé után")
def _():
    d = base("dugalj-bekotese")
    fw(d, "Q1.2", "F1.1").update({"to": "X1.L", "section": "W1"})
    fw(d, "F1.2", "X1.L").update({"from": "XN.N", "to": "F1.1", "conductor": "N", "role": "N", "color": "kék"})
    del fw(d, "XN.N", "F1.1")["section"]
    fw(d, "XN.N", "X1.N").update({"from": "F1.2"})
    return d


@probe("v02-fi-ki-allasban-a-nulla-zarva", {"S9"},
       "Hibás FI-modell: „ki” állásban a nullapólus zárva marad (a kétpólusú FI-relé mindkét pólust bontja)")
def _():
    d = base("dugalj-bekotese")
    C(d, "Q1")["states"][1]["connect"] = [["N-be", "N-ki"]]
    return d


@probe("v03-pe-szakad-elosztonal", {"I2"},
       "PE megszakítása: az elosztóból az X1 dugaljhoz nem megy védővezető (áthurkolásnál X2 sem kap)")
def _():
    d = base("dugalj-bekotese")
    d["wires"] = [w for w in d["wires"] if not (w["from"] == "XPE.PE" and w["to"] == "X1.PE")]
    return d


@probe("v04-pe-szakad-kotodobozban", {"I2"},
       "PE megszakítása a kötődobozban: az X2 védőere nincs a PE-kötésben")
def _():
    d = base("dugalj-bekotese-leagaztatas")
    d["wires"] = [w for w in d["wires"] if not (w["from"] == "K.PE" and w["to"] == "X2.PE")]
    return d


@probe("v05-pe-a-fi-relen-at", {"I3"},
       "PE kapcsolása: a védővezető a FI-relé egy harmadik pólusán halad át")
def _():
    d = base("dugalj-bekotese")
    q = C(d, "Q1")
    q["terminals"] += [{"id": "PE-be", "role": "PE"}, {"id": "PE-ki", "role": "PE"}]
    q["poles"].append(["PE-be", "PE-ki"])
    q["states"][0]["connect"].append(["PE-be", "PE-ki"])
    fw(d, "T.PE", "XPE.PE").update({"to": "Q1.PE-be"})
    d["wires"].append({"id": "w99", "from": "Q1.PE-ki", "to": "XPE.PE", "conductor": "PE", "role": "PE", "color": "zöld-sárga"})
    return d


@probe("v06-lN-zarlat-egy-allasban", {"I1"},
       "Zárlat egyetlen állásban: az F2 kimenő fázisa a nullasínre került – L–N zárlat, ha Q1 és F2 be van kapcsolva")
def _():
    d = base("kismegszakito")
    fw(d, "F2.2", "X2.L").update({"to": "XN.N"})
    del fw(d, "F2.2", "XN.N")["section"]
    return d


@probe("v07-lPE-zarlat-egy-allasban", {"I1", "I3"},
       "Zárlat egyetlen állásban: a dugalj fázisere a védőérintkező kapcsára került (a PE-ér is ott van) – L–PE zárlat F1 bekapcsolásakor")
def _():
    d = base("dugalj-bekotese")
    fw(d, "F1.2", "X1.L").update({"to": "X1.PE"})
    return d


@probe("v08-nullazott-dugalj-pe-vel", {"I1", "I12"},
       "„Nullázott” dugalj a FI-relé után: a dugaljban a nulla- és a védővezető kapcsa áthidalva (PEN-szétválasztás utáni összekötés)")
def _():
    d = base("kismegszakito")
    C(d, "X2")["bridges"] = [["N", "PE"]]
    return d


@probe("v09-idegen-nullasin-masik-fi", {"I11", "I12"},
       "Idegen nullasín: a konyhai kör a Q2 FI-relé után kap fázist, de a nullája a Q1 nullasínjén van")
def _():
    d = base("kismegszakito")
    q2 = copy.deepcopy(C(d, "Q1"))
    q2["id"], q2["label"] = "Q2", "Q2 áram-védőkapcsoló (FI-relé)"
    xn2 = copy.deepcopy(C(d, "XN"))
    xn2["id"], xn2["label"] = "XN2", "Nullasín (N) a Q2 után"
    d["components"] += [q2, xn2]
    fw(d, "F1.1", "F2.1").update({"from": "Q2.2"})
    d["wires"] += [
        {"id": "w20", "from": "T.L", "to": "Q2.1", "conductor": "L", "role": "L", "color": "barna"},
        {"id": "w21", "from": "T.N", "to": "Q2.N-be", "conductor": "N", "role": "N", "color": "kék"},
        {"id": "w22", "from": "Q2.N-ki", "to": "XN2.N", "conductor": "N", "role": "N", "color": "kék"},
    ]
    for r in d["truthTable"]:
        r["states"]["Q2"] = "be"
    extra = []
    for r in d["truthTable"]:
        r2 = copy.deepcopy(r)
        r2["states"]["Q2"] = "ki"
        r2["outlets"]["X2"] = False
        r2["trips"]["Q2"] = False
        r["trips"]["Q2"] = False
        extra.append(r2)
    d["truthTable"] += extra
    return d


@probe("v10-fi-megkerulve-fazisoldalon", {"I11", "I12", "I16"},
       "FI-megkerülés a fázisoldalon: a kismegszakító közvetlenül a betáp fázisáról kap feszültséget, a nulla a FI után")
def _():
    d = base("dugalj-bekotese")
    fw(d, "Q1.2", "F1.1").update({"from": "T.L"})
    return d


@probe("v11-probagomb-nem-old-ki", {"I17"},
       "Hibás próbagomb-modell: a próbaáramkör a védett fázist a védett nullára köti (nincs különbözeti áram); a tábla is ezt mondja")
def _():
    d = base("aram-vedokapcsolo-fi-rele")
    fw(d, "R1.b", "Q1.N-be").update({"to": "Q1.N-ki"})
    for r in d["truthTable"]:
        r["trips"]["Q1"] = False
    return d


@probe("v12-dugalj-vedoerintkezo-nelkul", {"I2"},
       "Dugalj védőérintkező-kapocs nélkül (a PE-ér a dobozban végződik)")
def _():
    d = base("dugalj-bekotese-leagaztatas")
    x2 = C(d, "X2")
    x2["terminals"] = [t for t in x2["terminals"] if t["id"] != "PE"]
    d["wires"] = [w for w in d["wires"] if w["to"] != "X2.PE"]
    return d


@probe("v13-dugaljkor-fi-nelkul", {"I16"},
       "Dugaljkör FI-relé nélkül: a kismegszakító a betáp fázisáról, a dugalj nullája a betáp nullájáról kap (a FI-relé üresen áll)")
def _():
    d = base("dugalj-bekotese")
    fw(d, "Q1.2", "F1.1").update({"from": "T.L"})
    fw(d, "XN.N", "X1.N").update({"from": "T.N"})
    return d


@probe("v14-dugalj-kismegszakito-nelkul", {"I15"},
       "Dugalj túláramvédelem nélkül: a dugalj fázisa közvetlenül a FI-relé védett kapcsáról (a kismegszakító kimenete üres)")
def _():
    d = base("dugalj-bekotese")
    fw(d, "F1.2", "X1.L").update({"from": "Q1.2"})
    return d


@probe("v15-mcb-ki-allasban-is-zar", {"S9"},
       "Hibás kismegszakító-modell: „ki” állásban is zár (sosem bont)")
def _():
    d = base("dugalj-bekotese")
    C(d, "F1")["states"][1]["connect"] = [["1", "2"]]
    return d


@probe("v16-pe-sin-a-nullasinre", {"I1", "I12"},
       "A PE-sín a FI-relé utáni nullasínre kötve (nullázás az elosztóban)")
def _():
    d = base("dugalj-bekotese")
    d["wires"].append({"id": "w99", "from": "XN.N", "to": "XPE.PE", "conductor": "PE", "role": "PE", "color": "zöld-sárga"})
    return d


@probe("v17-fazis-a-fi-mellett-is", {"I12", "I1"},
       "FI-megkerülés: a dugalj fázisa a FI-relé mellett a betáp fázisáról is kap (párhuzamos ér)")
def _():
    d = base("dugalj-bekotese")
    d["wires"].append({"id": "w99", "from": "T.L", "to": "X2.L", "conductor": "L", "role": "L", "color": "barna", "section": "W2"})
    return d


@probe("v18-l-n-felcserelve-dugaljnal", {"I5"},
       "Fázis és nulla felcserélve az X2 dugaljnál (az X2 N-kapcsa fázison)")
def _():
    d = base("dugalj-bekotese-leagaztatas")
    fw(d, "K.L", "X2.L").update({"to": "X2.N"})
    fw(d, "K.N", "X2.N").update({"to": "X2.L"})
    return d


@probe("v19-fi-polus-keresztbe", {"S9", "I5", "I6"},
       "Hibás FI-modell: a fázis táp oldali kapcsa a nulla védett kapcsával alkot pólust")
def _():
    d = base("dugalj-bekotese")
    C(d, "Q1")["poles"] = [["1", "N-ki"], ["N-be", "2"]]
    C(d, "Q1")["states"][0]["connect"] = [["1", "N-ki"], ["N-be", "2"]]
    return d


@probe("v20-hibaut-pe-nelkul", {"I2"},
       "Testzárlatos mosógép védővezető nélkül (a dugalj és a gép közt nincs PE)")
def _():
    d = base("aram-vedokapcsolo-fi-rele-hibahelyzetek")
    d["wires"] = [w for w in d["wires"] if not (w["from"] == "X1.PE" and w["to"] == "M1.PE")]
    return d


def run_probes(write=True):
    ok = True
    if write:
        os.makedirs(PROBE_DIR, exist_ok=True)
    print("1. Próbanetlisták (a: eredeti tábla, b: a szimulált kimenetre átírt tábla – az I10 nem számít)")
    for name, expect, note, fn in PROBES:
        d = fn()
        d["id"], d["title"] = name, "PRÓBA (szándékosan hibás): " + note
        if write:
            with open(os.path.join(PROBE_DIR, name + ".netlist.json"), "w", encoding="utf-8") as fh:
                json.dump(d, fh, ensure_ascii=False, indent=1)
        ra = sim_run(d)
        ga = codes(ra)
        good_a = (not ra["pass"]) and bool(expect & ga)
        d2 = cheat(d)
        if d2 is None:
            gb, good_b = ga, good_a
        else:
            rb = sim_run(d2)
            gb = codes(rb) - {"I10"}
            good_b = (not rb["pass"]) and bool(expect & gb)
        ok &= good_a and good_b
        print(f"  {'OK  ' if good_a and good_b else 'HIBA'} {name}: várt {sorted(expect)} közül legalább egy; "
              f"a) {sorted(ga) or 'PASS'}  b) {sorted(gb) or 'PASS'}")
        print(f"       {note}")
    return ok


# =====================================================================================================
# 2. Független fizikai orákulum (NEM használja a sim.py kódját, szerep-/színtábláját vagy union-findját)
# =====================================================================================================
G_LOAD = 1 / 50.0  # fogyasztó / csatlakoztatott dugalj-terhelés: 50 Ω
G_IMP = {"hibaut": 1 / 5.0, "ember": 1 / 1000.0, "ellenallas": 1 / 10000.0}
G_EARTH = 1 / 10.0  # talaj → betáp csillagpont
U = 230.0
TRIP_A = 0.015      # IΔn/2 a 30 mA-es FI-nél: ennél nagyobb különbözeti áram → kiold (a sim. logikai modellje szerint)


def o_selectors(d):
    out = []
    for c in d["components"]:
        if c.get("states") is not None:
            out.append((c["id"], c))
    return out


def o_state(c, name):
    return next(s for s in c["states"] if s["name"] == name)


def o_graph(nodes, edges):
    par = {n: n for n in nodes}

    def f(x):
        while par[x] != x:
            par[x] = par[par[x]]
            x = par[x]
        return x
    for a, b in edges:
        if a in par and b in par:
            ra, rb = f(a), f(b)
            if ra != rb:
                par[rb] = ra
    return f


def oracle(d):
    """Visszaad: (veszélyek halmaza, kimenetek állásonként {kulcs: {...}})"""
    hz = set()
    comps = {c["id"]: c for c in d["components"]}
    nodes = [f"{c['id']}.{t['id']}" for c in d["components"] for t in c.get("terminals", [])]
    role = {f"{c['id']}.{t['id']}": t.get("role") for c in d["components"] for t in c.get("terminals", [])}
    typ = lambda n: comps[n.split(".")[0]]["type"]  # noqa: E731
    wires = [(w["from"], w["to"]) for w in d["wires"] if w.get("from") in role and w.get("to") in role]
    bridges = []
    for c in d["components"]:
        for g in c.get("bridges", []) or []:
            bridges += [(f"{c['id']}.{g[0]}", f"{c['id']}.{x}") for x in g[1:]]
    sels = o_selectors(d)
    taps = [c for c in d["components"] if c["type"] == "tap"]
    tapL = [f"{t['id']}.{x['id']}" for t in taps for x in t["terminals"] if x["role"] == "L"]
    tapN = [f"{t['id']}.{x['id']}" for t in taps for x in t["terminals"] if x["role"] == "N"]
    tapPE = [f"{t['id']}.{x['id']}" for t in taps for x in t["terminals"] if x["role"] == "PE"]
    earth = [f"{c['id']}.{x['id']}" for c in d["components"] if c["type"] == "fold" for x in c["terminals"]]
    outlets = [c for c in d["components"] if c["type"] == "dugalj"]
    loads = [c for c in d["components"] if c["type"] in ("lampa", "fogyaszto")]
    rcds = [c for c in d["components"] if c["type"] == "fi-rele"]
    mcbs = [c for c in d["components"] if c["type"] == "kismegszakito"]
    imps = [c for c in d["components"] if c["type"] in G_IMP]
    idx = {n: i for i, n in enumerate(nodes)}
    # a modell: minden dugaljnak kell L, N és PE kapocs
    for o in outlets:
        rs = sorted(t["role"] for t in o["terminals"])
        if rs != ["L", "N", "PE"]:
            hz.add("H2-dugalj-pe-kapocs-nelkul")
    for ld in loads:
        if ld.get("class") != "II" and "PE" not in [t["role"] for t in ld["terminals"]]:
            hz.add("H2-fogyaszto-pe-nelkul")

    def closed_pairs(combo, skip=()):
        e = []
        for cid, c in sels:
            if cid in skip:
                continue
            for a, b in o_state(c, combo[cid]).get("connect", []):
                e.append((f"{cid}.{a}", f"{cid}.{b}"))
        return e

    # FI-modell fizikai ellenőrzése: minden állás vagy minden pólust zár, vagy egyiket sem; a pólusok kapcsa azonos szerepű
    for q in rcds:
        poles = [frozenset(p) for p in q.get("poles", [])]
        if not poles or not any(all(role[f"{q['id']}.{x}"] == "N" for x in p) for p in poles):
            hz.add("H12-fi-modell")
        for p in poles:
            if len({role[f"{q['id']}.{x}"] for x in p}) != 1 or any(role[f"{q['id']}.{x}"] == "PE" for x in p):
                hz.add("H12-fi-modell")
        for s in q["states"]:
            cs = {frozenset(p) for p in s.get("connect", [])}
            if cs and cs != set(poles):
                hz.add("H12-fi-modell")
        if not any({frozenset(p) for p in s.get("connect", [])} == set(poles) for s in q["states"]):
            hz.add("H12-fi-modell")
    for m in mcbs:
        ts = [t["id"] for t in m["terminals"]]
        if len(ts) != 2 or any(t["role"] != "L" for t in m["terminals"]):
            hz.add("H12-mcb-modell")
        if any(s.get("connect") and {frozenset(p) for p in s["connect"]} != {frozenset(ts)} for s in m["states"]) \
                or not any(not s.get("connect") for s in m["states"]) and len(m["states"]) > 1:
            hz.add("H12-mcb-modell")
        if len(m["states"]) > 1 and all(s.get("connect") for s in m["states"]):
            hz.add("H12-mcb-modell")
    # PE-kapcsolás
    for cid, c in sels:
        for s in c["states"]:
            for p in s.get("connect", []):
                if any(role[f"{cid}.{x}"] == "PE" for x in p):
                    hz.add("H3-pe-kapcsolt")

    sel_ids = [cid for cid, _ in sels]
    results = {}
    for prod in itertools.product(*[[s["name"] for s in c["states"]] for _, c in sels]):
        combo = dict(zip(sel_ids, prod))
        f = o_graph(nodes, wires + bridges + closed_pairs(combo))
        gL, gN, gPE, gE = {f(x) for x in tapL}, {f(x) for x in tapN}, {f(x) for x in tapPE}, {f(x) for x in earth}
        if gL & gN or gL & gPE or gN & gPE or gE & (gL | gN):
            hz.add("H1-zarlat")
        # PE-folytonosság: minden PE szerepű kapocs a betáp PE-jén
        for n in nodes:
            if role[n] == "PE" and f(n) not in gPE:
                hz.add("H2-pe-szakadas")
            if role[n] != "PE" and f(n) in gPE and typ(n) not in ("hibaut", "ember"):
                hz.add("H3-nem-pe-a-pe-n")
        # egypólusú védelem / nyomógomb nem lehet a nullán
        for c in d["components"]:
            if c["type"] in ("kismegszakito", "nyomogomb"):
                if any(f(f"{c['id']}.{t['id']}") in gN for t in c["terminals"]):
                    hz.add("H5-nulla-egypolusu-keszuleken")
        # --- módosított csomóponti analízis: a nulla impedanciájú élek (vezeték, sín, zárt érintkező) szupercsomóponttá
        # vonva, KIVÉVE a zárt FI-pólusokat, amelyek 0 V-os „ampermérők” (így a pólusáram pontos); a betáp L = 230 V,
        # N = PE = 0 V (a PEN a betáp előtt szétválasztva, a csillagpont a 0 V-os referencia)
        rcd_pole_edges = []
        for q in rcds:
            st = o_state(q, combo[q["id"]])
            cs = {frozenset(p) for p in st.get("connect", [])}
            for a, b in q.get("poles", []):
                if frozenset((a, b)) in cs:
                    rcd_pole_edges.append((q["id"], f"{q['id']}.{a}", f"{q['id']}.{b}"))
        pole_set = {frozenset((a, b)) for _, a, b in rcd_pole_edges}
        other_edges = [e for e in wires + bridges + closed_pairs(combo) if frozenset(e) not in pole_set]
        fs = o_graph(nodes, other_edges)
        if gL & gN or gL & gPE or gN & gPE:
            results[tuple(prod)] = {"states": combo, "lamps": {}, "outlets": {}, "currents": {}, "trips": {}, "short": True}
            continue
        bypassed = set()
        for qid, a, b in rcd_pole_edges:
            if fs(a) == fs(b):
                bypassed.add(qid)  # a pólus két kapcsa más úton is összeköttetésben – a FI megkerülve
        if bypassed:
            hz.add("H12-fi-megkerulve")
        sn = sorted({fs(x) for x in nodes})
        sidx = {r: i for i, r in enumerate(sn)}
        fixedv = {}
        for x in tapL:
            fixedv[sidx[fs(x)]] = U
        for x in tapN + tapPE:
            fixedv[sidx[fs(x)]] = 0.0
        amm = [(qid, sidx[fs(a)], sidx[fs(b)]) for qid, a, b in rcd_pole_edges if qid not in bypassed]
        nn, na = len(sn), len(amm)
        Gm = np.zeros((nn, nn))

        def addg(a, b, g):
            i, j = sidx[fs(a)], sidx[fs(b)]
            if i == j:
                return
            Gm[i, i] += g
            Gm[j, j] += g
            Gm[i, j] -= g
            Gm[j, i] -= g

        def addg0(a, g):  # a 0 V-os referenciához (csillagpont)
            i = sidx[fs(a)]
            Gm[i, i] += g
        for o in outlets:  # minden feszültség alatti dugaljra csatlakoztatott fogyasztót feltételezünk
            tl = [f"{o['id']}.{t['id']}" for t in o["terminals"] if t["role"] == "L"]
            tn = [f"{o['id']}.{t['id']}" for t in o["terminals"] if t["role"] == "N"]
            if tl and tn:
                addg(tl[0], tn[0], G_LOAD)
        for ld in loads:
            tl = next(f"{ld['id']}.{t['id']}" for t in ld["terminals"] if t["role"] == "L")
            tn = next(f"{ld['id']}.{t['id']}" for t in ld["terminals"] if t["role"] == "N")
            addg(tl, tn, G_LOAD)
        imp_edges = {}
        for c in imps:
            st = o_state(c, combo[c["id"]]) if c.get("states") is not None else {"active": True}
            if st.get("active", True):
                a, b = (f"{c['id']}.{t['id']}" for t in c["terminals"][:2])
                addg(a, b, G_IMP[c["type"]])
                imp_edges[c["id"]] = (a, b, G_IMP[c["type"]])
        for e in earth:
            addg0(e, G_EARTH)
        for i in range(nn):
            Gm[i, i] += 1e-9  # lebegő részek miatt (1 GΩ a referenciához)
        free = [i for i in range(nn) if i not in fixedv]
        fpos = {i: k for k, i in enumerate(free)}
        M = np.zeros((len(free) + na, len(free) + na))
        rhs = np.zeros(len(free) + na)
        for i in free:
            for j in range(nn):
                if Gm[i, j] == 0:
                    continue
                if j in fixedv:
                    rhs[fpos[i]] -= Gm[i, j] * fixedv[j]
                else:
                    M[fpos[i], fpos[j]] += Gm[i, j]
        for k, (_, ia, ib) in enumerate(amm):
            col = len(free) + k
            if ia in fpos:
                M[fpos[ia], col] += 1.0  # I_k elhagyja az a csomópontot
            if ib in fpos:
                M[fpos[ib], col] -= 1.0
            row = len(free) + k
            for node, sgn in ((ia, 1.0), (ib, -1.0)):
                if node in fpos:
                    M[row, fpos[node]] += sgn
                else:
                    rhs[row] -= sgn * fixedv[node]
        sol = np.linalg.solve(M, rhs) if len(rhs) else np.zeros(0)
        v = np.zeros(nn)
        for i, val in fixedv.items():
            v[i] = val
        for i in free:
            v[i] = sol[fpos[i]]
        I_amm = sol[len(free):]
        V = lambda x: v[sidx[fs(x)]]  # noqa: E731
        out_live = {}
        for o in outlets:
            tl = [f"{o['id']}.{t['id']}" for t in o["terminals"] if t["role"] == "L"]
            tn = [f"{o['id']}.{t['id']}" for t in o["terminals"] if t["role"] == "N"]
            live = bool(tl and tn and abs(V(tl[0]) - V(tn[0])) > 0.5 * U)
            out_live[o["id"]] = live
            # feszültségmentesnek látszó dugalj valamelyik kapcsán veszélyes feszültség
            if not live and any(abs(V(f"{o['id']}.{t['id']}")) > 50 for t in o["terminals"]):
                hz.add("H4-fazis-a-feszultsegmentes-dugaljon")
            pe = [f"{o['id']}.{t['id']}" for t in o["terminals"] if t["role"] == "PE"]
            if pe and abs(V(pe[0])) > 50:
                hz.add("H3-pe-feszultseg-alatt")
            if tn and abs(V(tn[0])) > 50 and live:
                hz.add("H6-polaritas")
        lamp_on = {}
        for ld in loads:
            tl = next(f"{ld['id']}.{t['id']}" for t in ld["terminals"] if t["role"] == "L")
            tn = next(f"{ld['id']}.{t['id']}" for t in ld["terminals"] if t["role"] == "N")
            on = abs(V(tl) - V(tn)) > 0.5 * U
            lamp_on[ld["id"]] = on
            if not on and (abs(V(tl)) > 50 or abs(V(tn)) > 50):
                hz.add("H4-fazis-a-kikapcsolt-fogyaszton")
            if on and abs(V(tn)) > 50:
                hz.add("H6-polaritas")
        currents = {}
        for c in imps:
            if c["type"] in ("hibaut", "ember"):
                if c["id"] in imp_edges:
                    a, b, g = imp_edges[c["id"]]
                    currents[c["id"]] = bool(abs(V(a) - V(b)) * g > 0.005)
                else:
                    currents[c["id"]] = False
        # különbözeti áram: a pólusokon a táp → védett irányban átfolyó áramok összege
        trips = {}
        for q in rcds:
            st = o_state(q, combo[q["id"]])
            cs = {frozenset(p) for p in st.get("connect", [])}
            poles = [tuple(p) for p in q.get("poles", [])]
            if not poles or not all(frozenset(p) in cs for p in poles):
                trips[q["id"]] = False
                continue
            if q["id"] in bypassed:
                trips[q["id"]] = True  # megkerült FI: a különbözeti áram nem határozható meg – veszélyként jelölve
                continue
            s_amm = sum(I_amm[k] for k, (qid, _, _) in enumerate(amm) if qid == q["id"])
            trips[q["id"]] = bool(abs(s_amm) > TRIP_A)
        key = tuple(prod)
        results[key] = {"states": combo, "lamps": lamp_on, "outlets": out_live, "currents": currents, "trips": trips}
        # normál üzem (minden hibahely/érintés/próbagomb az első állásában): nem lehet kioldás
        normal = all(combo[cid] == c["states"][0]["name"] for cid, c in sels
                     if c["type"] in ("hibaut", "ember") or c.get("scenario"))
        if normal and any(trips.values()):
            hz.add("H11-normal-uzemben-kiold")
    # --- topológiai követelmények (állásfüggetlen)
    allclosed = {}
    for cid, c in sels:
        cl = [s for s in c["states"] if s.get("connect")]
        allclosed[cid] = (cl[0] if cl else c["states"][0])["name"]
    base_edges = wires + bridges
    if mcbs:
        f = o_graph(nodes, base_edges + closed_pairs(allclosed, skip={m["id"] for m in mcbs}))
        gL = {f(x) for x in tapL}
        for c in outlets + loads:
            if any(f(f"{c['id']}.{t['id']}") in gL for t in c["terminals"] if t["role"] == "L"):
                hz.add("H15-nincs-tularamvedelem")
    if rcds:
        f = o_graph(nodes, base_edges + closed_pairs(allclosed, skip={q["id"] for q in rcds}))
        gL, gN = {f(x) for x in tapL}, {f(x) for x in tapN}
        for c in outlets:
            if any(f(f"{c['id']}.{t['id']}") in gL | gN for t in c["terminals"] if t["role"] in ("L", "N")):
                hz.add("H16-dugalj-fi-nelkul")
    # próbagomb: megnyomva (a FI és minden más zárva) kioldást kell okoznia
    for c in d["components"]:
        if c["type"] == "nyomogomb" and c.get("parent") in comps:
            pressed = next((s["name"] for s in c["states"] if s.get("connect")), None)
            if pressed is None:
                hz.add("H17-probagomb")
                continue
            for key, r in results.items():
                if r["states"][c["id"]] == pressed and all(r["states"][cid] == allclosed[cid] for cid, cc in sels
                                                           if cc["type"] not in ("hibaut", "ember") and cid != c["id"]):
                    if not r["trips"].get(c["parent"]):
                        hz.add("H17-probagomb-nem-old-ki")
    return hz, results


def oracle_mismatch(d, results):
    """A truthTable eltér-e az orákulum kimenetétől."""
    sel_ids = [cid for cid, _ in o_selectors(d)]
    want = {tuple(r["states"].get(s) for s in sel_ids): r for r in d.get("truthTable", [])}
    if set(want) != set(results):
        return True
    for k, r in results.items():
        w = want[k]
        if w.get("lamps", {}) != r["lamps"]:
            return True
        for f in ("outlets", "currents", "trips"):
            if r[f] and w.get(f, {}) != r[f]:
                return True
    return False


# =====================================================================================================
# 2b. Mutációk
# =====================================================================================================
def mutants(d, fast=False):
    terms = [f"{c['id']}.{t['id']}" for c in d["components"] for t in c.get("terminals", [])]
    real = [i for i, w in enumerate(d["wires"]) if w.get("conductor") not in ("belső", "érintés", "hibahely")]
    # M1 – egy vezetékvég áthelyezése bármely más kapocsra
    for i in real:
        for end in ("from", "to"):
            for t in terms:
                if t == d["wires"][i][end] or t == d["wires"][i]["to" if end == "from" else "from"]:
                    continue
                m = copy.deepcopy(d)
                m["wires"][i][end] = t
                yield f"M1 {d['wires'][i].get('id')}.{end}→{t}", m
    # M2 – vezeték törlése
    for i in real:
        m = copy.deepcopy(d)
        wid = m["wires"][i].get("id")
        del m["wires"][i]
        yield f"M2 {wid} törölve", m
    # M3 – két vezetékvég cseréje
    pairs = list(itertools.combinations(real, 2))
    for i, j in pairs[: (60 if fast else None)]:
        for e1, e2 in (("to", "to"), ("from", "from"), ("from", "to"), ("to", "from")):
            m = copy.deepcopy(d)
            m["wires"][i][e1], m["wires"][j][e2] = m["wires"][j][e2], m["wires"][i][e1]
            yield f"M3 {d['wires'][i].get('id')}.{e1}↔{d['wires'][j].get('id')}.{e2}", m
    # M4 – áthidalás egy (nem kapcsoló) készülék két kapcsa között (pl. nullázott dugalj, L–PE a dobozban)
    for c in d["components"]:
        if c.get("states") is not None or c["type"] in ("tap",):
            continue
        ts = [t["id"] for t in c.get("terminals", [])]
        for a, b in itertools.combinations(ts, 2):
            m = copy.deepcopy(d)
            cc = next(x for x in m["components"] if x["id"] == c["id"])
            cc["bridges"] = (cc.get("bridges") or []) + [[a, b]]
            yield f"M4 {c['id']}: {a}–{b} áthidalva", m
    # M5 – kapcsolókészülék állásmodelljének torzítása (állás összeköttetéseinek cseréje / törlése)
    for c in d["components"]:
        if not c.get("states") or len(c["states"]) < 2 or any("connect" not in st for st in c["states"]):
            continue
        m = copy.deepcopy(d)
        cc = next(x for x in m["components"] if x["id"] == c["id"])
        cc["states"][0]["connect"], cc["states"][1]["connect"] = cc["states"][1]["connect"], cc["states"][0]["connect"]
        yield f"M5 {c['id']}: az állások összeköttetése felcserélve", m
        for si in range(len(c["states"])):
            for pi in range(len(c["states"][si].get("connect", []))):
                m = copy.deepcopy(d)
                cc = next(x for x in m["components"] if x["id"] == c["id"])
                del cc["states"][si]["connect"][pi]
                yield f"M5 {c['id']}/{c['states'][si]['name']}: {pi}. összeköttetés törölve", m


def run_mutation(fast=False):
    ok = True
    print("2. Független fizikai orákulum + mutációs teszt (a: eredeti tábla; b: a szimulált kimenetre átírt tábla)")
    for slug in GOOD:
        d = base(slug)
        hz, res = oracle(d)
        mm = oracle_mismatch(d, res)
        good = not hz and not mm
        ok &= good
        print(f"  {'OK  ' if good else 'HIBA'} jó netlista az orákulum szerint: {slug} "
              f"(veszély: {sorted(hz) or 'nincs'}, a truthTable {'ELTÉR' if mm else 'egyezik'})")
        n = bad = fp_a = fp_b = calc = cons = 0
        examples = []
        for name, m in mutants(d, fast):
            n += 1
            try:
                mhz, mres = oracle(m)
            except (KeyError, StopIteration, ValueError, np.linalg.LinAlgError):
                continue  # a változat nem értelmezhető modell (pl. ismeretlen kapocs) – a sim S-hibát ad
            danger = bool(mhz) or oracle_mismatch(m, mres)
            rep = sim_run(m)
            if danger:
                bad += 1
                if rep["pass"]:
                    fp_a += 1
                    if len(examples) < 8:
                        examples.append(f"a) {name}: orákulum {sorted(mhz) or 'működési eltérés'}")
            elif not rep["pass"]:
                cons += 1
            m2 = cheat(m)
            if m2 is None:
                continue
            rep2 = sim_run(m2)
            if rep2["pass"] and mhz:
                fp_b += 1
                if len(examples) < 8:
                    examples.append(f"b) {name}: orákulum {sorted(mhz)}")
            elif rep2["pass"] and oracle_mismatch(m2, mres):
                calc += 1
                if len(examples) < 8:
                    examples.append(f"b) {name}: a sim. kimenete eltér a fizikai számítástól")
        ok &= fp_a == 0 and fp_b == 0 and calc == 0
        print(f"       {n} változat, ebből {bad} veszélyes/hibás működésű az orákulum szerint; HAMIS PASS: a) {fp_a}, "
              f"b) {fp_b}; a sim. kimenete eltér a fizikától: {calc}; a sim. szigorúbb (FAIL, az orákulum szerint ártalmatlan): {cons}")
        for e in examples:
            print("         HIBA –", e)
    return ok


def main():
    fast = "--gyors" in sys.argv
    ok = run_probes()
    ok &= run_mutation(fast)
    print("védelmi próbák:", "SIKERES" if ok else "SIKERTELEN")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
