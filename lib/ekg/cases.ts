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
      { sourceId: 'bm-002272-2025-acs', note: 'Hazai elsődleges forrás az akut koronária szindróma ellátásához.' },
      { sourceId: 'esc-2023-acs', note: 'Az ST-eleváció elvezetés-specifikus küszöbértékeit és a reperfúziós időablakot tárgyalja.' },
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
      { sourceId: 'esc-2024-af', note: 'A pitvarfibrilláció felismerésének és ellátásának európai ajánlása.' },
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
      { sourceId: 'erc-2021-special', note: 'Az elektrolitzavarok — köztük a hyperkalaemia — felismerését és ellátását tárgyaló fejezet.' },
    ],
  },

  /* ══════════════════ 4. Anterior STEMI ══════════════════ */
  {
    id: 'anterior-stemi',
    title: 'Nyomó mellkasi fájdalom, nehézlégzés',
    age: 58, sex: 'férfi',
    vignette:
      '58 éves férfi. Egy órája kezdődött, nyugalomban is fennálló nyomó mellkasi fájdalom, nehézlégzés, ' +
      'halálfélelem. Vérnyomás 148/92 Hgmm, pulzus 98/perc, SpO₂ 94%. Cukorbetegség és magas koleszterinszint az előzményben.',
    difficulty: 'haladó',
    tags: ['stemi', 'ischaemia', 'tachy', 'sinus'],
    params: {
      rate: 98, rhythm: 'sinus', p: 'normal', prMs: 160, qrsMs: 96, axis: 'normal', qtMs: 360,
      st: { V1: 2.5, V2: 4.5, V3: 5.0, V4: 3.5, I: 1.0, aVL: 1.2, III: -1.5, aVF: -1.2 },
      t: { V2: 'peaked', V3: 'peaked', V4: 'peaked' },
      q: ['V1', 'V2'],
      noise: 0.25,
    },
    questions: {
      st: [
        {
          id: 'q-st1', prompt: 'Mely elvezetésekben látsz ST-elevációt?',
          options: [
            { id: 'a', label: 'II, III, aVF' }, { id: 'b', label: 'V1–V4' },
            { id: 'c', label: 'V5–V6, I, aVL' }, { id: 'd', label: 'Nincs ST-eleváció' },
          ],
          correct: ['b'],
          explain: 'A V1–V4 elvezetésben kifejezett ST-eleváció látható, a V2–V3 elvezetésben a legnagyobb. Ez az anteroseptalis terület leképeződése.',
          highlight: 'st',
        },
        {
          id: 'q-st2', prompt: 'Mit jelez a III. és aVF elvezetésben látható ST-depresszió?',
          options: [
            { id: 'a', label: 'Egyidejű inferior infarktust' },
            { id: 'b', label: 'Reciprok eltérést az anterior eleváció mellett' },
            { id: 'c', label: 'Mérési műterméket' },
          ],
          correct: ['b'],
          explain: 'Az inferior elvezetésekben megjelenő ST-depresszió az anterior eleváció reciprok tükörképe. Erősíti az ischaemiás eredetet.',
          highlight: 'st',
        },
      ],
      qrs: [{
        id: 'q-q', prompt: 'Látsz-e kóros Q-hullámot?',
        options: [
          { id: 'a', label: 'Nem' }, { id: 'b', label: 'Igen, a V1–V2 elvezetésben' },
          { id: 'c', label: 'Igen, az inferior elvezetésekben' },
        ],
        correct: ['b'],
        explain: 'A V1–V2 elvezetésben kóros Q-hullám látható. Kialakuló Q-hullám a myocardium elhalásának jele, és a folyamat előrehaladottságára utal.',
        highlight: 'qrs',
      }],
      frekvencia: [{
        id: 'q-freq', prompt: 'Mekkora a kamrai frekvencia?',
        options: [
          { id: 'a', label: '60/perc alatt' }, { id: 'b', label: '60–80/perc' },
          { id: 'c', label: 'Kb. 90–100/perc' }, { id: 'd', label: '150/perc felett' },
        ],
        correct: ['c'],
        explain: 'Kb. 98/perc — enyhe sinus tachycardia. Fájdalom, szorongás és csökkent szívteljesítmény egyaránt okozhatja.',
        highlight: 'rr',
      }],
    },
    reference: {
      kalibracio: 'Szabványos beállítás: 25 mm/s, 10 mm/mV. Értékelhető felvétel.',
      frekvencia: 'Kb. 98/perc — enyhe sinus tachycardia.',
      ritmus: 'Szabályos kamrai ritmus, sinus eredettel.',
      p: 'Minden QRS-t élettani alakú P-hullám előz meg.',
      pr: 'PR kb. 160 ms — élettani.',
      qrs: 'QRS kb. 96 ms, keskeny. Kóros Q-hullám a V1–V2 elvezetésben.',
      tengely: 'Normál frontális tengely.',
      qt: 'QT kb. 360 ms; a QTc a frekvenciára korrigálva élettani tartományban.',
      st: 'Kifejezett ST-eleváció a V1–V4 elvezetésben, a V2–V3 elvezetésben a legnagyobb. Enyhe eleváció az I és aVL elvezetésben, reciprok ST-depresszió a III és aVF elvezetésben.',
      t: 'Magas, csúcsos T-hullámok az anterior elvezetésekben.',
      osszegzes:
        'Sinus tachycardia kb. 98/perc, keskeny QRS, normál tengely. Kiterjedt ST-eleváció a V1–V4 ' +
        'elvezetésben reciprok inferior ST-depresszióval, kialakuló Q-hullámmal a V1–V2 elvezetésben — ' +
        'az anteroseptalis fal akut, kiterjedt ischaemiájával összeegyeztethető kép. ' +
        'A klinikai kontextussal együtt időkritikus helyzet, azonnali orvosi értékelés szükséges.',
    },
    findings: [
      {
        title: 'Kiterjedt anterior ST-eleváció',
        what: 'Az izoelektromos vonal fölé emelkedő ST-szakasz, amely a T-hullámba olvad.',
        where: 'V1–V4 elvezetés, a V2–V3 elvezetésben a legkifejezettebb.',
        meaning: 'Az anteroseptalis fal akut, teljes falvastagságot érintő ischaemiája, amely jellemzően a bal elülső leszálló koszorúér elzáródásához köthető.',
        ddx: ['Akut anterior szívinfarktus', 'Bal Tawara-szár blokk okozta ST-eltérés', 'Korai repolarizáció', 'Pericarditis', 'Bal kamra aneurysma'],
        why: 'A kiterjedt anterior infarktus nagy myocardium-tömeget veszélyeztet, ezért a reperfúzióig eltelt idő különösen meghatározó.',
        leads: ['V1', 'V2', 'V3', 'V4'],
      },
      {
        title: 'Kialakuló kóros Q-hullám',
        what: 'A QRS elején megjelenő, széles és mély negatív kitérés.',
        where: 'V1–V2 elvezetés.',
        meaning: 'Elektromosan néma, elhalt myocardium-terület jele. Megjelenése azt jelzi, hogy a folyamat már nem a legkorábbi szakaszban van.',
        ddx: ['Lezajlott vagy folyamatban lévő infarktus', 'Szeptális Q élettani változata', 'Cardiomyopathia'],
        why: 'A Q-hullám jelenléte nem zárja ki a reperfúzió hasznát, de az időfaktor megítélésében segít.',
        leads: ['V1', 'V2'],
      },
    ],
    evidence: [
      { sourceId: 'bm-002272-2025-acs', note: 'Hazai elsődleges forrás az akut koronária szindróma ellátásához.' },
      { sourceId: 'esc-2023-acs', note: 'Az elvezetés-specifikus ST-eleváció küszöbértékeit tárgyalja, életkor és nem szerinti bontásban.' },
    ],
  },

  /* ══════════════════ 5. Teljes AV-blokk ══════════════════ */
  {
    id: 'av-blokk-3',
    title: 'Szédülés, rövid eszméletvesztés',
    age: 78, sex: 'nő',
    vignette:
      '78 éves nő. Az elmúlt napokban ismétlődő szédülés, ma reggel rövid, előjel nélküli eszméletvesztés. ' +
      'Vérnyomás 96/58 Hgmm, pulzus 38/perc, tapintható. Béta-blokkolót és digoxint szed.',
    difficulty: 'gyakorlott',
    tags: ['av3', 'brady'],
    params: {
      rate: 38, rhythm: 'junctional', p: 'varying', prMs: 0, qrsMs: 130, axis: 'left', qtMs: 480,
      t: { V5: 'flat', V6: 'flat' },
      noise: 0.25,
    },
    questions: {
      p: [{
        id: 'q-p', prompt: 'Milyen kapcsolat van a P-hullámok és a QRS-komplexusok között?',
        options: [
          { id: 'a', label: 'Minden QRS-t állandó távolságú P előz meg' },
          { id: 'b', label: 'A P-hullámok és a QRS-ek egymástól függetlenül jelennek meg' },
          { id: 'c', label: 'A PR fokozatosan nyúlik, majd kimarad egy QRS' },
          { id: 'd', label: 'Nincs azonosítható P-hullám' },
        ],
        correct: ['b'],
        explain: 'A P-hullámok saját, szabályos ütemben követik egymást, a QRS-ek szintén — de a kettő között nincs állandó kapcsolat. Ez az AV-disszociáció, a teljes AV-blokk jellegzetessége.',
        highlight: 'p',
      }],
      frekvencia: [{
        id: 'q-freq', prompt: 'Mekkora a kamrai frekvencia?',
        options: [
          { id: 'a', label: 'Kb. 35–40/perc' }, { id: 'b', label: '50–60/perc' },
          { id: 'c', label: '70–90/perc' },
        ],
        correct: ['a'],
        explain: 'Kb. 38/perc. Teljes AV-blokkban a kamrákat pótritmus tartja működésben, amelynek frekvenciája jóval alacsonyabb a sinuscsomóénál.',
        highlight: 'rr',
      }],
      qrs: [{
        id: 'q-qrs', prompt: 'Mit jelent a kiszélesedett QRS ebben a helyzetben?',
        options: [
          { id: 'a', label: 'Semmi különöset, élettani változat' },
          { id: 'b', label: 'A pótritmus a kamrákból, alacsonyabb szintről indul' },
          { id: 'c', label: 'A felvétel rossz minőségű' },
        ],
        correct: ['b'],
        explain: 'A széles QRS arra utal, hogy a pótritmus a His-köteg alatti, kamrai szintről ered. Az ilyen pótritmus lassabb és megbízhatatlanabb, ezért a helyzet instabilabb.',
        highlight: 'qrs',
      }],
      qt: [{
        id: 'q-qt', prompt: 'Hogyan értékeled a QT-időt ilyen lassú frekvencia mellett?',
        options: [
          { id: 'a', label: 'A mért QT önmagában elegendő' },
          { id: 'b', label: 'A frekvenciára korrigálva kell értékelni' },
          { id: 'c', label: 'Bradycardia mellett nem mérhető' },
        ],
        correct: ['b'],
        explain: 'A QT a frekvenciával változik, ezért korrigálni kell. Lassú frekvencián a mért QT hosszabb, a korrigált érték viszont közelebb kerül az élettanihoz — de a bradycardia önmagában is ritmuszavar-kockázatot jelent.',
        highlight: 'qt',
      }],
    },
    reference: {
      kalibracio: 'Szabványos beállítás, értékelhető felvétel.',
      frekvencia: 'Kamrai frekvencia kb. 38/perc; a pitvari frekvencia ennél gyorsabb és független.',
      ritmus: 'Szabályos, lassú kamrai pótritmus.',
      p: 'P-hullámok szabályos ütemben, a QRS-ektől függetlenül — AV-disszociáció.',
      pr: 'PR-intervallum nem értelmezhető, mivel nincs átvezetés.',
      qrs: 'QRS kb. 130 ms — széles, kamrai eredetű pótritmusra utal.',
      tengely: 'Bal tengelyeltérés.',
      qt: 'QT kb. 480 ms; a lassú frekvencia miatt korrigálva értékelendő.',
      st: 'Jelentős ST-eltérés nem látható.',
      t: 'Lapos T-hullámok a lateralis elvezetésekben.',
      osszegzes:
        'Teljes (harmadfokú) AV-blokk: a pitvarok és a kamrák egymástól függetlenül működnek, ' +
        'a kamrákat kb. 38/perc frekvenciájú, széles QRS-ű pótritmus tartja fenn. Bal tengelyeltérés. ' +
        'A klinikai kép (eszméletvesztés, alacsony vérnyomás) alapján ez sürgős helyzet: folyamatos ' +
        'szívmonitorozás, a frekvenciacsökkentő gyógyszerek felülvizsgálata és azonnali orvosi értékelés szükséges.',
    },
    findings: [
      {
        title: 'AV-disszociáció',
        what: 'A P-hullámok és a QRS-komplexusok saját, egymástól független ütemben követik egymást.',
        where: 'Legjobban a hosszú ritmuscsíkon értékelhető, ahol több ütés látható egymás után.',
        meaning: 'Az ingerület nem jut át a pitvarokból a kamrákba; a kamrákat pótritmus tartja működésben.',
        ddx: ['Harmadfokú AV-blokk', 'Kamrai tachycardia AV-disszociációval', 'Gyógyszerhatás (béta-blokkoló, digoxin, kalciumcsatorna-blokkoló)', 'Ischaemia', 'Hyperkalaemia'],
        why: 'A pótritmus bármikor kimaradhat, ami keringésmegálláshoz vezethet — ezért folyamatos monitorozás szükséges.',
      },
      {
        title: 'Széles QRS-ű pótritmus',
        what: '120 ms-nál szélesebb QRS lassú, szabályos ritmusban.',
        where: 'Minden elvezetésben.',
        meaning: 'A pótritmus a His-köteg alatti szintről indul, ezért lassabb és megbízhatatlanabb, mint a junkcionális pótritmus.',
        ddx: ['Kamrai pótritmus', 'Junkcionális pótritmus szárblokkal', 'Pacemaker-diszfunkció'],
        why: 'A blokk szintje meghatározza a kockázatot és a további ellátás irányát.',
      },
    ],
    evidence: [
      { sourceId: 'esc-2021-pacing', note: 'A bradyarrhythmiák és az ingervezetési zavarok felismerését és ellátását tárgyalja.' },
    ],
  },

  /* ══════════════════ 6. Pitvari flutter ══════════════════ */
  {
    id: 'flutter-2-1',
    title: 'Egyenletes szapora szívverés',
    age: 66, sex: 'férfi',
    vignette:
      '66 éves férfi. Két napja tartó, egyenletesnek érzett szapora szívverés, enyhe nehézlégzés terhelésre. ' +
      'Vérnyomás 132/80 Hgmm, pulzus 150/perc, szabályos. Korábban szívelégtelenség miatt gondozták.',
    difficulty: 'haladó',
    tags: ['flutter', 'tachy'],
    params: {
      rate: 150, rhythm: 'flutter', p: 'flutter', prMs: 0, qrsMs: 92, axis: 'normal', qtMs: 300,
      st: { V4: -0.6, V5: -0.6 },
      noise: 0.2,
    },
    questions: {
      ritmus: [{
        id: 'q-rhythm', prompt: 'Milyen a kamrai ritmus?',
        options: [
          { id: 'a', label: 'Szabályos, kb. 150/perc' }, { id: 'b', label: 'Szabálytalanul szabálytalan' },
          { id: 'c', label: 'Szabályos, kb. 75/perc' },
        ],
        correct: ['a'],
        explain: 'A kamrai ritmus szabályos, kb. 150/perc. A pitvarfibrillációval szemben itt a ritmus egyenletes — ez fontos elkülönítő jel.',
        highlight: 'rr',
      }],
      p: [{
        id: 'q-p', prompt: 'Milyen a pitvari aktivitás?',
        options: [
          { id: 'a', label: 'Élettani P-hullámok' },
          { id: 'b', label: 'Fűrészfog-mintázat, kb. 300/perc pitvari frekvenciával' },
          { id: 'c', label: 'Rendezetlen, hullámzó alapvonal' },
          { id: 'd', label: 'Nincs pitvari aktivitás' },
        ],
        correct: ['b'],
        explain: 'A II, III és aVF elvezetésben folyamatos fűrészfog-mintázat látható, kb. 300/perc pitvari frekvenciával. A kamrai frekvencia ennek fele, tehát 2:1 az átvezetés.',
        highlight: 'p',
      }],
      frekvencia: [{
        id: 'q-freq', prompt: 'Miért gyanús a pontosan 150/perc körüli, szabályos kamrai frekvencia?',
        options: [
          { id: 'a', label: 'Semmi különös, gyakori sinus tachycardia' },
          { id: 'b', label: 'A 2:1 átvezetésű pitvari flutter jellegzetes frekvenciája' },
          { id: 'c', label: 'Mindig kamrai eredetre utal' },
        ],
        correct: ['b'],
        explain: 'A pitvari flutter tipikus pitvari frekvenciája kb. 300/perc. 2:1 átvezetésnél ebből 150/perc kamrai frekvencia lesz. A 150 körüli, makacsul szabályos ritmus mindig felveti a flutter lehetőségét.',
        highlight: 'rr',
      }],
    },
    reference: {
      kalibracio: 'Szabványos beállítás, értékelhető felvétel.',
      frekvencia: 'Kamrai frekvencia kb. 150/perc; pitvari frekvencia kb. 300/perc.',
      ritmus: 'Szabályos kamrai ritmus.',
      p: 'Élettani P-hullám helyett folyamatos fűrészfog-mintázat, legjobban a II, III és aVF elvezetésben.',
      pr: 'PR-intervallum nem értelmezhető.',
      qrs: 'QRS kb. 92 ms — keskeny, supraventricularis eredet.',
      tengely: 'Normál frontális tengely.',
      qt: 'QT kb. 300 ms; gyors frekvencia mellett óvatosan értékelendő.',
      st: 'Enyhe ST-depresszió a V4–V5 elvezetésben, amely frekvenciafüggő lehet.',
      t: 'A T-hullámok a flutterhullámok miatt nehezen ítélhetők meg.',
      osszegzes:
        'Pitvari flutter 2:1 átvezetéssel: pitvari frekvencia kb. 300/perc, kamrai frekvencia kb. 150/perc, ' +
        'szabályos kamrai ritmussal és keskeny QRS-sel. Enyhe lateralis ST-depresszió, amely frekvenciafüggő lehet. ' +
        'A thromboemboliás kockázat felmérése és a további ellátás orvosi feladat.',
    },
    findings: [
      {
        title: 'Fűrészfog-mintázat',
        what: 'Folyamatos, izoelektromos szakasz nélküli pitvari hullámok, jellegzetes fűrészfog alakkal.',
        where: 'II, III és aVF elvezetés; a V1-ben gyakran diszkrét pozitív hullámokként látszik.',
        meaning: 'Szervezett, körkörös pitvari elektromos aktivitás — ez különbözteti meg a pitvarfibrilláció rendezetlen mintázatától.',
        ddx: ['Pitvari flutter', 'Pitvari tachycardia blokkal', 'Pitvarfibrilláció durva hullámokkal'],
        why: 'A flutter felismerése megváltoztatja a kezelési stratégiát a pitvarfibrillációhoz képest, a thromboemboliás kockázat viszont hasonlóan felmérendő.',
        leads: ['II', 'III', 'aVF'],
      },
      {
        title: 'Szabályos 150/perc körüli kamrai frekvencia',
        what: 'Egyenletes R–R távolságok, kb. 150/perc frekvenciával.',
        where: 'A teljes felvételen.',
        meaning: '2:1 átvezetés a kb. 300/perc pitvari frekvencia mellett.',
        ddx: ['Pitvari flutter 2:1 átvezetéssel', 'Sinus tachycardia', 'Supraventricularis tachycardia'],
        why: 'A makacsul 150/perc körüli szabályos ritmus mindig felveti a flutter gyanúját — a flutterhullámokat célzottan kell keresni.',
      },
    ],
    evidence: [
      { sourceId: 'esc-2024-af', note: 'A pitvari flutter és a pitvarfibrilláció ellátását közös keretben tárgyalja.' },
    ],
  },

  /* ══════════════════ 7. Tüdőembólia ══════════════════ */
  {
    id: 'pulmonalis-embolia',
    title: 'Hirtelen nehézlégzés, szúró mellkasi fájdalom',
    age: 44, sex: 'nő',
    vignette:
      '44 éves nő. Ma reggel hirtelen kezdődött nehézlégzés, belégzésre fokozódó szúró mellkasi fájdalom. ' +
      'Két hete térdműtéten esett át. Vérnyomás 118/72 Hgmm, pulzus 112/perc, SpO₂ 91% levegőn. Jobb lábszára duzzadtabb.',
    difficulty: 'gyakorlott',
    tags: ['pe', 'tachy', 'sinus'],
    params: {
      rate: 112, rhythm: 'sinus', p: 'normal', prMs: 150, qrsMs: 94, axis: 'right', qtMs: 330,
      st: { V1: 0.8, III: 0.6 },
      t: { V1: 'inverted', V2: 'inverted', V3: 'inverted', III: 'inverted' },
      q: ['III'],
      noise: 0.3,
    },
    questions: {
      tengely: [{
        id: 'q-axis', prompt: 'Milyen a frontális tengelyállás?',
        options: [
          { id: 'a', label: 'Normál' }, { id: 'b', label: 'Bal tengelyeltérés' },
          { id: 'c', label: 'Jobb tengelyeltérés' }, { id: 'd', label: 'Extrém tengelyeltérés' },
        ],
        correct: ['c'],
        explain: 'Az I. elvezetés nettó negatív, az aVF pozitív — jobb tengelyeltérés. Akut jobbszív-terhelés egyik jele lehet.',
        highlight: 'qrs',
      }],
      t: [{
        id: 'q-t', prompt: 'Mit látsz a jobb oldali mellkasi elvezetések T-hullámain?',
        options: [
          { id: 'a', label: 'Élettani, pozitív T-hullámok' },
          { id: 'b', label: 'T-inverzió a V1–V3 elvezetésben' },
          { id: 'c', label: 'Csúcsos, magas T-hullámok' },
        ],
        correct: ['b'],
        explain: 'A V1–V3 elvezetésben T-inverzió látható. Akut jobbszív-terhelésnél ez az egyik leggyakoribb EKG-eltérés, és a súlyosság megítélésében is szerepet kap.',
        highlight: 't',
      }],
      frekvencia: [{
        id: 'q-freq', prompt: 'Mekkora a kamrai frekvencia?',
        options: [
          { id: 'a', label: '60–80/perc' }, { id: 'b', label: 'Kb. 110–120/perc' }, { id: 'c', label: '150/perc felett' },
        ],
        correct: ['b'],
        explain: 'Kb. 112/perc — sinus tachycardia. Ez a leggyakoribb, de legkevésbé specifikus EKG-jel tüdőembóliában.',
        highlight: 'rr',
      }],
      osszegzes: [{
        id: 'q-sum', prompt: 'Elegendő-e ez az EKG a tüdőembólia igazolásához?',
        options: [
          { id: 'a', label: 'Igen, a jellegzetes mintázat bizonyító erejű' },
          { id: 'b', label: 'Nem, az EKG csak támogató jel — a diagnózis képalkotással igazolható' },
          { id: 'c', label: 'Az EKG kizárja a tüdőembóliát, ha normális' },
        ],
        correct: ['b'],
        explain: 'Az EKG tüdőembóliában sem érzékeny, sem specifikus. A normális EKG nem zárja ki, a jellegzetes eltérések pedig nem igazolják. A klinikai valószínűség, a D-dimer és a képalkotás együtt vezet a diagnózishoz.',
        highlight: 'none',
      }],
    },
    reference: {
      kalibracio: 'Szabványos beállítás, mérsékelt alapvonal-ingadozás.',
      frekvencia: 'Kb. 112/perc — sinus tachycardia.',
      ritmus: 'Szabályos kamrai ritmus, sinus eredettel.',
      p: 'Minden QRS-t P-hullám előz meg.',
      pr: 'PR kb. 150 ms — élettani.',
      qrs: 'QRS kb. 94 ms, keskeny. A III. elvezetésben Q-hullám látható.',
      tengely: 'Jobb tengelyeltérés.',
      qt: 'QT kb. 330 ms.',
      st: 'Enyhe ST-eleváció a V1 és a III. elvezetésben.',
      t: 'T-inverzió a V1–V3 és a III. elvezetésben.',
      osszegzes:
        'Sinus tachycardia kb. 112/perc, jobb tengelyeltérés, a III. elvezetésben Q-hullámmal és ' +
        'T-inverzióval, valamint T-inverzióval a V1–V3 elvezetésben — akut jobbszív-terheléssel ' +
        'összeegyeztethető kép. Az EKG önmagában sem nem igazolja, sem nem zárja ki a tüdőembóliát: ' +
        'a klinikai valószínűség (a friss műtét és a lábszárduzzanat miatt magas), a D-dimer és a ' +
        'képalkotás együtt vezet a diagnózishoz.',
    },
    findings: [
      {
        title: 'Akut jobbszív-terhelés jelei',
        what: 'Jobb tengelyeltérés, a III. elvezetésben Q-hullám és T-inverzió, a jobb oldali mellkasi elvezetésekben T-inverzió.',
        where: 'III. elvezetés és V1–V3.',
        meaning: 'A jobb kamra hirtelen megnövekedett nyomásterhelése. A klasszikusan leírt mintázat csak az esetek kisebb részében látható teljes formában.',
        ddx: ['Akut tüdőembólia', 'Krónikus tüdőbetegség okozta jobbszív-terhelés', 'Jobb Tawara-szár blokk', 'Anterior ischaemia', 'Élettani változat fiatal nőknél'],
        why: 'Jelenléte hemodinamikailag jelentősebb embóliára utalhat, hiánya viszont nem zárja ki a kórképet.',
        leads: ['III', 'V1', 'V2', 'V3'],
      },
      {
        title: 'Sinus tachycardia',
        what: 'Sinus eredetű ritmus 100/perc feletti frekvenciával.',
        where: 'A teljes felvételen.',
        meaning: 'A leggyakoribb EKG-eltérés tüdőembóliában, de a legkevésbé specifikus.',
        ddx: ['Tüdőembólia', 'Fájdalom, szorongás', 'Láz, fertőzés', 'Vérzés, hypovolaemia', 'Pajzsmirigy-túlműködés'],
        why: 'Önmagában nem irányadó, de a klinikai kontextusban súlyt kap — friss műtét és lábszárduzzanat mellett a valószínűséget növeli.',
      },
    ],
    evidence: [
      { sourceId: 'esc-2019-pe', note: 'A tüdőembólia diagnosztikai algoritmusát és kockázatbecslését tárgyalja.' },
    ],
  },

  /* ══════════════════ 8. Hypokalaemia, QT-megnyúlás ══════════════════ */
  {
    id: 'hypokalaemia-qt',
    title: 'Gyengeség, izomgörcsök',
    age: 71, sex: 'nő',
    vignette:
      '71 éves nő. Egy hete tartó általános gyengeség, lábikragörcsök, szívdobogásérzés. ' +
      'Magas vérnyomás miatt vízhajtót szed, az elmúlt napokban hasmenése volt. Vérnyomás 138/84 Hgmm, pulzus 62/perc.',
    difficulty: 'gyakorlott',
    tags: ['hypok', 'sinus'],
    params: {
      rate: 62, rhythm: 'sinus', p: 'normal', prMs: 175, qrsMs: 95, axis: 'normal', qtMs: 520,
      st: { V4: -0.9, V5: -1.0, V6: -0.8, II: -0.6 },
      t: { V3: 'flat', V4: 'flat', V5: 'flat', V6: 'flat', II: 'flat' },
      noise: 0.2,
    },
    questions: {
      qt: [{
        id: 'q-qt', prompt: 'Hogyan értékeled a QT-időt?',
        options: [
          { id: 'a', label: 'Élettani' }, { id: 'b', label: 'Rövidült' }, { id: 'c', label: 'Megnyúlt' },
        ],
        correct: ['c'],
        explain: 'A mért QT kb. 520 ms, ami 62/perc mellett korrigálva is jelentősen megnyúlt. A megnyúlt QTc fokozza a kamrai ritmuszavar kockázatát.',
        highlight: 'qt',
      }],
      t: [{
        id: 'q-t', prompt: 'Milyenek a T-hullámok?',
        options: [
          { id: 'a', label: 'Magasak, csúcsosak' }, { id: 'b', label: 'Ellaposodtak' },
          { id: 'c', label: 'Mélyen inverzek' }, { id: 'd', label: 'Élettani alakúak' },
        ],
        correct: ['b'],
        explain: 'A T-hullámok ellaposodtak, több elvezetésben alig kivehetők. Hypokalaemiában ez jellegzetes, és gyakran U-hullám is megjelenik a T után.',
        highlight: 't',
      }],
      st: [{
        id: 'q-st', prompt: 'Mit látsz az ST-szakaszon?',
        options: [
          { id: 'a', label: 'Jelentős ST-eleváció' }, { id: 'b', label: 'Enyhe ST-depresszió több elvezetésben' },
          { id: 'c', label: 'Élettani ST-szakasz' },
        ],
        correct: ['b'],
        explain: 'Enyhe, diffúz ST-depresszió látható. Hypokalaemiában ez a lapos T-hullámmal és az U-hullámmal együtt alkot jellegzetes hármast.',
        highlight: 'st',
      }],
    },
    reference: {
      kalibracio: 'Szabványos beállítás, jó minőségű felvétel.',
      frekvencia: 'Kb. 62/perc.',
      ritmus: 'Szabályos kamrai ritmus, sinus eredettel.',
      p: 'Élettani alakú P-hullámok minden QRS előtt.',
      pr: 'PR kb. 175 ms — élettani.',
      qrs: 'QRS kb. 95 ms — keskeny.',
      tengely: 'Normál frontális tengely.',
      qt: 'QT kb. 520 ms — a frekvenciára korrigálva is jelentősen megnyúlt.',
      st: 'Enyhe, diffúz ST-depresszió, kifejezettebben a lateralis elvezetésekben.',
      t: 'Ellaposodott T-hullámok több elvezetésben.',
      osszegzes:
        'Sinus ritmus kb. 62/perc, normál tengely, keskeny QRS. Megnyúlt QT, ellaposodott T-hullámok ' +
        'és enyhe diffúz ST-depresszió — hypokalaemiával összeegyeztethető kép, amelyet a vízhajtó ' +
        'szedése és a hasmenés is alátámaszt. Sürgős kálium- és magnézium-meghatározás, szívmonitorozás ' +
        'és orvosi értékelés szükséges, mert a megnyúlt QT ritmuszavar-kockázatot hordoz.',
    },
    findings: [
      {
        title: 'Megnyúlt QT-idő',
        what: 'A QRS kezdetétől a T-hullám végéig tartó szakasz megnyúlása, a T-hullám elhúzódó lefutásával.',
        where: 'Legjobban a II. és a V5 elvezetésben mérhető.',
        meaning: 'A kamrai repolarizáció elhúzódása. Elektrolitzavar, gyógyszerhatás és veleszületett eltérés egyaránt okozhatja.',
        ddx: ['Hypokalaemia', 'Hypomagnesaemia', 'Hypocalcaemia', 'QT-nyújtó gyógyszerek', 'Veleszületett hosszú QT szindróma'],
        why: 'A jelentősen megnyúlt QTc polimorf kamrai tachycardia kockázatát hordozza, ezért a kiváltó ok felismerése sürgős.',
        leads: ['II', 'V5'],
      },
      {
        title: 'Ellaposodott T-hullámok és ST-depresszió',
        what: 'Alacsony amplitúdójú, elmosódott T-hullámok enyhe, diffúz ST-depresszióval.',
        where: 'Több elvezetésben, kifejezettebben lateralisan.',
        meaning: 'Hypokalaemiára jellemző repolarizációs eltérés; gyakran U-hullám is társul hozzá.',
        ddx: ['Hypokalaemia', 'Ischaemia', 'Gyógyszerhatás (digoxin)', 'Bal kamra hypertrophia'],
        why: 'A kálium mellett a magnéziumot is ellenőrizni kell, mert alacsony magnéziumszint mellett a káliumpótlás hatástalan maradhat.',
      },
    ],
    evidence: [
      { sourceId: 'erc-2021-special', note: 'Az elektrolitzavarok felismerését és ellátását tárgyaló fejezet.' },
      { sourceId: 'bm-002311-2025-hypertonia', note: 'A vízhajtó kezelés melletti elektrolit-ellenőrzés szempontjai.' },
    ],
  },
]

export const caseById = (id: string) => EKG_CASES.find((c) => c.id === id)
