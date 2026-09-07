/**
 * Nemzetközi kitekintés — az APN-szerepkör a világban.
 *
 * A tartalom forrása az ICN (International Council of Nurses) szabályozási
 * jelentése, az uniós áttekintő tanulmányok és az egyes országok szakmai
 * szervezeteinek adatai.
 *
 * Két dologra kell figyelni az ilyen összehasonlításnál. Az egyik: a
 * megnevezések nem fedik egymást — ami az egyik országban „nurse
 * practitioner", az a másikban más hatáskörrel jár. A másik: a szabályozás
 * gyorsan változik, ezért az adatok tájékoztató jellegűek, és a pontos
 * hatáskört mindig az adott ország hatályos szabálya adja meg.
 */

export type Erettseg = 'kiforrott' | 'fejlodo' | 'kezdeti'

export const ERETTSEG_LABEL: Record<Erettseg, string> = {
  kiforrott: 'Kiforrott keret',
  fejlodo: 'Épülő keret',
  kezdeti: 'Kezdeti szakasz',
}

export const ERETTSEG_HINT: Record<Erettseg, string> = {
  kiforrott: 'Önálló jogszabályi keret, védett cím, kiépült képzési út.',
  fejlodo: 'Van jogszabályi alap, de a hatáskör vagy a képzés még alakul.',
  kezdeti: 'A szerepkör létezik vagy készül, de a szabályozás hiányos.',
}

export interface Orszag {
  id: string
  nev: string
  zaszlo: string
  /** A szerepkör helyi megnevezése. */
  cim: string
  erettseg: Erettseg
  /** Mióta létezik a mai keret. */
  mikortol: string
  /** Képzési követelmény. */
  kepzes: string
  /** Mekkora önállósággal dolgozik. */
  onallosag: string
  /** Gyógyszerfelírási jog. */
  feliras: string
  /** Mi a jellemző munkaterület. */
  hol: string
  /** Amit érdemes megjegyezni ebből az országból. */
  tanulsag: string
}

export const ORSZAGOK: Orszag[] = [
  {
    id: 'usa',
    nev: 'Egyesült Államok',
    zaszlo: '🇺🇸',
    cim: 'Nurse Practitioner (NP)',
    erettseg: 'kiforrott',
    mikortol: '1965 óta, a mai keret az 1990-es évektől',
    kepzes: 'Mesterfokozat vagy doktori fokozat, országos vizsga, majd állami engedély.',
    onallosag: 'Államonként eltérő. Az államok mintegy felében teljes önállóság: '
      + 'orvosi felügyelet vagy együttműködési szerződés nélkül dolgozhat. A többiben '
      + 'korlátozott vagy felügyelethez kötött.',
    feliras: 'Teljes önállóságú államokban önálló felírás, kábító hatású szerekre is. '
      + 'Máshol együttműködési szerződéshez kötött.',
    hol: 'Alapellátás, sürgősségi, szakrendelés, önálló praxis. Vidéki és ellátatlan '
      + 'térségekben gyakran ő az elsődleges ellátó.',
    tanulsag: 'A hatáskör nem országos, hanem tagállami kérdés — ugyanaz a végzettség '
      + 'két szomszédos államban gyökeresen mást jelent a gyakorlatban.',
  },
  {
    id: 'egyesult-kiralysag',
    nev: 'Egyesült Királyság',
    zaszlo: '🇬🇧',
    cim: 'Advanced Clinical Practitioner / Advanced Nurse Practitioner',
    erettseg: 'fejlodo',
    mikortol: 'Az 1990-es évektől, keretrendszer 2017-től',
    kepzes: 'Mesterfokozat vagy azzal egyenértékű, négy pilléren (klinikum, vezetés, '
      + 'oktatás, kutatás) nyugvó képzés.',
    onallosag: 'A gyakorlatban széles, de a cím nem védett, és nincs külön szakmai '
      + 'nyilvántartás — a hatáskört a munkáltató és a helyi megállapodás határozza meg.',
    feliras: 'Külön képzéssel önálló felíróvá válhat, ami a legtöbb gyógyszerre kiterjed.',
    hol: 'Háziorvosi rendelők, sürgősségi osztályok, közösségi ellátás, mentés.',
    tanulsag: 'Kiterjedt gyakorlat védett cím és önálló nyilvántartás nélkül. Ez rugalmas, '
      + 'de a szerepkör tartalma intézményenként eltér — a szakma maga is szorgalmazza '
      + 'az egységesítést.',
  },
  {
    id: 'hollandia',
    nev: 'Hollandia',
    zaszlo: '🇳🇱',
    cim: 'Verpleegkundig specialist',
    erettseg: 'kiforrott',
    mikortol: '2009-től nevesítve, 2012-től önálló hatáskörrel',
    kepzes: 'Kétéves, duális mesterképzés: egyszerre tanulás és fizetett klinikai munka.',
    onallosag: 'Törvényben nevesített, önálló szerepkör. Meghatározott beavatkozásokat '
      + 'saját jogon végezhet, orvosi utasítás nélkül.',
    feliras: 'Önálló felírási jog a saját szakterületén belül.',
    hol: 'Kórházi szakellátás, alapellátás, mentálhigiéné, idősellátás.',
    tanulsag: 'A duális képzés — tanulás munka mellett, fizetéssel — a bevezetés egyik '
      + 'kulcsa volt: nem kellett kilépni a rendszerből a továbbtanuláshoz.',
  },
  {
    id: 'irorszag',
    nev: 'Írország',
    zaszlo: '🇮🇪',
    cim: 'Registered Advanced Nurse Practitioner (RANP)',
    erettseg: 'kiforrott',
    mikortol: '2001-től, megújított keret 2017-től',
    kepzes: 'Mesterfokozat, meghatározott klinikai gyakorlat, majd nyilvántartásba vétel.',
    onallosag: 'Külön nyilvántartás és védett cím. A hatáskört a szakmai testület '
      + 'határozza meg, nem az egyes munkáltató.',
    feliras: 'Külön képesítéssel önálló felírás és képalkotás rendelése.',
    hol: 'Sürgősségi, krónikus betegellátás, onkológia, gyermekellátás.',
    tanulsag: 'A védett cím és az önálló nyilvántartás következetes szakmai szintet '
      + 'teremt: a betegnek és a munkáltatónak sem kell találgatnia, mit jelent a cím.',
  },
  {
    id: 'ausztralia',
    nev: 'Ausztrália',
    zaszlo: '🇦🇺',
    cim: 'Nurse Practitioner (NP)',
    erettseg: 'kiforrott',
    mikortol: '2000-től',
    kepzes: 'Mesterfokozat, jelentős haladó klinikai gyakorlat, országos nyilvántartás.',
    onallosag: 'Országosan egységes keret, védett cím. Önállóan diagnosztizál, kezel, '
      + 'beutal és rendel vizsgálatot.',
    feliras: 'Önálló felírási jog, az állami gyógyszertámogatási rendszerhez való '
      + 'hozzáféréssel.',
    hol: 'Alapellátás, sürgősségi, távoli és vidéki térségek, ahol orvosi jelenlét ritka.',
    tanulsag: 'Az országos egységesség itt tudatos döntés volt: a szövetségi rendszer '
      + 'ellenére egyetlen nyilvántartás és egyetlen szabályozó testület működik.',
  },
  {
    id: 'kanada',
    nev: 'Kanada',
    zaszlo: '🇨🇦',
    cim: 'Nurse Practitioner (NP) / Infirmière praticienne',
    erettseg: 'kiforrott',
    mikortol: 'Az 1970-es évektől, a mai keret a 2000-es évektől',
    kepzes: 'Mesterfokozat, tartományi vizsga és engedély.',
    onallosag: 'Tartományonként szabályozott, de mindenütt önálló diagnosztizálás és '
      + 'kezelés. Több tartományban önálló praxis is nyitható.',
    feliras: 'Önálló felírási jog, a legtöbb tartományban kábító hatású szerekre is.',
    hol: 'Alapellátás, közösségi ellátás, északi és távoli térségek.',
    tanulsag: 'A tartományi eltérések ellenére a szakmai tartalom hasonló — a képzési '
      + 'követelmény országosan összehangolt.',
  },
  {
    id: 'franciaorszag',
    nev: 'Franciaország',
    zaszlo: '🇫🇷',
    cim: 'Infirmier en pratique avancée (IPA)',
    erettseg: 'fejlodo',
    mikortol: '2018-tól, jogszabályi keretben',
    kepzes: 'Kétéves állami mesterképzés, előzetesen legalább három év ápolói gyakorlat.',
    onallosag: 'Védett cím, de a hatáskör meghatározott szakterületekre és krónikus '
      + 'betegségek követésére korlátozódik, orvosi együttműködés keretében.',
    feliras: 'Korlátozott: meglévő kezelés folytatása és megújítása, meghatározott körben.',
    hol: 'Krónikus betegségek gondozása, onkológia, vesepótló kezelés, mentálhigiéné.',
    tanulsag: 'Példa a fokozatos bevezetésre: szűk, jól körülhatárolt hatáskörrel indult, '
      + 'amit lépésenként bővítenek. A szakmai ellenállás itt is jelentős volt.',
  },
  {
    id: 'finnorszag',
    nev: 'Finnország és Skandinávia',
    zaszlo: '🇫🇮',
    cim: 'Változó: APN, klinikai szakápoló, korlátozott felírási jogú ápoló',
    erettseg: 'fejlodo',
    mikortol: 'A 2010-es évektől',
    kepzes: 'Mesterfokozat, de a képzés tartalma és elnevezése országonként eltér.',
    onallosag: 'A gyakorlatban jelentős, különösen az alapellátásban, de több országban '
      + 'nincs önálló jogszabályi keret vagy védett cím.',
    feliras: 'Finnországban korlátozott felírási jog meghatározott gyógyszerkörre, külön '
      + 'képesítéssel. Máshol eltérő.',
    hol: 'Alapellátás, egészségügyi központok, ahol az ápoló gyakran az első ellátó.',
    tanulsag: 'Erős gyakorlat gyengébb jogi kerettel: a szerepkör működik, de a formális '
      + 'elismerés lemarad mögötte.',
  },
  {
    id: 'magyarorszag',
    nev: 'Magyarország',
    zaszlo: '🇭🇺',
    cim: 'Okleveles ápoló / kiterjesztett hatáskörű ápoló',
    erettseg: 'fejlodo',
    mikortol: 'A képzés 2017-től, a kompetenciák rendeleti szinten 2025-től',
    kepzes: 'Mesterfokozat (MKKR 7. szint), okleveles ápoló szak.',
    onallosag: 'A tevékenységek négy szintre osztva: önálló végzés, szakorvosi '
      + 'szupervízió mellett, orvosi indikáció után, illetve orvosi irányítás mellett.',
    feliras: 'A hatályos szabályozás szerint korlátozott; a gyógyszerrendelés kérdése '
      + 'nyitott.',
    hol: 'Fekvőbeteg-ellátás, sürgősségi, alapellátás, szakrendelés.',
    tanulsag: 'A kompetenciák tételes rendeleti felsorolása egyértelmű kiindulópont — '
      + 'a következő kérdés a gyakorlati bevezetés és a finanszírozási háttér.',
  },
]

/** Amit az összehasonlításból érdemes leszűrni. */
export const MINTAZATOK = [
  {
    cim: 'A megnevezés nem árulja el a hatáskört',
    szoveg: 'Ugyanaz a cím két országban gyökeresen mást jelenthet. A brit és az amerikai '
      + '„nurse practitioner" képzése hasonló, a jogi mozgástere viszont eltérő. '
      + 'Összehasonlításnál a tényleges hatáskört kell nézni, nem az elnevezést.',
  },
  {
    cim: 'A védett cím és a nyilvántartás sokat számít',
    szoveg: 'Ahol a cím védett és külön nyilvántartás létezik — Írország, Ausztrália, '
      + 'Hollandia —, ott a szerepkör tartalma kiszámítható. Ahol nincs, ott intézményenként '
      + 'eltér, ami a betegnek és a munkáltatónak is bizonytalanság.',
  },
  {
    cim: 'A felírási jog külön kérdés',
    szoveg: 'A gyógyszerfelírás nem automatikus következménye a szerepkörnek. Több országban '
      + 'külön képesítés kell hozzá, és a jogosultság terjedelme is eltér: van, ahol csak '
      + 'meglévő kezelés folytatható, van, ahol teljes körű az önálló felírás.',
  },
  {
    cim: 'A bevezetés jellemzően ellenállásba ütközik',
    szoveg: 'A nemzetközi áttekintések következetesen ugyanazt találják: a legerősebb '
      + 'támogatás az ápolói szervezetektől és a kormányzattól jön, a legerősebb ellenállás '
      + 'az orvosi szakmai szervezetektől. Ez nem egy-egy ország sajátossága.',
  },
  {
    cim: 'A fokozatos bevezetés járható út',
    szoveg: 'Franciaország szűk, jól körülhatárolt hatáskörrel indult, és lépésenként bővíti. '
      + 'Ez lassabb, de kiszámíthatóbb, mint a széles jogosultság egyszerre történő megadása.',
  },
  {
    cim: 'Ahol orvosból hiány van, ott gyorsabb a bevezetés',
    szoveg: 'Az önálló hatáskör terjedése összefügg az ellátási hiánnyal: vidéki és távoli '
      + 'térségekben — Ausztrália, Kanada északi része, amerikai vidéki államok — a szerepkör '
      + 'hamarabb és szélesebb jogosultsággal épült ki.',
  },
]

export const FIGYELMEZTETES =
  'Az összehasonlítás tájékoztató jellegű. A szabályozás gyorsan változik, és az adatok '
  + 'országonként eltérő részletességgel érhetők el. A pontos hatáskört mindig az adott '
  + 'ország hatályos szabályozása adja meg.'
