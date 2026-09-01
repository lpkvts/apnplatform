// Platform-verziókövetés.
//
// MIÉRT KELL: a platform tartalmának egy része adatbázisban él (betegségleírások,
// irányelvek, labor paraméterek) — ezek időbélyeggel érkeznek, az újdonságukat a
// rendszer automatikusan felismeri. A másik része viszont a kódban van
// (Labor Kisokos, forrás-regiszter, témakörök, EKG, score-ok, eszközök), ami csak
// deploykor változik, és nincs hozzá adatbázis-időbélyeg.
//
// Ezért minden érdemi szállításnál új kiadás (Release) kerül ide, funkció szintű
// bejegyzésekkel. A felhasználó azt látja újdonságként, ami a legutóbbi megtekintése
// (profiles.updates_seen_at) után kelt.
//
// SZABÁLYOK:
//  - a `date` a tényleges szállítás napja legyen,
//  - kiadott verzió dátumát soha ne módosítsuk visszamenőleg — különben eltűnik
//    azoknál a felhasználóknál, akik még nem látták,
//  - a legfrissebb kiadás áll a tömb elején.
//
// VERZIÓSZÁMOZÁS — mikor melyik számjegy nő:
//
//   MAJOR (2.0.0)  Áttörő változás: a felhasználónak újra kell tanulnia valamit,
//                  vagy a korábbi működés megszűnik. Ritka.
//   MINOR (1.5.0)  Új modul vagy önálló, nagy funkció, ami korábban nem létezett.
//                  Például: interaktív EKG elemzés, felhasználókezelés.
//   PATCH (1.4.1)  Meglévő modul bővítése, új szakmai tartalom, finomítás, javítás.
//                  Ez a leggyakoribb: új témakör, új laborelemek, új esetek,
//                  új források, hibajavítás.
//
// A napi munka tehát jellemzően a HARMADIK számjegyet lépteti. Ha bizonytalan,
// hogy minor vagy patch: ha a modul már létezett, patch.

export type ChangeKind = 'funkcio' | 'labor' | 'forras' | 'betegseg' | 'szakmai' | 'eszkoz' | 'javitas'

export interface FeatureEntry {
  id: string
  kind: ChangeKind
  title: string
  body?: string
  href?: string
  /**
   * Lényeges változás-e a felhasználó számára.
   *
   * Megadás nélkül a típus dönt: az új funkciók és a szakmai tartalom
   * lényegesek, a hibajavítások és az apró finomítások nem. Kézzel bármelyik
   * felülbírálható — egy eszköz-jellegű változás is lehet fontos, ha érdemben
   * megváltoztatja a napi munkát.
   */
  major?: boolean
}

export interface Release {
  version: string
  date: string          // YYYY-MM-DD
  title: string
  summary?: string
  entries: FeatureEntry[]
}

/** A kódban szállított tartalom lapított bejegyzése (az értesítés-logika ezt használja). */
export interface ChangeEntry extends FeatureEntry {
  date: string
  version: string
}

// Az ikonnevek a components/icons.tsx készletéből valók.
export const CHANGE_KIND_META: Record<ChangeKind, { icon: string; label: string }> = {
  funkcio: { icon: 'grad', label: 'Funkció' },
  labor: { icon: 'flask', label: 'Labor' },
  forras: { icon: 'book', label: 'Klinikai forrás' },
  betegseg: { icon: 'clinic', label: 'Betegségtár' },
  szakmai: { icon: 'book', label: 'Szakmai tartalom' },
  eszkoz: { icon: 'assessment', label: 'Eszköz' },
  javitas: { icon: 'assessment', label: 'Javítás' },
}

export const RELEASES: Release[] = [
  {
    version: '1.8.1',
    date: '2026-09-01',
    title: 'APN és ápoló összehasonlítás',
    summary: 'Ugyanaz a tevékenység, két képzettségi szinten — a rendelet valós adataiból.',
    entries: [
      {
        id: 'v181-ossze', kind: 'szakmai', title: 'Mi a különbség?',
        body: 'Új nézet a Kompetenciatérképben: huszonhárom tevékenység, amelyet a rendelet mindkét oszlopban felsorol, eltérő szinttel. Ugyanabból a táblázatsorból származnak, tehát valóban azonos tevékenységről van szó — nem hasonlóról. Például az oxigénszaturáció mérése az általános ápolónál orvosi indikációhoz kötött, az APN saját indikáció alapján végzi.',
        href: '/kompetenciaterkep',
      },
      {
        id: 'v181-elteres', kind: 'szakmai', title: 'Ahol maga a tevékenység más',
        body: 'A lényegi különbség nem az, hogy ugyanazt kevesebb felügyelettel végzi, hanem hogy mást végez. Hét ilyen terület: az EKG-t az ápoló kivitelezi, az APN elrendeli; a szakápolási feladatokat az ápoló kivitelezi, az APN elrendeli is; a laborvizsgálatot az APN elrendeli és az eredményt értelmezi; a védőoltást az ápoló beadja, az APN elrendeli és felírja.',
        href: '/kompetenciaterkep',
      },
      {
        id: 'v181-korlat', kind: 'eszkoz', title: 'Amit nem állítunk',
        body: 'Az asszisztensi oszlop szintjeit nem szerepeltetjük, mert annak hiteles kivonatát nem tudtuk ellenőrizni — a keretrendszerben elfoglalt helyét viszont bemutatjuk. A nézet kimondja azt is, hogy ez nem rangsor: eltérő képzettségekhez eltérő kompetenciák tartoznak, és a betegellátás mindegyikre épül.',
        href: '/kompetenciaterkep',
      },
    ],
  },
  {
    version: '1.8.0',
    date: '2026-09-01',
    title: 'APN Kompetenciatérkép',
    summary: 'Új modul: mit végezhet a kiterjesztett hatáskörű ápoló, és milyen orvosi együttműködés mellett.',
    entries: [
      {
        id: 'v180-terkep', kind: 'funkcio', title: 'Kompetenciatérkép',
        body: 'Új modul mutatja be, mit csinálhat egy kiterjesztett hatáskörű ápoló. A tartalom a 13/2025. (IV. 17.) BM rendelet 2. mellékletéből származik, a kiterjesztett hatáskörű ápoló (MSc, MKKR 7. szint) oszlopából: 274 tevékenység, mindegyik a hozzá tartozó kompetenciaszinttel.',
        href: '/kompetenciaterkep',
      },
      {
        id: 'v180-szintek', kind: 'szakmai', title: 'Négy kompetenciaszint',
        body: 'A rendelet szerinti négy tevékenységvégzési szint: saját indikáció alapján önállóan; önállóan, szakorvosi szupervízió mellett; orvosi indikáció vagy kötelező előzetes egyeztetés alapján; végül orvosi irányítás, jelenlét vagy közreműködés mellett. Mindegyiknél olvasható a rendelet szó szerinti szövege és egy közérthető magyarázat is. A különbség nem a tevékenység nehézsége, hanem az, hogy ki indikálja és milyen együttműködés mellett történik.',
        href: '/kompetenciaterkep',
      },
      {
        id: 'v180-kereses', kind: 'eszkoz', title: 'Háromféle böngészés',
        body: 'A tartalom elérhető kompetenciaszint szerint, a rendelet tevékenységi főcsoportjai szerint, valamint kereséssel. A kereső ékezet-tűrő, tehát a „legutbiztositas” is talál. Minden találat mutatja a szintet és azt, melyik csoportba tartozik.',
        href: '/kompetenciaterkep',
      },
      {
        id: 'v180-korlatok', kind: 'szakmai', title: 'Amit a rendelet nem tartalmaz',
        body: 'A keretrendszer egységes, nem bontja szakterületre a kompetenciákat — a sürgősségi, intenzív, geriátriai, közösségi és perioperatív APN részletes listáinak kidolgozása a rendelet megjelenésekor még folyamatban volt. Ezt a modul kimondja, és nem pótolja saját megfogalmazással. A tételek szövegét és szintbesorolását sem egészítettük ki.',
        href: '/kompetenciaterkep',
      },
    ],
  },
  {
    version: '1.7.3',
    date: '2026-09-01',
    title: 'Rendezettebb kezdőlap',
    summary: 'A betegvizsgálat a gyors elérésen belül kapott hangsúlyt, külön gomb helyett.',
    entries: [
      {
        id: 'v173-kezdolap', kind: 'eszkoz', title: 'Kiemelt betegvizsgálat',
        body: 'A keresőmező alatti hosszú gomb lekerült. Helyette a betegvizsgálat a gyors elérés rácsán belül kapott kiemelt csempét: két oszlopot foglal el, hangsúlyosabb kerettel és nagyobb felirattal. Így a leggyakoribb belépési pont továbbra is azonnal látszik, de nem szakítja meg a kezdőlap felépítését.',
        href: '/',
      },
    ],
  },
  {
    version: '1.7.2',
    date: '2026-09-01',
    title: 'Csendesebb verziókövetés',
    summary: 'A felhasználók alapból csak a lényeges változásokról kapnak jelzést.',
    entries: [
      {
        id: 'v172-szures', kind: 'funkcio', title: 'Szűrt változásnapló',
        body: 'Eddig minden apró javítás megjelent a felhasználóknak és jelzett a harangon, ami elnyomta a lényeges változásokat. Mostantól alapból csak az új funkciók és a szakmai tartalom látszik — a hibajavítások és a finomítások nem. A Beállítások oldalon egy kapcsolóval a teljes napló is megjeleníthető.',
        href: '/cms/beallitasok',
      },
      {
        id: 'v172-admin', kind: 'eszkoz', title: 'Az adminisztrátorok mindent látnak',
        body: 'A kapcsoló állásától függetlenül az adminisztrátorok a teljes naplót látják a hibajavításokkal együtt, mert nekik ez munkaeszköz. A verziókövetés oldalon jelzés mutatja, hogy adminisztrátori nézetben vagy, és mit látnak ehhez képest a felhasználók.',
        href: '/ujdonsagok',
      },
    ],
  },
  {
    version: '1.7.1',
    date: '2026-09-01',
    title: 'Nyolc új kórkép',
    summary: 'A betegségtár tizenkettőről húsz kórképre bővült, ápolási fókuszú válogatással.',
    entries: [
      {
        id: 'v171-korkepek', kind: 'betegseg', title: 'Új kórképek a betegségtárban',
        body: 'Akut coronaria szindróma, vénás thromboembolia, nyomási sérülés, húgyúti fertőzés, vashiányos anaemia, pajzsmirigy-alulműködés, csontritkulás eséskockázattal, valamint alultápláltság és táplálási kockázat.',
        href: '/betegsegtar',
      },
      {
        id: 'v171-apolasi', kind: 'szakmai', title: 'Ápolási fókuszú válogatás',
        body: 'A válogatás szempontja nem csak a gyakoriság volt, hanem az is, hogy az ápolói tevékenységnek önálló szerepe legyen. Ezért került be a nyomási sérülés, az alultápláltság és a húgyúti fertőzés — ezeknél a kockázatbecslés, a megelőzés és a felismerés érdemben ápolói feladat, nem csak orvosi döntést kísér.',
        href: '/betegsegtar',
      },
      {
        id: 'v171-kapcsolatok', kind: 'eszkoz', major: true, title: 'Modulokhoz kapcsolva',
        body: 'Minden új kórkép a valós labor-, EKG- és pontozó-modulokra hivatkozik, gépi ellenőrzéssel. A vashiányos anaemia például a nemrég felvett vörösvértest-paraméterekre mutat, a nyomási sérülés a Braden- és Norton-skálára.',
        href: '/betegsegtar',
      },
    ],
  },
  {
    version: '1.6.3',
    date: '2026-09-01',
    title: 'Az összes EKG-görbe átvizsgálva',
    summary: 'Több görbe nem azt mutatta, amit a hozzá tartozó helyes válasz állított — mind javítva.',
    entries: [
      {
        id: 'v163-st', kind: 'javitas', title: 'Látható ST-eleváció',
        body: 'A szívinfarktus eseteinél a mellkasi elvezetésekben gyakorlatilag nem látszott ST-eleváció: az emelt szakasz túl rövid volt, és a mély S-hullám elnyelte. Mostantól az emelkedés a T-hullámba olvad, ahogy a valóságban is — ez adja a jellegzetes képet. A pericarditis diffúz elevációja szintén láthatóvá vált.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v163-t', kind: 'javitas', title: 'A T-hullám elfér a helyén',
        body: 'Széles komplexusú, szapora ritmusnál — például kamrai tachycardiánál — a T-hullám belecsúszott a QRS-be, így az alakja értékelhetetlen volt: invertáltnak jelölve is pozitívnak látszott. A T szélessége mostantól a rendelkezésre álló időhöz igazodik.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v163-tengely', kind: 'javitas', title: 'Jobb szárblokk tengelyállása',
        body: 'Jobb szárblokknál az I. elvezetésben a széles S mélyebb volt az R-nél, így a nettó irány negatívba fordult — a tengelymeghatározás félrevezetett volna. Emellett a kamrai extrasystole kilógott a rácsból, a kóros Q-hullám pedig alig volt kivehető.',
        href: '/klinika/ekg',
      },
      {
        id: 'v163-ellenorzes', kind: 'eszkoz', title: 'Gépi görbe-ellenőrzés',
        body: 'Mind a 36 görbe — nyolc eset és huszonnyolc gyakorló elem — automatikusan ellenőrizhető: frekvencia, QRS-szélesség, PR, tengely, ST a J+60 ms pontban, T-alak, kóros Q és a rácsba illeszkedés. Így a hasonló eltérések a jövőben azonnal kiderülnek.',
        href: '/klinika/ekg',
      },
    ],
  },
  {
    version: '1.6.2',
    date: '2026-09-01',
    title: 'A görbe és a helyes válasz összhangja',
    summary: 'Javítva, hogy a megjelenített EKG mást mutatott, mint amit a rendszer helyesnek fogadott el.',
    entries: [
      {
        id: 'v162-avblokk', kind: 'javitas', title: 'Teljes AV-blokk: hiányoztak a P-hullámok',
        body: 'A teljes AV-blokk esetéből kimaradt a blokk beállítása, ezért P-hullám egyáltalán nem került a görbére — miközben a kérdés éppen a P-hullámok és a QRS-ek viszonyáról szólt. Aki azt válaszolta, hogy nincs P-hullám, jogosan tette, a rendszer mégis hibásnak jelölte. Most öt független P-hullám látszik három QRS mellett, ahogy a kórképnél kell.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v162-plathato', kind: 'javitas', title: 'Láthatóbb P-hullám',
        body: 'A P-hullám az élettani tartomány alsó szélén rajzolódott, alig másfél milliméterrel a tízmilliméteres QRS mellett — a képernyőn ez nehezen volt kivehető, különösen telefonon. Mostantól a tartomány felső részét kapja, így a „van-e P-hullám” kérdés valóban megválaszolható a képről.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v162-hyperk', kind: 'javitas', title: 'Hyperkalaemia: valóban lapos P',
        body: 'A hyperkalaemia esetnél a helyes válasz az ellaposodott P-hullám volt, a görbe viszont normál magasságú P-t mutatott. Új hullámforma került be, ami ténylegesen lapos.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v162-amplitudo', kind: 'javitas', title: 'Felismerhetőbb komplexusok',
        body: 'Bal tengelyeltérés mellett a szárblokk és a pacemaker QRS-e a II. elvezetésben alig három milliméter volt, néhol alacsonyabb a P-hullámoknál. Alsó korlátot kaptak, hogy a ritmuscsíkon megszámolhatók és a P-től megkülönböztethetők legyenek.',
        href: '/klinika/ekg/elemzes',
      },
    ],
  },
  {
    version: '1.6.1',
    date: '2026-09-01',
    title: 'Gyorsabb oldalbetöltés',
    summary: 'Egy tipikus oldal húsz adatbázis-kör helyett ötből épül fel.',
    entries: [
      {
        id: 'v161-harang', kind: 'javitas', title: 'A harang már nem lassít',
        body: 'A fejlécben látható értesítésszám eddig úgy állt elő, hogy a rendszer minden oldalbetöltésnél összeállította a teljes értesítéslistát — több mint tíz külön lekérdezés, pusztán egy szám kedvéért. Mostantól egyetlen körben számolódik. A részletes lista az Értesítések oldalon változatlan.',
        href: '/ertesitesek',
      },
      {
        id: 'v161-munkamenet', kind: 'javitas', title: 'Kevesebb hitelesítési kérés',
        body: 'A bejelentkezett felhasználó adatait oldalanként négy-öt helyről kérdeztük le, és mindegyik külön hálózati kérés volt a hitelesítési szolgáltatás felé. Mostantól kérésenként egyszer történik meg.',
        href: '/',
      },
      {
        id: 'v161-kapcsolok', kind: 'javitas', title: 'Kapcsolók egy körben',
        body: 'A funkciókapcsolókat oldalanként külön-külön kérdeztük le, pedig a tábla néhány sorból áll. Egyszerre beolvasva egyetlen kör is elég. A kedvencek és a karbantartás állapota szintén kérésenként egyszer töltődik be.',
        href: '/',
      },
    ],
  },
  {
    version: '1.6.0',
    date: '2026-09-01',
    title: 'EKG fejlődéskövetés',
    summary: 'A válaszaid mostantól mentődnek, és kompetencia-területenként mutatják, hol tartasz.',
    entries: [
      {
        id: 'v160-mentes', kind: 'funkcio', title: 'Eredmények mentése',
        body: 'A vezetett elemzés, az önálló elemzés és a gyakorló mód válaszai mentődnek, kompetencia-területhez rendelve. Nem az számít, hány esetet oldottál meg, hanem hogy mely területeken tévedsz rendszeresen. Az eredmények csak a saját fiókodhoz tartoznak.',
        href: '/klinika/ekg/fejlodes',
      },
      {
        id: 'v160-fejlodes', kind: 'funkcio', title: 'Saját fejlődés nézet',
        body: 'Nyolc kompetencia-terület százalékos eredménnyel: ritmusfelismerés, frekvencia, AV-blokkok, vezetési zavarok, tengelyállás, ST-T eltérések, QT és elektrolitok, klinikai értelmezés. A még nem gyakorolt területek is látszanak, hogy a fehér foltok kiderüljenek. A százalék területenként az utolsó negyven válaszból számolódik, így a régi hibák nem rontják örökre az arányt.',
        href: '/klinika/ekg/fejlodes',
      },
      {
        id: 'v160-gyakorlas', kind: 'funkcio', title: 'Személyre szabott gyakorlás',
        body: 'A korábban előkészítés alatt álló mód működik: a rendszer a leggyengébb területedet választja ki, és az ahhoz tartozó eseteket ajánlja. A fejlődés nézetből célzottan is indítható egy adott területre.',
        href: '/klinika/ekg/elemzes/gyakorlas',
      },
      {
        id: 'v160-kompetencia', kind: 'javitas', title: 'Pontosított kompetencia-hozzárendelés',
        body: 'Két területcímke nem egyezett a tényleges elemazonosítókkal, és nyolc gyakorolható kórkép egyik területhez sem tartozott — azok válaszai kimaradtak volna a fejlődéskövetésből. Most minden gyakorolható elem és minden elemzési lépés besorolható.',
        href: '/klinika/ekg/fejlodes',
      },
    ],
  },
  {
    version: '1.5.14',
    date: '2026-08-27',
    title: 'Átvizsgálás utáni javítások',
    summary: 'A Copilot kapcsolója hiányzott, és az oldalbetöltés fölösleges adatbázis-kérdéseket futtatott.',
    entries: [
      {
        id: 'v1514-copilot-flag', kind: 'javitas', title: 'A Copilot kapcsolója',
        body: 'Az APN Copilot kapcsolóját öt helyen kérdezte a rendszer, de soha nem került be a beállítások közé. Mivel a hiányzó kapcsoló kikapcsoltnak számít, a Copilot mindenhol rejtve maradt, és a Beállítások oldalon sem lehetett bekapcsolni. Most létrejön, alapból kikapcsolva — a Copilot API-kulcs nélkül nem működik, ezért csak akkor érdemes bekapcsolni, ha a kulcs be van állítva.',
        href: '/cms/beallitasok',
      },
      {
        id: 'v1514-teljesitmeny', kind: 'javitas', title: 'Kevesebb adatbázis-kérdés',
        body: 'Minden oldalbetöltés újra lekérdezte a karbantartás állapotát és a szerepkört, néha többször is ugyanazon az oldalon. Mostantól kérésenként egyszer kérdezzük le őket. Ez érezhetően gyorsítja a navigációt, és kíméli az adatbázis havi keretét.',
        href: '/',
      },
      {
        id: 'v1514-kapcsolok', kind: 'javitas', title: 'Hatástalan kapcsoló elrejtése',
        body: 'A Beállítások oldalon szerepelt egy kapcsoló, amit a rendszer sehol nem használt — átkapcsolása semmit nem csinált. Az ilyen kapcsolók mostantól nem jelennek meg.',
        href: '/cms/beallitasok',
      },
    ],
  },
  {
    version: '1.5.13',
    date: '2026-08-27',
    title: 'Pontosabb menüugrás',
    summary: 'A menüpontokra kattintva a szakasz teteje a fejléc alatt jelenik meg.',
    entries: [
      {
        id: 'v1513-horgony', kind: 'javitas', title: 'Ugrás a szakasz tetejére',
        body: 'A nyitóoldal menüpontjaira kattintva a ragadó fejléc eltakarta a szakasz elejét. Mostantól kis levegővel a fejléc alatt nyílik meg a szakasz, és a görgetés is folyamatos, nem ugrik.',
        href: '/',
      },
    ],
  },
  {
    version: '1.5.12',
    date: '2026-08-27',
    title: 'Nyitóoldal finomítások',
    summary: 'Pontosított szövegek a mentorprogramnál, tömörebb záró szakasz, működő telepítési útmutató.',
    entries: [
      {
        id: 'v1512-mentor', kind: 'eszkoz', title: 'Pontosabb mentorkártyák',
        body: 'A mentor és a mentorált is APN — gyakorlott, illetve pályakezdő —, nem általános ápoló. A címkék is beszédesebbek: „Amiben támogat” és „Fejlődési célok”.',
        href: '/',
      },
      {
        id: 'v1512-telepites', kind: 'javitas', title: 'Működő telepítési útmutató',
        body: 'A „Vidd magaddal” szakasz üresen maradhatott, ha a böngésző nem kínálta fel a telepítést: a cím megjelent, a tartalom nem. Mostantól mindig van használható tartalom — natív gomb, ahol lehet, egyébként lépésről lépésre szóló útmutató. Ha a telepítés gomb valamiért nem működne, a rendszer átvált az útmutatóra ahelyett, hogy néma maradna.',
        href: '/',
      },
      {
        id: 'v1512-zaro', kind: 'eszkoz', title: 'Tömörebb záró szakasz',
        body: 'A záró gondolat kisebb betűmérettel és szűkebb térközökkel jelenik meg, egyetlen mondatba fűzve. A szakmai út szakaszból elhagytam a gombot, mert csak visszavitt egy fentebbi részhez.',
        href: '/',
      },
    ],
  },
  {
    version: '1.5.11',
    date: '2026-08-27',
    title: 'Kijelentkezés a nyitóoldalra',
    summary: 'Kilépés után a nyitóoldal fogad, nem a bejelentkezési űrlap.',
    entries: [
      {
        id: 'v1511-kilepes', kind: 'eszkoz', title: 'Kilépés utáni oldal',
        body: 'Kijelentkezés után a nyitóoldal jelenik meg a bejelentkezési űrlap helyett. Így a kilépés természetesebb lezárás, és onnan bármikor újra be lehet lépni a fejléc gombjával.',
        href: '/',
      },
    ],
  },
  {
    version: '1.5.10',
    date: '2026-08-27',
    title: 'Keskenyebb bejelentkezés',
    summary: 'A bejelentkezési űrlap széles képernyőn is olvasható méretű.',
    entries: [
      {
        id: 'v1510-login', kind: 'javitas', title: 'Bejelentkezés elrendezése',
        body: 'Asztali gépen a két mezős űrlap a teljes tartalomsávot kitöltötte, ami szokatlanul széles beviteli mezőket adott. Mostantól keskenyebb, középre igazított elrendezésben jelenik meg. Telefonon nincs változás.',
        href: '/login',
      },
    ],
  },
  {
    version: '1.5.9',
    date: '2026-08-27',
    title: 'Telepíthető alkalmazás',
    summary: 'A platform felajánlja a telefonra telepítést, eszköznek megfelelő módon.',
    entries: [
      {
        id: 'v159-telepites', kind: 'funkcio', major: true, title: 'Telepítés felajánlása',
        body: 'A nyitóoldalon külön szakasz, a bejelentkezett felületen pedig egy visszafogott sáv ajánlja fel a telepítést. Telepítve a platform saját ablakban indul, gyorsabban nyílik, és a korábban megnyitott tartalom hálózat nélkül is elérhető marad.',
        href: '/',
      },
      {
        id: 'v159-ios', kind: 'eszkoz', title: 'iPhone-on lépésről lépésre',
        body: 'Androidon és asztali böngészőben egy gombnyomás a telepítés. iPhone-on és iPaden a rendszer nem engedi ezt a gombot, ezért ott a rendszer helyett leírjuk a három lépést: megosztás ikon, hozzáadás a kezdőképernyőhöz, megerősítés. A felajánlás nem jelenik meg, ha a platform már telepítve fut, és elutasítás után egy hónapig nem kérdez újra.',
        href: '/',
      },
    ],
  },
  {
    version: '1.5.8',
    date: '2026-08-27',
    title: 'Tömörebb nyitóoldal',
    summary: 'A nyitóoldal harmadával rövidebb lett, a mentorprogram pedig hamarosan jelzést kapott.',
    entries: [
      {
        id: 'v158-tomorites', kind: 'eszkoz', major: true, title: 'Kevesebb görgetés',
        body: 'A nyitóoldal 3200 pixelről 2200-ra rövidült. A legnagyobb nyereség a „Így működik” szakasz elhagyása volt: ugyanazt a felületet mutatta, ami a bemutatkozó szakaszban már szerepel, tehát csak görgetést adott hozzá. A célcsoportok kártyák helyett kompakt sávba kerültek, a térközök és a kártyák pedig szűkebbek lettek.',
        href: '/',
      },
      {
        id: 'v158-mentor', kind: 'eszkoz', title: 'Mentorprogram: hamarosan',
        body: 'A mentorprogram szakasz kiemelt „Hamarosan” jelzést kapott, és a szöveg is világossá teszi, hogy fejlesztés alatt áll. A korábbi „Csatlakozom” gomb lekerült — nem vezetett volna sehová, és azt ígérte volna, ami még nem elérhető.',
        href: '/',
      },
    ],
  },
  {
    version: '1.5.7',
    date: '2026-08-27',
    title: 'Kijelentkezés a fejlécből',
    summary: 'Egy gombnyomással kiléphetsz, a profil megnyitása nélkül.',
    entries: [
      {
        id: 'v157-kijelentkezes', kind: 'eszkoz', title: 'Kijelentkezés gomb',
        body: 'A fejlécben, a profilkép mellett megjelent egy kilépés gomb. Eddig ehhez be kellett menni a profilba és legörgetni. A profil oldalon lévő gomb továbbra is megmarad, és mindkettő ugyanazt a műveletet használja.',
        href: '/profil',
      },
    ],
  },
  {
    version: '1.5.6',
    date: '2026-08-27',
    title: 'Tisztább karbantartási képernyő',
    summary: 'Karbantartás alatt csak a tájékoztató látszik, bejelentkezési űrlap nélkül.',
    entries: [
      {
        id: 'v156-login', kind: 'eszkoz', title: 'Csak az üzenet',
        body: 'Bekapcsolt karbantartás alatt a bejelentkezés oldalon sem jelenik meg az űrlap — a látogató a logót, a címet és az üzenetet látja. Az adminisztrátori belépés egy visszafogott lenyitóval érhető el: az űrlap nem tűnhet el nyomtalanul, mert kijelentkezett állapotban akkor senki nem tudná feloldani a karbantartást. A regisztráció ilyenkor rejtve marad, mert új fiók nyitásának nincs értelme.',
        href: '/cms/beallitasok',
      },
    ],
  },
  {
    version: '1.5.5',
    date: '2026-08-27',
    title: 'Nyitóoldal elrendezés javítása',
    summary: 'A nyitóoldal asztali gépen is a teljes szélességet használja.',
    entries: [
      {
        id: 'v155-szelesseg', kind: 'javitas', title: 'Teljes szélességű nyitóoldal',
        body: 'A nyitóoldal asztali gépen is keskeny, mobilra szabott sávban jelent meg. Az ok technikai volt: az útvonal-információ a válasz fejlécébe került a kérésé helyett, így az oldal nem ismerte fel, hogy nyitóoldalt mutat, és rajta maradt a belső felület szűk elrendezése. Ez javítva.',
        href: '/',
      },
    ],
  },
  {
    version: '1.5.4',
    date: '2026-08-27',
    title: 'Karbantartási mód',
    summary: 'A platform adminból ideiglenesen lezárható, saját üzenettel.',
    entries: [
      {
        id: 'v154-karbantartas', kind: 'funkcio', title: 'Karbantartási mód',
        body: 'A Tartalomkezelés → Beállítások oldalon egy kapcsolóval lezárható a platform. Ilyenkor a felhasználók tájékoztató oldalt kapnak, az adminisztrátorok viszont továbbra is beléphetnek és dolgozhatnak — enélkül a karbantartás alatt maga a javítás sem lenne elvégezhető.',
        href: '/cms/beallitasok',
      },
      {
        id: 'v154-uzenet', kind: 'eszkoz', title: 'Saját üzenet',
        body: 'A tájékoztató szövege szerkeszthető, például a várható befejezés idejével. Üresen hagyva az alapértelmezett szöveg jelenik meg. Az üzenet a bejelentkezésnél is látszik, hogy a belépő tudja, mire számítson.',
        href: '/cms/beallitasok',
      },
    ],
  },
  {
    version: '1.5.3',
    date: '2026-08-27',
    title: 'Elfelejtett jelszó',
    summary: 'A felhasználó maga is kérhet jelszó-visszaállítást a bejelentkezésnél.',
    entries: [
      {
        id: 'v153-elfelejtett', kind: 'funkcio', title: 'Elfelejtettem a jelszavam',
        body: 'A bejelentkezésnél mostantól visszaállító levél kérhető: elég az e-mail címet kitölteni. A rendszer akkor is azonos választ ad, ha a címmel nincs fiók — így a válaszból nem lehet kideríteni, kinek van regisztrációja.',
        href: '/login',
      },
      {
        id: 'v153-linkek', kind: 'javitas', title: 'A linkek sablonmódosítás nélkül is működnek',
        body: 'A hitelesítő levelek visszatérési címét a kód adja meg, nem a levélsablon. Erre azért volt szükség, mert a sablonok csak saját levélküldő beállítása mellett szerkeszthetők. A rendszer mindkét linkformátumot kezeli, így a későbbi váltás nem okoz kiesést.',
        href: '/login',
      },
    ],
  },
  {
    version: '1.5.2',
    date: '2026-08-27',
    title: 'Jelszó-visszaállítás',
    summary: 'Az e-mailes hitelesítő linkek végre célba érnek: regisztráció-megerősítés és jelszó-visszaállítás.',
    entries: [
      {
        id: 'v152-auth', kind: 'javitas', title: 'Működő jelszó-visszaállítás',
        body: 'A rendszer eddig publikusnak jelölte az /auth útvonalat, de az oldal nem létezett — a jelszó-visszaállító és regisztráció-megerősítő levelek üres helyre vezettek. Mostantól a linkek célba érnek: a token munkamenetre váltódik, és a felhasználó egy külön oldalon adja meg az új jelszavát.',
        href: '/login',
      },
      {
        id: 'v152-lejart', kind: 'javitas', title: 'Lejárt link kezelése',
        body: 'A már felhasznált vagy lejárt link nem hibaoldalt ad, hanem érthető üzenetet a bejelentkezésnél. Az új jelszó oldal önmagában nem nyitható meg — csak érvényes visszaállító linkről.',
        href: '/login',
      },
    ],
  },
  {
    version: '1.5.1',
    date: '2026-08-27',
    title: 'Új név: APN-MED',
    summary: 'A platform neve APN-MED lett, saját domainnel.',
    entries: [
      {
        id: 'v151-nev', kind: 'funkcio', major: true, title: 'APN-MED',
        body: 'A platform mostantól APN-MED néven fut. A név a böngészőfülön, a telepíthető alkalmazásban, a fejlécben, a bejelentkezésnél és a nyitóoldalon is átvezetve. A szakmai tartalomban az APN rövidítés változatlan maradt, mert ott a szakmát jelöli (Advanced Practice Nurse), nem a platformot — az APN-fókusz, a gyakorló APN-ek és az APN szakirány tehát érintetlen.',
        href: '/',
      },
    ],
  },
  {
    version: '1.5.0',
    date: '2026-08-27',
    title: 'Új nyitóoldal',
    summary: 'A kijelentkezett látogatók új nyitóoldalt kapnak, a platform saját design rendszerével.',
    entries: [
      {
        id: 'v150-landing', kind: 'funkcio', title: 'Nyitóoldal',
        body: 'Teljesen új nyitóoldal: bemutatkozó szakasz működő felületmakettel, a négy fő modul, a szakmai út hat lépése, a mentorprogram, egy áttekintés a platform működéséről és a célcsoportok. A makettek nem képfájlok, hanem HTML-ből rajzolódnak, így minden felbontáson élesek maradnak.',
        href: '/',
      },
      {
        id: 'v150-design', kind: 'eszkoz', title: 'Egységes design a nyitóoldalon',
        body: 'A nyitóoldal a platform saját tokenjeire épül, nem külön palettára. A modulkártyák a valódi modul-akcentusokat kapják: ugyanaz a szín jelöli itt a Tudástárat, mint odabent a csempéjét — így a nyitóoldal és a belső felület egy rendszernek látszik.',
        href: '/',
      },
      {
        id: 'v150-middleware', kind: 'javitas', title: 'A nyitóoldal végre látszik',
        body: 'A nyitóoldal eddig soha nem jelent meg: a munkamenet-kezelő minden kijelentkezett látogatót azonnal a bejelentkezésre irányított, még mielőtt az oldal lefutott volna. Mostantól a nyitóoldal publikus, és a fejléc is hozzá igazodik — a landing saját navigációval, teljes szélességben jelenik meg.',
        href: '/',
      },
    ],
  },
  {
    version: '1.4.9',
    date: '2026-08-27',
    title: 'Nehézségi szintek és lokalizáció',
    summary: 'A gyakorlás szint szerint választható, és a felismerés után megkérdezi, hol látszik az eltérés.',
    entries: [
      {
        id: 'v149-szintek', kind: 'eszkoz', major: true, title: 'Nehézségi szintek',
        body: 'Négy választható szűrő: vegyes, kezdő, haladó és gyakorlott. A besorolást nem az elméleti bonyolultság dönti el, hanem az, mennyire könnyű összetéveszteni — a kamrafibrilláció súlyos kórkép, felismerni mégis egyszerű, míg a hypo- és hypercalcaemia elkülönítése finom munka. Kilenc kezdő, tizenegy haladó és hét gyakorlott szintű elem.',
        href: '/klinika/ekg',
      },
      {
        id: 'v149-lokalizacio', kind: 'szakmai', title: 'Második kérdés: hol látod?',
        body: 'A felismerés után tizenegy kórképnél egy második kérdés következik a lokalizációról — mely területen van az ST-eleváció, melyik elvezetésben látszik az rsR alak, melyik két elvezetés dönti el a tengelyállást. A puszta alakfelismerés kevés: a hely adja a klinikai jelentést. Az elvezetések kiemelése csak e után jelenik meg, hogy ne árulja el a választ.',
        href: '/klinika/ekg',
      },
    ],
  },
  {
    version: '1.4.8',
    date: '2026-08-27',
    title: 'Klinikai kontextus a gyakorlásban',
    summary: 'A gyakorló és a vizsga mód kérdései klinikai képpel indulnak, a válaszlehetőségek pedig valódi tévesztési párok.',
    entries: [
      {
        id: 'v148-vignette', kind: 'szakmai', title: 'Klinikai kép minden kérdésnél',
        body: 'Az EKG-t a gyakorlatban sosem önmagában nézzük. Minden kérdés előtt megjelenik egy rövid bemutatás — életkor, panasz, vitális paraméterek —, ami megváltoztatja a gondolkodást: a 40 perces pulzus melletti szédülés más súlyú, mint ugyanaz a görbe panasz nélkül.',
        href: '/klinika/ekg',
      },
      {
        id: 'v148-csalik', kind: 'eszkoz', title: 'Valódi tévesztési párok',
        body: 'A válaszlehetőségek eddig véletlenszerűek voltak, így a kamrafibrilláció mellett normál EKG is szerepelhetett — ott a találgatás is működik. Mostantól minden kérdésnél azok a kórképek a csalik, amelyekkel a gyakorlatban is összetéveszthető: jobb és bal szárblokk, Wenckebach és Mobitz II, ST-eleváció és pericarditis, hypo- és hyperkalaemia.',
        href: '/klinika/ekg',
      },
      {
        id: 'v148-tipp', kind: 'szakmai', title: 'Elkülönítési tipp a válasz után',
        body: 'A magyarázat mellett megjelenik, mi különbözteti meg az adott kórképet a hozzá legközelebb állótól — például hogy a Wenckebachnál a PR ütésről ütésre nyúlik, Mobitz II-nél viszont állandó marad.',
        href: '/klinika/ekg',
      },
      {
        id: 'v148-uj-elemek', kind: 'szakmai', title: 'Két új gyakorló elem',
        body: 'A kamrai extrasystole és a tengelyeltérés bekerült a gyakorolható kórképek közé — mindkettő felismerése a 12 elvezetéses nézetben értelmes feladat. A gyakorló mostantól 27 elemből válogat.',
        href: '/klinika/ekg',
      },
    ],
  },
  {
    version: '1.4.7',
    date: '2026-08-27',
    title: '12 elvezetéses gyakorló és vizsga',
    summary: 'A gyakorló és a vizsga mód is teljes 12 elvezetéses EKG-t mutat, valódi morfológiával.',
    entries: [
      {
        id: 'v147-gyakorlo', kind: 'eszkoz', major: true, title: 'Teljes 12 elvezetés a gyakorlásban',
        body: 'A gyakorló és a vizsga mód eddig egyetlen sematikus vonalat mutatott. Mostantól mindkettő ugyanazt a 12 elvezetéses megjelenítőt használja, mint az EKG elemzés: szabványos 3×4 elrendezés, hosszú ritmuscsík, milliméterrács és nagyítás. Helyes válasz után a rendszer kiemeli azokat az elvezetéseket, ahol az eltérés a legjobban látszik, és egy gombbal átvisz a részletes leíráshoz.',
        href: '/klinika/ekg',
      },
      {
        id: 'v147-morfologia', kind: 'szakmai', title: 'Valódi EKG-morfológiák',
        body: 'A görbegenerátor megtanulta a felismeréshez nélkülözhetetlen alakokat: jobb szárblokknál rsR a V1-ben és elhúzódó S a lateralis elvezetésekben, bal szárblokknál mély QS a V1–V3-ban és bevágott, széles R a V5–V6-ban, diszkordáns T-hullámokkal. Emellett Wenckebach-periodika nyúló PR-rel, Mobitz II hirtelen kimaradó QRS-sel, teljes AV-blokk független pitvari és kamrai ütemmel, kamrai extrasystole kompenzációs szünettel, valamint durva hullámú kamrafibrilláció.',
        href: '/klinika/ekg',
      },
      {
        id: 'v147-parameterek', kind: 'szakmai', title: 'Mind a 25 gyakorló elem paraméterezve',
        body: 'Az atlasz minden kvízbe kerülő eleméhez elkészült a 12 elvezetéses paraméterezés — a normál EKG-tól a pericarditis diffúz elevációján és a digoxin teknőszerű ST-depresszióján át a gyermekkori sajátosságokig.',
        href: '/klinika/ekg',
      },
    ],
  },
  {
    version: '1.4.6',
    date: '2026-08-26',
    title: 'Mérőjelek az EKG-görbén',
    summary: 'Az elemzési lépéshez tartozó szakaszt a rendszer megjelöli a ritmuscsíkon.',
    entries: [
      {
        id: 'v146-meres', kind: 'eszkoz', major: true, title: 'Mérőjelek és kalibrációs jel',
        body: 'Az elemzés során a ritmuscsíkon zöld mérőjel mutatja, mit hol kell mérni: az R–R távolságokat a frekvenciánál és a ritmusnál, a PR-intervallumot, a QRS szélességét, a QT-t, az ST-szakaszt a J-ponttól, valamint a P- és T-hullámot. A kalibrációs lépésnél a 10 mm = 1 mV jel emelkedik ki. A jelöléseken a mért érték is szerepel, ha elfér.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v146-geometria', kind: 'javitas', title: 'Pontosabb görbegeometria',
        body: 'A görbe időzítését összehangoltam a névleges intervallumokkal: a rácson lemért PR, QRS és QT mostantól pontosan azt az értéket adja, ami az eset paraméterében szerepel. Korábban a PR-nél kb. 30 ms eltérés volt.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v146-utesek', kind: 'javitas', title: 'Egyező ütésidőpontok az elvezetéseken',
        body: 'Szabálytalan ritmusnál — például pitvarfibrillációnál — az egyes elvezetéseken eltérő helyre kerültek az ütések, mert az R–R szórása elvezetésenként külön számítódott. Egy szívről van szó, ezért az ütésidőpontok mostantól minden elvezetésen azonosak.',
        href: '/klinika/ekg/elemzes',
      },
    ],
  },
  {
    version: '1.4.5',
    date: '2026-08-26',
    title: 'Egységes red flag szóhasználat',
    summary: 'A „vörös zászló” kifejezés helyét mindenhol a „red flag jel” vette át.',
    entries: [
      {
        id: 'v145-redflag', kind: 'javitas', title: 'Red flag jelek',
        body: 'A platform korábban két kifejezést használt ugyanarra: a betegségtárban és az akut témaköröknél „vörös zászló”, a vizsgálati modulban „red flag” szerepelt. Mostantól mindenhol a red flag alak jelenik meg — a betegségtár adatlapjain, az akut témaköröknél, a klinikai esetek összefoglalóiban és a szerkesztői űrlapokon is.',
        href: '/betegsegtar/akut',
      },
    ],
  },
  {
    version: '1.4.4',
    date: '2026-08-26',
    title: 'Rendezettebb elemzés-kezdőlap',
    summary: 'Az EKG elemzés belépő képernyőjén az esetlista alapból csukva marad.',
    entries: [
      {
        id: 'v144-eset-lista', kind: 'eszkoz', title: 'Csukott esetlista',
        body: 'Az „Elérhető esetek” lista alapértelmezetten összecsukott állapotban jelenik meg, így a három elemzési mód marad a hangsúlyos. A fejlécen látszik, hány eset érhető el, és egy koppintással kibontható.',
        href: '/klinika/ekg/elemzes',
      },
    ],
  },
  {
    version: '1.4.3',
    date: '2026-08-26',
    title: 'Szóhasználat javítása',
    summary: 'Nyelvhelyességi javítás az EKG elemzés magyarázataiban.',
    entries: [
      {
        id: 'v143-elettanilag', kind: 'javitas', title: 'Élettanilag',
        body: 'A PR-intervallum lépés segítségében az „élettanosan” alak szerepelt; a helyes „élettanilag” váltotta fel.',
        href: '/klinika/ekg/elemzes',
      },
    ],
  },
  {
    version: '1.4.2',
    date: '2026-08-26',
    title: 'Önálló EKG elemzés',
    summary: 'Segítség nélküli elemzés, majd kétoldalas összehasonlítás a referenciaelemzéssel.',
    entries: [
      {
        id: 'v142-solo', kind: 'funkcio', title: 'Önálló elemzés mód',
        body: 'Az EKG-t segítség és lépésenkénti visszajelzés nélkül elemzed: ritmus, frekvencia, tengely, PR, QRS, QT/QTc, ST- és T-eltérések a területük megjelölésével, végül saját szöveges összegzés. Az ellenőrzés után elemenként látod, mi egyezett a referenciával — helyes, részben helyes vagy eltérő minősítéssel. A kitöltetlen mezők nem rontják az eredményt.',
        href: '/klinika/ekg/elemzes/onallo',
      },
      {
        id: 'v142-modevalto', kind: 'eszkoz', title: 'Módváltó az eseteknél',
        body: 'Ugyanaz az eset elvégezhető vezetett és önálló módban is, az eset tetején lévő váltóval. Érdemes előbb vezetetten végigmenni, majd önállóan ismételni.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v142-qtc', kind: 'javitas', title: 'Pontosabb QT-értékelés',
        body: 'A rövid QT küszöbét a klinikai gyakorlathoz igazítottam. Szélsőséges frekvencián a rendszer mostantól jelzi, hogy a Bazett-képlet torzít — gyors ritmusnál túl-, lassúnál alulkorrigál —, és ilyenkor a szomszédos kategóriát is elfogadja helyes válaszként.',
        href: '/klinika/ekg/elemzes/onallo',
      },
    ],
  },
  {
    version: '1.4.1',
    date: '2026-08-26',
    title: 'Több EKG eset, forrásokkal összekötve',
    summary: 'Az EKG elemzés öt új esettel bővült, és a szakmai háttér mostantól a központi forrás-regiszterből él.',
    entries: [
      {
        id: 'v141-cases', kind: 'szakmai', title: 'Öt új EKG eset',
        body: 'Anterior ST-elevációval járó infarktus, teljes AV-blokk, pitvari flutter 2:1 átvezetéssel, tüdőembólia jobbszív-terheléssel, valamint hypokalaemia megnyúlt QT-vel. Mind a nyolc eset klinikai kontextussal indul, referenciaelemzéssel zárul, és a kiemelt eltéréseknél megadja a differenciáldiagnózist is.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v141-evidence', kind: 'forras', major: true, title: 'Szakmai háttér a forrás-regiszterből',
        body: 'Az esetek már nem másolják a forrás adatait, hanem a központi regiszterre hivatkoznak. Így az évszám, az utolsó ellenőrzés és a visszavonás egy helyen tartható karban, és a verzió-ellenőrzés az EKG-esetekre is kiterjed: minden forrásnál látszik, ha felülvizsgálat esedékes, és onnan közvetlenül megnyitható a kiadó hivatalos regisztere.',
        href: '/klinika/tudastar',
      },
      {
        id: 'v141-sources', kind: 'forras', title: 'Négy új forrás a regiszterben',
        body: 'ESC pitvarfibrilláció (2024), ESC ingerképzés és ingervezetés (2021), Európai Újraélesztési Tanács különleges körülmények (2021), valamint a magasvérnyomás-betegség ellátásáról szóló hazai irányelv (002311, 2025). Ez utóbbi hazai és elsődleges — a pitvarfibrillációhoz továbbra sem találtam érvényes magyar irányelvet, ezt a forrás jegyzete jelzi.',
        href: '/klinika/tudastar',
      },
    ],
  },
  {
    version: '1.4.0',
    date: '2026-08-26',
    title: 'Interaktív EKG elemzés',
    summary: 'Az EKG modul kiegészült a strukturált, lépésről lépésre vezetett EKG-elemzéssel, klinikai eseteken.',
    entries: [
      {
        id: 'v14-guided', kind: 'funkcio', title: 'Vezetett EKG elemzés',
        body: 'Tizenegy lépéses strukturált elemzés a kalibrációtól az összegzésig. Minden lépésnél kérdés, azonnali visszajelzéssel és magyarázattal — nem olvasod az elemzést, hanem elvégzed. A segítség gomb kontextuális magyarázatot ad, és onnan egy koppintással a meglévő EKG tananyag pontos részére lehet ugrani, majd visszatérni ugyanahhoz a lépéshez.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v14-viewer', kind: 'eszkoz', major: true, title: '12 elvezetéses EKG megjelenítő',
        body: 'Szabványos 3×4 elrendezés hosszú ritmuscsíkkal, 1 és 5 mm-es rácshálóval, hogy az intervallumok mérhetők legyenek. Nagyítható, és egy elvezetésre koppintva az teljes szélességben megnyílik. A görbék paraméterekből generálódnak, így egy új eset néhány sor adat.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v14-cases', kind: 'szakmai', title: 'Három kidolgozott EKG eset',
        body: 'Inferior ST-elevációval járó infarktus, pitvarfibrilláció gyors kamrai válasszal, és hyperkalaemia. Mindegyik klinikai kontextussal indul, referenciaelemzéssel zárul, és minden kiemelt eltéréshez megadja, mit látunk, hol látjuk, mit jelenthet, milyen differenciáldiagnózis merül fel, és miért fontos. Külön szakmai háttér panel jelöli, mire épül a magyarázat.',
        href: '/klinika/ekg/elemzes',
      },
    ],
  },
  {
    version: '1.3.1',
    date: '2026-08-26',
    title: 'Színes gyors elérés',
    summary: 'A kezdőlapi csempék mindegyike saját színt kapott, így ránézésre megkülönböztethetők.',
    entries: [
      {
        id: 'v131-tile-colors', kind: 'eszkoz', title: 'Új csempeszínek',
        body: 'Az Eseteim, az Új betegértékelés, a Klinikai kontextus, a Kedvenceim és a Profil csempe eddig szín nélkül jelent meg — mostantól mindegyiknek saját akcentusa van. A zöld a márka színe marad: a Labor és a Tudástár színe változatlan, és új csempéhez nem osztunk zöldet. A színek egy helyen, a testreszabás nézetben is ugyanúgy jelennek meg.',
        href: '/testreszabas',
      },
    ],
  },
  {
    version: '1.3.0',
    date: '2026-08-26',
    title: 'Felhasználókezelés az adminban',
    summary: 'Az adminisztrátor szerkesztheti a felhasználók adatait, szerepkörét, jelszavát és belépési e-mail címét.',
    entries: [
      {
        id: 'v13-user-edit', kind: 'funkcio', title: 'Felhasználó szerkesztése',
        body: 'A Tartalomkezelés → Felhasználók listából megnyitható adatlapon módosítható a név, szakirány, beosztás, munkahely, végzettség, nyilvántartási szám és telefonszám, valamint a szerepkör. Az utolsó adminisztrátor nem fokozható le.',
        href: '/cms/felhasznalok',
      },
      {
        id: 'v13-password', kind: 'funkcio', title: 'Jelszó és belépési e-mail',
        body: 'Az adminisztrátor beállíthat ideiglenes jelszót, vagy visszaállító levelet küldhet, hogy a felhasználó maga adja meg. A belépési e-mail cím is módosítható, a fiók pedig letiltható kilépő munkatársnál. Minden művelet bekerül az audit naplóba — a jelszó értéke soha.',
        href: '/cms/felhasznalok',
      },
    ],
  },
  {
    version: '1.2.1',
    date: '2026-08-26',
    title: 'Újdonságjelzés javítása',
    summary: 'A harangon megjelenő jelzés mostantól minden fiókon megbízhatóan eltűnik, ha megtekintetted az újdonságokat.',
    entries: [
      {
        id: 'v121-badge', kind: 'javitas', title: 'A jelzés eltűnik megtekintés után',
        body: 'Az újdonság eldöntése dátum helyett verziószám alapján történik, így nem függ a szerver napjától. A harang a fejlécben ül, ezért a „Megtekintettem” gomb mostantól a fejlécet is frissíti — korábban a szám a régi értéken maradt, amíg az oldalt újra nem töltötted.',
        href: '/ertesitesek',
      },
      {
        id: 'v121-profilok', kind: 'javitas', title: 'Minden fiókon működik',
        body: 'A korábban regisztrált fiókok is bekapcsolódtak a verzió-alapú jelzésbe, és az új regisztrációk a fiók létrejöttétől számítva kapják az újdonságokat — visszamenőleg semmit.',
        href: '/ujdonsagok',
      },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-08-26',
    title: 'Láz témakör és forráspolitika',
    summary: 'Új akut témakör a szepszis korai felismerésére, és a forrásjegyzékek rendezése a hazai irányelvek elsőbbsége szerint.',
    entries: [
      {
        id: 'v12-laz', kind: 'szakmai', title: 'Láz témakör',
        body: 'A szepszis és a szeptikus sokk korai felismerése, célzott góckeresés, red flag jelek, hemokultúra az antibiotikum előtt, differenciáldiagnózis és APN-fókusz. Külön kiemelve, hogy idős, immunszupprimált vagy neutropeniás betegnél a láz hiánya sem zárja ki a súlyos fertőzést.',
        href: '/betegsegtar/akut/laz',
      },
      {
        id: 'v12-forraspolitika', kind: 'forras', title: 'Forráspolitika a témakörökben',
        body: 'A szakmai források mostantól hazai irányelv, elsődlegesség, majd frissesség szerint rendezve jelennek meg. Ahol nincs érvényes hazai irányelv, a témakör ezt kiírja, és megnevezi, miért nemzetközi forrásra épül.',
        href: '/betegsegtar/akut/laz',
      },
      {
        id: 'v12-nice-sepsis', kind: 'forras', title: 'NICE szepszis-irányelvek frissítése',
        body: 'A NICE 2025 novemberében a korábbi NG51-et három irányelvre bontotta: NG253 (16 év felett), NG254 (16 év alatt), NG255 (terhesség). Az NG51 visszavont állapotban került a regiszterbe, figyelmeztetéssel. Felvéve a Surviving Sepsis Campaign 2021 is.',
        href: '/klinika/tudastar',
      },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-08-26',
    title: 'Akut állapotok bővítése',
    summary: 'Két új klinikai témakör az akut állapotok között, teljes orientációs anyaggal és forrásjegyzékkel.',
    entries: [
      {
        id: 'v11-akut-has', kind: 'szakmai', title: 'Akut hasi fájdalom témakör',
        body: 'Red flag jelek, stabilitás-értékelés, célzott anamnézis, EKG- és laborjavaslatok, differenciáldiagnózis (időkritikus, gyakori sebészeti és hasüregen kívüli okok), APN-fókusz és eszkalációs szempontok. Kapcsolódó vizsgálati rendszerek, laborok, EKG-eltérések és score-ok.',
        href: '/betegsegtar/akut/akut-hasi-fajdalom',
      },
      {
        id: 'v11-eszmeletvesztes', kind: 'szakmai', title: 'Eszméletvesztés témakör',
        body: 'A syncope elkülönítése az egyéb átmeneti eszméletvesztéstől, kardiális kockázat felismerése, kötelező EKG, célzott laborok, differenciáldiagnózis és APN-fókusz — az elesés- és ismétlődéskockázat felmérésével együtt.',
        href: '/betegsegtar/akut/eszmeletvesztes',
      },
      {
        id: 'v11-forrasok', kind: 'forras', title: 'Négy új klinikai forrás a regiszterben',
        body: 'WSES appendicitis (2020), WSES akut calculosus cholecystitis (2020), Tokyo Guidelines 2018 az epeúti fertőzésekről, valamint az ESC 2018 syncope irányelv.',
        href: '/klinika/tudastar',
      },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-08-26',
    title: 'Első teljes kiadás',
    summary:
      'A platform eddig elkészült moduljai együtt, éles használatra. Klinikai mag, tudástár, ' +
      'személyes fejlődés és tartalomkezelés egy rendszerben.',
    entries: [
      // ── Klinikai mag ─────────────────────────────
      {
        id: 'v1-vizsgalat', kind: 'funkcio', title: 'Betegvizsgálat',
        body: 'Strukturált propedeutikai vizsgálat szervrendszerenként, klinikai és oktatási módban. Rendszer-hub és vizsgálati elemek részletes leírással.',
        href: '/klinika/vizsgalat',
      },
      {
        id: 'v1-ertekeles', kind: 'funkcio', title: 'Betegértékelés',
        body: 'Tizenkét lépéses klinikai értékelés vitális paraméterekkel, anamnézissel és összefoglalóval.',
        href: '/klinika/ertekeles',
      },
      {
        id: 'v1-esetek', kind: 'funkcio', title: 'Eseteim és előzmények',
        body: 'Klinikai esetek rögzítése, SBAR-összefoglaló, utánkövetés esedékességi jelzéssel.',
        href: '/klinika/esetek',
      },
      {
        id: 'v1-score', kind: 'eszkoz', title: 'Score Hub',
        body: 'Klinikai skálák és pontozók egy helyen, azonnali értelmezéssel és sürgősségi jelzéssel.',
        href: '/klinika/tesztek',
      },
      {
        id: 'v1-labor', kind: 'labor', title: 'Labor Kisokos és panel-értékelés',
        body: 'Laborértékek referenciatartománnyal, kritikus küszöbökkel, gyermek- és terhességi eltérésekkel. A panel-értékelés több beírt értékből mintázatokat ismer fel.',
        href: '/klinika/labor',
      },
      {
        id: 'v1-labor-vvt', kind: 'labor', title: 'Vörösvértest-paraméterek',
        body: 'RBC, hematokrit, MCH, MCHC, RDW, retikulocita (arány és abszolút szám), LDH, haptoglobin, vörösvértest-morfológia, szérumvas és TVK. Új panelek: Vörösvérkép, Hemolízis. Hat új mintázat, köztük a hemolízis és a thromboticus mikroangiopátia.',
        href: '/klinika/labor',
      },
      {
        id: 'v1-ekg', kind: 'eszkoz', title: 'EKG-atlasz és gyakorlás',
        body: 'EKG-eltérések rendszerezve, hullámtani alapokkal és gyakorló móddal.',
        href: '/klinika/ekg',
      },
      {
        id: 'v1-copilot', kind: 'funkcio', title: 'APN Copilot',
        body: 'Klinikai döntéstámogatás kizárólag jóváhagyott forrásokból, kötelező forrásmegjelöléssel. Nem ad diagnózist.',
        href: '/klinika/copilot',
      },

      // ── Tudástár ─────────────────────────────────
      {
        id: 'v1-betegsegtar', kind: 'betegseg', title: 'Betegségtár',
        body: 'Kórképek APN-fókuszú adatlapjai: tünettan, differenciáldiagnózis, red flag jelek, kapcsolódó laborok és score-ok.',
        href: '/betegsegtar',
      },
      {
        id: 'v1-panasz', kind: 'betegseg', title: 'Panasz alapján',
        body: 'Vezető tünetből a lehetséges kórképek felé, sürgősség szerint rendezve.',
        href: '/betegsegtar/panasz',
      },
      {
        id: 'v1-akut', kind: 'szakmai', title: 'Akut állapotok és klinikai témakörök',
        body: 'Gyors klinikai orientáció akut helyzetekben, részletes témakörökkel — differenciáldiagnózis, kapcsolódó tudás, forrásjegyzék.',
        href: '/betegsegtar/akut',
      },
      {
        id: 'v1-tudastar', kind: 'forras', title: 'Protokollok és irányelvek',
        body: 'Forrás-regiszter és platform-irányelvek kategóriánként, felülvizsgálati dátumokkal.',
        href: '/klinika/tudastar',
      },
      {
        id: 'v1-guideline-search', kind: 'eszkoz', major: true, title: 'Összesített irányelv-kereső',
        body: 'Keresés cím, kiadó, azonosító vagy témakör szerint, szűrőkkel és frissesség szerinti rendezéssel. Minden forrásnál ellenőrizhető a kiadó hivatalos regiszterében, van-e frissebb kiadás.',
        href: '/klinika/tudastar',
      },
      {
        id: 'v1-kontextus', kind: 'szakmai', title: 'Klinikai kontextus',
        body: 'Összekapcsolt klinikai témák: egy helyzetből elérhető a kapcsolódó labor, score, EKG és irányelv.',
        href: '/kontextus',
      },

      // ── Személyes ────────────────────────────────
      {
        id: 'v1-kereses', kind: 'eszkoz', title: 'Globális keresés',
        body: 'Egy mezőben a betegségek, panaszok, laborok, score-ok, EKG-k, témakörök és irányelvek.',
        href: '/kereses',
      },
      {
        id: 'v1-kedvencek', kind: 'funkcio', title: 'Kedvencek',
        body: 'Csillagozott betegségek, laborok, score-ok és EKG-k gyors elérése.',
        href: '/kedvencek',
      },
      {
        id: 'v1-cpd', kind: 'funkcio', title: 'Szakmai fejlődés (CPD)',
        body: 'Továbbképzési pontok követése, tanúsítványok lejárati figyelmeztetéssel.',
        href: '/cpd',
      },
      {
        id: 'v1-testreszabas', kind: 'funkcio', title: 'Kezdőlap testreszabása',
        body: 'A gyors elérés csempéi szabadon összeállíthatók.',
        href: '/testreszabas',
      },
      {
        id: 'v1-ertesitesek', kind: 'funkcio', title: 'Értesítések és újdonságjelzés',
        body: 'Teendők (lejáró tanúsítvány, esedékes felülvizsgálat, utánkövetés) és az új szakmai tartalom külön szekcióban. Az újdonság a legutóbbi megtekintésedhez képest számít.',
        href: '/ertesitesek',
      },

      // ── Adminisztráció és platform ───────────────
      {
        id: 'v1-cms', kind: 'funkcio', title: 'Tartalomkezelés (CMS)',
        body: 'Irányelvek és betegségleírások piszkozat → lektorálás → publikálás folyamattal, forráskezeléssel, audit naplóval és tartalomfigyelővel.',
        href: '/cms',
      },
      {
        id: 'v1-jogosultsag', kind: 'funkcio', title: 'Szerepkörök és jogosultságok',
        body: 'APN, szerkesztő, lektor és adminisztrátor szerepkör, adatbázis-szintű jogosultságkezeléssel.',
      },
      {
        id: 'v1-pwa', kind: 'funkcio', title: 'Mobilra optimalizált felület (PWA)',
        body: 'A platform telepíthető a telefonra, és mobilon is teljes értékűen használható.',
      },
    ],
  },
]

/** Alapból lényegesnek számító típusok. */
const MAJOR_KINDS: ChangeKind[] = ['funkcio', 'szakmai', 'betegseg', 'labor', 'forras']

/** Lényeges-e a bejegyzés. A kézi jelölés felülírja a típus szerinti alapértéket. */
export function isMajor(e: FeatureEntry): boolean {
  return e.major ?? MAJOR_KINDS.includes(e.kind)
}

/**
 * A megjelenítendő kiadások.
 *
 * Teljes nézetben minden bejegyzés látszik. Szűkített nézetben csak a lényeges
 * változások, és az olyan kiadás, amelyből minden bejegyzés kimaradna, egészében
 * elmarad — üres kiadásfejléc semmit nem mondana.
 */
export function visibleReleases(showAll: boolean): Release[] {
  if (showAll) return RELEASES
  return RELEASES
    .map((r) => ({ ...r, entries: r.entries.filter(isMajor) }))
    .filter((r) => r.entries.length > 0)
}

export const APP_VERSION = RELEASES[0]?.version ?? '1.0.0'

/**
 * Két verziószám összehasonlítása (1.10.0 > 1.9.0).
 * Visszatérés: negatív ha a < b, 0 ha egyenlő, pozitív ha a > b.
 */
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map((x) => parseInt(x, 10) || 0)
  const pb = b.split('.').map((x) => parseInt(x, 10) || 0)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0)
    if (d !== 0) return d
  }
  return 0
}

/**
 * A felhasználó által utoljára látott verzió ÓTA megjelent kiadások.
 *
 * Miért verzió és nem dátum: a dátum-összehasonlítás félrement, ha egy kiadás
 * dátuma a szerver aktuális napjánál későbbi volt — ilyenkor a „megtekintettem”
 * gomb után is újdonságként maradt. A verziószám ettől független.
 */
export function releasesAfterVersion(seenVersion: string | null, showAll = true): Release[] {
  if (!seenVersion) return []
  const list = visibleReleases(showAll)
  const latest = list[0]
  // Ha a felhasználónál rögzített verzió magasabb a legfrissebb kiadásnál, akkor egy
  // verziószámot utólag korrigáltunk. Ilyenkor a nyilvántartás beragadna: minden
  // további kiadás alacsonyabb számot kapna, és soha nem jelenne meg. Ezért a
  // legfrissebb kiadást egyszer megmutatjuk, és a megtekintés után az állapot helyreáll.
  if (latest && compareVersions(seenVersion, latest.version) > 0) return [latest]
  return list.filter((r) => compareVersions(r.version, seenVersion) > 0)
}

/** Minden kiadás bejegyzése lapítva, legfrissebb elöl. */
export function allChanges(showAll = true): ChangeEntry[] {
  return visibleReleases(showAll)
    .flatMap((r) => r.entries.map((e) => ({ ...e, date: r.date, version: r.version })))
}

/** A megadott időpont óta kelt bejegyzések, legfrissebb elöl. */
export function changesSince(iso: string | null, showAll = true): ChangeEntry[] {
  if (!iso) return []
  const since = iso.slice(0, 10)
  const today = new Date().toISOString().slice(0, 10)
  // A jövőbeli dátumú bejegyzés kiszűrése: ilyen elvileg nincs, de ha elgépelés
  // folytán mégis bekerül, ne ragadjon be örökre olvasatlanként.
  return allChanges(showAll).filter((c) => c.date > since && c.date <= today)
}

/** A megadott időpont óta megjelent kiadások. */
export function releasesSince(iso: string | null): Release[] {
  if (!iso) return []
  const since = iso.slice(0, 10)
  return RELEASES.filter((r) => r.date > since)
}

/** A legfrissebb kiadás. */
export function latestRelease(): Release | null {
  return RELEASES[0] ?? null
}
