#!/usr/bin/env python3
"""[foldeles-bovites v1] – földelési rendszerek (TN-C, TN-S, TN-C-S, TT, IT) és egyenpotenciálra hozás (EPH)
a sim.py netlista-szimulátorhoz.

A sim.py a modul végén az install() hívással kapcsolja be. Csak azokra a netlistákra hat, amelyeknek van
"earthing" mezőjük; a többi netlista (kapcsolások, védelmek) feldolgozása változatlan (visszafelé kompatibilis).

Netlista-bővítés (kb-netlista/1):
  "earthing": {"system": "TN-C"|"TN-S"|"TN-C-S"|"TT"|"IT"}
  "breaks":   [{"id","label","wire":<vezeték-id>,"states":[{"name","label"?},{"name","label"?,"broken":true}]}]
              vezetőszakadás mint hibahelyzet-választó (az első állapot az ép állapot); nem kapcsoló
  "touch":    [{"id","label","a":"komp.kapocs","b":"komp.kapocs"}] – feltételezett érintés (emberi test a két pont
              között); csak az érintési eredményt adja, a többi kimenetet nem befolyásolja
  "compare":  [{"label","states":{...}}] – a gyűjtő összehasonlító táblázat (sim:foldelesek) sorválasztói; a meg nem
              adott választók a normál (első) állapotukban
  Komponensek: "tap" (táppont: L1/L2/L3 és a csillagpont – szerepe N vagy PEN; TN-S-nél N és PE híddal),
  "foldelo" (földelő, kapocs: FK; impedancia a kapocs és a talaj között), "fold" (talaj, E),
  "pen-szetvalaszto" (TN-C-S: PEN → N + PE híddal), "pen-kapocs" (TN-C: a fogyasztó N- és PE-kapcsa a PEN-en),
  "idegen" (idegen vezetőképes rész, pl. fém vízvezeték; kapocsszerep: idegen; "earthContact": true → impedancia a
  talaj felé; "bonded": true → normál állapotban EPH-val a védővezető-rendszerhez kötött),
  "szigetelesfigyelo" (IT; megfigyelő, nem vezet), "hibaut" (testzárlat: impedancia fázis és fémház között; első
  állapota inaktív), "fogyaszto"/"lampa" (több fázisú is: csillagkapcsolású impedancia az aktív kapcsok között),
  "kismegszakito" (túláramvédelem, több pólusú is), "fi-rele" (poles), sínek és kapcsok (pe-sin, n-sin,
  fofoldelo-sin, kotodoboz, sorkapocs, kotoelem).
  Vezetők: L, L1 (barna), L2 (fekete), L3 (szürke), N (kék), PE (zöld-sárga), PEN (zöld-sárga vagy kék),
  "földelővezető" (zöld-sárga; egyik vége földelőkapocs), "EPH-vezető" (zöld-sárga; PE- és idegen vezetőképes
  rész között); nem valódi ér: "hibahely", "érintés", "belső".

Modell: a vezetők ideálisak (egy hálózatba vonva); impedancia a fogyasztó, a hibahely, a földelő (és a talajjal
  érintkező idegen rész), valamint az érintési pontra feltételezett emberi test. Egy impedancián akkor folyhat áram,
  ha rajta át egyszerű út vezet két különböző potenciálú táppont-kapocs (L1, L2, L3, csillagpont) között – a szokásos
  áramút-feltétel általános (nem kiegyenlített) ellenállásértékekre. Áramerősséget, hibafeszültséget, lekapcsolási
  időt nem számol.

Kimenetek (truthTable soronként, a meglévők mellett):
  lamps        fogyasztó normál üzemben (fémes kapcsolat minden aktív kapcsán, különböző potenciálokra)
  consumers    mukodik | rendellenes (áram csak a földön át) | nem-mukodik
  loops        hibahelyenként: nincs-hiba | femes (csak vezetőkön át) | fold (földelési ellenálláson át) | nincs-hurok
  trips        FI-relé: különbözeti áram (a védett oldalról a pólusokat megkerülve folyó áram)
  overcurrent  túláramvédelem: egy fémes hibahurokban sorosan van (lekapcsolhat; a hurokimpedancia dönt)
  imd          szigetelésfigyelő: aktív vezető és védővezető/föld közötti szigetelési hiba
  touch        nincs | lekapcsolasig | erintesre | tartosan – áram folyhat-e a feltételezett emberen át, vagy a fémház a
               hibaáram útjában van (vezető-feszültségesés); ha igen: lekapcsolasig = egy, a hiba miatt ember nélkül is
               működő védelem nyitása megszünteti; erintesre = csak az emberen át folyó áram oldaná ki a FI-relét (a hiba
               magától fennmarad); tartosan = semmi nem szünteti meg ([ellenor v1])
Invariánsok (hibakódok):
  E1 rendszerjellemzők (üzemi földelés; PEN és szétválasztása; PE a csillagponton vagy a helyi földelőn; IT-ben
     a csillagpont nincs közvetlenül földelve); E2 a PE és a PEN nem kapcsolt, a kismegszakító csak fázist, a FI-relé
     fázist és nullát bont; E3 minden I. osztályú fogyasztónak van védővezetője; E4 zárlatmentesség vezetőkkel minden
     állásban (két táppont-kapocs egy hálózaton, ill. [ellenor v1] fázisvezető egy hálózaton nulla-, PE-, PEN-,
     földelő-, idegen vagy talaj-kapoccsal – IT/TT-ben a PE-hálózatnak nincs táppont-címkéje, ezért ez külön kell); E5 normál állapot (működik, nincs hiba, nincs kioldás, nincs érintési feszültség); E6 vezetőszín és
     kapocsszerep; E7 a FI-relé védett oldala nem kerüli meg a pólusokat; I10 egyezés a truthTable-lel.
"""
from __future__ import annotations

import itertools
import os
import re

SYSTEMS = ("TN-C", "TN-S", "TN-C-S", "TT", "IT")
SOIL = "__talaj__"
PHASE_ROLES = ("L1", "L2", "L3")

ROLE_CLASS_E = {"L": "fazis", "L1": "fazis", "L2": "fazis", "L3": "fazis", "N": "nulla", "PE": "pe", "PEN": "pen",
                "FK": "foldelo", "E": "fold", "idegen": "idegen"}
# vezető → (osztály, megengedett színek)
CONDUCTORS_E = {
    "L": ("fazis", {"barna", "fekete", "szürke"}), "L1": ("fazis", {"barna"}), "L2": ("fazis", {"fekete"}),
    "L3": ("fazis", {"szürke"}), "N": ("nulla", {"kék"}), "PE": ("pe", {"zöld-sárga"}),
    "PEN": ("pen", {"zöld-sárga", "kék"}), "földelővezető": ("foldelovezeto", {"zöld-sárga"}),
    "EPH-vezető": ("eph", {"zöld-sárga"}),
}
VIRTUAL_E = {"hibahely", "érintés", "belső"}

T_SOURCE = "tap"
T_LOADS = {"fogyaszto", "lampa"}
T_OCPD = {"kismegszakito"}
T_RCD = {"fi-rele"}
T_FAULT = {"hibaut"}
T_ELECTRODE = {"foldelo"}
T_EARTH = {"fold"}
T_EXTRANEOUS = {"idegen"}
T_IMD = {"szigetelesfigyelo"}
T_SPLIT = "pen-szetvalaszto"
T_PENTERM = "pen-kapocs"
T_PASSIVE = {T_SPLIT, T_PENTERM, "pe-sin", "n-sin", "fofoldelo-sin", "kotodoboz", "sorkapocs", "kotoelem"}
KNOWN_E = {T_SOURCE} | T_LOADS | T_OCPD | T_RCD | T_FAULT | T_ELECTRODE | T_EARTH | T_EXTRANEOUS | T_IMD | T_PASSIVE

WORDS = {
    "consumers": {"mukodik": "**működik**", "rendellenes": "rendellenesen (a földön át)", "nem-mukodik": "nem működik"},
    "loops": {"nincs-hiba": "nincs hiba", "femes": "**fémes hurok**", "fold": "**a földön át**", "nincs-hurok": "nincs zárt hurok"},
    "trips": {True: "**kiold**", False: "nem old ki"},
    "overcurrent": {True: "**lekapcsolhat**", False: "nem"},
    "imd": {True: "**jelez**", False: "nem jelez"},
    "touch": {"nincs": "nincs", "lekapcsolasig": "**veszélyes lehet** a lekapcsolásig",
              "erintesre": "**veszélyes lehet, tartósan**; a FI-relé legfeljebb a testen átfolyó áramra old ki",
              "tartosan": "**veszélyes lehet, tartósan**"},
}
# [ellenor v1] a fázisvezető hálózata vezetővel (vezeték, belső híd, kapcsolóállás) nem érintkezhet ezekkel
NOT_WITH_PHASE = {"nulla", "pe", "pen", "foldelo", "fold", "idegen"}
VALUES = {"consumers": set(WORDS["consumers"]), "loops": set(WORDS["loops"]), "touch": set(WORDS["touch"])}
OUT_KEYS = ("lamps", "consumers", "loops", "trips", "overcurrent", "imd", "touch")


def carrying(labels: dict, edges: list) -> set:
    """Áramút-feltétel: az élek (eid, u, v) közül azok, amelyeken át egyszerű út vezet két különböző címkéjű
    forráscsomópont között (a forráscsomóponton az út nem halad át). labels: csomópont → potenciálcímke."""
    adj: dict = {}
    for eid, u, v in edges:
        if u == v:
            continue
        adj.setdefault(u, []).append((eid, v))
        adj.setdefault(v, []).append((eid, u))
    res: set = set()

    def dfs(node, lab, visited, path):
        for eid, w in adj.get(node, ()):
            if w in visited:
                continue
            if w in labels:
                if labels[w] != lab:
                    res.update(path)
                    res.add(eid)
                continue
            visited.add(w)
            path.append(eid)
            dfs(w, lab, visited, path)
            path.pop()
            visited.discard(w)

    for s, lab in labels.items():
        dfs(s, lab, {s}, [])
    return res


def install(sim):
    """Bekapcsolja a bővítést a megadott sim modulban (load, md_states, render_block kiegészítése)."""
    if getattr(sim, "_foldeles_installed", False):
        return
    sim._foldeles_installed = True
    sim.ROLE_CLASS.setdefault("PEN", "pen")  # csak megjelenítéshez; a bővítés saját táblát használ
    sim.KNOWN_TYPES |= KNOWN_E

    class EarthingNetlist(sim.Netlist):
        """Földelési netlista: saját szerkezeti ellenőrzés és kiértékelés; a megjelenítő segédek (md_wires,
        section_report, tlabel) a sim.Netlist-ből öröklődnek."""

        # --- szerkezet ---------------------------------------------------------------------------
        def _structure(self):
            d = self.data
            self.earthing = d.get("earthing") or {}
            self.system = self.earthing.get("system")
            for k in ("id", "title", "components", "wires", "truthTable"):
                if k not in d:
                    self.err("S0", f"hiányzó mező: {k}")
            if d.get("format", sim.FORMAT) != sim.FORMAT:
                self.warnings.append(f"ismeretlen formátum: {d.get('format')}")
            if self.system not in SYSTEMS:
                self.err("E1", f"ismeretlen földelési rendszer: {self.system!r} (várt: {', '.join(SYSTEMS)})")
            for c in d.get("components", []):
                cid = c.get("id")
                if not cid or cid in self.comps or "." in str(cid):
                    self.err("S1", f"hiányzó, ismétlődő vagy pontot tartalmazó komponens-id: {cid!r}")
                    continue
                self.comps[cid] = c
                if c.get("type") not in KNOWN_E:
                    self.warnings.append(f"ismeretlen komponenstípus: {cid} ({c.get('type')})")
                seen = set()
                for t in c.get("terminals", []):
                    tid = t.get("id")
                    if not tid or tid in seen:
                        self.err("S1", f"hiányzó vagy ismétlődő kapocs-id: {cid}.{tid}")
                        continue
                    seen.add(tid)
                    if t.get("role") not in ROLE_CLASS_E:
                        self.err("S2", f"ismeretlen kapocsszerep: {cid}.{tid} ({t.get('role')})")
                    self.terms[f"{cid}.{tid}"] = t
                    self.term_comp[f"{cid}.{tid}"] = c
                for grp in c.get("bridges", []):
                    for t in grp:
                        if f"{cid}.{t}" not in self.terms:
                            self.err("S1", f"ismeretlen kapocs a belső összeköttetésben: {cid}.{t}")
            self.cls = {k: ROLE_CLASS_E.get(t.get("role")) for k, t in self.terms.items()}
            byt = lambda ts: [c for c in self.comps.values() if c.get("type") in ts]  # noqa: E731
            self.taps = byt({T_SOURCE})
            self.loads = byt(T_LOADS)
            self.ocpds, self.rcds, self.faults = byt(T_OCPD), byt(T_RCD), byt(T_FAULT)
            self.electrodes, self.extraneous, self.imds = byt(T_ELECTRODE), byt(T_EXTRANEOUS), byt(T_IMD)
            self.splits, self.penterms = byt({T_SPLIT}), byt({T_PENTERM})
            self._selectors()
            self._check_components()
            self._check_wires()
            self.touch = []
            for tp in d.get("touch", []) or []:
                if not tp.get("id") or tp.get("a") not in self.terms or tp.get("b") not in self.terms:
                    self.err("S8", f"hibás érintési pont: {tp}")
                    continue
                self.touch.append(tp)
            self.all_pole = set()

        def _selectors(self):
            self.selectors = []
            for c in self.comps.values():
                if c.get("keys"):
                    self.err("S6", f"{c['id']}: a földelési netlistában nincs többbillentyűs választó")
                if c.get("states") is None:
                    if c.get("type") in T_FAULT or c.get("type", "").startswith(sim.SWITCH_PREFIX) or c.get("type") in T_OCPD | T_RCD:
                        self.err("S6", f"{c['id']}: hiányzó állapotok (states)")
                    continue
                states = c["states"]
                names = [s.get("name") for s in states]
                if not states or len(set(names)) != len(names) or None in names:
                    self.err("S6", f"{c['id']}: üres vagy ismétlődő állapotnevek")
                    continue
                for s in states:
                    for pair in s.get("connect", []):
                        if len(pair) != 2 or any(f"{c['id']}.{t}" not in self.terms for t in pair):
                            self.err("S6", f"{c['id']}/{s.get('name')}: hibás kapocspár {pair}")
                scen = c.get("type") in T_FAULT or bool(c.get("scenario"))
                if c.get("type") in T_FAULT:
                    if any(not isinstance(s.get("active"), bool) for s in states):
                        self.err("S6", f"{c['id']}: a hibahely állapotainak active (igen/nem) mező kell")
                    elif states[0]["active"]:
                        self.err("E5", f"{c['id']}: a hibahely első (normál) állapota nem lehet aktív")
                self.selectors.append({"id": c["id"], "comp": c["id"], "key": None, "states": states,
                                       "label": c.get("label", c["id"]), "scenario": scen, "kind": "comp"})
            wids = {(w.get("id") or f"#{i + 1}") for i, w in enumerate(self.data.get("wires", []))}
            self.break_wire = {}
            for b in self.data.get("breaks", []) or []:
                bid = b.get("id")
                states = b.get("states") or []
                names = [s.get("name") for s in states]
                if not bid or bid in self.comps or any(s["id"] == bid for s in self.selectors):
                    self.err("S6", f"szakadás: hiányzó vagy ütköző azonosító {bid!r}")
                    continue
                if b.get("wire") not in wids:
                    self.err("S6", f"{bid}: ismeretlen vezeték {b.get('wire')!r}")
                    continue
                if len(states) < 2 or len(set(names)) != len(names) or None in names:
                    self.err("S6", f"{bid}: legalább két, egyedi nevű állapot kell")
                    continue
                if states[0].get("broken"):
                    self.err("E5", f"{bid}: az első (normál) állapot nem lehet szakadt")
                if not any(s.get("broken") for s in states):
                    self.err("S6", f"{bid}: nincs szakadt állapot")
                self.break_wire[bid] = b["wire"]
                self.selectors.append({"id": bid, "comp": None, "key": None, "states": states,
                                       "label": b.get("label", bid), "scenario": True, "kind": "break"})

        def _check_components(self):
            sysname = self.system
            if len(self.taps) != 1:
                self.err("S5", f"pontosan egy táppont (tap) kell, van: {len(self.taps)}")
                self.star = None
            else:
                tp = self.taps[0]
                roles = [t.get("role") for t in tp.get("terminals", [])]
                stars = [t for t in tp.get("terminals", []) if t.get("role") in ("N", "PEN")]
                if not any(r in PHASE_ROLES for r in roles):
                    self.err("S5", f"{tp['id']}: a táppontnak fázis kapcsa (L1/L2/L3) kell")
                if len(stars) != 1:
                    self.err("S5", f"{tp['id']}: pontosan egy csillagpont-kapocs (N vagy PEN) kell")
                    self.star = None
                else:
                    self.star = f"{tp['id']}.{stars[0]['id']}"
                    want = "PEN" if sysname in ("TN-C", "TN-C-S") else "N"
                    if stars[0]["role"] != want:
                        self.err("E1", f"{sysname}: a táppont csillagpont-kapcsának szerepe {want} legyen ({self.star})")
                    pes = [t for t in tp["terminals"] if t.get("role") == "PE"]
                    if sysname == "TN-S":
                        if len(pes) != 1 or not any({stars[0]["id"], pes[0]["id"]} <= set(g) for g in tp.get("bridges", [])):
                            self.err("E1", "TN-S: a táppontnál a PE a csillagpontban (híddal) kapcsolódik az N-hez")
                    elif pes:
                        self.err("E1", f"{sysname}: a táppontnak nincs külön PE-kapcsa")
            for ld in self.loads:
                roles = [t.get("role") for t in ld.get("terminals", [])]
                act = [r for r in roles if ROLE_CLASS_E.get(r) in ("fazis", "nulla")]
                if len(act) < 2 or not any(ROLE_CLASS_E.get(r) == "fazis" for r in act):
                    self.err("S5", f"{ld['id']}: a fogyasztónak legalább két aktív kapcsa kell, köztük fázis")
                if ld.get("class") != "II" and roles.count("PE") != 1:
                    self.err("E3", f"{ld['id']}: I. osztályú (fémházas) fogyasztó PE-kapocs nélkül")
            for c in self.faults:
                ts = c.get("terminals", [])
                if len(ts) != 2 or self.cls.get(f"{c['id']}.{ts[0].get('id')}") != "fazis" or self.cls.get(f"{c['id']}.{ts[1].get('id')}") != "pe":
                    self.err("S7", f"{c['id']}: a testzárlat két kapcsa: fázisoldali (a) és fémház (PE, b)")
            for c in self.electrodes:
                if [t.get("role") for t in c.get("terminals", [])] != ["FK"]:
                    self.err("S7", f"{c['id']}: a földelőnek egy kapcsa van (FK)")
            for c in self.extraneous:
                if [t.get("role") for t in c.get("terminals", [])] != ["idegen"]:
                    self.err("S7", f"{c['id']}: az idegen vezetőképes résznek egy kapcsa van (idegen)")
            for c in self.splits + self.penterms:
                roles = sorted(t.get("role") for t in c.get("terminals", []))
                if roles != ["N", "PE", "PEN"] or not any(len(g) == 3 for g in c.get("bridges", [])):
                    self.err("S7", f"{c['id']}: PEN-, N- és PE-kapocs kell, egy belső összeköttetéssel")
            # E2 – kapcsolókészülékek: a PE és a PEN nem kapcsolt; túláramvédelem csak fázist, FI fázist és nullát
            for sel in self.selectors:
                if sel["kind"] != "comp" or sel["scenario"]:
                    continue
                c = self.comps[sel["comp"]]
                for s in sel["states"]:
                    for pair in s.get("connect", []):
                        cl = {self.cls.get(f"{c['id']}.{t}") for t in pair}
                        if cl & {"pe", "pen"}:
                            self.err("E2", f"{c['id']}/{s['name']}: a kapcsolókészülék a védővezetőt vagy a PEN-t kapcsolja {pair}")
                        elif c.get("type") in T_OCPD and cl != {"fazis"}:
                            self.err("E2", f"{c['id']}/{s['name']}: a túláramvédelem csak fázisvezetőt bonthat {pair}")
                        elif len(cl) != 1 or not cl <= {"fazis", "nulla"}:
                            self.err("E2", f"{c['id']}/{s['name']}: eltérő szerepű kapcsok összekötése {pair}")
            for c in self.rcds:
                poles = c.get("poles") or []
                if not poles:
                    self.err("S7", f"{c['id']}: az áram-védőkapcsolónak meg kell adni a pólusait")
                for p in poles:
                    if len(p) != 2 or any(f"{c['id']}.{t}" not in self.terms for t in p):
                        self.err("S7", f"{c['id']}: hibás pólus {p}")
                        continue
                    cl = {self.cls[f"{c['id']}.{t}"] for t in p}
                    if cl & {"pe", "pen"}:
                        self.err("E2", f"{c['id']}: a PEN vagy a PE nem haladhat át az áram-védőkapcsolón {p}")
                    elif len(cl) != 1:
                        self.err("E2", f"{c['id']}: a pólus két kapcsa eltérő szerepű {p}")

        def _check_wires(self):
            self.sections = {}
            for s in self.data.get("sections", []) or []:
                if s.get("id") in self.sections:
                    self.err("S4", f"ismétlődő szakasz: {s.get('id')}")
                self.sections[s.get("id")] = s
            seen = set()
            for i, w in enumerate(self.data.get("wires", [])):
                wid = w.get("id") or f"#{i + 1}"
                if wid in seen:
                    self.err("S3", f"ismétlődő vezeték-id: {wid}")
                seen.add(wid)
                if w.get("from") not in self.terms or w.get("to") not in self.terms:
                    self.err("S3", f"{wid}: ismeretlen végpont")
                    continue
                cond, col = w.get("conductor"), w.get("color")
                ca, cb = self.cls[w["from"]], self.cls[w["to"]]
                if cond in VIRTUAL_E:
                    if col is not None or w.get("section") is not None:
                        self.err("S3", f"{wid}: a(z) „{cond}” kapcsolat nem valódi ér: nincs színe és szakasza")
                    if ca != cb:
                        self.err("E6", f"{wid}: a(z) „{cond}” kapcsolat eltérő szerepű kapcsokat köt ({w['from']}, {w['to']})")
                    continue
                if cond not in CONDUCTORS_E:
                    self.err("S3", f"{wid}: ismeretlen vezető {cond!r}")
                    continue
                kind, colors = CONDUCTORS_E[cond]
                if col not in colors:
                    self.err("E6", f"{wid}: {cond} vezető {col!r} színnel (megengedett: {', '.join(sorted(colors))})")
                ends = {ca, cb}
                if kind in ("fazis", "nulla", "pe", "pen"):
                    if ends != {kind}:
                        self.err("E6", f"{wid}: {cond} vezető {ca}/{cb} szerepű kapcsokat köt ({w['from']}, {w['to']})")
                elif kind == "foldelovezeto":
                    other = [k for k in (w["from"], w["to"]) if self.cls[k] != "foldelo"]
                    if len(other) != 1:
                        self.err("E6", f"{wid}: a földelővezető egyik vége földelőkapocs, a másik nem")
                    else:
                        o = other[0]
                        ok = self.cls[o] in ("pe", "pen") or (self.cls[o] == "nulla" and o == self.star)
                        if not ok:
                            self.err("E6", f"{wid}: a földelővezető csak PE-, PEN- vagy (a táppontnál) csillagpont-kapocsra köthető ({o})")
                elif kind == "eph":
                    if not ends <= {"pe", "idegen"} or "pe" not in ends:
                        self.err("E6", f"{wid}: az EPH-vezető PE-kapcsot köt idegen vezetőképes részhez vagy PE-kapcsot PE-kapocshoz")
                comp_a, comp_b = self.term_comp[w["from"]], self.term_comp[w["to"]]
                if comp_a is comp_b:
                    self.err("S3", f"{wid}: komponensen belüli vezeték (használj bridges mezőt)")
                if self.sections:
                    la, lb = comp_a.get("at", comp_a["id"]), comp_b.get("at", comp_b["id"])
                    sec = w.get("section")
                    if la == lb:
                        if sec is not None:
                            self.err("S4", f"{wid}: helyen belüli vezeték nem tartozhat szakaszhoz ({sec})")
                    elif sec not in self.sections:
                        self.err("S4", f"{wid}: hiányzó vagy ismeretlen szakasz {sec!r}")
                    elif {self.sections[sec].get("from"), self.sections[sec].get("to")} != {la, lb}:
                        self.err("S4", f"{wid}: a szakasz ({sec}) nem a vezeték két végét köti ({la}–{lb})")

        # --- hálózat és kiértékelés --------------------------------------------------------------
        def normal(self):
            return {s["id"]: s["states"][0]["name"] for s in self.selectors}

        def _state(self, sel, combo):
            return next(s for s in sel["states"] if s["name"] == combo[sel["id"]])

        def nets(self, combo, open_comps=(), skip_bridges=(), keep_broken=False):
            uf = sim.UF(list(self.terms) + [SOIL])
            broken = set()
            if not keep_broken:
                for sel in self.selectors:
                    if sel["kind"] == "break" and self._state(sel, combo).get("broken"):
                        broken.add(self.break_wire[sel["id"]])
            for i, w in enumerate(self.data.get("wires", [])):
                if (w.get("id") or f"#{i + 1}") in broken:
                    continue
                if w.get("from") in self.terms and w.get("to") in self.terms:
                    uf.union(w["from"], w["to"])
            for c in self.comps.values():
                if c["id"] not in skip_bridges:
                    for grp in c.get("bridges", []):
                        ks = [f"{c['id']}.{t}" for t in grp if f"{c['id']}.{t}" in self.terms]
                        for k in ks[1:]:
                            uf.union(ks[0], k)
                if c.get("type") in T_EARTH:
                    for t in c.get("terminals", []):
                        uf.union(SOIL, f"{c['id']}.{t['id']}")
            for sel in self.selectors:
                if sel["kind"] != "comp" or sel["comp"] in open_comps:
                    continue
                for a, b in self._state(sel, combo).get("connect", []):
                    ka, kb = f"{sel['comp']}.{a}", f"{sel['comp']}.{b}"
                    if ka in self.terms and kb in self.terms:
                        uf.union(ka, kb)
            return uf

        def _labels(self, f, combo=None, viol=None):
            labels = {}
            if not self.taps:
                return labels
            tp = self.taps[0]
            for t in tp.get("terminals", []):
                r = t.get("role")
                lab = r if r in PHASE_ROLES else ("L1" if r == "L" else "0")
                n = f(f"{tp['id']}.{t['id']}")
                if n in labels and labels[n] != lab and viol is not None:
                    viol("E4", f"zárlat vezetőkkel: {labels[n]}–{lab} egy hálózaton ({combo})")
                labels.setdefault(n, lab)
            return labels

        def _elements(self, combo, f):
            els = []
            for ld in self.loads:
                act = [f"{ld['id']}.{t['id']}" for t in ld["terminals"] if ROLE_CLASS_E.get(t.get("role")) in ("fazis", "nulla")]
                hub = f"@{ld['id']}"
                els.append({"id": ld["id"], "kind": "load", "terms": act,
                            "edges": [(f"{ld['id']}#{i}", hub, f(k)) for i, k in enumerate(act)]})
            for c in self.faults:
                sel = next(s for s in self.selectors if s["comp"] == c["id"])
                if not self._state(sel, combo).get("active"):
                    continue
                a, b = (f"{c['id']}.{t['id']}" for t in c["terminals"])
                els.append({"id": c["id"], "kind": "fault", "terms": [a, b], "a": a, "b": b,
                            "edges": [(c["id"], f(a), f(b))]})
            for c in self.electrodes + [x for x in self.extraneous if x.get("earthContact")]:
                k = f"{c['id']}.{c['terminals'][0]['id']}"
                els.append({"id": c["id"], "kind": "electrode", "terms": [k, SOIL], "edges": [(c["id"], f(k), f(SOIL))]})
            return els

        @staticmethod
        def _edges(els, kinds=None):
            return [e for el in els if kinds is None or el["kind"] in kinds for e in el["edges"]]

        def _rcd_trip(self, combo, rcd, carrying_ids, els, viol=None, tag=""):
            sel = next((s for s in self.selectors if s["comp"] == rcd["id"]), None)
            closed = {tuple(p) for p in (self._state(sel, combo).get("connect", []) if sel else [])}
            closed |= {(b, a) for a, b in closed}
            poles = [tuple(p) for p in rcd.get("poles", [])]
            if not poles or not all(p in closed for p in poles):
                return False
            zf = self.nets(combo, open_comps={rcd["id"]}).find
            zone = {zf(f"{rcd['id']}.{ld}") for _, ld in poles}
            supply = {zf(f"{rcd['id']}.{sp}") for sp, _ in poles}
            srcs = [f"{self.taps[0]['id']}.{t['id']}" for t in self.taps[0].get("terminals", [])] if self.taps else []
            bypass = bool(zone & supply) or any(zf(s) in zone for s in srcs) or zf(SOIL) in zone
            if bypass and viol is not None:
                viol("E7", f"{rcd['id']}: a védett oldal a FI-relé pólusait megkerülve is a táp oldallal vagy a földdel érintkezik ({tag})")
            for el in els:
                if el["id"] not in carrying_ids:
                    continue
                inside = {(zf(t) if t != SOIL else zf(SOIL)) in zone for t in el["terms"]}
                if len(inside) > 1 or (bypass and True in inside):
                    return True
            return False

        def _touch_hazard(self, combo, tp, open_comps=()):
            """[ellenor v1] Az érintési pont veszélyes-e (áram folyhat a feltételezett emberen át, vagy a fémház egy
            áramot vivő hibahely fémház felőli oldalán van) – adott készülékek nyitott állapotában is."""
            f = self.nets(combo, open_comps=set(open_comps)).find
            labels = self._labels(f)
            els = self._elements(combo, f)
            cur = carrying(labels, self._edges(els))
            carrying_ids = {el["id"] for el in els if any(e[0] in cur for e in el["edges"])}
            na, nb = f(tp["a"]), f(tp["b"])
            person = {"id": "@ember", "kind": "person", "terms": [tp["a"], tp["b"]], "edges": [("@ember", na, nb)]}
            els_p = els + [person]
            cur_p = carrying(labels, self._edges(els_p))
            through = "@ember" in cur_p
            in_fault_path = any(el["kind"] == "fault" and el["id"] in carrying_ids and f(el["b"]) in (na, nb) for el in els)
            cid_p = {el["id"] for el in els_p if any(e[0] in cur_p for e in el["edges"])}
            return (through or in_fault_path), cid_p, els_p

        def evaluate(self, combo, viol=None):
            tag = ", ".join(f"{k}={v}" for k, v in combo.items()) or "(nincs választó)"
            f = self.nets(combo).find
            if viol is not None:  # [ellenor v1] E4: fázisvezető vezetővel PE-n, földön, nullán, PEN-en, idegen részen
                groups: dict = {}
                for k in self.terms:
                    groups.setdefault(f(k), set()).add(self.cls.get(k))
                soil_root = f(SOIL)
                for root, cl in groups.items():
                    if "fazis" in cl and (cl & NOT_WITH_PHASE or root == soil_root):
                        other = sorted(cl & NOT_WITH_PHASE) or ["talaj"]
                        viol("E4", f"zárlat vezetőkkel: fázisvezető és {'/'.join(other)} szerepű kapocs egy hálózaton ({tag})")
            labels = self._labels(f, tag, viol)
            els = self._elements(combo, f)
            cur = carrying(labels, self._edges(els))
            carrying_ids = {el["id"] for el in els if any(e[0] in cur for e in el["edges"])}
            out = {}
            if self.loads:
                lamps, cons = {}, {}
                for ld in self.loads:
                    el = next(e for e in els if e["id"] == ld["id"])
                    labs = [labels.get(f(k)) for k in el["terms"]]
                    works = None not in labs and len(set(labs)) == len(labs)
                    lamps[ld["id"]] = works
                    cons[ld["id"]] = "mukodik" if works else ("rendellenes" if ld["id"] in carrying_ids else "nem-mukodik")
                out["lamps"], out["consumers"] = lamps, cons
            faults_on = [el for el in els if el["kind"] == "fault"]
            metal = carrying(labels, self._edges(els, {"fault"}))
            earthy = carrying(labels, self._edges(els, {"fault", "electrode"}))
            if self.faults:
                loops = {}
                for c in self.faults:
                    if not any(el["id"] == c["id"] for el in faults_on):
                        loops[c["id"]] = "nincs-hiba"
                    else:
                        loops[c["id"]] = "femes" if c["id"] in metal else ("fold" if c["id"] in earthy else "nincs-hurok")
                out["loops"] = loops
            oc = {}
            for dev in self.ocpds:
                sel = next(s for s in self.selectors if s["comp"] == dev["id"])
                hit = False
                if self._state(sel, combo).get("connect"):
                    fo = self.nets(combo, open_comps={dev["id"]}).find
                    lab_o = self._labels(fo)
                    els_o = self._elements(combo, fo)
                    metal_o = carrying(lab_o, self._edges(els_o, {"fault"}))
                    hit = any(out.get("loops", {}).get(fid) == "femes" and fid not in metal_o for fid in out.get("loops", {}))
                oc[dev["id"]] = hit
            if oc:
                out["overcurrent"] = oc
            trips = {r["id"]: self._rcd_trip(combo, r, carrying_ids, els, viol, tag) for r in self.rcds}
            if trips:
                out["trips"] = trips
            if self.imds:
                ins = any(labels.get(f(el["a"])) in PHASE_ROLES + ("0",) and labels.get(f(el["b"])) is None for el in faults_on)
                out["imd"] = {c["id"]: ins for c in self.imds}
            if self.touch:
                # [ellenor v1] „lekapcsolásig” csak akkor, ha egy, a hiba miatt (ember nélkül is) működő védelem
                # nyitása a veszélyt meg is szünteti; ha csak a testen átfolyó áram oldaná ki a FI-relét: „erintesre”;
                # különben „tartosan”.
                auto = [k for k, v in oc.items() if v] + [k for k, v in trips.items() if v]
                tv = {}
                for tp in self.touch:
                    haz, cid_p, els_p = self._touch_hazard(combo, tp)
                    if not haz:
                        tv[tp["id"]] = "nincs"
                    elif any(not self._touch_hazard(combo, tp, {d})[0] for d in auto):
                        tv[tp["id"]] = "lekapcsolasig"
                    elif any(r["id"] not in auto and self._rcd_trip(combo, r, cid_p, els_p)
                             and not self._touch_hazard(combo, tp, {r["id"]})[0] for r in self.rcds):
                        tv[tp["id"]] = "erintesre"
                    else:
                        tv[tp["id"]] = "tartosan"
                out["touch"] = tv
            return out, labels, f

        # --- rendszerjellemzők (E1) és normál állapot (E5) ----------------------------------------
        def _system_checks(self):
            if self.errors or self.star is None:
                return []
            ok = []
            sysname = self.system
            norm = self.normal()
            f = self.nets(norm).find
            star = f(self.star)
            soil = f(SOIL)
            el_k = {c["id"]: f(f"{c['id']}.{c['terminals'][0]['id']}") for c in self.electrodes}
            body = {ld["id"]: f(f"{ld['id']}.{t['id']}") for ld in self.loads for t in ld["terminals"] if t.get("role") == "PE"}
            pen_wires = [w for w in self.data["wires"] if w.get("conductor") == "PEN"]
            if star == soil:
                self.err("E1", "a csillagpont vezetővel a talajhoz kötött (földelőn át kell)")
            if sysname in ("TN-C", "TN-S", "TN-C-S", "TT"):
                if star in el_k.values():
                    ok.append("a csillagpont közvetlenül földelt (üzemi földelő)")
                else:
                    self.err("E1", f"{sysname}: a táppont csillagpontja nincs közvetlenül földelve")
            else:
                if star in el_k.values() or any(self.cls[k] == "pe" and f(k) == star for k in self.terms):
                    self.err("E1", "IT: a csillagpont nem lehet közvetlenül földelve vagy a védővezetőhöz kötve")
                else:
                    ok.append("a csillagpont nincs közvetlenül földelve")
            if sysname.startswith("TN"):
                bad = [lid for lid, n in body.items() if n != star]
                if bad:
                    self.err("E1", f"{sysname}: a fémház nincs vezetőn át a csillagponthoz kötve: {', '.join(bad)}")
                elif body:
                    ok.append("minden fémház vezetőn át a csillagponthoz kötött")
            else:
                bad = [lid for lid, n in body.items() if n == star or n not in el_k.values()]
                if bad:
                    self.err("E1", f"{sysname}: a fémház nem a helyi földelőn van, vagy a csillagponthoz kötött: {', '.join(bad)}")
                elif body:
                    ok.append("a fémházak védővezetője helyi földelőn van, vezetőn át nem kapcsolódik a csillagponthoz")
            places_of = lambda w: {self.term_comp[w["from"]].get("at", self.term_comp[w["from"]]["id"]),  # noqa: E731
                                   self.term_comp[w["to"]].get("at", self.term_comp[w["to"]]["id"])}
            if sysname == "TN-C":
                if not pen_wires or self.splits or not self.penterms:
                    self.err("E1", "TN-C: PEN-vezető és a fogyasztónál PEN-kapocs kell, PEN-szétválasztási pont nélkül")
                cross = [w.get("id") for w in self.data["wires"] if w.get("conductor") in ("N", "PE") and len(places_of(w)) > 1]
                if cross:
                    self.err("E1", f"TN-C: külön nulla- vagy védővezető nem futhat két hely között: {cross}")
                load_places = {ld.get("at", ld["id"]) for ld in self.loads}
                if any(c.get("at", c["id"]) not in load_places for c in self.penterms):
                    self.err("E1", "TN-C: a PEN-kapocs a fogyasztó csatlakozásánál van")
                if not self.errors:
                    ok.append("a PEN-vezető a táppontól a fogyasztó csatlakozásáig fut, külön nulla- és védővezető nélkül")
            elif sysname == "TN-C-S":
                if len(self.splits) != 1 or self.penterms:
                    self.err("E1", "TN-C-S: pontosan egy PEN-szétválasztási pont kell")
                else:
                    sp = self.splits[0]
                    g = self.nets(norm, skip_bridges={sp["id"]}).find
                    pen, n, pe = (g(f"{sp['id']}.{t['id']}") for r in ("PEN", "N", "PE") for t in sp["terminals"] if t["role"] == r)
                    st = g(self.star)
                    if pen != st:
                        self.err("E1", "TN-C-S: a szétválasztási pont PEN-kapcsa nem a csillagpontról kapja a PEN-t")
                    if n == pe:
                        self.err("E1", "TN-C-S: a szétválasztás után a nulla- és a védővezető újra egyesül")
                    if st in (n, pe):
                        self.err("E1", "TN-C-S: a szétválasztás után a nulla- vagy a védővezető a szétválasztási pontot megkerülve is a csillagponthoz kötött")
                    if any(g(w["from"]) != st or g(w["to"]) != st for w in pen_wires):
                        self.err("E1", "TN-C-S: PEN-vezető a szétválasztási pont után is van")
                    if not any(w.get("conductor") == "N" and len(places_of(w)) > 1 for w in self.data["wires"]) or \
                            not any(w.get("conductor") == "PE" and len(places_of(w)) > 1 for w in self.data["wires"]):
                        self.err("E1", "TN-C-S: a szétválasztás után külön nulla- és védővezető fut")
                    if not self.errors:
                        ok.append("a PEN-vezető egyetlen ponton válik szét, utána a nulla- és a védővezető nem egyesül újra")
            elif sysname == "TN-S":
                if pen_wires or self.splits or self.penterms:
                    self.err("E1", "TN-S: nincs PEN-vezető és PEN-szétválasztás")
                tp = self.taps[0]
                g = self.nets(norm, skip_bridges={tp["id"]}).find
                tn = [g(f"{tp['id']}.{t['id']}") for t in tp["terminals"] if t["role"] == "N"]
                tpe = [g(f"{tp['id']}.{t['id']}") for t in tp["terminals"] if t["role"] == "PE"]
                if tn and tpe and tn[0] == tpe[0]:
                    self.err("E1", "TN-S: a nulla- és a védővezető a táppont után is össze van kötve")
                elif not self.errors:
                    ok.append("a nulla- és a védővezető csak a csillagpontban kapcsolódik, külön fut a fogyasztóig")
            else:
                if pen_wires or self.splits or self.penterms:
                    self.err("E1", f"{sysname}: nincs PEN-vezető")
            if sysname == "IT" and not self.imds:
                self.warnings.append("IT: nincs szigetelésfigyelő a netlistában")
            for c in self.extraneous:
                if c.get("bonded"):
                    k = f(f"{c['id']}.{c['terminals'][0]['id']}")
                    if not any(f(x) == k for x in self.terms if self.cls[x] == "pe"):
                        self.err("E1", f"{c['id']}: az idegen vezetőképes rész normál állapotban nincs az EPH-hoz kötve")
                    elif "az idegen vezetőképes részek EPH-val a védővezető-rendszerhez kötöttek" not in ok:
                        ok.append("az idegen vezetőképes részek EPH-val a védővezető-rendszerhez kötöttek")
            return ok

        def run(self) -> dict:
            rep = {"id": self.data.get("id"), "file": self.path, "fingerprint": sim.fingerprint(self.data),
                   "system": self.system,
                   "selectors": [{"id": s["id"], "label": s["label"], "states": [x["name"] for x in s["states"]]} for s in self.selectors],
                   "loads": [ld["id"] for ld in self.loads], "rows": [], "errors": self.errors, "warnings": self.warnings,
                   "toggle": {ld["id"]: {} for ld in self.loads}}
            if any(e.startswith(("[S0]", "[S1]", "[S2]", "[S5]", "[S6]", "[S7]", "[S8]")) for e in self.errors):
                rep["pass"] = False
                rep["combinations"] = 0
                rep["sections"] = []
                return rep
            rep["verified"] = self._system_checks()
            violations: dict = {}

            def viol(code, msg):
                violations.setdefault(f"[{code}] {msg}", None)

            sel_ids = [s["id"] for s in self.selectors]
            expected = {}
            for i, row in enumerate(self.data.get("truthTable", [])):
                st = row.get("states", {})
                if set(st) != set(sel_ids) or any(st[s] not in [x["name"] for x in next(q for q in self.selectors if q["id"] == s)["states"]] for s in sel_ids):
                    self.err("I10", f"truthTable[{i}]: hibás vagy hiányos állapotmegadás {st}")
                    continue
                key = tuple(st[s] for s in sel_ids)
                if key in expected:
                    self.err("I10", f"truthTable[{i}]: ismétlődő sor {key}")
                expected[key] = row
            n = 0
            normal = self.normal()
            for prod in itertools.product(*[[x["name"] for x in s["states"]] for s in self.selectors]):
                combo = dict(zip(sel_ids, prod))
                n += 1
                out, _, _ = self.evaluate(combo, viol)
                row = {"states": combo, **out}
                exp = expected.get(prod)
                if exp is None:
                    self.err("I10", f"truthTable: hiányzó sor ({combo})")
                    row["ok"] = False
                else:
                    row["expected"] = {k: exp.get(k) for k in OUT_KEYS if k in exp or k in out}
                    row["ok"] = True
                    for k in OUT_KEYS:
                        if (k in out) != (k in exp):
                            row["ok"] = False
                            self.err("I10", f"truthTable ({combo}): a(z) „{k}” kulcs {'hiányzik' if k in out else 'fölösleges'}")
                        elif k in out and exp[k] != out[k]:
                            row["ok"] = False
                            self.err("I10", f"eltérés a truthTable-től ({combo}): {k} várt {exp[k]}, szimulált {out[k]}")
                if combo == normal:
                    bad = [k for k, v in out.get("consumers", {}).items() if v != "mukodik"]
                    bad += [k for k, v in out.get("loops", {}).items() if v != "nincs-hiba"]
                    bad += [k for k in ("trips", "overcurrent", "imd") for x, v in out.get(k, {}).items() if v]
                    bad += [k for k, v in out.get("touch", {}).items() if v != "nincs"]
                    if bad:
                        viol("E5", f"normál állapotban rendellenes kimenet: {', '.join(map(str, bad))}")
                rep["rows"].append(row)
            if len(expected) > n:
                self.err("I10", "a truthTable-ben nem létező állás is szerepel")
            self.errors.extend(violations)
            rep["combinations"] = n
            rep["sections"] = self.section_report()
            rep["pass"] = not self.errors
            return rep

        def is_protective(self):
            return False

    # --- megjelenítés ---------------------------------------------------------------------------------
    def _outputs(nl, rows):
        outs = []
        first = rows[0] if rows else {}
        for ld in nl.loads:
            outs.append(("consumers", ld["id"], ld.get("outputLabel", ld.get("label", ld["id"]))))
        for c in nl.faults:
            outs.append(("loops", c["id"], c.get("outputLabel", f"{c.get('label', c['id'])}: hibaáram útja")))
        for c in nl.rcds:
            outs.append(("trips", c["id"], f"{c.get('short', c.get('label', c['id']))}: kiold?"))
        for c in nl.ocpds:
            outs.append(("overcurrent", c["id"], f"{c.get('short', c.get('label', c['id']))}: túláramvédelem"))
        for c in nl.imds:
            outs.append(("imd", c["id"], c.get("short", c.get("label", c["id"]))))
        for tp in nl.touch:
            outs.append(("touch", tp["id"], f"Érintés – {tp.get('label', tp['id'])}"))
        return [o for o in outs if o[0] in first]

    def _compact(items, names, compact):
        if not compact or not names:
            return items
        full = dict(items)
        order = [k for k, _ in items]

        def first_idx(k):
            return min(i for i, x in enumerate(order) if all(a == "*" or a == b for a, b in zip(k, x)))
        changed = True
        while changed:
            changed = False
            for vi in range(len(names)):
                groups, seq, keep = {}, [], []
                for k, o in items:
                    if k[vi] == "*":
                        keep.append((k, o))
                        continue
                    g = (tuple(k[:vi] + k[vi + 1:]), o)
                    if g not in groups:
                        groups[g] = []
                        seq.append(g)
                    groups[g].append(k)
                new = list(keep)
                for g in seq:
                    ks = groups[g]
                    if sorted(k[vi] for k in ks) == sorted(names[vi]):
                        rest = list(g[0])
                        new.append((tuple(rest[:vi] + ["*"] + rest[vi:]), g[1]))
                        changed = True
                    else:
                        new.extend((k, g[1]) for k in ks)
                items = sorted(new, key=lambda ko: first_idx(ko[0]))
        seen = set()
        for k, o in items:
            for c in itertools.product(*[names[i] if x == "*" else [x] for i, x in enumerate(k)]):
                if c in seen or full.get(c) != o:
                    raise SystemExit("a tömör állapottábla nem egyenértékű a teljes táblával")
                seen.add(c)
        if seen != set(full):
            raise SystemExit("a tömör állapottábla hiányos")
        return items

    def md_states_earthing(nl, rep, compact=False):
        rows = rep["rows"]
        sels = nl.selectors
        outs = _outputs(nl, rows)
        val = lambda r, o: r[o[0]][o[1]]  # noqa: E731
        var_sels = [s for s in sels if len(s["states"]) > 1]
        fixed_sels = [s for s in sels if len(s["states"]) == 1]
        var_outs = [o for o in outs if len({str(val(r, o)) for r in rows}) > 1]
        const_outs = [o for o in outs if o not in var_outs]
        names = [[x["name"] for x in s["states"]] for s in var_sels]
        items = [(tuple(r["states"][s["id"]] for s in var_sels), tuple(val(r, o) for o in var_outs)) for r in rows]
        items = _compact(items, names, compact)
        head = [s["label"] for s in var_sels] + [o[2] for o in var_outs]
        lines = ["| " + " | ".join(head) + " |", "|" + "---|" * len(head)]
        for k, o in items:
            cells = ["bármely" if x == "*" else sim.state_cell(s, x) for s, x in zip(var_sels, k)]
            cells += [WORDS[t[0]][v] for t, v in zip(var_outs, o)]
            lines.append("| " + " | ".join(cells) + " |")
        fixed = [f"{s['label']}: {sim.state_cell(s, s['states'][0]['name'])}" for s in fixed_sels]
        fixed += [f"{o[2].removesuffix(': kiold?')}: {WORDS[o[0]][val(rows[0], o)].replace('**', '')}" for o in const_outs] if rows else []
        txt = (f"_A táblázatot a szimulátor számolta a(z) `{rep['id']}` netlistából (ujjlenyomat: `{rep['fingerprint']}`): "
               f"{rep['combinations']} állapotkombináció, mindegyik egyezik a várt működéssel"
               + (" (a „bármely” sor az adott elem minden állására érvényes)" if compact and any(k for k, _ in items if "*" in k) else "") + ". "
               + ("Minden sorban azonos: " + "; ".join(fixed) + ". " if fixed else "")
               + f"Ellenőrzött szerkezet ({nl.system}): " + "; ".join(rep.get("verified", []))
               + "; a védővezetőt és a PEN-t semmilyen kapcsolókészülék nem bontja; vezetőkkel egyik állásban sincs zárlat. "
               "A szimuláció ideális (ellenállás nélküli) vezetőkkel, igen/nem alapon vizsgálja az áramutakat: áramerősséget, "
               "hibafeszültséget és lekapcsolási időt nem számol. „Fémes hurok”: a hibaáram csak vezetőkön át jut vissza a "
               "táppontba; „a földön át”: a hurokban földelési ellenállás is van. „Lekapcsolhat”: a túláramvédelem a fémes "
               "hibahurokban van; hogy elég gyorsan lekapcsol-e, azt a hurokimpedancia mérése vagy számítása dönti el. "
               "„Veszélyes lehet”: a két megérintett pont között egy emberi testen át áram folyhatna, vagy a fémház a hibaáram "
               "útjában van; „a lekapcsolásig”: a hiba miatt egy védelem magától is működésbe léphet, és a nyitása a veszélyt "
               "megszünteti; „a FI-relé legfeljebb a testen átfolyó áramra old ki”: a hiba magától nem okoz lekapcsolást, a fémház "
               "tartósan feszültség alatt maradhat, és a FI-relé csak az érintő emberen át a földbe folyó áramra oldhat ki, ha "
               "az eléri a kioldási áramát. A FI-relé az áramütést nem akadályozza meg, legfeljebb az időtartamát korlátozza; a "
               "fázis- és a nullavezető egyidejű érintését nem érzékeli._")
        return "\n".join(lines) + "\n\n" + txt

    def _case_summary(nl, rep, states):
        sel_ids = [s["id"] for s in nl.selectors]
        want = dict(nl.normal())
        want.update(states)
        row = next(r for r in rep["rows"] if all(r["states"][k] == want[k] for k in sel_ids))
        parts = []
        for fid, v in row.get("loops", {}).items():
            w = WORDS["loops"][v].replace("**", "")
            if v != "nincs-hiba" and w not in parts:
                parts.append(w)
        devs = [nl.comps[k].get("short", k) + " (FI-relé)" for k, v in row.get("trips", {}).items() if v]
        devs = [nl.comps[k].get("short", k) + " (túláramvédelem)" for k, v in row.get("overcurrent", {}).items() if v] + devs
        imd = any(row.get("imd", {}).values())
        parts.append("lekapcsol: " + (", ".join(devs) if devs else "nincs" + (" (a szigetelésfigyelő jelez)" if imd else "")))
        bad = [ld for ld, v in row.get("consumers", {}).items() if v != "mukodik"]
        if bad:
            parts.append("fogyasztó: " + ", ".join(WORDS["consumers"][row["consumers"][b]].replace("**", "") for b in bad))
        for tid, v in row.get("touch", {}).items():
            parts.append("érintés: " + WORDS["touch"][v].replace("**", ""))
        return "; ".join(parts)

    def md_earthing_compare(items):
        lines = ["| Rendszer | Csillagpont | A fémház védővezetője | " + " | ".join(["1. hibahelyzet", "2. hibahelyzet"]) + " | Szimuláció |",
                 "|---|---|---|---|---|---|"]
        total = 0
        for nl, rep in items:
            total += rep["combinations"]
            norm = nl.normal()
            f = nl.nets(norm).find
            star = f(nl.star)
            el_k = {f(f"{c['id']}.{c['terminals'][0]['id']}") for c in nl.electrodes}
            cs = "közvetlenül földelt" if star in el_k else "nincs közvetlenül földelve"
            bodies = [f(f"{ld['id']}.{t['id']}") for ld in nl.loads for t in ld["terminals"] if t.get("role") == "PE"]
            if bodies and all(b == star for b in bodies):
                if nl.splits:
                    pe = "PE, a szétválasztási ponttól PEN, a csillagponthoz"
                elif nl.penterms:
                    pe = "PEN, a csillagponthoz"
                else:
                    pe = "külön PE, a csillagponthoz"
            else:
                pe = "helyi földelőhöz (RA)"
            cases = nl.data.get("compare") or []
            cells = [f"{c['label']}: {_case_summary(nl, rep, c.get('states', {}))}" for c in cases[:2]]
            cells += ["–"] * (2 - len(cells))
            lines.append(f"| {nl.data.get('short', nl.system)} | {cs} | {pe} | {' | '.join(cells)} | "
                         f"{'PASS' if rep['pass'] else 'FAIL'}, {rep['combinations']} állapot (`{rep['fingerprint']}`) |")
        note = (f"_A táblázatot a szimulátor számolta a felsorolt netlistákból ({len(items)} rendszer, összesen {total} "
                "állapotkombináció, mindegyik egyezik a várt működéssel, és mindegyikben teljesülnek a rendszer szerkezeti "
                "feltételei). Az esetek a hiba fennállásának pillanatát mutatják, a lekapcsolás előtt; ideális vezetőkkel, "
                "áramerősség és lekapcsolási idő számítása nélkül._")
        return "\n".join(lines) + "\n\n" + note

    base_load = sim.load
    base_md_states = sim.md_states
    base_render = sim.render_block

    def load(path):
        import json
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
        if isinstance(data, dict) and data.get("earthing"):
            return EarthingNetlist(data, path)
        return base_load(path)

    def md_states(nl, rep, compact=False):
        if isinstance(nl, EarthingNetlist):
            return md_states_earthing(nl, rep, compact)
        return base_md_states(nl, rep, compact)

    def render_block(kind, args, base):
        if kind == "foldelesek":
            srcs = re.findall(r"src=(\S+)", args)
            items = [sim.analyse(os.path.join(base, s)) for s in srcs]
            bad = [rep["id"] for _, rep in items if not rep["pass"]]
            if not items or bad:
                raise SystemExit(f"sim:foldelesek – hiányzó vagy FAIL netlista: {bad}")
            return md_earthing_compare(items)
        return base_render(kind, args, base)

    sim.EarthingNetlist = EarthingNetlist
    sim.md_states_earthing = md_states_earthing
    sim.md_earthing_compare = md_earthing_compare
    sim.load = load
    sim.md_states = md_states
    sim.render_block = render_block
