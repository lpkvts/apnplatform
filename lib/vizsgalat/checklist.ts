// Betegvizsgálat — szervrendszer-alapú checklist + részletes vizsgálati útmutató.
// Tanulási és áttekintési segédlet, NEM klinikai protokoll vagy diagnózis.

export interface ExamSystem {
  id: string
  name: string
  icon: string
  overview?: string
  ippa?: boolean // Megtekintés → Tapintás → Kopogtatás → Hallgatózás sorrend releváns
}

export interface ExamElement {
  id: string
  sys: string
  title: string
  short: string
  purpose?: string
  prep?: string[]
  equip?: string[]
  steps?: string[]
  observe?: string[]
  findings?: string[]
  conditions?: string[]
  scoreIds?: string[]
  labIds?: string[]
  ekgIds?: string[]
  competency?: string
  detail?: string
  kw?: string
}

export const EXAM_SYSTEMS: ExamSystem[] = [
  { id: 'altalanos', name: 'Általános állapot', icon: '🩺', overview: 'Az első benyomás és az általános fizikális jelek gyors áttekintése.' },
  { id: 'eletjelek', name: 'Életjelek', icon: '📊', overview: 'A vitális paraméterek mérése és értékelése.' },
  { id: 'cardio', name: 'Kardiovaszkuláris rendszer', icon: '❤️', ippa: true, overview: 'A keringési rendszer fizikális vizsgálata: pulzus, vérnyomás, szívhangok, perifériás keringés.' },
  { id: 'legzo', name: 'Légzőrendszer', icon: '🌬️', ippa: true, overview: 'A légzés és a mellkas fizikális vizsgálata a klasszikus IPPA-sorrendben.' },
  { id: 'hasi', name: 'Hasi / gasztrointesztinális rendszer', icon: '🍽️', overview: 'A has vizsgálata a megtekintés → auszkultáció → kopogtatás → tapintás sorrendben.' },
  { id: 'neuro', name: 'Neurológiai rendszer', icon: '🧠', overview: 'A tudat, agyidegek, motoros és szenzoros funkciók, reflexek és koordináció áttekintése.' },
  { id: 'mozgas', name: 'Mozgásszervrendszer', icon: '🦴', overview: 'Ízületek, gerinc, járáskép és izomerő vizsgálata.' },
  { id: 'bor', name: 'Bőr és nyálkahártyák', icon: '✋', overview: 'A bőr színe, turgora, elváltozásai és a nyálkahártyák állapota.' },
  { id: 'endokrin', name: 'Endokrin / általános fizikális jelek', icon: '⚗️', overview: 'Pajzsmirigy és egyéb endokrin eredetű fizikális jelek.' },
  { id: 'uro', name: 'Urogenitális rendszer', icon: '💧', overview: 'Vesetáji és húgyúti fizikális jelek áttekintése.' },
  { id: 'perif', name: 'Perifériás ér- és nyirokrendszer', icon: '🩸', overview: 'Perifériás pulzusok, kapilláris újratelődés, vénás jelek és nyirokcsomók.' },
]

export const EXAM_ELEMENTS: ExamElement[] = [
  // ── ÁLTALÁNOS ÁLLAPOT ──────────────────────────────
  { id: 'altalanos_benyomas', sys: 'altalanos', title: 'Általános benyomás', short: 'A beteg általános állapotának, tartásának, együttműködésének gyors felmérése.',
    purpose: 'Első pillantásra tájékozódni a beteg súlyosságáról és sürgősségéről.',
    steps: ['Nézd meg a beteget belépéskor (jár-e, fekszik-e, milyen a tartása)', 'Figyeld a légzést, a bőrszínt és az arckifejezést', 'Értékeld az együttműködést és a distressz jeleit'],
    observe: ['Distressz jelei (verejtékezés, nyugtalanság)', 'Kényszertartás', 'Sápadtság vagy cyanosis'], kw: 'általános benyomás tartás distressz' },
  { id: 'altalanos_tudat', sys: 'altalanos', title: 'Tudat és éberség', short: 'A tudatállapot gyors megítélése (éber, aluszékony, zavart).',
    steps: ['Szólítsd meg a beteget', 'Értékeld a válaszkészséget és az orientációt', 'Szükség esetén AVPU vagy GCS'], scoreIds: ['avpu', 'gcs'], kw: 'tudat éberség avpu gcs orientáció' },
  { id: 'altalanos_taplaltsag', sys: 'altalanos', title: 'Testalkat és tápláltság', short: 'A testalkat, tápláltsági állapot és a cachexia/obesitas jeleinek megítélése.',
    observe: ['Alultápláltság / cachexia jelei', 'Obesitas', 'Izomtömeg'], scoreIds: ['must', 'bmi'], kw: 'tápláltság testalkat cachexia obesitas' },
  { id: 'altalanos_hidracio', sys: 'altalanos', title: 'Hidráltság', short: 'A folyadékstátusz megítélése a bőr, nyálkahártyák és turgor alapján.',
    observe: ['Száraz nyálkahártyák', 'Csökkent bőrturgor', 'Beesett szemek'], kw: 'hidráltság folyadék turgor dehidráció' },
  { id: 'altalanos_bor_szin', sys: 'altalanos', title: 'Bőrszín', short: 'Sápadtság, cyanosis, icterus és bőrpír gyors megítélése.',
    observe: ['Sápadtság (anaemia)', 'Centrális/perifériás cyanosis', 'Icterus (sárgaság)'], conditions: ['Anaemia', 'Hypoxaemia', 'Májbetegség'], kw: 'bőrszín sápadtság cyanosis icterus' },

  // ── ÉLETJELEK ──────────────────────────────────────
  { id: 'eletjelek_pulzus', sys: 'eletjelek', title: 'Pulzus', short: 'A pulzus frekvenciájának, ritmusának és kvalitásának mérése.',
    steps: ['Tapintsd az a. radialist 2-3 ujjal', 'Számold a frekvenciát 15-30 mp-en át', 'Értékeld a ritmust és a teltséget'], observe: ['Tachy-/bradycardia', 'Szabálytalan ritmus', 'Gyenge/filiform pulzus'], ekgIds: ['afib', 'tachy', 'brady'], kw: 'pulzus frekvencia ritmus radialis' },
  { id: 'eletjelek_vernyomas', sys: 'eletjelek', title: 'Vérnyomás', short: 'A vérnyomás mérése megfelelő mandzsettával, ülő/fekvő helyzetben.',
    equip: ['Vérnyomásmérő', 'Megfelelő méretű mandzsetta'], steps: ['Pihentesd a beteget néhány percig', 'Helyezd a mandzsettát szívmagasságba', 'Mérj, szükség esetén ismételd / orthostaticus mérés'], observe: ['Hypertensio', 'Hypotensio', 'Nagy amplitúdó-különbség'], scoreIds: ['news2'], kw: 'vérnyomás rr mandzsetta orthostaticus' },
  { id: 'eletjelek_legzesszam', sys: 'eletjelek', title: 'Légzésszám', short: 'A légzésszám diszkrét megszámolása egy percen át.',
    steps: ['Figyeld a mellkas emelkedését (a beteg tudta nélkül)', 'Számold a légvételeket 30-60 mp-en át', 'Értékeld a mintázatot'], observe: ['Tachypnoe / bradypnoe', 'Kóros légzésmintázat'], scoreIds: ['news2'], kw: 'légzésszám tachypnoe bradypnoe' },
  { id: 'eletjelek_spo2', sys: 'eletjelek', title: 'SpO₂', short: 'A perifériás oxigénszaturáció mérése pulzoximéterrel.',
    equip: ['Pulzoximéter'], steps: ['Helyezd az ujjra a szenzort', 'Várd meg a stabil jelet', 'Értékeld a hideg/rossz perfúzió zavaró hatását'], observe: ['Hypoxaemia (<94%)', 'Rossz jel hideg végtagnál'], kw: 'spo2 szaturáció pulzoximéter oxigén' },
  { id: 'eletjelek_homerseklet', sys: 'eletjelek', title: 'Testhőmérséklet', short: 'A testhőmérséklet mérése és a láz/hypothermia megítélése.',
    observe: ['Láz', 'Hypothermia'], kw: 'hőmérséklet láz hypothermia' },
  { id: 'eletjelek_tudat', sys: 'eletjelek', title: 'Tudatállapot', short: 'A tudatszint standardizált megítélése AVPU vagy GCS szerint.',
    scoreIds: ['avpu', 'gcs'], kw: 'tudat avpu gcs eszmélet' },
  { id: 'eletjelek_fajdalom', sys: 'eletjelek', title: 'Fájdalom', short: 'A fájdalom intenzitásának felmérése validált skálával.',
    scoreIds: ['vas', 'nrs'], kw: 'fájdalom vas nrs intenzitás' },

  // ── KARDIOVASZKULÁRIS ──────────────────────────────
  { id: 'cardio_megtekintes', sys: 'cardio', title: 'Általános megtekintés', short: 'A keringésre utaló általános jelek megfigyelése.',
    purpose: 'A keringési distressz és a krónikus szívbetegség külső jeleinek felismerése.',
    steps: ['Figyeld a bőrszínt (sápadtság, cyanosis)', 'Nézd a nyaki vénákat és a perifériás ödémát', 'Értékeld a légzési distresszt nyugalomban'],
    observe: ['Centrális cyanosis', 'Perifériás ödéma', 'Nyugalmi dyspnoe'], conditions: ['Szívelégtelenség'], kw: 'megtekintés inspectio cyanosis ödéma' },
  { id: 'cardio_pulzus', sys: 'cardio', title: 'Pulzus vizsgálata', short: 'A pulzus frekvenciája, ritmusa, szimmetriája és kvalitása.',
    purpose: 'A szívfrekvencia és -ritmus, valamint a perifériás perfúzió megítélése.',
    steps: ['Tapintsd az a. radialist mindkét oldalon', 'Számold a frekvenciát, értékeld a ritmust', 'Hasonlítsd össze a két oldalt (szimmetria)', 'Szükség esetén a. carotis / femoralis'],
    observe: ['Szabálytalanul szabálytalan ritmus (AF)', 'Pulzusdeficit', 'Aszimmetria', 'Filiform pulzus'],
    findings: ['Tachycardia', 'Bradycardia', 'Pitvarfibrilláció'], conditions: ['Pitvarfibrilláció'], ekgIds: ['afib', 'tachy', 'brady'], scoreIds: ['cha2ds2'], competency: 'Kardiovaszkuláris fizikális vizsgálat', kw: 'pulzus radialis ritmus frekvencia pulzusdeficit' },
  { id: 'cardio_vernyomas', sys: 'cardio', title: 'Vérnyomás mérése', short: 'A vérnyomás mérése és a keringési státusz megítélése.',
    equip: ['Vérnyomásmérő', 'Megfelelő méretű mandzsetta'],
    steps: ['Pihentesd a beteget 3-5 percig', 'Mandzsetta szívmagasságban, felkarra', 'Mérj mindkét karon szükség szerint', 'Orthostaticus mérés indokolt esetben'],
    observe: ['Hypertensio', 'Hypotensio / shock', 'Kar-kar különbség'], scoreIds: ['news2'], kw: 'vérnyomás rr orthostaticus mandzsetta' },
  { id: 'cardio_nyaki_venak', sys: 'cardio', title: 'Nyaki vénák vizsgálata', short: 'A juguláris vénás nyomás (JVP) becslése a jobb szívfél terhelésének megítéléséhez.',
    purpose: 'A centrális vénás nyomás és a jobbszív-terhelés indirekt becslése.',
    prep: ['Beteg félülő helyzetben (~45°)', 'Fej enyhén ellenoldalra fordítva'],
    steps: ['Keresd a v. jugularis interna pulzációját', 'Becsüld a vénás oszlop magasságát a sternumszöghöz', 'Figyeld a hepatojuguláris refluxot'],
    observe: ['Emelkedett JVP', 'Kóros hullámforma'], conditions: ['Szívelégtelenség', 'Tüdőembólia'], kw: 'nyaki véna jvp jugularis vénás nyomás' },
  { id: 'cardio_periferias', sys: 'cardio', title: 'Perifériás keringés', short: 'A végtagok perfúziójának megítélése (bőrhő, kapilláris újratelődés, pulzusok).',
    steps: ['Tapintsd a végtagok hőmérsékletét', 'Mérd a kapilláris újratelődést (<2 mp)', 'Ellenőrizd a perifériás pulzusokat'],
    observe: ['Hideg, márványozott végtag', 'Elhúzódó kapilláris újratelődés', 'Hiányzó pulzus'], conditions: ['Perifériás érbetegség', 'Shock'], kw: 'perifériás keringés kapilláris újratelődés perfúzió' },
  { id: 'cardio_sziv_tapintas', sys: 'cardio', title: 'Szív tapintása (palpatio)', short: 'A szívcsúcslökés és esetleges kóros pulzációk/leborzolások tapintása.',
    steps: ['Tapintsd a szívcsúcslökést (kb. V. bordaköz, medioclavicularis vonal)', 'Értékeld a helyzetét és jellegét', 'Keress leborzolást (thrill) a billentyűpontok felett'],
    observe: ['Áthelyeződött csúcslökés', 'Tapintható thrill', 'Emelő pulzáció'], kw: 'szív tapintás csúcslökés thrill palpatio' },
  { id: 'cardio_sziv_hallgatozas', sys: 'cardio', title: 'Szív hallgatózása (auszkultáció)', short: 'A szívhangok, ritmus és esetleges kóros hangjelenségek strukturált megfigyelése.',
    purpose: 'A szívhangok, a ritmus és a zörejek/kóros hangok szisztematikus értékelése.',
    prep: ['Csendes környezet', 'Beteg háton, majd bal oldalon fekve is'],
    equip: ['Fonendoszkóp (membrán és harang)'],
    steps: ['Hallgasd a négy klasszikus pontot (aorta, pulmonalis, tricuspidalis, mitralis)', 'Azonosítsd az S1 és S2 hangot', 'Értékeld a ritmust és a frekvenciát', 'Figyelj szisztolés/diasztolés zörejre', 'Keress extrahangot (S3, S4) és dörzszörejt'],
    observe: ['Szisztolés zörej', 'Diasztolés zörej', 'Szabálytalan ritmus', 'S3 galopp'],
    findings: ['Billentyűzörej', 'Pitvarfibrilláció', 'Pericardialis dörzszörej'],
    conditions: ['Billentyűbetegség', 'Szívelégtelenség', 'Pericarditis'], ekgIds: ['afib', 'lbbb'], competency: 'Kardiovaszkuláris fizikális vizsgálat',
    detail: 'A membránnal a magas frekvenciájú hangok (S1, S2, aortastenosis zöreje), a haranggal az alacsony frekvenciájú hangok (mitralis stenosis, S3/S4) hallhatók jobban. A zörejeket idő (szisztolés/diasztolés), lokalizáció, kisugárzás és intenzitás szerint jellemezzük.', kw: 'szív hallgatózás auszkultáció szívhang zörej s1 s2' },
  { id: 'cardio_odema', sys: 'cardio', title: 'Alsó végtagi ödéma', short: 'A perifériás (gödröt hagyó) ödéma vizsgálata és lokalizációja.',
    steps: ['Nyomd a tibia elülső felszínét néhány másodpercig', 'Értékeld a gödör mélységét és visszatelődését', 'Határozd meg a kiterjedést (boka, lábszár, generalizált)'],
    observe: ['Gödröt hagyó ödéma', 'Aszimmetria (DVT gyanú)'], conditions: ['Szívelégtelenség', 'Vénás elégtelenség', 'Mélyvénás thrombosis'], scoreIds: ['wellsdvt'], kw: 'ödéma alsó végtag gödröt hagyó boka' },

  // ── LÉGZŐRENDSZER ──────────────────────────────────
  { id: 'legzo_megtekintes', sys: 'legzo', title: 'Általános megtekintés', short: 'A légzés és a mellkas megfigyelése nyugalomban.',
    steps: ['Figyeld a légzésszámot és -mintázatot', 'Nézd a mellkas szimmetriáját és mozgását', 'Keress cyanosist és segédizom-használatot'],
    observe: ['Aszimmetrikus mellkasmozgás', 'Segédizom-használat', 'Cyanosis'], kw: 'megtekintés légzés mellkas inspectio' },
  { id: 'legzo_legzesszam', sys: 'legzo', title: 'Légzésszám', short: 'A légzésszám és a légzésmintázat értékelése.',
    steps: ['Számold a légvételeket diszkréten', 'Értékeld a mintázatot és a mélységet'], observe: ['Tachypnoe', 'Kóros mintázat'], scoreIds: ['news2'], kw: 'légzésszám tachypnoe' },
  { id: 'legzo_legzesi_munka', sys: 'legzo', title: 'Légzési munka', short: 'A fokozott légzési munka jeleinek megfigyelése.',
    observe: ['Segédizom-használat', 'Orrszárny-játék', 'Behúzódások', 'Nehezített beszéd'], kw: 'légzési munka segédizom distressz' },
  { id: 'legzo_spo2', sys: 'legzo', title: 'SpO₂', short: 'A perifériás oxigénszaturáció mérése és értelmezése.',
    equip: ['Pulzoximéter'], observe: ['Hypoxaemia', 'Krónikus hypoxiás beteg (célérték eltér)'], kw: 'spo2 szaturáció oxigén' },
  { id: 'legzo_mellkas_tapintas', sys: 'legzo', title: 'Mellkas tapintása (palpatio)', short: 'A mellkas kitérésének, szimmetriájának és a fremitusnak a tapintása.',
    steps: ['Tapintsd a mellkas kitérését mindkét oldalon', 'Értékeld a szimmetriát', 'Vizsgáld a tapintható fremitust'],
    observe: ['Csökkent/aszimmetrikus kitérés', 'Kóros fremitus', 'Bőr alatti emphysema'], kw: 'mellkas tapintás kitérés fremitus palpatio' },
  { id: 'legzo_kopogtatas', sys: 'legzo', title: 'Kopogtatás (percussio)', short: 'A tüdőmezők kopogtatási hangjának összehasonlító értékelése.',
    steps: ['Kopogtass szimmetrikusan, oldalról oldalra haladva', 'Hasonlítsd össze a két oldalt', 'Azonosítsd a tompulatot vagy a dobos hangot'],
    observe: ['Tompulat (folyadék, tömörülés)', 'Hyperresonantia (levegő)'], conditions: ['Pleuralis folyadék', 'Pneumothorax', 'Pneumonia'], kw: 'kopogtatás percussio tompulat dobos hang' },
  { id: 'legzo_auszkultacio', sys: 'legzo', title: 'Auszkultáció', short: 'A légzési hangok és a mellékhangok strukturált meghallgatása.',
    purpose: 'A légzési hangok minőségének és a kóros mellékhangoknak az azonosítása.',
    prep: ['Beteg ülő helyzetben', 'Mély, nyitott szájú légzés'], equip: ['Fonendoszkóp'],
    steps: ['Hallgasd szimmetrikusan, oldalról oldalra', 'Elöl, oldalt és hátul is', 'Azonosítsd a légzési hang jellegét', 'Keress mellékhangot (wheezing, rhonchus, crepitatio)', 'Figyelj pleuralis dörzszörejre'],
    observe: ['Csökkent/hiányzó légzési hang', 'Wheezing', 'Crepitatio', 'Pleuralis dörzszörej'],
    findings: ['Asthma / COPD (wheezing)', 'Pneumonia / szívelégtelenség (crepitatio)'],
    conditions: ['Asthma bronchiale', 'COPD exacerbatio', 'Pneumonia', 'Szívelégtelenség'], scoreIds: ['curb65', 'news2'], competency: 'Légzőrendszeri fizikális vizsgálat', kw: 'auszkultáció légzési hang wheezing crepitatio rhonchus' },

  // ── HASI ───────────────────────────────────────────
  { id: 'hasi_megtekintes', sys: 'hasi', title: 'Has megtekintése', short: 'A has alakjának, hegeknek, distensiónak és perisztaltikának a megfigyelése.',
    observe: ['Distensio', 'Látható perisztaltika', 'Hegek, sérv'], kw: 'has megtekintés distensio heg' },
  { id: 'hasi_auszkultacio', sys: 'hasi', title: 'Bélhangok (auszkultáció)', short: 'A bélhangok meghallgatása a tapintás ELŐTT.',
    purpose: 'A bélmotilitás megítélése; hasi vizsgálatnál a tapintás előtt végezzük.',
    steps: ['Hallgasd a bélhangokat legalább 30 mp-ig', 'Értékeld a gyakoriságot és jelleget'],
    observe: ['Fokozott / csengő bélhang (ileus)', 'Hiányzó bélhang (néma has)'], conditions: ['Ileus', 'Peritonitis'], kw: 'bélhang auszkultáció ileus néma has' },
  { id: 'hasi_kopogtatas', sys: 'hasi', title: 'Kopogtatás', short: 'A has kopogtatása a tympania és a tompulat megítélésére.',
    observe: ['Diffúz tympania (levegő)', 'Tompulat (folyadék, terime)', 'Ascites jelei'], kw: 'has kopogtatás tympania tompulat ascites' },
  { id: 'hasi_tapintas', sys: 'hasi', title: 'Has tapintása', short: 'A has felületes majd mély tapintása érzékenység, defense és terime irányában.',
    purpose: 'A nyomásérzékenység, izomvédekezés és tapintható terimék felmérése.',
    prep: ['Beteg háton fekve, behajlított térddel', 'Meleg kéz, a fájdalmas régió utoljára'],
    steps: ['Felületes tapintás minden kvadránsban', 'Mély tapintás terimék irányában', 'Keresd a défense-t és a rebound érzékenységet (Blumberg)'],
    observe: ['Lokalizált nyomásérzékenység', 'Défense musculaire', 'Rebound (Blumberg)', 'Tapintható terime'],
    findings: ['Akut has', 'Peritonealis izgalom'], conditions: ['Appendicitis', 'Cholecystitis', 'Peritonitis'], kw: 'has tapintás défense rebound blumberg érzékenység' },
  { id: 'hasi_maj_lep', sys: 'hasi', title: 'Máj és lép tapintása', short: 'A máj alsó szélének és a lépnek a tapintása.',
    steps: ['Tapintsd a máj alsó szélét belégzésben, a jobb bordaív alatt', 'A lépet a bal bordaív alatt, jobb oldalfekvésben is'], observe: ['Hepatomegalia', 'Splenomegalia'], kw: 'máj lép hepatomegalia splenomegalia tapintás' },
  { id: 'hasi_ascites', sys: 'hasi', title: 'Ascites vizsgálata', short: 'A hasi folyadékgyülem jeleinek vizsgálata (tompulatvándorlás, hullámjel).',
    steps: ['Kopogtatással keresd az áthelyeződő tompulatot', 'Vizsgáld a hullámjelet (fluid wave)'], observe: ['Áthelyeződő tompulat', 'Pozitív hullámjel'], conditions: ['Májcirrhosis', 'Szívelégtelenség'], kw: 'ascites hasvíz tompulat hullámjel' },

  // ── NEUROLÓGIAI ────────────────────────────────────
  { id: 'neuro_tudat', sys: 'neuro', title: 'Tudatállapot', short: 'A tudatszint és az orientáció megítélése.',
    scoreIds: ['gcs', 'avpu'], kw: 'tudat gcs avpu orientáció eszmélet' },
  { id: 'neuro_pupillak', sys: 'neuro', title: 'Pupillák', short: 'A pupillák méretének, szimmetriájának és fényreakciójának vizsgálata.',
    equip: ['Zseblámpa'], steps: ['Értékeld a méretet és a szimmetriát', 'Vizsgáld a direkt és konszenzuális fényreakciót'], observe: ['Anisocoria', 'Tág/szűk pupilla', 'Renyhe/hiányzó fényreakció'], conditions: ['Stroke', 'Koponyaűri nyomásfokozódás'], kw: 'pupilla fényreakció anisocoria' },
  { id: 'neuro_arc', sys: 'neuro', title: 'Arc (n. facialis)', short: 'Az arc szimmetriájának és a mimikai izmok működésének vizsgálata.',
    steps: ['Kérd a beteget, hogy mosolyogjon, ráncolja a homlokát', 'Értékeld az arc szimmetriáját'], observe: ['Facialis paresis', 'Aszimmetria'], conditions: ['Stroke', 'Bell-paresis'], kw: 'arc facialis paresis szimmetria fast' },
  { id: 'neuro_motoros', sys: 'neuro', title: 'Motoros funkció / izomerő', short: 'Az izomerő, tónus és az oldalkülönbség vizsgálata.',
    steps: ['Vizsgáld az izomerőt (0-5 skála) végtagonként', 'Értékeld a tónust és az oldalkülönbséget', 'Kartartás-teszt (pronator drift)'], observe: ['Féloldali gyengeség', 'Kóros tónus'], conditions: ['Stroke'], kw: 'motoros izomerő pronator drift gyengeség' },
  { id: 'neuro_erzes', sys: 'neuro', title: 'Érzészavar', short: 'A felületes és mély érzés vizsgálata, oldalkülönbség keresése.',
    observe: ['Érzéskiesés', 'Oldalkülönbség', 'Zsibbadás'], kw: 'érzés szenzoros zsibbadás kiesés' },
  { id: 'neuro_reflexek', sys: 'neuro', title: 'Reflexek', short: 'A saját reflexek és a kóros reflexek (pl. Babinski) vizsgálata.',
    equip: ['Reflexkalapács'], steps: ['Váltsd ki a mélyreflexeket szimmetrikusan', 'Vizsgáld a talpi reflexet (Babinski)'], observe: ['Élénk/renyhe reflexek', 'Pozitív Babinski', 'Aszimmetria'], kw: 'reflex babinski mélyreflex kalapács' },
  { id: 'neuro_koordinacio', sys: 'neuro', title: 'Koordináció', short: 'A célzott mozgások és a kisagyi működés vizsgálata.',
    steps: ['Ujj-orr próba', 'Sarok-térd próba', 'Diadochokinezis'], observe: ['Ataxia', 'Dysmetria', 'Bizonytalanság'], kw: 'koordináció ujj-orr sarok-térd ataxia kisagy' },
  { id: 'neuro_jaras', sys: 'neuro', title: 'Járás', short: 'A járáskép megfigyelése a stabilitás és a mintázat szempontjából.',
    observe: ['Bizonytalan / ataxiás járás', 'Aszimmetria', 'Elesésveszély'], scoreIds: ['tug'], kw: 'járás gait ataxia stabilitás' },
  { id: 'neuro_fast', sys: 'neuro', title: 'FAST (stroke gyorsteszt)', short: 'Az akut stroke gyors felismerése: Face – Arm – Speech – Time.',
    purpose: 'Akut stroke gyors felismerése és az időablak rögzítése.',
    steps: ['Face – arc-aszimmetria (mosolytatás)', 'Arm – kartartás gyengesége', 'Speech – beszédzavar', 'Time – a tünetkezdet idejének rögzítése'],
    observe: ['Bármely pozitív jel → sürgős stroke-ellátás'], conditions: ['Stroke – akut ellátás'], scoreIds: ['fast', 'cincinnati'], kw: 'fast stroke arc kar beszéd idő' },

  // ── MOZGÁSSZERVI ───────────────────────────────────
  { id: 'mozgas_jaras', sys: 'mozgas', title: 'Járáskép', short: 'A járás megfigyelése a mozgásszervi funkció szempontjából.', scoreIds: ['tug'], kw: 'járás mozgás gait' },
  { id: 'mozgas_izuletek', sys: 'mozgas', title: 'Ízületek', short: 'Az ízületek duzzanatának, melegségének és mozgásterjedelmének vizsgálata.',
    observe: ['Duzzanat, meleg, vörös ízület', 'Korlátozott mozgásterjedelem'], kw: 'ízület duzzanat mozgásterjedelem arthritis' },
  { id: 'mozgas_gerinc', sys: 'mozgas', title: 'Gerinc', short: 'A gerinc tartásának, mozgékonyságának és érzékenységének vizsgálata.',
    observe: ['Deformitás', 'Mozgáskorlátozottság', 'Ütögetési érzékenység'], kw: 'gerinc tartás scoliosis érzékenység' },
  { id: 'mozgas_izomero', sys: 'mozgas', title: 'Izomerő', short: 'Az izomerő végtagonkénti vizsgálata (0-5 skála).',
    observe: ['Csökkent izomerő', 'Aszimmetria'], kw: 'izomerő mmt gyengeség' },

  // ── BŐR ÉS NYÁLKAHÁRTYÁK ───────────────────────────
  { id: 'bor_szin', sys: 'bor', title: 'Bőrszín', short: 'A bőr színének megítélése (sápadtság, cyanosis, icterus).',
    observe: ['Sápadtság', 'Cyanosis', 'Icterus'], kw: 'bőrszín sápadtság cyanosis icterus' },
  { id: 'bor_turgor', sys: 'bor', title: 'Turgor / hidráltság', short: 'A bőrturgor vizsgálata a hidráltság megítélésére.',
    observe: ['Csökkent turgor (dehidráció)'], kw: 'turgor hidráltság bőr dehidráció' },
  { id: 'bor_kiutes', sys: 'bor', title: 'Kiütések, elváltozások', short: 'A bőrelváltozások jellegének és eloszlásának megfigyelése.',
    observe: ['Exanthema', 'Petechia / purpura', 'Csalánkiütés'], kw: 'kiütés exanthema petechia bőrelváltozás' },
  { id: 'bor_sebek', sys: 'bor', title: 'Sebek, decubitus', short: 'Sebek, nyomási fekélyek felmérése és stádiumbecslése.',
    scoreIds: ['braden', 'norton'], observe: ['Decubitus', 'Krónikus seb'], kw: 'seb decubitus nyomási fekély braden' },
  { id: 'bor_nyalkahartya', sys: 'bor', title: 'Nyálkahártyák', short: 'A nyálkahártyák színe és nedvessége (anaemia, dehidráció).',
    observe: ['Sápadt kötőhártya', 'Száraz nyálkahártya'], kw: 'nyálkahártya kötőhártya sápadt száraz' },

  // ── ENDOKRIN ───────────────────────────────────────
  { id: 'endokrin_pajzsmirigy', sys: 'endokrin', title: 'Pajzsmirigy vizsgálata', short: 'A pajzsmirigy megtekintése és tapintása (méret, göb, érzékenység).',
    steps: ['Nézd meg a nyakat nyeléskor', 'Tapintsd a pajzsmirigyet hátulról'], observe: ['Struma', 'Göb', 'Érzékenység'], kw: 'pajzsmirigy struma göb thyreoidea' },
  { id: 'endokrin_altalanos', sys: 'endokrin', title: 'Endokrin általános jelek', short: 'Az endokrin eltérésekre utaló általános fizikális jelek.',
    observe: ['Bőr- és szőrzetváltozás', 'Testsúlyváltozás jelei', 'Tremor, verejtékezés'], kw: 'endokrin jelek tremor testsúly' },

  // ── UROGENITÁLIS ───────────────────────────────────
  { id: 'uro_vese', sys: 'uro', title: 'Vesetáji érzékenység', short: 'A vesetáji (costovertebralis) ütögetési érzékenység vizsgálata.',
    steps: ['Ütögesd a costovertebralis szöget mindkét oldalon', 'Értékeld az érzékenységet'], observe: ['Pozitív vesetáji érzékenység'], conditions: ['Pyelonephritis', 'Vesekő'], kw: 'vese costovertebralis érzékenység giordano' },
  { id: 'uro_holyag', sys: 'uro', title: 'Húgyhólyag', short: 'A telt húgyhólyag megítélése (globus) tapintással/kopogtatással.',
    observe: ['Telt hólyag (retenció)'], kw: 'húgyhólyag retenció globus' },
  { id: 'uro_altalanos', sys: 'uro', title: 'Általános urogenitális jelek', short: 'A vizelettel és a genitáliákkal kapcsolatos általános jelek áttekintése.',
    kw: 'urogenitális vizelet általános' },

  // ── PERIFÉRIÁS ÉR- ÉS NYIROKRENDSZER ──────────────
  { id: 'perif_pulzusok', sys: 'perif', title: 'Perifériás pulzusok', short: 'A perifériás artériás pulzusok tapintása és összehasonlítása.',
    steps: ['Tapintsd a radialis, femoralis, popliteális, dorsalis pedis pulzusokat', 'Hasonlítsd össze a két oldalt'], observe: ['Hiányzó / gyengült pulzus', 'Aszimmetria'], conditions: ['Perifériás érbetegség'], kw: 'perifériás pulzus dorsalis pedis femoralis' },
  { id: 'perif_capillary', sys: 'perif', title: 'Kapilláris újratelődés', short: 'A perifériás perfúzió gyors megítélése a köröm megnyomásával.',
    steps: ['Nyomd meg a körömágyat 5 mp-ig', 'Mérd a visszatelődés idejét (<2 mp normál)'], observe: ['Elhúzódó kapilláris újratelődés'], kw: 'kapilláris újratelődés perfúzió köröm' },
  { id: 'perif_venas', sys: 'perif', title: 'Vénás jelek', short: 'A vénás elégtelenség és a mélyvénás thrombosis jeleinek vizsgálata.',
    observe: ['Varicositas', 'Aszimmetrikus végtagduzzanat', 'Bőrelszíneződés'], conditions: ['Vénás elégtelenség', 'Mélyvénás thrombosis'], scoreIds: ['wellsdvt'], kw: 'vénás varicositas dvt duzzanat' },
  { id: 'perif_nyirok', sys: 'perif', title: 'Nyirokcsomók', short: 'A perifériás nyirokcsomók tapintása (nyak, hónalj, lágyék).',
    steps: ['Tapintsd a nyaki, supraclavicularis, hónalji és lágyéki régiókat', 'Értékeld a méretet, konzisztenciát, mozgathatóságot'], observe: ['Nagyobbodott nyirokcsomó', 'Kemény / fixált csomó'], kw: 'nyirokcsomó lymphadenopathia nyak hónalj lágyék' },
]

export function elementsBySystem(sysId: string): ExamElement[] {
  return EXAM_ELEMENTS.filter((e) => e.sys === sysId)
}
export function findElement(id: string): ExamElement | undefined {
  return EXAM_ELEMENTS.find((e) => e.id === id)
}
export function findSystem(id: string): ExamSystem | undefined {
  return EXAM_SYSTEMS.find((s) => s.id === id)
}
