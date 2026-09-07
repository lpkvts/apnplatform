# APN-MED

Klinikai szakmai platform kiterjesztett hatáskörű ápolóknak (APN).

A cél egy összekapcsolt munkakörnyezet, amely a napi klinikai munkát, a szakmai
tájékozódást, a fejlődéskövetést és az oktatást egyetlen felületen támogatja —
ugyanazzal a tartalommal az ágy mellett és a tanteremben.

> **Alapelv:** a platform **nem ad orvosi diagnózist**. Minden funkció
> döntéstámogató, oktatási és dokumentációs célú; a klinikai megítélést nem
> helyettesíti.

**Jelenlegi állapot:** béta. A platform fejlesztés és tesztelés alatt áll.

---

## Tartalom

1. [Áttekintés](#áttekintés)
2. [Modulok](#modulok)
3. [Oktatási réteg](#oktatási-réteg)
4. [Tartalomkezelés](#tartalomkezelés)
5. [Jogosultságok](#jogosultságok)
6. [Kapcsolható modulok](#kapcsolható-modulok)
7. [Szakmai tartalom és források](#szakmai-tartalom-és-források)
8. [Design rendszer](#design-rendszer)
9. [Technológia](#technológia)
10. [Adatmodell és migrációk](#adatmodell-és-migrációk)
11. [Fejlesztés](#fejlesztés)
12. [Ellenőrző szkriptek](#ellenőrző-szkriptek)

---

## Áttekintés

A platform négy fő területre oszlik, ezek az alsó navigációban is megjelennek:

| Terület | Mit tartalmaz |
|---|---|
| **Klinikum** | A napi munkát támogató eszközök: betegvizsgálat, skálák, labor, vérgáz, EKG |
| **Tudástár** | Szakmai tájékozódás: betegségtár, akut állapotok, irányelvek, kompetenciatérkép |
| **Fejlődés** | Egyéni előrehaladás: kompetenciák, továbbképzés, saját esetek, mentorprogram |
| **Education** | Intézményi oktatási réteg — külön munkamód, saját fejlécjelzéssel |

**Számokban:** 79 oldal, 82 komponens, 24 tartalmi modul, 57 adatbázis-migráció.

---

## Modulok

### Klinikum

**Betegvizsgálat** — Strukturált propedeutikai vizsgálat 71 vizsgálati elemmel,
tíz szervrendszerre bontva. Klinikai és oktatási módban is használható; a
munkamenet menthető és folytatható.

**Skálák és score-ok** — 57 klinikai pontozó és rizikóbecslő skála, kategóriák
szerint rendezve. Minden pontozónál látszik a **tételenkénti bontás**: melyik
kérdés mennyit adott az összeghez. Ez egyben ellenőrzés is — kiderül, ha a
rendszer másképp értette a választ. A hat leggyakoribb pontozó a lista tetején
közvetlenül elérhető.

**Labor** — 61 laborparaméter referenciaértékekkel, nemre bontva, kritikus
küszöbökkel és APN-teendőkkel. Mintázatfelismerés: mely értékkombinációk mire
utalnak.

**Vérgáz** — Sav-bázis elemzés lépésenkénti értelmezéssel, leletnézettel és tíz
gyakorló esettel. Tanítási módban kivetíthető.

**EKG** — 30 tételes atlasz, 11 lépésenként vezetett gyakorló eset, vizsgamód.
A görbék paraméterekből generálódnak, nem képek — ezért a kiemelés és a
magyarázat gépileg ellenőrizhető egymáshoz képest.

**EKG-lelet átnézése (béta)** — Fotózott lelet strukturált átnézése hat
szakaszban. Nem ad diagnózist: megfigyeléseket sorol és kérdéseket vet fel. A
kép nem kerül tárolásra, és a feltöltés előtt a felület külön képernyőn kéri a
betegazonosító kitakarását.

### Tudástár

**Betegségtár** — Kórképek strukturált adatlapjai: mikor gondoljunk rá, mit
vizsgáljunk, red flag jelek, APN-fókusz, kezelés, követés, források.

**Akut állapotok** — Hat téma gyors klinikai orientációval: mellkasi fájdalom,
akut dyspnoe, akut hasi fájdalom, eszméletvesztés, láz, szédülés.

**Protokollok és irányelvek** — Hazai és nemzetközi irányelvek összefoglalói,
forrásmegjelöléssel és felülvizsgálati dátummal.

**Kompetenciatérkép** — 274 kompetencia a hatályos szabályozás szerint, négy
végzési szintre bontva.

**APN World** — Az APN-szerepkör kilenc ország gyakorlatában: hatáskör 14
dimenzióban, oktatás, szabályozás, felírási jog. Két–négy ország egymás mellett
összehasonlítható. Adatbázisból működik, adminból bővíthető.

### Fejlődés

Kompetencia-önértékelés, továbbképzési nyilvántartás, saját klinikai esetek
követése, mentorprogram, karrierút.

---

## Oktatási réteg

Az **Education** külön munkamód: saját elrendezéssel, oldalsávval és
fejléc-jelzéssel. Az oktatók a fejlécben lévő váltógombbal lépnek át — ez csak
nekik és a platform adminisztrátorának jelenik meg.

Amit tartalmaz:

- **Kurzusok** célkompetenciákkal, csoportbeosztással, menet közben szerkeszthető
  alapadatokkal
- **Feladatlapok** négyféle kérdéstípussal; a pontozás az adatbázisban fut, a
  helyes válasz sosem kerül a böngészőbe
- **Klinikai esetek és tananyagok**, a platform klinikai moduljaihoz kapcsolva
- **Fájlok**: PDF, Word, Excel, PowerPoint, kép — fájlonként legfeljebb 20 MB,
  nem nyilvános tárolóban, rövid élettartamú aláírt hivatkozással
- **Csoportelemzés** kompetenciánként, kérdésenként és hallgatónként
- **Teaching Mode**: klinikai eset kivetítése teljes képernyőn, nagyobb betűvel

Az oktató nem adhatja be a saját feladatát, és az elemzés csak a beiratkozott
hallgatók eredményeit veszi számba.

---

## Tartalomkezelés

A `/cms` útvonalon, szerkesztői vagy adminisztrátori joggal:

| Menüpont | Mit kezel |
|---|---|
| Irányelvek | Szakmai irányelvek, piszkozat–közzététel állapottal |
| Betegségtár | Kórképek adatlapjai |
| Tartalomfigyelő | Lejáró és felülvizsgálandó tartalmak |
| Forrásáttekintés | A platform teljes evidenciaállománya, modulonként |
| Audit napló | Ki mit módosított |
| Felhasználók | Szerepkörök, jogosultságok |
| Mentorprogram | Mentorprofilok elbírálása |
| Képzőhelyi megkeresések | A kapcsolat oldalról érkező érdeklődések |
| APN World | Országprofilok, források, közzététel |
| Beállítások | Modulkapcsolók, karbantartási mód |

**Forrásáttekintés** — Összegyűjti a platform összes forrását: klinikai
források, irányelvek, betegségtári hivatkozások, akut témák, APN World. A
modulonkénti bontás megmutatja, hol vékony a lefedettség.

---

## Jogosultságok

| Szerepkör | Mit érhet el |
|---|---|
| `user` | A platform klinikai és tudástári tartalma, saját fejlődés |
| `szerkeszto` | Tartalomkezelés, piszkozatok, közzététel |
| `lektor` | Szakmai felülvizsgálat |
| `admin` | Teljes hozzáférés, felhasználókezelés, kapcsolók |

Az oktatási réteg **külön tagsági rendszert** használ: intézményenként
`student`, `instructor` vagy `admin` szerep.

**Adatbázisszintű védelem:** minden tábla soralapú jogosultsági szabályokkal
működik. A szerepkör önhatalmú módosítását adatbázis-trigger akadályozza — a
védelemnek nem a felületen a helye.

---

## Kapcsolható modulok

A Beállítások oldalról ki- és bekapcsolhatók:

`apn_career` · `apn_copilot` · `apn_world` · `changelog_full` · `cpd` ·
`education` · `ekg_exam` · `ekg_lelet` · `ertekeles` · `kompetencia_passport` ·
`kompetenciaterkep` · `legutobbi_tevekenysegek` · `mentorprogram` · `vergaz`

A kikapcsolás nem töröl adatot: csak a belépési pontokat rejti el.

---

## Szakmai tartalom és források

**Forráselvek:**

- Elsődlegesen **hazai szakmai irányelv**; ennek hiányában a legfrissebb
  nemzetközi ajánlás
- **Öt éven belüli** forrás a cél. Az ennél régebbiek külön jelölést kapnak —
  ez nem minősítés: egyes területeken évtizedekig nem születik új ajánlás
- Minden állítás mögött **megnevezett forrás**, ellenőrzési dátummal
- Ahol nincs elegendő megbízható adat, ezt **kimondjuk**, nem pótoljuk
  feltételezéssel

**Forrásblokk minden kórképnél:** a forrás megnyitható, ha van hivatkozás; ha a
platform irányelvtárában is szerepel, oda vezet; és látszik a kora.

A visszavont irányelvek nem törlődnek a nyilvántartásból, hanem jelölést kapnak
arról, mi váltotta fel őket.

---

## Design rendszer

**Tokenek:** hatfokú tipográfia, nyolcfokú térközskála, négy sugár, három
árnyékszint. A stíluslapban a betűméretek és sugarak 80 százaléka tokenből jön.

**Állapotjelölés:** hét állapot, egy vizuális logikával — nincs megkezdve,
folyamatban, befejezve, teljesítve, lejárt, nem sikerült, zárolva.

**Téma:** világos és sötét, négy beállítással (világos, sötét, rendszer szerint,
napszak szerint). A keret — fejléc és alsó sáv — mindkét témában sötét; a téma a
tartalom hátterét váltja. A klinikai görbék (EKG, vérgáz, lelet) sötét témában
is világos alapon jelennek meg, mert így tanuljuk felismerni őket.

**Mozgás:** csak videokártya által kezelt tulajdonságok mozognak — elmozdulás,
átlátszóság, szín. Az időtartamok 120–200 ezredmásodperc. Csökkentett mozgás
beállítása mellett minden átmenet elmarad, a színes visszajelzés megmarad.

**Akadálymentesség:** minden interaktív elem látható fókuszjelölést kap
billentyűzetnél; érintőfelületeken legalább 44 képpont a célpont; a kontrasztok
gépi ellenőrzéssel mérve (38 színpár, mindkét témában).

**Megerősítés:** minden visszafordíthatatlan művelet egységes párbeszéden
keresztül fut, amely konkrétan megnevezi a következményt, és a Mégsem gombra
adja a fókuszt.

---

## Technológia

- **Next.js 15** (App Router), React, TypeScript
- **Supabase** — PostgreSQL, Auth, Storage
- **Vercel** — üzemeltetés
- **PWA** — telepíthető, offline elérhető tartalommal
- **Anthropic API** — APN Copilot és EKG-lelet átnézés (`ANTHROPIC_API_KEY`
  környezeti változó szükséges)

Külső komponenskönyvtár nincs: a felület saját stíluslapra épül.

---

## Adatmodell és migrációk

A migrációk a `supabase/migrations/` könyvtárban, sorszámozva. **Futtatás
sorrendben kötelező** — több migráció épít a korábbiakra.

Néhány visszatérő szabály, amit a korábbi hibák tanítottak:

- Ha egy adatbázis-függvény **visszatérési szerkezete változik**, előbb
  `drop function if exists` kell — a `create or replace` nem elég
- Az oszlopneveket **ellenőrizni kell** a séma alapján, nem emlékezetből; erre
  való a `scripts/oszlop-ellenorzes.mjs`
- A kapcsolókat a `feature_flags` tábla tartja; új modul migrációja vegye fel
  a saját kapcsolóját, alapból kikapcsolva

---

## Fejlesztés

```bash
npm install
npm run dev          # fejlesztői kiszolgáló
npx tsc --noEmit     # típusellenőrzés
npm run build        # éles fordítás
```

**Szerkezeti szabályok:**

- **Típusok és lekérdezések szétválasztva.** Ha egy kliens komponens importál
  valamit, az a fájl nem tartalmazhat szerveroldali kódot. Minden modulban
  `types.ts` a típusoknak és konstansoknak, `data.ts` a lekérdezéseknek.
- **Minden írási művelet előtt jogosultság-ellenőrzés**, és az adatbázis
  szabályai is védjenek — a felület megkerülhető.
- **A gyökér elrendezés csak egyszer fut le.** Ami oldalváltáskor frissülne,
  az kliensoldali komponensbe vagy szegmens-elrendezésbe való.

---

## Ellenőrző szkriptek

```bash
node scripts/kontraszt-ellenorzes.mjs   # 38 színpár, világos és sötét témában
node scripts/oszlop-ellenorzes.mjs      # kód és adatbázis oszlopnevei
node scripts/ekg-ellenorzes.mjs         # görbék és paraméterek egyezése
node scripts/vergaz-teszt.mjs           # vérgáz-számítások
```

Ezek mindegyike valós hibából született. Az oszlopellenőrző például azért, mert
egy rossz oszlopnév csak futásidőben, a felhasználónál derült ki.
