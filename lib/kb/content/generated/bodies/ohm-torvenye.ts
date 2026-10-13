// GENERÁLT FÁJL – ne szerkeszd kézzel. Forrás: content/tudastar/elmelet/ohm-torvenye.md; generátor: node_modules/.bin/tsx scripts/kb-content.ts build (docs/tudastar.md).
import type {KbBody} from '../../types';

const body:KbBody={
 blocks:[
  {"t":"rovid","text":"Ohm törvénye szerint egy ellenálláson átfolyó áram egyenesen arányos a rákapcsolt feszültséggel: U = R · I. Bármely két mennyiségből kiszámolható a harmadik, a teljesítménnyel (P = U · I) együtt pedig a négy alapmennyiség bármelyike. A törvény az állandó ellenállású (ohmos) elemekre igaz; izzólámpára, LED-re vagy motorra csak korlátozottan."},
  {"t":"h2","id":"az-osszefugges","text":"Az összefüggés"},
  {"t":"formula","text":"U = R · I"},
  {"t":"ul","items":["U – feszültség, voltban (V);","R – ellenállás, ohmban (Ω);","I – áramerősség, amperben (A)."]},
  {"t":"p","lines":["Átrendezve: I = U / R és R = U / I. Szavakban: ha egy ellenállásra kétszer akkora feszültséget kapcsolunk, kétszer akkora áram folyik rajta; ha ugyanarra a feszültségre kétszer akkora ellenállást kapcsolunk, fele akkora áram folyik."]},
  {"t":"p","lines":["A képletet sokan az „Ohm-háromszöggel” jegyzik meg: a háromszög tetején U, alul egymás mellett R és I. Amit keresel, azt takard le: ha a maradék kettő egymás mellett van, szorozd, ha egymás fölött, oszd őket."]},
  {"t":"figure","id":"abra-1","caption":"Ohm-háromszög","title":"Ohm-háromszög","desc":"Felül U, alul R és I. A keresett mennyiséget letakarva a maradék kettő szorzata vagy hányadosa adja az eredményt.","spec":"– Ohm-háromszög. viewBox 0 0 240 200. Egyenlő oldalú háromszög, alapja 180 px, csúcsa felül, körvonal 2 px var(--kk-fg), kitöltés var(--kk-surface). Vízszintes elválasztó vonal a magasság felénél, alatta függőleges elválasztó vonal a közepén (2 px, var(--kk-fg)). Felső mezőben „U” (28 px, félkövér, var(--kk-primary)), bal alsó mezőben „R”, jobb alsó mezőben „I” (28 px, félkövér, var(--kk-fg)). A háromszög alatt egy sorban, 13 px-es var(--kk-muted) betűvel: „U = R · I    I = U / R    R = U / I”. title: „Ohm-háromszög”; desc: „Felül U, alul R és I. A keresett mennyiséget letakarva a maradék kettő szorzata vagy hányadosa adja az eredményt.”"},
  {"t":"p","lines":["A mértékegységekkel is ellenőrizheted a képletet: V / A = Ω, Ω · A = V. Ha az előtagokat (milli-, kilo-) is használod, előbb válts alapegységre: 12 V / 4,7 kΩ = 12 V / 4700 Ω ≈ 0,00255 A = 2,55 mA."]},
  {"t":"h2","id":"ohm-torvenye-es-a-teljesitmeny","text":"Ohm törvénye és a teljesítmény"},
  {"t":"p","lines":["A teljesítmény P = U · I (lásd [[elektromos-teljesitmeny|Elektromos teljesítmény és energia]]). Ebbe Ohm törvényét behelyettesítve további két alakot kapunk:"]},
  {"t":"formula","text":"P = I² · R és P = U² / R"},
  {"t":"p","lines":["Így a négy mennyiség (U, I, R, P) közül bármelyik kettőből kiszámolható a másik kettő:"]},
  {"t":"table","head":["Keresett","Képletek"],"rows":[["U (V)","R · I; P / I; √(P · R)"],["I (A)","U / R; P / U; √(P / R)"],["R (Ω)","U / I; U² / P; P / I²"],["P (W)","U · I; I² · R; U² / R"]]},
  {"t":"p","lines":["Két fontos következmény:"]},
  {"t":"ul","items":["**Állandó feszültségen** (például egy 230 V-ra kapcsolt fűtőszálnál) a kisebb ellenállás nagyobb teljesítményt ad: P = U² / R.","**Állandó áramnál** (például a soros áramkör egy vezetékszakaszán vagy kötésén) a nagyobb ellenállás nagyobb teljesítményt, azaz több hőt jelent: P = I² · R."]},
  {"t":"h2","id":"kidolgozott-peldak","text":"Kidolgozott példák"},
  {"t":"p","lines":["**1. Fűtőszál.** Egy 10 Ω-os fűtőszálat 230 V-ra kapcsolunk.","I = U / R = 230 V / 10 Ω = 23 A;","P = U · I = 230 V · 23 A = 5290 W ≈ 5,3 kW.","Ellenőrzés más úton: P = I² · R = 23² · 10 W = 5290 W."]},
  {"t":"p","lines":["**2. Izzólámpa.** Egy 60 W-os, 230 V-os izzólámpa üzem közben:","I = P / U = 60 W / 230 V ≈ 0,261 A;","R = U² / P = (230 V)² / 60 W ≈ 881,7 Ω.","Ellenőrzés: R = U / I = 230 V / 0,26087 A ≈ 881,7 Ω.","Ez a _meleg_ izzószál ellenállása. Hidegen ennek csak töredéke, ezért bekapcsoláskor rövid ideig sokkal nagyobb áram folyik."]},
  {"t":"p","lines":["**3. Feszültségesés a vezetéken.** Egy áramkör vezetőinek ellenállása oda-vissza, üzemmeleg (70 °C-os) állapotban 0,4126 Ω (a számítást lásd az [[elektromos-ellenallas|ellenállásról szóló cikkben]]). 16 A terhelőáramnál a vezetékeken eső feszültség:","ΔU = I · R = 16 A · 0,4126 Ω ≈ 6,6 V,","ami a 230 V-nak 6,6 / 230 ≈ 2,9 %-a; a fogyasztóra kb. 223,4 V jut. Hogy ez egy adott áramkörben elfogadható-e, az tervezési kérdés, amelyet a méretezési szabályok szerint kell megítélni."]},
  {"t":"p","lines":["**4. LED előtét-ellenállása.** Egy LED-et 12 V-ról akarunk 20 mA-rel üzemeltetni; a LED nyitófeszültsége 2 V. Az ellenállásra jutó feszültség 12 V − 2 V = 10 V, így","R = 10 V / 0,02 A = 500 Ω.","Az ellenállások E24 értéksorából a következő nagyobb érték 510 Ω; ezzel az áram I = 10 V / 510 Ω ≈ 19,6 mA. Az ellenálláson hővé alakuló teljesítmény P = U · I = 10 V · 0,0196 A ≈ 0,196 W, ezért kétszeres tartalékkal 0,5 W-os ellenállást érdemes választani."]},
  {"t":"h2","id":"mikor-nem-ervenyes-egyszeruen","text":"Mikor nem érvényes egyszerűen?"},
  {"t":"p","lines":["Ohm törvénye arányosságot állít, ami csak akkor igaz, ha az ellenállás állandó. A gyakorlatban több fontos kivétel van:"]},
  {"t":"ul","items":["**Hőmérsékletfüggő elemek.** Az izzólámpa ellenállása melegedés közben sokszorosára nő. Az összefüggés minden pillanatban igaz, de az R értéke változik.","**Nemlineáris elemek.** A dióda és a LED árama a feszültségtől nem arányosan, hanem a nyitófeszültség fölött meredeken nő. Ezért kell a LED elé előtét-ellenállás vagy áramszabályozott meghajtó.","**Váltakozó áramú körök tekerccsel vagy kondenzátorral.** Itt az ellenállás helyett az impedancia (Z, ohmban) lép a képletbe, effektív értékekkel: U = Z · I. A tekercs reaktanciája X_{L} = 2π · f · L, a kondenzátoré X_{C} = 1 / (2π · f · C).","**Motorok.** A villanymotor üzemi áramát nem lehet a tekercs egyenáramú ellenállásából kiszámolni: az áramot a tekercsek induktivitása és a forgó motorban indukálódó ellenfeszültség korlátozza, nagysága pedig a terheléstől is függ."]},
  {"t":"h2","id":"gyakori-tevedesek","text":"Gyakori tévedések"},
  {"t":"ul","items":["**„R = U · I.”** Az ellenállás a feszültség és az áram _hányadosa_: R = U / I. A mértékegység ezt rögtön elárulja: V / A = Ω.","**Előtagok keverése.** 12 V / 4,7 kΩ = 2,55 mA, nem 2,55 A. Mindig alapegységben (V, A, Ω) számolj.","**„A nagyobb ellenállás mindig nagyobb teljesítményt jelent.”** Állandó feszültségen éppen fordítva: P = U² / R.","**„Az izzó ellenállása állandó.”** A hideg és a meleg izzószál ellenállása nagyon különböző.","**„Váltakozó áramnál is mindig R-rel számolhatok.”** Csak tisztán ohmos terhelésnél (fűtés); induktív vagy kapacitív terhelésnél az impedanciával.","**„A vezeték ellenállása elhanyagolható.”** Kis áramnál sokszor igen, de egy hosszú áramkörön, nagy áramnál már volt nagyságrendű feszültségesést és érezhető melegedést okoz."]},
 ],
 sources:[
  {"standard":"127/1991. (X. 9.) Korm. rendelet","kiadas":"hatályos szöveg","pont":"3. § (1) és 1. számú melléklet – törvényes mértékegységek (volt, amper, ohm, watt)","check":{"reasons":["Lektori kérdéslista: Alapfogalmak 5; Világítás és szakszótár 5"]}},
  {"standard":"MSZ EN 60038","kiadas":"2011","pont":"1. táblázat (230 V névleges feszültség)","check":{"reasons":["Lektori kérdéslista: Alapfogalmak 6; Hálózatok és gépek 3"]}},
  {"standard":"MSZ HD 60364-5-52","kiadas":"2011","pont":"52.1 táblázat (PVC-szigetelés legnagyobb üzemi hőmérséklete: 70 °C)","check":{"reasons":["Lektori kérdéslista: Alapfogalmak 8"]}},
  {"standard":"IEC 60063","kiadas":"2015","pont":"E24 értéksor (ellenállások névleges értékei)"},
 ],
};
export default body;
