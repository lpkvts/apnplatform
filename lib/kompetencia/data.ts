// APN Kompetenciatérkép — a 13/2025. (IV. 17.) BM rendelet alapján.
//
// A rendelet az egészségügyi tevékenység végzéséhez kapcsolódó szakdolgozói
// kompetenciák keretrendszeréről szól, 2025. április 18-tól hatályos. Az itt
// szereplő tételek a 2. melléklet „Okleveles Ápoló és Kiterjesztett hatáskörű
// ápoló (MSc) (MKKR 7.)" oszlopából származnak.
//
// FONTOS: a tételek szövegét és szintbesorolását nem egészítettük ki és nem
// fogalmaztuk át. Ahol a rendelet ellentmondásos, azt jelöljük, nem simítjuk el.
// A tényleges munkavégzést a szakterület, az intézményi működési rend és a
// munkaköri leírás együtt határozza meg.

export type Level = 1 | 2 | 3 | 4

export interface LevelInfo {
  level: Level
  short: string
  title: string
  /** A rendelet szó szerinti meghatározása. */
  legal: string
  /** Mit jelent a gyakorlatban, közérthetően. */
  plain: string
  /** Az orvosi együttműködés vizuális képlete. */
  flow: string
  accent: string
}

/** A négy tevékenységvégzési szint a rendelet 3. § (3) bekezdése szerint. */
export const LEVELS: LevelInfo[] = [
  {
    level: 1, short: 'Önállóan', title: 'Saját indikáció alapján, önállóan',
    legal: 'Az adott tevékenységet az egészségügyi szakdolgozó saját indikáció alapján, önállóan végzi.',
    plain: 'Az APN maga dönt a tevékenység szükségességéről, és maga is végzi el. Nem kell hozzá orvosi utasítás vagy előzetes egyeztetés.',
    flow: 'APN → beteg',
    accent: '#22A878',
  },
  {
    level: 2, short: 'Szupervízió mellett', title: 'Önállóan, szakorvosi szupervízió mellett',
    legal: 'Az adott tevékenységet az egészségügyi szakdolgozó saját indikáció alapján önállóan, szakorvosi szupervízió vagy magasabb szakmai végzettséggel rendelkező (MKKR besorolású) szakmai felettes szupervíziója mellett végzi; a szupervízió keretében a végzett tevékenységről utólag — sürgős esetben haladéktalanul — tájékoztatja a szupervízióval megbízott szakorvost vagy szakmai felettest.',
    plain: 'A döntés és a kivitelezés az APN-é, de a tevékenység szupervízió alatt áll, és utólag tájékoztatni kell róla. A szupervízió nem jelent folyamatos személyes jelenlétet.',
    flow: 'APN → beteg  ·  utólagos tájékoztatás a szupervizornak',
    accent: '#0891B2',
  },
  {
    level: 3, short: 'Orvosi indikáció után', title: 'Orvosi indikáció vagy előzetes egyeztetés alapján',
    legal: 'Az adott tevékenységet az egészségügyi szakdolgozó szakorvosi vagy magasabb szakmai végzettséggel rendelkező (MKKR besorolású) szakmai felettes indikációjára, vagy szakorvossal, illetve magasabb MKKR szintbesorolású szakmai felettessel történt kötelező, előzetes megbeszélés alapján, önállóan végzi.',
    plain: 'A tevékenység elindítása orvosi indikációhoz vagy kötelező előzetes megbeszéléshez kötött. Ezt követően viszont az APN önállóan hajtja végre.',
    flow: 'orvos → indikáció vagy egyeztetés → APN önállóan végzi',
    accent: '#B45309',
  },
  {
    level: 4, short: 'Orvosi irányítás mellett', title: 'Orvosi irányítás, jelenlét vagy közreműködés mellett',
    legal: 'Az adott tevékenységet az egészségügyi szakdolgozó szakorvos vagy magasabb szakmai végzettséggel rendelkező (MKKR besorolású) szakmai felettes indikációja alapján, személyes irányítása, jelenléte vagy közreműködése mellett, annak utasítása szerint önállóan vagy vele együtt végzi.',
    plain: 'A legszorosabb együttműködési szint: az orvos indikálja, és személyesen irányítja, jelen van vagy közreműködik.',
    flow: 'orvos ↔ APN ↔ beteg',
    accent: '#B91C1C',
  },
]

export const levelInfo = (l: Level): LevelInfo => LEVELS[l - 1]

export interface Competency {
  id: string
  /** Tevékenységi főcsoport a rendelet 1. melléklete szerint. */
  group: string
  /** Alcsoport, ha a rendelet így bontja. */
  sub: string | null
  /** A tevékenység szövege a rendeletből. */
  text: string
  level: Level
}

export const COMPETENCIES: Competency[] = [
  { id: 'k001', group: 'Kommunikáció', sub: null, level: 1, text: 'Empatikus és lojális a betegekkel és munkatársaival való kapcsolatában.' },
  { id: 'k002', group: 'Kommunikáció', sub: null, level: 1, text: 'Etikusan viszonyul mások szakmai eredményeihez.' },
  { id: 'k003', group: 'Kommunikáció', sub: null, level: 1, text: 'Partneri szinten kommunikál az egészségügyi és szociális ellátórendszer tagjaival.' },
  { id: 'k004', group: 'Kommunikáció', sub: null, level: 1, text: 'Holisztikus, reflektív szemlélettel rendelkezik kommunikációja során.' },
  { id: 'k005', group: 'Kommunikáció', sub: null, level: 1, text: 'Szociokulturális érzékenységgel és társadalmi felelősségvállalással rendelkezik, ezt kifejezi kommunikációja során.' },
  { id: 'k006', group: 'Kommunikáció', sub: null, level: 1, text: 'Építő kritikával hozzájárul a saját és mások szakmai tevékenységéhez, eredményeihez.' },
  { id: 'k007', group: 'Kommunikáció', sub: null, level: 2, text: 'Jelentős mértékű önállósággal rendelkezik szakmai nézetek képviseletében, indoklásában.' },
  { id: 'k008', group: 'Kommunikáció', sub: null, level: 1, text: 'Munkájának eredményeit szakmai és nem szakmai körök számára hatékonyan kommunikálja magyar és idegen nyelven egyaránt.' },
  { id: 'k009', group: 'Kommunikáció', sub: null, level: 1, text: 'Hatékonyan kommunikál látás-, hallás-, beszéd- és értelmi fogyatékos személlyel.' },
  { id: 'k010', group: 'Kommunikáció', sub: null, level: 1, text: 'Informálja a beteget, a hozzátartozót és a munkatársait kompetenciáján belül.' },
  { id: 'k011', group: 'Kommunikáció', sub: null, level: 1, text: 'Referál a multidiszciplináris team tagjainak.' },
  { id: 'k012', group: 'Kommunikáció', sub: null, level: 1, text: 'Digitális kompetencia elsajátításával az informatikai eszközök és telemedicinális, telecare rendszerek, tanácsadás, pszichés vezetés gyakorlati alkalmazását, az adatbázisok kezelését, értelmezését végzi.' },
  { id: 'k013', group: 'Kommunikáció', sub: null, level: 1, text: 'Telefonos és online tanácsadást végez.' },
  { id: 'k014', group: 'Diagnózisalkotás', sub: null, level: 2, text: 'Iránydiagnózist, csoportdiagnózist állít fel.' },
  { id: 'k015', group: 'Diagnózisalkotás', sub: null, level: 2, text: 'Laboratóriumi vizsgálatokat, gyorsteszteket értelmezi, értékeli.' },
  { id: 'k016', group: 'Diagnózisalkotás', sub: null, level: 2, text: 'Eszközös vizsgálatok eredményeit értelmezi, értékeli.' },
  { id: 'k017', group: 'Diagnózisalkotás', sub: null, level: 2, text: 'Személyre szabott kockázatot határoz meg.' },
  { id: 'k018', group: 'Diagnózisalkotás', sub: null, level: 2, text: 'A diagnózisalkotás, a betegségek kezelési tervének, majd kivitelezésének során integráltan alkalmazza ismereteit.' },
  { id: 'k019', group: 'Diagnózisalkotás', sub: null, level: 2, text: 'A diagnózisalkotás során alkalmazza a fizikális betegvizsgálat elemeit és a vizsgálati eredmények megfelelő értékelését, prioritásokat határoz meg, ezeket szakmai és nem szakmai környezetben egyaránt kommunikálja.' },
  { id: 'k020', group: 'Diagnózisalkotás', sub: null, level: 1, text: 'Megérti a betegellátás során a gyógyszertan, a klinikum, a diagnosztika és a terápia összefüggéseit, és mindezek ismeretében szakterületének megfelelően szakdolgozói feladatokat lát el.' },
  { id: 'k021', group: 'Diagnózisalkotás', sub: null, level: 1, text: 'A diagnózisalkotás során alkalmazza a komplex fizikális betegvizsgálat elemeit, a vizsgálati eredményeket megfelelően értékeli, a prioritásokat meghatározza.' },
  { id: 'k022', group: 'Diagnózisalkotás', sub: 'Anamnézisfelvétel', level: 1, text: 'Felveszi az anamnézist.' },
  { id: 'k023', group: 'Diagnózisalkotás', sub: 'Anamnézisfelvétel', level: 1, text: 'A rizikófaktorokat felméri.' },
  { id: 'k024', group: 'Diagnózisalkotás', sub: 'Anamnézisfelvétel', level: 1, text: 'Alkalmazza az állapotfelmérő skálákat.' },
  { id: 'k025', group: 'Diagnózisalkotás', sub: 'Anamnézisfelvétel', level: 1, text: 'Végzi a szakszerű fájdalomfelmérést megbízható és érvényes felmérési módszer alkalmazásával.' },
  { id: 'k026', group: 'Diagnózisalkotás', sub: 'Anamnézisfelvétel', level: 1, text: 'A fájdalom felmérését rögzíti.' },
  { id: 'k027', group: 'Diagnózisalkotás', sub: 'Anamnézisfelvétel', level: 1, text: 'Elvégzi a rizikószűrést a krónikus sebek kialakulásának megelőzése céljából.' },
  { id: 'k028', group: 'Diagnózisalkotás', sub: 'Anamnézisfelvétel', level: 1, text: 'Végzi a nyomási fekély kockázatfelmérést.' },
  { id: 'k029', group: 'Diagnózisalkotás', sub: 'Betegmegfigyelés', level: 1, text: 'Az egészséget károsító tényezőket felismeri, az élettani és kóros működéseket egymástól elkülöníti, kompetenciaszintjének megfelelő lépéseket vagy javaslatokat tesz a megoldásra.' },
  { id: 'k030', group: 'Diagnózisalkotás', sub: 'Betegmegfigyelés', level: 1, text: 'Elrendeli és kivitelezi az Allen-tesztet.' },
  { id: 'k031', group: 'Diagnózisalkotás', sub: 'Betegmegfigyelés', level: 1, text: 'Oxigénszaturációt ellenőrzi.' },
  { id: 'k032', group: 'Diagnózisalkotás', sub: 'Betegmegfigyelés', level: 1, text: 'Gyakorlati munkája során ismereteit alkalmazza a jellegzetes patológiai eltérések, elváltozások kapcsán.' },
  { id: 'k033', group: 'Diagnózisalkotás', sub: 'Betegmegfigyelés', level: 1, text: 'Elvégzi a teljes körű betegmegfigyelést (testalkat, tápláltság, mozgás, járás, fekvés, testhelyzet, alvás, bőr és bőrfüggelékek, érzékszervek működése, magatartás, tudat, zavartság, beszéd, viselkedés, fájdalom, vitális paraméterek, köhögés, testváladékok).' },
  { id: 'k034', group: 'Diagnózisalkotás', sub: 'Betegmegfigyelés', level: 1, text: 'Elhúzódó sebgyógyulás tüneteit észleli és értelmezi.' },
  { id: 'k035', group: 'Diagnózisalkotás', sub: 'Betegmegfigyelés', level: 3, text: 'A citosztatikus, sugár-, illetve hormonkezelés akut és szubakut mellékhatásait felismeri, és ellátja.' },
  { id: 'k036', group: 'Diagnózisalkotás', sub: 'Betegmegfigyelés', level: 1, text: 'Felméri a beteg fizikális állapotát.' },
  { id: 'k037', group: 'Diagnózisalkotás', sub: 'Betegmegfigyelés', level: 1, text: 'A nem várt eseményeket felismeri.' },
  { id: 'k038', group: 'Diagnózisalkotás', sub: 'Betegmegfigyelés', level: 1, text: 'Felismeri a szövődményeket, az életveszélyes állapotokat, az allergiás reakciókat, a gyógyszeres terápia mellékhatásait, az önkárosító, lelki egészséget veszélyeztető tüneteket.' },
  { id: 'k039', group: 'Diagnózisalkotás', sub: 'Betegmegfigyelés', level: 1, text: 'Megfigyeli és értékeli a beteg állapotváltozásait.' },
  { id: 'k040', group: 'Diagnózisalkotás', sub: 'Betegmegfigyelés', level: 1, text: 'A kóros értéket észleli és jelenti.' },
  { id: 'k041', group: 'Diagnózisalkotás', sub: 'Betegmegfigyelés', level: 1, text: 'Állapotváltozásokat regisztrálja.' },
  { id: 'k042', group: 'Diagnózisalkotás', sub: 'Fizikális betegvizsgálat', level: 1, text: 'Részletes fizikális betegvizsgálatot elvégzi és értékeli.' },
  { id: 'k043', group: 'Diagnózisalkotás', sub: 'Fizikális betegvizsgálat', level: 2, text: 'A vizsgálatok során nyert eredményeket elemzi.' },
  { id: 'k044', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 1, text: 'Elvégzi az antropometriai mérést (testtömeg, testmagasság, BMI, derék-, fej- és haskörfogat).' },
  { id: 'k045', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 3, text: 'Diagnosztikus vizsgálati eljárásokat és terápiás eszközöket szakszerűen előkészíti és használja.' },
  { id: 'k046', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 1, text: 'A végtagok Doppler-áramlásvizsgálatát elrendeli és kivitelezi.' },
  { id: 'k047', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 1, text: 'EKG mérésének szükségességét azonosítja, kivitelezi, a kóros értékeket megállapítja, a főbb ritmuszavarokat felismeri.' },
  { id: 'k048', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 1, text: 'Betegmegfigyelő monitorokat alkalmaz.' },
  { id: 'k049', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 2, text: 'Invazív betegmonitorozást végez.' },
  { id: 'k050', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 1, text: 'Előkészíti a beteget diagnosztikai eljárásokra vagy terápiás beavatkozásokra.' },
  { id: 'k051', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 2, text: 'Előkészíti és felkészíti a beteget képalkotó, endoszkópos és punkciós vizsgálatokra.' },
  { id: 'k052', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 1, text: 'Az invazív nyomásmérések eszközrendszerét összeállítja, és az eredményeket értelmezi.' },
  { id: 'k053', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 2, text: 'Előkészít vércsoport-meghatározáshoz.' },
  { id: 'k054', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 2, text: 'Előkészít transzfúzió adásához.' },
  { id: 'k055', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 3, text: 'Segédkezik transzfúzió bekötésénél.' },
  { id: 'k056', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 1, text: 'Transzfúzió alatti és utáni ápolói teendőket ellátja.' },
  { id: 'k057', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 1, text: 'Felismeri a transzfúzió szövődményeit.' },
  { id: 'k058', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 4, text: 'Elvégzi a vizsgálatok alatti és utáni ápolói vagy asszisztensi feladatokat.' },
  { id: 'k059', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 3, text: 'A beavatkozások során az egészségügyi teammel együttműködik (punkciók, biopsziák, katéterezés, gégekanül-csere, gyomormosás, egyéb invazív beavatkozások).' },
  { id: 'k060', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 2, text: 'Érzékszervi vizsgálatokban közreműködik.' },
  { id: 'k061', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 2, text: 'Garat-gége tükrözésnél segédkezik.' },
  { id: 'k062', group: 'Diagnózisalkotás', sub: 'Eszközös betegvizsgálat', level: 2, text: 'A beteg állapotváltozásait észleli, azokat értelmezi, és dönt a további ellátási kompetenciáról.' },
  { id: 'k063', group: 'Diagnózisalkotás', sub: 'Vizsgálatkérés', level: 1, text: 'A beteg testváladékait felfogja, gyűjti, méri, váladékfelfogó eszközöket szakszerűen használja.' },
  { id: 'k064', group: 'Diagnózisalkotás', sub: 'Vizsgálatkérés', level: 1, text: 'Testváladékokat észleli, regisztrálja.' },
  { id: 'k065', group: 'Diagnózisalkotás', sub: 'Vizsgálatkérés', level: 2, text: 'Laboratóriumi vizsgálatokat elrendeli.' },
  { id: 'k066', group: 'Diagnózisalkotás', sub: 'Vizsgálatkérés', level: 1, text: 'Elvégzi a vércukor-meghatározást.' },
  { id: 'k067', group: 'Diagnózisalkotás', sub: 'Vizsgálatkérés', level: 1, text: 'A vizeletet megvizsgálja gyorsteszttel.' },
  { id: 'k068', group: 'Diagnózisalkotás', sub: 'Vizsgálatkérés', level: 2, text: 'Komplex klinikai vizsgálatokat megtervez és lebonyolít, valamint a bizonyítékokat integrálja a gyakorlatba.' },
  { id: 'k069', group: 'Diagnózisalkotás', sub: 'Vizsgálatkérés', level: 1, text: 'Elvégzi a mintavételt vizsgálatokhoz vagy tenyésztéshez.' },
  { id: 'k070', group: 'Diagnózisalkotás', sub: 'Vizsgálatkérés', level: 1, text: 'Leveszi a mintát a klinikai és mikrobiológiai laboratóriumi vizsgálatokhoz.' },
  { id: 'k071', group: 'Diagnózisalkotás', sub: 'Vizsgálatkérés', level: 2, text: 'Elvégzi a vénás vérvételt.' },
  { id: 'k072', group: 'Diagnózisalkotás', sub: 'Vizsgálatkérés', level: 1, text: 'A vénás, artériás vagy kapilláris vérgáz-mintavételt elrendeli.' },
  { id: 'k073', group: 'Diagnózisalkotás', sub: 'Vizsgálatkérés', level: 1, text: 'Egyéb mintavételt elvégzi (bőrfelület, szem, orr, garat, torok, köpet, hüvely, seb, széklet, vizelet).' },
  { id: 'k074', group: 'Diagnózisalkotás', sub: 'Vizsgálatkérés', level: 1, text: 'Mikrobiológiai mintákat szállításra előkészíti, megfelelően tárolja.' },
  { id: 'k075', group: 'Diagnózisalkotás', sub: 'Vizsgálatkérés', level: 3, text: 'A mintát megfelelő laboratóriumba juttatja.' },
  { id: 'k076', group: 'Diagnózisalkotás', sub: 'Vizsgálatkérés', level: 2, text: 'Elrendeli a képalkotó vizsgálatokat.' },
  { id: 'k077', group: 'Diagnózisalkotás', sub: 'Vizsgálatkérés', level: 1, text: 'Elrendeli az egyszerű eszközös vizsgálatokat (EKG, ABPM, transztelefonikus EKG, Holter EKG, diagnosztikus spirometria).' },
  { id: 'k078', group: 'Betegút- és ellátásszervezés', sub: null, level: 1, text: 'A betegellátás során a gyógyszertan, a klinikum, a diagnosztika és a terápia összefüggéseit alkalmazza.' },
  { id: 'k079', group: 'Betegút- és ellátásszervezés', sub: null, level: 1, text: 'Partneri szinten együttműködik az egészségügyi és szociális ellátórendszer tagjaival.' },
  { id: 'k080', group: 'Betegút- és ellátásszervezés', sub: null, level: 1, text: 'Menedzsmentismeretei, vezetői készségei és jogi ismeretei birtokában a szakdolgozókat és szervezeti egységeket irányítja, szervezi.' },
  { id: 'k081', group: 'Betegút- és ellátásszervezés', sub: null, level: 2, text: 'A komplex klinikai vizsgálatokat megtervezi, lebonyolítja, valamint a bizonyítékokat beilleszti a gyakorlatba.' },
  { id: 'k082', group: 'Betegút- és ellátásszervezés', sub: null, level: 1, text: 'Az ellátás során felmerülő etikai problémákat megfelelően kezeli.' },
  { id: 'k083', group: 'Betegút- és ellátásszervezés', sub: null, level: 1, text: 'A szakterületével kapcsolatos ismereteket és képességeket oktatja.' },
  { id: 'k084', group: 'Betegút- és ellátásszervezés', sub: null, level: 1, text: 'A szakterülethez kapcsolódó erőforrás-menedzsment feladatait ellátja a betegútszervezés során.' },
  { id: 'k085', group: 'Betegút- és ellátásszervezés', sub: null, level: 1, text: 'A munkavégzést koordinálja.' },
  { id: 'k086', group: 'Betegút- és ellátásszervezés', sub: 'Konzíliumkérés', level: 1, text: 'Távkonzultációs betegirányítást végez.' },
  { id: 'k087', group: 'Betegút- és ellátásszervezés', sub: 'Konzíliumkérés', level: 2, text: 'Megszervezi a járóbeteg szakorvosi konzíliumot.' },
  { id: 'k088', group: 'Betegút- és ellátásszervezés', sub: 'Konzíliumkérés', level: 2, text: 'Megszervezi a kórházi sürgősségi beutalást.' },
  { id: 'k089', group: 'Betegút- és ellátásszervezés', sub: 'Konzíliumkérés', level: 2, text: 'Megszervezi a távkonzíliumot.' },
  { id: 'k090', group: 'Betegút- és ellátásszervezés', sub: 'Beutalás', level: 1, text: 'Beteget szakambulanciára utal.' },
  { id: 'k091', group: 'Betegút- és ellátásszervezés', sub: 'Beutalás', level: 1, text: 'Távkonzultáció során beutalót elrendel és felír.' },
  { id: 'k092', group: 'Betegút- és ellátásszervezés', sub: 'Betegáthelyezés, kísérés', level: 1, text: 'A beteg osztályos felvételét, elhelyezését elvégzi.' },
  { id: 'k093', group: 'Betegút- és ellátásszervezés', sub: 'Betegáthelyezés, kísérés', level: 1, text: 'A betegelbocsátást megtervezi és megszervezi.' },
  { id: 'k094', group: 'Betegút- és ellátásszervezés', sub: 'Betegáthelyezés, kísérés', level: 1, text: 'A beteg adaptációs szabadságra való előkészítésében közreműködik.' },
  { id: 'k095', group: 'Betegút- és ellátásszervezés', sub: 'Betegáthelyezés, kísérés', level: 1, text: 'A betegek napi tevékenységének szervezésében részt vesz.' },
  { id: 'k096', group: 'Betegút- és ellátásszervezés', sub: 'Betegáthelyezés, kísérés', level: 3, text: 'A beteget vizsgálatra kíséri, szállítja.' },
  { id: 'k097', group: 'Betegút- és ellátásszervezés', sub: 'Betegáthelyezés, kísérés', level: 1, text: 'A betegszállítás eszközeit alkalmazza.' },
  { id: 'k098', group: 'Betegellátás', sub: null, level: 1, text: 'Azonosítja a beteget.' },
  { id: 'k099', group: 'Betegellátás', sub: null, level: 3, text: 'Vizithez, konzíliumhoz előkészít.' },
  { id: 'k100', group: 'Betegellátás', sub: null, level: 2, text: 'Specializációjának megfelelően akut és krónikus beteget kezel, gondozás, kezelési terv összeállítás szintjén.' },
  { id: 'k101', group: 'Betegellátás', sub: null, level: 1, text: 'Esetmenedzsment tevékenységet végez.' },
  { id: 'k102', group: 'Betegellátás', sub: null, level: 1, text: 'A társbetegségeket nyomon követi.' },
  { id: 'k103', group: 'Betegellátás', sub: null, level: 1, text: 'Telecare szolgáltatásokat, betegoktatást értékeli és fejleszti.' },
  { id: 'k104', group: 'Betegellátás', sub: null, level: 1, text: 'Szakápolási feladatokat elrendeli, kivitelezi és értékeli.' },
  { id: 'k105', group: 'Betegellátás', sub: null, level: 2, text: 'Gondozási tevékenységet, kontrolltevékenységet végez.' },
  { id: 'k106', group: 'Betegellátás', sub: null, level: 1, text: 'Védőoltások elrendelését és felírását menedzseli.' },
  { id: 'k107', group: 'Betegellátás', sub: 'Gyógyszerelés', level: 1, text: 'Tárolja és elhelyezi a gyógyszereket.' },
  { id: 'k108', group: 'Betegellátás', sub: 'Gyógyszerelés', level: 1, text: 'Előkészít a terápiához.' },
  { id: 'k109', group: 'Betegellátás', sub: 'Gyógyszerelés', level: 2, text: 'Specializációjának megfelelően elrendeli és kivitelezi a gyógyszeres terápiát.' },
  { id: 'k110', group: 'Betegellátás', sub: 'Gyógyszerelés', level: 1, text: 'Felismeri a gyógyszeres terápia mellékhatásait.' },
  { id: 'k111', group: 'Betegellátás', sub: 'Gyógyszerelés', level: 1, text: 'Gyógyszerelés szabályait betartja.' },
  { id: 'k112', group: 'Betegellátás', sub: 'Gyógyszerelés', level: 1, text: 'Elrendeli a vény nélkül kapható gyógyszerek alkalmazását.' },
  { id: 'k113', group: 'Betegellátás', sub: 'Gyógyszerelés', level: 1, text: 'A beteg állapotától függően döntést hoz a szükség szerint adható gyógyszerkészítmények használatáról.' },
  { id: 'k114', group: 'Betegellátás', sub: 'Gyógyszerelés', level: 2, text: 'A gyógyszerelési szabályok betartása mellett az egyes gyógyszerformákat előkészíti és bejuttatja.' },
  { id: 'k115', group: 'Betegellátás', sub: 'Gyógyszerelés', level: 1, text: 'A perifériás vénás injekció helyét kiválasztja, megválasztja a beadási technikát.' },
  { id: 'k116', group: 'Betegellátás', sub: 'Gyógyszerelés', level: 1, text: 'Megtanítja a beteget az öninjekciózásra.' },
  { id: 'k117', group: 'Betegellátás', sub: 'Gyógyszerelés', level: 2, text: 'Orvosi indikáció alapján gyógyszerelő tevékenységet végez (fájdalomcsillapító, hányáscsillapító, antikoaguláns, diuretikum, kortikoszteroid, fiziológiás oldat, heparinos fiziológiás oldat és 14 éves kor felett glükóz).' },
  { id: 'k118', group: 'Betegellátás', sub: 'Gyógyszerelés', level: 1, text: 'Allergiaellenes gyógyszereket utasítás szerint alkalmaz a betegnél (szájon keresztül, szubkután, intramuszkulárisan).' },
  { id: 'k119', group: 'Betegellátás', sub: 'Infúziós terápia', level: 2, text: 'A gyógyszerelési szabályok betartása mellett az infúziós oldatokat előkészíti, szabályszerűen beadja szubkután, intravénás, intraosszeális portálokon, valamint EDA, PCA kanülön keresztül.' },
  { id: 'k120', group: 'Betegellátás', sub: 'Infúziós terápia', level: 2, text: 'Dehidráció esetén önállóan megkezdi a folyadékpótlást fiziológiás összetételű oldattal intravénás úton.' },
  { id: 'k121', group: 'Betegellátás', sub: 'Infúziós terápia', level: 1, text: 'Elrendeli a gyógyszer nélküli folyadékpótlást.' },
  { id: 'k122', group: 'Betegellátás', sub: 'Infúziós terápia', level: 2, text: 'Centrális vénakanülöket használja és gondozza.' },
  { id: 'k123', group: 'Betegellátás', sub: 'Infúziós terápia', level: 1, text: 'Perifériás vénakanült ideiglenesen lezár, eltávolít.' },
  { id: 'k124', group: 'Betegellátás', sub: 'Infúziós terápia', level: 1, text: 'Infúziós terápiát előkészít és kivitelez, cseppszámot kiszámít, beállít, infúziós pumpákat használ.' },
  { id: 'k125', group: 'Betegellátás', sub: 'Infúziós terápia', level: 2, text: 'Túlnyomásos infúziót beadja.' },
  { id: 'k126', group: 'Betegellátás', sub: 'Infúziós terápia', level: 3, text: 'Másodlagos infúziót alkalmazza.' },
  { id: 'k127', group: 'Betegellátás', sub: 'Infúziós terápia', level: 2, text: 'A vénapunkciót elvégzi.' },
  { id: 'k128', group: 'Betegellátás', sub: 'Infúziós terápia', level: 2, text: 'Hatóanyag nélküli infúziót előkészíti, beadja.' },
  { id: 'k129', group: 'Betegellátás', sub: 'Infúziós terápia', level: 4, text: 'Bejuttatja a citosztatikus keverékinfúziót, gyógyszereket, vérkészítményt a Port-a-Cath kanülön vagy érkatéteren át; a katétert, kanült ápolja, gondozza.' },
  { id: 'k130', group: 'Betegellátás', sub: 'Infúziós terápia', level: 1, text: 'Perifériás vénát biztosít, vénabiztosítást elrendel.' },
  { id: 'k131', group: 'Betegellátás', sub: null, level: 2, text: 'Specializációjának megfelelően elvégzi a speciális invazív beavatkozásokat.' },
  { id: 'k132', group: 'Betegellátás', sub: null, level: 3, text: 'Közreműködik a speciális fájdalomcsillapításban (EDA, PCA).' },
  { id: 'k133', group: 'Betegellátás', sub: null, level: 1, text: 'Fájdalommenedzsmentet, fizikális és gyógyszeres eljárásokat alkalmaz.' },
  { id: 'k134', group: 'Betegellátás', sub: null, level: 1, text: 'Hatékony fájdalomcsillapítást alkalmaz felmérési eredmény alapján.' },
  { id: 'k135', group: 'Betegellátás', sub: null, level: 1, text: 'Fizikális és gyógyszeres lázcsillapítást végez.' },
  { id: 'k136', group: 'Betegellátás', sub: null, level: 2, text: 'Fizioterápiás eljárásokban közreműködik.' },
  { id: 'k137', group: 'Betegellátás', sub: null, level: 2, text: 'Távmonitoring, távdiagnosztikai tevékenységet végez.' },
  { id: 'k138', group: 'Betegellátás', sub: null, level: 1, text: 'Elrendeli és kivitelezi a carotismasszázst, Valsalva-manővert.' },
  { id: 'k139', group: 'Betegellátás', sub: null, level: 4, text: 'Nem várt események elhárításában közreműködik.' },
  { id: 'k140', group: 'Alap- és szakápolás', sub: 'Pszichés vezetés', level: 1, text: 'Pszichés vezetést végez az ellátó teammel együtt.' },
  { id: 'k141', group: 'Alap- és szakápolás', sub: 'Pszichés vezetés', level: 1, text: 'A betegnek lelki támogatást nyújt.' },
  { id: 'k142', group: 'Alap- és szakápolás', sub: 'Pszichés vezetés', level: 1, text: 'Tanácsadó, problémafeltáró beszélgetést folytat.' },
  { id: 'k143', group: 'Alap- és szakápolás', sub: 'Betegoktatás', level: 1, text: 'Egyénre szabott betegoktatást és egészségfejlesztő tevékenységet, telecare szolgáltatásokat értékel és fejleszt az ápolás során.' },
  { id: 'k144', group: 'Alap- és szakápolás', sub: 'Betegoktatás', level: 1, text: 'A beteget és hozzátartozóját oktatja az alapápolási feladatokra, edukálja.' },
  { id: 'k145', group: 'Alap- és szakápolás', sub: 'Betegoktatás', level: 1, text: 'Életvezetési tanácsokat ad.' },
  { id: 'k146', group: 'Alap- és szakápolás', sub: 'Ápolási folyamat', level: 1, text: 'Önállóan, a hazai és nemzetközi standardoknak megfelelően ápolási tervet készít, az ápolási folyamat lépéseit önállóan alkalmazza; az ápolók e munkáját irányítja.' },
  { id: 'k147', group: 'Alap- és szakápolás', sub: 'Ápolási folyamat', level: 1, text: 'Az egyén életkorának és élethelyzetének megfelelően gondozási feladatokat végez.' },
  { id: 'k148', group: 'Alap- és szakápolás', sub: 'Infekciókontroll', level: 2, text: 'Az infekciókontroll feladatot végzi.' },
  { id: 'k149', group: 'Alap- és szakápolás', sub: 'Infekciókontroll', level: 3, text: 'Részt vesz a fertőző beteg elkülönítésében.' },
  { id: 'k150', group: 'Alap- és szakápolás', sub: 'Infekciókontroll', level: 1, text: 'Izolált fertőző beteg ápolását, szakápolását elvégzi.' },
  { id: 'k151', group: 'Alap- és szakápolás', sub: 'Infekciókontroll', level: 1, text: 'Betartja a kórházhigiénés rendszabályokat, megelőzi a nosocomialis fertőzések kialakulását.' },
  { id: 'k152', group: 'Alap- és szakápolás', sub: 'Szakápolás', level: 1, text: 'Akut és krónikus betegségek szakápolási feladatait elrendeli, elvégzi és értékeli.' },
  { id: 'k153', group: 'Alap- és szakápolás', sub: 'Szakápolás', level: 1, text: 'Keringési, légző-, emésztőrendszeri, vizeletkiválasztó, vérképző és immunrendszeri, endokrin, nőgyógyászati és mozgásrendszeri betegségekben szenvedő betegek ápolását végzi.' },
  { id: 'k154', group: 'Alap- és szakápolás', sub: 'Szakápolás', level: 1, text: 'Az urológiai, szemészeti, fül-orr-gégészeti, bőrgyógyászati, onkológiai, neurológiai és pszichiátriai kórképekben szenvedő betegeket ápolja.' },
  { id: 'k155', group: 'Alap- és szakápolás', sub: 'Szakápolás', level: 1, text: 'Sebészeti beavatkozásra szoruló és transzplantált betegek ápolását végzi.' },
  { id: 'k156', group: 'Alap- és szakápolás', sub: 'Szakápolás', level: 1, text: 'Az eszméletlen, mozgássérült, bénult beteg ápolását végzi.' },
  { id: 'k157', group: 'Alap- és szakápolás', sub: 'Segédeszközök', level: 2, text: 'Az egyes gyógyászati segédeszközöket (kötszerek, inkontinencia-ellátás eszközei) elrendeli.' },
  { id: 'k158', group: 'Alap- és szakápolás', sub: 'Segédeszközök', level: 1, text: 'Szakszerűen alkalmazza a gyógyászati segédeszközöket, megtanítja a beteget a használatukra.' },
  { id: 'k159', group: 'Alap- és szakápolás', sub: 'Táplálás', level: 1, text: 'Felméri a beteg tápláltsági állapotát, javaslatot tesz az alapvető táplálási módokra, ételallergia esetén haladéktalanul beavatkozik.' },
  { id: 'k160', group: 'Alap- és szakápolás', sub: 'Táplálás', level: 1, text: 'Felismeri a malnutríciót, elrendeli a mesterséges táplálást, eldönti a tápláló szonda típusát, a táplálás formáját, módját és a beadandó tápszert.' },
  { id: 'k161', group: 'Alap- és szakápolás', sub: 'Táplálás', level: 2, text: 'Diétás terápia megvalósításában közreműködik.' },
  { id: 'k162', group: 'Alap- és szakápolás', sub: 'Táplálás', level: 1, text: 'Nasogastricus és meghatározott körű postpyloricus szondákat levezet és eltávolít.' },
  { id: 'k163', group: 'Alap- és szakápolás', sub: 'Táplálás', level: 2, text: 'Elvezetési eszközök (nasogastricus szonda, enterális tápláló szondák, tubusok) kezelését, gondozását végzi.' },
  { id: 'k164', group: 'Alap- és szakápolás', sub: 'Táplálás', level: 1, text: 'Gasztrosztómán, jejunosztómán át történő táplálást végzi.' },
  { id: 'k165', group: 'Alap- és szakápolás', sub: 'Táplálás', level: 3, text: 'Átmossa a nasogastricus és enterális szondát.' },
  { id: 'k166', group: 'Alap- és szakápolás', sub: 'Légútbiztosítás', level: 1, text: 'Elvégzi az alkalmazandó oxigénkoncentráció elrendelését, az oxigénbeviteli rendszer és inhalációs eszköz megválasztását és alkalmazását; a beteg állapota alapján az oxigénterápia típusát megválasztja és kivitelezi.' },
  { id: 'k167', group: 'Alap- és szakápolás', sub: 'Légútbiztosítás', level: 1, text: 'Az oropharingeális tubust behelyezi.' },
  { id: 'k168', group: 'Alap- és szakápolás', sub: 'Légútbiztosítás', level: 2, text: 'Laringeális maszkot alkalmaz.' },
  { id: 'k169', group: 'Alap- és szakápolás', sub: 'Légútbiztosítás', level: 2, text: 'Nasopharingeális tubust bevezet.' },
  { id: 'k170', group: 'Alap- és szakápolás', sub: 'Légútbiztosítás', level: 2, text: 'Laryngo-tracheális tubust alkalmaz.' },
  { id: 'k171', group: 'Alap- és szakápolás', sub: 'Légútbiztosítás', level: 2, text: 'Inhalációs kezelést végez.' },
  { id: 'k172', group: 'Alap- és szakápolás', sub: 'Légútbiztosítás', level: 2, text: 'Ballonos lélegeztetést végez.' },
  { id: 'k173', group: 'Alap- és szakápolás', sub: 'Légútbiztosítás', level: 3, text: 'Asszisztál légútbiztosítás esetén.' },
  { id: 'k174', group: 'Alap- és szakápolás', sub: 'Légútbiztosítás', level: 1, text: 'Ellátja a légút átjárhatóságát fenntartó beavatkozásokat, műfogásokkal és eszközökkel fenntartja azt.' },
  { id: 'k175', group: 'Alap- és szakápolás', sub: 'Légútbiztosítás', level: 2, text: 'Ellátja a lélegeztetéssel kapcsolatos feladatokat.' },
  { id: 'k176', group: 'Alap- és szakápolás', sub: 'Légútbiztosítás', level: 1, text: 'Tracheostoma leszívását, trachea toalettet végez.' },
  { id: 'k177', group: 'Alap- és szakápolás', sub: 'Légútbiztosítás', level: 2, text: 'Tracheosztomás nyílás és környékének gondozását végzi.' },
  { id: 'k178', group: 'Alap- és szakápolás', sub: 'Légútbiztosítás', level: 3, text: 'Gégekanül-betétet cserél.' },
  { id: 'k179', group: 'Alap- és szakápolás', sub: 'Transzfúzió', level: 2, text: 'Alkalmazza az ágy melletti teszteket a transzfúziós terápia kapcsán.' },
  { id: 'k180', group: 'Alap- és szakápolás', sub: 'Transzfúzió', level: 1, text: 'A transzfúziós terápiával kapcsolatos előkészítési és kivitelezési feladatokat (vércsoport-meghatározás, biológiai próba, vérkészítmény beadása, betegmegfigyelés, szövődmények ellátása, dokumentáció) elvégzi.' },
  { id: 'k181', group: 'Alap- és szakápolás', sub: 'Transzfúzió', level: 1, text: 'Alkalmazza a preoperatív, posztoperatív és intraoperatív vérmentési technikákat.' },
  { id: 'k182', group: 'Alap- és szakápolás', sub: 'Sebkezelés', level: 1, text: 'Önállóan elrendeli a sebek kezelését, kötszert választ, önállóan meghatározza a különböző típusú sebkezelési eljárásokat.' },
  { id: 'k183', group: 'Alap- és szakápolás', sub: 'Sebkezelés', level: 1, text: 'Akut sebeket, műtéti területeket (nyitott és zárt sebek) ellát.' },
  { id: 'k184', group: 'Alap- és szakápolás', sub: 'Sebkezelés', level: 1, text: 'Krónikus sebek (dekubitálódott területek, fekélyek) szakápolási feladatait ellátja.' },
  { id: 'k185', group: 'Alap- és szakápolás', sub: 'Sebkezelés', level: 1, text: 'Sebtisztítást végez, a debridement különböző formáit, kompressziós kezelést és VAC-terápiát alkalmaz.' },
  { id: 'k186', group: 'Alap- és szakápolás', sub: 'Sebkezelés', level: 1, text: 'Elvégzi az elsődleges vérzéscsillapítási eljárásokat és az elsődleges sebellátást.' },
  { id: 'k187', group: 'Alap- és szakápolás', sub: 'Sebkezelés', level: 2, text: 'Fertőzött sebek kezelését végzi.' },
  { id: 'k188', group: 'Alap- és szakápolás', sub: 'Sebkezelés', level: 2, text: 'Nekrotikus sebek kezelését végzi, kivéve a sebészi debridementet.' },
  { id: 'k189', group: 'Alap- és szakápolás', sub: 'Sebkezelés', level: 2, text: 'Alkalmazza a speciális kötszereket a külön meghatározott sebtípusok és stádiumok esetén.' },
  { id: 'k190', group: 'Alap- és szakápolás', sub: 'Sebkezelés', level: 2, text: 'Alkalmazza az enzimatikus debridementet külön meghatározott sebtípus és stádiumok esetén.' },
  { id: 'k191', group: 'Alap- és szakápolás', sub: 'Nyomási fekély', level: 1, text: 'Nyomási fekély kockázatfelmérést végez.' },
  { id: 'k192', group: 'Alap- és szakápolás', sub: 'Nyomási fekély', level: 1, text: 'Végzi a komplex nyomási fekély prevenciós tevékenységet: tehermentesítés, nyomáscsökkentés, speciális táplálás és folyadékpótlás, bőrvédelem, inkontinencia-ellátás.' },
  { id: 'k193', group: 'Alap- és szakápolás', sub: 'Nyomási fekély', level: 1, text: 'Felismeri a nyomási fekély kialakulásának jeleit, a kialakult fekély súlyosságát felméri, stádiumát megállapítja.' },
  { id: 'k194', group: 'Alap- és szakápolás', sub: 'Nyomási fekély', level: 1, text: 'Kezeli az I. és II. stádiumú nyomási fekélyt, elkészíti a sebellátási tervet.' },
  { id: 'k195', group: 'Alap- és szakápolás', sub: 'Nyomási fekély', level: 1, text: 'Kezeli a III. és IV. stádiumú nyomási fekélyt, elkészíti a sebellátási tervet.' },
  { id: 'k196', group: 'Alap- és szakápolás', sub: 'Nyomási fekély', level: 2, text: 'Alkalmazza az enzimatikus debridementet a III. és IV. stádiumú nyomási fekély esetén.' },
  { id: 'k197', group: 'Alap- és szakápolás', sub: 'Perioperatív ellátás', level: 1, text: 'Elvégzi az általános és a speciális műtéti előkészítést, a műtét utáni betegmegfigyelést, lecseréli a kötést.' },
  { id: 'k198', group: 'Alap- és szakápolás', sub: 'Perioperatív ellátás', level: 1, text: 'Elvégzi az általános műtéti utókezelés ápolói feladatait.' },
  { id: 'k199', group: 'Alap- és szakápolás', sub: 'Perioperatív ellátás', level: 1, text: 'Elvégzi a drain gondozását, a drainált sebek ellátását.' },
  { id: 'k200', group: 'Alap- és szakápolás', sub: 'Sztóma', level: 2, text: 'Ellátja a sztomaterápia és a különböző célt szolgáló drének kezelésének szakápolási feladatait.' },
  { id: 'k201', group: 'Alap- és szakápolás', sub: 'Sztóma', level: 1, text: 'Enterostomák helyét meghatározza, a stoma állapotát felméri, a meglévő stomát ápolja, stomairrigálást végez.' },
  { id: 'k202', group: 'Alap- és szakápolás', sub: 'Sztóma', level: 2, text: 'Beöntést ad sztómán keresztül.' },
  { id: 'k203', group: 'Alap- és szakápolás', sub: 'Vizeletürítés', level: 1, text: 'A vizeletürítés szükségletével kapcsolatos ápolói feladatok irányítását végzi.' },
  { id: 'k204', group: 'Alap- és szakápolás', sub: 'Vizeletürítés', level: 1, text: 'Elvégzi a katéterezés elrendelését, a katéter ápolását, eltávolítását; az önkatéterezést és a hólyagtréninget oktatja; az urostomát és a suprapubikus katétert ápolja.' },
  { id: 'k205', group: 'Alap- és szakápolás', sub: 'Vizeletürítés', level: 2, text: 'Elrendeli az inkontinencia segédeszközeinek felírását.' },
  { id: 'k206', group: 'Alap- és szakápolás', sub: 'Vizeletürítés', level: 4, text: 'Asszisztál invazív beavatkozásoknál (vizeletkatéter).' },
  { id: 'k207', group: 'Alap- és szakápolás', sub: 'Vizeletürítés', level: 1, text: 'Elvégzi az intermittáló katéterezést.' },
  { id: 'k208', group: 'Alap- és szakápolás', sub: 'Vizeletürítés', level: 3, text: 'Állandó katéterezést végez.' },
  { id: 'k209', group: 'Alap- és szakápolás', sub: 'Vizeletürítés', level: 2, text: 'Felkészíti a beteget dialízisre, segédkezik peritoneális dialízisnél, gondozza a dializáló kanült.' },
  { id: 'k210', group: 'Alap- és szakápolás', sub: 'Székletürítés', level: 1, text: 'A székletürítés szükségleteivel kapcsolatos ápolói feladatokat ellátja, a skybalumot eltávolítja.' },
  { id: 'k211', group: 'Alap- és szakápolás', sub: 'Székletürítés', level: 1, text: 'Elvégzi a különböző székletmintavételeket és vizsgálatokat, obstipatio esetén önállóan dönt a szükséges terápiáról.' },
  { id: 'k212', group: 'Alap- és szakápolás', sub: 'Székletürítés', level: 3, text: 'Alkalmazza az irrigálást.' },
  { id: 'k213', group: 'Alap- és szakápolás', sub: 'Beavatkozások', level: 2, text: 'Elvégzi a speciális invazív beavatkozásokat.' },
  { id: 'k214', group: 'Alap- és szakápolás', sub: 'Beavatkozások', level: 2, text: 'Asszisztál punkciók esetén, a punkciók utáni szakápolási feladatokat ellátja.' },
  { id: 'k215', group: 'Alap- és szakápolás', sub: 'Beavatkozások', level: 1, text: 'Elrendeli az egyes minimál invazív eljárásokat (perifériás rövid kanül behelyezés, gyógyszer nélküli folyadékpótlás, alacsony áramlású oxigénterápia) és egyes gyógyászati segédeszközöket.' },
  { id: 'k216', group: 'Alap- és szakápolás', sub: 'Beavatkozások', level: 1, text: 'Behelyezi, használja, ápolja és eltávolítja a perifériás rövid kanült, az intraosszeális kanült; centrális vénás kanül esetén asszisztál a beavatkozáshoz.' },
  { id: 'k217', group: 'Alap- és szakápolás', sub: 'Beavatkozások', level: 2, text: 'Kanülön keresztül juttatja be a gyógyszert.' },
  { id: 'k218', group: 'Alap- és szakápolás', sub: 'Beavatkozások', level: 3, text: 'Gondozza az artériás kanült, az EDA-t és a PCA-t.' },
  { id: 'k219', group: 'Alap- és szakápolás', sub: 'Beavatkozások', level: 2, text: 'Elvégzi a gyomoröblítést.' },
  { id: 'k220', group: 'Alap- és szakápolás', sub: 'Beavatkozások', level: 3, text: 'Elvégzi a hascsapolást.' },
  { id: 'k221', group: 'Alap- és szakápolás', sub: 'Palliatív ellátás', level: 1, text: 'Ápolja a terminális állapotban lévő betegeket.' },
  { id: 'k222', group: 'Alap- és szakápolás', sub: 'Palliatív ellátás', level: 1, text: 'Ellátja a haldokló beteget, és megállapítja a biológiai halál tényét.' },
  { id: 'k223', group: 'Alap- és szakápolás', sub: 'Palliatív ellátás', level: 1, text: 'Támogatja a daganatos beteget és családját a haldoklás különböző szakaszaiban.' },
  { id: 'k224', group: 'Alap- és szakápolás', sub: 'Palliatív ellátás', level: 1, text: 'Tájékoztatást nyújt a hospice ellátásról, az otthoni szakápolási szolgálatról és a szociális gondoskodás formáiról.' },
  { id: 'k225', group: 'Alap- és szakápolás', sub: 'Palliatív ellátás', level: 2, text: 'Együttműködik a hospice team munkájában.' },
  { id: 'k226', group: 'Sürgősségi ellátás és eszközhasználat', sub: null, level: 1, text: 'Akut történések elsődleges ellátását követően szakambulanciára irányítja a beteget.' },
  { id: 'k227', group: 'Sürgősségi ellátás és eszközhasználat', sub: null, level: 1, text: 'Felméri a helyszín biztonságosságát, tájékozódik a helyszíni körülményekről.' },
  { id: 'k228', group: 'Sürgősségi ellátás és eszközhasználat', sub: null, level: 1, text: 'A beteget állapotának megfelelő testhelyzetbe hozza, mozgatja, alkalmazza a műfogásokat.' },
  { id: 'k229', group: 'Sürgősségi ellátás és eszközhasználat', sub: null, level: 1, text: 'Alkalmazza azokat az eszköz nélküli és eszközös beavatkozásokat, amelyek hirtelen bekövetkezett egészségkárosodás esetén a beteg életét megmenthetik.' },
  { id: 'k230', group: 'Sürgősségi ellátás és eszközhasználat', sub: null, level: 1, text: 'Alkalmazza a vérzéscsillapítási eljárást, ellátja a hőhatás okozta sérülést, elvégzi az elsődleges sebellátást.' },
  { id: 'k231', group: 'Sürgősségi ellátás és eszközhasználat', sub: null, level: 1, text: 'Alkalmazza a kötözéseket, rögzíti a rándulásokat, ficamokat, töréseket.' },
  { id: 'k232', group: 'Sürgősségi ellátás és eszközhasználat', sub: null, level: 2, text: 'Közreműködik az életet veszélyeztető ritmuszavarok emelt szintű ellátásában.' },
  { id: 'k233', group: 'Sürgősségi ellátás és eszközhasználat', sub: null, level: 1, text: 'Az újraélesztés során alkalmazza a szükséges eszközöket és gyógyszereket.' },
  { id: 'k234', group: 'Sürgősségi ellátás és eszközhasználat', sub: null, level: 1, text: 'Műfogásokkal és eszközökkel biztosítja és fenntartja a légúti átjárhatóságot.' },
  { id: 'k235', group: 'Sürgősségi ellátás és eszközhasználat', sub: null, level: 2, text: 'Kivitelezi a légzés asszisztált támogatását vagy kontrollált pótlását, megválasztja a gépi lélegeztetési módot.' },
  { id: 'k236', group: 'Sürgősségi ellátás és eszközhasználat', sub: null, level: 2, text: 'Megfigyeli és ellátja a lélegeztetett beteget; a lélegeztetésről történő leszoktatást, a légúti váladékleszívást, a mintavételt és a mellkasi fizioterápiát elrendeli és kivitelezi.' },
  { id: 'k237', group: 'Sürgősségi ellátás és eszközhasználat', sub: null, level: 4, text: 'Közreműködik a katasztrófa-egészségügyi ellátásban.' },
  { id: 'k238', group: 'Sürgősségi ellátás és eszközhasználat', sub: null, level: 4, text: 'Közreműködik a sürgősségi esetek, szövődmények ellátásában.' },
  { id: 'k239', group: 'Sürgősségi ellátás és eszközhasználat', sub: null, level: 2, text: 'A beteg szállításra történő előkészítésében segédkezik.' },
  { id: 'k240', group: 'Sürgősségi ellátás és eszközhasználat', sub: null, level: 2, text: 'Segédkezik a tömeges baleset felszámolásában.' },
  { id: 'k241', group: 'Dokumentáció', sub: null, level: 1, text: 'Az ápolási és gondozási munkát fejleszti, értékeli és visszajelzést ad.' },
  { id: 'k242', group: 'Dokumentáció', sub: null, level: 1, text: 'A szakterületén elvárt dokumentációt pontosan vezeti, megfelelő minőségű adatokat szolgáltat, alkalmazza a szakterületi informatikai programokat.' },
  { id: 'k243', group: 'Dokumentáció', sub: null, level: 1, text: 'Adatvédelmi szabályokat betartja.' },
  { id: 'k244', group: 'Dokumentáció', sub: null, level: 1, text: 'Felelősséget vállal a munkája során dokumentált adatokért, az egészségügyi dokumentáció naprakész hitelességéért.' },
  { id: 'k245', group: 'Döntéshozatal és szakmai felelősség', sub: null, level: 1, text: 'A korlátozó intézkedést elrendeli és kivitelezi (ha orvos nincs jelen), a jogszabályban meghatározott esetekben.' },
  { id: 'k246', group: 'Döntéshozatal és szakmai felelősség', sub: null, level: 1, text: 'A betegellátásban komplex, kiterjesztett hatáskörrel járó önálló munkát végez, ahol a szabályozás ezt lehetővé teszi.' },
  { id: 'k247', group: 'Döntéshozatal és szakmai felelősség', sub: null, level: 1, text: 'A betegekkel kapcsolatos oktatási és szakápolási feladatokat önállóan elvégzi az ellátás minden szintjén.' },
  { id: 'k248', group: 'Döntéshozatal és szakmai felelősség', sub: null, level: 2, text: 'Krónikus kórállapotok esetében az időkorláton belül a gyógyszeres terápiát módosítja, kiegészíti.' },
  { id: 'k249', group: 'Döntéshozatal és szakmai felelősség', sub: null, level: 2, text: 'A betegvizsgálattal, diagnózisalkotással, terápiás eljárásokkal kapcsolatos kiterjesztett hatáskörű ápolói munkát végez.' },
  { id: 'k250', group: 'Döntéshozatal és szakmai felelősség', sub: null, level: 1, text: 'Felelősséget vállal az önállóan végzett diagnosztikus és terápiás vizsgálatok, beavatkozások elvégzéséért és értékeléséért.' },
  { id: 'k251', group: 'Döntéshozatal és szakmai felelősség', sub: null, level: 1, text: 'Felismeri és kezeli saját szakmai határait, nehézségeit.' },
  { id: 'k252', group: 'Döntéshozatal és szakmai felelősség', sub: null, level: 1, text: 'Munkáját hivatásszerűen, felelősen, önállóan vagy team tagjaként végzi.' },
  { id: 'k253', group: 'Döntéshozatal és szakmai felelősség', sub: null, level: 1, text: 'Vezetői szerepet tölt és tölthet be; a paramedicinális ellátó team munkájában szervezeti egység szintjén vezetői feladatot lát el.' },
  { id: 'k254', group: 'Döntéshozatal és szakmai felelősség', sub: null, level: 1, text: 'Felelős a vonatkozó szakmai irányelvek és jogszabályok megismeréséért és betartásáért.' },
  { id: 'k255', group: 'Döntéshozatal és szakmai felelősség', sub: null, level: 1, text: 'Vezeti a szakmai gyakorlatot, szervezi a gyakorlati oktatást.' },
  { id: 'k256', group: 'Döntéshozatal és szakmai felelősség', sub: null, level: 2, text: 'Megtervezi és elvégzi a klinikai kutatásokat.' },
  { id: 'k257', group: 'Prevenció és gondozás', sub: null, level: 1, text: 'Érvényre juttatja a modern ismereteket a prevenció minden területén.' },
  { id: 'k258', group: 'Prevenció és gondozás', sub: null, level: 1, text: 'Közreműködik másodlagos prevenciós tevékenységben.' },
  { id: 'k259', group: 'Prevenció és gondozás', sub: null, level: 4, text: 'Közreműködik harmadlagos prevenciós tevékenységben.' },
  { id: 'k260', group: 'Prevenció és gondozás', sub: null, level: 3, text: 'Közreműködik a rehabilitációs team munkájában.' },
  { id: 'k261', group: 'Prevenció és gondozás', sub: null, level: 2, text: 'Elrendeli és felírja a védőoltásokat.' },
  { id: 'k262', group: 'Prevenció és gondozás', sub: null, level: 3, text: 'Elvégzi a védőoltások menedzselését.' },
  { id: 'k263', group: 'Prevenció és gondozás', sub: null, level: 1, text: 'Egyéni és közösségi szinten a lakosság egészségi állapotát felméri, a prioritásokat meghatározza, a hatékony beavatkozásokat megtervezi, végrehajtja.' },
  { id: 'k264', group: 'Prevenció és gondozás', sub: null, level: 1, text: 'Személyre szabott egészségtervet állít fel, egészségtanácsadást végez.' },
  { id: 'k265', group: 'Prevenció és gondozás', sub: null, level: 1, text: 'Megszervezi és végrehajtja a komplex egészségfejlesztési projekteket, elvégzi az általa ellátottak egészségi állapotának folyamatos monitorozását.' },
  { id: 'k266', group: 'Prevenció és gondozás', sub: null, level: 1, text: 'Szervezi az egészség megőrzésére törekvő rendezvényeket, elvégzi a szűréseket, azonosítja a rizikófaktorokat.' },
  { id: 'k267', group: 'Prevenció és gondozás', sub: null, level: 1, text: 'Szűréseket elrendel és kivitelez.' },
  { id: 'k268', group: 'Prevenció és gondozás', sub: null, level: 1, text: 'Elvégzi a dohányzásról való leszokás támogatását minimál intervencióval.' },
  { id: 'k269', group: 'Prevenció és gondozás', sub: null, level: 1, text: 'Elvégzi a helyes táplálkozásra, fizikai aktivitásra és alkoholfogyasztásra vonatkozó tanácsadást, programszervezést.' },
  { id: 'k270', group: 'Prevenció és gondozás', sub: null, level: 2, text: 'Felismeri és megfelelően integrálja az ellátórendszerben az addikcióval küzdő beteget; a rizikó- és protektív faktorokat elkülöníti.' },
  { id: 'k271', group: 'Prevenció és gondozás', sub: null, level: 2, text: 'Felismeri a deviáns magatartást, és a pácienst a megfelelő ellátórendszerbe irányítja.' },
  { id: 'k272', group: 'Prevenció és gondozás', sub: null, level: 1, text: 'A krónikus beteg gondozását megtervezi, kivitelezi, értékeli a szakmai standardok szerint, az egyes krónikus gondozási, idősgondozási és palliatív területeknek megfelelően.' },
  { id: 'k273', group: 'Prevenció és gondozás', sub: null, level: 1, text: 'A gondozási csoportokat kialakítja, nyomon követi.' },
  { id: 'k274', group: 'Prevenció és gondozás', sub: null, level: 1, text: 'Munkahelyén nyomon követi és ellenőrzi a nosocomialis infekciók megelőzésével kapcsolatos szabályokat, a higiénés szemlén részt vesz.' },
]

/** A főcsoportok a rendelet szerinti sorrendben. */
export const GROUPS: string[] = Array.from(new Set(COMPETENCIES.map((c) => c.group)))

export const countByLevel = (list: Competency[] = COMPETENCIES): Record<Level, number> => {
  const r = { 1: 0, 2: 0, 3: 0, 4: 0 } as Record<Level, number>
  for (const c of list) r[c.level]++
  return r
}

/**
 * Egyszerű, ékezet-tűrő keresés a tevékenységek szövegében.
 * A magyar ékezetek levágása azért kell, hogy a „legutbiztositas" is találjon.
 */
const fold = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export function searchCompetencies(q: string, list: Competency[] = COMPETENCIES): Competency[] {
  const needle = fold(q.trim())
  if (needle.length < 2) return []
  return list.filter(
    (c) => fold(c.text).includes(needle) || fold(c.group).includes(needle) || fold(c.sub ?? '').includes(needle),
  )
}

/** A rendelet hivatkozási adatai — a felületen mindenhol ezt idézzük. */
export const SOURCE = {
  id: '13/2025. (IV. 17.) BM rendelet',
  title: 'az egészségügyi tevékenység végzéséhez kapcsolódó egészségügyi szakdolgozói kompetenciák keretrendszeréről',
  inForce: '2025. április 18.',
  column: 'Okleveles Ápoló és Kiterjesztett hatáskörű ápoló (MSc), MKKR 7. szint',
  url: 'https://net.jogtar.hu/jogszabaly?docid=a2500013.bm',
}
