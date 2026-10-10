#!/usr/bin/env python3
"""Villanyszerelő Tudástár – R3 kapcsolási netlista-szimulátor (lektori vázlatokhoz).

Beolvassa a bekötési ábrák netlistáit (<slug>.netlist.json), MINDEN kapcsolóállás-kombinációra
gráf-összefüggőséggel (union-find) kiszámolja, hogy a fogyasztók (lámpák) két üzemi kapcsa a betáp
L-, illetve N-kapcsához csatlakozik-e, összeveti az eredményt a netlista truthTable-jével, és
ellenőrzi a biztonsági invariánsokat.

Netlista-formátum (kb-netlista/1) – a feladatleírás formátuma, visszafelé kompatibilis bővítésekkel:
  {"id","title", "components":[{"id","type","terminals":[{"id","role"}], "states"?:[{"name","connect":[[a,b],...]}]}],
   "wires":[{"from":"comp.term","to":"comp.term","conductor","color"}], "truthTable":[{"states":{...},"lamps":{...}}]}
Opcionális bővítések (mind elhagyható):
  component.keys      – több billentyűs szerelvény (105, 106+6): [{"id","label","states":[...]}]; választó-azonosító: "<comp>.<key>"
  component.bridges   – állandó belső összeköttetés (pl. sín): [["t1","t2",...], ...]
  component.at        – hely (doboz) azonosítója a szakaszokhoz; alapértelmezés: a komponens id-je
  component.class     – "II" esetén a fogyasztónak nem kell PE-kapocs (alapértelmezés: I. osztály, fémtest)
  component.label, terminal.label, state.label, symbol, layout – csak megjelenítés
  wire.id, wire.role (a terv 3.4 szerinti szerepkód: L|Lk|K1|K2|N|Nk|PE), wire.section, wire.label
  sections            – kábel-/védőcsőszakaszok: [{"id","from":<hely>,"to":<hely>,"label","kind"}] → érszám
  checks.allPoleDisconnect – fogyasztók, amelyeknél kikapcsolva a fázis- ÉS a nullavezető is bontva van (102)
Védelmi bővítés (v1, visszafelé kompatibilis; csak az alábbi típusoknál/kulcsoknál lép működésbe):
  type "fi-rele" + "poles":[[tápkapocs, terheléskapocs],...] – áram-védőkapcsoló: minden állásban kiszámolja, folyik-e
      különbözeti áram (a védett zónából a pólusokat megkerülve) → truthTable[].trips {"<FI>": bool}
  type "dugalj" – kimenet: L-kapcsa fázison ÉS N-kapcsa nullán → truthTable[].outlets {"<dugalj>": bool}
      (v4: a feszültség alatti dugalj a különbözetiáram-számításban csatlakoztatott fogyasztónak számít)
  type "ember" / "hibaut" (állapot: {"name","active":bool}, első állapot = normál üzem), "ellenallas" – impedancia,
      nem köt össze hálózatot; vezet, ha egyik kapcsa fázison, a másik nullán/PE-n/földön → truthTable[].currents
  type "fold" (kapocsszerep "E") – a talaj mint visszavezető potenciál; type "nyomogomb" (pl. FI próbagomb)
  component.scenario – true: hibahelyzet/próbagomb választó (első állapota a normál üzem)
  conductor "belső" | "érintés" | "hibahely" – nem valódi ér (készüléken belüli kötés, érintési pont, hibahely):
      szín és szakasz nélkül, a vezetéktáblában nem jelenik meg
  Új invariánsok: I11 – normál üzemben (minden scenario-választó az első állapotában) nincs különbözeti áram;
  I12 – a védett oldal nem kerülheti meg a FI-relé pólusait (pl. a védett kör nullája a FI előtti nullán);
  I6 a kismegszakítóra és a nyomógombra is (egypólusú készülék kapcsa soha nem nulla); az N-folytonosság (I7) csak
  azokban az állásokban követelmény, amelyekben minden FI-relé be van kapcsolva (a kétpólusú FI a nullát is bontja).
  places (v3, opcionális) – helyek feliratai: {"<hely>": {"label", "inner"}}; az "inner" a helyen belüli vezetékek
      szakaszcellája a vezetéktáblában (pl. „elosztón belül”; alapértelmezés: „dobozon belül”)
  Markdown-blokk: <!-- sim:allapotok src=... tomor --> – az egyenértékű sorok „bármely” állással összevonva
  (az összevonást a szimulátor visszabontva ellenőrzi).
Független biztonsági ellenőr bővítése (v1, visszafelé kompatibilis; a meglévő netlisták eredménye nem változik):
  S8  – a kapcsoló belső modellje a típusának megfelelő-e (101: egy nyitó-záró érintkező két állással; 102: két, együtt
        mozgó pólus, egy fázis- és egy nullaoldali kapocspárral; 105: két billentyű közös betápkapoccsal; 106: két állás,
        a közös kapocs hol az egyik, hol a másik kimenettel; 106-6: két független 106-os billentyű diszjunkt kapcsokkal;
        107: két állás, mindkettő a négy kapocs teljes párosítása, a kettő különböző). Enélkül egy hiányos vagy
        fizikailag lehetetlen állásmodell – a hozzá igazított truthTable-lel – elrejthetné a hiányzó állás zárlatát.
  I14 – több betápnál (több áramkör): két áramkör nullavezetője nem köthető össze, és egy fogyasztó fázisa és nullája
        csak ugyanabból az áramkörből jöhet (kölcsönvett nulla tilos). Két áramkör védővezetője közös lehet (ez nem I1).

Használat:
  python3 sim.py <netlista.json>...            jelentés, kilépési kód 1, ha bármelyik FAIL
  python3 sim.py --json <netlista.json>...     géppel olvasható jelentés
  python3 sim.py --md <netlista.json>          a cikkbe szánt táblázatok (állások, vezetékek, szakaszok)
  python3 sim.py --check-article <cikk.md>...  a cikk <!-- sim:... --> blokkjai egyeznek-e a szimuláció kimenetével
  python3 sim.py --update-article <cikk.md>... a blokkok újragenerálása a szimuláció kimenetéből
"""
from __future__ import annotations

import argparse
import itertools
import json
import os
import re
import sys

FORMAT = "kb-netlista/1"

# --- szótár -------------------------------------------------------------------------------------
SOURCE_TYPES = {"tap"}
LOAD_TYPES = {"lampa", "fogyaszto"}
SWITCH_PREFIX = "kapcsolo-"
# Kapcsolók, amelyek a nullavezetőt is kapcsolhatják (a fázisvezetővel együtt) – a cikk ezt kifejezetten tárgyalja.
MULTIPOLE_SWITCH_TYPES = {"kapcsolo-102", "kapcsolo-103"}
KNOWN_TYPES = SOURCE_TYPES | LOAD_TYPES | {
    "kapcsolo-101", "kapcsolo-102", "kapcsolo-103", "kapcsolo-105", "kapcsolo-106", "kapcsolo-106-6", "kapcsolo-107",
    "kotodoboz", "kotoelem", "sorkapocs", "kismegszakito", "fi-rele", "pe-sin", "n-sin", "dugalj",
}
PHASE_SOURCE_ROLES = {"L", "L1", "L2", "L3"}
# kapocsszerep → vezetőosztály
ROLE_CLASS = {
    "L": "fazis", "L1": "fazis", "L2": "fazis", "L3": "fazis",
    "kapcsolt": "fazis", "kozos": "fazis", "valto-1": "fazis", "valto-2": "fazis",
    "N": "nulla", "kapcsolt-N": "nulla",
    "PE": "pe",
}
# vezető (conductor) → osztály
CONDUCTOR_CLASS = {
    "L": "fazis", "L1": "fazis", "L2": "fazis", "L3": "fazis",
    "kapcsolt fázis": "fazis", "váltóvezeték": "fazis", "áthidaló": "fazis",
    "N": "nulla", "kapcsolt nulla": "nulla",
    "PE": "pe",
}
COLORS = {"barna", "kék", "zöld-sárga", "fekete", "szürke"}
CLASS_COLORS = {"fazis": {"barna", "fekete", "szürke"}, "nulla": {"kék"}, "pe": {"zöld-sárga"}}
PLAN_ROLES = {"L", "Lk", "K1", "K2", "N", "Nk", "PE", "L1", "L2", "L3", "PEN"}

# [vedelmek-bovites v1] – védelmek: FI-relé, kismegszakító, dugalj, hibahelyzetek (lásd a modul leírását)
KNOWN_TYPES |= {"ember", "hibaut", "fold", "ellenallas", "nyomogomb"}
ROLE_CLASS.setdefault("E", "fold")
VIRTUAL_CONDUCTORS = {"belső", "érintés", "hibahely"}
for _c in VIRTUAL_CONDUCTORS:
    CONDUCTOR_CLASS.setdefault(_c, "virtualis")
RCD_TYPES = {"fi-rele"}
OUTLET_TYPES = {"dugalj"}
SCENARIO_TYPES = {"ember", "hibaut"}
IMPEDANCE_TYPES = {"ember", "hibaut", "ellenallas"}
EARTH_TYPES = {"fold"}
SINGLE_POLE_DEVICE_TYPES = {"kismegszakito", "nyomogomb"}


def fingerprint(value) -> str:
    """FNV-1a (32 bit) a JSON-szöveg kódpontjain – a lib/sizing-tables.ts fingerprint() megfelelője
    (JSON.stringify kulcssorrendje = a fájl kulcssorrendje; a netlisták nem tartalmaznak törtszámot)."""
    s = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    h = 0x811C9DC5
    for ch in s:
        h ^= ord(ch)
        h = (h * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"


def switch_model_problem(c):
    """[biztonsagi-ellenor v1] A kapcsoló állásmodellje egyezik-e a típus fizikai felépítésével.
    Visszaad: "" (rendben), szöveges hibaleírás, vagy None (ismeretlen kapcsolótípus – nem ellenőrzött)."""
    ty = c.get("type")
    tids = [t.get("id") for t in c.get("terminals", [])]
    cls = {t.get("id"): ROLE_CLASS.get(t.get("role")) for t in c.get("terminals", [])}
    groups = [c["states"]] if c.get("states") is not None else [k.get("states", []) for k in c.get("keys") or []]

    def pairs(s):
        return [frozenset(p) for p in s.get("connect", [])]

    def matching(ps):
        seen = set()
        for p in ps:
            if len(p) != 2 or p & seen:
                return False
            seen |= p
        return True

    def is_106(states):
        """két állás, mindkettőben pontosan egy pár; a két pár egy közös kapcsot oszt meg, a másik végük eltér"""
        if len(states) != 2 or any(len(pairs(s)) != 1 for s in states):
            return None
        a, b = pairs(states[0])[0], pairs(states[1])[0]
        if len(a) != 2 or len(b) != 2 or a == b or len(a & b) != 1:
            return None
        return a | b

    if any(len(p) != 2 for g in groups for s in g for p in pairs(s)):
        return "egy állás saját magával köt össze kapcsot"
    if ty == "kapcsolo-101":
        if len(tids) != 2 or len(groups) != 1:
            return "két kapocs és egy billentyű kell"
        g = groups[0]
        if len(g) != 2 or sorted(len(pairs(s)) for s in g) != [0, 1] or any(p != frozenset(tids) for s in g for p in pairs(s)):
            return "két állás kell: egy nyitott (nincs összeköttetés) és egy zárt (a két kapocs összekötve)"
        return ""
    if ty == "kapcsolo-102":
        fz = frozenset(t for t in tids if cls[t] == "fazis")
        nu = frozenset(t for t in tids if cls[t] == "nulla")
        if len(tids) != 4 or len(fz) != 2 or len(nu) != 2 or len(groups) != 1:
            return "négy kapocs (két fázis- és két nullaoldali) és EGY billentyű kell – a két pólus együtt mozog"
        g = groups[0]
        if len(g) != 2 or sorted(len(pairs(s)) for s in g) != [0, 2] or {p for s in g for p in pairs(s)} != {fz, nu}:
            return "két állás kell: mindkét pólus nyitva, illetve mindkét pólus zárva (fázis a fázissal, nulla a nullával)"
        return ""
    if ty == "kapcsolo-105":
        if len(tids) != 3 or len(groups) != 2:
            return "három kapocs és két billentyű kell"
        on = []
        for g in groups:
            if len(g) != 2 or sorted(len(pairs(s)) for s in g) != [0, 1]:
                return "billentyűnként két állás kell: nyitott és zárt"
            on.append(next(p for s in g for p in pairs(s)))
        if on[0] == on[1] or len(on[0] & on[1]) != 1 or (on[0] | on[1]) != set(tids):
            return "a két billentyű közös betápkapocsról két külön kimenetet kapcsol"
        return ""
    if ty == "kapcsolo-106":
        if len(tids) != 3 or len(groups) != 1:
            return "három kapocs és egy billentyű kell"
        if is_106(groups[0]) != set(tids):
            return "két állás kell: a közös kapocs hol az egyik, hol a másik kimenettel (nincs „ki” állás, nincs zárlatos állás)"
        return ""
    if ty == "kapcsolo-106-6":
        if len(tids) != 6 or len(groups) != 2:
            return "hat kapocs és két billentyű kell"
        sets = [is_106(g) for g in groups]
        if any(s is None for s in sets) or sets[0] & sets[1] or (sets[0] | sets[1]) != set(tids):
            return "két független váltókapcsoló-billentyű kell, diszjunkt kapcsokkal (a közös kapcsok áthidalása vezeték vagy bridges)"
        return ""
    if ty == "kapcsolo-107":
        if len(tids) != 4 or len(groups) != 1:
            return "négy kapocs és egy billentyű kell"
        g = groups[0]
        if len(g) != 2 or any(len(pairs(s)) != 2 or not matching(pairs(s)) for s in g) or set(pairs(g[0])) == set(pairs(g[1])):
            return "két állás kell, mindkettő a négy kapocs két diszjunkt párja, és a két állás különböző"
        return ""
    return None


class UF:
    def __init__(self, items):
        self.p = {i: i for i in items}

    def find(self, x):
        p = self.p
        while p[x] != x:
            p[x] = p[p[x]]
            x = p[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.p[rb] = ra


class Netlist:
    def __init__(self, data: dict, path: str = "<memória>"):
        self.data = data
        self.path = path
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.comps: dict[str, dict] = {}
        self.terms: dict[str, dict] = {}  # "comp.term" -> terminal
        self.term_comp: dict[str, dict] = {}
        self.selectors: list[dict] = []  # {id, comp, key, states, label}
        self._structure()

    # --- szerkezet ---------------------------------------------------------------------------
    def err(self, code, msg):
        self.errors.append(f"[{code}] {msg}")

    def _structure(self):
        d = self.data
        for k in ("id", "title", "components", "wires", "truthTable"):
            if k not in d:
                self.err("S0", f"hiányzó mező: {k}")
        if d.get("format", FORMAT) != FORMAT:
            self.warnings.append(f"ismeretlen formátum: {d.get('format')}")
        for c in d.get("components", []):
            cid = c.get("id")
            if not cid or cid in self.comps:
                self.err("S1", f"hiányzó vagy ismétlődő komponens-id: {cid!r}")
                continue
            if "." in cid:
                self.err("S1", f"a komponens-id nem tartalmazhat pontot: {cid}")
            self.comps[cid] = c
            if c.get("type") not in KNOWN_TYPES:
                self.warnings.append(f"ismeretlen komponenstípus: {cid} ({c.get('type')})")
            seen = set()
            for t in c.get("terminals", []):
                tid = t.get("id")
                if not tid or tid in seen:
                    self.err("S1", f"hiányzó vagy ismétlődő kapocs-id: {cid}.{tid}")
                    continue
                seen.add(tid)
                if t.get("role") not in ROLE_CLASS:
                    self.err("S2", f"ismeretlen kapocsszerep: {cid}.{tid} ({t.get('role')})")
                key = f"{cid}.{tid}"
                self.terms[key] = t
                self.term_comp[key] = c
            for grp in c.get("bridges", []):
                for t in grp:
                    if f"{cid}.{t}" not in self.terms:
                        self.err("S1", f"ismeretlen kapocs a belső összeköttetésben: {cid}.{t}")
            # választók
            if c.get("states") is not None and c.get("keys") is not None:
                self.err("S6", f"{cid}: states és keys egyszerre nem adható meg")
            groups = []
            if c.get("states") is not None:
                groups.append((cid, None, c["states"], c.get("label", cid)))
            for k in c.get("keys", []) or []:
                groups.append((f"{cid}.{k['id']}", k["id"], k.get("states", []), f"{c.get('label', cid)} – {k.get('label', k['id'])}"))
            for sid, key, states, label in groups:
                names = [s.get("name") for s in states]
                if not states or len(set(names)) != len(names) or None in names:
                    self.err("S6", f"{sid}: üres vagy ismétlődő állapotnevek")
                for s in states:
                    for pair in s.get("connect", []):
                        if len(pair) != 2:
                            self.err("S6", f"{sid}/{s.get('name')}: a connect elemei kapocspárok")
                            continue
                        for t in pair:
                            tk = f"{cid}.{t}"
                            if tk not in self.terms:
                                self.err("S6", f"{sid}/{s.get('name')}: ismeretlen kapocs {tk}")
                            elif self.terms[tk].get("role") == "PE":
                                self.err("I3", f"{sid}/{s.get('name')}: a kapcsoló a védővezetőt kapcsolja ({tk})")
                self.selectors.append({"id": sid, "comp": cid, "key": key, "states": states, "label": label})
            if c.get("type", "").startswith(SWITCH_PREFIX) and not groups:
                self.err("S6", f"{cid}: kapcsolónak nincs állapota (states/keys)")
            elif c.get("type", "").startswith(SWITCH_PREFIX):  # [biztonsagi-ellenor v1]
                problem = switch_model_problem(c)
                if problem is None:
                    self.warnings.append(f"{cid}: a(z) {c.get('type')} típus belső modelljét a szimulátor nem ellenőrzi")
                elif problem:
                    self.err("S8", f"{cid}: a kapcsoló belső modellje nem felel meg a(z) {c.get('type')} típusnak: {problem}")
        # fogyasztók és források
        self.loads = [c for c in self.comps.values() if c.get("type") in LOAD_TYPES]
        self.taps = [c for c in self.comps.values() if c.get("type") in SOURCE_TYPES]
        if not self.taps:
            self.err("S5", "nincs betáp (tap) komponens")
        for tp in self.taps:
            roles = [t.get("role") for t in tp.get("terminals", [])]
            if not any(r in PHASE_SOURCE_ROLES for r in roles) or roles.count("N") != 1 or roles.count("PE") != 1:
                self.err("S5", f"{tp['id']}: a betápnak L, N és PE kapocs kell")
        if not self.loads and not any(c.get("type") in OUTLET_TYPES for c in self.comps.values()):  # [vedelmek-bovites v1]
            self.err("S5", "nincs fogyasztó (lampa) komponens")
        for ld in self.loads:
            roles = [t.get("role") for t in ld.get("terminals", [])]
            if roles.count("L") != 1 or roles.count("N") != 1:
                self.err("S5", f"{ld['id']}: a fogyasztónak pontosan egy L és egy N kapcsa kell")
            if ld.get("class") != "II" and roles.count("PE") != 1:
                self.err("I2", f"{ld['id']}: I. osztályú (fémtestű) fogyasztó PE-kapocs nélkül")
        # szakaszok
        self.sections = {}
        for s in self.data.get("sections", []) or []:
            if s.get("id") in self.sections:
                self.err("S4", f"ismétlődő szakasz: {s.get('id')}")
            self.sections[s.get("id")] = s
        # vezetékek
        wids = set()
        for i, w in enumerate(d.get("wires", [])):
            wid = w.get("id") or f"#{i + 1}"
            if wid in wids:
                self.err("S3", f"ismétlődő vezeték-id: {wid}")
            wids.add(wid)
            ok = True
            for end in ("from", "to"):
                if w.get(end) not in self.terms:
                    self.err("S3", f"{wid}: ismeretlen végpont {w.get(end)!r}")
                    ok = False
            cond = w.get("conductor")
            col = w.get("color")
            if CONDUCTOR_CLASS.get(cond) == "virtualis":  # [vedelmek-bovites v1]
                if col is not None or w.get("section") is not None:
                    self.err("S3", f"{wid}: a(z) „{cond}” kapcsolat nem valódi ér: nincs színe és szakasza")
                continue
            if cond not in CONDUCTOR_CLASS:
                self.err("S3", f"{wid}: ismeretlen vezető {cond!r}")
                ok = False
            if col not in COLORS:
                self.err("I8", f"{wid}: ismeretlen szín {col!r}")
                ok = False
            if w.get("role") is not None and w.get("role") not in PLAN_ROLES:
                self.warnings.append(f"{wid}: ismeretlen szerepkód {w.get('role')}")
            if not ok:
                continue
            cls = CONDUCTOR_CLASS[cond]
            if col not in CLASS_COLORS[cls]:
                self.err("I8", f"{wid}: {cond} vezető {col} színnel (megengedett: {', '.join(sorted(CLASS_COLORS[cls]))})")
            for end in ("from", "to"):
                tcls = ROLE_CLASS.get(self.terms[w[end]].get("role"))
                if tcls != cls:
                    code = "I3" if "pe" in (cls, tcls) else ("I6" if "nulla" in (cls, tcls) else "I9")
                    self.err(code, f"{wid}: {cond} vezető {tcls} szerepű kapocsra fut ({w[end]})")
            ca, cb = self.term_comp[w["from"]], self.term_comp[w["to"]]
            if ca is cb and cls != "fazis":
                self.err("S3", f"{wid}: komponensen belüli vezeték csak fázisoldali áthidaló lehet")
            for c in (ca, cb):
                if c.get("type", "").startswith(SWITCH_PREFIX) and c.get("type") not in MULTIPOLE_SWITCH_TYPES and cls != "fazis":
                    self.err("I6" if cls == "nulla" else "I3", f"{wid}: {cond} vezető egypólusú kapcsolóra fut ({c['id']})")
            sec = w.get("section")
            loc_a, loc_b = ca.get("at", ca["id"]), cb.get("at", cb["id"])
            if self.sections:
                if loc_a == loc_b:
                    if sec is not None:
                        self.err("S4", f"{wid}: dobozon belüli vezeték nem tartozhat szakaszhoz ({sec})")
                elif sec not in self.sections:
                    self.err("S4", f"{wid}: hiányzó vagy ismeretlen szakasz {sec!r}")
                else:
                    s = self.sections[sec]
                    if {s.get("from"), s.get("to")} != {loc_a, loc_b}:
                        self.err("S4", f"{wid}: a szakasz ({sec}: {s.get('from')}–{s.get('to')}) nem a vezeték két végét köti ({loc_a}–{loc_b})")
        apd = (d.get("checks") or {}).get("allPoleDisconnect", [])
        for lid in apd:
            if lid not in self.comps or self.comps[lid].get("type") not in LOAD_TYPES:
                self.err("S5", f"checks.allPoleDisconnect: ismeretlen fogyasztó {lid}")
        self.all_pole = set(apd)

    # --- szimuláció --------------------------------------------------------------------------
    def combos(self):
        names = [[s["name"] for s in sel["states"]] for sel in self.selectors]
        for prod in itertools.product(*names):
            yield {sel["id"]: n for sel, n in zip(self.selectors, prod)}

    def solve(self, combo, skip=None):
        uf = UF(self.terms.keys())
        for w in self.data.get("wires", []):
            if w.get("from") in self.terms and w.get("to") in self.terms:
                uf.union(w["from"], w["to"])
        for c in self.comps.values():
            for grp in c.get("bridges", []):
                ks = [f"{c['id']}.{t}" for t in grp if f"{c['id']}.{t}" in self.terms]
                for k in ks[1:]:
                    uf.union(ks[0], k)
        for sel in self.selectors:
            if skip is not None and sel["comp"] == skip:  # [vedelmek-bovites v1]
                continue
            st = next(s for s in sel["states"] if s["name"] == combo[sel["id"]])
            for a, b in st.get("connect", []):
                ka, kb = f"{sel['comp']}.{a}", f"{sel['comp']}.{b}"
                if ka in self.terms and kb in self.terms:
                    uf.union(ka, kb)
        return uf

    def run(self) -> dict:
        rep = {"id": self.data.get("id"), "file": self.path, "fingerprint": fingerprint(self.data),
               "selectors": [{"id": s["id"], "label": s["label"], "states": [x["name"] for x in s["states"]]} for s in self.selectors],
               "loads": [l["id"] for l in self.loads], "rows": [], "errors": self.errors, "warnings": self.warnings}
        if self.errors and any(e.startswith(("[S0]", "[S1]", "[S5]", "[S6]")) for e in self.errors):
            rep["pass"] = False
            return rep
        tt = self.data.get("truthTable", [])
        sel_ids = [s["id"] for s in self.selectors]
        expected = {}
        for i, row in enumerate(tt):
            st = row.get("states", {})
            if set(st) != set(sel_ids):
                self.err("I10", f"truthTable[{i}]: a kapcsolók köre eltér ({sorted(st)} ≠ {sorted(sel_ids)})")
                continue
            for sid, name in st.items():
                if name not in [x["name"] for x in next(s for s in self.selectors if s["id"] == sid)["states"]]:
                    self.err("I10", f"truthTable[{i}]: {sid} ismeretlen állapota {name!r}")
            key = tuple(st[s] for s in sel_ids)
            if key in expected:
                self.err("I10", f"truthTable[{i}]: ismétlődő sor {key}")
            lamps = row.get("lamps", {})
            if set(lamps) != {l["id"] for l in self.loads}:
                self.err("I10", f"truthTable[{i}]: a lámpák köre eltér")
            expected[key] = lamps
            self._prot_expect(i, key, row)  # [vedelmek-bovites v1]
        violations: dict[str, set] = {}

        def viol(code, msg):
            violations.setdefault(f"[{code}] {msg}", set())

        n_combo = 0
        for combo in self.combos():
            n_combo += 1
            uf = self.solve(combo)
            f = uf.find
            tag = ", ".join(f"{k}={v}" for k, v in combo.items()) or "(nincs kapcsoló)"
            L_roots, N_roots, PE_roots = set(), set(), set()
            src = []
            for tp in self.taps:
                for t in tp["terminals"]:
                    k = f"{tp['id']}.{t['id']}"
                    src.append((k, t["role"]))
                    if t["role"] in PHASE_SOURCE_ROLES:
                        L_roots.add(f(k))
                    elif t["role"] == "N":
                        N_roots.add(f(k))
                    elif t["role"] == "PE":
                        PE_roots.add(f(k))
            # I1 – zárlat: a forráskapcsok páronként külön hálózaton
            for (ka, ra), (kb, rb) in itertools.combinations(src, 2):
                if f(ka) == f(kb) and not (ka.split(".")[0] == kb.split(".")[0] and ra == rb):
                    if ka.split(".")[0] != kb.split(".")[0] and ra == rb == "PE":  # [biztonsagi-ellenor v1]
                        continue  # két áramkör védővezetője közös lehet
                    if ka.split(".")[0] != kb.split(".")[0] and ra == rb == "N":
                        viol("I14", f"két áramkör nullavezetője összekötve ({ka}–{kb}) ebben az állásban: {tag}")
                        continue
                    viol("I1", f"zárlat {ra}–{rb} ({ka}–{kb}) ebben az állásban: {tag}")
            # I2/I3 – PE folytonos, és a PE-hálózatban csak PE-kapocs van
            pe_members = {k for k in self.terms if f(k) in PE_roots}
            for k, t in self.terms.items():
                if t.get("role") == "PE" and k not in pe_members:
                    viol("I2", f"a védővezető megszakad: {k} nincs a PE-hálózaton ({tag})")
                if k in pe_members and t.get("role") != "PE":
                    viol("I3", f"nem PE kapocs ({k}, {t.get('role')}) a PE-hálózaton ({tag})")
            # kapcsolók: egypólusú kapcsoló kapcsa sosem lehet N- vagy PE-hálózaton
            prot_closed = self._prot_closed(combo)  # [vedelmek-bovites v1]
            for c in self.comps.values():
                ty = c.get("type", "")
                for t in c.get("terminals", []):
                    k = f"{c['id']}.{t['id']}"
                    r = f(k)
                    if ty in SINGLE_POLE_DEVICE_TYPES and r in N_roots:  # [vedelmek-bovites v1]
                        viol("I6", f"a nullavezető egypólusú készüléken ({ty}) halad át ({k}; {tag})")
                    if ty.startswith(SWITCH_PREFIX):
                        if ty not in MULTIPOLE_SWITCH_TYPES and r in N_roots:
                            viol("I6", f"a nullavezető egypólusú kapcsolón halad át ({k}; {tag})")
                        if ROLE_CLASS[t["role"]] == "fazis" and r in N_roots:
                            viol("I5", f"fázisoldali kapcsolókapocs a nullavezetőn ({k}; {tag})")
                        if ROLE_CLASS[t["role"]] == "nulla" and r in L_roots:
                            viol("I5", f"nullaoldali kapcsolókapocs fázison ({k}; {tag})")
                    elif ty not in LOAD_TYPES:
                        if t["role"] == "N" and r not in N_roots and prot_closed:
                            viol("I7", f"a nullavezető-kötés nem folytonos: {k} ({tag})")
                        if ROLE_CLASS[t["role"]] == "fazis" and r in N_roots:
                            viol("I5", f"fázis szerepű kötés a nullavezetőn: {k} ({tag})")
                        if ROLE_CLASS[t["role"]] == "nulla" and r in L_roots:
                            viol("I5", f"nulla szerepű kötés fázison: {k} ({tag})")
            # fogyasztók
            lamps = {}
            for ld in self.loads:
                tl = next(f"{ld['id']}.{t['id']}" for t in ld["terminals"] if t["role"] == "L")
                tn = next(f"{ld['id']}.{t['id']}" for t in ld["terminals"] if t["role"] == "N")
                rl, rn = f(tl), f(tn)
                # fizikailag ég, ha egyik kapcsa fázison, a másik nullán van (felcserélt polaritásnál is – azt az I5 jelzi)
                on = (rl in L_roots and rn in N_roots) or (rl in N_roots and rn in L_roots)
                lamps[ld["id"]] = on
                if rl in N_roots or rn in L_roots:
                    viol("I5", f"{ld['id']}: felcserélt polaritás (L-kapocs a nullán vagy N-kapocs fázison) ({tag})")
                if not on and (rl in L_roots or rn in L_roots):
                    viol("I4", f"{ld['id']}: kikapcsolt állásban is fázist kap az L-kapocs – a kapcsoló nem a fázist bontja ({tag})")
                if on and len(self.taps) > 1:  # [biztonsagi-ellenor v1] kölcsönvett nulla
                    ph, nu = (rl, rn) if rl in L_roots else (rn, rl)
                    t_ph = {tp["id"] for tp in self.taps for t in tp["terminals"]
                            if t["role"] in PHASE_SOURCE_ROLES and f(f"{tp['id']}.{t['id']}") == ph}
                    t_nu = {tp["id"] for tp in self.taps for t in tp["terminals"] if t["role"] == "N" and f(f"{tp['id']}.{t['id']}") == nu}
                    if t_ph != t_nu:
                        viol("I14", f"{ld['id']}: a fázis ({', '.join(sorted(t_ph))}) és a nulla ({', '.join(sorted(t_nu))}) "
                                    f"nem ugyanabból az áramkörből jön – kölcsönvett nulla ({tag})")
                if ld["id"] in self.all_pole:
                    if not on and (rn in N_roots or rn in L_roots or rl in N_roots):
                        viol("I7", f"{ld['id']}: kikapcsolva nem bont minden pólust ({tag})")
                elif rn not in N_roots and prot_closed:
                    viol("I7", f"{ld['id']}: a nullavezető nem folytonos / kapcsolt ({tag})")
            row = {"states": dict(combo), "lamps": lamps}
            key = tuple(combo[s] for s in sel_ids)
            ext = self._prot_eval(combo, uf, L_roots, N_roots, PE_roots, lamps, tag, viol)  # [vedelmek-bovites v1]
            row.update(ext)
            exp = expected.get(key)
            if exp is None:
                self.err("I10", f"truthTable: hiányzó sor ({tag})")
                row["ok"] = False
            else:
                row["expected"] = exp
                row["ok"] = exp == lamps
                if not row["ok"]:
                    self.err("I10", f"eltérés a truthTable-től ({tag}): várt {exp}, szimulált {lamps}")
                for k2, v2 in ext.items():  # [vedelmek-bovites v1]
                    e2 = self._prot_expected.get(key, {}).get(k2)
                    if e2 != v2:
                        row["ok"] = False
                        self.err("I10", f"eltérés a truthTable-től ({tag}): {k2} várt {e2}, szimulált {v2}")
            rep["rows"].append(row)
        if len(expected) > n_combo:
            self.err("I10", "a truthTable-ben nem létező állás is szerepel")
        for v in violations:
            self.errors.append(v)
        rep["combinations"] = n_combo
        # váltó-tulajdonság: kétállású választó átváltása mindig megfordítja-e a lámpát
        toggle = {}
        rows = {tuple(r["states"][s] for s in sel_ids): r["lamps"] for r in rep["rows"]}
        for ld in self.loads:
            toggle[ld["id"]] = {}
            for i, sel in enumerate(self.selectors):
                names = [x["name"] for x in sel["states"]]
                if len(names) != 2:
                    continue
                always = True
                for key, lamps in rows.items():
                    other = list(key)
                    other[i] = names[1] if key[i] == names[0] else names[0]
                    if rows[tuple(other)][ld["id"]] == lamps[ld["id"]]:
                        always = False
                        break
                toggle[ld["id"]][sel["id"]] = always
        rep["toggle"] = toggle
        rep["sections"] = self.section_report()
        rep["pass"] = not self.errors
        return rep

    # --- megjelenítés ------------------------------------------------------------------------
    def tlabel(self, key):
        c = self.term_comp[key]
        t = self.terms[key]
        return f"{c.get('label', c['id'])}: {t.get('label', t['id'])}"

    def section_report(self):
        out = []
        for sid, s in self.sections.items():
            ws = [w for w in self.data.get("wires", []) if w.get("section") == sid]
            out.append({"id": sid, "label": s.get("label", sid), "kind": s.get("kind"), "from": s.get("from"), "to": s.get("to"),
                        "count": len(ws), "conductors": [wire_name(w) for w in ws]})
        return out


def wire_name(w):
    lab = w.get("label")
    base = w["conductor"] if not lab else f"{w['conductor']} {lab}"
    return f"{base} ({w['color']})"


def state_cell(sel, name):
    st = next(s for s in sel["states"] if s["name"] == name)
    return f"{name} ({st['label']})" if st.get("label") else name


def md_states(nl: Netlist, rep: dict, compact: bool = False) -> str:
    if nl.is_protective() or compact:  # [vedelmek-bovites v1]
        return md_states_prot(nl, rep, compact)
    sels = nl.selectors
    loads = nl.loads
    head = [s["label"] for s in sels] + [l.get("label", l["id"]) for l in loads]
    lines = ["| " + " | ".join(head) + " |", "|" + "---|" * len(head)]
    for r in rep["rows"]:
        cells = [state_cell(s, r["states"][s["id"]]) for s in sels]
        cells += ["**ég**" if r["lamps"][l["id"]] else "nem ég" for l in loads]
        lines.append("| " + " | ".join(cells) + " |")
    multipole = any(c.get("type") in MULTIPOLE_SWITCH_TYPES for c in nl.comps.values())
    n = rep["combinations"]
    txt = (f"_A táblázatot a szimulátor számolta a(z) `{rep['id']}` netlistából (ujjlenyomat: `{rep['fingerprint']}`): "
           f"{n} kapcsolóállás, mindegyik egyezik a várt működéssel. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; "
           f"a védővezető minden fémtestig folytonos, és nem halad át kapcsolón; kikapcsolt állásban a lámpa "
           f"fázisoldali kapcsa nem kap fázist; ")
    txt += ("a nullavezetőt csak a kétpólusú kapcsoló bontja, a fázisvezetővel együtt, így kikapcsolt állásban a "
            "fogyasztó mindkét üzemi kapcsa le van választva._" if multipole and nl.all_pole else
            "a nullavezetőt csak a kétpólusú kapcsoló bontja, a fázisvezetővel együtt._" if multipole
            else "a nullavezető egyik állásban sem halad át kapcsolón._")
    tg = []
    for l in loads:
        sw = [s for s in sels if rep["toggle"][l["id"]].get(s["id"])]
        if len(sw) >= 2:
            who = "bármelyik kapcsoló" if len(sw) == len(sels) else "a(z) " + ", ".join(s["label"] for s in sw) + " közül bármelyik"
            name = l.get("label", l["id"])
            tg.append(f"{name}: {who} átváltása megfordítja az állapotát")
    if tg:
        txt = txt[:-2] + ". " + "; ".join(tg) + "._"
    return "\n".join(lines) + "\n\n" + txt


def md_projection(nl: Netlist, rep: dict, lamp_id: str, sel_ids: list) -> str:
    """Egy lámpa állapottáblája csak a megadott kapcsolók szerint. Csak akkor készül el, ha a szimuláció szerint
    a lámpa állapota a többi kapcsolótól FÜGGETLEN (különben hiba)."""
    sels = [next(s for s in nl.selectors if s["id"] == i) for i in sel_ids]
    lamp = next(l for l in nl.loads if l["id"] == lamp_id)
    seen = {}
    for r in rep["rows"]:
        key = tuple(r["states"][i] for i in sel_ids)
        v = r["lamps"][lamp_id]
        if seen.setdefault(key, v) != v:
            raise SystemExit(f"{rep['id']}: {lamp_id} állapota nem csak a(z) {sel_ids} kapcsolóktól függ – a vetített táblázat nem érvényes")
    head = [s["label"] for s in sels] + [lamp.get("label", lamp_id)]
    lines = ["| " + " | ".join(head) + " |", "|" + "---|" * len(head)]
    for key, v in seen.items():
        cells = [state_cell(s, k) for s, k in zip(sels, key)] + ["**ég**" if v else "nem ég"]
        lines.append("| " + " | ".join(cells) + " |")
    others = [s["label"] for s in nl.selectors if s["id"] not in sel_ids]
    note = (f"_Vetített táblázat a(z) `{rep['id']}` netlista teljes szimulációjából (ujjlenyomat: `{rep['fingerprint']}`, "
            f"{rep['combinations']} kapcsolóállás): a(z) {lamp.get('label', lamp_id)} állapota a többi billentyűtől "
            f"({', '.join(others)}) minden állásban független._")
    return "\n".join(lines) + "\n\n" + note


def md_wires(nl: Netlist) -> str:
    lines = ["| # | Honnan | Hová | Vezető | Szín | Szakasz |", "|---|---|---|---|---|---|"]
    for i, w in enumerate([w for w in nl.data["wires"] if CONDUCTOR_CLASS.get(w.get("conductor")) != "virtualis"], 1):  # [vedelmek-bovites v1]
        sec = w.get("section")
        sec_l = nl.sections[sec].get("label", sec) if sec in nl.sections else "dobozon belül"
        if sec not in nl.sections:  # [vedelmek-bovites v3] – opcionális places: {"<hely>": {"label", "inner"}}
            loc = nl.term_comp[w["from"]].get("at", nl.term_comp[w["from"]]["id"])
            sec_l = ((nl.data.get("places") or {}).get(loc) or {}).get("inner") or sec_l
        cond = w["conductor"] + (f" {w['label']}" if w.get("label") else "")
        lines.append(f"| {i} | {nl.tlabel(w['from'])} | {nl.tlabel(w['to'])} | {cond} | {w['color']} | {sec_l} |")
    return "\n".join(lines)


def md_sections(nl: Netlist, rep: dict) -> str:
    lines = ["| Szakasz | Vezetők | Érszám |", "|---|---|---|"]
    for s in rep["sections"]:
        lines.append(f"| {s['label']} | {', '.join(s['conductors'])} | {s['count']} |")
    return "\n".join(lines)


def switch_count(nl):
    return len([c for c in nl.comps.values() if c.get("type", "").startswith(SWITCH_PREFIX)])


def md_variants(items) -> str:
    lines = ["| Változat | Kapcsolók | Kapcsolási helyek | Kapcsolóállások | Egy kapcsoló átváltása mindig vált | Szimuláció |",
             "|---|---|---|---|---|---|"]
    for nl, rep in items:
        types = [c["type"].replace("kapcsolo-", "") for c in nl.comps.values() if c.get("type", "").startswith(SWITCH_PREFIX)]
        lid = nl.loads[0]["id"]
        tg = all(rep["toggle"][lid].values())
        lines.append(f"| {nl.data['title']} | {' + '.join(types)} | {switch_count(nl)} | {rep['combinations']} | "
                     f"{'igen' if tg else 'nem'} | {'PASS' if rep['pass'] else 'FAIL'} (`{rep['fingerprint']}`) |")
    return "\n".join(lines)


def md_compare(items) -> str:
    """Összehasonlító táblázat a gyűjtőoldalhoz (vilagitasi-kapcsolasok). [kapcsolasok v2: csoportosított
    szerelvénylista, lámpánkénti kapcsolási helyek és bontott vezetők a szimulációból]"""
    lines = ["| Kapcsolás | Szerelvények | Lámpakörök | Helyek lámpánként | Bontott vezetők | Erek a kapcsoló(k)hoz | Erek a lámpá(k)hoz | Szimuláció |",
             "|---|---|---|---|---|---|---|---|"]
    total = 0
    for nl, rep in items:
        types = [c["type"].replace("kapcsolo-", "").replace("106-6", "106+6") for c in nl.comps.values() if c.get("type", "").startswith(SWITCH_PREFIX)]
        order = sorted(set(types), key=lambda t: (t.replace("+", "."), t))
        parts = [(f"{types.count(t)} × {t}" if types.count(t) > 1 else t) for t in order]
        comp_of = {s["id"]: s["comp"] for s in nl.selectors}
        places = []
        for ld in nl.loads:
            n = len({comp_of[sid] for sid, always in rep["toggle"][ld["id"]].items() if always})
            places.append(str(n))
        places = places[0] if len(set(places)) == 1 else " / ".join(places)
        poles = "L és N" if nl.loads and all(ld["id"] in nl.all_pole for ld in nl.loads) else "L"
        sw = " / ".join(str(s["count"]) for s in rep["sections"] if s.get("kind") == "kapcsolo")
        lp = " / ".join(str(s["count"]) for s in rep["sections"] if s.get("kind") == "lampa")
        total += rep["combinations"]
        lines.append(f"| {nl.data.get('short', nl.data['title'])} | {' + '.join(parts)} | {len(nl.loads)} | {places} | {poles} | {sw} | {lp} | "
                     f"{'PASS' if rep['pass'] else 'FAIL'}, {rep['combinations']} állás (`{rep['fingerprint']}`) |")
    note = (f"_A táblázatot a szimulátor számolta a felsorolt netlistákból ({len(items)} kapcsolás, összesen {total} kapcsolóállás, "
            "mindegyik egyezik a várt működéssel, zárlat és védővezető-hiba nélkül). „Helyek lámpánként”: hány különböző "
            "kapcsolási helyről fordítható meg a lámpa állapota bármely állásból; „Bontott vezetők”: kikapcsolva mely "
            "üzemi vezetőket választja le a kapcsoló a lámpáról; az érszám a cikkek kötődobozos változatára vonatkozik, "
            "a védővezetővel együtt._")
    return "\n".join(lines) + "\n\n" + note


# [vedelmek-bovites v1] – függvények -----------------------------------------------------------------
def _sel_state(self, combo, cid):
    sel = next((s for s in self.selectors if s["comp"] == cid and s["key"] is None), None)
    if sel is None:
        return {"name": None, "connect": []}
    return next(s for s in sel["states"] if s["name"] == combo[sel["id"]])


def _rcds(self):
    return [c for c in self.comps.values() if c.get("type") in RCD_TYPES]


def _poles(self, c):
    return [tuple(p) for p in c.get("poles", [])]


def _prot_closed(self, combo):
    for c in self._rcds():
        st = self._sel_state(combo, c["id"])
        closed = {tuple(p) for p in st.get("connect", [])}
        closed |= {(b, a) for a, b in closed}
        if not self._poles(c) or not all(p in closed for p in self._poles(c)):
            return False
    return True


def _is_protective(self):
    if getattr(self, "_protective", None) is None:
        types = {c.get("type") for c in self.comps.values()}
        self._protective = bool(types & (RCD_TYPES | OUTLET_TYPES | IMPEDANCE_TYPES | EARTH_TYPES | {"nyomogomb"}))
        for c in self._rcds():
            if not self._poles(c):
                self.err("S7", f"{c['id']}: az áram-védőkapcsolónak meg kell adni a pólusait (poles: [[tápkapocs, terheléskapocs], ...])")
            for p in self._poles(c):
                if len(p) != 2 or any(f"{c['id']}.{t}" not in self.terms for t in p):
                    self.err("S7", f"{c['id']}: hibás pólus {list(p)}")
        for c in self.comps.values():
            if c.get("type") in IMPEDANCE_TYPES:
                imp = c.get("impedance") or [t["id"] for t in c.get("terminals", [])][:2]
                if len(imp) != 2 or any(f"{c['id']}.{t}" not in self.terms for t in imp):
                    self.err("S7", f"{c['id']}: az impedancia két kapcsa nem egyértelmű")
            if c.get("type") in SCENARIO_TYPES and c.get("states") is None:
                self.err("S7", f"{c['id']}: hibahelyzetnek/érintésnek állapotai kellenek (nincs/fennáll, active)")
    return self._protective


def _scenario_sels(self):
    out = []
    for s in self.selectors:
        c = self.comps[s["comp"]]
        if c.get("type") in SCENARIO_TYPES or c.get("scenario"):
            out.append(s)
    return out


def _prot_expect(self, i, key, row):
    if not hasattr(self, "_prot_expected"):
        self._prot_expected = {}
    if not self._is_protective():
        return
    want = {}
    sets = {"outlets": {c["id"] for c in self.comps.values() if c.get("type") in OUTLET_TYPES},
            "currents": {c["id"] for c in self.comps.values() if c.get("type") in SCENARIO_TYPES},
            "trips": {c["id"] for c in self._rcds()}}
    for k, ids in sets.items():
        if not ids:
            if k in row:
                self.err("I10", f"truthTable[{i}]: „{k}” kulcs, de nincs ilyen elem")
            continue
        got = row.get(k)
        if not isinstance(got, dict) or set(got) != ids:
            self.err("I10", f"truthTable[{i}]: a(z) „{k}” köre eltér (várt: {sorted(ids)})")
            continue
        want[k] = {x: bool(got[x]) for x in sorted(ids)}
    self._prot_expected[key] = want


def _prot_eval(self, combo, uf, L_roots, N_roots, PE_roots, lamps, tag, viol):
    if not hasattr(self, "_prot_expected"):
        self._prot_expected = {}
    if not self._is_protective():
        return {}
    f = uf.find
    earth = [f"{c['id']}.{t['id']}" for c in self.comps.values() if c.get("type") in EARTH_TYPES for t in c.get("terminals", [])]
    E_roots = {f(k) for k in earth}
    RET = N_roots | PE_roots | E_roots
    for k in earth:  # a föld a fogyasztói oldalon nem kerülhet a nullavezetővel vagy fázissal egy hálózatba
        if f(k) in N_roots or f(k) in L_roots:
            viol("I1", f"a föld (talaj) {k} a nulla- vagy fázisvezetővel egy hálózaton ({tag})")
    out = {}
    outlets = {}
    for c in self.comps.values():
        if c.get("type") in OUTLET_TYPES:
            ls = [f"{c['id']}.{t['id']}" for t in c["terminals"] if ROLE_CLASS.get(t["role"]) == "fazis"]
            ns = [f"{c['id']}.{t['id']}" for t in c["terminals"] if t["role"] == "N"]
            outlets[c["id"]] = bool(ls and ns and any(f(x) in L_roots for x in ls) and any(f(x) in N_roots for x in ns))
    conducting = []
    for c in self.comps.values():  # [vedelmek-bovites v4] – feszültség alatti dugalj = csatlakoztatható fogyasztó
        if outlets.get(c["id"]):
            tl = next(f"{c['id']}.{t['id']}" for t in c["terminals"] if ROLE_CLASS.get(t["role"]) == "fazis" and f(f"{c['id']}.{t['id']}") in L_roots)
            tn = next(f"{c['id']}.{t['id']}" for t in c["terminals"] if t["role"] == "N" and f(f"{c['id']}.{t['id']}") in N_roots)
            conducting.append((tl, tn))
    for ld in self.loads:
        if lamps.get(ld["id"]):
            tl = next(f"{ld['id']}.{t['id']}" for t in ld["terminals"] if t["role"] == "L")
            tn = next(f"{ld['id']}.{t['id']}" for t in ld["terminals"] if t["role"] == "N")
            conducting.append((tl, tn))
    currents = {}
    for c in self.comps.values():
        if c.get("type") not in IMPEDANCE_TYPES:
            continue
        st = self._sel_state(combo, c["id"])
        active = st.get("active", True) if st.get("name") is not None else True
        imp = c.get("impedance") or [t["id"] for t in c.get("terminals", [])][:2]
        a, b = f"{c['id']}.{imp[0]}", f"{c['id']}.{imp[1]}"
        ra, rb = f(a), f(b)
        cond = bool(active and ((ra in L_roots and rb in RET) or (rb in L_roots and ra in RET)))
        if c.get("type") in SCENARIO_TYPES:
            currents[c["id"]] = cond
        if cond:
            conducting.append((a, b))
    trips = {}
    srcs = [f"{tp['id']}.{t['id']}" for tp in self.taps for t in tp.get("terminals", [])] + earth
    for c in self._rcds():
        st = self._sel_state(combo, c["id"])
        closed = {tuple(p) for p in st.get("connect", [])}
        closed |= {(y, x) for x, y in closed}
        poles = self._poles(c)
        if not poles or not all(p in closed for p in poles):
            trips[c["id"]] = False
            continue
        zf = self.solve(combo, skip=c["id"]).find
        zone = {zf(f"{c['id']}.{ld}") for _, ld in poles}
        supply = {zf(f"{c['id']}.{sp}") for sp, _ in poles}
        bypass = bool(zone & supply) or any(zf(s) in zone for s in srcs)
        if bypass:
            viol("I12", f"{c['id']}: a védett oldal a FI-relé pólusait megkerülve is összeköttetésben van a táp oldallal ({tag})")
        residual = False
        for a, b in conducting:
            ia, ib = zf(a) in zone, zf(b) in zone
            if ia != ib or (bypass and (ia or ib)):
                residual = True
        trips[c["id"]] = residual
    normal = all(combo[s["id"]] == s["states"][0]["name"] for s in self._scenario_sels())
    if normal:
        for rid, t in trips.items():
            if t:
                viol("I11", f"{rid}: normál üzemben is különbözeti áram folyna – kioldana ({tag})")
    if outlets:
        out["outlets"] = outlets
    if currents:
        out["currents"] = currents
    if trips:
        out["trips"] = trips
    return out


Netlist._sel_state = _sel_state
Netlist._rcds = _rcds
Netlist._poles = _poles
Netlist._prot_closed = _prot_closed
Netlist.is_protective = _is_protective
Netlist._is_protective = _is_protective
Netlist._scenario_sels = _scenario_sels
Netlist._prot_expect = _prot_expect
Netlist._prot_eval = _prot_eval

OUT_WORDS = {"lampa": ("**ég**", "nem ég"), "fogyaszto": ("**működik**", "nem működik"),
             "dugalj": ("**feszültség alatt**", "feszültségmentes"), "ember": ("**áram folyik át rajta**", "nem"),
             "hibaut": ("**hibaáram folyik**", "nem")}


def _row_outputs(nl, r):
    vals = []
    for l in nl.loads:
        vals.append(("lampa" if l.get("type") == "lampa" else "fogyaszto", r["lamps"][l["id"]]))
    for k in ("outlets", "currents"):
        for cid, v in r.get(k, {}).items():
            vals.append((nl.comps[cid]["type"], v))
    for cid, v in r.get("trips", {}).items():
        vals.append(("trip", v))
    return vals


def md_states_prot(nl, rep, compact=False):  # [vedelmek-bovites v2]
    """Állapottábla a védelmi netlistákhoz: a minden sorban azonos oszlopok (egyállású választó, állandó kimenet)
    nem kapnak oszlopot, hanem a tábla alatti mondatba kerülnek; a kimeneti oszlop felirata a komponens
    outputLabel mezője (ha van), különben a label. compact=True: az egyenértékű sorok „bármely” állással
    összevonva, a teljes táblára visszabontva ellenőrizve."""
    sels = nl.selectors
    rows = rep["rows"]
    first = rows[0] if rows else {}
    outs = [(("lampa" if l.get("type") == "lampa" else "fogyaszto"), l["id"], l.get("outputLabel", l.get("label", l["id"]))) for l in nl.loads]
    for k in ("outlets", "currents"):
        outs += [(nl.comps[cid]["type"], cid, nl.comps[cid].get("outputLabel", nl.comps[cid].get("label", cid))) for cid in first.get(k, {})]
    outs += [("trip", cid, f"{nl.comps[cid].get('label', cid)}: kiold?") for cid in first.get("trips", {})]

    def val(r, typ, cid):
        if typ in ("lampa", "fogyaszto"):
            return r["lamps"][cid]
        if typ == "trip":
            return r["trips"][cid]
        return r.get("outlets", {}).get(cid, r.get("currents", {}).get(cid))

    def word(typ, v):
        if typ == "trip":
            return "**kiold**" if v else "nem old ki"
        yes, no = OUT_WORDS.get(typ, ("**igen**", "nem"))
        return yes if v else no
    var_sels = [s for s in sels if len(s["states"]) > 1]
    fixed_sels = [s for s in sels if len(s["states"]) == 1]
    var_outs = [o for o in outs if len({val(r, o[0], o[1]) for r in rows}) > 1]
    const_outs = [o for o in outs if o not in var_outs]
    head = [s["label"] for s in var_sels] + [o[2] for o in var_outs]
    lines = ["| " + " | ".join(head) + " |", "|" + "---|" * len(head)]
    items = [([r["states"][s["id"]] for s in var_sels], tuple(val(r, o[0], o[1]) for o in var_outs)) for r in rows]
    names = [[x["name"] for x in s["states"]] for s in var_sels]
    if compact and var_sels:
        full_order = [tuple(r["states"][s["id"]] for s in var_sels) for r in rows]

        def first_idx(k):
            return min(i for i, full in enumerate(full_order) if all(a == "*" or a == b for a, b in zip(k, full)))
        changed = True
        while changed:
            changed = False
            for vi in range(len(var_sels)):
                groups, order, keep = {}, [], []
                for k, o in items:
                    if k[vi] == "*":
                        keep.append((k, o))
                        continue
                    g = (tuple(k[:vi] + k[vi + 1:]), o)
                    if g not in groups:
                        groups[g] = []
                        order.append(g)
                    groups[g].append(k)
                new = list(keep)
                for g in order:
                    ks = groups[g]
                    if sorted(k[vi] for k in ks) == sorted(names[vi]):
                        rest = list(g[0])
                        new.append((rest[:vi] + ["*"] + rest[vi:], g[1]))
                        changed = True
                    else:
                        new.extend((k, g[1]) for k in ks)
                items = sorted(new, key=lambda ko: first_idx(ko[0]))
        full = {tuple(r["states"][s["id"]] for s in var_sels): tuple(val(r, o[0], o[1]) for o in var_outs) for r in rows}
        seen = set()
        for k, o in items:
            for combo in itertools.product(*[names[i] if x == "*" else [x] for i, x in enumerate(k)]):
                if combo in seen or full.get(combo) != o:
                    raise SystemExit("a tömör állapottábla nem egyenértékű a teljes táblával")
                seen.add(combo)
        if seen != set(full):
            raise SystemExit("a tömör állapottábla hiányos")
    for k, o in items:
        cells = ["bármely" if x == "*" else state_cell(s, x) for s, x in zip(var_sels, k)]
        cells += [word(t[0], v) for t, v in zip(var_outs, o)]
        lines.append("| " + " | ".join(cells) + " |")
    types = {c.get("type") for c in nl.comps.values()}
    n = rep["combinations"]
    fixed = [f"{s['label']}: {state_cell(s, s['states'][0]['name'])}" for s in fixed_sels]
    fixed += [f"{o[2].removesuffix(': kiold?') if o[0] == 'trip' else o[2]}: {word(o[0], val(rows[0], o[0], o[1])).replace('**', '')}"
              for o in const_outs] if rows else []  # [vedelmek-bovites v5]
    txt = (f"_A táblázatot a szimulátor számolta a(z) `{rep['id']}` netlistából (ujjlenyomat: `{rep['fingerprint']}`): "
           f"{n} állapotkombináció, mindegyik egyezik a várt működéssel"
           + (" (a „bármely” sor az adott elem minden állására érvényes)" if compact and var_sels else "") + ". "
           + ("Minden sorban azonos: " + "; ".join(fixed) + ". " if fixed else "")
           + "Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig és védőérintkezőig folytonos, "
           "és nem halad át kapcsolón; a kismegszakító" + (" és a kapcsoló" if any(t and t.startswith(SWITCH_PREFIX) for t in types) else "")
           + " csak a fázist bontja")
    if types & RCD_TYPES:
        txt += ("; a nullavezetőt csak a kétpólusú áram-védőkapcsoló bontja, a fázisvezetővel együtt; normál üzemben"
                + (" (hibahelyzet, érintés és próbagomb nélkül)" if nl._scenario_sels() else "")
                + " nem folyik különbözeti áram. „Kiold”: a védett oldalról a pólusokat megkerülve (a védővezetőn, a földön "
                "vagy a próbaellenálláson át) áram folyik; áramerősséget, érintési feszültséget és kioldási időt a szimuláció nem számol._")
    else:
        txt += "._"
    return "\n".join(lines) + "\n\n" + txt


def load(path) -> Netlist:
    with open(path, encoding="utf-8") as fh:
        return Netlist(json.load(fh), path)


def analyse(path):
    nl = load(path)
    rep = nl.run()
    return nl, rep


# --- cikkblokkok -----------------------------------------------------------------------------------
BLOCK_RE = re.compile(r"(<!-- sim:(?P<kind>[a-z]+) (?P<args>[^>]*?)-->\n)(?P<body>.*?)(<!-- /sim:(?P=kind) -->)", re.S)


def render_block(kind, args, base):
    srcs = re.findall(r"src=(\S+)", args)
    items = [analyse(os.path.join(base, s)) for s in srcs]
    if not items:
        raise SystemExit(f"sim-blokk forrás nélkül: {kind} {args}")
    bad = [rep["id"] for _, rep in items if not rep["pass"]]
    if bad:
        raise SystemExit(f"FAIL netlista nem kerülhet cikkbe: {bad}")
    nl, rep = items[0]
    if kind == "allapotok":
        m = re.search(r"vetites=(\w+):(\S+)", args)
        if m:
            return md_projection(nl, rep, m.group(1), m.group(2).split(","))
        return md_states(nl, rep, compact="tomor" in args.split())  # [vedelmek-bovites v1]
    if kind == "vezetekek":
        return md_wires(nl)
    if kind == "szakaszok":
        return md_sections(nl, rep)
    if kind == "valtozatok":
        return md_variants(items)
    if kind == "osszehasonlitas":
        return md_compare(items)
    raise SystemExit(f"ismeretlen sim-blokk: {kind}")


def process_article(path, update=False):
    base = os.path.dirname(os.path.abspath(path))
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    problems = []
    count = 0

    def repl(m):
        nonlocal count
        count += 1
        body = render_block(m.group("kind"), m.group("args"), base) + "\n"
        if body != m.group("body"):
            problems.append(f"{path}: a(z) sim:{m.group('kind')} {m.group('args').strip()} blokk eltér a szimuláció kimenetétől")
        return m.group(1) + body + m.group(5)

    new = BLOCK_RE.sub(repl, text)
    if update and new != text:
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(new)
        problems = []
    return count, problems


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("files", nargs="+")
    g = ap.add_mutually_exclusive_group()
    g.add_argument("--json", action="store_true")
    g.add_argument("--md", action="store_true")
    g.add_argument("--check-article", action="store_true")
    g.add_argument("--update-article", action="store_true")
    a = ap.parse_args(argv)
    if a.check_article or a.update_article:
        bad = 0
        for p in a.files:
            n, probs = process_article(p, update=a.update_article)
            for pr in probs:
                print("ELTÉRÉS:", pr)
            bad += len(probs)
            print(f"{'OK  ' if not probs else 'HIBA'} {p}: {n} sim-blokk{' (frissítve)' if a.update_article else ''}")
        return 1 if bad else 0
    reports = []
    fails = 0
    for p in a.files:
        nl, rep = analyse(p)
        reports.append(rep)
        if not rep["pass"]:
            fails += 1
        if a.md:
            print(f"## {rep['id']}\n\n### Kapcsolóállások\n\n{md_states(nl, rep)}\n\n### Vezetékek\n\n{md_wires(nl)}\n\n### Szakaszok\n\n{md_sections(nl, rep)}\n")
        elif not a.json:
            status = "PASS" if rep["pass"] else "FAIL"
            on = sum(1 for r in rep["rows"] for v in r["lamps"].values() if v)
            print(f"{status} {rep['id']} ({os.path.basename(p)}): {len(nl.selectors)} választó, {rep.get('combinations', 0)} állás, "
                  f"{len(nl.loads)} fogyasztó, {on} ég-állapot, ujjlenyomat {rep['fingerprint']}")
            for e in rep["errors"]:
                print("   HIBA", e)
            for w in rep["warnings"]:
                print("   figyelmeztetés", w)
    if a.json:
        print(json.dumps(reports, ensure_ascii=False, indent=1))
    return 1 if fails else 0


# [foldeles-bovites v1] – földelési rendszerek (TN-C, TN-S, TN-C-S, TT, IT) és EPH: csak az "earthing" mezős
# netlistákra hat (foldeles_ext.py); a többi netlista feldolgozása változatlan.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import foldeles_ext  # noqa: E402
foldeles_ext.install(sys.modules[__name__])

# [vedelmek-biztonsag v1] – független biztonsági ellenőr: készülékmodellek (S9), dugalj PE-kapcsa (I2), feszültségmentesnek
# jelzett dugalj fázison (I4), túláramvédelem (I15), FI-védelem a dugaljakon (I16), próbagomb (I17); csak a védelmi
# netlistákra hat (vedelmek_biztonsag.py), a kapcsolási és a földelési netlisták eredménye változatlan.
import vedelmek_biztonsag  # noqa: E402
vedelmek_biztonsag.install(sys.modules[__name__])

if __name__ == "__main__":
    sys.exit(main())
