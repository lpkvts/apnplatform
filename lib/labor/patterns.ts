import { LAB } from './data'
import { interpret, type LabStatus } from './engine'

export type Dir = 'low' | 'high' | 'normal' | 'unknown'

export function collapse(s: LabStatus): Dir {
  if (s === 'low' || s === 'crit-low') return 'low'
  if (s === 'high' || s === 'crit-high') return 'high'
  if (s === 'normal') return 'normal'
  return 'unknown'
}

// Gyors panelek: laborérték-azonosítók csoportjai
export const PANELS: { name: string; ids: string[] }[] = [
  { name: 'Vérkép', ids: ['hb', 'wbc', 'plt', 'mcv'] },
  { name: 'Vaspanel', ids: ['hb', 'mcv', 'ferr', 'tsat'] },
  { name: 'Vesefunkció', ids: ['krea', 'urea', 'egfr', 'na', 'k'] },
  { name: 'Májfunkció', ids: ['alt', 'ast', 'ggt', 'bili'] },
  { name: 'Gyulladás', ids: ['crp', 'wbc', 'pct', 'esr'] },
  { name: 'Ionok', ids: ['na', 'k', 'ca'] },
  { name: 'Anyagcsere', ids: ['gluk', 'hba1c'] },
  { name: 'Szívmarkerek', ids: ['trop', 'bnp'] },
  { name: 'Alvadás', ids: ['inr', 'ddimer', 'fib', 'plt'] },
]

export interface Pattern {
  id: string
  name: string
  sev: 'info' | 'figyelendő' | 'sürgős'
  test: (d: Record<string, Dir>) => boolean
  summary: string          // Összkép / lehetséges összefüggés
  apnFocus: string[]       // APN fókuszpontok
  further: string[]        // további megfontolható vizsgálatok
  consult: string          // mikor szükséges orvosi konzultáció
  guidelineKw?: string[]   // Tudástár-kapcsolat kulcsszavai
  scoreIds?: string[]      // kapcsolódó Score Hub tesztek
}

const lo = (d: Record<string, Dir>, id: string) => d[id] === 'low'
const hi = (d: Record<string, Dir>, id: string) => d[id] === 'high'

export const PATTERNS: Pattern[] = [
  {
    id: 'iron_anaemia', name: 'Vashiányos anaemia mintázata', sev: 'figyelendő',
    test: (d) => lo(d, 'hb') && lo(d, 'mcv') && (d.ferr === 'low' || d.ferr === undefined),
    summary: 'Alacsony Hb + alacsony MCV (mikrocitás anaemia), alacsony ferritinnel megerősítve a vashiánnyal összeegyeztethető mintázat.',
    apnFocus: ['Vérzésforrás keresése (GI, nőgyógyászati)', 'Vitális paraméterek, terhelhetőség', 'Táplálkozási anamnézis'],
    further: ['Ferritin, transzferrin-szaturáció', 'Retikulocita', 'Széklet vér (okkult)'],
    consult: 'Súlyos anaemia (Hb erősen alacsony), aktív vérzés vagy hemodinamikai instabilitás esetén.',
    guidelineKw: ['anaemia', 'vashiany', 'vashiány'],
  },
  {
    id: 'megaloblastic', name: 'Megaloblasztos anaemia mintázata', sev: 'figyelendő',
    test: (d) => lo(d, 'hb') && hi(d, 'mcv'),
    summary: 'Alacsony Hb + magas MCV (makrocitás anaemia) — B12- vagy folsavhiánnyal, alkohollal, hypothyreosissal összeegyeztethető.',
    apnFocus: ['Neurológiai tünetek (B12!)', 'Táplálkozás, alkohol', 'Gyógyszerek (metformin, PPI)'],
    further: ['B12, folsav', 'TSH', 'Retikulocita'],
    consult: 'Neurológiai tünetek vagy súlyos anaemia esetén.',
    guidelineKw: ['anaemia'],
  },
  {
    id: 'bacterial', name: 'Bakteriális infekció / gyulladás', sev: 'figyelendő',
    test: (d) => hi(d, 'crp') && (hi(d, 'wbc') || hi(d, 'pct')),
    summary: 'Emelkedett CRP magas fehérvérsejtszámmal/PCT-vel — akut bakteriális infekció valószínű.',
    apnFocus: ['Fertőzési góc keresése', 'Vitális paraméterek, láz', 'Terápia-válasz követése'],
    further: ['PCT, hemokultúra (láz esetén)', 'Vizelet, mellkasröntgen a góc szerint'],
    consult: 'Szepszis-jelek (qSOFA ≥2), instabil vitális paraméterek esetén sürgősen.',
    guidelineKw: ['pneumonia', 'fertoz', 'copd'], scoreIds: ['qsofa', 'news2', 'curb65'],
  },
  {
    id: 'sepsis', name: 'Szepszis / szöveti hipoperfúzió gyanúja', sev: 'sürgős',
    test: (d) => (hi(d, 'crp') || hi(d, 'pct')) && hi(d, 'lact'),
    summary: 'Gyulladásos markerek emelkedése emelkedett laktáttal — szöveti hipoperfúzió/szepszis lehetősége.',
    apnFocus: ['Szepszis-protokoll (rendelés szerint)', 'Vitális paraméterek szoros követése', 'Perfúzió, diurézis'],
    further: ['Ismételt laktát (clearance)', 'Hemokultúra, vérgáz'],
    consult: 'Azonnal — sürgős orvosi értékelés és szepszis-ellátás.',
    guidelineKw: ['fertoz'], scoreIds: ['qsofa', 'news2'],
  },
  {
    id: 'aki', name: 'Vesekárosodás mintázata', sev: 'figyelendő',
    test: (d) => hi(d, 'krea') && (hi(d, 'urea') || lo(d, 'egfr')),
    summary: 'Emelkedett kreatinin/karbamid, csökkent eGFR — akut vagy krónikus vesekárosodással összeegyeztethető.',
    apnFocus: ['Folyadékstátusz, diurézis', 'Nefrotoxikus szerek felülvizsgálata', 'Gyógyszerdózis vesefunkcióhoz'],
    further: ['Ionok (K!), vérgáz', 'Vizelet, hidráltság értékelése'],
    consult: 'Gyorsan emelkedő kreatinin, oliguria vagy hyperkalaemia esetén sürgősen.',
  },
  {
    id: 'hyperk', name: 'Hyperkalaemia', sev: 'sürgős',
    test: (d) => hi(d, 'k'),
    summary: 'Emelkedett szérumkálium — életveszélyes szívritmuszavar kockázata, különösen gyors emelkedésnél.',
    apnFocus: ['Azonnali 12 elvezetéses EKG', 'Szívmonitor', 'Kálium-források, gyógyszerek áttekintése'],
    further: ['Vesefunkció, vérgáz', 'EKG-eltérések (csúcsos T)'],
    consult: 'Azonnal — orvosi értékelés és kezelés, EKG-eltérésnél sürgősség.',
  },
  {
    id: 'hypona', name: 'Hyponatraemia', sev: 'figyelendő',
    test: (d) => lo(d, 'na'),
    summary: 'Alacsony nátrium — folyadék-/ozmoláris zavar; súlyos vagy gyorsan kialakuló esetben neurológiai tünetek.',
    apnFocus: ['Neurológiai állapot, tudat', 'Folyadékbevitel/-státusz', 'LASSÚ korrekció (gyors → veszélyes!)'],
    further: ['Ozmolalitás, vizelet-nátrium', 'Vesefunkció'],
    consult: 'Nagyon alacsony Na, görcs vagy tudatzavar esetén sürgősen.',
  },
  {
    id: 'hyperglyc', name: 'Hyperglykaemia (DKA-ra figyelj)', sev: 'figyelendő',
    test: (d) => hi(d, 'gluk'),
    summary: 'Magas vércukor — kontrollálatlan diabétesz; nagyon magas érték + keton diabéteszes ketoacidózisra utalhat.',
    apnFocus: ['Vizelet/vér keton ellenőrzése', 'Folyadékstátusz, tudat', 'Vitális paraméterek'],
    further: ['Vérgáz (pH, HCO₃)', 'HbA1c, ionok'],
    consult: 'Nagyon magas vércukor + keton/acidózis (DKA-gyanú) esetén sürgősen.',
  },
  {
    id: 'cholestasis', name: 'Kolesztázis mintázata', sev: 'figyelendő',
    test: (d) => hi(d, 'ggt') && hi(d, 'bili'),
    summary: 'Emelkedett GGT + bilirubin — epeúti (kolesztatikus) érintettséggel összeegyeztethető.',
    apnFocus: ['Sárgaság, viszketés, széklet/vizelet szín', 'Fájdalom, láz (cholangitis!)', 'Alkohol/gyógyszer anamnézis'],
    further: ['ALP, direkt/indirekt bilirubin', 'Hasi képalkotás (UH)'],
    consult: 'Láz + sárgaság + fájdalom (cholangitis gyanú) esetén sürgősen.',
  },
  {
    id: 'hepatocell', name: 'Hepatocelluláris károsodás', sev: 'figyelendő',
    test: (d) => hi(d, 'alt') && hi(d, 'ast'),
    summary: 'Emelkedett ALT/AST — májsejt-károsodás (hepatitisz, toxikus, alkohol) mintázata.',
    apnFocus: ['Gyógyszer-hepatotoxicitás felülvizsgálata', 'Alkohol anamnézis', 'Sárgaság, tünetek'],
    further: ['GGT, ALP, bilirubin', 'Vírusszerológia (klinikai kép szerint)'],
    consult: 'Nagyon magas transzaminázok vagy alvadászavar/encephalopathia esetén sürgősen.',
  },
  {
    id: 'acs', name: 'Troponin-emelkedés — ACS gyanú', sev: 'sürgős',
    test: (d) => hi(d, 'trop'),
    summary: 'Emelkedett troponin — akut koronária szindróma lehetősége; a dinamika és a klinikai kép dönt.',
    apnFocus: ['Azonnali 12 elvezetéses EKG', 'Sorozat-troponin (0/1–3 óra)', 'Fájdalom, vitális paraméterek'],
    further: ['Sorozat-EKG', 'NT-proBNP a kontextus szerint'],
    consult: 'Azonnal — sürgős kardiológiai értékelés mellkasi panasz esetén.',
    guidelineKw: ['sziv', 'szív', 'kardio'], scoreIds: ['heart', 'timi'],
  },
  {
    id: 'hf', name: 'NT-proBNP emelkedés — szívelégtelenség', sev: 'figyelendő',
    test: (d) => hi(d, 'bnp'),
    summary: 'Emelkedett NT-proBNP dyspnoéval — szívelégtelenség valószínű; a klinikai kép megerősítendő.',
    apnFocus: ['Folyadékstátusz, testsúly', 'Nehézlégzés, ödéma', 'Vesefunkció'],
    further: ['EKG, mellkasröntgen', 'Troponin a kontextus szerint'],
    consult: 'Súlyos nehézlégzés vagy hemodinamikai instabilitás esetén sürgősen.',
    guidelineKw: ['szivelegtelen', 'szív'],
  },
  {
    id: 'vte', name: 'D-dimer emelkedés', sev: 'figyelendő',
    test: (d) => hi(d, 'ddimer'),
    summary: 'Emelkedett D-dimer — nem specifikus; thromboembolia (MVT/PE) a klinikai valószínűség alapján mérlegelendő.',
    apnFocus: ['Klinikai valószínűség (Wells)', 'Végtag/légzési tünetek, SpO₂', 'Pozitív esetben képalkotás előkészítése'],
    further: ['Wells-score', 'Kompressziós UH / CT-angiográfia (orvosi döntés)'],
    consult: 'Magas klinikai gyanú vagy instabilitás/hypoxia esetén sürgősen.',
    scoreIds: ['wellspe', 'wellsdvt'],
  },
  {
    id: 'hypothyr', name: 'Hypothyreosis mintázata', sev: 'info',
    test: (d) => hi(d, 'tsh'),
    summary: 'Emelkedett TSH — pajzsmirigy-alulműködés lehetősége; fT4-gyel pontosítható.',
    apnFocus: ['Tünetek (fáradtság, hízás, hidegintolerancia)', 'Levotiroxin-adherencia', 'Dózis-titrálás követése'],
    further: ['fT4', 'anti-TPO (klinikai kép szerint)'],
    consult: 'Súlyos tünetek vagy myxoedema-gyanú esetén.',
  },
  {
    id: 'hyperthyr', name: 'Hyperthyreosis mintázata', sev: 'figyelendő',
    test: (d) => lo(d, 'tsh'),
    summary: 'Alacsony TSH — pajzsmirigy-túlműködés lehetősége (fT4/fT3 pontosítja).',
    apnFocus: ['Szívfrekvencia (AF!), fogyás, hőintolerancia', 'Vitális paraméterek', 'Tünetek követése'],
    further: ['fT4, fT3', 'EKG (pitvarfibrilláció)'],
    consult: 'Tachyarrhythmia, thyreotoxikus tünetek esetén sürgősen.',
    scoreIds: ['cha2ds2'],
  },
  {
    id: 'dic', name: 'DIC-re gyanús mintázat', sev: 'sürgős',
    test: (d) => lo(d, 'plt') && lo(d, 'fib') && hi(d, 'ddimer'),
    summary: 'Alacsony thrombocyta + alacsony fibrinogén + magas D-dimer — disszeminált intravaszkuláris koaguláció gyanúja.',
    apnFocus: ['Vérzésjelek szoros figyelése', 'Alapbetegség (szepszis!) kezelése', 'Invazív beavatkozás előtt egyeztetés'],
    further: ['INR, aPTI ismétlése', 'DIC-panel követése'],
    consult: 'Azonnal — sürgős orvosi értékelés, aktív vérzésnél kritikus.',
  },
]

export interface PanelResult {
  dirs: Record<string, Dir>
  crit: { id: string; name: string; status: LabStatus }[]
  patterns: Pattern[]
}

export function evaluatePanel(values: Record<string, string>): PanelResult {
  const dirs: Record<string, Dir> = {}
  const crit: { id: string; name: string; status: LabStatus }[] = []
  for (const id of Object.keys(values)) {
    const lab = LAB.find((l) => l.id === id)
    if (!lab) continue
    const s = interpret(lab, values[id])
    if (s === 'unknown') continue
    dirs[id] = collapse(s)
    if (s === 'crit-low' || s === 'crit-high') crit.push({ id, name: lab.name, status: s })
  }
  const patterns = PATTERNS.filter((p) => p.test(dirs))
  return { dirs, crit, patterns }
}
