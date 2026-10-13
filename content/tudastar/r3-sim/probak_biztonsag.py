#!/usr/bin/env python3
"""Független biztonsági ellenőrzés a kapcsolások szimulátorához (sim.py) – a független ellenőr szkriptje.

Három rész:
  1. PRÓBANETLISTÁK – szándékosan hibás bekötések (fázis helyett nulla kapcsolása minden kapcsolótípusnál,
     a védővezető megszakítása, zárlat egyetlen kapcsolóállásban, nullázás a lámpánál, hiányos kapcsolómodell,
     két áramkör összekötése). Mindegyiknek a megadott hibakóddal MEG KELL buknia. A próbák a probak/ mappába
     is kiíródnak (<név>.netlist.json), hogy a lektor megnézhesse őket.
  2. FÜGGETLEN ORÁKULUM + MUTÁCIÓS TESZT – egy, a sim.py-tól független (szélességi kereséses, kapocsszerep és
     érszín nélküli, csak fizikai) ellenőrző minden jó netlistából több ezer hibás változatot készít (vezetékvég
     áthelyezése, vezeték törlése, két vezetékvég cseréje, rossz vezetékösszekötő a dobozban). Ha az orákulum
     szerint a változat veszélyes vagy rosszul működik, a sim.py-nak FAIL-t kell adnia (hamis PASS nem lehet).
     M5: a kapcsolók állásmodelljének torzítása (állás törlése a truthTable-lel együtt, illetve az összeköttetések
     cseréje) – minden ilyen változatnak meg kell buknia (S8 vagy I10).
  3. A jó netlisták az orákulum szerint is hibátlanok.
Futtatás: python3 probak_biztonsag.py [--gyors]     kilépési kód 1, ha bármelyik ellenőrzés hibás
"""
import copy
import itertools
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import sim  # noqa: E402

D = os.path.join(HERE, "..", "r3")
PROBE_DIR = os.path.join(HERE, "probak")
KAPCSOLASOK = ["egypolusu-kapcsolo-101-bekotese", "ketpolusu-kapcsolo-102-bekotese", "csillarkapcsolo-105-bekotese",
               "valtokapcsolo-106-bekotese", "kettos-valtokapcsolo-106-6-bekotese", "keresztkapcsolo-107-bekotese",
               "keresztkapcsolo-107-bekotese-2x107", "keresztkapcsolo-107-bekotese-3x107", "keresztkapcsolo-107-bekotese-4x107"]
SINGLE_POLE = {"kapcsolo-101", "kapcsolo-105", "kapcsolo-106", "kapcsolo-106-6", "kapcsolo-107"}


def base(slug):
    with open(os.path.join(D, slug + ".netlist.json"), encoding="utf-8") as fh:
        return json.load(fh)


def W(d, wid):
    return next(w for w in d["wires"] if w.get("id") == wid)


def C(d, cid):
    return next(c for c in d["components"] if c["id"] == cid)


def codes(rep):
    return {e[1:e.index("]")] for e in rep["errors"]}


def sim_run(d):
    return sim.Netlist(copy.deepcopy(d), "<próba>").run()


# =====================================================================================================
# 2. Független orákulum – szándékosan NEM használja a sim.py kódját (se UF-t, se szerep-/színtáblát)
# =====================================================================================================
def selectors(d):
    out = []
    for c in d["components"]:
        if c.get("states") is not None:
            out.append((c["id"], c["id"], c["states"]))
        for k in c.get("keys") or []:
            out.append((f"{c['id']}.{k['id']}", c["id"], k["states"]))
    return out


def components_of(nodes, edges):
    adj = {n: [] for n in nodes}
    for a, b in edges:
        if a in adj and b in adj:
            adj[a].append(b)
            adj[b].append(a)
    label = {}
    for n in nodes:
        if n in label:
            continue
        label[n] = n
        stack = [n]
        while stack:
            x = stack.pop()
            for y in adj[x]:
                if y not in label:
                    label[y] = n
                    stack.append(y)
    return label


def oracle(d):
    """Fizikai veszélyek és működés. Visszaad: (veszélyek halmaza, {állás: {lámpa: ég}})."""
    comps = {c["id"]: c for c in d["components"]}
    nodes = [f"{c['id']}.{t['id']}" for c in d["components"] for t in c.get("terminals", [])]
    base_edges = [(w.get("from"), w.get("to")) for w in d["wires"]]
    for c in d["components"]:
        for grp in c.get("bridges", []) or []:
            base_edges += [(f"{c['id']}.{grp[0]}", f"{c['id']}.{t}") for t in grp[1:]]
    taps = [c for c in d["components"] if c["type"] == "tap"]
    lamps = [c for c in d["components"] if c["type"] == "lampa"]
    allpole = set((d.get("checks") or {}).get("allPoleDisconnect", []))
    sels = selectors(d)
    hz = set()
    table = {}
    pe_sets = []
    for prod in itertools.product(*[[s["name"] for s in st] for _, _, st in sels]):
        edges = list(base_edges)
        for (sid, cid, st), name in zip(sels, prod):
            s = next(x for x in st if x["name"] == name)
            edges += [(f"{cid}.{a}", f"{cid}.{b}") for a, b in s.get("connect", [])]
        lab = components_of(nodes, edges)
        g = lab.get
        tapL = {g(f"{t['id']}.{x['id']}") for t in taps for x in t["terminals"] if x["role"] in ("L", "L1", "L2", "L3")}
        tapN = {g(f"{t['id']}.{x['id']}") for t in taps for x in t["terminals"] if x["role"] == "N"}
        tapPE = {g(f"{t['id']}.{x['id']}") for t in taps for x in t["terminals"] if x["role"] == "PE"}
        # H1 zárlat (L–N, L–PE, N–PE, illetve két áramkör fázisa egymással)
        if tapL & tapN or tapL & tapPE or tapN & tapPE or len(tapL) < sum(1 for t in taps for x in t["terminals"] if x["role"] in ("L", "L1", "L2", "L3")):
            hz.add("H1-zarlat")
        # H9 két áramkör nullavezetője összekötve (több betápnál)
        if len(tapN) < len(taps):
            hz.add("H9-kozos-nulla")
        pe_net = frozenset(n for n in nodes if g(n) in tapPE)
        pe_sets.append(pe_net)
        lit = {}
        for lp in lamps:
            tl = next(f"{lp['id']}.{x['id']}" for x in lp["terminals"] if x["role"] == "L")
            tn = next(f"{lp['id']}.{x['id']}" for x in lp["terminals"] if x["role"] == "N")
            tpe = [f"{lp['id']}.{x['id']}" for x in lp["terminals"] if x["role"] == "PE"]
            on = (g(tl) in tapL and g(tn) in tapN) or (g(tl) in tapN and g(tn) in tapL)
            lit[lp["id"]] = on
            # H2 a fémtest nincs a betáp PE-jén
            if any(g(p) not in tapPE for p in tpe):
                hz.add("H2-pe-szakadas")
            # H4 kikapcsolva is fázis a lámpán
            if not on and (g(tl) in tapL or g(tn) in tapL):
                hz.add("H4-fazis-kikapcsolva")
            # H6 fordított polaritás
            if on and g(tl) in tapN:
                hz.add("H6-polaritas")
            # H8 a nulla megszakad (nem minden pólust bontó kapcsolásnál), H10 minden pólust bontónál kikapcsolva is a hálózaton
            if lp["id"] in allpole:
                if not on and (g(tn) in tapN or g(tn) in tapL or g(tl) in tapN):
                    hz.add("H10-nem-bont-minden-polust")
            elif g(tn) not in tapN:
                hz.add("H8-nulla-megszakad")
            # H11 kölcsönvett nulla: a lámpa fázisa és nullája nem ugyanabból a betápból
            if on and len(taps) > 1:
                tL = {t["id"] for t in taps for x in t["terminals"] if x["role"] in ("L", "L1", "L2", "L3") and g(f"{t['id']}.{x['id']}") in (g(tl), g(tn))}
                tN = {t["id"] for t in taps for x in t["terminals"] if x["role"] == "N" and g(f"{t['id']}.{x['id']}") in (g(tl), g(tn))}
                if tL != tN:
                    hz.add("H11-kolcsonvett-nulla")
        # H5 nulla egypólusú kapcsolón
        for c in d["components"]:
            if c["type"] in SINGLE_POLE:
                if any(g(f"{c['id']}.{x['id']}") in tapN for x in c["terminals"]):
                    hz.add("H5-nulla-kapcsolon")
        table[prod] = lit
    # H3 a védővezető-hálózat a kapcsolóállástól függ (a PE-t kapcsoló bontja vagy köti)
    if len(set(pe_sets)) > 1:
        hz.add("H3-pe-kapcsolt")
    # H7 eltérés az előírt működéstől
    sel_ids = [s for s, _, _ in sels]
    want = {tuple(r["states"].get(s) for s in sel_ids): r["lamps"] for r in d.get("truthTable", [])}
    if set(want) != set(table) or any(want[k] != v for k, v in table.items()):
        hz.add("H7-mukodes")
    return hz, table


# =====================================================================================================
# 1. Próbanetlisták
# =====================================================================================================
PROBES = []


def probe(name, expect, note):
    def deco(fn):
        PROBES.append((name, expect, note, fn))
        return fn
    return deco


# --- fázis helyett nulla kapcsolása, minden kapcsolótípusnál ----------------------------------------
@probe("p01-101-nulla-kapcsolva", {"I4", "I6"}, "101: a kapcsoló a nullavezetőt bontja, a lámpa L-kapcsa közvetlenül fázison")
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    W(d, "w4").update({"from": "KD.N", "conductor": "N", "color": "kék", "role": "N"})
    W(d, "w6").update({"to": "E1.N"})
    W(d, "w7").update({"from": "KD.L", "to": "E1.L", "conductor": "L", "color": "barna", "role": "L"})
    return d


@probe("p02-105-nulla-kapcsolva", {"I4", "I6"}, "105: a csillárkapcsoló közös kapcsára a nulla kerül, a két kapcsolt ér a lámpák N-kapcsára; a lámpák L-je fázison")
def _():
    d = base("csillarkapcsolo-105-bekotese")
    W(d, "w4").update({"from": "KD.N"})            # vezetőnév álcázva (L) – a gráfszámításnak kell megfognia
    for wid, lamp in (("w11", "E1"), ("w12", "E2")):
        W(d, wid).update({"to": f"{lamp}.N"})
    for wid, lamp in (("w13", "E1"), ("w14", "E2")):
        W(d, wid).update({"from": "CS.N", "to": f"{lamp}.L"})
    W(d, "w9").update({"from": "KD.L", "conductor": "L", "color": "barna", "role": "L"})
    return d


@probe("p03-106-nulla-kapcsolva", {"I4", "I6"}, "106: a váltókapcsolás a nullavezetőt kapcsolja (N a K1 közös kapcsán, a lámpa L-je közvetlenül fázison)")
def _():
    d = base("valtokapcsolo-106-bekotese")
    W(d, "w4").update({"from": "KD.N"})
    W(d, "w10").update({"to": "E1.N"})
    W(d, "w11").update({"from": "KD.L", "to": "E1.L"})
    return d


@probe("p04-107-nulla-kapcsolva", {"I4", "I6"}, "107: a keresztkapcsolás a nullavezetőt kapcsolja")
def _():
    d = base("keresztkapcsolo-107-bekotese")
    W(d, "w4").update({"from": "KD.N"})
    W(d, "w14").update({"to": "E1.N"})
    W(d, "w15").update({"from": "KD.L", "to": "E1.L"})
    return d


@probe("p05-106-6-nulla-kapcsolva", {"I4", "I6"}, "106+6: a 2. kör a nullát kapcsolja (a C2-re külön nullavezető megy, a 2. lámpa L-je fázison)")
def _():
    d = base("kettos-valtokapcsolo-106-6-bekotese")
    d["wires"] = [w for w in d["wires"] if w["id"] != "w5"]   # nincs áthidaló
    d["wires"].append({"id": "x1", "from": "KD.N", "to": "S1.C2", "conductor": "L", "role": "L", "color": "barna", "section": "W1"})
    W(d, "w19").update({"to": "E2.N"})
    W(d, "w20").update({"from": "KD.L", "to": "E2.L"})
    return d


@probe("p06-102-csak-nulla", {"I4"}, "102: a fázis megkerüli a kapcsolót (csak a nullapólus bont)")
def _():
    d = base("ketpolusu-kapcsolo-102-bekotese")
    W(d, "w4").update({"from": "S1.L"})
    return d


# --- a védővezető megszakítása: minden PE-ér egyenként (a 9 netlistában) -------------------------
def pe_cut_probes():
    out = []
    for slug in KAPCSOLASOK:
        d0 = base(slug)
        for w in d0["wires"]:
            if w["conductor"] == "PE":
                d = copy.deepcopy(d0)
                d["wires"] = [x for x in d["wires"] if x["id"] != w["id"]]
                out.append((f"PE-szakadás {slug} {w['id']} ({w['from']}→{w['to']})", d))
    return out


@probe("p07-106-pe-a-valtovezeteken", {"I3"}, "106: a védővezető a K2 egyik váltókapcsára kötve (a kapcsoló a PE-t kapcsolja)")
def _():
    d = base("valtokapcsolo-106-bekotese")
    W(d, "w8").update({"from": "KD.PE"})          # vezetőnév álcázva: 'váltóvezeték' szürke
    return d


@probe("p08-107-pe-szakad-a-kotodobozban", {"I2"}, "107: a lámpa PE-ere nem a PE-kötésbe, hanem egy szabad kapocsra kerül")
def _():
    d = base("keresztkapcsolo-107-bekotese")
    C(d, "KD")["terminals"].append({"id": "X", "role": "PE", "label": "szabad PE-kapocs"})
    W(d, "w16").update({"from": "KD.X"})
    return d


# --- zárlat csak egyetlen állásban ---------------------------------------------------------------
@probe("p09-101-zarlat-bekapcsolva", {"I1"}, "101: a kapcsoló kimenete a dobozban a nullakötésbe került – zárlat csak „be” állásban")
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    W(d, "w5").update({"to": "KD.N"})
    return d


@probe("p10-102-zarlat-bekapcsolva", {"I1"}, "102: a két kimenet a fogyasztónál összeér (sérült szigetelés) – zárlat csak „be” állásban")
def _():
    d = base("ketpolusu-kapcsolo-102-bekotese")
    C(d, "E1")["bridges"] = [["L", "N"]]
    return d


@probe("p11-106-zarlat-egy-allasban", {"I1"}, "106: a 2-es váltóvezeték a dobozban a nullára került – zárlat a K1 egyik állásában")
def _():
    d = base("valtokapcsolo-106-bekotese")
    W(d, "w8").update({"from": "KD.N"})
    W(d, "w6").update({"to": "KD.N"})
    return d


@probe("p12-107-zarlat-egy-allaspar", {"I1"}, "107: a „b” pár egyik ere a nullára került – zárlat csak bizonyos állásokban")
def _():
    d = base("keresztkapcsolo-107-bekotese")
    W(d, "w10").update({"to": "KD.N"})
    W(d, "w12").update({"from": "KD.N"})
    return d


@probe("p13-106-l-pe-zarlat", {"I1", "I3"}, "106: a kapcsolt fázis a dobozban a PE-kötésbe került – L–PE zárlat azokban az állásokban, amelyekben a lámpa égne")
def _():
    d = base("valtokapcsolo-106-bekotese")
    W(d, "w9").update({"to": "KD.PE"})
    return d


@probe("p14-106-6-zarlat-egy-allasban", {"I1"}, "106+6: a 2b váltóvezeték a nullára került")
def _():
    d = base("kettos-valtokapcsolo-106-6-bekotese")
    W(d, "w9").update({"to": "KD.N"})
    W(d, "w13").update({"from": "KD.N"})
    return d


# --- nullázás a lámpánál, kék ér, PEN --------------------------------------------------------------
@probe("p15-101-nullazas-a-lampanal", {"I2", "I3"}, "101: a lámpatest védőkapcsa a nullavezetőre kötve (»nullázás« a lámpánál, PEN-szétválasztás utáni összekötés)")
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    W(d, "w8").update({"from": "KD.N"})
    return d


@probe("p16-105-nullazas-a-csillarnal", {"I1", "I3"}, "105: a csillár sorkapcsán az N és a PE összekötve")
def _():
    d = base("csillarkapcsolo-105-bekotese")
    C(d, "CS")["bridges"] = [["N", "PE"]]
    return d


# --- hiányos vagy hibás kapcsolómodell (az eredeti sim.py ezeket nem fogta meg) ------------------
@probe("p17-106-hianyos-modell-rejtett-zarlat", {"S8"},
       "106: a K1 csak egy állással van modellezve, a truthTable ehhez igazítva; a hiányzó állásban a 2-es váltóvezeték a nullán van → rejtett zárlat")
def _():
    d = base("valtokapcsolo-106-bekotese")
    C(d, "S1")["states"] = C(d, "S1")["states"][:1]
    W(d, "w6").update({"to": "KD.N"})
    W(d, "w8").update({"from": "KD.N"})
    d["truthTable"] = [r for r in d["truthTable"] if r["states"]["S1"] == "0"]
    return d


@probe("p18-107-hianyos-modell", {"S8"}, "107: a keresztkapcsolónak csak az „egyenes” állása szerepel (truthTable ehhez igazítva)")
def _():
    d = base("keresztkapcsolo-107-bekotese")
    C(d, "X1")["states"] = C(d, "X1")["states"][:1]
    d["truthTable"] = [r for r in d["truthTable"] if r["states"]["X1"] == "egyenes"]
    return d


@probe("p19-107-fizikailag-lehetetlen-allas", {"S8"}, "107: a „keresztezett” állás három kapcsot köt össze (nem teljes párosítás)")
def _():
    d = base("keresztkapcsolo-107-bekotese")
    C(d, "X1")["states"][1]["connect"] = [["A1", "B2"], ["A2", "B1"], ["B1", "B2"]]
    # a truthTable-t a hibás modell kimenetéhez igazítjuk, hogy csak a modellellenőrzés foghassa meg
    nl = sim.Netlist(copy.deepcopy(d), "x")
    tt = []
    for combo in nl.combos():
        f = nl.solve(combo).find
        tt.append({"states": dict(combo), "lamps": {"E1": f("E1.L") == f("T.L") and f("E1.N") == f("T.N")}})
    d["truthTable"] = tt
    return d


@probe("p20-102-fuggetlen-polusok", {"S8"}, "102: a két pólus két külön billentyűként modellezve (a valóságban együtt mozognak)")
def _():
    d = base("ketpolusu-kapcsolo-102-bekotese")
    s1 = C(d, "S1")
    del s1["states"]
    s1["keys"] = [{"id": "L", "states": [{"name": "ki", "connect": []}, {"name": "be", "connect": [["L", "1"]]}]},
                  {"id": "N", "states": [{"name": "ki", "connect": []}, {"name": "be", "connect": [["N", "2"]]}]}]
    d["truthTable"] = [{"states": {"S1.L": a, "S1.N": b}, "lamps": {"E1": a == b == "be"}} for a in ("ki", "be") for b in ("ki", "be")]
    return d


@probe("p21-101-mindig-zart", {"S8"}, "101: a kapcsoló mindkét állása zárt (áthidalt kapcsoló), truthTable ehhez igazítva")
def _():
    d = base("egypolusu-kapcsolo-101-bekotese")
    C(d, "S1")["states"][0]["connect"] = [["L", "1"]]
    for r in d["truthTable"]:
        r["lamps"]["E1"] = True
    return d


# --- két áramkör ----------------------------------------------------------------------------------
def two_circuit_106_6(athidalo=False, lamp2_n="KD.N2", nulla_osszekotve=False):
    """106+6 két áramkörrel: a 2. kör (C2) a T2 betápról kap fázist a kötődobozon át (KD.L2), saját nullakötéssel (KD.N2).
    A két áramkör védővezetője közös PE-kötésbe kerül – ez megengedett."""
    d = base("kettos-valtokapcsolo-106-6-bekotese")
    d["components"].insert(1, {"id": "T2", "type": "tap", "label": "Betáp – 2. áramkör",
                               "terminals": [{"id": "L", "role": "L"}, {"id": "N", "role": "N"}, {"id": "PE", "role": "PE"}]})
    kd = C(d, "KD")
    kd["terminals"] += [{"id": "L2", "role": "L", "label": "2. áramkör L-kötése"}, {"id": "N2", "role": "N", "label": "2. áramkör N-kötése"}]
    if nulla_osszekotve:
        kd["bridges"] = [["N", "N2"]]
    d["sections"].append({"id": "W0b", "from": "T2", "to": "KD", "label": "Elosztó – kötődoboz (2. áramkör)", "kind": "betap"})
    if not athidalo:
        d["wires"] = [w for w in d["wires"] if w["id"] != "w5"]
    d["wires"] += [{"id": "x1", "from": "T2.L", "to": "KD.L2", "conductor": "L", "role": "L", "color": "barna", "section": "W0b"},
                   {"id": "x1b", "from": "KD.L2", "to": "S1.C2", "conductor": "L", "role": "L", "color": "barna", "section": "W1"},
                   {"id": "x2", "from": "T2.N", "to": "KD.N2", "conductor": "N", "role": "N", "color": "kék", "section": "W0b"},
                   {"id": "x3", "from": "T2.PE", "to": "KD.PE", "conductor": "PE", "role": "PE", "color": "zöld-sárga", "section": "W0b"}]
    W(d, "w20").update({"from": lamp2_n})
    return d


@probe("p22-106-6-ket-aramkor-athidalva", {"I1"}, "106+6: a 2. kör külön áramkörről kap fázist a C2-re, de a C1–C2 áthidaló megmaradt → a két áramkör fázisa összekötve")
def _():
    return two_circuit_106_6(athidalo=True)


@probe("p23-106-6-kolcsonvett-nulla", {"I14"}, "106+6: a 2. kör fázisa a 2. áramkörből, nullája az 1. áramkör nullavezetőjéből (kölcsönvett nulla)")
def _():
    return two_circuit_106_6(lamp2_n="KD.N")


@probe("p24-106-6-ket-aramkor-nullaja-osszekotve", {"I14"}, "106+6: két áramkör, saját fázissal és nullával, de a két nullavezető a dobozban egy összekötőben")
def _():
    return two_circuit_106_6(nulla_osszekotve=True)


GOOD = []


def good(name, note):
    def deco(fn):
        GOOD.append((name, note, fn))
        return fn
    return deco


@good("g01-106-6-ket-aramkor-helyesen", "106+6: két áramkör, saját fázissal és saját nullával; a két PE közös (ez megengedett)")
def _():
    return two_circuit_106_6()


# =====================================================================================================
# 2. Mutációs teszt
# =====================================================================================================
def mutants(d0, full=True):
    terms = [f"{c['id']}.{t['id']}" for c in d0["components"] for t in c["terminals"]]
    wires = d0["wires"]
    # M1 vezetékvég áthelyezése bármely más kapocsra
    if full:
        for i, w in enumerate(wires):
            for end in ("from", "to"):
                for t in terms:
                    if t != w[end]:
                        d = copy.deepcopy(d0)
                        d["wires"][i][end] = t
                        yield f"M1 {w['id']}.{end}→{t}", d
    # M2 vezeték törlése
    for i, w in enumerate(wires):
        d = copy.deepcopy(d0)
        del d["wires"][i]
        yield f"M2 törölve {w['id']}", d
    # M3 két vezeték célvégének cseréje (felcserélt erek)
    for i, j in itertools.combinations(range(len(wires)), 2):
        for e1, e2 in (("to", "to"), ("from", "from"), ("from", "to")):
            d = copy.deepcopy(d0)
            d["wires"][i][e1], d["wires"][j][e2] = d0["wires"][j][e2], d0["wires"][i][e1]
            yield f"M3 csere {wires[i]['id']}.{e1}↔{wires[j]['id']}.{e2}", d
    # M4 rossz vezetékösszekötő: a dobozban két kötés összevonva
    for c in d0["components"]:
        if c["type"] in ("kotodoboz", "sorkapocs", "kotoelem"):
            for a, b in itertools.combinations([t["id"] for t in c["terminals"]], 2):
                d = copy.deepcopy(d0)
                cc = next(x for x in d["components"] if x["id"] == c["id"])
                cc["bridges"] = (cc.get("bridges") or []) + [[a, b]]
                yield f"M4 {c['id']}: {a}+{b} egy összekötőben", d


def mutation_test(slugs, full=True):
    tot = hazardous = false_pass = stricter = 0
    examples = []
    per = {}
    for slug in slugs:
        d0 = base(slug)
        n = h = fp = st = 0
        for name, d in mutants(d0, full):
            n += 1
            hz, _ = oracle(d)
            rep = sim_run(d)
            if hz:
                h += 1
                if rep["pass"]:
                    fp += 1
                    if len(examples) < 12:
                        examples.append(f"{slug}: {name}: orákulum {sorted(hz)}, sim PASS")
            elif not rep["pass"]:
                st += 1
        per[slug] = (n, h, fp, st)
        tot += n
        hazardous += h
        false_pass += fp
        stricter += st
    return tot, hazardous, false_pass, stricter, per, examples


def state_mutants(d0):
    """M5 – a kapcsolók állásmodelljének torzítása: egy állás törlése (a truthTable-t is hozzáigazítva, hogy csak a
    modellellenőrzés foghassa meg), illetve egy állás összeköttetéseinek cseréje a kapcsok bármely 0–2 párjára."""
    for c in d0["components"]:
        if not c["type"].startswith("kapcsolo-"):
            continue
        tids = [t["id"] for t in c["terminals"]]
        groups = [(None, c["states"])] if c.get("states") is not None else [(k["id"], k["states"]) for k in c["keys"]]
        allpairs = [list(p) for p in itertools.combinations(tids, 2)]
        for key, states in groups:
            sid = c["id"] if key is None else f"{c['id']}.{key}"
            for si, st in enumerate(states):
                d = copy.deepcopy(d0)
                cc = next(x for x in d["components"] if x["id"] == c["id"])
                tgt = cc["states"] if key is None else next(k for k in cc["keys"] if k["id"] == key)["states"]
                del tgt[si]
                d["truthTable"] = [r for r in d["truthTable"] if r["states"][sid] != st["name"]]
                yield f"M5 {sid}: „{st['name']}” állás törölve", d
                for n in (0, 1, 2):
                    for combo in itertools.combinations(allpairs, n):
                        conn = [list(p) for p in combo]
                        if sorted(map(sorted, conn)) == sorted(map(sorted, st.get("connect", []))):
                            continue
                        d = copy.deepcopy(d0)
                        cc = next(x for x in d["components"] if x["id"] == c["id"])
                        tgt = cc["states"] if key is None else next(k for k in cc["keys"] if k["id"] == key)["states"]
                        tgt[si]["connect"] = conn
                        yield f"M5 {sid}: „{st['name']}” = {conn}", d


def state_mutation_test(slugs):
    n = caught = 0
    missed = []
    for slug in slugs:
        for name, d in state_mutants(base(slug)):
            n += 1
            rep = sim_run(d)
            if rep["pass"]:
                missed.append(f"{slug}: {name}")
            else:
                caught += 1
    return n, caught, missed


def main(argv):
    gyors = "--gyors" in argv
    os.makedirs(PROBE_DIR, exist_ok=True)
    fails = 0
    print("== 1. Próbanetlisták (szándékosan hibás bekötések) ==")
    for name, expect, note, fn in PROBES:
        d = fn()
        d["id"] = name
        d["title"] = "PRÓBA (szándékosan hibás): " + note
        with open(os.path.join(PROBE_DIR, name + ".netlist.json"), "w", encoding="utf-8") as fh:
            json.dump(d, fh, ensure_ascii=False, indent=1)
            fh.write("\n")
        rep = sim_run(d)
        got = codes(rep)
        hz, _ = oracle(d)
        ok = (not rep["pass"]) and expect <= got
        fails += not ok
        print(f"{'OK  ' if ok else 'HIBA'} {name}: {'FAIL' if not rep['pass'] else 'PASS'} {sorted(got)} (várt ⊇ {sorted(expect)}; orákulum: {sorted(hz) or '–'})")
    pe = pe_cut_probes()
    pe_ok = 0
    for name, d in pe:
        rep = sim_run(d)
        ok = (not rep["pass"]) and "I2" in codes(rep)
        pe_ok += ok
        if not ok:
            fails += 1
            print("HIBA", name, sorted(codes(rep)))
    print(f"{'OK  ' if pe_ok == len(pe) else 'HIBA'} PE-szakadás: {pe_ok}/{len(pe)} kivágott PE-ér mindegyike I2-vel bukik (9 netlista)")
    for name, note, fn in GOOD:
        d = fn()
        rep = sim_run(d)
        hz, _ = oracle(d)
        ok = rep["pass"] and not hz
        fails += not ok
        print(f"{'OK  ' if ok else 'HIBA'} {name} (PASS-t vár): sim {'PASS' if rep['pass'] else 'FAIL'} {sorted(codes(rep))}; orákulum {sorted(hz) or '–'}")
    print("== 3. A jó netlisták az orákulum szerint is hibátlanok ==")
    for slug in KAPCSOLASOK:
        hz, table = oracle(base(slug))
        rep = sim_run(base(slug))
        ok = not hz and rep["pass"]
        fails += not ok
        print(f"{'OK  ' if ok else 'HIBA'} {slug}: {len(table)} állás, orákulum {sorted(hz) or 'hibátlan'}, sim {'PASS' if rep['pass'] else 'FAIL'}")
    print("== 2. Mutációs teszt (független orákulum ↔ sim.py) ==")
    slugs = KAPCSOLASOK if not gyors else KAPCSOLASOK[:6]
    full = [s for s in slugs if not s.endswith(("3x107", "4x107"))]
    part = [s for s in slugs if s.endswith(("3x107", "4x107"))]
    res = [mutation_test(full, True)]
    if part:
        res.append(mutation_test(part, False))
    tot = sum(r[0] for r in res)
    haz = sum(r[1] for r in res)
    fp = sum(r[2] for r in res)
    st = sum(r[3] for r in res)
    for r in res:
        for slug, (n, h, f, s) in r[4].items():
            print(f"   {slug}: {n} mutáns, ebből {h} veszélyes/hibás működésű, hamis PASS: {f}, csak a sim szigorúbb (szerep/szín): {s}")
        for e in r[5]:
            print("   HAMIS PASS:", e)
    print(f"{'OK  ' if fp == 0 else 'HIBA'} mutációs teszt: {tot} mutáns, {haz} veszélyes vagy hibás működésű, hamis PASS: {fp}")
    fails += fp > 0
    sn, sc, smiss = state_mutation_test(KAPCSOLASOK[:7])
    for m in smiss[:10]:
        print("   ÁTCSÚSZOTT:", m)
    print(f"{'OK  ' if not smiss else 'HIBA'} kapcsolómodell-mutációk (M5): {sn} torzított állásmodell, ebből FAIL: {sc}")
    fails += bool(smiss)
    print("független ellenőrzés:", "SIKERES" if not fails else f"{fails} HIBA")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
