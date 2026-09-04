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
    version: '1.34.0',
    date: '2026-09-04',
    title: 'Egységes vizuális rendszer',
    summary: 'A design tokenek átvették a rögzített értékek helyét az egész felületen.',
    entries: [
      {
        id: 'v1340-audit', kind: 'eszkoz', title: 'Mit mutatott az átvizsgálás',
        body: 'A stíluslapban 45 különböző betűméret, 29 sugárérték és 17 árnyékdefiníció szerepelt. A design tokenek megvoltak, de alig használtuk őket: a betűméretek 8, a térközök 7 százaléka jött belőlük. Ez volt a rendszertelenség forrása — nem az, hogy hiányzott a rendszer, hanem hogy nem alkalmaztuk.',
        href: '/',
      },
      {
        id: 'v1340-tipografia', kind: 'eszkoz', title: 'Hatfokú tipográfia',
        body: 'A közeli betűméretek egy szintre kerültek: 234 helyen. A 13, 13,5 és 14 pixel közötti különbség nem hordozott jelentést, csak rendezetlenséget. A 17 pixel fölötti méreteket nem bántottuk — azok kiemelt számok és címek, saját szereppel.',
        href: '/',
      },
      {
        id: 'v1340-sugar', kind: 'eszkoz', title: 'Négy sugár, három árnyék',
        body: 'A lekerekítés 106 helyen állt át négy egységes értékre. Az árnyékokból három szint maradt: sík felület, enyhén kiemelkedő, lebegő. A korábbi tizenhét változat között alig volt látható különbség, viszont mindegyiket külön karban kellett tartani.',
        href: '/',
      },
      {
        id: 'v1340-ellenorzes', kind: 'eszkoz', title: 'Gépi ellenőrzés',
        body: 'A 350 csere után öt oldalt vizsgáltunk végig gépileg: van-e olvashatatlanul kicsi vagy aránytalanul nagy szöveg. Egy sem volt. A funkciók és az elrendezés változatlanok — csak a mögöttes értékek rendeződtek.',
        href: '/',
      },
    ],
  },
  {
    version: '1.33.1',
    date: '2026-09-04',
    title: 'Rövidebb nyitóoldal',
    summary: 'A záró szakasz lekerült a bemutatkozó oldalról.',
    entries: [
      {
        id: 'v1331-zaro', kind: 'eszkoz', title: 'A záró szakasz törölve',
        body: 'A nyitóoldal végéről lekerült a teljes záró szakasz a benne lévő szöveggel, gombbal és lábnavigációval. A lap a telepítési ajánlóval és a lábléccel zárul. A már nem használt stílusszabályok is eltávolításra kerültek, hogy ne maradjon holt kód a stíluslapban.',
        href: '/',
      },
    ],
  },
  {
    version: '1.33.0',
    date: '2026-09-04',
    title: 'Személyesebb kezdőlap, pontosabb béta szöveg',
    summary: 'Névre szóló köszöntés a szakiránnyal, és kapcsolható tevékenységlista.',
    entries: [
      {
        id: 'v1330-koszontes', kind: 'eszkoz', title: 'Névre szóló köszöntés',
        body: 'A kezdőlap tetején a „Kezdőlap" felirat helyett a köszöntés áll, alatta a profilban megadott szakirány. A szakirány csak akkor jelenik meg, ha meg is van adva — a korábbi helykitöltő „APN" mindenkinél ugyanaz volt, tehát semmit nem mondott.',
        href: '/',
      },
      {
        id: 'v1330-tevekenyseg', kind: 'eszkoz', title: 'Kapcsolható tevékenységlista',
        body: 'A kezdőlapi „Legutóbbi tevékenységek" blokk a Beállítások oldalról ki- és bekapcsolható. Alapból bekapcsolva marad. Aki nem rögzít betegértékeléseket, annak a blokk csak helyet foglal — a kikapcsolás nem töröl semmit, az értékelések a Klinikai esetek alatt továbbra is elérhetők.',
        href: '/cms/beallitasok',
      },
      {
        id: 'v1330-beta', kind: 'eszkoz', title: 'Pontosabb béta szöveg',
        body: 'A tájékoztató már nem csak APN-eket említ, hiszen a tesztelők köre ennél szélesebb. A nyitóoldalon a „csatlakozz a teszteléshez" mostantól kattintható, és a regisztrációhoz vezet. A bejelentkezett felületen a szöveg a visszajelzésre hív, konkrét ígéret nélkül.',
        href: '/',
      },
    ],
  },
  {
    version: '1.32.2',
    date: '2026-09-04',
    title: 'Törlés javítása',
    summary: 'A kezdőlapi törlés hibás oszlopnevet használt.',
    entries: [
      {
        id: 'v1322-torles', kind: 'javitas', title: 'A vizsgálat törlése nem működött',
        body: 'A kezdőlapról indított törlés hibaüzenettel állt le: a művelet rossz oszlopnévvel kereste a tulajdonost. A klinikai esetnél helyes volt, a vizsgálatnál nem — mostantól mindkettő működik.',
        href: '/',
      },
      {
        id: 'v1322-ellenorzes', kind: 'eszkoz', title: 'Oszlopnév-ellenőrzés',
        body: 'Új ellenőrző veti össze a kódban hivatkozott oszlopneveket azzal, amit az adatbázis ténylegesen tartalmaz. Az ilyen hiba máskülönben csak futásidőben derül ki — jellemzően a felhasználónál. A teljes projekt 153 oszlop-hivatkozása 37 táblán most rendben van.',
        href: '/',
      },
    ],
  },
  {
    version: '1.32.1',
    date: '2026-09-04',
    title: 'Egyszerűbb belépés, magyar hibaüzenetek',
    summary: 'A névmező csak regisztrációnál jelenik meg, a hibák pedig magyarul szólnak.',
    entries: [
      {
        id: 'v1321-urlap', kind: 'eszkoz', title: 'Belépés és regisztráció szétválasztva',
        body: 'A belépési képernyőn csak e-mail cím és jelszó kell — a névmező ott fölösleges volt, és azt sugallta, hogy ki kell tölteni. Az „Új fiók" fülre váltva jelenik meg, azzal a megjegyzéssel, hogy a szakterület és a többi adat később, a profilban adható meg.',
        href: '/login',
      },
      {
        id: 'v1321-hibauzenet', kind: 'javitas', title: 'Magyar hibaüzenetek',
        body: 'A hitelesítési hibák angolul jelentek meg — a „User already registered" például pontosan így. Mostantól magyarul szólnak, és azt is megmondják, mit tegyen a felhasználó: a már regisztrált címnél a bejelentkezést vagy a jelszó-visszaállítást ajánlják. Tizenegy gyakori hiba kapott fordítást, az ismeretlenek pedig általános üzenetet — a technikai szöveg a felhasználónak nem segít, és néha többet árul el a rendszerről, mint kellene.',
        href: '/login',
      },
    ],
  },
  {
    version: '1.32.0',
    date: '2026-09-04',
    title: 'Törlés megerősítéssel, béta jelzés',
    summary: 'Egységes megerősítő párbeszéd, kezdőlapi törlés, és nyílt béta tájékoztatás.',
    entries: [
      {
        id: 'v1320-torles', kind: 'funkcio', title: 'Törlés a kezdőlapról',
        body: 'A „Folytasd, ahol abbahagytad" tételei közvetlenül a kezdőlapról eltávolíthatók. A félbehagyott munka gyűlik, és ami már nem kell, azt ne kelljen külön oldalon megkeresni.',
        href: '/',
      },
      {
        id: 'v1320-megerosites', kind: 'eszkoz', title: 'Egységes megerősítő párbeszéd',
        body: 'Minden visszafordíthatatlan művelet ugyanazon a megerősítésen keresztül fut. A párbeszéd konkrétan megnevezi, mi törlődik — nem általánosságban kérdez —, és a Mégsem gombra kerül a fókusz, hogy a véletlen Enter ne hajtsa végre a műveletet. A böngésző beépített kérdése helyett saját párbeszéd, mert az a telepített alkalmazásban idegenül hat.',
        href: '/',
      },
      {
        id: 'v1320-beta', kind: 'eszkoz', title: 'Béta jelzés',
        body: 'A nyitóoldalon és a bejelentkezett felületen is megjelenik, hogy a platform fejlesztés és tesztelés alatt áll, felhívással a hibajelzésre. Aki tudja, hogy bétáról van szó, másképp értékeli a hibát, és szívesebben jelzi. A sáv bezárható, és a döntés a készüléken marad — nem tér vissza minden betöltésnél.',
        href: '/',
      },
      {
        id: 'v1320-ertekeles', kind: 'eszkoz', title: 'Az Új betegértékelés kikapcsolva',
        body: 'A modul a következő fejlesztésig kikapcsolt állapotban van, és a Beállítások oldalról bármikor visszakapcsolható. A már rögzített értékelések nem vesznek el — csak a belépési pontok zárultak be.',
        href: '/cms/beallitasok',
      },
    ],
  },
  {
    version: '1.31.1',
    date: '2026-09-04',
    title: 'Kezdőlap új felhasználóknak',
    summary: 'Aki most regisztrált, azonnal a leggyakoribb modulokat látja a kezdőlapon.',
    entries: [
      {
        id: 'v1311-alapcsempek', kind: 'eszkoz', title: 'Alapértelmezett csempék',
        body: 'Az új felhasználó kezdőlapján nyolc csempe jelenik meg: Labor, Score Hub, Vérgáz, EKG, Betegségtár, Tudástár, Kedvenceim és Kompetenciatérkép. Így nem üres kezdőlappal indul, hanem azzal, amit a napi munkában a leggyakrabban keresnek.',
        href: '/',
      },
      {
        id: 'v1311-testreszabas', kind: 'eszkoz', title: 'A testreszabás változatlan',
        body: 'Az alapkészlet csak kiindulópont: a Hozzáadás gomb és a Testreszabás továbbra is a helyén van, és az első átrendezéstől a saját összeállítás érvényes — a felhasználó által megadott sorrendben. A kompetenciatérkép csempéje csak akkor jelenik meg, ha a modul be van kapcsolva.',
        href: '/testreszabas',
      },
    ],
  },
  {
    version: '1.31.0',
    date: '2026-09-04',
    title: 'EKG-lelet átnézése — béta',
    summary: 'Fotózott EKG strukturált átnézése: megfigyelések és kérdések, nem diagnózis.',
    entries: [
      {
        id: 'v1310-lelet', kind: 'funkcio', title: 'Lelet fotóból',
        body: 'Új, béta funkció az EKG modulban: egy lefotózott lelet átnézése a szokásos elemzési lépések szerint — ritmus, frekvencia, P-hullám, PR-táv, QRS, tengely, ST, T-hullám. A válasz külön szakaszban tér ki arra, mi látszik, mi érdemel figyelmet, milyen irányba vezet, és mi hiányzik a megítéléshez.',
        href: '/klinika/ekg/lelet',
      },
      {
        id: 'v1310-nem-diagnozis', kind: 'szakmai', title: 'Nem diagnózis, és ezt ki is mondja',
        body: 'A funkció megfigyeléseket sorol és kérdéseket vet fel, de nem állít fel kórismét, nem ad terápiás javaslatot, és nem mond ki kizárást. Ez nem óvatoskodás: a fotóból készült átnézés technikailag is korlátozott — az elmosódás, a ferde szög és a hiányzó kalibráció mind torzít —, a klinikai kép pedig teljesen hiányzik belőle. A válasz első szakasza ezért mindig a képminőséget értékeli, és megnevezi, mely megállapítás bizonytalan.',
        href: '/klinika/ekg/lelet',
      },
      {
        id: 'v1310-adatvedelem', kind: 'eszkoz', title: 'Betegadat és tárolás',
        body: 'A feltöltés előtt a felület külön képernyőn kéri a betegazonosító kitakarását — a leleten jellemzően szerepel a név, a születési dátum és az azonosító. A kép nem kerül tárolásra: a feldolgozás után eldobódik. A funkció alapból kikapcsolt, és az intézményi használat rendjét külön kell rögzíteni.',
        href: '/klinika/ekg/lelet',
      },
    ],
  },
  {
    version: '1.30.3',
    date: '2026-09-04',
    title: 'Egységes listastílus',
    summary: 'A checklisták és találati listák ugyanúgy néznek ki, mint a Klinikum menüje.',
    entries: [
      {
        id: 'v1303-lista', kind: 'eszkoz', title: 'Összefüggő lista a különálló kártyák helyett',
        body: 'A vizsgálati checklisták, a betegségtár találatai és a többi hasonló lista korábban különálló, árnyékolt kártyákként jelent meg. Mostantól egy egységbe rendeződnek, közös kerettel és belső elválasztókkal — ahogy a Klinikum menüje. A jelölődoboz azonos méretű keretet kapott, így a sorok bal széle egy vonalban áll.',
        href: '/klinika/vizsgalat',
      },
      {
        id: 'v1303-alahuzas', kind: 'javitas', title: 'Nincs több aláhúzás',
        body: 'A sorok szövege aláhúzva jelent meg, mert hivatkozásként viselkedik. A teljes sor kattintható, és ezt a nyíl meg az egérreakció jelzi — az aláhúzás csak zajt adott hozzá. Helyette a cím színe vált az egér alatt.',
        href: '/klinika/vizsgalat',
      },
    ],
  },
  {
    version: '1.30.2',
    date: '2026-09-04',
    title: 'Kapcsolódó témakörök a lap alján',
    summary: 'A kiegészítő hivatkozások már nem szakítják meg a fő tartalmat.',
    entries: [
      {
        id: 'v1302-sorrend', kind: 'javitas', title: 'A kiegészítő blokk a végére került',
        body: 'A kapcsolódó klinikai témakörök blokkja több helyen a fő tartalom elé került. A betegvizsgálatnál ez volt a legzavaróbb: a rendszer megnyitása után előbb a hivatkozások jöttek, és csak utánuk a vizsgálati checklist — vagyis az, amiért az ember az oldalra lépett. A blokk mostantól mindenhol a tartalom után áll, a betegségtár mindkét nézetében és a vizsgálati munkamenetben is.',
        href: '/klinika/vizsgalat',
      },
    ],
  },
  {
    version: '1.30.1',
    date: '2026-09-04',
    title: 'EKG kiemelés javítása',
    summary: 'A görbén megjelölt elvezetések egyeznek a magyarázat szövegével.',
    entries: [
      {
        id: 'v1301-kiemeles', kind: 'javitas', title: 'A kiemelés és a szöveg eltért',
        body: 'Két gyakorló elemnél a magyarázat más elvezetéseket nevezett meg, mint amiket a görbe kiemelt. Az NSTEMI esetnél a szöveg V2–V5-öt említett, a görbén viszont csak V2–V4 világított; a bal Tawara-szár-blokknál a V3 maradt ki. A tanuló így mást látott, mint amit olvasott — ami pont a felismerés gyakorlását rontja. A kiemelés mindkét helyen a tényleges eltéréshez igazodik.',
        href: '/klinika/ekg',
      },
      {
        id: 'v1301-ellenorzes', kind: 'eszkoz', title: 'Gépi ellenőrzés a jövőre',
        body: 'A görbe-ellenőrző mostantól azt is vizsgálja, hogy a magyarázatban megnevezett elvezetések szerepelnek-e a kiemelésben — a tartományokat is kibontva. Új gyakorló elem felvételekor így azonnal kiderül, ha a kettő elcsúszik.',
        href: '/klinika/ekg',
      },
    ],
  },
  {
    version: '1.30.0',
    date: '2026-09-04',
    title: 'Finomabb visszajelzések',
    summary: 'Látható egérreakció a menükben, és visszafogott mozgás az egész platformon.',
    entries: [
      {
        id: 'v1300-hover', kind: 'eszkoz', title: 'Látható egérreakció',
        body: 'A Klinikum és a Tudástár listáiban alig lehetett látni, melyik soron áll az egér. Mostantól színes sáv jelenik meg a bal szélen, a háttér világosabbra vált, az ikon kiemelkedik, a nyíl pedig elmozdul jobbra. Így ránézésre látszik, mire kattintunk.',
        href: '/klinika',
      },
      {
        id: 'v1300-mozgas', kind: 'eszkoz', title: 'Visszafogott mozgás mindenhol',
        body: 'A kártyák, gombok, lenyitók és táblázatsorok finom átmenetet kaptak, az oldalak tartalma pedig halkan úszik be. Az időtartamok szándékosan rövidek: a cél a visszajelzés, nem a látvány.',
        href: '/',
      },
      {
        id: 'v1300-sebesseg', kind: 'eszkoz', title: 'A sebesség nem sérül',
        body: 'Csak olyan tulajdonságok mozognak, amelyeket a videokártya kezel — elmozdulás, átlátszóság, szín. A méret vagy a magasság animálása minden képkockán újraszámoltatná az elrendezést, ami érezhetően lassítana. A lenyitóknál ezért nem a magasság változik, hanem a tartalom halványul be.',
        href: '/',
      },
      {
        id: 'v1300-csokkentett', kind: 'eszkoz', title: 'Csökkentett mozgás',
        body: 'Aki a rendszerében csökkentett mozgást állít be, annál minden átmenet elmarad — a színes visszajelzés viszont megmarad. Ezt a beállítást jellemzően vesztibuláris panasz, migrén vagy figyelemzavar indokolja.',
        href: '/',
      },
      {
        id: 'v1300-ekg', kind: 'eszkoz', title: 'A mai EKG eset lekerült',
        body: 'Az EKG modulból eltűnt a „Mai EKG eset” kártya. Nem váltakozott naponta, mindig ugyanazt az első esetet nyitotta meg — a gyakorló mód pedig ugyanezt adja, választható esetekkel.',
        href: '/klinika/ekg',
      },
    ],
  },
  {
    version: '1.29.0',
    date: '2026-09-04',
    title: 'Kurzusfájlok és szerkesztés',
    summary: 'Dokumentumok csatolhatók a kurzushoz, és az adatai menet közben is módosíthatók.',
    entries: [
      {
        id: 'v1290-fajlok', kind: 'funkcio', title: 'Fájlok a kurzushoz',
        body: 'Jegyzet, diasor, protokoll vagy bármilyen dokumentum csatolható a kurzushoz: PDF, Word, Excel, PowerPoint, kép, szöveg és CSV, fájlonként legfeljebb 20 MB. Az oktató eldöntheti, mikor teszi közzé — a feltöltött fájl rejtve is maradhat, amíg elkészül vele.',
        href: '/oktatas',
      },
      {
        id: 'v1290-letoltes', kind: 'eszkoz', title: 'Védett letöltés',
        body: 'A fájlok nem nyilvános tárolóba kerülnek, és rövid élettartamú, aláírt hivatkozáson keresztül érhetők el. A cím megosztása így nem ad tartós hozzáférést, és csak a kurzus résztvevői jutnak az anyagokhoz.',
        href: '/oktatas',
      },
      {
        id: 'v1290-szerkesztes', kind: 'funkcio', title: 'Kurzus szerkesztése menet közben',
        body: 'A kurzus címe, leírása, képzési szintje, szakterülete és időpontjai bármikor módosíthatók, futó kurzusnál is. A hallgatók, a feladatok és az eredmények érintetlenek maradnak.',
        href: '/oktatas',
      },
      {
        id: 'v1290-fejlec', kind: 'javitas', title: 'Az oktatói fejléc beragadt',
        body: 'Az oktatói felületről a kezdőlapra lépve az oktatói fejléc és az oldalsáv ottmaradt. Az ok az volt, hogy a keret elrendezése csak egyszer fut le, és nem frissül oldalváltáskor. Az oktatói felület mostantól saját elrendezéssel rendelkezik, ami magától eltűnik a szakaszból kilépve.',
        href: '/oktatas',
      },
    ],
  },
  {
    version: '1.28.0',
    date: '2026-09-03',
    title: 'Váltás az oktatói felületre',
    summary: 'Az oktatók egy koppintással válthatnak a klinikai és az oktatói munkamód között.',
    entries: [
      {
        id: 'v1280-valto', kind: 'funkcio', title: 'Munkamód-váltó a fejlécben',
        body: 'Az oktatói felület eddig csak közvetlen címmel volt elérhető. Mostantól a fejlécben megjelenik egy váltógomb, ami mindig arra a felületre mutat, ahol éppen nem vagy: a klinikai oldalon az oktatóira, az oktatóin vissza a klinikaira. Kis képernyőn csak az ikon látszik, hogy ne szorítsa ki a többi gombot.',
        href: '/oktatas',
      },
      {
        id: 'v1280-kinek', kind: 'eszkoz', title: 'Csak azoknak, akiknek szól',
        body: 'A váltó azoknak jelenik meg, akik ténylegesen oktatnak — oktatói vagy intézményi adminisztrátori tagsággal —, illetve a platform adminisztrátorának. A hallgatóknak és a többi felhasználónak nincs értelme: náluk üres felületre vinne. A hallgatók továbbra is a kezdőlapi „Kurzusaim” kártyán jutnak be, ami viszont oktatóknál már nem jelenik meg, hogy ne legyen két bejárat ugyanoda.',
        href: '/',
      },
    ],
  },
  {
    version: '1.27.1',
    date: '2026-09-03',
    title: 'Fejléc gombjai',
    summary: 'A harang, a profilkép és a kilépés gombja a sötét sávba simul.',
    entries: [
      {
        id: 'v1271-gombok', kind: 'javitas', title: 'Fehér foltok a fejlécben',
        body: 'Az állandó sötét keret bevezetése után az értesítés- és a kilépés gomb világos módban fehér háttérrel maradt, ezért fehér foltként ült a sötét sávon. A gombok mostantól áttetsző háttéret és a sávhoz illő keretet kapnak, a profilkép pedig a világosabb márkaárnyalatot — a mély zöld a sötét sávban beleolvadt volna a háttérbe.',
        href: '/',
      },
    ],
  },
  {
    version: '1.27.0',
    date: '2026-09-03',
    title: 'Akut szédülés',
    summary: 'Új téma az akut állapotok között, a GRACE-3 irányelv alapján.',
    entries: [
      {
        id: 'v1270-szedules', kind: 'betegseg', title: 'Akut szédülés',
        body: 'Az akut állapotok új témával bővültek. A tartalom a GRACE-3 irányelvre épül, amely a Society for Academic Emergency Medicine 2023-as ajánlása a két hétnél rövidebb ideje fennálló akut szédülésre.',
        href: '/betegsegtar/akut/szedules',
      },
      {
        id: 'v1270-besorolas', kind: 'szakmai', title: 'Időbeli lefolyás és kiváltó tényező',
        body: 'A besorolás nem a szédülés minősége szerint történik. A „forgó vagy émelygő?” típusú kérdés megbízhatatlan: ugyanaz a beteg más szóval írja le a panaszát öt perc múlva, és a szóhasználat nem különíti el a veszélyes okot a jóindulatútól. Helyette három kérdés dönt: mióta tart, folyamatos-e, és mi váltja ki.',
        href: '/betegsegtar/akut/szedules',
      },
      {
        id: 'v1270-ct', kind: 'szakmai', title: 'A negatív CT nem zárja ki a stroke-ot',
        body: 'A hátsó scala stroke szédüléssel indulhat, góctünet nélkül. A natív koponya-CT ezt jellemzően nem mutatja, ezért a negatív lelet nem nyugtathat meg. A leírás ezt külön kiemeli, ahogy azt is, hogy a stroke-felismerő skálák elülső keringési eseményre készültek, és a hátsó scala eseményét gyakran nem fogják meg.',
        href: '/betegsegtar/akut/szedules',
      },
      {
        id: 'v1270-kompetencia', kind: 'szakmai', title: 'Kompetenciahatárok',
        body: 'A fejmozgás-vizsgálat, a helyzetváltozási próba és a repozíciós manőver gyakorlatot igényel, és tévesen elvégezve félrevezető. A leírás kimondja, hogy ezek gyakorlott vizsgálót kívánnak és a kompetenciahatárok munkahelyi tisztázását, valamint azt is, mikor nem folytatható a vizsgálat.',
        href: '/betegsegtar/akut/szedules',
      },
    ],
  },
  {
    version: '1.26.3',
    date: '2026-09-03',
    title: 'Állandó sötét keret',
    summary: 'A fejléc és az alsó sáv mindkét témában sötét; a téma a tartalom hátterét váltja.',
    entries: [
      {
        id: 'v1263-keret', kind: 'eszkoz', title: 'A keret nem vált a témával',
        body: 'A fejléc és az alsó navigáció világos módban is sötét marad. Ez a platform állandó kerete: a navigáció mindig ugyanúgy néz ki, a téma pedig a tartalom hátterét szabályozza. A keret saját színkészletet kapott, hogy ne függjön a témaváltástól — a márkanév, a feliratok és az aktív menüpont mindkét módban olvasható marad.',
        href: '/',
      },
      {
        id: 'v1263-oldalsav', kind: 'eszkoz', title: 'Az oktatói oldalsáv is a kerethez tartozik',
        body: 'Az oktatói felület oldalsávja ugyanezt a sötét hátteret kapta: a fejléc alatt folytatódik, egy egységet alkotva vele.',
        href: '/oktatas',
      },
      {
        id: 'v1263-nyitooldal', kind: 'eszkoz', title: 'A nyitóoldal kivétel',
        body: 'A bemutatkozó oldal fejléce világos marad — ott a márka bemutatása a cél, nem a napi munka kerete.',
        href: '/',
      },
    ],
  },
  {
    version: '1.26.2',
    date: '2026-09-03',
    title: 'Témaváltás javítása',
    summary: 'A kézi beállítás most már érvényesül, és a sötét téma világosabb lett.',
    entries: [
      {
        id: 'v1261-valtas', kind: 'javitas', title: 'A kézi beállítás nem érvényesült',
        body: 'A témaválasztás beállította a jelölést, de a React a betöltés után visszaírta az eredetit — így hiába választott valaki sötétet világos rendszeren, nem történt semmi. A keret mostantól tudja, hogy ez az eltérés szándékos, és nem nyúl hozzá.',
        href: '/profil',
      },
      {
        id: 'v1261-globalis', kind: 'javitas', title: 'Sötét szabályok világos módban',
        body: 'A sötét témához tartozó szabályok egy része feltétel nélkül került a stíluslapba, ezért világos módban is hatott. A fejléc és az alsó sáv sötét háttérrel jelent meg fehér felületen, a beviteli mezők és a leletnézet színei sem oda illettek, a kártyák pedig elvesztették az árnyékukat. Mindegyik szabály a helyére került: csak sötét témában érvényesek.',
        href: '/',
      },
      {
        id: 'v1261-vilagosabb', kind: 'eszkoz', title: 'Világosabb sötét téma',
        body: 'A korábbi mély alapszínen a felületek alig különültek el egymástól. Az egész skála egy fokkal világosabb lett — a háttér, a kártyák és a keretek is —, így a rétegek láthatóak, és a szem kevésbé fárad. A szövegszintek ehhez igazodtak, hogy továbbra is olvashatóak maradjanak és elváljanak egymástól.',
        href: '/',
      },
    ],
  },
  {
    version: '1.26.0',
    date: '2026-09-03',
    title: 'Biztonsági javítások',
    summary: 'A szerepkör nem emelhető önhatalmúlag, és az oktató nem adhatja be a saját feladatát.',
    entries: [
      {
        id: 'v1260-szerepkor', kind: 'javitas', title: 'A szerepkör védelme',
        body: 'A felhasználó a saját profilját frissíthette, és a szabály csak azt vizsgálta, a saját sorát írja-e — azt nem, hogy melyik mezőt. Így a böngészőből közvetlenül hívva bárki adminisztrátorrá tehette volna magát. A platform saját kódja sosem írta a szerepkört, de a védelemnek nem a felületen a helye: mostantól adatbázisszintű ellenőrzés akadályozza meg. A névszerkesztés és a többi mező mentése változatlanul működik.',
        href: '/profil',
      },
      {
        id: 'v1260-oktato', kind: 'javitas', title: 'Az oktató nem adhatja be a saját feladatát',
        body: 'A kurzus oktatója beadhatta a saját feladatlapját. Mivel a helyes válaszokat is látja, hibátlan eredményt ért volna el, ami a csoportelemzést torzítja. A beadás mostantól elutasításra kerül.',
        href: '/oktatas',
      },
      {
        id: 'v1260-elemzes', kind: 'javitas', title: 'Csak a hallgatók eredményei számítanak',
        body: 'A csoportelemzés korábban minden beadást figyelembe vett. Mostantól csak a beiratkozott hallgatók eredményei kerülnek bele — ha korábban került be oktatói beadás, az sem torzít többé.',
        href: '/oktatas',
      },
      {
        id: 'v1260-atvizsgalas', kind: 'eszkoz', title: 'Átfogó átvizsgálás',
        body: 'A javítás során átnéztem a teljes projektet: minden tábla jogosultsági szabályait, az adatbázis-függvények ellenőrzéseit és minden adatot író műveletet. A tizenhat írási művelet mindegyikét az adatbázis szabályai védik, tehát a felület megkerülésével sem lehet jogosulatlanul írni.',
        href: '/',
      },
    ],
  },
  {
    version: '1.25.3',
    date: '2026-09-03',
    title: 'Nyitóoldal elrendezés',
    summary: 'Visszatért a kétoszlopos bemutatkozó, jobb oldalon a használati helyzetekkel.',
    entries: [
      {
        id: 'v1253-hero', kind: 'eszkoz', title: 'Kétoszlopos bemutatkozó',
        body: 'A cím és a bevezető visszakerült balra, a jobb oldalt pedig egy blokk tölti ki: mire használják a platformot. Ágy mellett telefonon, vizit előtt, gyakorlásra, oktatóteremben, és ha valaki elakad. Ez konkrétabb, mint a modulok felsorolása — és nem ismétli az alatta lévő szakaszt, ami úgyis a modulokat mutatja be.',
        href: '/',
      },
      {
        id: 'v1253-szoveg', kind: 'eszkoz', title: 'Rövidebb megnevezés',
        body: 'Az oktatási szakasz felcíme „Képzőhelyeknek” lett: a szó magában foglalja az egyetemeket is.',
        href: '/',
      },
    ],
  },
  {
    version: '1.25.2',
    date: '2026-09-03',
    title: 'APN-MED Education megjelenése',
    summary: 'Oktatói jelzés a fejlécben, és bemutatkozó oldal a képzőhelyeknek.',
    entries: [
      {
        id: 'v1250-fejlec', kind: 'eszkoz', title: 'Education jelzés a fejlécben',
        body: 'Az oktatói felületen a márkanév mellett megjelenik az „Education — oktatói felület” jelzés. Nem külön logó: ugyanaz a jelkép és ugyanaz a név, mellette a réteg megnevezése. Az al-márkák elszaporodása gyengítené a fő márkát, és minden új jelkép külön karbantartást igényelne.',
        href: '/oktatas',
      },
      {
        id: 'v1250-gyorsindito', kind: 'eszkoz', title: 'Az oktatás lekerült a gyors indítóból',
        body: 'A gyors indító a napi klinikai munkához használt modulokat sorolja; az oktatói felület külön réteg, nem klinikai eszköz. A kezdőlapi belépő megmarad annak, aki tagja valamelyik képzőhelynek, és a kapcsoló továbbra is szabályozza a modul elérhetőségét.',
        href: '/',
      },
      {
        id: 'v1250-kapcsolat', kind: 'funkcio', title: 'Kapcsolat oldal',
        body: 'Új, bejelentkezés nélkül elérhető kapcsolat oldal négyféle megkereséshez: általános kérdés, hibajelzés, javaslat és képzőhelyi érdeklődés. A téma kiválasztása után csak az ahhoz tartozó mezők jelennek meg — az intézmény nevét például csak a képzőhelyi érdeklődésnél kérjük. A nyitóoldali oktatási szakasz is ide vezet, rögtön a megfelelő témára állítva.',
        href: '/kapcsolat',
      },
      {
        id: 'v1250-kezeles', kind: 'funkcio', title: 'Megkeresések kezelése',
        body: 'A beérkezett érdeklődések a Tartalomkezelésben jelennek meg, az újak elöl. Az e-mail cím és a telefonszám kattintható: a válasz onnan azonnal indítható, nem kell másolgatni. Minden megkereséshez rögzíthető megjegyzés — mikor és hogyan kerestük meg, mi lett a megállapodás —, és jelölhető megkeresettként vagy lezártként.',
        href: '/cms/erdeklodesek',
      },
      {
        id: 'v1250-urlap', kind: 'funkcio', title: 'Érdeklődési űrlap',
        body: 'Egyetlen űrlap fogadja mind a négy megkeresés-típust, így nem kell eldönteni, hova írjunk. Név, e-mail és üzenet kötelező; a többi a témától függ. A megkereséseket csak adminisztrátor látja, mert kapcsolattartói adatokat tartalmaznak.',
        href: '/kapcsolat',
      },
    ],
  },
  {
    version: '1.24.2',
    date: '2026-09-03',
    title: 'Sötét téma finomítása',
    summary: 'Visszafogottabb zöldek, semleges fejléc, és ép nyitóoldal.',
    entries: [
      {
        id: 'v1242-landing', kind: 'javitas', title: 'A nyitóoldal mindig világos',
        body: 'A bemutatkozó oldal sötét témában széttört: saját, világosra tervezett színvilággal dolgozik, ahol a színek egy része változókból, más része rögzített értékekből jön — a kettő keveredett. A nyitóoldal mostantól kimarad a témaváltásból, mert a márka bemutatása világos felületen a leghitelesebb. Belépés után a választott téma érvényesül.',
        href: '/',
      },
      {
        id: 'v1242-zold', kind: 'javitas', title: 'Visszafogottabb zöld',
        body: 'A telített zöld sötét háttéren világított, és mivel a fejlécben meg az alsó sávban végig a szem előtt van, hosszabb használat közben fárasztóvá vált. Az árnyalatok halványabbak és kevésbé telítettek lettek — olvashatóbbak, de nem vonják el a figyelmet a tartalomról.',
        href: '/',
      },
      {
        id: 'v1242-fejlec', kind: 'javitas', title: 'Semleges fejléc és navigáció',
        body: 'A márkanév és az alsó sáv feliratai sötét témában a szokásos szövegszínt kapják; zöld már csak a jelkép és az éppen megnyitott menüpont. A folyamatosan látható elemek így nem versenyeznek a tartalommal.',
        href: '/',
      },
    ],
  },
  {
    version: '1.24.1',
    date: '2026-09-03',
    title: 'Sötét téma',
    summary: 'A platform követi a készülék beállítását — klinikai környezethez szabott sötét felülettel.',
    entries: [
      {
        id: 'v1240-valaszthato', kind: 'funkcio', title: 'Választható megjelenés',
        body: 'A Profil oldalon négy beállítás közül választhatsz: világos, sötét, rendszer szerint, vagy napszak szerint. Az utóbbi este nyolc és reggel hat között vált sötétre — éjszakai műszakban kíméletesebb. A választás a készüléken marad, nem a fiókban: ugyanaz a felhasználó másképp állítja be a telefonján és az osztályos gépen. A beállított téma már az első kirajzoláskor érvényes, tehát nincs világos felvillanás.',
        href: '/profil',
      },
      {
        id: 'v1240-dark', kind: 'funkcio', title: 'Sötét megjelenés',
        body: 'A platform mostantól követi a készülék rendszerbeállítását. Nem egyszerű invertálás: a klinikai környezethez sötét, kékes alapszín illik, nem tiszta fekete, és a felületek egymás fölé rétegződnek — ami közelebb van a felhasználóhoz, világosabb. A márkajelzés és a színvilág karaktere változatlan.',
        href: '/',
      },
      {
        id: 'v1240-gorbek', kind: 'szakmai', title: 'A klinikai görbék világosak maradnak',
        body: 'Az EKG-, a vérgáz- és a leletnézet sötét témában is világos alapon jelenik meg. A klinikai görbét fehér háttéren tanuljuk felismerni, és élesben is így látjuk — a sötét alapon rajzolt EKG idegen lenne, és a felismerés gyakorlását rontaná.',
        href: '/klinika/ekg',
      },
      {
        id: 'v1240-tokenek', kind: 'eszkoz', title: 'Egységes színkezelés',
        body: 'A sötét téma előkészítéseként 158 közvetlen színkód került át változókra. Korábban minden komponens saját árnyalatot használt ugyanarra az állapotra, ami apró eltéréseket okozott, és sötét témában használhatatlan lett volna. Az állapotokhoz mostantól három érték tartozik: szöveg, halvány háttér és keret.',
        href: '/',
      },
      {
        id: 'v1240-nyomtatas', kind: 'eszkoz', title: 'Nyomtatás mindig világos',
        body: 'Nyomtatáskor a felület világos marad, a navigáció és a gombok pedig eltűnnek. A sötét háttér elpazarolná a festéket, és a klinikai dokumentum papíron fehér alapon olvasható.',
        href: '/',
      },
    ],
  },
  {
    version: '1.23.1',
    date: '2026-09-03',
    title: 'Pontbontás a klinikai skáláknál',
    summary: 'Nem csak az összpontszám látszik, hanem az is, melyik tétel mennyit adott.',
    entries: [
      {
        id: 'v1230-gyors', kind: 'eszkoz', title: 'Gyakran használt pontozók',
        body: 'A hat leggyakoribb pontozó — NEWS2, qSOFA, GCS, CURB-65, BISAP, Wells-PE — a Klinikai skálák oldalának tetejére került, a kereső alá. Korábban a Klinikum menüje alatt állt, ahol indokolatlanul lógott. Keresés vagy kategóriaszűrés közben elrejtőzik: olyankor a találatok a fontosak.',
        href: '/klinika/tesztek',
      },
      {
        id: 'v1230-bontas', kind: 'funkcio', title: 'Tételenkénti pontozás',
        body: 'Az eredmény alatt megjelenik a bontás: minden kérdésnél látszik, hány pontot adott hozzá. A pontot adó tételek hangsúlyosabbak, mert azok magyarázzák az eredményt. Alul az összesítés zárja a sort.',
        href: '/klinika/tesztek',
      },
      {
        id: 'v1230-ellenorzes', kind: 'eszkoz', title: 'Ellenőrzési lehetőség',
        body: 'A bontás nem csak tájékoztat: kiderül belőle, ha a rendszer másképp értette a választ, mint ahogy szántuk. Egy elnézett kattintás így a pontszám elfogadása előtt kiderül. A saját képlettel számoló skáláknál — például a testtömegindexnél — nincs értelmezhető tételbontás, ott nem is jelenik meg.',
        href: '/klinika/tesztek',
      },
    ],
  },
  {
    version: '1.22.0',
    date: '2026-09-02',
    title: 'Áttekinthetőbb kezdőlap és klinikai eszközök',
    summary: 'Ami figyelmet igényel, rögtön a lap tetején; a gyakori pontozók egy koppintásra.',
    entries: [
      {
        id: 'v1220-attekintes', kind: 'funkcio', title: 'Ami figyelmet igényel',
        body: 'A kezdőlap tetején megjelenik, mi vár rád: esedékes teendők, lejáró tanúsítványok, felülvizsgálatra váró irányelvek, új értesítések és tartalmak. Csak a nem nulla tételek látszanak — az üres mutatók semmit nem mondanának, csak helyet foglalnának. A sürgősek színnel is elkülönülnek. Az adat ugyanabból a lekérdezésből jön, mint az értesítésszám, tehát nem lassítja az oldalt.',
        href: '/',
      },
      {
        id: 'v1220-eszkozok', kind: 'eszkoz', title: 'Gyakran használt pontozók',
        body: 'A Klinikum oldalán hat pontozó közvetlenül elérhető: NEWS2, qSOFA, GCS, CURB-65, BISAP és Wells-PE. A rövidítés a hangsúlyos elem, mert a napi munkában ezen a néven keresik őket. Nem kell ötvenhét tétel közül kiszűrni a mindennapos hatot.',
        href: '/klinika',
      },
    ],
  },
  {
    version: '1.21.0',
    date: '2026-09-02',
    title: 'Billentyűzet, táblázatok, egységes jelölések',
    summary: 'Látható fókusz, nagyobb érintőfelületek és adattáblák az oktatói nézetben.',
    entries: [
      {
        id: 'v1210-fokusz', kind: 'javitas', title: 'Látható fókusz',
        body: 'Billentyűzettel navigálva eddig alig látszott, hol jár a fókusz. Mostantól minden hivatkozás, gomb és mező jelölést kap — de csak billentyűzetnél, egérkattintásnál nem zavar. Ez nemcsak akadálymentességi kérdés: aki gyorsan dolgozik, gyakran tabulátorral halad.',
        href: '/',
      },
      {
        id: 'v1210-erintes', kind: 'javitas', title: 'Nagyobb érintőfelületek',
        body: 'Érintőképernyőn a gombok, szűrők és listaelemek legalább 44 képpont magasak. A kisebb célpontot mozgás közben vagy kesztyűben nehéz eltalálni.',
        href: '/',
      },
      {
        id: 'v1210-tabla', kind: 'eszkoz', title: 'Adattábla a hallgatói listához',
        body: 'A csoportelemzésben a hallgatók kártyák helyett táblázatban állnak: azonos szélességű oszlopok, jobbra igazított számok, egységes állapotjelölés. A hallgatókat egymáshoz mérve nézzük, és ehhez a kártyás elrendezés alkalmatlan volt.',
        href: '/oktatas',
      },
      {
        id: 'v1210-jelvenyek', kind: 'eszkoz', title: 'Egy jelöléslogika',
        body: 'Három párhuzamos jelvényrendszer élt egymás mellett — a mentorprofil máshogy jelezte a függőben lévőt, mint a feladat vagy a kurzus. Mindegyik ugyanarra a vizuális logikára állt át, a régi osztálynevek megtartásával, hogy a meglévő felületek ne törjenek el.',
        href: '/',
      },
    ],
  },
  {
    version: '1.20.0',
    date: '2026-09-02',
    title: 'Egységes design rendszer — első lépés',
    summary: 'Vonalas ikonok az emoji helyett, egységes térközök és állapotjelölés.',
    entries: [
      {
        id: 'v1200-ikonok', kind: 'eszkoz', title: 'Vonalas ikonok',
        body: 'A Klinikum és a Tudástár menüjében az emojik helyére egységes, vonalas ikonok kerültek: azonos vonalvastagság, azonos rács, kerek végződés. Az emoji minden készüléken máshogy nézett ki, és a vegyes stílus rendetlen összképet adott. Az ikonkészlet húsz új jellel bővült, hogy a többi felület is átállítható legyen.',
        href: '/klinika',
      },
      {
        id: 'v1200-lista', kind: 'eszkoz', title: 'Kevesebb kártya, tisztább szerkezet',
        body: 'A menük hat különálló, árnyékolt kártya helyett egyetlen strukturált listában állnak. Az elemek egy egységet alkotnak, ezért egy keretbe tartoznak — így kevesebb a vizuális zaj, és a szem gyorsabban végigfut rajtuk.',
        href: '/tudastar',
      },
      {
        id: 'v1200-rendszer', kind: 'eszkoz', title: 'Térköz- és állapotrendszer',
        body: 'Egyetlen térközskála lépett a korábbi rendetlenség helyére, ahol szinte minden komponens saját értékeket használt. Emellett egységes állapotjelölés készült hét állapotra — nincs megkezdve, folyamatban, befejezve, teljesítve, lejárt, nem sikerült, zárolva —, hogy ugyanaz az állapot mindenhol ugyanúgy nézzen ki.',
        href: '/',
      },
    ],
  },
  {
    version: '1.19.0',
    date: '2026-09-02',
    title: 'Hallgatói haladás és csoportok',
    summary: 'Valós haladás, teendőlista és csoportkezelés a kurzusokon.',
    entries: [
      {
        id: 'v1190-haladas', kind: 'javitas', title: 'A haladás valós értéket mutat',
        body: 'A kurzuskártyákon minden hallgatónál nulla százalék állt, mert a haladást senki nem számolta ki. Mostantól a beadott és a megnyitott feladatok arányából adódik, a beadott darabszámmal és az átlaggal együtt. Ahol még nincs feladat, ott nem nulla százalék jelenik meg, hanem az, hogy nincs mihez mérni.',
        href: '/oktatas',
      },
      {
        id: 'v1190-teendok', kind: 'funkcio', title: 'Teendőlista a hallgatónak',
        body: 'A hallgatói kezdőlapon megjelenik, mely feladatok vannak hátra, a legközelebbi határidővel elöl. A lejárt és a három napon belül esedékes tételek külön jelölést kapnak. A már beadott feladat akkor sem szerepel itt, ha újra beadható — ez a lista arról szól, mi hiányzik.',
        href: '/oktatas',
      },
      {
        id: 'v1190-csoportok', kind: 'funkcio', title: 'Csoportok kezelése',
        body: 'A kurzuson csoportok hozhatók létre, és a hallgatók besorolhatók. A csoport törlésekor a hallgatók a kurzuson maradnak, csak a besorolás szűnik meg — senki nem eshet ki egy csoport törlése miatt.',
        href: '/oktatas',
      },
      {
        id: 'v1190-szamitas', kind: 'eszkoz', title: 'Számolt, nem tárolt haladás',
        body: 'A haladást szándékosan nem tároljuk. A tárolt érték elavulna, amint az oktató új feladatot nyit meg — akkor minden korábbi százalék érvénytelenné válna, és valakinek frissítenie kellene őket. A számított érték mindig a pillanatnyi állapotot tükrözi.',
        href: '/oktatas',
      },
    ],
  },
  {
    version: '1.18.1',
    date: '2026-09-02',
    title: 'Visszalépés a bejelentkezésről',
    summary: 'A nyitóoldalra vissza lehet jutni a belépési képernyőről is.',
    entries: [
      {
        id: 'v1181-vissza', kind: 'javitas', title: 'Kiút a bejelentkezésből',
        body: 'A nyitóoldalról a belépésre lépve nem volt visszaút. Böngészőben a vissza gomb megoldotta, a telepített alkalmazásban viszont nincs böngészőkeret — ott a képernyő zsákutca volt. Mostantól a bejelentkezés, a jelszó-visszaállítás és a karbantartási képernyő tetején is ott a visszalépés.',
        href: '/login',
      },
    ],
  },
  {
    version: '1.18.0',
    date: '2026-09-02',
    title: 'Tananyagok és klinikai esetek',
    summary: 'Kurzushoz köthető esetek betegadatokkal, kérdéssel és kivetíthető nézettel.',
    entries: [
      {
        id: 'v1180-eset', kind: 'funkcio', title: 'Klinikai eset a kurzushoz',
        body: 'Az oktató klinikai esetet vehet fel: a helyzet leírása, a betegadatok és leletek, majd a csoportnak feltett kérdés. Az eltérő értékek külön jelölhetők, és kivetítve egy pillantással látszik, mi a kóros. A megoldást csak az oktató látja, és ő dönti el, mikor fedi fel.',
        href: '/oktatas',
      },
      {
        id: 'v1180-vetites', kind: 'funkcio', title: 'Kivetíthető eset',
        body: 'Az eset teljes képernyőn megnyitható: a helyzet, a betegadatok nagyobb léptékben, a kérdés kiemelve, és a hozzá tartozó modul egy kattintással elérhető. A megoldás gombnyomásra jelenik meg, így a csoport előbb gondolkodhat rajta.',
        href: '/oktatas',
      },
      {
        id: 'v1180-modul', kind: 'eszkoz', title: 'A platform saját eszközeire mutat',
        body: 'Minden tananyag összeköthető a platform meglévő moduljaival: klinikai skálák, vérgáz, EKG, Labor Kisokos, betegvizsgálat, betegségtár, kompetenciatérkép. Az oktatási tartalom így nem másolja a klinikai eszközöket, hanem rájuk mutat — a hallgató ugyanazt használja, mint a napi munkában.',
        href: '/oktatas',
      },
      {
        id: 'v1180-elokeszites', kind: 'eszkoz', title: 'Előkészítés láthatatlanul',
        body: 'A tananyag alapból nem látszik a hallgatóknak: az oktató nyugodtan előkészítheti, majd egy kattintással teszi közzé. A szerkesztés alatt lévő tételek szaggatott kerettel és jelöléssel különülnek el.',
        href: '/oktatas',
      },
    ],
  },
  {
    version: '1.17.0',
    date: '2026-09-02',
    title: 'Oktatói munkafelület',
    summary: 'Állandó oldalsó navigáció és desktop-orientált elrendezés az intézményi használathoz.',
    entries: [
      {
        id: 'v1170-oldalsav', kind: 'funkcio', title: 'Állandó oldalsó navigáció',
        body: 'Az oktatói felület asztali gépen saját oldalsávot kap: az intézmény neve, a szerepkör, és alatta a kurzusok listája a piszkozatok külön jelölésével. A szerkezet mindig látszik, a munka közben nem kell visszalépkedni. A kurzus megnyitásakor az oldalsávban is látszik, hol vagy.',
        href: '/oktatas',
      },
      {
        id: 'v1170-szerepkor', kind: 'eszkoz', title: 'A szerepkör dönti el az elrendezést',
        body: 'A rendszer korábban az útvonalból következtetett a megjelenítési módra. Mostantól a szerepkört is figyeli: az oldalsávot és a széles munkafelületet csak az oktató és az intézményi adminisztrátor kapja meg. A hallgató ugyanazt a reszponzív felületet látja, mint az egyéni használatnál — a mobil nézet nem a desktop kicsinyítése.',
        href: '/oktatas',
      },
      {
        id: 'v1170-elrendezes', kind: 'eszkoz', title: 'Kihasznált munkafelület',
        body: 'Széles képernyőn a kurzusok két hasábban állnak, a mutatók egy sorban, a tartalom pedig nem szorul a mobilra szabott sávba. Ezer képpont alatt az elrendezés visszavált az egyhasábosra, alsó navigációval.',
        href: '/oktatas',
      },
    ],
  },
  {
    version: '1.16.1',
    date: '2026-09-02',
    title: 'Az oktatói mód elérhetősége',
    summary: 'Megjelenik a kezdőlapon, a gyors elérésben és a Beállítások kapcsolói között.',
    entries: [
      {
        id: 'v1161-nav', kind: 'javitas', title: 'Belépési pontok pótlása',
        body: 'Az oktatói mód csak közvetlen címmel volt elérhető. A kezdőlapon most megjelenik egy belépő azoknak, akik tagjai valamelyik képzőhelynek, és a gyors elérés rácsába is bekerült egy csempe. A belépő megkülönbözteti az oktatót a hallgatótól, és az intézmény nevét is kiírja.',
        href: '/oktatas',
      },
      {
        id: 'v1161-kapcsolo', kind: 'javitas', title: 'A kapcsoló újra látszik',
        body: 'A Beállítások oldal a címke nélküli kapcsolókat elrejti — így tüntettük el korábban a már nem használt EKG-kapcsolót. Ha ugyanez az oktatói módra is lefutott, a kapcsoló eltűnt, pedig a modul azóta elkészült. A címke visszaállt.',
        href: '/cms/beallitasok',
      },
    ],
  },
  {
    version: '1.16.0',
    date: '2026-09-02',
    title: 'Csoportelemzés',
    summary: 'Kompetenciánkénti, kérdésenkénti és hallgatónkénti bontás a kurzus eredményeiről.',
    entries: [
      {
        id: 'v1160-kompetencia', kind: 'funkcio', title: 'Hol áll gyengén a csoport',
        body: 'A kurzus eredményei kompetenciánként bontva, a leggyengébb terület elöl. Minden szám mellett ott van, mennyi válaszból és hány hallgatótól származik — kevés beadásból levont következtetés félrevezető. A kérdésekhez rendelt kompetencia adja a bontást; a besorolatlan kérdésekre a nézet külön figyelmeztet.',
        href: '/oktatas',
      },
      {
        id: 'v1160-kerdesek', kind: 'funkcio', title: 'Hol akadnak el',
        body: 'Kérdésenkénti elemzés, a legtöbb hibát hozó tétel elöl. A nézet kimondja, hogy az alacsony arány kétfélét jelenthet: vagy a téma nem ment át, vagy maga a kérdés félreérthető — ennek elkülönítése oktatói mérlegelés, ezért a rendszer csak a nyers arányt mutatja.',
        href: '/oktatas',
      },
      {
        id: 'v1160-hallgatok', kind: 'funkcio', title: 'Ki maradt le',
        body: 'Hallgatónkénti áttekintés a leggyengébb átlaggal elöl, és külön jelzéssel arról, ki nem adta be az összes feladatot. A hiányzó beadás gyakran fontosabb jelzés, mint a gyenge eredmény.',
        href: '/oktatas',
      },
      {
        id: 'v1160-utolso', kind: 'eszkoz', title: 'A legutolsó beadás számít',
        body: 'Az elemzés hallgatónként és feladatonként a legutolsó beadásból dolgozik. Az ismételt beadás célja a javítás, ezért az utolsó tükrözi a jelenlegi tudást — ha az összes beadást átlagolnánk, a fejlődés elrejtőzne a korai hibák mögött.',
        href: '/oktatas',
      },
    ],
  },
  {
    version: '1.15.0',
    date: '2026-09-02',
    title: 'Oktatói mód — feladatok',
    summary: 'Feladatlapok négyféle kérdéstípussal, automatikus pontozással és eredménykövetéssel.',
    entries: [
      {
        id: 'v1150-feladat', kind: 'funkcio', title: 'Feladatok a kurzusokhoz',
        body: 'Az oktató feladatot hoz létre határidővel, teljesítési küszöbbel és beadásszám-korláttal, majd kérdéseket vesz fel hozzá. A feladat piszkozatként indul, és csak akkor nyitható meg, ha van benne legalább egy kérdés — üres feladatlappal a hallgató nulla pontot kapna.',
        href: '/oktatas',
      },
      {
        id: 'v1150-kerdesek', kind: 'funkcio', title: 'Négy kérdéstípus',
        body: 'Egy helyes válasz, több helyes válasz, igaz-hamis és rövid szöveges. A több helyes válaszú kérdésnél pont csak a pontos halmazért jár: a hiányzó felismerés ugyanúgy hiba, mint a téves jelölés. A rövid válasznál több elfogadható alak is megadható, és a kis- és nagybetű nem számít. Minden kérdés kompetenciához rendelhető.',
        href: '/oktatas',
      },
      {
        id: 'v1150-pontozas', kind: 'eszkoz', title: 'A megoldás nem kerül a böngészőbe',
        body: 'A hallgató a kérdéseket a helyes válasz jelölése és a magyarázat nélkül kapja meg, a pontozás pedig az adatbázisban fut. Enélkül a megoldás a hálózati válaszban látszana — a felületi elrejtés önmagában nem védelem.',
        href: '/oktatas',
      },
      {
        id: 'v1150-eredmenyek', kind: 'funkcio', title: 'Eredmények és visszajelzés',
        body: 'Az oktató látja a beadások számát, az átlagot és azt, hányan teljesítették. Hallgatónként szöveges visszajelzést írhat, amit az érintett a saját beadásánál lát. A hallgató követi a saját beadásait és a legjobb eredményét.',
        href: '/oktatas',
      },
    ],
  },
  {
    version: '1.14.0',
    date: '2026-09-02',
    title: 'Teaching Mode és adaptív elrendezés',
    summary: 'Kivetíthető bemutató mód, és szélesebb munkafelület az adminisztratív oldalakon.',
    entries: [
      {
        id: 'v1140-teaching', kind: 'funkcio', title: 'Teljes képernyős bemutató',
        body: 'Oktatóteremben vagy megbeszélésen a tartalom kivetíthető: nagyobb betű, semmi navigáció, állítható szövegméret. Egyelőre a vérgázelemzésnél és a klinikai skáláknál érhető el, de a megoldás bármely tartalomra ráhúzható, ezért a többi modul is megkaphatja anélkül, hogy külön oktatói változatot kellene írni hozzájuk. Kilépés az Escape billentyűvel.',
        href: '/klinika/vergaz',
      },
      {
        id: 'v1140-layout', kind: 'eszkoz', title: 'Szélesebb munkafelület',
        body: 'Az adminisztratív oldalak — tartalomkezelés, mentorprogram — asztali gépen szélesebb elrendezést kapnak, mert ott táblázatok és listák a jellemzők. A klinikai modulok szándékosan megtartják a keskenyebb olvasási sávot: ott az olvashatóság és az egyetlen dologra összpontosítás a fontosabb. A különbség nem a képernyőméretből, hanem a munka jellegéből adódik.',
        href: '/',
      },
    ],
  },
  {
    version: '1.13.2',
    date: '2026-09-02',
    title: 'BISAP pontozó',
    summary: 'Az akut hasnyálmirigy-gyulladás korai súlyossági rétegzése bekerült a Score Hubba.',
    entries: [
      {
        id: 'v1132-bisap', kind: 'szakmai', title: 'BISAP',
        body: 'Öt tétel, mindegyik egy pont, a felvételtől számított 24 órán belül értékelve: karbamid, tudatállapot-zavar, SIRS, életkor és mellkasi folyadékgyülem. Három kockázati sáv, a hármas pontszámtól jelentősen magasabb halálozási és szervelégtelenségi kockázattal.',
        href: '/klinika/score',
      },
      {
        id: 'v1132-urea', kind: 'szakmai', title: 'A karbamid a hazai leletnek megfelelően',
        body: 'Az eredeti pontozó BUN-t használ mg/dl-ben, a hazai laborok viszont karbamidot adnak meg mmol/l-ben. A két érték nem ugyanaz: a 25 mg/dl BUN kb. 8,9 mmol/l karbamidnak felel meg. A tétel ezért azzal a mértékegységgel szerepel, ahogy a leleten látszik, és a súgó jelzi az átváltást — enélkül a küszöböt nem lehetne megtalálni a magyar leleten.',
        href: '/klinika/score',
      },
      {
        id: 'v1132-korlat', kind: 'eszkoz', title: 'Amit a pontszám nem mond meg',
        body: 'A BISAP fajlagossága magas, az érzékenysége viszont mérsékelt: az alacsony pontszám nem zárja ki a súlyos lefolyást. A leírás ezt kimondja, és arra is figyelmeztet, hogy krónikus veseelégtelenségben a karbamid önmagában is emelkedett lehet.',
        href: '/klinika/score',
      },
    ],
  },
  {
    version: '1.13.1',
    date: '2026-09-02',
    title: 'Mentorprogram',
    summary: 'Mentorjelentkezés, kereshető mentorprofilok és adminisztrátori elbírálás.',
    entries: [
      {
        id: 'v1130-modul', kind: 'funkcio', title: 'Mentorprogram modul',
        body: 'Két belépési pont: „Mentort keresek” és „Mentor leszek”. A jelentkező megadja a szakterületét, tapasztalatát, a vállalt mentorálási témákat és formákat, valamint egy bemutatkozást. A profil adminisztrátori jóváhagyás után jelenik meg a keresésben.',
        href: '/mentor',
      },
      {
        id: 'v1130-kereses', kind: 'funkcio', title: 'Mentorkeresés',
        body: 'Szűrés szakterület, mentorálási téma és tapasztalat szerint, valamint szabad szavas keresés, ami a bemutatkozásra is kiterjed. A szűrők csak azokat az értékeket kínálják, amelyekre ténylegesen van mentor — üres találati listákba így nem lehet belefutni.',
        href: '/mentor/kereses',
      },
      {
        id: 'v1130-admin', kind: 'eszkoz', title: 'Elbírálás és moderálás',
        body: 'Az adminisztrátor a Tartalomkezelésben látja a jelentkezéseket, a függőben lévőket elöl. Jóváhagyhat, elutasíthat indoklással — amit a jelentkező is lát —, vagy inaktiválhat egy profilt. Az inaktiválás elrejti a keresésből, de nem törli.',
        href: '/cms/mentorok',
      },
      {
        id: 'v1130-regi', kind: 'javitas', title: 'A Hamarosan jelzés lekerült',
        body: 'A Fejlődés menüben ottmaradt a mentorprogram korábbi, „Hamarosan” jelzésű kártyája az új mellett. Mivel a modul elkészült, a jelzés lekerült — kikapcsolt állapotban egyszerűen nem jelenik meg semmi.',
        href: '/fejlodes',
      },
      {
        id: 'v1130-kapcsolo', kind: 'eszkoz', title: 'Teljesen kikapcsolható',
        body: 'A modul a Beállítások oldalról ki- és bekapcsolható. Kikapcsolva sehol nem jelenik meg a felhasználóknak, de a profilok megmaradnak, és újbóli bekapcsoláskor azonnal elérhetők. A saját állapotát a felhasználó nem módosíthatja jóváhagyottra: ezt az adatbázis szintjén védjük, és a jóváhagyott profil tartalmi módosítása után automatikusan visszakerül elbírálásra.',
        href: '/cms/beallitasok',
      },
    ],
  },
  {
    version: '1.12.2',
    date: '2026-09-02',
    title: 'Gyorsabb belépés és navigáció',
    summary: 'Folyamatjelző a bejelentkezésnél, és két fölösleges adatbázis-kör megszűnt.',
    entries: [
      {
        id: 'v1122-jelzo', kind: 'funkcio', title: 'Folyamatjelző a belépésnél',
        body: 'A hitelesítés hálózati kérés, ami eltarthat pár másodpercig. Visszajelzés nélkül úgy tűnt, nem történik semmi. Mostantól a megnyomott gomb jelzi, hogy dolgozik, és a küldés alatt a gombok tiltottak — így nem lehet véletlenül kétszer elindítani. Ugyanez érvényes a regisztrációra és a jelszó-visszaállításra is.',
        href: '/login',
      },
      {
        id: 'v1122-admin', kind: 'javitas', title: 'Az adminisztrátori lekérdezés beolvasztva',
        body: 'Az adminisztrátori értesítések bevezetése óta minden oldalbetöltésnél lefutott egy külön lekérdezés — minden felhasználónál, pedig csak adminisztrátornak adott eredményt. Ez a szám mostantól ugyanabban a körben érkezik, mint a többi értesítés.',
        href: '/',
      },
      {
        id: 'v1122-kapcsolok', kind: 'javitas', title: 'A kapcsolók egy körben',
        body: 'A karbantartás állapotát és a funkciókapcsolókat két külön kérdés hozta, pedig ugyanabból a táblából származnak. Most egyszerre töltődnek be. Egy tipikus oldalbetöltés így hat helyett négy adatbázis-körből épül fel.',
        href: '/',
      },
    ],
  },
  {
    version: '1.12.1',
    date: '2026-09-02',
    title: 'Adminisztrátori értesítések',
    summary: 'Az új regisztrációk és a platform eseményei megjelennek az értesítések között.',
    entries: [
      {
        id: 'v1121-admin', kind: 'funkcio', title: 'Mi történt a platformon',
        body: 'Adminisztrátorként az Értesítések oldalon megjelenik, hány új felhasználó regisztrált a legutóbbi megtekintésed óta, és mennyi tartalomváltozás, felhasználó-módosítás és beállításváltozás történt. A számok mellett lenyitható a legutóbb regisztráltak listája és a legutóbbi naplóesemények, onnan pedig egy kattintással elérhető a felhasználókezelés és a teljes napló.',
        href: '/ertesitesek',
      },
      {
        id: 'v1121-harang', kind: 'eszkoz', title: 'A harang is jelez',
        body: 'Az adminisztrátori tételek beleszámítanak a fejlécben látható értesítésszámba, így nem kell külön odanézni. A jogosultságot az adatbázis érvényesíti: aki nem adminisztrátor, annak a lekérdezés üres eredményt ad, tehát a felhasználók száma és a naplóesemények nem szivárognak ki.',
        href: '/ertesitesek',
      },
      {
        id: 'v1121-felcim', kind: 'eszkoz', title: 'Rövidebb nyitóoldali felcím',
        body: 'A nyitóoldalon a felcím „APN-MED – Egészségügyi szakembereknek” lett.',
        href: '/',
      },
    ],
  },
  {
    version: '1.12.0',
    date: '2026-09-02',
    title: 'Olvashatóbb felület',
    summary: 'Erősebb szöveghierarchia és kontraszt — a hosszabb szakaszok nem folynak össze.',
    entries: [
      {
        id: 'v1120-hierarchia', kind: 'javitas', title: 'Szétváló szövegszintek',
        body: 'A fő és a kisegítő szöveg között mindössze 1,7-szeres különbség volt: mindkettő sötét, ezért hosszabb szakaszokban minden egyforma súlyúnak látszott. A kisegítő szín világosabb lett — fehéren továbbra is bőven olvasható —, a fő szövegtől viszont 3,2-szeresen elkülönül, így látszik a rangsor. Bekerült egy harmadik szint is a tisztán kiegészítő adatokra: mértékegység, referenciatartomány, felirat.',
        href: '/',
      },
      {
        id: 'v1120-akcentus', kind: 'javitas', title: 'Olvasható modulszínek',
        body: 'A modulok akcentusszínei szövegként és ikonként olvashatatlanok voltak: a sárga fehéren 1,5-szeres, a zöld 2,3-szeres kontrasztot adott. A színek mostantól a világosságukhoz igazodva sötétednek — a világosabbak többet —, így mindegyik eléri az olvashatósági küszöböt, miközben a felismerhető árnyalatuk megmarad.',
        href: '/',
      },
      {
        id: 'v1120-tagolas', kind: 'eszkoz', title: 'Tagoltabb szerkezet',
        body: 'A szakaszcímek zöld jelölést kaptak a bal oldalukon, a kártyák erősebb árnyékot és valamivel mélyebb hátteret, a címek pedig nagyobb méretugrást a szöveghez képest. Ez tagolja a hosszabb oldalakat anélkül, hogy elválasztó vonalakra lenne szükség.',
        href: '/',
      },
    ],
  },
  {
    version: '1.11.1',
    date: '2026-09-02',
    title: 'Vérgázlelet-nézet',
    summary: 'Az értékek úgy jelennek meg, ahogy a készülék kiadja őket, és az elemzés erre épül.',
    entries: [
      {
        id: 'v1111-lelet', kind: 'funkcio', title: 'Lelet a beviteli mezők helyett',
        body: 'Az értékek mostantól leletként jelennek meg: fejléc a mintatípussal és a belélegzett oxigénaránnyal, majd a szokásos csoportosítás — vérgáz, oximetria, elektrolitok, metabolitok, végül a számított értékek. Minden sornál a mért érték, a nyíljelölés és a referenciatartomány. Élesben is ilyen képet lát az ember, ezért a felismerés így gyakorolható.',
        href: '/klinika/vergaz',
      },
      {
        id: 'v1111-kiemeles', kind: 'eszkoz', title: 'A lépés kiemeli a vonatkozó sorokat',
        body: 'A vezetett elemzés során a lelet végig látható, és az aktuális kérdéshez tartozó sorai világítanak, a többi elhalványul — ugyanaz az elv, mint az EKG-elemzésben a görbe mérőjelei. A pH kérdésnél a pH sor, a kompenzációnál a pCO₂ és a bikarbonát, az anionrésnél a nátrium, a klorid és az albumin.',
        href: '/klinika/vergaz',
      },
      {
        id: 'v1111-esetek', kind: 'eszkoz', title: 'A gyakorló esetek is leletként',
        body: 'A tíz gyakorló eset értékei is leletnézetben jelennek meg, a klinikai helyzet alatt. Így az elemzés ugyanabból a képből indul, amit a valóságban is kézhez kap az ember.',
        href: '/klinika/vergaz',
      },
    ],
  },
  {
    version: '1.11.0',
    date: '2026-09-02',
    title: 'Vérgáz modul — teljes változat',
    summary: 'Elemzés, lépésenkénti gondolkodás, tíz gyakorló eset és fogalomtár.',
    entries: [
      {
        id: 'v1110-elemzes', kind: 'funkcio', title: 'Bővített elemzés',
        body: 'A vérgáz mellett elektrolitok, ionizált kalcium, glükóz, hemoglobin, albumin, életkor és légzésszám is megadható. Az oxigénbeviteli mód kiválasztásával a FiO₂ becslése is egyszerűbb. A mezők élettanilag lehetetlen értékeknél jeleznek, és minden megállapítás mellett ott a számítás, amiből származik.',
        href: '/klinika/vergaz',
      },
      {
        id: 'v1110-gondolkodj', kind: 'funkcio', title: 'Gondolkodj végig mód',
        body: 'A rendszer nem adja meg rögtön a választ: négy-öt kérdésen keresztül végigviszi a klinikai gondolatmenetet — a pH iránya, az elsődleges ok, a kompenzáció, az anionrés és az oxigenizáció. A kérdések ugyanabból a számításból származnak, mint az elemzés, ezért a helyes válasz sosem térhet el attól, amit a modul máshol mond. A végén összesítés a hibák magyarázatával.',
        href: '/klinika/vergaz',
      },
      {
        id: 'v1110-esetek', kind: 'szakmai', title: 'Tíz gyakorló eset',
        body: 'Három nehézségi szinten: a négy alapzavartól a COPD-exacerbáción, ketoacidózison és sepsisen át a kevert zavarokig — köztük egy szalicilát-hatás és egy görcsroham utáni eset. A felhasználó először csak a helyzetet és az értékeket látja, a megoldás külön nyílik. Minden eset betölthető az elemzőbe és végiggondolható a kérdéses módban.',
        href: '/klinika/vergaz',
      },
      {
        id: 'v1110-fogalmak', kind: 'eszkoz', title: 'Fogalomtár és ellenőrzés',
        body: 'Tizenegy fogalom magyarázata: mit mér, miért fontos, és mi állhat az eltérés két iránya mögött. Az elemzés eredményénél is előhívható. A számítási logikát 29 ellenőrzés méri ismert kimenetelű eseteken — köztük mind a tíz gyakorló eset —, hogy a leírt megoldás és a számított eredmény ne térhessen el.',
        href: '/klinika/vergaz',
      },
    ],
  },
  {
    version: '1.10.0',
    date: '2026-09-01',
    title: 'Vérgázelemzés modul',
    summary: 'Sav-bázis elemzés lépésenként: irány, elsődleges ok, kompenzáció, anionrés és oxigenizáció.',
    entries: [
      {
        id: 'v1100-modul', kind: 'funkcio', title: 'Új modul a Klinikumban',
        body: 'Az értékek megadása után a rendszer végigviszi a klasszikus sav-bázis elemzést: megállapítja a zavar irányát, az elsődleges okot, megítéli a kompenzációt, kiszámolja az anionrést és értékeli az oxigenizációt. Minden megállapítás mellett ott a számítás, amiből származik — a cél nem az, hogy a rendszer helyett gondolkodjon, hanem hogy a gondolatmenet követhető legyen.',
        href: '/klinika/vergaz',
      },
      {
        id: 'v1100-szamitas', kind: 'szakmai', title: 'Amit kiszámol',
        body: 'Winter-képlet a metabolikus acidózis várt pCO₂-jéhez, kompenzációs szabályok a légzési zavarokhoz akut és krónikus becsléssel, anionrés albumin-korrekcióval, delta-arány a társuló zavarok felismeréséhez, P/F-hányados és alveolo-arteriális gradiens. Vénás mintánál eltérő referenciatartományok, és jelzés arról, hogy az oxigenizáció úgy nem ítélhető meg.',
        href: '/klinika/vergaz',
      },
      {
        id: 'v1100-korlatok', kind: 'szakmai', title: 'Ahol nem foglal állást',
        body: 'Az alveolo-arteriális gradiens szokásos felső határa csak szobalevegőn érvényes, ezért emelt oxigénadagolás mellett a modul nem minősíti, hanem a P/F-hányadosra irányít. Az akut és krónikus légzési zavar elkülönítésénél jelzi, hogy a vérgáz önmagában nem dönt — az anamnézis és a korábbi leletek szükségesek. Az anionrés határérték körüli sávja külön kategória, mert a küszöb laboronként eltér.',
        href: '/klinika/vergaz',
      },
    ],
  },
  {
    version: '1.9.2',
    date: '2026-09-01',
    title: 'Letisztultabb nyitóoldal',
    summary: 'Egyhasábos bemutatkozó, a részletes számok pedig belépés után látszanak.',
    entries: [
      {
        id: 'v192-hero', kind: 'eszkoz', title: 'Egyhasábos bemutatkozó',
        body: 'A jobb oldali grafika lekerült, a cím és a bevezető középre került, nagyobb betűmérettel. A felszabadult helyet a modulkártyák töltik ki: nagyobb ikonnal és térközzel, de változatlan szöveggel, hogy ne váljon zsúfolttá.',
        href: '/',
      },
      {
        id: 'v192-szamok', kind: 'eszkoz', title: 'A számok belépés után',
        body: 'A Kompetenciatérkép szakaszból lekerültek a pontos tevékenységszámok. A négy szint neve és rövid leírása marad — a részletes adatokat a bejelentkezett felhasználó látja a modulban.',
        href: '/kompetenciaterkep',
      },
    ],
  },
  {
    version: '1.9.1',
    date: '2026-09-01',
    title: 'Kompetenciatérkép a nyitóoldalon',
    summary: 'A négy kompetenciaszint a bemutatkozó grafikán és külön szakaszban is megjelenik.',
    entries: [
      {
        id: 'v191-grafika', kind: 'eszkoz', title: 'Új bemutatkozó grafika',
        body: 'A felületmakett helyére a platform lényegét mutató ábra került: négy koncentrikus gyűrű, középen az APN, kifelé haladva növekvő orvosi együttműködéssel. A gyűrű a platform jelképének eleme, a négy szint pedig a hatályos keretrendszeré — így a kép egyszerre márkahű és tartalmilag pontos. Mellette a szintek neve és a hozzájuk tartozó tevékenységszám.',
        href: '/',
      },
      {
        id: 'v191-szekcio', kind: 'funkcio', title: 'Kompetenciatérkép szakasz',
        body: 'A nyitóoldal új szakaszt kapott „Mérföldkő a szakmában" felvezetéssel. Elmondja, hogy 2025 áprilisában hatályba lépett a szakdolgozói kompetenciák keretrendszere, és először van egységes, jogszabályi válasz arra, mit végezhet az APN önállóan. Mellette a négy szint tevékenységszámmal. A menüben is megjelent a hozzá tartozó pont.',
        href: '/',
      },
    ],
  },
  {
    version: '1.9.0',
    date: '2026-09-01',
    title: 'Hogyan dolgozik az APN?',
    summary: 'A kompetenciaszintek ábrával, példákkal és a leggyakoribb félreértések tisztázásával.',
    entries: [
      {
        id: 'v190-abrak', kind: 'eszkoz', title: 'Az együttműködés képlete ábrán',
        body: 'Mind a négy szint kapott egy egyszerű folyamatábrát: az elsőnél az APN közvetlenül a beteghez, a másodiknál mellette a szupervízió szaggatott, utólagos vonallal, a harmadiknál az orvosi indikáció után önálló végrehajtás, a negyediknél orvos és APN együtt a betegnél. A szintek közötti különbség így egy pillantással érthető.',
        href: '/kompetenciaterkep',
      },
      {
        id: 'v190-peldak', kind: 'szakmai', title: 'Példák és tisztázások',
        body: 'Minden szint kártyáján megjelenik néhány példa — a rendelet tényleges tételeiből, nem kitalált felsorolásból —, valamint a szinthez tartozó leggyakoribb félreértés tisztázása. A második szintnél például kiemelten szerepel, hogy a szupervízió nem jelent folyamatos személyes jelenlétet: az utólagos tájékoztatás is megfelel.',
        href: '/kompetenciaterkep',
      },
      {
        id: 'v190-teruletek', kind: 'eszkoz', title: 'Hol jelenik meg az APN tudása',
        body: 'A nézet elején hét terület: betegvizsgálat, diagnosztika, terápia, szakápolás, betegedukáció, betegút és teammunka. Ez adja a keretet, mielőtt a szintek részletezésébe kezdene az olvasó.',
        href: '/kompetenciaterkep',
      },
    ],
  },
  {
    version: '1.8.9',
    date: '2026-09-01',
    title: 'Pitvari flutter görbéje',
    summary: 'A flutterhullámok folytonosak lettek, és a kamrai ütésekhez igazodnak.',
    entries: [
      {
        id: 'v189-tores', kind: 'javitas', title: 'Megszűnt a töréspont',
        body: 'A pitvari flutter esetnél a fűrészfog lefutó ága a mélypontról hirtelen az alapvonalra ugrott, ami éles, természetellenes törést adott a görbén — leginkább a T-hullám környékén volt zavaró. A hullám mostantól folytonosan tér vissza, ugrás nélkül.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v189-szinkron', kind: 'javitas', title: 'A hullámok az ütésekhez igazodnak',
        body: 'A flutterhullámok és a kamrai komplexusok egymástól függetlenül futottak, ezért a hullámok „vándoroltak" a QRS-hez képest. 2:1 átvezetésnél viszont minden ütésre pontosan két hullám jut, állandó fázisban — most már így is jelenik meg. A fűrészfog az inferior elvezetésekben markánsabb lett, mert az a kórkép ismertetőjegye.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v189-t', kind: 'szakmai', title: 'A T-hullám beleolvad',
        body: 'Flutternél a T-hullám a valóságban nem különíthető el a flutterhullámoktól. Korábban önálló, kiemelkedő hullámként jelent meg, ami ellentmondott a klinikai képnek — most beleolvad, ahogy a leleten is.',
        href: '/klinika/ekg/elemzes',
      },
    ],
  },
  {
    version: '1.8.8',
    date: '2026-09-01',
    title: 'Kérdés minden elemzési lépésnél',
    summary: 'A vezetett elemzés nem mondja ki előre a választ — mindenhol te döntesz először.',
    entries: [
      {
        id: 'v188-kerdesek', kind: 'funkcio', title: 'Kérdés a tengelynél és mindenhol',
        body: 'Több lépésnél — köztük a tengelyállásnál — nem volt kérdés, ezért a rendszer rögtön a referenciaszöveget mutatta, vagyis kimondta a választ, mielőtt gondolkodhattál volna rajta. Mostantól ahol nincs kézzel megírt kérdés, ott a rendszer a görbe paramétereiből állít össze egyet, négy választási lehetőséggel. Az esetenkénti kérdésszám 31-ről 73-ra nőtt.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v188-forras', kind: 'javitas', title: 'A kérdés és a görbe egy forrásból',
        body: 'A generált kérdések helyes válasza ugyanabból az adatból származik, amelyből a görbe rajzolódik. Így nem fordulhat elő, hogy a kép mást mutat, mint amit a rendszer elfogad — ez a hiba korábban több esetnél is előjött.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v188-csalik', kind: 'eszkoz', title: 'Értelmes válaszlehetőségek',
        body: 'A ritmusnál a csalik a helyeshez legközelebb álló ritmusok, nem véletlenszerűek. A frekvenciánál négy tartomány közül kell választani. A QT-nél szélsőséges frekvencia esetén a magyarázat jelzi, hogy a korrekció torzít, és a szomszédos kategória is védhető.',
        href: '/klinika/ekg/elemzes',
      },
    ],
  },
  {
    version: '1.8.7',
    date: '2026-09-01',
    title: 'Magyarázó ábrák az EKG elemzésben',
    summary: 'A tengelyállás és az elvezetés-területek ábrával is megjelennek a segítségben.',
    entries: [
      {
        id: 'v186-tengely', kind: 'eszkoz', title: 'Tengelyállás négy negyedben',
        body: 'A tengelyállás lépésnél a segítség mellett ott az ábra: négy negyed, mindegyikben az I. és az aVF elvezetés előjele és a hozzá tartozó tengelyállás. A „pozitív I. és negatív aVF" mondat így egy pillantással megjegyezhető.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v186-teruletek', kind: 'eszkoz', title: 'Melyik elvezetés melyik falat nézi',
        body: 'Az ST- és T-lépésnél a tizenkét elvezetés a megszokott 3×4 elrendezésben, területek szerint színezve: inferior, anteroseptalis, lateralis. Mindegyikhez tartozik egy rövid magyarázat arról, melyik koszorúér ellátási területéről van szó. Az ábra kimondja azt is, hogy a területi érintettséghez két szomszédos elvezetés együttes eltérése kell.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v186-gorbe', kind: 'eszkoz', title: 'A területek valódi görbén is',
        body: 'A színes beosztás mellé bekerült ugyanez tényleges EKG-képen: a tizenkét elvezetés a megszokott elrendezésben, területek szerint árnyalt háttérrel. Alatta egy második görbe megmutatja, mit jelent, ha egy terület érintett — az inferior három elvezetése együtt emelkedik, miközben az I. és az aVL ellentétes irányba tér el. Ez a kettősség erősíti meg, hogy valódi területi eltérésről van szó, nem mérési hibáról.',
        href: '/klinika/ekg/elemzes',
      },
      {
        id: 'v186-onallo', kind: 'eszkoz', title: 'Az önálló módban is elérhető',
        body: 'Az önálló elemzésben a tengely és az ST mező mellett egy lenyitóval hívhatók elő ugyanezek az ábrák — ott nem automatikusan jelennek meg, mert az segítségnek számítana.',
        href: '/klinika/ekg/elemzes',
      },
    ],
  },
  {
    version: '1.8.5',
    date: '2026-09-01',
    title: 'Új nyitóüzenet',
    summary: 'A nyitóoldal szélesebb szakmai körnek szól, és a kiterjesztett tudást emeli ki.',
    entries: [
      {
        id: 'v184-ki', kind: 'eszkoz', title: 'Ápolók fejlesztik',
        body: 'A bemutatkozó szakasz záró sora „Ápolók fejlesztik, a klinikai gyakorlatból” lett. A korábbi mondat egyszerre állította, ki készíti a platformot és kinek szól — a második már a felcímben szerepel, és a szélesebb megszólítás óta ellent is mondott neki.',
        href: '/',
      },
      {
        id: 'v184-uzenet', kind: 'eszkoz', title: 'Nyitóoldali szöveg',
        body: 'A cím „A kiterjesztett szakmai tudás platformja” lett, a hangsúly a kiterjesztett szón — az utal az APN hatáskörére. A felcím és a bevezető is egészségügyi szakemberekre szól az ápolók helyett, így a platform megszólítása egybeesik a tényleges tartalommal: a klinikai modulok, a kompetenciatérkép és a tudástár szélesebb körnek hasznos.',
        href: '/',
      },
    ],
  },
  {
    version: '1.8.3',
    date: '2026-09-01',
    title: 'Új APN-MED jelkép',
    summary: 'A nyitott gyűrűs logó a fejlécben, a nyitóoldalon és a telepíthető alkalmazásban is.',
    entries: [
      {
        id: 'v183-logo', kind: 'eszkoz', title: 'Egységes jelkép',
        body: 'Az APN-MED jelképe a nyitott gyűrű lett, a fejlécben és a nyitóoldalon a név előtt. Vektoros formában készült, ezért minden méretben éles marad, és a márkaszínt követi — sötét háttéren is használható.',
        href: '/',
      },
      {
        id: 'v183-ikonok', kind: 'eszkoz', title: 'Alkalmazás-ikonok',
        body: 'A telepíthető alkalmazás ikonjai is az új jelképre cserélődtek, a böngészőfül ikonjával együtt. Kis méretben csak a gyűrű látszik — az APN MED felirat ott már olvashatatlan lenne —, nagyobb ikonokon a teljes jelkép. A telefonra kitett alkalmazásnál a régi ikon eltűnéséhez újratelepítés kell.',
        href: '/',
      },
    ],
  },
  {
    version: '1.8.2',
    date: '2026-09-01',
    title: 'Rendezettebb menük',
    summary: 'Az eseteim a Fejlődés menübe került, a Kompetenciatérkép pedig a Tudástárba.',
    entries: [
      {
        id: 'v182-esetek', kind: 'eszkoz', title: 'Eseteim a Fejlődés menüben',
        body: 'Az „Eseteim és előzmények" a Klinikumból a Fejlődés menübe került. A Klinikum az aktuális munkát támogató eszközöket tartalmazza — vizsgálat, értékelés, labor, EKG, skálák —, a saját esetek visszatekintése viszont a szakmai fejlődés része. Az útvonal változatlan, a mentett esetek és a linkek ugyanúgy működnek.',
        href: '/fejlodes',
      },
      {
        id: 'v182-terkep', kind: 'eszkoz', title: 'Kompetenciatérkép a Tudástárban',
        body: 'Az APN Kompetenciatérkép megjelenik a Tudástár menüben, a többi szakmai referencia mellett. Bekapcsolt állapotban látszik; kikapcsolva a Tudástár változatlan marad. A modul minden más funkciója érintetlen.',
        href: '/tudastar',
      },
    ],
  },
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
