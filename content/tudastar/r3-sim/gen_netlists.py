#!/usr/bin/env python3
"""A kapcsolások témacsoport netlistáinak előállítása (101, 102, 105, 106, 106+6, 107 ×1–4).

A truthTable a FUNKCIONÁLIS előírásból készül (pl. váltókapcsolásnál: a lámpa akkor ég, ha a két kapcsoló
ugyanarra a váltóvezetékre áll; keresztkapcsolónál az állások paritása), NEM a vezetékgráfból – így a
sim.py gráfalapú számítása független ellenőrzés. Kimenet: ../r3/<slug>.netlist.json
"""
import itertools
import json
import os
import sys

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "r3")

PLAN_ROLE = {"L": "L", "kapcsolt fázis": "Lk", "N": "N", "kapcsolt nulla": "Nk", "PE": "PE", "áthidaló": "L"}


class NL:
    def __init__(self, nid, title, article, short, note):
        self.d = {"format": "kb-netlista/1", "id": nid, "title": title, "short": short, "article": article, "figure": "abra-1",
                  "version": 1, "note": note, "components": [], "sections": [], "wires": [], "truthTable": []}
        self.layout = {}

    def comp(self, cid, ctype, label, terms, symbol=None, states=None, keys=None, at=None, pos=None, **extra):
        c = {"id": cid, "type": ctype, "label": label}
        if symbol:
            c["symbol"] = symbol
        if at:
            c["at"] = at
        c.update(extra)
        c["terminals"] = [{"id": t[0], "role": t[1], "label": t[2]} for t in terms]
        if states is not None:
            c["states"] = states
        if keys is not None:
            c["keys"] = keys
        self.d["components"].append(c)
        if pos:
            self.layout[cid] = pos
        return c

    def sec(self, sid, frm, to, label, kind):
        self.d["sections"].append({"id": sid, "from": frm, "to": to, "label": label, "kind": kind})

    def wire(self, frm, to, conductor, color, section, role=None, label=None):
        w = {"id": f"w{len(self.d['wires']) + 1}", "from": frm, "to": to, "conductor": conductor,
             "role": role or PLAN_ROLE[conductor], "color": color}
        if label:
            w["label"] = label
        if section is not None:
            w["section"] = section
        self.d["wires"].append(w)

    def truth(self, fn):
        sels = []
        for c in self.d["components"]:
            if "states" in c:
                sels.append((c["id"], [s["name"] for s in c["states"]]))
            for k in c.get("keys", []):
                sels.append((f"{c['id']}.{k['id']}", [s["name"] for s in k["states"]]))
        for prod in itertools.product(*[n for _, n in sels]):
            st = {sid: v for (sid, _), v in zip(sels, prod)}
            self.d["truthTable"].append({"states": st, "lamps": fn(st)})

    def save(self, slug, view_box):
        self.d["layout"] = {"view": "bekotes", "viewBox": view_box, "parts": self.layout,
                            "megjegyzes": "Durva elhelyezés a Bekötés nézethez; a vezetékútvonalat (path) az ábramotor vagy a rajzoló adja."}
        p = os.path.join(OUT, slug + ".netlist.json")
        with open(p, "w", encoding="utf-8") as fh:
            json.dump(self.d, fh, ensure_ascii=False, indent=1)
            fh.write("\n")
        return p


# --- közös építőelemek -------------------------------------------------------------------------------
def tap(n, pos=(20, 40)):
    n.comp("T", "tap", "Betáp", [("L", "L", "L"), ("N", "N", "N"), ("PE", "PE", "PE")], symbol="panel", pos=list(pos),
           megjegyzes="Az áramkör betápja az elosztóból, a kismegszakító és az áram-védőkapcsoló (FI-relé) után.")


def lamp(n, cid, label, at=None, pos=None):
    n.comp(cid, "lampa", label, [("L", "L", "L (fázis)"), ("N", "N", "N"), ("PE", "PE", "PE")],
           symbol="light", at=at, pos=list(pos) if pos else None, **{"class": "I"})


SW101 = [{"name": "ki", "connect": []}, {"name": "be", "connect": [["L", "1"]]}]
SW106 = [{"name": "0", "label": "közös–1", "connect": [["C", "1"]]}, {"name": "1", "label": "közös–2", "connect": [["C", "2"]]}]
SW107 = [{"name": "egyenes", "label": "A1–B1, A2–B2", "connect": [["A1", "B1"], ["A2", "B2"]]},
         {"name": "keresztezett", "label": "A1–B2, A2–B1", "connect": [["A1", "B2"], ["A2", "B1"]]}]


def sw106(n, cid, label, pos):
    n.comp(cid, "kapcsolo-106", label, [("C", "kozos", "közös kapocs (C)"), ("1", "valto-1", "1-es kapocs"), ("2", "valto-2", "2-es kapocs")],
           symbol="switch6", states=SW106, pos=list(pos))


def sw107(n, cid, label, pos):
    n.comp(cid, "kapcsolo-107", label, [("A1", "valto-1", "A1 (bemenő pár)"), ("A2", "valto-2", "A2 (bemenő pár)"),
                                         ("B1", "valto-1", "B1 (kimenő pár)"), ("B2", "valto-2", "B2 (kimenő pár)")],
           symbol="switch7", states=SW107, pos=list(pos))


NOTE = ("Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, "
        "szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; "
        "a gyártói útmutató az irányadó.")


# --- 101 --------------------------------------------------------------------------------------------
def n101():
    n = NL("egypolusu-kapcsolo-101", "Egypólusú kapcsoló (101): egy lámpa egy helyről", "egypolusu-kapcsolo-101-bekotese", "101 – egy hely", NOTE)
    tap(n)
    n.comp("KD", "kotodoboz", "Kötődoboz", [("L", "L", "L-kötés"), ("N", "N", "N-kötés"), ("PE", "PE", "PE-kötés"), ("LK", "kapcsolt", "kapcsoltfázis-kötés")],
           symbol="box", pos=[180, 40])
    n.comp("S1", "kapcsolo-101", "Kapcsoló (101)", [("L", "L", "L kapocs (betáp)"), ("1", "kapcsolt", "1-es kapocs (kimenet)")],
           symbol="switch1", states=SW101, pos=[180, 190])
    lamp(n, "E1", "Lámpa", pos=(320, 40))
    n.sec("W0", "T", "KD", "Elosztó – kötődoboz", "betap")
    n.sec("W1", "KD", "S1", "Kötődoboz – kapcsoló", "kapcsolo")
    n.sec("W2", "KD", "E1", "Kötődoboz – lámpa", "lampa")
    n.wire("T.L", "KD.L", "L", "barna", "W0")
    n.wire("T.N", "KD.N", "N", "kék", "W0")
    n.wire("T.PE", "KD.PE", "PE", "zöld-sárga", "W0")
    n.wire("KD.L", "S1.L", "L", "barna", "W1")
    n.wire("S1.1", "KD.LK", "kapcsolt fázis", "fekete", "W1")
    n.wire("KD.LK", "E1.L", "kapcsolt fázis", "fekete", "W2")
    n.wire("KD.N", "E1.N", "N", "kék", "W2")
    n.wire("KD.PE", "E1.PE", "PE", "zöld-sárga", "W2")
    n.truth(lambda s: {"E1": s["S1"] == "be"})
    return n.save("egypolusu-kapcsolo-101-bekotese", "0 0 360 240")


# --- 102 --------------------------------------------------------------------------------------------
def n102():
    n = NL("ketpolusu-kapcsolo-102", "Kétpólusú kapcsoló (102): a fázis- és a nullavezető együttes bontása", "ketpolusu-kapcsolo-102-bekotese",
           "102 – két pólus", NOTE + " Ebben a változatban a betáp a kapcsolódobozon át megy a fogyasztóhoz; a védővezető a kapcsolódobozban, "
           "kapcsolón kívül, vezetékösszekötővel folytatódik. A fogyasztóhoz háromeres kábel megy, ezért itt – a fenti kiosztástól "
           "eltérően – a kapcsolt fázis barna, a kapcsolt nulla kék.")
    tap(n)
    n.comp("S1", "kapcsolo-102", "Kapcsoló (102)", [("L", "L", "L kapocs (betáp)"), ("N", "N", "N kapocs (betáp)"),
                                                     ("1", "kapcsolt", "L kimenet"), ("2", "kapcsolt-N", "N kimenet")],
           symbol="switch2", states=[{"name": "ki", "connect": []}, {"name": "be", "connect": [["L", "1"], ["N", "2"]]}], pos=[180, 190])
    n.comp("PB", "kotoelem", "Kapcsolódoboz", [("PE", "PE", "PE-összekötő")], at="S1", pos=[180, 150])
    lamp(n, "E1", "Lámpa (vagy más fogyasztó)", pos=(320, 40))
    n.sec("W0", "T", "S1", "Betáp – kapcsolódoboz", "kapcsolo")
    n.sec("W1", "S1", "E1", "Kapcsolódoboz – lámpa", "lampa")
    n.wire("T.L", "S1.L", "L", "barna", "W0")
    n.wire("T.N", "S1.N", "N", "kék", "W0")
    n.wire("T.PE", "PB.PE", "PE", "zöld-sárga", "W0")
    n.wire("S1.1", "E1.L", "kapcsolt fázis", "barna", "W1")
    n.wire("S1.2", "E1.N", "kapcsolt nulla", "kék", "W1")
    n.wire("PB.PE", "E1.PE", "PE", "zöld-sárga", "W1")
    n.d["checks"] = {"allPoleDisconnect": ["E1"]}
    n.truth(lambda s: {"E1": s["S1"] == "be"})
    return n.save("ketpolusu-kapcsolo-102-bekotese", "0 0 360 240")


# --- 105 --------------------------------------------------------------------------------------------
def n105():
    n = NL("csillarkapcsolo-105", "Csillárkapcsoló (105): két lámpakör egy helyről", "csillarkapcsolo-105-bekotese", "105 – két kör",
           NOTE + " A két kapcsolt fázis itt: 1. kör fekete, 2. kör szürke (felirattal).")
    tap(n)
    n.comp("KD", "kotodoboz", "Kötődoboz", [("L", "L", "L-kötés"), ("N", "N", "N-kötés"), ("PE", "PE", "PE-kötés"),
                                            ("LK1", "kapcsolt", "1. kör kapcsoltfázis-kötése"), ("LK2", "kapcsolt", "2. kör kapcsoltfázis-kötése")],
           symbol="box", pos=[180, 40])
    key = lambda k, lab, t: {"id": k, "label": lab, "states": [{"name": "ki", "connect": []}, {"name": "be", "connect": [["L", t]]}]}
    n.comp("S1", "kapcsolo-105", "Csillárkapcsoló (105)", [("L", "L", "L kapocs (közös betáp)"), ("1", "kapcsolt", "1-es kapocs (1. kör)"),
                                                           ("2", "kapcsolt", "2-es kapocs (2. kör)")],
           symbol="switch5", keys=[key("b1", "1. billentyű", "1"), key("b2", "2. billentyű", "2")], pos=[180, 190])
    n.comp("CS", "sorkapocs", "Csillár sorkapcsa", [("1", "kapcsolt", "1"), ("2", "kapcsolt", "2"), ("N", "N", "N"), ("PE", "PE", "PE")],
           symbol="light", pos=[320, 40])
    lamp(n, "E1", "1. lámpacsoport", at="CS", pos=(300, 110))
    lamp(n, "E2", "2. lámpacsoport", at="CS", pos=(340, 110))
    n.sec("W0", "T", "KD", "Elosztó – kötődoboz", "betap")
    n.sec("W1", "KD", "S1", "Kötődoboz – kapcsoló", "kapcsolo")
    n.sec("W2", "KD", "CS", "Kötődoboz – csillár", "lampa")
    n.wire("T.L", "KD.L", "L", "barna", "W0")
    n.wire("T.N", "KD.N", "N", "kék", "W0")
    n.wire("T.PE", "KD.PE", "PE", "zöld-sárga", "W0")
    n.wire("KD.L", "S1.L", "L", "barna", "W1")
    n.wire("S1.1", "KD.LK1", "kapcsolt fázis", "fekete", "W1", label="1")
    n.wire("S1.2", "KD.LK2", "kapcsolt fázis", "szürke", "W1", label="2")
    n.wire("KD.LK1", "CS.1", "kapcsolt fázis", "fekete", "W2", label="1")
    n.wire("KD.LK2", "CS.2", "kapcsolt fázis", "szürke", "W2", label="2")
    n.wire("KD.N", "CS.N", "N", "kék", "W2")
    n.wire("KD.PE", "CS.PE", "PE", "zöld-sárga", "W2")
    # a csillár belső vezetékezése (gyári)
    n.wire("CS.1", "E1.L", "kapcsolt fázis", "fekete", None, label="1")
    n.wire("CS.2", "E2.L", "kapcsolt fázis", "szürke", None, label="2")
    n.wire("CS.N", "E1.N", "N", "kék", None)
    n.wire("CS.N", "E2.N", "N", "kék", None)
    n.wire("CS.PE", "E1.PE", "PE", "zöld-sárga", None)
    n.wire("CS.PE", "E2.PE", "PE", "zöld-sárga", None)
    n.truth(lambda s: {"E1": s["S1.b1"] == "be", "E2": s["S1.b2"] == "be"})
    return n.save("csillarkapcsolo-105-bekotese", "0 0 380 240")


# --- 106 --------------------------------------------------------------------------------------------
def n106():
    n = NL("valtokapcsolo-106", "Váltókapcsolás (2 × 106): egy lámpa két helyről", "valtokapcsolo-106-bekotese", "106 – két hely", NOTE)
    tap(n)
    n.comp("KD", "kotodoboz", "Kötődoboz", [("L", "L", "L-kötés"), ("N", "N", "N-kötés"), ("PE", "PE", "PE-kötés"),
                                            ("K1", "valto-1", "1-es váltóvezeték kötése"), ("K2", "valto-2", "2-es váltóvezeték kötése"),
                                            ("LK", "kapcsolt", "kapcsoltfázis-kötés")], symbol="box", pos=[180, 40])
    sw106(n, "S1", "K1 (A hely)", (100, 190))
    sw106(n, "S2", "K2 (B hely)", (260, 190))
    lamp(n, "E1", "Lámpa", pos=(320, 40))
    n.sec("W0", "T", "KD", "Elosztó – kötődoboz", "betap")
    n.sec("W1", "KD", "S1", "Kötődoboz – K1 (A hely)", "kapcsolo")
    n.sec("W2", "KD", "S2", "Kötődoboz – K2 (B hely)", "kapcsolo")
    n.sec("W3", "KD", "E1", "Kötődoboz – lámpa", "lampa")
    n.wire("T.L", "KD.L", "L", "barna", "W0")
    n.wire("T.N", "KD.N", "N", "kék", "W0")
    n.wire("T.PE", "KD.PE", "PE", "zöld-sárga", "W0")
    n.wire("KD.L", "S1.C", "L", "barna", "W1")
    n.wire("S1.1", "KD.K1", "váltóvezeték", "szürke", "W1", role="K1", label="1")
    n.wire("S1.2", "KD.K2", "váltóvezeték", "szürke", "W1", role="K2", label="2")
    n.wire("KD.K1", "S2.1", "váltóvezeték", "szürke", "W2", role="K1", label="1")
    n.wire("KD.K2", "S2.2", "váltóvezeték", "szürke", "W2", role="K2", label="2")
    n.wire("S2.C", "KD.LK", "kapcsolt fázis", "fekete", "W2")
    n.wire("KD.LK", "E1.L", "kapcsolt fázis", "fekete", "W3")
    n.wire("KD.N", "E1.N", "N", "kék", "W3")
    n.wire("KD.PE", "E1.PE", "PE", "zöld-sárga", "W3")
    # Funkcionális előírás: a lámpa akkor ég, ha a két kapcsoló ugyanarra a váltóvezetékre áll.
    n.truth(lambda s: {"E1": s["S1"] == s["S2"]})
    return n.save("valtokapcsolo-106-bekotese", "0 0 360 240")


# --- 106+6 ------------------------------------------------------------------------------------------
def n1066():
    n = NL("kettos-valtokapcsolo-106-6", "Kettős váltókapcsoló (106+6): két lámpa, mindkettő két helyről", "kettos-valtokapcsolo-106-6-bekotese",
           "106+6 – két kör, két hely",
           NOTE + " A két billentyű közös kapcsát (C1, C2) itt az A helyen áthidaló köti ugyanarra a fázisra; ahol a gyártó a két közös kapcsot "
           "belül összeköti, az áthidaló elmarad. A váltóvezetékek: 1a, 2a (1. kör) és 1b, 2b (2. kör).")
    tap(n)
    n.comp("KD", "kotodoboz", "Kötődoboz", [("L", "L", "L-kötés"), ("N", "N", "N-kötés"), ("PE", "PE", "PE-kötés"),
                                            ("K1A", "valto-1", "1a váltóvezeték kötése"), ("K2A", "valto-2", "2a váltóvezeték kötése"),
                                            ("K1B", "valto-1", "1b váltóvezeték kötése"), ("K2B", "valto-2", "2b váltóvezeték kötése"),
                                            ("LK1", "kapcsolt", "1. lámpa kapcsoltfázis-kötése"), ("LK2", "kapcsolt", "2. lámpa kapcsoltfázis-kötése")],
           symbol="box", pos=[180, 40])

    def dbl(cid, label, pos):
        mk = lambda c, t1, t2: [{"name": "0", "label": f"{c}–{t1}", "connect": [[c, t1]]}, {"name": "1", "label": f"{c}–{t2}", "connect": [[c, t2]]}]
        n.comp(cid, "kapcsolo-106-6", label,
               [("C1", "kozos", "1. billentyű közös kapcsa (C1)"), ("1a", "valto-1", "1a kapocs"), ("2a", "valto-2", "2a kapocs"),
                ("C2", "kozos", "2. billentyű közös kapcsa (C2)"), ("1b", "valto-1", "1b kapocs"), ("2b", "valto-2", "2b kapocs")],
               symbol="switch6", keys=[{"id": "b1", "label": "1. billentyű", "states": mk("C1", "1a", "2a")},
                                       {"id": "b2", "label": "2. billentyű", "states": mk("C2", "1b", "2b")}], pos=list(pos))
    dbl("S1", "K1 (A hely)", (100, 190))
    dbl("S2", "K2 (B hely)", (260, 190))
    lamp(n, "E1", "1. lámpa", pos=(300, 30))
    lamp(n, "E2", "2. lámpa", pos=(340, 80))
    n.sec("W0", "T", "KD", "Elosztó – kötődoboz", "betap")
    n.sec("W1", "KD", "S1", "Kötődoboz – K1 (A hely)", "kapcsolo")
    n.sec("W2", "KD", "S2", "Kötődoboz – K2 (B hely)", "kapcsolo")
    n.sec("W3", "KD", "E1", "Kötődoboz – 1. lámpa", "lampa")
    n.sec("W4", "KD", "E2", "Kötődoboz – 2. lámpa", "lampa")
    n.wire("T.L", "KD.L", "L", "barna", "W0")
    n.wire("T.N", "KD.N", "N", "kék", "W0")
    n.wire("T.PE", "KD.PE", "PE", "zöld-sárga", "W0")
    n.wire("KD.L", "S1.C1", "L", "barna", "W1")
    n.wire("S1.C1", "S1.C2", "áthidaló", "barna", None)
    n.wire("S1.1a", "KD.K1A", "váltóvezeték", "szürke", "W1", role="K1", label="1a")
    n.wire("S1.2a", "KD.K2A", "váltóvezeték", "szürke", "W1", role="K2", label="2a")
    n.wire("S1.1b", "KD.K1B", "váltóvezeték", "szürke", "W1", role="K1", label="1b")
    n.wire("S1.2b", "KD.K2B", "váltóvezeték", "szürke", "W1", role="K2", label="2b")
    n.wire("KD.K1A", "S2.1a", "váltóvezeték", "szürke", "W2", role="K1", label="1a")
    n.wire("KD.K2A", "S2.2a", "váltóvezeték", "szürke", "W2", role="K2", label="2a")
    n.wire("KD.K1B", "S2.1b", "váltóvezeték", "szürke", "W2", role="K1", label="1b")
    n.wire("KD.K2B", "S2.2b", "váltóvezeték", "szürke", "W2", role="K2", label="2b")
    n.wire("S2.C1", "KD.LK1", "kapcsolt fázis", "fekete", "W2", label="1")
    n.wire("S2.C2", "KD.LK2", "kapcsolt fázis", "fekete", "W2", label="2")
    n.wire("KD.LK1", "E1.L", "kapcsolt fázis", "fekete", "W3", label="1")
    n.wire("KD.N", "E1.N", "N", "kék", "W3")
    n.wire("KD.PE", "E1.PE", "PE", "zöld-sárga", "W3")
    n.wire("KD.LK2", "E2.L", "kapcsolt fázis", "fekete", "W4", label="2")
    n.wire("KD.N", "E2.N", "N", "kék", "W4")
    n.wire("KD.PE", "E2.PE", "PE", "zöld-sárga", "W4")
    n.truth(lambda s: {"E1": s["S1.b1"] == s["S2.b1"], "E2": s["S1.b2"] == s["S2.b2"]})
    return n.save("kettos-valtokapcsolo-106-6-bekotese", "0 0 380 240")


# --- 107 (n darab) ------------------------------------------------------------------------------------
def n107(count):
    places = count + 2
    suffix = "" if count == 1 else f"-{count}x107"
    title = f"Keresztkapcsolás (106 + {count} × 107 + 106): egy lámpa {places} helyről" if count > 1 else \
        "Keresztkapcsolás (106 + 107 + 106): egy lámpa három helyről"
    n = NL(f"keresztkapcsolo-107{suffix}", title, "keresztkapcsolo-107-bekotese",
           f"107 – {places} hely", NOTE + " A keresztkapcsoló bemenő párja (A1, A2) az előző, kimenő párja (B1, B2) a következő kapcsoló felé néz; "
           "a kapcsok elrendezése gyártónként eltér.")
    tap(n)
    letters = "abcdefg"
    kd_terms = [("L", "L", "L-kötés"), ("N", "N", "N-kötés"), ("PE", "PE", "PE-kötés")]
    for i in range(count + 1):
        kd_terms += [(f"K1{letters[i]}", "valto-1", f"1{letters[i]} váltóvezeték kötése"), (f"K2{letters[i]}", "valto-2", f"2{letters[i]} váltóvezeték kötése")]
    kd_terms.append(("LK", "kapcsolt", "kapcsoltfázis-kötés"))
    n.comp("KD", "kotodoboz", "Kötődoboz", kd_terms, symbol="box", pos=[180, 40])
    width = 300
    xs = [30 + round(width * i / (places - 1)) for i in range(places)]
    sw106(n, "S1", "K1 (106, 1. hely)", (xs[0], 190))
    for i in range(count):
        sw107(n, f"X{i + 1}", f"X{i + 1} (107, {i + 2}. hely)", (xs[i + 1], 190))
    sw106(n, "S2", f"K2 (106, {places}. hely)", (xs[-1], 190))
    lamp(n, "E1", "Lámpa", pos=(330, 40))
    n.sec("W0", "T", "KD", "Elosztó – kötődoboz", "betap")
    n.sec("WS1", "KD", "S1", "Kötődoboz – K1 (1. hely)", "kapcsolo")
    for i in range(count):
        n.sec(f"WX{i + 1}", "KD", f"X{i + 1}", f"Kötődoboz – X{i + 1} ({i + 2}. hely)", "kapcsolo")
    n.sec("WS2", "KD", "S2", f"Kötődoboz – K2 ({places}. hely)", "kapcsolo")
    n.sec("WE", "KD", "E1", "Kötődoboz – lámpa", "lampa")
    n.wire("T.L", "KD.L", "L", "barna", "W0")
    n.wire("T.N", "KD.N", "N", "kék", "W0")
    n.wire("T.PE", "KD.PE", "PE", "zöld-sárga", "W0")
    n.wire("KD.L", "S1.C", "L", "barna", "WS1")
    n.wire("S1.1", "KD.K1a", "váltóvezeték", "szürke", "WS1", role="K1", label="1a")
    n.wire("S1.2", "KD.K2a", "váltóvezeték", "szürke", "WS1", role="K2", label="2a")
    for i in range(count):
        a, b = letters[i], letters[i + 1]
        x = f"X{i + 1}"
        n.wire(f"KD.K1{a}", f"{x}.A1", "váltóvezeték", "szürke", f"WX{i + 1}", role="K1", label="1" + a)
        n.wire(f"KD.K2{a}", f"{x}.A2", "váltóvezeték", "szürke", f"WX{i + 1}", role="K2", label="2" + a)
        n.wire(f"{x}.B1", f"KD.K1{b}", "váltóvezeték", "szürke", f"WX{i + 1}", role="K1", label="1" + b)
        n.wire(f"{x}.B2", f"KD.K2{b}", "váltóvezeték", "szürke", f"WX{i + 1}", role="K2", label="2" + b)
    last = letters[count]
    n.wire(f"KD.K1{last}", "S2.1", "váltóvezeték", "szürke", "WS2", role="K1", label="1" + last)
    n.wire(f"KD.K2{last}", "S2.2", "váltóvezeték", "szürke", "WS2", role="K2", label="2" + last)
    n.wire("S2.C", "KD.LK", "kapcsolt fázis", "fekete", "WS2")
    n.wire("KD.LK", "E1.L", "kapcsolt fázis", "fekete", "WE")
    n.wire("KD.N", "E1.N", "N", "kék", "WE")
    n.wire("KD.PE", "E1.PE", "PE", "zöld-sárga", "WE")

    # Funkcionális előírás: az első váltó a fázist az 1. (0 állás) vagy a 2. (1 állás) vezetékre teszi; minden keresztezett
    # keresztkapcsoló felcseréli a párt; a lámpa akkor ég, ha az utolsó váltó ugyanarra a vezetékre áll → paritás.
    def fn(s):
        par = int(s["S1"]) + int(s["S2"]) + sum(1 for i in range(count) if s[f"X{i + 1}"] == "keresztezett")
        return {"E1": par % 2 == 0}

    n.truth(fn)
    return n.save("keresztkapcsolo-107-bekotese" + suffix, "0 0 380 240")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    paths = [n101(), n102(), n105(), n106(), n1066()] + [n107(k) for k in (1, 2, 3, 4)]
    for p in paths:
        print(os.path.relpath(p, OUT))
    sys.exit(0)
