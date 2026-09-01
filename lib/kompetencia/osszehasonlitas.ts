/**
 * Ugyanaz a tevékenység, két képzettségi szinten.
 *
 * A 13/2025. (IV. 17.) BM rendelet 2. melléklete egy táblázat: minden sorban egy
 * tevékenység áll, az oszlopokban pedig a különböző képzettségű szakdolgozók
 * szintbesorolása. Az alábbi párok ugyanabból a sorból származnak, tehát valóban
 * összevethetők — nem hasonló, hanem azonos tevékenységről van szó.
 *
 * A két oszlop: Általános ápoló (MKKR 5.) és Kiterjesztett hatáskörű ápoló
 * (MSc, MKKR 7.). Az asszisztensi (MKKR 3.) oszlopot szándékosan nem szerepeltetjük
 * konkrét szintekkel, mert annak hiteles kivonata nem állt rendelkezésre — a
 * keretrendszerben elfoglalt helyét viszont bemutatjuk.
 */

import type { Level } from './data'

export interface Pair {
  /** A tevékenység, ahogy a rendeletben szerepel. */
  text: string
  /** Általános ápoló (MKKR 5.) szintje. */
  nurse: Level
  /** Kiterjesztett hatáskörű ápoló (MKKR 7.) szintje. */
  apn: Level
  /** Miben áll a különbség — egy mondatban. */
  note?: string
  group: string
}

export const PAIRS: Pair[] = [
  {
    group: 'Betegmegfigyelés', text: 'Oxigénszaturációt megfigyeli, méri, ellenőrzi.',
    nurse: 3, apn: 1,
    note: 'Ugyanaz a mérés: az ápolónál orvosi indikációhoz kötött, az APN saját indikáció alapján végzi.',
  },
  {
    group: 'Eszközös betegvizsgálat', text: 'Betegmegfigyelő monitorokat alkalmaz.',
    nurse: 2, apn: 1,
  },
  {
    group: 'Eszközös betegvizsgálat', text: 'Invazív betegmonitorozást végez.',
    nurse: 3, apn: 2,
  },
  {
    group: 'Eszközös betegvizsgálat', text: 'Előkészíti a beteget diagnosztikai eljárásokra vagy terápiás beavatkozásokra.',
    nurse: 3, apn: 1,
  },
  {
    group: 'Eszközös betegvizsgálat', text: 'Érzékszervi vizsgálatokban közreműködik.',
    nurse: 4, apn: 2,
    note: 'Két szint különbség: az ápolónál orvosi jelenlét mellett, az APN-nél szupervízió mellett.',
  },
  {
    group: 'Vizsgálatkérés', text: 'Elvégzi a mintavételt vizsgálatokhoz vagy tenyésztéshez.',
    nurse: 3, apn: 1,
  },
  {
    group: 'Betegút-szervezés', text: 'A beteg osztályos felvételét, elhelyezését elvégzi.',
    nurse: 3, apn: 1,
  },
  {
    group: 'Betegút-szervezés', text: 'A betegelbocsátást megtervezi és megszervezi.',
    nurse: 3, apn: 1,
  },
  {
    group: 'Gyógyszerelés', text: 'Orvosi indikáció alapján gyógyszerelő tevékenységet végez (fájdalomcsillapító, hányáscsillapító, antikoaguláns, diuretikum, kortikoszteroid és további meghatározott készítmények).',
    nurse: 3, apn: 2,
  },
  {
    group: 'Infúziós terápia', text: 'Centrális vénakanülöket használja és gondozza.',
    nurse: 3, apn: 2,
  },
  {
    group: 'Infúziós terápia', text: 'A vénapunkciót elvégzi.',
    nurse: 4, apn: 2,
    note: 'Az ápolónál orvosi irányítás mellett, az APN-nél saját indikációval, szupervízió mellett.',
  },
  {
    group: 'Fájdalomcsillapítás', text: 'Hatékony fájdalomcsillapítást alkalmaz felmérési eredmény alapján.',
    nurse: 3, apn: 1,
  },
  {
    group: 'Légútbiztosítás', text: 'Laringeális maszkot alkalmaz.',
    nurse: 3, apn: 2,
  },
  {
    group: 'Légútbiztosítás', text: 'Laryngo-tracheális tubust alkalmaz.',
    nurse: 4, apn: 2,
  },
  {
    group: 'Légútbiztosítás', text: 'Ballonos lélegeztetést végez.',
    nurse: 3, apn: 2,
  },
  {
    group: 'Sebkezelés', text: 'Fertőzött sebek kezelését végzi.',
    nurse: 3, apn: 2,
  },
  {
    group: 'Nyomási fekély', text: 'Kezeli a III. és IV. stádiumú nyomási fekélyt.',
    nurse: 3, apn: 1,
  },
  {
    group: 'Nyomási fekély', text: 'Elkészíti a sebellátási tervet a III–IV. stádiumú nyomási fekély esetén.',
    nurse: 4, apn: 1,
    note: 'A legnagyobb különbség a listában: orvosi jelenlét mellett végezhető tevékenységből önálló APN-kompetencia lesz.',
  },
  {
    group: 'Vizeletürítés', text: 'Elvégzi a katéterezést, a katéter gondozását, eltávolítását.',
    nurse: 3, apn: 1,
  },
  {
    group: 'Táplálás', text: 'A beteg állapotának megfelelő diétát és táplálási módot alkalmazza.',
    nurse: 3, apn: 1,
  },
  {
    group: 'Ápolás', text: 'Az egyén életkorának és élethelyzetének megfelelően gondozási feladatokat végez.',
    nurse: 3, apn: 1,
  },
  {
    group: 'Ápolás', text: 'Izolált fertőző beteg ápolását, szakápolását elvégzi.',
    nurse: 2, apn: 1,
  },
  {
    group: 'Palliatív ellátás', text: 'Együttműködik a hospice team munkájában.',
    nurse: 3, apn: 2,
  },
]

/**
 * Ahol nem a szint, hanem maga a tevékenység más — ez a lényegi különbség.
 * A rendelet ilyenkor eltérő szöveget ad a két oszlopban.
 */
export interface Divergence {
  topic: string
  nurse: string
  apn: string
}

export const DIVERGENCES: Divergence[] = [
  {
    topic: 'Egyszerű eszközös vizsgálatok (EKG, ABPM, Holter, spirometria)',
    nurse: 'Kivitelezi a vizsgálatot — orvosi indikáció vagy előzetes egyeztetés alapján (III. szint).',
    apn: 'Elrendeli a vizsgálatot, saját indikáció alapján, önállóan (I. szint).',
  },
  {
    topic: 'Szakápolási feladatok',
    nurse: 'Kivitelezi és értékeli (III. szint).',
    apn: 'Elrendeli, kivitelezi és értékeli (I. szint).',
  },
  {
    topic: 'Laboratóriumi vizsgálatok',
    nurse: 'Leveszi a mintát, alkalmazza a gyorsteszteket (III. szint).',
    apn: 'Elrendeli a laboratóriumi vizsgálatokat, az eredményeket értelmezi és értékeli (II. szint).',
  },
  {
    topic: 'Diagnózisalkotás',
    nurse: 'Ápolási diagnózist állít fel az ápolási folyamat részeként (I. szint).',
    apn: 'Iránydiagnózist, csoportdiagnózist állít fel; komplex fizikális betegvizsgálatot végez és értékel (II. szint).',
  },
  {
    topic: 'Gyógyszeres terápia',
    nurse: 'Orvosi indikáció alapján adja be a gyógyszert (III. szint).',
    apn: 'Specializációjának megfelelően elrendeli és kivitelezi a gyógyszeres terápiát; krónikus kórállapotban időkorláton belül módosítja, kiegészíti (II. szint).',
  },
  {
    topic: 'Védőoltás',
    nurse: 'Beadja a védőoltást, elvégzi a beszerzéssel és nyilvántartással kapcsolatos feladatokat (III. szint).',
    apn: 'Elrendeli és felírja a védőoltásokat (II. szint).',
  },
  {
    topic: 'Beutalás és konzílium',
    nurse: 'A rendelet nem sorol fel önálló beutalási tevékenységet ebben az oszlopban.',
    apn: 'Beteget szakambulanciára utal, távkonzultáció során beutalót elrendel és felír (I. szint); megszervezi a szakorvosi konzíliumot és a sürgősségi beutalást (II. szint).',
  },
]

/** A rendelet oszlopai — a keretrendszerben elfoglalt hely. */
export const QUALIFICATIONS = [
  { mkkr: 3, name: 'Általános ápolási és egészségügyi asszisztens' },
  { mkkr: 4, name: 'Alapápolási munkatárs' },
  { mkkr: 5, name: 'Általános ápoló' },
  { mkkr: 6, name: 'Ápoló (BSc)' },
  { mkkr: 7, name: 'Okleveles ápoló / Kiterjesztett hatáskörű ápoló (MSc)' },
]
