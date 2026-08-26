// EKG-esetek az interaktív elemzéshez.
//
// Minden eset klinikai kontextussal indul, mert az EKG önmagában nem értelmezhető.
// A kérdések a leletre vonatkoznak, nem a diagnózisra — a rendszer egyetlen
// EKG-jel alapján nem állít fel kórismét.
//
// Az `evidence` mező a magyarázat szakmai hátterét adja meg. Új eset felvételekor
// ide ellenőrzött forrás kerüljön; kitalált hivatkozás nem megengedett.

import type { EcgCase } from './analysis'

export const EKG_CASES: EcgCase[] = [
  /* ══════════════════ 1. Inferior STEMI ══════════════════ */
  {
    id: 'inferior-stemi',
    title: 'Hirtelen mellkasi fájdalom, verejtékezés',
    age: 62, sex: 'férfi',
    vignette:
      '62 éves férfi. Két órája tartó, nyomó jellegű mellkasi fájdalom, amely az állkapocs felé sugárzik. ' +
      'Verejtékezik, sápadt. Vérnyomás 105/65 Hgmm, pulzus 52/perc. Dohányzik, kezelt magas vérnyomása van.',
    difficulty: 'haladó',
    tags: ['stemi', 'ischaemia', 'brady', 'sinus'],
    params: {
      rate: 52, rhythm: 'sinus', p: 'normal', prMs: 180, qrsMs: 90, axis: 'normal', qtMs: 400,
      st: { II: 3.5, III: 4.5, aVF: 3.8, I: -1.2, aVL: -2.0, V2: -1.0 },
      t: { II: 'peaked', III: 'peaked', aVF: 'peaked', aVL: 'inverted' },
      noise: 0.3,
    },
    questions: {
      frekvencia: [{
        id: 'q-freq', prompt: 'Mekkora a kamrai frekvencia?',
        options: [
          { id: 'a', label: '40–50/perc' }, { id: 'b', label: 'Kb. 50–60/perc' },
          { id: 'c', label: '70–80/perc' }, { id: 'd', label: '100/perc felett' },
        ],
        correct: ['b'],
        explain: 'Az R–R távolság kb. 6 nagy kocka, tehát 300/6 ≈ 50/perc. Ez sinus bradycardia, amely inferior infarktusban gyakori a vagális túlsúly és a sinuscsomó vérellátásának érintettsége miatt.',
        highlight: 'rr',
      }],
      ritmus: [{
        id: 'q-rhythm', prompt: 'Milyen a kamrai ritmus?',
        options: [
          { id: 'a', label: 'Szabályos' }, { id: 'b', label: 'Szabálytalan' }, { id: 'c', label: 'Nem ítélhető meg' },
        ],
        correct: ['a'],
        explain: 'Az egymást követő R–R távolságok azonosak, tehát a kamrai ritmus szabályos.',
        highlight: 'rr',
      }],
      p: [{
        id: 'q-p', prompt: 'Minden QRS-komplexust megelőz P-hullám?',
        options: [
          { id: 'a', label: 'Igen, állandó kapcsolattal' }, { id: 'b', label: 'Nem, hiányzik a P-hullám' },
          { id: 'c', label: 'Változó a kapcsolat' },
        ],
        correct: ['a'],
        explain: 'Minden QRS előtt azonos alakú P-hullám látható, állandó távolsággal — az ingerület a sinuscsomóból indul.',
        highlight: 'p',
      }],
      qrs: [{
        id: 'q-qrs', prompt: 'Milyen széles a QRS-komplexus?',
        options: [
          { id: 'a', label: 'Keskeny, 120 ms alatt' }, { id: 'b', label: 'Széles, 120 ms felett' },
          { id: 'c', label: 'Elvezetésenként változó' },
        ],
        correct: ['a'],
        explain: 'A QRS kb. 90 ms, tehát keskeny. Az ingerület a normál vezetőrendszeren halad, nincs szárblokk vagy kamrai eredet.',
        highlight: 'qrs',
      }],
      st: [
        {
          id: 'q-st1', prompt: 'Látsz-e ST-elevációt, és ha igen, mely elvezetésekben?',
          options: [
            { id: 'a', label: 'Nincs ST-eleváció' },
            { id: 'b', label: 'II, III, aVF' },
            { id: 'c', label: 'V1–V4' },
            { id: 'd', label: 'I, aVL, V5–V6' },
          ],
          correct: ['b'],
          explain: 'A II, III és aVF elvezetésben egyértelmű ST-eleváció látható. Ez a hármas az inferior falat képezi le.',
          highlight: 'st',
        },
        {
          id: 'q-st2', prompt: 'Van-e reciprok ST-depresszió?',
          options: [
            { id: 'a', label: 'Nincs' }, { id: 'b', label: 'Igen, I és aVL elvezetésben' },
            { id: 'c', label: 'Igen, V5–V6 elvezetésben' },
          ],
          correct: ['b'],
          explain: 'Az I és aVL elvezetésben ST-depresszió látható. A reciprok eltérés erősíti az ST-eleváció valódiságát, és segít elkülöníteni a nem ischaemiás okoktól.',
          highlight: 'st',
        },
      ],
      t: [{
        id: 'q-t', prompt: 'Milyenek a T-hullámok az inferior elvezetésekben?',
        options: [
          { id: 'a', label: 'Élettani alakúak' }, { id: 'b', label: 'Magasak, csúcsosak' },
          { id: 'c', label: 'Mélyen inverzek' }, { id: 'd', label: 'Laposak' },
        ],
        correct: ['b'],
        explain: 'Az inferior elvezetésekben magas, csúcsos T-hullámok láthatók az emelt ST-szakasz felett. Az akut ischaemia korai szakaszában ez jellemző.',
        highlight: 't',
      }],
    },
    reference: {
      kalibracio: 'Szabványos beállítás: 25 mm/s, 10 mm/mV. A felvétel értékelhető, enyhe alapvonal-ingadozással.',
      frekvencia: 'Kb. 52/perc — sinus bradycardia.',
      ritmus: 'Szabályos kamrai ritmus, sinus eredettel.',
      p: 'Minden QRS-t azonos alakú P-hullám előz meg, állandó PR-távolsággal.',
      pr: 'PR kb. 180 ms — élettani tartomány.',
      qrs: 'QRS kb. 90 ms, keskeny. Kóros Q-hullám még nem alakult ki.',
      tengely: 'Normál frontális tengely.',
      qt: 'QT kb. 400 ms, QTc kb. 372 ms — élettani.',
      st: 'ST-eleváció a II, III és aVF elvezetésben, a III-ban kifejezettebb, mint a II-ben. Reciprok ST-depresszió az I és aVL elvezetésben.',
      t: 'Magas, csúcsos T-hullámok inferiorban; aVL-ben T-inverzió.',
      osszegzes:
        'Sinus bradycardia kb. 52/perc, normál tengely, keskeny QRS, élettani PR és QTc. ' +
        'ST-eleváció a II, III, aVF elvezetésben reciprok ST-depresszióval az I és aVL elvezetésben — ' +
        'az inferior fal akut ischaemiájával összeegyeztethető kép. A klinikai kontextus (mellkasi fájdalom, ' +
        'verejtékezés) alapján időkritikus helyzet, azonnali orvosi értékelés szükséges.',
    },
    findings: [
      {
        title: 'ST-eleváció az inferior elvezetésekben',
        what: 'Az izoelektromos vonal fölé emelkedő ST-szakasz, amely a J-ponttól indul és a T-hullámba olvad.',
        where: 'II, III és aVF elvezetés — a III-ban kifejezettebb, mint a II-ben.',
        meaning: 'Az inferior fal akut, teljes falvastagságot érintő ischaemiájával összeegyeztethető. Ha a III-ban nagyobb az eleváció, mint a II-ben, az a jobb koszorúér érintettsége mellett szól.',
        ddx: ['Akut inferior szívinfarktus', 'Pericarditis (jellemzően diffúz, konkáv eleváció, reciprok eltérés nélkül)', 'Korai repolarizáció', 'Hyperkalaemia'],
        why: 'Az ST-elevációval járó infarktus időkritikus: a reperfúzióig eltelt idő közvetlenül befolyásolja a kimenetelt.',
        leads: ['II', 'III', 'aVF'],
      },
      {
        title: 'Reciprok ST-depresszió',
        what: 'Az ST-szakasz az izoelektromos vonal alá süllyed az elevációval ellentétes elvezetésekben.',
        where: 'I és aVL elvezetés.',
        meaning: 'A reciprok eltérés az ST-eleváció ischaemiás eredetét támogatja, és elkülöníti a diffúz, nem ischaemiás elváltozásoktól.',
        ddx: ['Akut ischaemia reciprok jele', 'Egyidejű más falat érintő ischaemia'],
        why: 'Jelenléte növeli az infarktus valószínűségét, és segít a bizonytalan eleváció megítélésében.',
        leads: ['I', 'aVL'],
      },
      {
        title: 'Sinus bradycardia',
        what: 'Sinus eredetű ritmus 60/perc alatti frekvenciával.',
        where: 'A teljes felvételen, legjobban a ritmuscsíkon értékelhető.',
        meaning: 'Inferior ischaemiában gyakori: a vagális túlsúly és a sinuscsomó vérellátásának érintettsége egyaránt szerepet játszhat.',
        ddx: ['Vagális reakció', 'Sinuscsomó ischaemia', 'Gyógyszerhatás (béta-blokkoló)', 'AV-blokk kialakulásának előjele'],
        why: 'Inferior infarktusban a vezetési zavar kialakulásának kockázata fokozott, ezért a ritmus szoros követése indokolt.',
      },
    ],
    evidence: [
      {
        name: 'Egészségügyi szakmai irányelv az akut koronária szindrómáról',
        org: 'Belügyminisztérium', year: '2025', identifier: '002272-2025',
        lastChecked: '2026-08-26',
        note: 'Hazai elsődleges forrás az akut koronária szindróma ellátásához.',
      },
      {
        name: '2023 ESC Guidelines for the management of acute coronary syndromes',
        org: 'European Society of Cardiology', year: '2023', lastChecked: '2026-08-26',
        note: 'Az ST-eleváció elvezetés-specifikus küszöbértékeit és a reperfúziós időablakot tárgyalja.',
      },
    ],
  },

  /* ══════════════════ 2. Pitvarfibrilláció ══════════════════ */
  {
    id: 'afib-rvr',
    title: 'Szívdobogásérzés, szédülés',
    age: 74, sex: 'nő',
    vignette:
      '74 éves nő. Tegnap este óta tartó szívdobogásérzés, enyhe szédülés, terhelésre jelentkező nehézlégzés. ' +
      'Vérnyomás 128/74 Hgmm. Korábban magas vérnyomás miatt kezelték; ritmuszavarról nem tud.',
    difficulty: 'kezdő',
    tags: ['afib', 'tachy'],
    params: {
      rate: 128, rhythm: 'afib', p: 'fibrillatory', prMs: 0, qrsMs: 88, axis: 'normal', qtMs: 320,
      st: { V4: -0.8, V5: -0.9, V6: -0.7 },
      t: { V5: 'flat', V6: 'flat' },
      noise: 0.4,
    },
    questions: {
      ritmus: [{
        id: 'q-rhythm', prompt: 'Milyen a kamrai ritmus?',
        options: [
          { id: 'a', label: 'Szabályos' }, { id: 'b', label: 'Szabálytalan' }, { id: 'c', label: 'Nem ítélhető meg' },
        ],
        correct: ['b'],
        explain: 'Az R–R távolságok egyenetlenek, ismétlődő minta nélkül. Ez a „szabálytalanul szabálytalan” ritmus a pitvarfibrilláció jellegzetessége.',
        highlight: 'rr',
      }],
      p: [{
        id: 'q-p', prompt: 'Milyen a pitvari aktivitás?',
        options: [
          { id: 'a', label: 'Minden QRS előtt élettani P-hullám' },
          { id: 'b', label: 'Nincs egységes P-hullám, hullámzó alapvonal' },
          { id: 'c', label: 'Fűrészfog-mintázat' },
          { id: 'd', label: 'Változó alakú P-hullámok' },
        ],
        correct: ['b'],
        explain: 'Egységes P-hullám nem azonosítható; helyette finoman hullámzó alapvonal látható, legjobban a V1 és a II elvezetésben. A fűrészfog-mintázat pitvari flutterre lenne jellemző.',
        highlight: 'p',
      }],
      frekvencia: [{
        id: 'q-freq', prompt: 'Hogyan határozod meg a frekvenciát ennél a ritmusnál?',
        options: [
          { id: 'a', label: '300 osztva a nagy kockák számával' },
          { id: 'b', label: 'A 10 másodperces csíkon megszámolt QRS-ek száma szorozva hattal' },
          { id: 'c', label: 'A P-hullámok számából' },
        ],
        correct: ['b'],
        explain: 'Szabálytalan ritmusnál a 300-as szabály félrevezet, mert az R–R távolság ütésről ütésre változik. A hosszabb csíkon számolt átlag megbízhatóbb: itt kb. 128/perc.',
        highlight: 'rr',
      }],
      st: [{
        id: 'q-st', prompt: 'Mit látsz az ST-szakaszon a lateralis mellkasi elvezetésekben?',
        options: [
          { id: 'a', label: 'Élettani ST-szakasz' }, { id: 'b', label: 'Enyhe ST-depresszió' },
          { id: 'c', label: 'Jelentős ST-eleváció' },
        ],
        correct: ['b'],
        explain: 'A V4–V6 elvezetésben enyhe ST-depresszió látható. Gyors kamrai frekvencia mellett ez gyakran frekvenciafüggő, de ischaemiás eredetet sem lehet kizárni — a frekvencia rendezése után ismételt EKG indokolt.',
        highlight: 'st',
      }],
    },
    reference: {
      kalibracio: 'Szabványos beállítás, értékelhető felvétel, mérsékelt alapvonal-ingadozással.',
      frekvencia: 'Kb. 128/perc átlagos kamrai frekvencia — gyors kamrai válasz.',
      ritmus: 'Szabálytalanul szabálytalan kamrai ritmus.',
      p: 'Egységes P-hullám nem azonosítható, hullámzó alapvonal — pitvarfibrillációval összeegyeztethető.',
      pr: 'PR-intervallum nem mérhető, mivel nincs azonosítható P-hullám.',
      qrs: 'QRS kb. 88 ms, keskeny — supraventricularis eredet.',
      tengely: 'Normál frontális tengely.',
      qt: 'QT kb. 320 ms; a QTc gyors frekvencia mellett óvatosan értékelendő.',
      st: 'Enyhe ST-depresszió a V4–V6 elvezetésben.',
      t: 'Lapos T-hullámok a lateralis elvezetésekben.',
      osszegzes:
        'Pitvarfibrilláció gyors kamrai válasszal, kb. 128/perc. Keskeny QRS, normál tengely. ' +
        'Enyhe lateralis ST-depresszió és lapos T-hullámok, amelyek frekvenciafüggők lehetnek. ' +
        'A frekvencia rendezése után ismételt EKG javasolt; a thromboemboliás kockázat felmérése ' +
        'és a klinikai állapot értékelése orvosi feladat.',
    },
    findings: [
      {
        title: 'Szabálytalanul szabálytalan ritmus',
        what: 'Az R–R távolságok ütésről ütésre változnak, ismétlődő minta nélkül.',
        where: 'A teljes felvételen; legjobban a hosszú ritmuscsíkon értékelhető.',
        meaning: 'A pitvarok rendezetlen elektromos aktivitása mellett az AV-csomó szabálytalanul vezet át.',
        ddx: ['Pitvarfibrilláció', 'Változó blokkú pitvari flutter', 'Multifokális pitvari tachycardia', 'Gyakori extrasystolék'],
        why: 'A ritmus felismerése meghatározza a további teendőket, köztük a thromboemboliás kockázat felmérését.',
      },
      {
        title: 'Hiányzó P-hullám, hullámzó alapvonal',
        what: 'Egységes P-hullám helyett finom, szabálytalan hullámzás az alapvonalon.',
        where: 'Legjobban a V1 és a II elvezetésben látható.',
        meaning: 'A pitvarok szervezett összehúzódása hiányzik.',
        ddx: ['Pitvarfibrilláció', 'Artefaktum (izomremegés)', 'Alacsony amplitúdójú P-hullám'],
        why: 'A P-hullám hiánya és a szabálytalan ritmus együtt teszi valószínűvé a pitvarfibrillációt; önmagában egyik sem elegendő.',
        leads: ['V1', 'II'],
      },
    ],
    evidence: [
      {
        name: '2024 ESC Guidelines for the management of atrial fibrillation',
        org: 'European Society of Cardiology', year: '2024', lastChecked: '2026-08-26',
        note: 'A pitvarfibrilláció diagnosztikájának és ellátásának európai ajánlása. A hazai forrásjegyzék bővítendő, ha megjelenik erre vonatkozó magyar irányelv.',
      },
    ],
  },

  /* ══════════════════ 3. Hyperkalaemia ══════════════════ */
  {
    id: 'hyperkalaemia',
    title: 'Gyengeség dialízis-kihagyás után',
    age: 58, sex: 'férfi',
    vignette:
      '58 éves férfi, krónikus vesebetegség miatt rendszeres művesekezelésben részesül. Két kezelést kihagyott. ' +
      'Általános gyengeség, izomgyengeség, enyhe zavartság. Vérnyomás 142/88 Hgmm, pulzus 46/perc.',
    difficulty: 'gyakorlott',
    tags: ['hyperk', 'brady'],
    params: {
      rate: 46, rhythm: 'sinus', p: 'varying', prMs: 230, qrsMs: 145, axis: 'normal', qtMs: 380,
      t: { I: 'peaked', II: 'peaked', III: 'peaked', aVF: 'peaked', V2: 'peaked', V3: 'peaked', V4: 'peaked', V5: 'peaked' },
      noise: 0.2,
    },
    questions: {
      t: [{
        id: 'q-t', prompt: 'Mi jellemzi a T-hullámokat?',
        options: [
          { id: 'a', label: 'Élettani alak' }, { id: 'b', label: 'Magas, keskeny alapú, csúcsos' },
          { id: 'c', label: 'Mély inverzió' }, { id: 'd', label: 'Kétfázisú' },
        ],
        correct: ['b'],
        explain: 'A T-hullámok magasak, keskeny alapúak és hegyes csúcsúak — a leírás szerint „sátorszerűek”. Ez a hyperkalaemia legkorábbi és legjellemzőbb EKG-jele.',
        highlight: 't',
      }],
      qrs: [{
        id: 'q-qrs', prompt: 'Milyen széles a QRS-komplexus?',
        options: [
          { id: 'a', label: 'Keskeny, 120 ms alatt' }, { id: 'b', label: 'Széles, kb. 145 ms' },
          { id: 'c', label: 'Nem mérhető' },
        ],
        correct: ['b'],
        explain: 'A QRS kiszélesedett. Hyperkalaemiában ez a csúcsos T után következő lépcső, és súlyosabb állapotot jelez — a QRS további szélesedése sinushullám-mintázatba mehet át.',
        highlight: 'qrs',
      }],
      p: [{
        id: 'q-p', prompt: 'Mit látsz a P-hullámokon?',
        options: [
          { id: 'a', label: 'Élettani, egységes P-hullámok' },
          { id: 'b', label: 'Ellaposodott, változó amplitúdójú P-hullámok' },
          { id: 'c', label: 'Teljesen hiányzó P-hullám' },
        ],
        correct: ['b'],
        explain: 'A P-hullámok ellaposodnak és amplitúdójuk csökken. Előrehaladott hyperkalaemiában teljesen eltűnhetnek.',
        highlight: 'p',
      }],
      pr: [{
        id: 'q-pr', prompt: 'Hogyan alakul a PR-intervallum?',
        options: [
          { id: 'a', label: 'Rövidült' }, { id: 'b', label: 'Élettani' }, { id: 'c', label: 'Megnyúlt' },
        ],
        correct: ['c'],
        explain: 'A PR kb. 230 ms, tehát megnyúlt. Az ingervezetés lassulása a hyperkalaemia előrehaladtát jelzi.',
        highlight: 'pr',
      }],
    },
    reference: {
      kalibracio: 'Szabványos beállítás, jó minőségű felvétel.',
      frekvencia: 'Kb. 46/perc — bradycardia.',
      ritmus: 'Szabályos kamrai ritmus.',
      p: 'Ellaposodott, változó amplitúdójú P-hullámok.',
      pr: 'PR kb. 230 ms — megnyúlt.',
      qrs: 'QRS kb. 145 ms — kiszélesedett, szárblokkra nem jellemző alakkal.',
      tengely: 'Normál frontális tengely.',
      qt: 'QT kb. 380 ms.',
      st: 'Jelentős ST-eltérés nem látható.',
      t: 'Magas, keskeny alapú, csúcsos T-hullámok több elvezetésben.',
      osszegzes:
        'Bradycardia kb. 46/perc, ellaposodott P-hullámok, megnyúlt PR, kiszélesedett QRS és ' +
        'magas, csúcsos T-hullámok. A kép a súlyos hyperkalaemia EKG-jeleivel összeegyeztethető. ' +
        'A klinikai kontextus (kihagyott művesekezelés, izomgyengeség) alapján ez sürgős helyzet: ' +
        'azonnali kálium-meghatározás, szívmonitorozás és orvosi értékelés szükséges.',
    },
    findings: [
      {
        title: 'Magas, csúcsos T-hullámok',
        what: 'Keskeny alapú, hegyes csúcsú, magas T-hullámok.',
        where: 'Több elvezetésben, jellemzően a mellkasi elvezetésekben a legkifejezettebb.',
        meaning: 'A sejtmembrán repolarizációjának megváltozása emelkedett szérumkálium mellett.',
        ddx: ['Hyperkalaemia', 'Akut ischaemia korai T-hullám változása', 'Korai repolarizáció', 'Bal kamra hypertrophia'],
        why: 'A hyperkalaemia legkorábbi EKG-jele, és a felismerése megelőzheti az életveszélyes ritmuszavart.',
      },
      {
        title: 'Kiszélesedett QRS és megnyúlt PR',
        what: 'A QRS 120 ms fölé szélesedik, a PR-intervallum megnyúlik, a P-hullámok ellaposodnak.',
        where: 'Minden elvezetésben.',
        meaning: 'Az ingervezetés lassulása előrehaladott hyperkalaemiára utal.',
        ddx: ['Hyperkalaemia', 'Szárblokk', 'Gyógyszerhatás (nátriumcsatorna-blokkoló)', 'Kamrai eredetű ritmus'],
        why: 'A QRS szélesedése súlyosabb fokozatot jelez; további progresszió sinushullám-mintázathoz és keringésmegálláshoz vezethet.',
      },
    ],
    evidence: [
      {
        name: 'European Resuscitation Council Guidelines: Special Circumstances',
        org: 'European Resuscitation Council', year: '2021', lastChecked: '2026-08-26',
        note: 'Az elektrolitzavarok — köztük a hyperkalaemia — felismerését és ellátását tárgyaló fejezet.',
      },
    ],
  },
]

export const caseById = (id: string) => EKG_CASES.find((c) => c.id === id)
