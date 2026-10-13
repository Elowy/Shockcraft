#!/usr/bin/env python3
"""Villanyszerelő Tudástár – a TS ábramotor (lib/kb/circuit.ts) egyenértékűségi referenciája a Python-szimulátorból.

A content/tudastar/r3-sim/sim.py (a foldeles_ext.py és a vedelmek_biztonsag.py bővítéssel) a mérvadó szimulátor. Ez a szkript
mind a 20 netlistára (content/tudastar/r3/*.netlist.json) kiírja a szimuláció teljes kimenetét – minden állapotkombinációra a
fogyasztók, dugaljak, hibahelyek, védelmek és érintések kimenetét, a hálózatokat (union-find halmazok) és az energizált (fázis
alatti) hálózatokat, a hibák és figyelmeztetések listáját, a váltó-tulajdonságot, a szakaszokat és a szöveges vezetéktáblát –, valamint
egy determinisztikus mutánskészlet (szándékosan elrontott netlisták) eredményét. A tests/kb-circuit.ts ugyanezt a TS-motorral
számolja ki, és tételesen összeveti.

Használat (a repó gyökeréből):
  python3 -I scripts/kb-circuit-reference.py           → tests/fixtures/kb-circuit-reference.json (újragenerálás)
  python3 -I scripts/kb-circuit-reference.py --check   → nem ír; 1-es kóddal kilép, ha a rögzített referencia elavult
A referencia a szimulátor forrásának ujjlenyomatát is rögzíti: ha a sim.py változik, a TS-teszt Python nélkül is jelzi, hogy újra kell
generálni (és a TS-motort követni kell).
"""
from __future__ import annotations

import copy
import glob
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIM_DIR = os.path.join(ROOT, "content", "tudastar", "r3-sim")
NETLIST_DIR = os.path.join(ROOT, "content", "tudastar", "r3")
OUT = os.path.join(ROOT, "tests", "fixtures", "kb-circuit-reference.json")
SIM_FILES = ("sim.py", "foldeles_ext.py", "vedelmek_biztonsag.py")
MUTANTS_PER_NETLIST = 60

sys.path.insert(0, SIM_DIR)
import sim  # noqa: E402


def fnv(text: str) -> str:
    h = 0x811C9DC5
    for ch in text:
        h ^= ord(ch)
        h = (h * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"


def canon(value) -> str:
    """Kanonikus JSON (rendezett kulcsok) – a TS-teszt ugyanígy képezi."""
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


OUT_KEYS = ("lamps", "outlets", "currents", "trips", "consumers", "loops", "overcurrent", "imd", "touch")


def norm_rows(rows):
    out = []
    for r in rows:
        x = {"states": r["states"], "ok": bool(r.get("ok"))}
        for k in OUT_KEYS:
            if k in r:
                x[k] = r[k]
        out.append(x)
    return out


def wire_rows(nl):
    """A sim.py md_wires sorai szerkezetként (ugyanaz a szűrés és ugyanazok a cellák)."""
    rows = []
    real = [w for w in nl.data["wires"] if sim.CONDUCTOR_CLASS.get(w.get("conductor")) != "virtualis"]
    for i, w in enumerate(real, 1):
        sec = w.get("section")
        sec_l = nl.sections[sec].get("label", sec) if sec in nl.sections else "dobozon belül"
        if sec not in nl.sections:
            loc = nl.term_comp[w["from"]].get("at", nl.term_comp[w["from"]]["id"])
            sec_l = ((nl.data.get("places") or {}).get(loc) or {}).get("inner") or sec_l
        rows.append({"no": i, "fromLabel": nl.tlabel(w["from"]), "toLabel": nl.tlabel(w["to"]),
                     "conductor": w["conductor"] + (f" {w['label']}" if w.get("label") else ""), "color": w["color"], "section": sec_l})
    return rows


def state_nets(nl, combo):
    """A hálózatok egy állásban és a fázis alatti („energizált”) hálózatok (az első elemükkel azonosítva)."""
    if isinstance(nl, sim.EarthingNetlist):
        uf = nl.nets(combo)
        f = uf.find
        labels = nl._labels(f)
        live_roots = {r for r, lab in labels.items() if lab in ("L1", "L2", "L3")}
    else:
        uf = nl.solve(combo)
        f = uf.find
        live_roots = {f(f"{tp['id']}.{t['id']}") for tp in nl.taps for t in tp["terminals"] if t["role"] in sim.PHASE_SOURCE_ROLES}
    groups = {}
    for k in uf.p:
        groups.setdefault(f(k), []).append(k)
    nets = sorted(sorted(g) for g in groups.values())
    live = [g[0] for g in nets if f(g[0]) in live_roots]
    return nets, live


def report_of(nl, rep):
    return {
        "id": rep.get("id"), "fingerprint": rep.get("fingerprint"), "system": rep.get("system"),
        "selectors": rep.get("selectors", []), "loads": rep.get("loads", []), "rows": norm_rows(rep.get("rows", [])),
        "errors": sorted(rep.get("errors", [])), "warnings": sorted(rep.get("warnings", [])),
        "combinations": rep.get("combinations", 0), "toggle": rep.get("toggle", {}), "sections": rep.get("sections", []),
        "verified": rep.get("verified"), "pass": bool(rep.get("pass")),
    }


def analyse_data(data, label):
    nl = sim.EarthingNetlist(data, label) if isinstance(data, dict) and data.get("earthing") else sim.Netlist(data, label)
    rep = nl.run()
    return nl, rep


# ------------------------------------------------------------------------------------------- mutánsok
ROLE_SWAP = {"L": "N", "N": "L", "PE": "N", "kapcsolt": "N", "kozos": "N", "valto-1": "valto-2", "valto-2": "valto-1",
             "kapcsolt-N": "L", "L1": "L2", "L2": "L1", "L3": "L1", "PEN": "N", "FK": "PE", "E": "PE", "idegen": "PE"}
COLOR_ORDER = ["barna", "fekete", "kék", "szürke", "zöld-sárga"]


def apply_ops(data, ops):
    d = copy.deepcopy(data)
    for op in ops:
        cur = d
        for k in op["path"][:-1]:
            cur = cur[k]
        last = op["path"][-1]
        if op["op"] == "set":
            cur[last] = copy.deepcopy(op["value"])
        else:
            del cur[last]
    return d


def candidate_ops(data):
    comps = {c["id"]: c for c in data.get("components", [])}
    ops = []
    for i, w in enumerate(data.get("wires", [])):
        for end in ("from", "to"):
            cid, tid = w[end].split(".", 1)
            others = sorted(t["id"] for t in comps[cid]["terminals"] if t["id"] != tid)
            for t in others[:2]:
                ops.append([{"op": "set", "path": ["wires", i, end], "value": f"{cid}.{t}"}])
        ops.append([{"op": "del", "path": ["wires", i]}])
        if w.get("color") in COLOR_ORDER:
            ops.append([{"op": "set", "path": ["wires", i, "color"], "value": COLOR_ORDER[(COLOR_ORDER.index(w["color"]) + 1) % len(COLOR_ORDER)]}])
    for ci, c in enumerate(data.get("components", [])):
        for ti, t in enumerate(c.get("terminals", [])):
            if t.get("role") in ROLE_SWAP:
                ops.append([{"op": "set", "path": ["components", ci, "terminals", ti, "role"], "value": ROLE_SWAP[t["role"]]}])
        groups = []
        if c.get("states") is not None:
            groups.append(["components", ci, "states"])
        for ki, _ in enumerate(c.get("keys") or []):
            groups.append(["components", ci, "keys", ki, "states"])
        tids = sorted(t["id"] for t in c.get("terminals", []))
        for g in groups:
            cur = data
            for k in g:
                cur = cur[k]
            for si, s in enumerate(cur):
                if s.get("connect"):
                    ops.append([{"op": "set", "path": g + [si, "connect"], "value": []}])
                    a, b = s["connect"][0]
                    alt = [t for t in tids if t not in (a, b)]
                    if alt:
                        ops.append([{"op": "set", "path": g + [si, "connect", 0, 1], "value": alt[0]}])
                elif tids:
                    ops.append([{"op": "set", "path": g + [si, "connect"], "value": [[tids[0], tids[-1]]]}])
                if "active" in s:
                    ops.append([{"op": "set", "path": g + [si, "active"], "value": not s["active"]}])
        for bi, _ in enumerate(c.get("bridges") or []):
            ops.append([{"op": "del", "path": ["components", ci, "bridges", bi]}])
        for pi, _ in enumerate(c.get("poles") or []):
            ops.append([{"op": "del", "path": ["components", ci, "poles", pi]}])
    tt = data.get("truthTable", [])
    if tt:
        for key in ("lamps", "outlets", "trips"):
            if tt[0].get(key):
                k0 = sorted(tt[0][key])[0]
                ops.append([{"op": "set", "path": ["truthTable", 0, key, k0], "value": not tt[0][key][k0]}])
        ops.append([{"op": "del", "path": ["truthTable", len(tt) - 1]}])
    for bi, b in enumerate(data.get("breaks") or []):
        ops.append([{"op": "del", "path": ["breaks", bi]}])
    for ti, t in enumerate(data.get("touch") or []):
        ops.append([{"op": "set", "path": ["touch", ti, "b"], "value": t["a"]}])
    for si, _ in enumerate(data.get("sections") or []):
        ops.append([{"op": "del", "path": ["sections", si]}])
    if data.get("earthing"):
        for system in ("TN-C", "TN-S", "TN-C-S", "TT", "IT"):
            if system != data["earthing"]["system"]:
                ops.append([{"op": "set", "path": ["earthing", "system"], "value": system}])
    return ops


def mutant_result(data, ops, label):
    nl, rep = analyse_data(apply_ops(data, ops), label)
    errs = sorted(rep.get("errors", []))
    return {"pass": bool(rep.get("pass")), "codes": sorted(e.split("]")[0][1:] for e in errs), "errors": fnv(canon(errs)),
            "rows": fnv(canon(norm_rows(rep.get("rows", [])))), "combinations": rep.get("combinations", 0)}


def build():
    files = sorted(glob.glob(os.path.join(NETLIST_DIR, "*.netlist.json")))
    out = {"format": "kb-circuit-reference/1", "generator": "scripts/kb-circuit-reference.py",
           "sim": {f: fnv(open(os.path.join(SIM_DIR, f), encoding="utf-8").read().replace("\r\n", "\n")) for f in SIM_FILES},
           "netlists": [], "mutants": []}
    skipped = 0
    for path in files:
        name = os.path.basename(path)
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
        nl, rep = analyse_data(data, name)
        entry = {"file": name, "report": report_of(nl, rep), "wires": wire_rows(nl), "states": []}
        for r in rep.get("rows", []):
            nets, live = state_nets(nl, r["states"])
            entry["states"].append({"states": r["states"], "nets": fnv(canon(nets)), "count": len(nets), "live": live})
        out["netlists"].append(entry)
        cands = candidate_ops(data)
        step = max(1, len(cands) // MUTANTS_PER_NETLIST)
        for ops in cands[::step][:MUTANTS_PER_NETLIST]:
            try:
                res = mutant_result(data, ops, name)
            except Exception:  # noqa: BLE001 – a szimulátort összeomlasztó mutáns nem kerül a készletbe (a TS-motor nem utánozza)
                skipped += 1
                continue
            out["mutants"].append({"file": name, "ops": ops, **res})
    out["skipped"] = skipped
    return out


def main(argv):
    check = "--check" in argv
    data = build()
    text = json.dumps(data, ensure_ascii=False, indent=0, sort_keys=False) + "\n"
    if check:
        try:
            with open(OUT, encoding="utf-8") as fh:
                old = fh.read()
        except FileNotFoundError:
            old = ""
        if old != text:
            print(f"ELAVULT: {os.path.relpath(OUT, ROOT)} – futtasd: python3 -I scripts/kb-circuit-reference.py", file=sys.stderr)
            return 1
        print(f"OK: a referencia naprakész ({len(data['netlists'])} netlista, {len(data['mutants'])} mutáns, {data['skipped']} kihagyva).")
        return 0
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write(text)
    print(f"Írva: {os.path.relpath(OUT, ROOT)} ({len(data['netlists'])} netlista, {len(data['mutants'])} mutáns, {data['skipped']} kihagyva).")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
