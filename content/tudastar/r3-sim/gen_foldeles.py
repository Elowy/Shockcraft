#!/usr/bin/env python3
"""A földelési (foldelesi-rendszerek-*) és az EPH (egyenpotencialra-hozas) netlisták előállítója.

A truthTable-t NEM a szimulátor tölti ki: minden sor várt értéke az alábbi expect_* függvényekben kézzel, a
fizikai gondolatmenetből van megadva (a docstringek írják le az indoklást); a sim.py ezt veti össze a saját,
gráfalapú számításával. Futtatás: python3 gen_foldeles.py (a ../r3 mappába ír)."""
import itertools
import json
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "r3")
FMT = "kb-netlista/1"
NOTE_COMMON = ("Tervezet a szakmai lektornak (R3). Elvi rajz: a táppont az elosztói engedélyes transzformátora, a hálózat és "
               "a csatlakozás az elosztói engedélyes hatásköre; a rajz nem szerelési utasítás. A kapocsjelölés gyártónként "
               "eltérhet; a gyártói útmutató az irányadó. A keresztmetszet, a túláramvédelem névleges árama és a földelési "
               "ellenállás méretezés kérdése, ezért az ábra nem ad számot. A hibahely (testzárlat) és az érintési pont jelképes, "
               "nem szerelt vezeték. A táblázat a hiba fennállásának pillanatát mutatja, a lekapcsolás előtt.")


def term(i, role, label=None):
    t = {"id": i, "role": role}
    if label:
        t["label"] = label
    return t


def wire(wid, frm, to, cond, color=None, section=None, label=None):
    w = {"id": wid, "from": frm, "to": to, "conductor": cond}
    role = {"L1": "L1", "L2": "L2", "L3": "L3", "L": "L", "N": "N", "PE": "PE", "PEN": "PEN",
            "földelővezető": "PE", "EPH-vezető": "PE"}.get(cond)
    if role:
        w["role"] = role
    if color:
        w["color"] = color
    if section:
        w["section"] = section
    if label:
        w["label"] = label
    return w


def tap(star_role, extra_pe=False, label="T1 elosztói transzformátor, kisfeszültségű tekercs"):
    ts = [term("L1", "L1", "L1"), term("L2", "L2", "L2"), term("L3", "L3", "L3")]
    star_label = {"PEN": "csillagpont (PEN)", "N": "csillagpont (N)"}[star_role]
    ts.append(term(star_role, star_role, star_label))
    c = {"id": "TR", "type": "tap", "label": label, "short": "T1", "at": "TR", "terminals": ts}
    if extra_pe:
        ts.append(term("PE", "PE", "csillagpont (PE)"))
        c["bridges"] = [["N", "PE"]]
    return c


def electrode(cid, label, at, kind):
    return {"id": cid, "type": "foldelo", "label": label, "short": cid, "at": at, "kind": kind,
            "terminals": [term("K", "FK", "földelőkapocs")]}


SOIL = {"id": "FOLD", "type": "fold", "label": "Föld (talaj)", "at": "FOLD", "terminals": [term("E", "E", "föld")]}


def fault(cid, at, a_role="L", label="H1 testzárlat M1-ben (fázis → fémház)"):
    return {"id": cid, "type": "hibaut", "label": label, "at": at, "outputLabel": f"{cid}: hibaáram útja",
            "terminals": [term("a", a_role, "fázisoldali hibahely"), term("b", "PE", "fémház")],
            "states": [{"name": "nincs", "active": False}, {"name": "fennáll", "active": True}]}


def consumer1(cid="M1", label="M1 fémházas fogyasztó (I. érintésvédelmi osztály)"):
    return {"id": cid, "type": "fogyaszto", "label": label, "outputLabel": f"{cid} fogyasztó", "at": cid, "class": "I",
            "terminals": [term("L", "L", "L"), term("N", "N", "N"), term("PE", "PE", "fémház (PE)")]}


def consumer3(cid, label):
    return {"id": cid, "type": "fogyaszto", "label": label, "outputLabel": f"{cid} fogyasztó", "at": cid, "class": "I",
            "terminals": [term("L1", "L1", "L1"), term("L2", "L2", "L2"), term("L3", "L3", "L3"), term("PE", "PE", "fémház (PE)")]}


def mcb1(cid="F1", at="EL", label="F1 kismegszakító (túláramvédelem)"):
    return {"id": cid, "type": "kismegszakito", "label": label, "short": cid, "at": at,
            "terminals": [term("1", "L", "1 (be)"), term("2", "L", "2 (ki)")],
            "states": [{"name": "be", "label": "bekapcsolva", "connect": [["1", "2"]]}]}


def mcb3(cid, at, label):
    return {"id": cid, "type": "kismegszakito", "label": label, "short": cid, "at": at,
            "terminals": [term("1", "L1", "1 (L1 be)"), term("2", "L1", "2 (L1 ki)"), term("3", "L2", "3 (L2 be)"),
                          term("4", "L2", "4 (L2 ki)"), term("5", "L3", "5 (L3 be)"), term("6", "L3", "6 (L3 ki)")],
            "states": [{"name": "be", "label": "bekapcsolva", "connect": [["1", "2"], ["3", "4"], ["5", "6"]]}]}


def rcd(cid="Q1", at="EL"):
    return {"id": cid, "type": "fi-rele", "label": f"{cid} áram-védőkapcsoló (FI-relé), kétpólusú", "short": cid, "at": at,
            "poles": [["1", "2"], ["N-be", "N-ki"]],
            "terminals": [term("1", "L", "1 (fázis, táp oldal)"), term("2", "L", "2 (fázis, védett oldal)"),
                          term("N-be", "N", "N (táp oldal)"), term("N-ki", "N", "N (védett oldal)")],
            "states": [{"name": "be", "label": "bekapcsolva", "connect": [["1", "2"], ["N-be", "N-ki"]]}]}


def fault_wires(n0, h="H1", m="M1", a="L"):
    return [wire(f"w{n0}", f"{h}.a", f"{m}.{a}", "hibahely"), wire(f"w{n0 + 1}", f"{h}.b", f"{m}.PE", "hibahely")]


def table(selectors, fn):
    """selectors: [(id, [állapotnevek])]; fn(**állapotok) → várt kimenetek."""
    rows = []
    for prod in itertools.product(*[s[1] for s in selectors]):
        st = dict(zip([s[0] for s in selectors], prod))
        rows.append({"states": st, **fn(st)})
    return rows


def save(slug, d):
    p = os.path.join(OUT, slug + ".netlist.json")
    with open(p, "w", encoding="utf-8") as fh:
        json.dump(d, fh, ensure_ascii=False, indent=1)
        fh.write("\n")
    return p


PLACES = {
    "TR": {"label": "Transzformátorállomás (elosztói engedélyes)", "inner": "a táppontnál"},
    "EL": {"label": "Épület: csatlakozás, mérőhely utáni elosztó", "inner": "elosztón belül"},
    "M1": {"label": "Fogyasztó", "inner": "a fogyasztó csatlakozásánál"},
    "FOLD": {"label": "Föld (talaj)"},
}
SEC_NET = {"id": "S1", "from": "TR", "to": "EL", "label": "Elosztói hálózat és csatlakozás (az engedélyes hatásköre)", "kind": "halozat"}
SEC_CIRC = {"id": "S2", "from": "EL", "to": "M1", "label": "Fogyasztói áramkör", "kind": "aramkor"}
TOUCH = [{"id": "U1", "label": "M1 fémháza és a föld", "a": "M1.PE", "b": "FOLD.E"}]


# --- TN-C -------------------------------------------------------------------------------------------
def expect_tnc(st):
    """TN-C, a fémház a PEN-en. Ép PEN: testzárlatkor a hibaáram a PEN-en át fémesen tér vissza a csillagpontba, a
    túláramvédelem (F1) a hurokban van; a fémház a lekapcsolásig a hibaáram útjában van. PEN-szakadáskor a
    fogyasztó nem kap nullát (nem működik), és a fémháza a fogyasztón (vagy a hibahelyen) át a fázisra kerül; a
    hurok csak egy rajta álló emberen át zárulhatna – ezt semmi nem kapcsolja le."""
    fault_on, broken = st["H1"] == "fennáll", st["SZ"] == "szakadt"
    if not broken:
        return {"lamps": {"M1": True}, "consumers": {"M1": "mukodik"},
                "loops": {"H1": "femes" if fault_on else "nincs-hiba"}, "overcurrent": {"F1": fault_on},
                "touch": {"U1": "lekapcsolasig" if fault_on else "nincs"}}
    return {"lamps": {"M1": False}, "consumers": {"M1": "nem-mukodik"},
            "loops": {"H1": "nincs-hurok" if fault_on else "nincs-hiba"}, "overcurrent": {"F1": False},
            "touch": {"U1": "tartosan"}}


def tn_c():
    comps = [tap("PEN"), electrode("RB", "RB üzemi földelő (a csillagpont földelése)", "TR", "uzemi"),
             {"id": "XPEN", "type": "sorkapocs", "label": "PEN-kapocs az épület elosztójában", "at": "EL",
              "terminals": [term("PEN", "PEN", "PEN")]},
             mcb1("F1", "EL", "F1 túláramvédelem (kismegszakító vagy olvadóbiztosító)"),
             {"id": "XK", "type": "pen-kapocs", "label": "XK PEN-kapocs a fogyasztó csatlakozásánál (N és PE közös)", "at": "M1",
              "terminals": [term("PEN", "PEN", "PEN"), term("N", "N", "N"), term("PE", "PE", "PE")], "bridges": [["PEN", "N", "PE"]]},
             consumer1(), fault("H1", "M1"), SOIL]
    wires = [wire("w1", "TR.PEN", "RB.K", "földelővezető", "zöld-sárga"),
             wire("w2", "TR.L1", "F1.1", "L1", "barna", "S1"),
             wire("w3", "TR.PEN", "XPEN.PEN", "PEN", "zöld-sárga", "S1"),
             wire("w4", "F1.2", "M1.L", "L", "barna", "S2"),
             wire("w5", "XPEN.PEN", "XK.PEN", "PEN", "zöld-sárga", "S2"),
             wire("w6", "XK.N", "M1.N", "N", "kék"),
             wire("w7", "XK.PE", "M1.PE", "PE", "zöld-sárga")] + fault_wires(8)
    sel = [("F1", ["be"]), ("H1", ["nincs", "fennáll"]), ("SZ", ["ép", "szakadt"])]
    return {"format": FMT, "id": "foldeles-tn-c", "title": "TN-C rendszer: a PEN-vezető a fogyasztóig fut", "short": "TN-C",
            "article": "foldelesi-rendszerek", "figure": "abra-1", "version": 1,
            "note": NOTE_COMMON + " A régi, kéteres („nullázott”) berendezésekre jellemző felépítés; új berendezés így nem készül.",
            "earthing": {"system": "TN-C"}, "components": comps,
            "sections": [SEC_NET, SEC_CIRC], "wires": wires,
            "breaks": [{"id": "SZ", "label": "SZ PEN-szakadás a hálózatban", "wire": "w3",
                        "states": [{"name": "ép"}, {"name": "szakadt", "broken": True}]}],
            "touch": TOUCH,
            "compare": [{"label": "Testzárlat", "states": {"H1": "fennáll"}}, {"label": "PEN-szakadás", "states": {"SZ": "szakadt"}}],
            "truthTable": table(sel, expect_tnc), "places": PLACES,
            "layout": {"view": "bekotes", "viewBox": "0 0 480 240", "parts": {"TR": [20, 40], "RB": [20, 190], "XPEN": [200, 120],
                       "F1": [200, 40], "XK": [380, 120], "M1": [400, 40], "H1": [440, 80], "FOLD": [240, 220]},
                       "megjegyzes": "Durva elhelyezés; az útvonalakat az ábramotor adja."}}


# --- TN-S -------------------------------------------------------------------------------------------
def expect_tns(st):
    """TN-S: külön N és PE a csillagponttól. Testzárlatkor fémes hurok a PE-n át: a FI-relé (Q1) érzékeli
    (az áram a PE-n tér vissza, nem a nullán), és a túláramvédelem (F1) is a hurokban van. A nullavezető szakadása a
    fogyasztót leállítja, de a fémházat nem helyezi feszültség alá, mert a PE ép."""
    fault_on, broken = st["H1"] == "fennáll", st["SZ"] == "szakadt"
    return {"lamps": {"M1": not broken}, "consumers": {"M1": "nem-mukodik" if broken else "mukodik"},
            "loops": {"H1": "femes" if fault_on else "nincs-hiba"}, "trips": {"Q1": fault_on}, "overcurrent": {"F1": fault_on},
            "touch": {"U1": "lekapcsolasig" if fault_on else "nincs"}}


def tn_s():
    comps = [tap("N", extra_pe=True), electrode("RB", "RB üzemi földelő (a csillagpont földelése)", "TR", "uzemi"),
             {"id": "XN", "type": "n-sin", "label": "N-sín (nullasín)", "at": "EL", "terminals": [term("N", "N", "N")]},
             {"id": "XPE", "type": "pe-sin", "label": "PE-sín (főföldelő sín)", "at": "EL", "terminals": [term("PE", "PE", "PE")]},
             rcd(), mcb1(), consumer1(), fault("H1", "M1"), SOIL]
    wires = [wire("w1", "TR.PE", "RB.K", "földelővezető", "zöld-sárga"),
             wire("w2", "TR.L1", "Q1.1", "L1", "barna", "S1"),
             wire("w3", "TR.N", "XN.N", "N", "kék", "S1"),
             wire("w4", "TR.PE", "XPE.PE", "PE", "zöld-sárga", "S1"),
             wire("w5", "XN.N", "Q1.N-be", "N", "kék"),
             wire("w6", "Q1.2", "F1.1", "L", "barna"),
             wire("w7", "F1.2", "M1.L", "L", "barna", "S2"),
             wire("w8", "Q1.N-ki", "M1.N", "N", "kék", "S2"),
             wire("w9", "XPE.PE", "M1.PE", "PE", "zöld-sárga", "S2")] + fault_wires(10)
    sel = [("Q1", ["be"]), ("F1", ["be"]), ("H1", ["nincs", "fennáll"]), ("SZ", ["ép", "szakadt"])]
    return {"format": FMT, "id": "foldeles-tn-s", "title": "TN-S rendszer: külön nulla- és védővezető a táppontól", "short": "TN-S",
            "article": "foldelesi-rendszerek", "figure": "abra-2", "version": 1, "note": NOTE_COMMON,
            "earthing": {"system": "TN-S"}, "components": comps, "sections": [SEC_NET, SEC_CIRC], "wires": wires,
            "breaks": [{"id": "SZ", "label": "SZ nullavezető-szakadás a hálózatban", "wire": "w3",
                        "states": [{"name": "ép"}, {"name": "szakadt", "broken": True}]}],
            "touch": TOUCH,
            "compare": [{"label": "Testzárlat", "states": {"H1": "fennáll"}}, {"label": "N-szakadás", "states": {"SZ": "szakadt"}}],
            "truthTable": table(sel, expect_tns), "places": PLACES,
            "layout": {"view": "bekotes", "viewBox": "0 0 480 240", "parts": {"TR": [20, 40], "RB": [20, 190], "XN": [180, 110],
                       "XPE": [180, 170], "Q1": [180, 40], "F1": [260, 40], "M1": [400, 60], "H1": [440, 100], "FOLD": [240, 220]},
                       "megjegyzes": "Durva elhelyezés; az útvonalakat az ábramotor adja."}}


# --- TN-C-S -----------------------------------------------------------------------------------------
def expect_tncs(st):
    """TN-C-S: PEN a szétválasztási pontig, utána külön N és PE; a szétválasztásnál helyi földelő (RA).
    Ép PEN mellett a testzárlat fémes hurok (Q1 és F1 is érzékel). PEN-szakadáskor a fogyasztó árama a nullán, a
    szétválasztási ponton és az RA–talaj–RB úton folyik (rendellenes üzem), a PE és vele a fémház a fogyasztón át
    a fázis felé emelkedik; a FI-relé ezt nem érzékeli (a fázis- és a nullaáram egyenlő), és a túláramvédelem sem.
    Ha ilyenkor testzárlat is van, a hibaáram a földön át folyik, és a FI-relé kiold."""
    fault_on, broken = st["H1"] == "fennáll", st["SZ"] == "szakadt"
    if not broken:
        return {"lamps": {"M1": True}, "consumers": {"M1": "mukodik"},
                "loops": {"H1": "femes" if fault_on else "nincs-hiba"}, "trips": {"Q1": fault_on}, "overcurrent": {"F1": fault_on},
                "touch": {"U1": "lekapcsolasig" if fault_on else "nincs"}}
    return {"lamps": {"M1": False}, "consumers": {"M1": "rendellenes"},
            "loops": {"H1": "fold" if fault_on else "nincs-hiba"}, "trips": {"Q1": fault_on}, "overcurrent": {"F1": False},
            "touch": {"U1": "lekapcsolasig" if fault_on else "tartosan"}}


def tn_c_s():
    comps = [tap("PEN"), electrode("RB", "RB üzemi földelő (a csillagpont földelése)", "TR", "uzemi"),
             {"id": "PSZ", "type": "pen-szetvalaszto", "label": "PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal)",
              "short": "PSZ", "at": "EL",
              "terminals": [term("PEN", "PEN", "PEN (érkező)"), term("N", "N", "N-sín"), term("PE", "PE", "PE-sín")],
              "bridges": [["PEN", "N", "PE"]]},
             electrode("RA", "RA földelő az épületnél (alapföldelő vagy ismételt földelés)", "EL", "vedo"),
             rcd(), mcb1(), consumer1(), fault("H1", "M1"), SOIL]
    wires = [wire("w1", "TR.PEN", "RB.K", "földelővezető", "zöld-sárga"),
             wire("w2", "TR.L1", "Q1.1", "L1", "barna", "S1"),
             wire("w3", "TR.PEN", "PSZ.PEN", "PEN", "zöld-sárga", "S1"),
             wire("w4", "PSZ.N", "Q1.N-be", "N", "kék"),
             wire("w5", "PSZ.PE", "RA.K", "földelővezető", "zöld-sárga"),
             wire("w6", "Q1.2", "F1.1", "L", "barna"),
             wire("w7", "F1.2", "M1.L", "L", "barna", "S2"),
             wire("w8", "Q1.N-ki", "M1.N", "N", "kék", "S2"),
             wire("w9", "PSZ.PE", "M1.PE", "PE", "zöld-sárga", "S2")] + fault_wires(10)
    sel = [("Q1", ["be"]), ("F1", ["be"]), ("H1", ["nincs", "fennáll"]), ("SZ", ["ép", "szakadt"])]
    return {"format": FMT, "id": "foldeles-tn-c-s", "title": "TN-C-S rendszer: PEN a szétválasztási pontig, utána külön N és PE",
            "short": "TN-C-S", "article": "foldelesi-rendszerek", "figure": "abra-3", "version": 1,
            "note": NOTE_COMMON + " A szétválasztási pont helyét és kialakítását az elosztói engedélyes előírásai határozzák meg.",
            "earthing": {"system": "TN-C-S"}, "components": comps, "sections": [SEC_NET, SEC_CIRC], "wires": wires,
            "breaks": [{"id": "SZ", "label": "SZ PEN-szakadás a hálózatban vagy a csatlakozó vezetékben", "wire": "w3",
                        "states": [{"name": "ép"}, {"name": "szakadt", "broken": True}]}],
            "touch": TOUCH,
            "compare": [{"label": "Testzárlat", "states": {"H1": "fennáll"}}, {"label": "PEN-szakadás", "states": {"SZ": "szakadt"}}],
            "truthTable": table(sel, expect_tncs), "places": PLACES,
            "layout": {"view": "bekotes", "viewBox": "0 0 480 240", "parts": {"TR": [20, 40], "RB": [20, 190], "PSZ": [180, 120],
                       "RA": [180, 200], "Q1": [180, 40], "F1": [260, 40], "M1": [400, 60], "H1": [440, 100], "FOLD": [240, 225]},
                       "megjegyzes": "Durva elhelyezés; az útvonalakat az ábramotor adja."}}


# --- TT ---------------------------------------------------------------------------------------------
def expect_tt(st):
    """TT: a fémház PE-je a saját RA földelőn, a csillagpont az RB-n. Testzárlatkor a hibaáram az RA–talaj–RB úton
    (a földön át) tér vissza; a FI-relé kiold, a túláramvédelem nincs fémes hurokban. Ha a földelővezető elszakad, a
    testzárlat nem ad zárt hurkot (a FI nem old ki magától), a fémház tartósan a fázisra kerül; csak az érintő emberen
    át a földbe folyó áram különbözeti áram, ezért a FI-relé legfeljebb erre, az áramütés közben old ki (ha az áram
    eléri a kioldási értékét) – ez nem önműködő lekapcsolás, hanem tartós veszély ([ellenor v1]: „erintesre”)."""
    fault_on, broken = st["H1"] == "fennáll", st["SZ"] == "szakadt"
    if not broken:
        return {"lamps": {"M1": True}, "consumers": {"M1": "mukodik"}, "loops": {"H1": "fold" if fault_on else "nincs-hiba"},
                "trips": {"Q1": fault_on}, "overcurrent": {"F1": False}, "touch": {"U1": "lekapcsolasig" if fault_on else "nincs"}}
    return {"lamps": {"M1": True}, "consumers": {"M1": "mukodik"}, "loops": {"H1": "nincs-hurok" if fault_on else "nincs-hiba"},
            "trips": {"Q1": False}, "overcurrent": {"F1": False}, "touch": {"U1": "erintesre" if fault_on else "nincs"}}


def tt():
    comps = [tap("N"), electrode("RB", "RB üzemi földelő (a csillagpont földelése)", "TR", "uzemi"),
             {"id": "XPE", "type": "pe-sin", "label": "PE-sín (főföldelő sín)", "at": "EL", "terminals": [term("PE", "PE", "PE")]},
             electrode("RA", "RA védőföldelő (az épület saját földelője)", "EL", "vedo"),
             rcd(), mcb1(), consumer1(), fault("H1", "M1"), SOIL]
    wires = [wire("w1", "TR.N", "RB.K", "földelővezető", "zöld-sárga"),
             wire("w2", "TR.L1", "Q1.1", "L1", "barna", "S1"),
             wire("w3", "TR.N", "Q1.N-be", "N", "kék", "S1"),
             wire("w4", "XPE.PE", "RA.K", "földelővezető", "zöld-sárga"),
             wire("w5", "Q1.2", "F1.1", "L", "barna"),
             wire("w6", "F1.2", "M1.L", "L", "barna", "S2"),
             wire("w7", "Q1.N-ki", "M1.N", "N", "kék", "S2"),
             wire("w8", "XPE.PE", "M1.PE", "PE", "zöld-sárga", "S2")] + fault_wires(9)
    sel = [("Q1", ["be"]), ("F1", ["be"]), ("H1", ["nincs", "fennáll"]), ("SZ", ["ép", "szakadt"])]
    return {"format": FMT, "id": "foldeles-tt", "title": "TT rendszer: a fémház a saját földelőn", "short": "TT",
            "article": "foldelesi-rendszerek", "figure": "abra-4", "version": 1, "note": NOTE_COMMON,
            "earthing": {"system": "TT"}, "components": comps, "sections": [SEC_NET, SEC_CIRC], "wires": wires,
            "breaks": [{"id": "SZ", "label": "SZ a védőföldelő vezetőjének szakadása", "wire": "w4",
                        "states": [{"name": "ép"}, {"name": "szakadt", "broken": True}]}],
            "touch": TOUCH,
            "compare": [{"label": "Testzárlat", "states": {"H1": "fennáll"}},
                        {"label": "Testzárlat szakadt földelővezetővel", "states": {"H1": "fennáll", "SZ": "szakadt"}}],
            "truthTable": table(sel, expect_tt), "places": PLACES,
            "layout": {"view": "bekotes", "viewBox": "0 0 480 240", "parts": {"TR": [20, 40], "RB": [20, 190], "XPE": [180, 150],
                       "RA": [180, 205], "Q1": [180, 40], "F1": [260, 40], "M1": [400, 60], "H1": [440, 100], "FOLD": [240, 225]},
                       "megjegyzes": "Durva elhelyezés; az útvonalakat az ábramotor adja."}}


# --- IT ---------------------------------------------------------------------------------------------
def expect_it(st):
    """IT: a csillagpont nincs földelve, a fémházak közös PE-n és földelőn. Első testzárlatkor nincs zárt hurok
    (a földnek nincs vezető kapcsolata a táppont felé), lekapcsolás nem kell, a szigetelésfigyelő jelez. Ha egy
    második testzárlat egy másik fázison is fellép, a hibaáram a két fémházat összekötő PE-n át fémes hurokban
    folyik két fázis között: mindkét túláramvédelem a hurokban van."""
    h1, h2 = st["H1"] == "fennáll", st["H2"] == "fennáll"
    both = h1 and h2
    return {"lamps": {"M1": True, "M2": True}, "consumers": {"M1": "mukodik", "M2": "mukodik"},
            "loops": {"H1": ("femes" if both else "nincs-hurok") if h1 else "nincs-hiba",
                      "H2": ("femes" if both else "nincs-hurok") if h2 else "nincs-hiba"},
            "overcurrent": {"Q1": both, "Q2": both}, "imd": {"SZF": h1 or h2},
            "touch": {"U1": "lekapcsolasig" if both else "nincs"}}


def it():
    comps = [tap("N", label="T1 transzformátor (IT-táppont), kisfeszültségű tekercs"),
             {"id": "SZF", "type": "szigetelesfigyelo", "label": "SZF szigetelésfigyelő", "short": "SZF szigetelésfigyelő", "at": "TR",
              "terminals": [term("A", "L1", "mérőkapocs a hálózaton"), term("PE", "PE", "PE")]},
             {"id": "XPE", "type": "pe-sin", "label": "PE-sín", "at": "TR", "terminals": [term("PE", "PE", "PE")]},
             electrode("RA", "RA védőföldelő (a fémházak közös földelője)", "TR", "vedo"),
             mcb3("Q1", "TR", "Q1 háromfázisú kismegszakító (M1)"), mcb3("Q2", "TR", "Q2 háromfázisú kismegszakító (M2)"),
             consumer3("M1", "M1 háromfázisú fémházas fogyasztó"), consumer3("M2", "M2 háromfázisú fémházas fogyasztó"),
             fault("H1", "M1", "L1", "H1 testzárlat M1-ben (L1 → fémház)"), fault("H2", "M2", "L2", "H2 testzárlat M2-ben (L2 → fémház)"),
             SOIL]
    wires = [wire("w1", "TR.L1", "SZF.A", "L1", "barna"),
             wire("w2", "SZF.PE", "XPE.PE", "PE", "zöld-sárga"),
             wire("w3", "XPE.PE", "RA.K", "földelővezető", "zöld-sárga"),
             wire("w4", "TR.L1", "Q1.1", "L1", "barna"), wire("w5", "TR.L2", "Q1.3", "L2", "fekete"), wire("w6", "TR.L3", "Q1.5", "L3", "szürke"),
             wire("w7", "TR.L1", "Q2.1", "L1", "barna"), wire("w8", "TR.L2", "Q2.3", "L2", "fekete"), wire("w9", "TR.L3", "Q2.5", "L3", "szürke"),
             wire("w10", "Q1.2", "M1.L1", "L1", "barna", "S1"), wire("w11", "Q1.4", "M1.L2", "L2", "fekete", "S1"),
             wire("w12", "Q1.6", "M1.L3", "L3", "szürke", "S1"), wire("w13", "XPE.PE", "M1.PE", "PE", "zöld-sárga", "S1"),
             wire("w14", "Q2.2", "M2.L1", "L1", "barna", "S2"), wire("w15", "Q2.4", "M2.L2", "L2", "fekete", "S2"),
             wire("w16", "Q2.6", "M2.L3", "L3", "szürke", "S2"), wire("w17", "XPE.PE", "M2.PE", "PE", "zöld-sárga", "S2"),
             wire("w18", "H1.a", "M1.L1", "hibahely"), wire("w19", "H1.b", "M1.PE", "hibahely"),
             wire("w20", "H2.a", "M2.L2", "hibahely"), wire("w21", "H2.b", "M2.PE", "hibahely")]
    sel = [("Q1", ["be"]), ("Q2", ["be"]), ("H1", ["nincs", "fennáll"]), ("H2", ["nincs", "fennáll"])]
    places = {"TR": {"label": "IT-táppont és elosztó", "inner": "a táppontnál"}, "M1": {"label": "M1 fogyasztó"},
              "M2": {"label": "M2 fogyasztó"}, "FOLD": {"label": "Föld (talaj)"}}
    return {"format": FMT, "id": "foldeles-it", "title": "IT rendszer: földeletlen táppont, földelt fémházak", "short": "IT",
            "article": "foldelesi-rendszerek", "figure": "abra-5", "version": 1,
            "note": NOTE_COMMON + " IT-rendszer jellemzően saját transzformátorral készül (például ipari üzemben vagy kórházi "
                    "helyiségben); a nullavezetőt itt nem vezetik ki. A szigetelésfigyelő megfigyelő elem: a szimulációban nem vezet.",
            "earthing": {"system": "IT"}, "components": comps,
            "sections": [{"id": "S1", "from": "TR", "to": "M1", "label": "Áramkör M1-hez", "kind": "aramkor"},
                         {"id": "S2", "from": "TR", "to": "M2", "label": "Áramkör M2-höz", "kind": "aramkor"}],
            "wires": wires, "touch": TOUCH,
            "compare": [{"label": "Első testzárlat", "states": {"H1": "fennáll"}},
                        {"label": "Második testzárlat másik fázison", "states": {"H1": "fennáll", "H2": "fennáll"}}],
            "truthTable": table(sel, expect_it), "places": places,
            "layout": {"view": "bekotes", "viewBox": "0 0 480 260", "parts": {"TR": [20, 40], "SZF": [20, 150], "XPE": [180, 170],
                       "RA": [180, 225], "Q1": [180, 30], "Q2": [180, 90], "M1": [380, 30], "M2": [380, 130], "H1": [440, 60],
                       "H2": [440, 160], "FOLD": [260, 245]}, "megjegyzes": "Durva elhelyezés; az útvonalakat az ábramotor adja."}}


# --- EPH --------------------------------------------------------------------------------------------
def expect_eph(st):
    """TN-C-S épület fő EPH-sínnel; a fém vízvezeték a talajjal is érintkezik. U1: a fémház és a vízcsap (egyszerre
    megérinthető), U2: a fémház és a talaj. Ép PEN mellett a testzárlat fémes hurok (Q1, F1); a lekapcsolásig a fémház
    a hibaáram útjában van (U1, U2). PEN-szakadáskor a fogyasztó a földön át, rendellenesen kap áramot, a teljes
    PE-rendszer a talajhoz képest megemelkedik (U2: tartósan veszélyes lehet); EPH-val a vízvezeték ugyanazon a
    potenciálon van, mint a fémház (U1: nincs), EPH nélkül a kettő között veszélyes feszültség lehet. Testzárlat
    PEN-szakadással: a hibaáram a földön át folyik, a FI-relé kiold."""
    bonded, broken, fault_on = st["EPH1"] == "bekötve", st["SZ"] == "szakadt", st["H1"] == "fennáll"
    if not broken:
        return {"lamps": {"M1": True}, "consumers": {"M1": "mukodik"}, "loops": {"H1": "femes" if fault_on else "nincs-hiba"},
                "trips": {"Q1": fault_on}, "overcurrent": {"F1": fault_on},
                "touch": {"U1": "lekapcsolasig" if fault_on else "nincs", "U2": "lekapcsolasig" if fault_on else "nincs"}}
    if fault_on:
        u = "lekapcsolasig"
        return {"lamps": {"M1": False}, "consumers": {"M1": "rendellenes"}, "loops": {"H1": "fold"},
                "trips": {"Q1": True}, "overcurrent": {"F1": False}, "touch": {"U1": u, "U2": u}}
    return {"lamps": {"M1": False}, "consumers": {"M1": "rendellenes"}, "loops": {"H1": "nincs-hiba"},
            "trips": {"Q1": False}, "overcurrent": {"F1": False},
            "touch": {"U1": "nincs" if bonded else "tartosan", "U2": "tartosan"}}


def eph():
    comps = [tap("PEN"), electrode("RB", "RB üzemi földelő (a csillagpont földelése)", "TR", "uzemi"),
             {"id": "PSZ", "type": "pen-szetvalaszto", "label": "PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal)",
              "short": "PSZ", "at": "EL",
              "terminals": [term("PEN", "PEN", "PEN (érkező)"), term("N", "N", "N-sín"), term("PE", "PE", "PE-sín")],
              "bridges": [["PEN", "N", "PE"]]},
             {"id": "MET", "type": "fofoldelo-sin", "label": "Fő EPH-sín (főföldelő sín)", "short": "fő EPH-sín", "at": "EL",
              "terminals": [term("PE", "PE", "gyűjtőkapocs")]},
             electrode("RA", "RA alapföldelő", "EL", "vedo"),
             {"id": "VIZ", "type": "idegen", "label": "VIZ fém vízvezeték (idegen vezetőképes rész)", "short": "vízvezeték", "at": "VIZ",
              "earthContact": True, "bonded": True, "terminals": [term("K", "idegen", "csőbilincs (EPH-kötés)")]},
             rcd(), mcb1(), consumer1("M1", "M1 fémházas mosógép (I. érintésvédelmi osztály)"), fault("H1", "M1"), SOIL]
    wires = [wire("w1", "TR.PEN", "RB.K", "földelővezető", "zöld-sárga"),
             wire("w2", "TR.L1", "Q1.1", "L1", "barna", "S1"),
             wire("w3", "TR.PEN", "PSZ.PEN", "PEN", "zöld-sárga", "S1"),
             wire("w4", "PSZ.N", "Q1.N-be", "N", "kék"),
             wire("w5", "PSZ.PE", "MET.PE", "PE", "zöld-sárga", label="(fő védővezető)"),
             wire("w6", "MET.PE", "RA.K", "földelővezető", "zöld-sárga"),
             wire("w7", "MET.PE", "VIZ.K", "EPH-vezető", "zöld-sárga", "S3"),
             wire("w8", "Q1.2", "F1.1", "L", "barna"),
             wire("w9", "F1.2", "M1.L", "L", "barna", "S2"),
             wire("w10", "Q1.N-ki", "M1.N", "N", "kék", "S2"),
             wire("w11", "MET.PE", "M1.PE", "PE", "zöld-sárga", "S2")] + fault_wires(12)
    sel = [("Q1", ["be"]), ("F1", ["be"]), ("H1", ["nincs", "fennáll"]), ("EPH1", ["bekötve", "hiányzik"]), ("SZ", ["ép", "szakadt"])]
    places = dict(PLACES)
    places["EL"] = {"label": "Épület: csatlakozás, PEN-szétválasztás, fő EPH-sín, elosztó", "inner": "elosztón belül"}
    places["VIZ"] = {"label": "Vízvezeték (belépés és csaptelep)"}
    return {"format": FMT, "id": "eph-alapok", "title": "Egyenpotenciálra hozás: a fő EPH-sín és a vízvezeték bekötése (TN-C-S)",
            "short": "EPH", "article": "egyenpotencialra-hozas-eph", "figure": "abra-1", "version": 1,
            "note": NOTE_COMMON + " A fém vízvezeték az épületbe a talajból lép be, ezért a szimulációban a talajjal is "
                    "érintkezik. A gázvezeték bekötését az elosztói és a gázszolgáltatói előírások szabályozzák; az ábra nem "
                    "mutatja.",
            "earthing": {"system": "TN-C-S"}, "components": comps,
            "sections": [SEC_NET, SEC_CIRC, {"id": "S3", "from": "EL", "to": "VIZ", "label": "Fő EPH-vezető a vízvezetékhez", "kind": "eph"}],
            "wires": wires,
            "breaks": [{"id": "EPH1", "label": "EPH1 a vízvezeték EPH-bekötése", "wire": "w7",
                        "states": [{"name": "bekötve"}, {"name": "hiányzik", "broken": True}]},
                       {"id": "SZ", "label": "SZ PEN-szakadás a hálózatban", "wire": "w3",
                        "states": [{"name": "ép"}, {"name": "szakadt", "broken": True}]}],
            "touch": [{"id": "U1", "label": "M1 fémháza és a vízcsap", "a": "M1.PE", "b": "VIZ.K"},
                      {"id": "U2", "label": "M1 fémháza és a föld", "a": "M1.PE", "b": "FOLD.E"}],
            "truthTable": table(sel, expect_eph), "places": places,
            "layout": {"view": "bekotes", "viewBox": "0 0 500 260", "parts": {"TR": [20, 40], "RB": [20, 200], "PSZ": [170, 110],
                       "MET": [170, 170], "RA": [170, 230], "VIZ": [420, 210], "Q1": [170, 40], "F1": [250, 40], "M1": [400, 60],
                       "H1": [450, 100], "FOLD": [300, 245]}, "megjegyzes": "Durva elhelyezés; az útvonalakat az ábramotor adja."}}


if __name__ == "__main__":
    for slug, fn in [("foldelesi-rendszerek-tn-c", tn_c), ("foldelesi-rendszerek-tn-s", tn_s), ("foldelesi-rendszerek-tn-c-s", tn_c_s),
                     ("foldelesi-rendszerek-tt", tt), ("foldelesi-rendszerek-it", it), ("egyenpotencialra-hozas-eph", eph)]:
        print(save(slug, fn()))
