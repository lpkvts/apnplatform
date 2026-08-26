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

export type ChangeKind = 'funkcio' | 'labor' | 'forras' | 'betegseg' | 'szakmai' | 'eszkoz' | 'javitas'

export interface FeatureEntry {
  id: string
  kind: ChangeKind
  title: string
  body?: string
  href?: string
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
        id: 'v14-viewer', kind: 'eszkoz', title: '12 elvezetéses EKG megjelenítő',
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
        body: 'A szepszis és a szeptikus sokk korai felismerése, célzott góckeresés, vörös zászlók, hemokultúra az antibiotikum előtt, differenciáldiagnózis és APN-fókusz. Külön kiemelve, hogy idős, immunszupprimált vagy neutropeniás betegnél a láz hiánya sem zárja ki a súlyos fertőzést.',
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
        body: 'Vörös zászlók, stabilitás-értékelés, célzott anamnézis, EKG- és laborjavaslatok, differenciáldiagnózis (időkritikus, gyakori sebészeti és hasüregen kívüli okok), APN-fókusz és eszkalációs szempontok. Kapcsolódó vizsgálati rendszerek, laborok, EKG-eltérések és score-ok.',
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
        body: 'Kórképek APN-fókuszú adatlapjai: tünettan, differenciáldiagnózis, vörös zászlók, kapcsolódó laborok és score-ok.',
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
        id: 'v1-guideline-search', kind: 'eszkoz', title: 'Összesített irányelv-kereső',
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
export function releasesAfterVersion(seenVersion: string | null): Release[] {
  if (!seenVersion) return []
  return RELEASES.filter((r) => compareVersions(r.version, seenVersion) > 0)
}

/** Minden kiadás bejegyzése lapítva, legfrissebb elöl. */
export function allChanges(): ChangeEntry[] {
  return RELEASES.flatMap((r) => r.entries.map((e) => ({ ...e, date: r.date, version: r.version })))
}

/** A megadott időpont óta kelt bejegyzések, legfrissebb elöl. */
export function changesSince(iso: string | null): ChangeEntry[] {
  if (!iso) return []
  const since = iso.slice(0, 10)
  const today = new Date().toISOString().slice(0, 10)
  // A jövőbeli dátumú bejegyzés kiszűrése: ilyen elvileg nincs, de ha elgépelés
  // folytán mégis bekerül, ne ragadjon be örökre olvasatlanként.
  return allChanges().filter((c) => c.date > since && c.date <= today)
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
