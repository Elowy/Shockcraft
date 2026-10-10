#!/usr/bin/env python3
"""R3 cikkvázlatok gépi kapui (a terv 4.4 és 4.5 pontja szerint) + a sim-blokkok egyezése.
Használat: python3 check_articles.py ../r3/*.md"""
import os
import re
import sys

import yaml

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sim  # noqa: E402

PUB_CALC = {'ohm-torveny', 'teljesitmeny', 'aram-teljesitmenybol', 'latszolagos-meddo-teljesitmeny', 'vezetek-ellenallas', 'eredo-ellenallas',
            'fogyasztas-koltseg', 'fazisterheles', 'mertekegyseg-atvalto', 'eredo-kapacitas', 'feszultsegoszto', 'ellenallas-szinkod', 'lumen-lux',
            'csillag-delta', 'transzformator', 'akkumulator-uzemido', 'led-elotet-ellenallas', 'reaktancia-rezonancia', 'homerseklet'}
FORBIDDEN = ['szabványos', 'megfelel a szabványnak', 'szakmailag ellenőrzött', 'hivatalos vizsgakérdés', 'garantáltan', 'bárki elvégezheti',
             'csináld magad', 'gfci', '120 v', '60 hz', 'nec ', 'ring final', 'пуэ', 'fehér nullavezető']
REQUIRED_H2 = ['Régi berendezésben', 'Gyakori hibák', 'Mikor hívj szakembert?']
SAFETY_MUST = ['szakképzett személy', 'feszültségmentesítés', 'elosztói engedélyes', 'gyártónként eltérhet']


def words(text):
    return len(re.findall(r'\S+', text))


def main(paths):
    bad = 0
    for p in paths:
        s = open(p, encoding='utf-8').read()
        m = re.match(r'^---\n(.*?)\n---\n(.*)$', s, re.S)
        fm = yaml.safe_load(m.group(1))
        body = m.group(2)
        errs = []
        if fm['slug'] + '.md' != os.path.basename(p):
            errs.append('slug≠fájlnév')
        if len(fm['title']) > 70:
            errs.append(f"title {len(fm['title'])}>70")
        if len(fm['navTitle']) > 34:
            errs.append(f"navTitle {len(fm['navTitle'])}>34")
        if not 80 <= len(fm['summary']) <= 160:
            errs.append(f"summary {len(fm['summary'])}")
        if fm.get('risk') != 'R3' or fm.get('section') not in ('semak', 'elmelet'):
            errs.append('risk/section')
        if fm.get('ai') != 'vázlat' or fm.get('review') != 'lektorra-var':
            errs.append('ai/review')
        if not set(fm.get('calculators', [])) <= PUB_CALC:
            errs.append('nem közzétett kalkulátor')
        for src in fm.get('sources', []):
            if set(src) != {'standard', 'kiadás', 'pont'}:
                errs.append('sources kulcsok')
        # szerkezet: első blokk veszély-doboz
        first = body.strip().split('\n\n')[0]
        if not first.startswith('> **Veszély'):
            errs.append('az első blokk nem veszély-doboz')
        for need in SAFETY_MUST:
            if need not in first:
                errs.append(f'veszély-dobozból hiányzik: {need}')
        h2 = re.findall(r'^## (.+)$', body, re.M)
        for need in REQUIRED_H2:
            if need not in h2:
                errs.append(f'hiányzó szakasz: {need}')
        ro = re.search(r'\*\*Röviden:\*\* (.*)', body)
        nsent = len(re.findall(r'[.!?](\s|$)', ro.group(1))) if ro else 0
        if not 2 <= nsent <= 4:
            errs.append(f'Röviden {nsent} mondat')
        figs = fm.get('figures', [])
        is_hub = fm['slug'] == 'vilagitasi-kapcsolasok'
        # [foldeles-bovites v1] eljárásleíró R3-cikk (pl. feszültségmentesítés): simulation: false – nincs bekötési ábra,
        # ezért netlista és szimulált állapottábla sem; az ábra folyamatábra (kind: folyamatabra), a többi kapu változatlan
        no_sim = fm.get('simulation') is False
        if not is_hub and no_sim:
            if not figs or '[ÁBRA:' not in body or any(f.get('kind') != 'folyamatabra' for f in figs):
                errs.append('simulation: false mellett csak folyamatábra (kind: folyamatabra) lehet, és legalább egy kell')
            if '<!-- sim:' in body:
                errs.append('simulation: false, mégis van sim-blokk')
            if 'gyártónként eltér' not in body.split('## Kapcsok', 1)[-1]:
                errs.append('nincs kapocsjelölési megjegyzés')
        if not is_hub and not no_sim:
            if not figs or '[ÁBRA:' not in body:
                errs.append('nincs ábra')
            if '<!-- sim:allapotok' not in body:
                errs.append('nincs szimulációval igazolt kapcsolóállás-táblázat')
            if 'gyártónként eltér' not in body.split('## Kapcsok', 1)[-1]:
                errs.append('nincs kapocsjelölési megjegyzés')
        for f in figs:
            # egy ábra egy netlistából (netlist) vagy – gyűjtőoldali áttekintő ábránál – több netlistából (netlists) készül
            nls = ([f['netlist']] if f.get('netlist') else []) + list(f.get('netlists', [])) + list(f.get('variants', []))
            if not nls and not (no_sim and f.get('kind') == 'folyamatabra'):
                errs.append(f"az ábra ({f.get('id')}) nem hivatkozik netlistára")
            for nlp in nls:
                fp = os.path.join(os.path.dirname(p), nlp)
                if not os.path.exists(fp):
                    errs.append(f"hiányzó netlista: {nlp}")
                elif not sim.analyse(fp)[1]['pass']:
                    errs.append(f"FAIL netlista: {nlp}")
        low = body.lower() + ' ' + str(fm).lower()
        for w in FORBIDDEN:
            if w in low:
                errs.append(f'tiltott kifejezés: {w}')
        n, probs = sim.process_article(p)
        errs += probs
        if n == 0 and not is_hub and not no_sim:
            errs.append('nincs sim-blokk')
        prose = re.sub(r'<!-- sim:.*?<!-- /sim:[a-z]+ -->', '', body, flags=re.S)
        prose = re.sub(r'\[ÁBRA:.*?\]\n', '', prose, flags=re.S)
        allw = words(re.sub(r'\[ÁBRA:.*?\]\n', '', body, flags=re.S))
        links = sorted(set(re.findall(r'\[\[([^\]|#]+)', body)))
        pw = words(prose)
        if not 500 <= pw <= 1500:
            errs.append(f'terjedelem (próza) {pw}')
        bad += bool(errs)
        print(f"{'OK  ' if not errs else 'HIBA'} {os.path.basename(p):44s} próza={pw:5d} táblákkal={allw:5d} title={len(fm['title'])} "
              f"nav={len(fm['navTitle'])} sum={len(fm['summary'])} röviden={nsent} sim-blokk={n} linkek={links}")
        for e in errs:
            print('     ', e)
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
