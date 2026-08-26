// Központi klinikai témakör-rendszer (újrahasznosítható: mellkasi fájdalom, akut dyspnoe, stb.)
// A modulok tartalmai id/név alapján kapcsolódnak — a kapcsolat kétirányúan feloldható.
import { normName } from '@/lib/disease/resolve'

export interface TopicSource {
  name: string; org?: string; year?: string; identifier?: string; url?: string
  intl?: boolean; primary?: boolean; status?: string
  lastChecked?: string   // utolsó ellenőrzés (YYYY-MM-DD)
  reviewNext?: string    // következő felülvizsgálat esedékessége (YYYY-MM-DD)
}
export interface TopicRelated {
  examSystems?: string[]                    // EXAM_SYSTEMS id-k (Betegvizsgálat)
  examLinks?: { label: string; href: string }[]
  ekg?: string[]                            // ECG id-k
  labor?: string[]                          // LAB id-k
  scores?: string[]                         // TESTS id-k
  diseases?: string[]                       // Betegségtár kórképnevek
}
export interface Topic {
  slug: string; title: string; icon: string; subtitle: string
  orientation: string[]
  redFlags: string[]
  stability: string[]
  historyFeatures: string[]
  historySymptoms: string[]
  historyNote?: string
  ekgHeadline: string
  ekgNote: string[]
  laborHeadline: string
  laborKeyNote: string[]
  laborMore: string[]
  scoreNote: string
  ddx: { critical: string[]; cardiac: string[]; other: string[] }
  apnFocus: string[]
  apnWarning?: string
  escalation: string[]
  escalationNote?: string
  oxygen: string[]
  related: TopicRelated
  sources: TopicSource[]
  // Forráspolitika: elsődlegesen hazai szakmai irányelv; ennek hiányában a legfrissebb
  // európai/nemzetközi ajánlás. Ha nincs hazai forrás, ezt a mezőt ki kell tölteni.
  sourceNote?: string
  contentStatus?: string
  relatedTopics?: string[]
}

export const TOPICS: Topic[] = [
  {
    slug: 'mellkasi-fajdalom',
    title: 'Mellkasi fájdalom',
    icon: '💔',
    subtitle: 'Gyors klinikai orientáció akut mellkasi fájdalom esetén: első felismerés, vörös zászlók, elsődleges vizsgálatok, differenciáldiagnózis, kapcsolódó diagnosztika, APN-fókusz és eszkaláció.',
    orientation: [
      'Az akut mellkasi fájdalom nem diagnózis, hanem tünet, amely mögött többféle állapot állhat — köztük időkritikus, potenciálisan életveszélyes kórképek.',
      'A kezdeti értékelés célja: a klinikai stabilitás gyors megítélése, az akut koronária szindróma felismerése vagy kizárása, és az egyéb életveszélyes differenciáldiagnózisok korai felismerése.',
    ],
    redFlags: [
      'Elhúzódó vagy visszatérő akut mellkasi fájdalom',
      'Haemodinamikai instabilitás',
      'Hypotensio vagy shock jelei',
      'Jelentős ritmuszavar',
      'Akut szívelégtelenség vagy pulmonalis oedema jelei',
      'Syncope',
      'Tudatzavar',
      'Perzisztáló ST-eleváció vagy jelentős ischaemiás EKG-eltérés',
      'Akut aortaszindróma gyanúja',
      'Tüdőembólia gyanúja',
      'Feszülő pneumothorax gyanúja',
    ],
    stability: [
      'Tudatállapot', 'Légzés', 'Légzésszám', 'Szívfrekvencia', 'Vérnyomás',
      'Oxigénszaturáció', 'Perifériás perfúzió', 'Shock jelei', 'Akut szívelégtelenség jelei',
    ],
    historyFeatures: [
      'Kezdet', 'Időtartam', 'Intenzitás', 'Lokalizáció', 'Kisugárzás', 'Fájdalom jellege',
      'Terheléssel való kapcsolat', 'Légzéssel való kapcsolat', 'Testhelyzettel való kapcsolat', 'A panasz változása',
    ],
    historySymptoms: [
      'Dyspnoe', 'Epigastriális panasz', 'Karba sugárzó fájdalom', 'Nyak- vagy állkapocstáji fájdalom',
      'Verejtékezés', 'Hányinger', 'Hányás', 'Syncope', 'Palpitatio',
    ],
    historyNote: 'Akut koronária szindróma nem minden esetben klasszikus mellkasi fájdalommal jelentkezik. Dyspnoe, epigastriális panasz, illetve kar-, nyak- vagy állkapocstáji fájdalom is lehet figyelmeztető tünet.',
    ekgHeadline: '12 elvezetéses EKG mielőbb',
    ekgNote: [
      'Akut mellkasi panasz esetén az EKG első vonalbeli diagnosztikai eszköz.',
      'A klinikai állapot és az EKG eredménye együttesen értékelendő.',
      'Szükség esetén ismételt EKG-k készítése indokolt.',
    ],
    laborHeadline: 'hs-cTn — magas szenzitivitású troponin',
    laborKeyNote: [
      'Mielőbbi mintavétel.',
      'Az eredmény klinikai kontextusban értékelendő.',
      'Kérdéses esetekben sorozatos troponinmérés szükséges lehet.',
      'Ahol az intézményi protokoll alkalmazza, 0/1 vagy 0/2 órás algoritmus használható.',
    ],
    laborMore: ['Vérkép', 'Kreatinin / vesefunkció', 'Elektrolitok', 'Vércukor', 'Májfunkció', 'HbA1c', 'Lipidparaméterek'],
    scoreNote: 'GRACE Score — kardiovaszkuláris kockázat és prognózis strukturált becslésére használható pontrendszer (ACS mortalitási kockázat).',
    ddx: {
      critical: ['Akut koronária szindróma', 'Akut aortaszindróma / aortadissectio', 'Tüdőembólia', 'Feszülő pneumothorax'],
      cardiac: ['Akut szívelégtelenség', 'Pericarditis', 'Jelentős ritmuszavar', 'Takotsubo-szindróma', 'Jelentős billentyűbetegség'],
      other: ['Pneumonia', 'Pleuritis', 'Gastrooesophagealis eredet', 'Egyéb gastrointestinalis ok', 'Pancreatitis', 'Musculoskeletalis eredet', 'Trauma', 'Egyéb nem kardiális ok'],
    },
    apnFocus: [
      'Panasz pontos kezdete', 'Panasz jellemzői', 'Panasz dinamikája', 'Vitális paraméterek', 'Klinikai stabilitás',
      'Első EKG időpontja', 'Ismételt EKG-k', 'Kapcsolódó tünetek', 'Releváns kórelőzmény', 'Korábbi kardiológiai események',
      'Aktuális gyógyszerek', 'Vérzéses kockázatot befolyásoló információk', 'Ismert allergiák', 'Állapotváltozás dokumentálása',
    ],
    apnWarning: 'A normális vagy nem diagnosztikus első vizsgálati eredmény önmagában nem zárja ki a súlyos akut állapotot. A beteg klinikai állapota és annak változása ismételt értékelést igényel.',
    escalation: [
      'Haemodinamikai instabilitás', 'Shock jelei', 'Perzisztáló vagy jelentős ischaemiás EKG-eltérés',
      'Jelentős ritmuszavar', 'Akut szívelégtelenség jelei', 'Syncope vagy tudatzavar',
      'Akut koronária szindróma erős gyanúja', 'Más potenciálisan időkritikus mellkasi kórkép gyanúja',
    ],
    escalationNote: 'Az ellátás és eszkaláció a helyi intézményi protokollok, aktuális szakmai irányelvek és kompetenciahatárok figyelembevételével történjen. Ez az oldal klinikai orientációs és döntéstámogató tanulási eszköz — nem tartalmaz gyógyszerelési vagy terápiás algoritmust.',
    oxygen: [
      'Hypoxaemia esetén indokolt lehet.',
      'Normoxaemiás betegnél a rutin oxigénadás nem javasolt.',
    ],
    related: {
      examSystems: ['eletjelek', 'cardio', 'legzo'],
      examLinks: [{ label: 'Célzott anamnézis (vizsgálati munkamenet)', href: '/klinika/vizsgalat/munkamenet' }],
      ekg: ['stemi', 'nstemi', 'ischaemia', 'pe', 'pericarditis'],
      labor: ['trop', 'krea', 'k', 'gluk', 'ldl'],
      scores: ['grace', 'heart', 'timi'],
      diseases: ['Akut koronária szindróma', 'Tüdőembólia', 'Akut aortaszindróma', 'Pneumothorax'],
    },
    sources: [
      { name: 'Egészségügyi szakmai irányelv az akut koronária szindrómáról', org: 'Belügyminisztérium', year: '2025', identifier: '002272-2025', intl: false, primary: true, status: 'Publikálva', lastChecked: '2026-08-25', reviewNext: '2027-08-25' },
      { name: '2023 ESC Guidelines for the management of acute coronary syndromes', org: 'European Society of Cardiology', year: '2023', intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-25', reviewNext: '2027-08-25' },
    ],
    contentStatus: '⚪ Draft — szakmai ellenőrzés alatt',
    relatedTopics: ['akut-dyspnoe', 'eszmeletvesztes', 'akut-hasi-fajdalom'],
  },
  {
    slug: 'akut-dyspnoe',
    title: 'Akut dyspnoe',
    icon: '🌬️',
    subtitle: 'Gyors klinikai orientáció akut légszomj esetén: első felismerés, vörös zászlók, elsődleges vizsgálatok, differenciáldiagnózis, kapcsolódó diagnosztika, APN-fókusz és eszkaláció.',
    orientation: [
      'Az akut dyspnoe (légszomj) nem diagnózis, hanem szubjektív tünet, amely mögött többféle — köztük időkritikus, életveszélyes — kardiális, pulmonális és egyéb ok állhat.',
      'A kezdeti értékelés célja: a klinikai stabilitás és a légzési distressz gyors megítélése, az azonnali beavatkozást igénylő okok (pl. tüdőoedema, tüdőembólia, feszülő pneumothorax, súlyos bronchospasmus, anaphylaxia) korai felismerése.',
    ],
    redFlags: [
      'Súlyos légzési distressz, kimerülés, „néma tüdő"',
      'Csak szavankénti beszéd, segédizom-használat',
      'Tartósan alacsony vagy romló SpO₂, centrális cyanosis',
      'Haemodinamikai instabilitás, hypotensio vagy shock jelei',
      'Tudatzavar (hypoxia/hypercapnia jele)',
      'Akut szívelégtelenség / tüdőoedema jelei',
      'Egyoldali hiányzó légzési hang + instabilitás (feszülő pneumothorax gyanú)',
      'Stridor, arc-/nyelvduzzanat, csalánkiütés (anaphylaxia / felső légúti obstrukció)',
      'Tüdőembólia gyanúja (hirtelen dyspnoe, mellkasi fájdalom, aszimmetrikus lábduzzanat)',
      'Haemoptysis',
    ],
    stability: [
      'Tudatállapot', 'Légzés és légzésmintázat', 'Légzésszám', 'Légzési munka (segédizom, beszéd)',
      'Oxigénszaturáció', 'Szívfrekvencia', 'Vérnyomás', 'Perifériás perfúzió', 'Shock jelei',
    ],
    historyFeatures: [
      'Kezdet (hirtelen / fokozatos)', 'Időtartam', 'Súlyosság / terhelhetőség', 'Provokáló és enyhítő tényezők',
      'Testhelyzettel való kapcsolat (orthopnoe, PND)', 'Terheléssel való kapcsolat', 'A panasz dinamikája',
    ],
    historySymptoms: [
      'Mellkasi fájdalom', 'Palpitatio', 'Köhögés és köpet (szín, mennyiség)', 'Haemoptysis', 'Sípolás (wheezing)',
      'Láz', 'Aszimmetrikus lábduzzanat (DVT)', 'Csalánkiütés / angiooedema', 'Ortopnoe / éjszakai fulladás',
    ],
    historyNote: 'A dyspnoe gyakran több ok együttese (pl. szívelégtelenség + COPD). A hirtelen kezdet embóliára, pneumothoraxra vagy anaphylaxiára, a fokozatos romlás inkább infekcióra vagy dekompenzációra utalhat.',
    ekgHeadline: '12 elvezetéses EKG a kardiális ok és a ritmuszavar kizárásához',
    ekgNote: [
      'Akut dyspnoénál az EKG segít a kardiális ok (ischaemia, arrhythmia) és a jobbszív-terhelés (pl. tüdőembólia) megítélésében.',
      'A klinikai állapot és az EKG együttesen értékelendő.',
      'Instabilitás vagy változó kép esetén ismételt EKG indokolt.',
    ],
    laborHeadline: 'Vérgáz / SpO₂ + célzott laborok az ok szerint',
    laborKeyNote: [
      'SpO₂ minden betegnél; instabil/hypoxiás betegnél vérgáz (pH, oxigenáció, CO₂-retenció megítélése).',
      'Kardiális gyanúnál NT-proBNP/BNP és troponin; tüdőembólia gyanúnál D-dimer a klinikai valószínűség tükrében.',
      'Infekció gyanújánál CRP/fehérvérsejt; súlyos állapotban laktát.',
      'Az eredmények mindig a klinikai kontextusban értékelendők.',
    ],
    laborMore: ['Vérgáz (pH, pO₂, pCO₂)', 'NT-proBNP / BNP', 'Troponin', 'D-dimer', 'CRP / fehérvérsejt', 'Elektrolitok', 'Kreatinin / vesefunkció', 'Vérkép'],
    scoreNote: 'A klinikai súlyosság és a valószínű ok megítéléséhez: NEWS2 (romlás), CURB-65 (pneumonia), Wells/Genfi (tüdőembólia valószínűsége), qSOFA (szepszis).',
    ddx: {
      critical: ['Akut dekompenzált szívelégtelenség', 'Pulmonalis embolia', 'Pneumothorax', 'Akut asthma exacerbatio', 'Anaphylaxia'],
      cardiac: ['COPD exacerbatio', 'Pneumonia', 'Akut légzési elégtelenség', 'Akut coronaria szindróma', 'Pleuralis folyadékgyülem'],
      other: ['Metabolikus acidosis', 'Anaemia', 'Szorongás / hyperventilatio', 'Felső légúti fertőzések', 'Neuromuscularis ok'],
    },
    apnFocus: [
      'Panasz kezdete és dinamikája', 'Provokáló/enyhítő tényezők', 'Testhelyzet (orthopnoe, PND)', 'Vitális paraméterek',
      'SpO₂ és oxigénigény', 'Légzési munka és beszéd', 'Kapcsolódó tünetek', 'Releváns kórelőzmény (szív, tüdő)',
      'Aktuális gyógyszerek', 'Ismert allergiák', 'Első SpO₂/vérgáz időpontja', 'Állapotváltozás dokumentálása',
    ],
    apnWarning: 'A kezdeti normális SpO₂ vagy nem diagnosztikus lelet önmagában nem zárja ki a súlyos okot. A légzési munka, a beszédképesség és a klinikai állapot változása ismételt értékelést igényel.',
    escalation: [
      'Haemodinamikai instabilitás vagy shock jelei', 'Tartósan nem tartható vagy romló SpO₂',
      'Kimerülés, „néma tüdő", csökkenő légzési munka a distressz ellenére', 'Tudatzavar',
      'Anaphylaxia gyanúja', 'Feszülő pneumothorax gyanúja', 'Súlyos, terápiára nem reagáló bronchospasmus',
      'Más potenciálisan időkritikus ok erős gyanúja',
    ],
    escalationNote: 'Az ellátás és eszkaláció a helyi intézményi protokollok, aktuális szakmai irányelvek és kompetenciahatárok figyelembevételével történjen. Ez az oldal klinikai orientációs és döntéstámogató tanulási eszköz — nem tartalmaz gyógyszerelési vagy terápiás algoritmust.',
    oxygen: [
      'Az oxigént a cél-szaturációhoz kell titrálni, nem rutinszerűen maximumon adni.',
      'Általános cél jellemzően 94–98%; CO₂-retenció kockázatával élő betegnél (pl. COPD) jellemzően 88–92%.',
      'A túlzott oxigénadás COPD-ben ártalmas lehet — a célszaturáció betartása fontos.',
    ],
    related: {
      examSystems: ['legzo', 'eletjelek', 'cardio'],
      examLinks: [{ label: 'Célzott anamnézis (vizsgálati munkamenet)', href: '/klinika/vizsgalat/munkamenet' }],
      ekg: ['pe', 'afib', 'ischaemia', 'lbbb'],
      labor: ['bnp', 'ddimer', 'trop', 'crp', 'wbc', 'ph'],
      scores: ['news2', 'wellspe', 'geneva', 'curb65', 'qsofa'],
      diseases: ['Akut dekompenzált szívelégtelenség', 'Pulmonalis embolia', 'Pneumothorax', 'Akut asthma exacerbatio', 'COPD exacerbatio', 'Anaphylaxia', 'Pneumonia', 'Akut légzési elégtelenség'],
    },
    sources: [
      { name: 'Egészségügyi szakmai irányelv a krónikus szívelégtelenségről', org: 'Belügyminisztérium', year: '2026', identifier: '002271-2026', intl: false, primary: true, status: 'Publikálva', lastChecked: '2026-08-25', reviewNext: '2027-08-25' },
      { name: 'Egészségügyi szakmai irányelv a COPD diagnosztikájáról, kezeléséről és gondozásáról', org: 'Belügyminisztérium', year: '2024', identifier: '002230-2024', intl: false, primary: true, status: 'Publikálva', lastChecked: '2026-08-25', reviewNext: '2027-08-25' },
      { name: '2021 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure', org: 'European Society of Cardiology', year: '2021', intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-25', reviewNext: '2027-08-25' },
    ],
    contentStatus: '⚪ Draft — szakmai ellenőrzés alatt',
    relatedTopics: ['mellkasi-fajdalom', 'eszmeletvesztes', 'laz'],
  },
  {
    slug: 'akut-hasi-fajdalom',
    title: 'Akut hasi fájdalom',
    icon: '🩺',
    subtitle: 'Gyors klinikai orientáció akut hasi fájdalom esetén: első felismerés, vörös zászlók, elsődleges vizsgálatok, differenciáldiagnózis, kapcsolódó diagnosztika, APN-fókusz és eszkaláció.',
    orientation: [
      'Az akut hasi fájdalom tünet, nem diagnózis. Hátterében sebészeti, belgyógyászati, nőgyógyászati, urológiai és hasüregen kívüli okok egyaránt állhatnak.',
      'A kezdeti értékelés célja: a klinikai stabilitás megítélése, az azonnali sebészeti vagy érsebészeti beavatkozást igénylő kórképek korai felismerése, és a hasüregen kívüli, életveszélyes okok kizárása.',
      'A fájdalom lokalizációja orientál, de nem dönt — a kórfolyamat előrehaladtával a fájdalom jellege és helye is változhat.',
    ],
    redFlags: [
      'Haemodinamikai instabilitás, hypotensio vagy shock jelei',
      'Deszkakemény has, izomvédekezés, peritonealis izgalom jelei',
      'Hirtelen kezdetű, azonnal maximális intenzitású fájdalom',
      'Pulzáló hasi terime hátba sugárzó fájdalommal (aortaaneurysma-ruptura gyanúja)',
      'A tapintási lelethez képest aránytalanul erős fájdalom (mesenterialis ischaemia)',
      'Széklet- és szélrekedés, epés vagy bűzös hányás (ileus gyanúja)',
      'Aktív vérzés jelei: haematemesis, melaena, friss vér a székletben',
      'Láz, sárgaság és hasi fájdalom együttesen (cholangitis gyanúja)',
      'Terhesség lehetősége fogamzóképes korban (extrauterin graviditás)',
      'Idős, diabéteszes, immunszupprimált vagy szteroidot szedő beteg enyhének tűnő lelettel',
    ],
    stability: [
      'Tudatállapot', 'Vitális paraméterek', 'Légzésszám', 'Szívfrekvencia', 'Vérnyomás',
      'Testhőmérséklet', 'Perifériás perfúzió', 'Shock jelei', 'Hasfal állapota', 'Fájdalom intenzitása',
    ],
    historyFeatures: [
      'Kezdet (hirtelen / fokozatos)', 'Lokalizáció és kisugárzás', 'Jelleg (görcsös, állandó, égő)',
      'Időtartam és dinamika', 'Intenzitás', 'Provokáló és enyhítő tényezők (étkezés, testhelyzet, széklet)',
      'Korábbi hasonló epizód', 'Hasi műtét az előzményben',
    ],
    historySymptoms: [
      'Hányinger, hányás és annak jellege', 'Utolsó széklet- és szélürítés', 'Hasmenés vagy székrekedés',
      'Széklet színe (melaena, friss vér)', 'Láz, hidegrázás', 'Vizelési panasz, hematuria',
      'Sárgaság, sötét vizelet', 'Utolsó menstruáció', 'Étvágytalanság, fogyás',
    ],
    historyNote: 'A lokalizáció orientál, de nem dönt: a korai appendicitis jellemzően köldök körül jelentkezik, az epeúti fájdalom a jobb lapocka alá sugározhat, az inferior falat érintő szívinfarktus pedig felhasi panaszként is jelentkezhet. Idős, diabéteszes vagy immunszupprimált betegnél a klinikai kép jellemzően szegényesebb, mint a tényleges kórfolyamat súlyossága.',
    ekgHeadline: '12 elvezetéses EKG felhasi fájdalomnál — a kardiális eredet kizárására',
    ekgNote: [
      'Az inferior falat érintő szívinfarktus felhasi fájdalomként, hányingerrel és izzadással jelentkezhet.',
      'Felhasi panasznál, idős, diabéteszes vagy kardiális rizikójú betegnél az EKG elvégzése indokolt.',
      'Tartós hányás vagy ileus mellett kialakuló elektroliteltérés (különösen a kálium) az EKG-n is megjelenhet.',
    ],
    laborHeadline: 'Vérkép, gyulladásos markerek, máj- és pancreasenzimek, valamint terhességi teszt fogamzóképes korban',
    laborKeyNote: [
      'Alapvizsgálatként vérkép, CRP, kreatinin és elektrolitok; instabil vagy súlyos állapotban laktát és vérgáz.',
      'Felhasi vagy jobb bordaív alatti panasznál májenzimek, GGT, ALP és bilirubin, valamint amiláz vagy lipáz.',
      'Fogamzóképes korú nőnél terhességi teszt a további lépések előtt.',
      'Normálisnak tűnő hasi lelet mellett emelkedő laktát mesenterialis ischaemiára figyelmeztethet.',
      'A negatív labor nem zárja ki a sebészeti kórképet — a klinikai kép az elsődleges.',
    ],
    laborMore: ['Vérkép', 'CRP', 'Kreatinin / eGFR', 'Elektrolitok (Na, K)', 'ALT / AST / GGT / ALP', 'Bilirubin', 'Amiláz / lipáz', 'Laktát', 'Vérgáz', 'Vizelet üledék', 'Terhességi teszt (hCG)', 'Vércsoport és keresztpróba vérzés esetén'],
    scoreNote: 'A klinikai súlyosság és a romlás megítéléséhez NEWS2 és qSOFA; a fájdalom intenzitásának rögzítéséhez VAS vagy NRS. Az akut hasi kórképek többségéhez nincs önálló, általánosan validált triázs-score — a klinikai értékelés és az ismételt vizsgálat az elsődleges.',
    ddx: {
      critical: ['Hasüregi perforáció', 'Aortaaneurysma-ruptura', 'Mesenterialis ischaemia', 'Ileus / bélelzáródás', 'Ruptúrált extrauterin graviditás'],
      cardiac: ['Akut appendicitis', 'Akut cholecystitis / epekő-kolika', 'Akut pancreatitis', 'Diverticulitis', 'Peptikus fekély', 'Vesekő-kolika'],
      other: ['Pyelonephritis / húgyúti fertőzés', 'Gastroenteritis', 'Kismedencei gyulladás', 'Petefészek-ciszta torzió', 'Inferior szívinfarktus', 'Diabéteszes ketoacidózis', 'Herpes zoster', 'Alsó lebenyi pneumonia'],
    },
    apnFocus: [
      'Fájdalom kezdete, lokalizációja és kisugárzása', 'Fájdalom dinamikája és intenzitása skálán',
      'Vitális paraméterek és azok trendje', 'Hasfal állapota, peritonealis jelek',
      'Hányás jellege és mennyisége', 'Utolsó széklet- és szélürítés ideje',
      'Folyadékháztartás és diurézis', 'Étkezés vagy koplalás állapota (esetleges műtét miatt)',
      'Releváns kórelőzmény és korábbi hasi műtétek', 'Aktuális gyógyszerek (NSAID, antikoaguláns, szteroid)',
      'Ismert allergiák', 'Utolsó menstruáció fogamzóképes korban',
    ],
    apnWarning: 'A fájdalom hirtelen megszűnése nem feltétlenül javulás — perforáció után is előfordul, ezért az állapot nem ítélhető meg pusztán a fájdalom alapján. Idős, diabéteszes, immunszupprimált vagy szteroidot szedő betegnél a hasi lelet megtévesztően szegényes lehet, ezért az ismételt értékelés kiemelten fontos.',
    escalation: [
      'Haemodinamikai instabilitás vagy shock jelei',
      'Peritonealis izgalom, deszkakemény has',
      'Pulzáló hasi terime gyanúja',
      'A tapintási lelethez képest aránytalanul erős fájdalom',
      'Aktív gasztrointesztinális vérzés jelei',
      'Láz és sárgaság hasi fájdalommal',
      'Terhesség lehetősége hasi fájdalommal, különösen instabilitás mellett',
      'Tudatzavar vagy jelentős állapotromlás',
    ],
    escalationNote: 'Az ellátás és eszkaláció a helyi intézményi protokollok, aktuális szakmai irányelvek és kompetenciahatárok figyelembevételével történjen. Ez az oldal klinikai orientációs és döntéstámogató tanulási eszköz — nem tartalmaz gyógyszerelési vagy terápiás algoritmust.',
    oxygen: [
      'Hasi fájdalomnál az oxigén nem rutin beavatkozás; kizárólag hypoxia esetén, titrálva adandó.',
      'Általános cél jellemzően 94–98%; CO₂-retenció kockázatával élő betegnél jellemzően 88–92%.',
      'Shock vagy súlyos szepszis gyanújánál a magasabb áramlású oxigénadás a helyi protokoll szerint indokolt lehet.',
    ],
    related: {
      examSystems: ['hasi', 'eletjelek', 'uro'],
      examLinks: [{ label: 'Célzott anamnézis (vizsgálati munkamenet)', href: '/klinika/vizsgalat/munkamenet' }],
      ekg: ['ischaemia', 'stemi', 'hyperk', 'hypok'],
      labor: ['crp', 'wbc', 'lact', 'alt', 'ast', 'ggt', 'bili', 'krea', 'k', 'na', 'hb'],
      scores: ['news2', 'qsofa', 'vas', 'nrs'],
      diseases: ['Akut appendicitis', 'Akut cholecystitis', 'Akut pancreatitis', 'Ileus', 'Hasüregi perforáció', 'Mesenterialis ischaemia', 'Diverticulitis', 'Vesekő-kolika', 'Gastrointestinalis vérzés'],
    },
    sources: [
      { name: 'Diagnosis and treatment of acute appendicitis: 2020 update of the WSES Jerusalem guidelines', org: 'World Society of Emergency Surgery', year: '2020', intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26' },
      { name: '2020 WSES updated guidelines for the diagnosis and treatment of acute calculus cholecystitis', org: 'World Society of Emergency Surgery', year: '2020', intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26' },
      { name: 'Tokyo Guidelines 2018 (TG18) — akut cholangitis és cholecystitis diagnosztikája, súlyossági besorolása', org: 'Japanese Society of Hepato-Biliary-Pancreatic Surgery', year: '2018', intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26' },
    ],
    contentStatus: '⚪ Draft — szakmai ellenőrzés alatt',
    relatedTopics: ['mellkasi-fajdalom', 'laz'],
  },
  {
    slug: 'eszmeletvesztes',
    title: 'Eszméletvesztés',
    icon: '💫',
    subtitle: 'Gyors klinikai orientáció átmeneti eszméletvesztés esetén: a syncope elkülönítése, vörös zászlók, kockázatbecslés, differenciáldiagnózis, kapcsolódó diagnosztika, APN-fókusz és eszkaláció.',
    orientation: [
      'Az átmeneti eszméletvesztés gyűjtőfogalom. A syncope ennek az a formája, amelyet átmeneti agyi hipoperfúzió okoz, és amelyre a gyors kezdet, a rövid időtartam és a spontán, maradványtünet nélküli felépülés jellemző.',
      'A kezdeti értékelés célja három kérdés megválaszolása: valódi syncope történt-e, áll-e mögötte kardiális ok, és fennáll-e a rövid távú súlyos esemény kockázata.',
      'Az esetek jelentős része jóindulatú reflex eredetű, a kardiális syncope viszont kiemelt kockázatot hordoz — ezért az elkülönítés a legfontosabb feladat.',
    ],
    redFlags: [
      'Terhelés közben vagy fekvő helyzetben bekövetkező eszméletvesztés',
      'Előjel nélküli hirtelen összeesés, különösen sérüléssel járó eleséssel',
      'Palpitáció közvetlenül az eszméletvesztés előtt',
      'Új keletű mellkasi fájdalom vagy dyspnoe',
      'Ismert strukturális szívbetegség vagy szívelégtelenség',
      'Fiatalkori hirtelen szívhalál a családi anamnézisben',
      'Kóros EKG: ritmuszavar, ingervezetési zavar, ischaemiás jel, preexcitatio, megnyúlt QT',
      'Tartósan alacsony vérnyomás vagy bradycardia',
      'Vérzésre utaló jelek (melaena, anaemia, hasi fájdalom)',
      'Nem teljes vagy elhúzódó felépülés, tartós zavartság, góctünet',
    ],
    stability: [
      'Tudatállapot és GCS', 'Vitális paraméterek', 'Szívfrekvencia és ritmus',
      'Vérnyomás fekve és állva', 'Légzésszám', 'Oxigénszaturáció', 'Vércukor',
      'Neurológiai állapot', 'Sérülésre utaló jelek',
    ],
    historyFeatures: [
      'Az esemény körülményei (testhelyzet, tevékenység)', 'Előjelek megléte vagy hiánya',
      'Kiváltó tényező (fájdalom, hőség, tartós állás, vizelés, köhögés)', 'Az eszméletlenség időtartama',
      'A felépülés jellege és gyorsasága', 'Szemtanú leírása', 'Sérülés, harapásnyom, vizeletvesztés',
      'Korábbi hasonló epizódok',
    ],
    historySymptoms: [
      'Palpitáció', 'Mellkasi fájdalom', 'Dyspnoe', 'Hányinger, izzadás, sápadtság',
      'Látászavar vagy fülzúgás az esemény előtt', 'Fejfájás, góctünet',
      'Melaena, hányás, hasi fájdalom', 'Fáradtság, csökkent terhelhetőség',
    ],
    historyNote: 'A szemtanú beszámolója gyakran többet ér, mint bármely műszeres vizsgálat. A rángás önmagában nem zárja ki a syncopét, mert rövid myoclonus a hipoperfúzió alatt is előfordul; az elhúzódó, felépülés utáni zavartság viszont inkább epilepsziás roham mellett szól. Idős betegnél az ortosztatikus és a gyógyszer eredetű ok kiemelten gyakori.',
    ekgHeadline: '12 elvezetéses EKG minden eszméletvesztés után',
    ekgNote: [
      'Az EKG a kardiális syncope leggyorsabban elérhető szűrővizsgálata, ezért minden esetben elvégzendő.',
      'Keresendő: bradycardia, ingervezetési zavar, kamrai vagy supraventricularis ritmuszavar, ischaemiás jel, preexcitatio, megnyúlt QT, jobbszív-terhelés.',
      'A normális EKG nem zárja ki a kardiális okot, ha a klinikai kép aggasztó — ismételt vagy folyamatos ritmusmonitorozás mérlegelendő.',
    ],
    laborHeadline: 'Célzott laborok a feltételezett ok szerint — a vérvétel nem helyettesíti az anamnézist',
    laborKeyNote: [
      'Vércukor minden esetben; a hypoglykaemia gyorsan felismerhető és visszafordítható ok.',
      'Vérkép a vérzés és az anaemia kizárására, különösen melaena vagy hasi panasz mellett.',
      'Elektrolitok (nátrium, kálium, kalcium, magnézium) a ritmuszavarhoz vezető eltérések miatt.',
      'Kardiális gyanúnál troponin és NT-proBNP; tüdőembólia gyanújánál D-dimer a klinikai valószínűség tükrében.',
    ],
    laborMore: ['Vércukor', 'Vérkép (Hb, Htk)', 'Elektrolitok (Na, K, Ca, Mg)', 'Kreatinin / eGFR', 'Troponin', 'NT-proBNP', 'D-dimer', 'Vérgáz', 'Terhességi teszt fogamzóképes korban'],
    scoreNote: 'A tudatállapot rögzítéséhez GCS vagy AVPU, a klinikai romlás követéséhez NEWS2. Stroke gyanújánál FAST vagy Cincinnati, átmeneti ischaemiás roham után ABCD². Elesés esetén az ismétlődés kockázatához Morse-skála. A syncope rövid távú kockázatbecslése a kardiális előzmény, az EKG és a klinikai kép együttes megítélésén alapul.',
    ddx: {
      critical: ['Kamrai vagy supraventricularis ritmuszavar', 'Akut coronaria szindróma', 'Pulmonalis embolia', 'Aortadissectio', 'Vérzés / hypovolaemia'],
      cardiac: ['Aortastenosis és egyéb kiáramlási akadály', 'Bradyarrhythmia, AV-blokk', 'Szívelégtelenség', 'Pacemaker-diszfunkció', 'Carotis sinus szindróma'],
      other: ['Reflex (vasovagalis) syncope', 'Ortosztatikus hypotensio', 'Gyógyszer eredetű hypotensio', 'Epilepsziás roham', 'Hypoglykaemia', 'Pszichogén pseudosyncope', 'Anaemia'],
    },
    apnFocus: [
      'Az esemény körülményei és a szemtanú beszámolója', 'Előjelek megléte vagy hiánya',
      'Testhelyzet és tevékenység az esemény idején', 'Vitális paraméterek, fekvő és álló vérnyomás',
      'EKG mielőbbi elkészítése', 'Vércukor mérése', 'Sérülések felmérése (fej, gerinc)',
      'Neurológiai állapot és a felépülés dokumentálása',
      'Gyógyszerlista áttekintése (vérnyomáscsökkentő, diuretikum, QT-nyújtó szerek)',
      'Folyadékbevitel és közelmúltbeli betegség', 'Elesés- és ismétlődéskockázat felmérése',
      'Vezetési és munkavégzési vonatkozások jelzése',
    ],
    apnWarning: 'A jó általános állapot és a gyors felépülés nem zárja ki a kardiális okot. Terhelés alatti vagy fekve bekövetkező eszméletvesztés, illetve palpitációval induló epizód esetén a beteg akkor is fokozott kockázatú, ha a vizsgálat idejére tünetmentes.',
    escalation: [
      'Haemodinamikai instabilitás vagy tartós hypotensio',
      'Dokumentált vagy erősen gyanított jelentős ritmuszavar',
      'Terhelés közben bekövetkezett eszméletvesztés',
      'Új keletű mellkasi fájdalom vagy dyspnoe',
      'Kóros EKG',
      'Vérzésre utaló jelek',
      'Tartós tudatzavar vagy góctünet',
      'Jelentős sérülés az elesés következtében',
    ],
    escalationNote: 'Az ellátás és eszkaláció a helyi intézményi protokollok, aktuális szakmai irányelvek és kompetenciahatárok figyelembevételével történjen. Ez az oldal klinikai orientációs és döntéstámogató tanulási eszköz — nem tartalmaz gyógyszerelési vagy terápiás algoritmust.',
    oxygen: [
      'Eszméletvesztés után az oxigén nem rutin beavatkozás; kizárólag hypoxia esetén, titrálva adandó.',
      'Általános cél jellemzően 94–98%; CO₂-retenció kockázatával élő betegnél jellemzően 88–92%.',
      'Reflex syncopénál a fektetés és a lábak megemelése gyorsabban segít, mint az oxigénadás.',
    ],
    related: {
      examSystems: ['eletjelek', 'cardio', 'neuro'],
      examLinks: [{ label: 'Célzott anamnézis (vizsgálati munkamenet)', href: '/klinika/vizsgalat/munkamenet' }],
      ekg: ['brady', 'av2b', 'av3', 'vt', 'svt', 'afib', 'ischaemia', 'pe'],
      labor: ['gluk', 'hb', 'htk', 'na', 'k', 'ca', 'mg', 'trop', 'bnp', 'ddimer'],
      scores: ['gcs', 'avpu', 'news2', 'fast', 'cincinnati', 'abcd2', 'morse'],
      diseases: ['Kardiális arrhythmia', 'Akut coronaria szindróma', 'Pulmonalis embolia', 'Ortosztatikus hypotensio', 'Vasovagalis syncope', 'Aortastenosis', 'Epilepszia', 'Hypoglykaemia'],
    },
    sources: [
      { name: '2018 ESC Guidelines for the diagnosis and management of syncope', org: 'European Society of Cardiology', year: '2018', intl: true, primary: true, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26' },
      { name: 'Egészségügyi szakmai irányelv az akut koronária szindrómáról', org: 'Belügyminisztérium', year: '2025', identifier: '002272-2025', intl: false, primary: true, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26' },
      { name: '2023 ESC Guidelines for the management of acute coronary syndromes', org: 'European Society of Cardiology', year: '2023', intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26' },
    ],
    contentStatus: '⚪ Draft — szakmai ellenőrzés alatt',
    relatedTopics: ['mellkasi-fajdalom', 'akut-dyspnoe'],
  },
  {
    slug: 'laz',
    title: 'Láz',
    icon: '🌡️',
    subtitle: 'Gyors klinikai orientáció lázas beteg esetén: a szepszis korai felismerése, vörös zászlók, góckeresés, differenciáldiagnózis, kapcsolódó diagnosztika, APN-fókusz és eszkaláció.',
    orientation: [
      'A láz tünet, nem diagnózis. A legfontosabb kérdés nem a hőmérséklet nagysága, hanem az, hogy a beteg állapota utal-e szervi elégtelenségre.',
      'A kezdeti értékelés célja: a szepszis és a szeptikus sokk korai felismerése, a fertőzési góc célzott keresése, valamint a nem fertőzéses eredetű láz és a fokozott kockázatú betegcsoportok azonosítása.',
      'Idős, immunszupprimált vagy neutropeniás betegnél a láz hiánya sem zárja ki a súlyos fertőzést — a hypothermia szintén a szepszis jele lehet.',
    ],
    redFlags: [
      'Haemodinamikai instabilitás, hypotensio, szeptikus sokk jelei',
      'Új keletű tudatzavar, zavartság vagy aluszékonyság',
      'Emelkedő légzésszám, hypoxia',
      'Nem halványodó (petechiás) bőrkiütés — meningococcaemia gyanúja',
      'Tarkókötöttség, fényérzékenység, erős fejfájás',
      'Neutropenia vagy folyamatban lévő daganatellenes kezelés',
      'Immunszuppresszió, aszplénia, transzplantáció az előzményben',
      'Friss műtét vagy behelyezett invazív eszköz (kanül, katéter, drén, protézis)',
      'Közelmúltbeli trópusi utazás (malária lehetősége)',
      'Oliguria, csökkenő diurézis',
      'Emelkedő laktát',
    ],
    stability: [
      'Tudatállapot', 'Légzésszám', 'Oxigénszaturáció', 'Szívfrekvencia', 'Vérnyomás',
      'Testhőmérséklet', 'Kapilláris újratelődés és bőrszín', 'Diurézis', 'NEWS2 összpontszám',
    ],
    historyFeatures: [
      'Kezdet és időtartam', 'A láz lefutása (folyamatos, hullámzó, visszatérő)',
      'Legmagasabb mért érték és a mérés módja', 'Hidegrázás',
      'Lázcsillapítóra adott válasz', 'Korábbi hasonló epizód',
      'Aktuális vagy közelmúltbeli antibiotikum-kezelés',
    ],
    historySymptoms: [
      'Köhögés, köpet, mellkasi fájdalom, dyspnoe', 'Dysuria, gyakori vizelés, deréktáji fájdalom',
      'Hasi fájdalom, hasmenés, hányás', 'Fejfájás, tarkótáji panasz',
      'Bőrpír, seb, fájdalmas duzzanat', 'Ízületi fájdalom és duzzanat',
      'Torokfájás, fülfájás', 'Bőrkiütés', 'Fogyás, éjszakai izzadás',
    ],
    historyNote: 'A gócot célzottan kell keresni: légúti, húgyúti, hasi, bőr- és lágyrész-, központi idegrendszeri, illetve eszközzel összefüggő fertőzés. Az utazási, oltási, állatkontakt- és gyógyszer-anamnézis — különösen az immunszupresszív kezelés — éppolyan fontos, mint a fizikális lelet. A lázcsillapítóra bekövetkező hőmérséklet-csökkenés nem zárja ki a súlyos fertőzést, és nem alkalmas a kockázat megítélésére.',
    ekgHeadline: 'EKG a kísérő ritmuszavar és a kardiális érintettség megítélésére',
    ekgNote: [
      'A láz és a szepszis jellemzően sinus tachycardiával jár; új keletű ritmuszavar (például pitvarfibrilláció) a szeptikus terhelés jele lehet.',
      'Infektív endocarditis gyanújánál az új ingervezetési zavar figyelmeztető jel.',
      'Elektroliteltérés és egyes gyógyszerek megnyújthatják a QT-időt — lázas, dehidrált betegnél ez fokozott figyelmet érdemel.',
    ],
    laborHeadline: 'Gyulladásos markerek, szervfunkciók és célzott mikrobiológiai mintavétel — hemokultúra az antibiotikum előtt',
    laborKeyNote: [
      'Vérkép fehérvérsejt-számmal (a neutropenia felismerése kulcsfontosságú), CRP, szükség szerint prokalcitonin.',
      'Laktát a szöveti hipoperfúzió megítélésére; az emelkedett érték a súlyosság jelzője, az ismételt mérés a terápiaválaszt mutatja.',
      'Vesefunkció, elektrolitok, májenzimek és bilirubin a szervi érintettség felméréséhez; alvadási paraméterek DIC gyanújánál.',
      'Hemokultúra lehetőleg az antibiotikum megkezdése ELŐTT, aszeptikusan, két palackpárban — mellette a gyanított góc szerinti mintavétel (vizelet, köpet, sebváladék, liquor).',
      'A mintavétel súlyos állapotú betegnél nem késleltetheti indokolatlanul az ellátást.',
    ],
    laborMore: ['Vérkép és kvalitatív vérkép', 'CRP', 'Prokalcitonin', 'Laktát', 'Vérgáz', 'Kreatinin / eGFR', 'Elektrolitok', 'Májenzimek, bilirubin', 'Alvadás (INR, fibrinogén, D-dimer)', 'Hemokultúra', 'Vizelet üledék és tenyésztés', 'Köpet, sebváladék, liquor a góc szerint', 'Malária-vizsgálat trópusi utazás után'],
    scoreNote: 'A romlás és a szepszis-kockázat megítéléséhez NEWS2 — a NICE 2024-es frissítése óta felnőttben ez a javasolt eszköz. Gyors ágy melletti szűrésre qSOFA, intenzív osztályon SOFA. Pneumonia gyanújánál CURB-65, torokfájásnál Centor. Tudatállapothoz GCS vagy AVPU, delírium gyanújánál CAM-ICU.',
    ddx: {
      critical: ['Szepszis és szeptikus sokk', 'Meningitis, meningococcaemia', 'Neutropeniás láz', 'Infektív endocarditis', 'Nekrotizáló lágyrész-fertőzés'],
      cardiac: ['Pneumonia', 'Húgyúti fertőzés, pyelonephritis', 'Hasi fertőzés (cholangitis, diverticulitis)', 'Bőr- és lágyrész-fertőzés', 'Eszközzel összefüggő fertőzés (kanül, katéter)', 'Felső légúti és vírusfertőzések'],
      other: ['Malária és egyéb importált fertőzés', 'Gyógyszerláz', 'Vénás thromboembolia', 'Autoimmun betegség fellángolása', 'Daganatos láz', 'Thyreotoxikus krízis', 'Hőguta'],
    },
    apnFocus: [
      'Vitális paraméterek és NEWS2 rendszeres, dokumentált mérése',
      'A tudatállapot változásának figyelése',
      'Bőr átvizsgálása kiütésre, sebre, nyomási sérülésre',
      'Minden behelyezett eszköz ellenőrzése (kanül, katéter, drén)',
      'Hemokultúra és célzott mintavétel előkészítése az antibiotikum előtt',
      'Folyadékbevitel és diurézis pontos rögzítése',
      'Az antibiotikum beadási idejének dokumentálása',
      'Utazási, oltási és állatkontakt-anamnézis',
      'Immunszuppresszív kezelés, daganatellenes terápia tisztázása',
      'Izolációs szempontok mérlegelése',
      'A lázcsillapítás hatásának és a beteg közérzetének követése',
      'Hozzátartozó tájékoztatása a romlás jeleiről',
    ],
    apnWarning: 'A láz mértéke nem arányos a súlyossággal. Idős, immunszupprimált vagy neutropeniás betegnél a hőemelkedés hiánya, sőt a hypothermia is súlyos fertőzést jelezhet, és a klinikai kép megtévesztően szegényes lehet. A lázcsillapítás javíthatja a közérzetet, de nem befolyásolja a szepszis lefolyását, és nem használható a kockázat megítélésére. Neutropeniás betegnél a láz sürgősségi helyzet.',
    escalation: [
      'Szeptikus sokk vagy tartós hypotensio jelei',
      'Emelkedő NEWS2 vagy gyorsan romló vitális paraméterek',
      'Új keletű tudatzavar',
      'Emelkedő laktát vagy csökkenő diurézis',
      'Neutropeniás láz',
      'Nem halványodó bőrkiütés vagy meningitis gyanúja',
      'Nekrotizáló lágyrész-fertőzés gyanúja (aránytalanul erős fájdalom, gyors terjedés)',
      'Trópusi utazás utáni, tisztázatlan okú láz',
    ],
    escalationNote: 'Az ellátás és eszkaláció a helyi intézményi protokollok, aktuális szakmai irányelvek és kompetenciahatárok figyelembevételével történjen. Ez az oldal klinikai orientációs és döntéstámogató tanulási eszköz — nem tartalmaz gyógyszerelési vagy terápiás algoritmust.',
    oxygen: [
      'Lázas betegnél az oxigén nem rutin beavatkozás; kizárólag hypoxia esetén, titrálva adandó.',
      'Általános cél jellemzően 94–98%; CO₂-retenció kockázatával élő betegnél jellemzően 88–92%.',
      'Szepszis vagy szeptikus sokk gyanújánál a magasabb áramlású oxigénadás a helyi protokoll szerint indokolt lehet, a célszaturáció folyamatos ellenőrzésével.',
    ],
    related: {
      examSystems: ['eletjelek', 'altalanos', 'bor', 'legzo', 'uro'],
      examLinks: [{ label: 'Célzott anamnézis (vizsgálati munkamenet)', href: '/klinika/vizsgalat/munkamenet' }],
      ekg: ['tachy', 'afib', 'av1'],
      labor: ['crp', 'pct', 'wbc', 'lact', 'bcult', 'krea', 'na', 'k', 'bili', 'alt', 'plt', 'fib', 'ddimer', 'used', 'hb'],
      scores: ['news2', 'qsofa', 'sofa', 'curb65', 'centor', 'gcs', 'avpu', 'camicu'],
      diseases: ['Szepszis', 'Pneumonia', 'Húgyúti fertőzés', 'Meningitis', 'Neutropenia', 'Infektív endocarditis', 'Cellulitis'],
    },
    sources: [
      { name: 'Suspected sepsis in people aged 16 or over: recognition, diagnosis and early management (NG253)', org: 'National Institute for Health and Care Excellence', year: '2025', identifier: 'NG253', intl: true, primary: true, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26' },
      { name: 'Suspected sepsis in under 16s: recognition, diagnosis and early management (NG254)', org: 'National Institute for Health and Care Excellence', year: '2025', identifier: 'NG254', intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26' },
      { name: 'Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock', org: 'Society of Critical Care Medicine / ESICM', year: '2021', intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26' },
    ],
    sourceNote: 'A platform alapelve szerint elsődlegesen hazai szakmai irányelvre hivatkozunk. A lázas beteg ellátásáról és a szepszisről az ellenőrzés időpontjában nem volt azonosítható önálló, érvényes hazai egészségügyi szakmai irányelv, ezért a források a legfrissebb nemzetközi ajánlások. A NICE 2025 novemberében három külön irányelvre bontotta a korábbi NG51-et (NG253, NG254, NG255) — a korábbi verzióra hivatkozó anyagok felülvizsgálandók. Hazai irányelv megjelenése esetén a forrásjegyzék frissítendő.',
    contentStatus: '⚪ Draft — szakmai ellenőrzés alatt',
    relatedTopics: ['akut-dyspnoe', 'akut-hasi-fajdalom'],
  },
]

const nn = (s: string) => normName(s)

export function findTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug)
}
export function topicForAcuteName(name: string): Topic | undefined {
  const n = nn(name)
  return TOPICS.find((t) => nn(t.title) === n)
}
// Fordított kapcsolat: mely témakörökhöz tartozik egy adott modul-tartalom
export function topicsForContent(kind: 'ekg' | 'labor' | 'scores' | 'examSystems', id: string): Topic[] {
  return TOPICS.filter((t) => (t.related[kind] ?? []).includes(id))
}
export function topicsForDisease(name: string): Topic[] {
  const n = nn(name)
  return TOPICS.filter((t) => (t.related.diseases ?? []).some((d) => nn(d) === n || nn(d).includes(n) || n.includes(nn(d))))
}
