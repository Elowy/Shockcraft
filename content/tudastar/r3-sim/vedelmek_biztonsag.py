#!/usr/bin/env python3
"""[vedelmek-biztonsag v1] A független biztonsági ellenőr bővítése a sim.py védelmi részéhez (dugalj, kismegszakító,
FI-relé). Visszafelé kompatibilis: csak a védelmi netlistákra (sim.Netlist, „earthing” mező nélkül) hat, a földelési
netlisták (foldeles_ext.EarthingNetlist saját run()-nal) és a kapcsolási netlisták eredménye nem változik.

Miért kell? A probak_vedelmek.py „csaló szerző” próbái (az igazságtábla a szimulált kimenetre átírva) megmutatták,
hogy az alábbi hibák az I10 nélkül átmentek – vagyis csak a szerző igazságtáblája védett ellenük, invariáns nem:
  - dugalj védőérintkező-kapocs nélkül (v12);
  - dugaljkör FI-relé nélkül (v13), dugalj kismegszakító nélkül (v14);
  - fizikailag lehetetlen készülékmodell: a kétpólusú FI „ki” állásban a nullát zárva hagyja (v02), a kismegszakító
    „ki” állásban is zár (v15), a próbagomb nem okoz különbözeti áramot (v11).

Új ellenőrzések:
  S9  – készülékmodell: fi-rele: a pólusok kapcsai azonos (fázis/nulla) szerepűek, nem PE; legalább egy fázis- és
        pontosan egy nullapólus; minden állás vagy MINDEN pólust zár, vagy EGYET SEM; van zárt állás.
        kismegszakito / nyomogomb: két fázisszerepű kapocs; minden állás vagy nyitott, vagy a két kapcsot köti;
        több állásnál van nyitott és zárt is.
  I2  – a dugaljnak (védőérintkezős) pontosan egy fázis-, egy N- és egy PE-kapcsa van; PE-kapocs nélkül I2.
  I4  – feszültségmentesnek jelzett dugalj fázisszerepű kapcsa sem lehet fázison (a lámpák I4-ének megfelelője).
  I15 – ha a netlistában van kismegszakító: minden dugalj és fogyasztó fázisa kismegszakítón át kap feszültséget
        (az összes kismegszakító bontásakor – a többi választó bármely állásában – egyik sem kap fázist).
  I16 – ha a netlistában van FI-relé: minden dugalj fázisa ÉS nullája FI-relén át csatlakozik a betáphoz
        (a dugaljáramkör kiegészítő védelme; a cikkek ezt állítják).
  I17 – a FI-relé próbagombja (nyomogomb, parent = FI): megnyomva, bekapcsolt FI mellett minden állásban kiold.
Megjelenítés:
  - a védelmi állapottábla alatti mondat „Egyik állásban sincs … zárlat” része hibahelyet/érintést tartalmazó netlistánál
    pontosítva: a szerelt vezetékezésre vonatkozik (a jelképes hibahely és érintés nem zárlat a szerelésben);
  - ha a netlistában dugalj, kismegszakító és FI-relé is van, a mondat kimondja az I15/I16 által igazolt tényt: minden dugalj
    kismegszakítón és áram-védőkapcsolón át kap feszültséget;
  - a dugalj kikapcsolt állapota „feszültségmentes” helyett „nem ad feszültséget”: lekapcsolt kismegszakító mellett a
    dugalj nullája a nullasínen marad, ezért a „feszültségmentes” szó (a feszültségmentesítés szakkifejezése) félrevezető.
"""
from __future__ import annotations


def install(sim):
    if getattr(sim, "_vedelmek_biztonsag_installed", False):
        return
    sim._vedelmek_biztonsag_installed = True
    N = sim.Netlist
    base_is_prot = N._is_protective
    base_prot_eval = N._prot_eval
    base_run = N.run
    base_md_states_prot = sim.md_states_prot

    def cls_of(self, key):
        return sim.ROLE_CLASS.get(self.terms[key].get("role"))

    # --- S9, I2: szerkezet (egyszer, a védelmi netlistáknál) ----------------------------------------------
    def is_protective(self):
        first = getattr(self, "_protective", None) is None
        res = base_is_prot(self)
        if first and res:
            _model_checks(self)
        return res

    def _model_checks(self):
        for c in self.comps.values():
            ty, cid = c.get("type"), c["id"]
            tids = [t.get("id") for t in c.get("terminals", [])]
            if ty in sim.RCD_TYPES:
                poles = [tuple(p) for p in c.get("poles", []) if len(p) == 2]
                pcls = []
                for p in poles:
                    cl = {cls_of(self, f"{cid}.{t}") for t in p if f"{cid}.{t}" in self.terms}
                    if len(cl) != 1 or "pe" in cl:
                        self.err("S9", f"{cid}: a FI-relé pólusa ({list(p)}) két azonos szerepű (fázis vagy nulla) kapocsból áll, PE nem lehet")
                    pcls.append(next(iter(cl)) if len(cl) == 1 else None)
                if poles and (pcls.count("nulla") != 1 or pcls.count("fazis") < 1):
                    self.err("S9", f"{cid}: a FI-relének legalább egy fázis- és pontosan egy nullapólusa van (a nullavezető is átmegy az összegáramváltón)")
                pset = {frozenset(p) for p in poles}
                states = c.get("states") or []
                for s in states:
                    cs = {frozenset(p) for p in s.get("connect", [])}
                    if cs and cs != pset:
                        self.err("S9", f"{cid}/{s.get('name')}: a FI-relé állása vagy minden pólust zár, vagy egyet sem (a kétpólusú FI a fázist és a nullát együtt bontja)")
                if pset and not any({frozenset(p) for p in s.get("connect", [])} == pset for s in states):
                    self.err("S9", f"{cid}: a FI-relének nincs bekapcsolt (minden pólust záró) állása")
            elif ty in ("kismegszakito", "nyomogomb"):
                states = c.get("states") or []
                if len(tids) != 2 or any(cls_of(self, f"{cid}.{t}") != "fazis" for t in tids):
                    self.err("S9", f"{cid}: az egypólusú {ty} két fázisszerepű kapoccsal modellezhető")
                    continue
                pair = frozenset(tids)
                kinds = []
                for s in states:
                    cs = {frozenset(p) for p in s.get("connect", [])}
                    if cs not in (set(), {pair}):
                        self.err("S9", f"{cid}/{s.get('name')}: az állás vagy nyitott, vagy a két kapcsot köti össze")
                    kinds.append(bool(cs))
                if len(states) > 1 and (all(kinds) or not any(kinds)):
                    self.err("S9", f"{cid}: a többállású {ty} egyik állása nyitott, egy másik zárt kell legyen (különben sosem bont / sosem zár)")
                if ty == "kismegszakito" and states and not any(kinds):
                    self.err("S9", f"{cid}: a kismegszakítónak nincs bekapcsolt állása")
            if ty in sim.OUTLET_TYPES:
                roles = [cls_of(self, f"{cid}.{t}") for t in tids]
                if roles.count("pe") != 1:
                    self.err("I2", f"{cid}: a védőérintkezős dugaljnak pontosan egy védőérintkező- (PE) kapcsa kell")
                if roles.count("fazis") != 1 or roles.count("nulla") != 1:
                    self.err("S5", f"{cid}: a dugaljnak pontosan egy fázis- és egy nullakapcsa kell")
        for c in self.comps.values():
            if c.get("type") == "nyomogomb" and c.get("parent") is not None:
                par = self.comps.get(c["parent"])
                if par is None or par.get("type") not in sim.RCD_TYPES:
                    self.err("S9", f"{c['id']}: a próbagomb szülője ({c.get('parent')}) nem FI-relé")

    # --- I4 a dugaljakra: állásonként --------------------------------------------------------------------------
    def prot_eval(self, combo, uf, L_roots, N_roots, PE_roots, lamps, tag, viol):
        out = base_prot_eval(self, combo, uf, L_roots, N_roots, PE_roots, lamps, tag, viol)
        f = uf.find
        for cid, live in (out.get("outlets") or {}).items():
            c = self.comps[cid]
            if not live and any(f(f"{cid}.{t['id']}") in L_roots for t in c["terminals"] if sim.ROLE_CLASS.get(t["role"]) == "fazis"):
                viol("I4", f"{cid}: a dugalj feszültségmentesnek számít, de a fázis kapcsa feszültség alatt van ({tag})")
        return out

    # --- I15, I16, I17: állásfüggetlen topológia + próbagomb ---------------------------------------------------
    def _union_without(self, skip_comps):
        """Összefüggőség úgy, hogy a megadott készülékek minden pólusa bontva, a többi választó MINDEN állásának
        összeköttetése egyszerre zárva (a legkedvezőtlenebb eset a megkerülésre)."""
        uf = sim.UF(self.terms.keys())
        for w in self.data.get("wires", []):
            if w.get("from") in self.terms and w.get("to") in self.terms:
                uf.union(w["from"], w["to"])
        for c in self.comps.values():
            for grp in c.get("bridges", []):
                ks = [f"{c['id']}.{t}" for t in grp if f"{c['id']}.{t}" in self.terms]
                for k in ks[1:]:
                    uf.union(ks[0], k)
        for sel in self.selectors:
            if sel["comp"] in skip_comps:
                continue
            for st in sel["states"]:
                for a, b in st.get("connect", []):
                    ka, kb = f"{sel['comp']}.{a}", f"{sel['comp']}.{b}"
                    if ka in self.terms and kb in self.terms:
                        uf.union(ka, kb)
        return uf

    def _src_roots(self, f, roles):
        return {f(f"{tp['id']}.{t['id']}") for tp in self.taps for t in tp["terminals"] if t["role"] in roles}

    def run(self):
        rep = base_run(self)
        if not self._is_protective() or not rep.get("rows"):
            return rep
        new = []
        mcbs = {c["id"] for c in self.comps.values() if c.get("type") == "kismegszakito"}
        rcds = {c["id"] for c in self.comps.values() if c.get("type") in sim.RCD_TYPES}
        outlets = [c for c in self.comps.values() if c.get("type") in sim.OUTLET_TYPES]
        if mcbs:
            f = _union_without(self, mcbs).find
            Lr = _src_roots(self, f, sim.PHASE_SOURCE_ROLES)
            for c in outlets + self.loads:
                if any(f(f"{c['id']}.{t['id']}") in Lr for t in c["terminals"] if sim.ROLE_CLASS.get(t["role"]) == "fazis"):
                    new.append(("I15", f"{c['id']}: a fázis kismegszakító nélkül is eljut ide – az áramkörnek nincs túláramvédelme"))
        if rcds and outlets:
            f = _union_without(self, rcds).find
            Sr = _src_roots(self, f, sim.PHASE_SOURCE_ROLES | {"N"})
            for c in outlets:
                if any(f(f"{c['id']}.{t['id']}") in Sr for t in c["terminals"] if sim.ROLE_CLASS.get(t["role"]) in ("fazis", "nulla")):
                    new.append(("I16", f"{c['id']}: a dugalj fázisa vagy nullája FI-relé nélkül is a betáphoz csatlakozik – nincs kiegészítő védelem"))
        for c in self.comps.values():
            if c.get("type") != "nyomogomb" or self.comps.get(c.get("parent"), {}).get("type") not in sim.RCD_TYPES:
                continue
            sel = next((s for s in self.selectors if s["comp"] == c["id"]), None)
            pressed = [s["name"] for s in (sel or {}).get("states", []) if s.get("connect")]
            par = self.comps[c["parent"]]
            pset = {frozenset(p) for p in par.get("poles", [])}
            psel = next((s for s in self.selectors if s["comp"] == par["id"]), None)
            closed = [s["name"] for s in (psel or {}).get("states", []) if {frozenset(p) for p in s.get("connect", [])} == pset]
            hit = [r for r in rep["rows"] if r["states"].get(sel["id"] if sel else None) in pressed
                   and r["states"].get(psel["id"] if psel else None) in closed]
            if not pressed or not hit:
                new.append(("I17", f"{c['id']}: a próbagombnak nincs megnyomott állása bekapcsolt FI-relé mellett"))
            for r in hit:
                if not r.get("trips", {}).get(par["id"]):
                    tag = ", ".join(f"{k}={v}" for k, v in r["states"].items())
                    new.append(("I17", f"{c['id']}: a próbagomb megnyomására a(z) {par['id']} nem old ki ({tag})"))
                    break
        for code, msg in new:
            self.err(code, msg)
        if new:
            rep["pass"] = False
        return rep

    # --- megjelenítés: a „nincs zárlat” mondat pontosítása hibahelyes netlistánál -------------------------------
    def md_states_prot(nl, rep, compact=False):
        txt = base_md_states_prot(nl, rep, compact)
        if any(c.get("type") in sim.SCENARIO_TYPES for c in nl.comps.values()):
            txt = txt.replace(
                "Egyik állásban sincs L–N, L–PE vagy N–PE zárlat;",
                "A szerelt vezetékezésben (a jelképes hibahelyet és érintést nem számítva) egyik állásban sincs L–N, L–PE vagy N–PE zárlat;")
        types = {c.get("type") for c in nl.comps.values()}
        if types & sim.OUTLET_TYPES and "kismegszakito" in types and types & sim.RCD_TYPES:
            txt = txt.replace("a kismegszakító csak a fázist bontja;",
                              "a kismegszakító csak a fázist bontja; minden dugalj kismegszakítón és áram-védőkapcsolón át kap feszültséget;", 1)
        return txt

    sim.OUT_WORDS["dugalj"] = ("**feszültség alatt**", "nem ad feszültséget")
    N._is_protective = is_protective
    N.is_protective = is_protective
    N._prot_eval = prot_eval
    N.run = run
    sim.md_states_prot = md_states_prot
    sim.vedelmek_biztonsag_union_without = _union_without
