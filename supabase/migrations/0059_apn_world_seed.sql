-- APN-MED — APN World kezdő adatkészlet.
--
-- Kilenc ország, amelyekre megbízható forrás áll rendelkezésre. A
-- specifikációban felsorolt többi ország szándékosan kimarad: csak
-- ellenőrzött, hivatkozott adat kerülhet be. Az adminisztrátori felületen
-- bármikor felvehetők, ahogy a forrás előkerül.
--
-- Előfeltétel: a 0058 lefutott.

-- ── Egyesült Államok ──
insert into public.apn_countries (
  code, name, name_en, flag, region, status, data_confidence, roles, education, regulation, scope, prescribing, prescribing_note, autonomy, autonomy_note, primary_care, primary_care_areas, hospital_areas, strengths, challenges, description, why_interesting, last_verified, publish_status
) values (
  'US',
  'Egyesült Államok',
  'United States',
  '🇺🇸',
  'north_america',
  'established',
  'high',
  '[{"name": "Nurse Practitioner", "abbr": "NP"}, {"name": "Clinical Nurse Specialist", "abbr": "CNS"}, {"name": "Certified Registered Nurse Anesthetist", "abbr": "CRNA"}, {"name": "Certified Nurse Midwife", "abbr": "CNM"}]'::jsonb,
  '{"level": "Mesterfokozat vagy doktori fokozat", "master_required": true, "doctoral_pathway": true, "certification": "Országos szakmai vizsga", "registration": "Tagállami engedély", "recertification": "Rendszeres megújítás", "note": "A doktori út (DNP) egyre elterjedtebb, de nem kötelező."}'::jsonb,
  '{"level": "Tagállami", "protected_title": true, "registration": true, "scope_regulated": true, "prescribing_regulated": true, "since": "1965", "note": "Nincs szövetségi egységes szabályozás; a hatáskört a tagállami ápolói testület adja."}'::jsonb,
  '{"assessment": {"v": "yes", "scope": "national"}, "physical_exam": {"v": "yes", "scope": "national"}, "diagnosis": {"v": "yes", "scope": "national"}, "differential": {"v": "yes", "scope": "national"}, "labs": {"v": "yes", "scope": "national"}, "imaging": {"v": "yes", "scope": "national"}, "interpretation": {"v": "yes", "scope": "national"}, "treatment_init": {"v": "yes", "scope": "national"}, "treatment_mod": {"v": "yes", "scope": "national"}, "prescribing": {"v": "conditional", "scope": "regional", "note": "Teljes önállóságú államokban önálló felírás kábító hatású szerekre is; máshol korlátozott."}, "referral": {"v": "yes", "scope": "national"}, "admission": {"v": "conditional", "scope": "institutional", "note": "Intézményi jogosultságtól függ."}, "discharge": {"v": "yes", "scope": "national"}, "independent": {"v": "conditional", "scope": "regional", "note": "Az államok mintegy felében teljes önállóság; máshol együttműködési szerződés vagy felügyelet szükséges."}}'::jsonb,
  'conditional',
  'Teljes önállóságú államokban független felírás, a többiben együttműködési szerződéshez kötött. A pontos szám vitatott: a források 26 és 30 közötti értéket adnak, mert eltérően számolják az elfogadott, de még nem hatályos törvényeket.',
  'high',
  'Tagállamonként eltérő. Ugyanaz a végzettség két szomszédos államban mást jelent a gyakorlatban.',
  'very_high',
  array['Krónikus betegségek gondozása', 'Megelőzés és szűrés', 'Akut alapellátás', 'Mentálhigiéné'],
  array['Sürgősségi', 'Intenzív terápia', 'Aneszteziológia', 'Onkológia', 'Szakrendelés'],
  array['Nagy léptékű, kiforrott rendszer', 'Önálló praxis lehetősége', 'Vidéki és ellátatlan térségekben gyakran ő az elsődleges ellátó'],
  array['A tagállami eltérések nehezítik a mobilitást', 'Az együttműködési szerződések több államban díjjal járnak'],
  'A világ legnagyobb és egyik legrégebbi APN-rendszere. A szerepkör az 1960-as években indult, a mai keret az 1990-es évektől áll fenn.',
  'A hatáskör nem országos, hanem tagállami kérdés. Ez élő természetes kísérlet: ugyanaz a képzettség eltérő jogi környezetben, ami lehetővé teszi az ellátási következmények összevetését.',
  '2026-09-07'::date, 'published'
) on conflict (code) do nothing;

insert into public.apn_sources (country_id, title, org, url, accessed_on)
select id, 'State Practice Environment', 'American Association of Nurse Practitioners', 'https://www.aanp.org/advocacy/state/state-practice-environment', current_date
from public.apn_countries where code = 'US'
on conflict do nothing;
insert into public.apn_sources (country_id, title, org, url, accessed_on)
select id, 'Nursing Regulation', 'International Council of Nurses', 'https://www.icn.ch/nursing-policy/nursing-regulation', current_date
from public.apn_countries where code = 'US'
on conflict do nothing;

-- ── Egyesült Királyság ──
insert into public.apn_countries (
  code, name, name_en, flag, region, status, data_confidence, roles, education, regulation, scope, prescribing, prescribing_note, autonomy, autonomy_note, primary_care, primary_care_areas, hospital_areas, strengths, challenges, description, why_interesting, last_verified, publish_status
) values (
  'GB',
  'Egyesült Királyság',
  'United Kingdom',
  '🇬🇧',
  'europe',
  'developing',
  'high',
  '[{"name": "Advanced Clinical Practitioner", "abbr": "ACP"}, {"name": "Advanced Nurse Practitioner", "abbr": "ANP"}]'::jsonb,
  '{"level": "Mesterfokozat vagy azzal egyenértékű", "master_required": true, "doctoral_pathway": false, "certification": "Nincs országos vizsga", "registration": "Nincs külön nyilvántartás", "note": "A képzés négy pilléren nyugszik: klinikum, vezetés, oktatás, kutatás."}'::jsonb,
  '{"level": "Országos keretrendszer, de nem kötelező", "protected_title": false, "registration": false, "scope_regulated": false, "prescribing_regulated": true, "since": "2017", "note": "A cím nem védett; a szakma maga szorgalmazza az egységesítést."}'::jsonb,
  '{"assessment": {"v": "yes", "scope": "national"}, "physical_exam": {"v": "yes", "scope": "national"}, "diagnosis": {"v": "yes", "scope": "national"}, "differential": {"v": "yes", "scope": "national"}, "labs": {"v": "yes", "scope": "national"}, "imaging": {"v": "yes", "scope": "national"}, "interpretation": {"v": "yes", "scope": "national"}, "treatment_init": {"v": "yes", "scope": "national"}, "treatment_mod": {"v": "yes", "scope": "national"}, "prescribing": {"v": "conditional", "scope": "national", "note": "Külön képesítéssel önálló felíró lehet."}, "referral": {"v": "yes", "scope": "national"}, "admission": {"v": "conditional", "scope": "institutional"}, "discharge": {"v": "yes", "scope": "national"}, "independent": {"v": "conditional", "scope": "institutional", "note": "A hatáskört a munkáltató és a helyi megállapodás határozza meg; nincs egységes nyilvántartás."}}'::jsonb,
  'broad',
  'Külön képzéssel önálló felíróvá válhat, ami a legtöbb gyógyszerre kiterjed.',
  'high',
  'A gyakorlatban széles, de intézményenként eltér.',
  'high',
  array['Háziorvosi rendelők', 'Közösségi ellátás', 'Akut alapellátás'],
  array['Sürgősségi', 'Intenzív terápia', 'Mentés', 'Szakrendelés'],
  array['Kiterjedt gyakorlati alkalmazás', 'Rugalmas, intézményhez igazítható'],
  array['Nincs védett cím és önálló nyilvántartás', 'A szerepkör tartalma intézményenként eltér'],
  'Széles körben alkalmazott szerepkör országos keretrendszerrel, de kötelező szabályozás nélkül.',
  'Példa arra, hogy kiterjedt gyakorlat kialakulhat védett cím nélkül is. A rugalmasság ára a kiszámíthatatlanság: a betegnek és a munkáltatónak sem egyértelmű, mit jelent a cím.',
  '2026-09-07'::date, 'published'
) on conflict (code) do nothing;

insert into public.apn_sources (country_id, title, org, url, accessed_on)
select id, 'Multi-professional framework for advanced clinical practice in England', 'NHS England', 'https://advanced-practice.hee.nhs.uk/', current_date
from public.apn_countries where code = 'GB'
on conflict do nothing;

-- ── Hollandia ──
insert into public.apn_countries (
  code, name, name_en, flag, region, status, data_confidence, roles, education, regulation, scope, prescribing, prescribing_note, autonomy, autonomy_note, primary_care, primary_care_areas, hospital_areas, strengths, challenges, description, why_interesting, last_verified, publish_status
) values (
  'NL',
  'Hollandia',
  'Netherlands',
  '🇳🇱',
  'europe',
  'established',
  'high',
  '[{"name": "Verpleegkundig specialist", "abbr": "VS"}]'::jsonb,
  '{"level": "Kétéves duális mesterképzés", "master_required": true, "doctoral_pathway": false, "certification": "Szakmai nyilvántartásba vétel", "registration": "Kötelező", "recertification": "Ötévente", "note": "Duális képzés: egyszerre tanulás és fizetett klinikai munka."}'::jsonb,
  '{"level": "Országos", "protected_title": true, "registration": true, "scope_regulated": true, "prescribing_regulated": true, "since": "2009", "note": "Törvényben nevesített, önálló szerepkör 2012-től."}'::jsonb,
  '{"assessment": {"v": "yes", "scope": "national"}, "physical_exam": {"v": "yes", "scope": "national"}, "diagnosis": {"v": "yes", "scope": "national"}, "differential": {"v": "yes", "scope": "national"}, "labs": {"v": "yes", "scope": "national"}, "imaging": {"v": "yes", "scope": "national"}, "interpretation": {"v": "yes", "scope": "national"}, "treatment_init": {"v": "yes", "scope": "national"}, "treatment_mod": {"v": "yes", "scope": "national"}, "prescribing": {"v": "yes", "scope": "national"}, "referral": {"v": "yes", "scope": "national"}, "admission": {"v": "conditional", "scope": "institutional"}, "discharge": {"v": "yes", "scope": "national"}, "independent": {"v": "yes", "scope": "national"}}'::jsonb,
  'independent',
  'Önálló felírási jog a saját szakterületén belül.',
  'high',
  'Meghatározott beavatkozásokat saját jogon végezhet, orvosi utasítás nélkül.',
  'high',
  array['Háziorvosi praxis', 'Krónikus gondozás', 'Idősellátás'],
  array['Szakellátás', 'Mentálhigiéné', 'Onkológia'],
  array['Törvényi keret és védett cím', 'Duális képzés: nem kell kilépni a rendszerből'],
  array['A képzőhelyek kapacitása korlátozza a létszámbővülést'],
  'Törvényben nevesített, önálló hatáskörű szerepkör, kötelező nyilvántartással.',
  'A duális képzés — tanulás munka mellett, fizetéssel — a bevezetés egyik kulcsa volt. A továbbtanuláshoz nem kellett kilépni az ellátórendszerből.',
  '2026-09-07'::date, 'published'
) on conflict (code) do nothing;

insert into public.apn_sources (country_id, title, org, url, accessed_on)
select id, 'Advanced practice nursing in the European Union: A scoping review', 'Nursing Outlook', 'https://www.sciencedirect.com/science/article/pii/S0029655425002416', current_date
from public.apn_countries where code = 'NL'
on conflict do nothing;

-- ── Írország ──
insert into public.apn_countries (
  code, name, name_en, flag, region, status, data_confidence, roles, education, regulation, scope, prescribing, prescribing_note, autonomy, autonomy_note, primary_care, primary_care_areas, hospital_areas, strengths, challenges, description, why_interesting, last_verified, publish_status
) values (
  'IE',
  'Írország',
  'Ireland',
  '🇮🇪',
  'europe',
  'established',
  'high',
  '[{"name": "Registered Advanced Nurse Practitioner", "abbr": "RANP"}]'::jsonb,
  '{"level": "Mesterfokozat", "master_required": true, "doctoral_pathway": false, "certification": "Szakmai testületi nyilvántartás", "registration": "Kötelező", "note": "Meghatározott klinikai gyakorlat is szükséges a nyilvántartásba vételhez."}'::jsonb,
  '{"level": "Országos", "protected_title": true, "registration": true, "scope_regulated": true, "prescribing_regulated": true, "since": "2001", "note": "A hatáskört a szakmai testület határozza meg, nem az egyes munkáltató."}'::jsonb,
  '{"assessment": {"v": "yes", "scope": "national"}, "physical_exam": {"v": "yes", "scope": "national"}, "diagnosis": {"v": "yes", "scope": "national"}, "differential": {"v": "yes", "scope": "national"}, "labs": {"v": "yes", "scope": "national"}, "imaging": {"v": "yes", "scope": "national"}, "interpretation": {"v": "yes", "scope": "national"}, "treatment_init": {"v": "yes", "scope": "national"}, "treatment_mod": {"v": "yes", "scope": "national"}, "prescribing": {"v": "yes", "scope": "national"}, "referral": {"v": "yes", "scope": "national"}, "admission": {"v": "conditional", "scope": "institutional"}, "discharge": {"v": "yes", "scope": "national"}, "independent": {"v": "yes", "scope": "national"}}'::jsonb,
  'independent',
  'Külön képesítéssel önálló felírás és képalkotás rendelése.',
  'high',
  'Külön nyilvántartás és védett cím.',
  'moderate',
  array['Krónikus betegellátás', 'Közösségi ellátás'],
  array['Sürgősségi', 'Onkológia', 'Gyermekellátás', 'Szakrendelés'],
  array['Védett cím és önálló nyilvántartás', 'Következetes szakmai szint'],
  array['A nyilvántartásba vétel folyamata hosszadalmas'],
  'Külön nyilvántartásba vett, védett című szerepkör, testületi hatáskör-meghatározással.',
  'A védett cím és az önálló nyilvántartás következetes szakmai szintet teremt: a betegnek és a munkáltatónak sem kell találgatnia, mit jelent a cím.',
  '2026-09-07'::date, 'published'
) on conflict (code) do nothing;

insert into public.apn_sources (country_id, title, org, url, accessed_on)
select id, 'Advanced Practice (Nursing) Standards and Requirements', 'Nursing and Midwifery Board of Ireland', 'https://www.nmbi.ie/', current_date
from public.apn_countries where code = 'IE'
on conflict do nothing;

-- ── Ausztrália ──
insert into public.apn_countries (
  code, name, name_en, flag, region, status, data_confidence, roles, education, regulation, scope, prescribing, prescribing_note, autonomy, autonomy_note, primary_care, primary_care_areas, hospital_areas, strengths, challenges, description, why_interesting, last_verified, publish_status
) values (
  'AU',
  'Ausztrália',
  'Australia',
  '🇦🇺',
  'oceania',
  'established',
  'high',
  '[{"name": "Nurse Practitioner", "abbr": "NP"}]'::jsonb,
  '{"level": "Mesterfokozat", "master_required": true, "doctoral_pathway": false, "certification": "Országos nyilvántartás (endorsement)", "registration": "Kötelező", "note": "Jelentős haladó klinikai gyakorlat is szükséges."}'::jsonb,
  '{"level": "Országos", "protected_title": true, "registration": true, "scope_regulated": true, "prescribing_regulated": true, "since": "2000", "note": "A szövetségi rendszer ellenére egyetlen nyilvántartás és szabályozó testület."}'::jsonb,
  '{"assessment": {"v": "yes", "scope": "national"}, "physical_exam": {"v": "yes", "scope": "national"}, "diagnosis": {"v": "yes", "scope": "national"}, "differential": {"v": "yes", "scope": "national"}, "labs": {"v": "yes", "scope": "national"}, "imaging": {"v": "yes", "scope": "national"}, "interpretation": {"v": "yes", "scope": "national"}, "treatment_init": {"v": "yes", "scope": "national"}, "treatment_mod": {"v": "yes", "scope": "national"}, "prescribing": {"v": "yes", "scope": "national"}, "referral": {"v": "yes", "scope": "national"}, "admission": {"v": "yes", "scope": "national"}, "discharge": {"v": "yes", "scope": "national"}, "independent": {"v": "yes", "scope": "national"}}'::jsonb,
  'independent',
  'Önálló felírási jog, az állami gyógyszertámogatási rendszerhez való hozzáféréssel.',
  'high',
  'Önállóan diagnosztizál, kezel, beutal és rendel vizsgálatot.',
  'high',
  array['Alapellátás', 'Távoli és vidéki térségek', 'Krónikus gondozás'],
  array['Sürgősségi', 'Szakrendelés', 'Mentálhigiéné'],
  array['Országosan egységes keret', 'Hozzáférés az állami támogatási rendszerhez'],
  array['A létszám a szükségleteknél lassabban nő'],
  'Országosan egységes, védett című szerepkör, önálló felírási joggal.',
  'Az országos egységesség tudatos döntés volt: a szövetségi berendezkedés ellenére egyetlen nyilvántartás működik. Ez ellenpont az amerikai és kanadai széttagoltsághoz.',
  '2026-09-07'::date, 'published'
) on conflict (code) do nothing;

insert into public.apn_sources (country_id, title, org, url, accessed_on)
select id, 'Nurse practitioner standards for practice', 'Nursing and Midwifery Board of Australia', 'https://www.nursingmidwiferyboard.gov.au/', current_date
from public.apn_countries where code = 'AU'
on conflict do nothing;

-- ── Kanada ──
insert into public.apn_countries (
  code, name, name_en, flag, region, status, data_confidence, roles, education, regulation, scope, prescribing, prescribing_note, autonomy, autonomy_note, primary_care, primary_care_areas, hospital_areas, strengths, challenges, description, why_interesting, last_verified, publish_status
) values (
  'CA',
  'Kanada',
  'Canada',
  '🇨🇦',
  'north_america',
  'established',
  'high',
  '[{"name": "Nurse Practitioner", "abbr": "NP"}, {"name": "Infirmière praticienne spécialisée", "abbr": "IPS"}]'::jsonb,
  '{"level": "Mesterfokozat", "master_required": true, "doctoral_pathway": false, "certification": "Tartományi vizsga", "registration": "Tartományi engedély", "note": "A képzési követelmény országosan összehangolt."}'::jsonb,
  '{"level": "Tartományi", "protected_title": true, "registration": true, "scope_regulated": true, "prescribing_regulated": true, "since": "1970-es évek", "note": "A tartományi eltérések ellenére a szakmai tartalom hasonló."}'::jsonb,
  '{"assessment": {"v": "yes", "scope": "national"}, "physical_exam": {"v": "yes", "scope": "national"}, "diagnosis": {"v": "yes", "scope": "national"}, "differential": {"v": "yes", "scope": "national"}, "labs": {"v": "yes", "scope": "national"}, "imaging": {"v": "yes", "scope": "national"}, "interpretation": {"v": "yes", "scope": "national"}, "treatment_init": {"v": "yes", "scope": "national"}, "treatment_mod": {"v": "yes", "scope": "national"}, "prescribing": {"v": "yes", "scope": "regional", "note": "A legtöbb tartományban kábító hatású szerekre is kiterjed."}, "referral": {"v": "yes", "scope": "national"}, "admission": {"v": "yes", "scope": "national"}, "discharge": {"v": "yes", "scope": "national"}, "independent": {"v": "conditional", "scope": "regional", "note": "Tartományonként eltérő; több helyen önálló praxis is nyitható."}}'::jsonb,
  'broad',
  'Önálló felírási jog, a legtöbb tartományban kábító hatású szerekre is.',
  'high',
  'Mindenütt önálló diagnosztizálás és kezelés.',
  'very_high',
  array['Alapellátás', 'Közösségi ellátás', 'Északi és távoli térségek'],
  array['Sürgősségi', 'Intenzív terápia', 'Szakrendelés'],
  array['Összehangolt képzési követelmény', 'Erős alapellátási szerep'],
  array['A tartományi engedélyek közötti átjárás nehézkes'],
  'Tartományonként szabályozott, de szakmai tartalmában egységes rendszer.',
  'Középút az amerikai széttagoltság és az ausztrál egységesség között: a szabályozás tartományi, de a képzési követelmény országosan összehangolt.',
  '2026-09-07'::date, 'published'
) on conflict (code) do nothing;

insert into public.apn_sources (country_id, title, org, url, accessed_on)
select id, 'Nurse Practitioner Practice in Canada', 'Canadian Nurses Association', 'https://www.cna-aiic.ca/', current_date
from public.apn_countries where code = 'CA'
on conflict do nothing;

-- ── Franciaország ──
insert into public.apn_countries (
  code, name, name_en, flag, region, status, data_confidence, roles, education, regulation, scope, prescribing, prescribing_note, autonomy, autonomy_note, primary_care, primary_care_areas, hospital_areas, strengths, challenges, description, why_interesting, last_verified, publish_status
) values (
  'FR',
  'Franciaország',
  'France',
  '🇫🇷',
  'europe',
  'developing',
  'high',
  '[{"name": "Infirmier en pratique avancée", "abbr": "IPA"}]'::jsonb,
  '{"level": "Kétéves állami mesterképzés (120 ECTS)", "master_required": true, "doctoral_pathway": false, "certification": "Állami diploma", "registration": "Kötelező", "note": "Előzetesen legalább három év ápolói gyakorlat szükséges."}'::jsonb,
  '{"level": "Országos", "protected_title": true, "registration": true, "scope_regulated": true, "prescribing_regulated": true, "since": "2018", "note": "A hatáskör meghatározott szakterületekre korlátozódik."}'::jsonb,
  '{"assessment": {"v": "yes", "scope": "national"}, "physical_exam": {"v": "yes", "scope": "national"}, "diagnosis": {"v": "conditional", "scope": "conditional", "note": "Orvosi együttműködés keretében."}, "differential": {"v": "conditional", "scope": "conditional"}, "labs": {"v": "conditional", "scope": "conditional", "note": "Meghatározott körben, a beteg orvosi átadása után."}, "imaging": {"v": "conditional", "scope": "conditional"}, "interpretation": {"v": "conditional", "scope": "conditional"}, "treatment_init": {"v": "conditional", "scope": "conditional"}, "treatment_mod": {"v": "conditional", "scope": "conditional"}, "prescribing": {"v": "conditional", "scope": "conditional", "note": "Meglévő kezelés folytatása és megújítása."}, "referral": {"v": "conditional", "scope": "conditional"}, "admission": {"v": "no", "scope": "national"}, "discharge": {"v": "conditional", "scope": "conditional"}, "independent": {"v": "no", "scope": "national"}}'::jsonb,
  'limited',
  'Korlátozott: meglévő kezelés folytatása és megújítása, meghatározott körben.',
  'moderate',
  'Védett cím, de orvosi együttműködés keretében, körülhatárolt területeken.',
  'moderate',
  array['Krónikus betegségek gondozása', 'Vesepótló kezelés'],
  array['Onkológia', 'Mentálhigiéné', 'Krónikus ellátás'],
  array['Világos jogszabályi keret', 'Fokozatos, kiszámítható bővítés'],
  array['Szűk hatáskör', 'Jelentős szakmai ellenállás a bevezetéskor'],
  '2018-tól jogszabályi keretben működő, védett című, de körülhatárolt hatáskörű szerepkör.',
  'Példa a fokozatos bevezetésre: szűk, jól körülhatárolt hatáskörrel indult, amit lépésenként bővítenek. Lassabb, de kiszámíthatóbb út.',
  '2026-09-07'::date, 'published'
) on conflict (code) do nothing;

insert into public.apn_sources (country_id, title, org, url, accessed_on)
select id, 'Advanced practice nursing in the European Union: A scoping review', 'Nursing Outlook', 'https://www.sciencedirect.com/science/article/pii/S0029655425002416', current_date
from public.apn_countries where code = 'FR'
on conflict do nothing;

-- ── Finnország ──
insert into public.apn_countries (
  code, name, name_en, flag, region, status, data_confidence, roles, education, regulation, scope, prescribing, prescribing_note, autonomy, autonomy_note, primary_care, primary_care_areas, hospital_areas, strengths, challenges, description, why_interesting, last_verified, publish_status
) values (
  'FI',
  'Finnország',
  'Finland',
  '🇫🇮',
  'europe',
  'developing',
  'moderate',
  '[{"name": "Nurse Practitioner", "abbr": "NP", "note": "A cím nem védett."}, {"name": "Korlátozott felírási jogú ápoló"}]'::jsonb,
  '{"level": "Mesterfokozat", "master_required": true, "doctoral_pathway": false, "certification": "Nincs egységes országos vizsga", "registration": "Részleges", "note": "A felírási joghoz külön képesítés szükséges."}'::jsonb,
  '{"level": "Részleges", "protected_title": false, "registration": false, "scope_regulated": false, "prescribing_regulated": true, "note": "Nincs önálló jogszabályi keret a szerepkörre; a felírási jog külön szabályozott."}'::jsonb,
  '{"assessment": {"v": "yes", "scope": "national"}, "physical_exam": {"v": "yes", "scope": "national"}, "diagnosis": {"v": "conditional", "scope": "institutional"}, "differential": {"v": "conditional", "scope": "institutional"}, "labs": {"v": "conditional", "scope": "institutional"}, "imaging": {"v": "conditional", "scope": "institutional"}, "interpretation": {"v": "conditional", "scope": "institutional"}, "treatment_init": {"v": "conditional", "scope": "institutional"}, "treatment_mod": {"v": "conditional", "scope": "institutional"}, "prescribing": {"v": "conditional", "scope": "national", "note": "Korlátozott felírási jog meghatározott gyógyszerkörre, külön képesítéssel."}, "referral": {"v": "conditional", "scope": "institutional"}, "admission": {"v": "unknown", "scope": "national"}, "discharge": {"v": "conditional", "scope": "institutional"}, "independent": {"v": "conditional", "scope": "institutional", "note": "A gyakorlatban jelentős, de nincs önálló jogszabályi keret."}}'::jsonb,
  'limited',
  'Korlátozott felírási jog meghatározott gyógyszerkörre, külön képesítéssel.',
  'moderate',
  'A gyakorlatban jelentős, különösen az alapellátásban, de a formális keret hiányzik.',
  'high',
  array['Egészségügyi központok', 'Első ellátás', 'Krónikus gondozás'],
  array['Szakrendelés'],
  array['Erős alapellátási gyakorlat', 'Az ápoló gyakran az első ellátó'],
  array['Nincs védett cím és önálló szabályozás', 'A formális elismerés lemarad a gyakorlat mögött'],
  'Erős gyakorlati alkalmazás gyengébb jogi kerettel, korlátozott felírási joggal.',
  'Fordított sorrend: itt a gyakorlat előzte meg a szabályozást. Megmutatja, hogy a szerepkör működhet formális keret nélkül is, de a hosszú távú fenntarthatóság kérdéses.',
  '2026-09-07'::date, 'published'
) on conflict (code) do nothing;

insert into public.apn_sources (country_id, title, org, url, accessed_on)
select id, 'A comparative review of advanced practice nurse programmes in the Nordic and Baltic countries', 'Nurse Education Today', 'https://www.sciencedirect.com/science/article/pii/S0260691723001417', current_date
from public.apn_countries where code = 'FI'
on conflict do nothing;

-- ── Magyarország ──
insert into public.apn_countries (
  code, name, name_en, flag, region, status, data_confidence, roles, education, regulation, scope, prescribing, prescribing_note, autonomy, autonomy_note, primary_care, primary_care_areas, hospital_areas, strengths, challenges, description, why_interesting, last_verified, publish_status
) values (
  'HU',
  'Magyarország',
  'Hungary',
  '🇭🇺',
  'europe',
  'developing',
  'high',
  '[{"name": "Okleveles ápoló", "note": "Kiterjesztett hatáskörű ápoló"}]'::jsonb,
  '{"level": "Mesterfokozat (MKKR 7. szint)", "master_required": true, "doctoral_pathway": false, "certification": "Okleveles ápoló szak", "registration": "Működési nyilvántartás", "note": "A képzés 2017-től indult."}'::jsonb,
  '{"level": "Országos", "protected_title": true, "registration": true, "scope_regulated": true, "prescribing_regulated": false, "since": "2025", "note": "A kompetenciákat a 13/2025. (IV. 17.) BM rendelet 2. melléklete sorolja fel tételesen."}'::jsonb,
  '{"assessment": {"v": "yes", "scope": "national", "note": "Saját indikáció alapján, önállóan."}, "physical_exam": {"v": "yes", "scope": "national"}, "diagnosis": {"v": "conditional", "scope": "conditional", "note": "A tevékenységek négy szintre osztva; több esetben orvosi indikáció után."}, "differential": {"v": "conditional", "scope": "conditional"}, "labs": {"v": "conditional", "scope": "conditional"}, "imaging": {"v": "conditional", "scope": "conditional"}, "interpretation": {"v": "conditional", "scope": "conditional"}, "treatment_init": {"v": "conditional", "scope": "conditional"}, "treatment_mod": {"v": "conditional", "scope": "conditional"}, "prescribing": {"v": "conditional", "scope": "conditional", "note": "A hatályos szabályozás szerint korlátozott; a gyógyszerrendelés kérdése nyitott."}, "referral": {"v": "conditional", "scope": "conditional"}, "admission": {"v": "no", "scope": "national"}, "discharge": {"v": "conditional", "scope": "conditional"}, "independent": {"v": "conditional", "scope": "conditional"}}'::jsonb,
  'limited',
  'A hatályos szabályozás szerint korlátozott; a gyógyszerrendelés kérdése nyitott.',
  'moderate',
  'A tevékenységek négy szintre osztva: önálló végzés, szakorvosi szupervízió mellett, orvosi indikáció után, illetve orvosi irányítás mellett.',
  'moderate',
  array['Alapellátás', 'Szakrendelés'],
  array['Fekvőbeteg-ellátás', 'Sürgősségi'],
  array['Tételes rendeleti kompetenciafelsorolás', 'Egyértelmű négyszintű besorolás'],
  array['A gyakorlati bevezetés és a finanszírozási háttér kérdései', 'A gyógyszerrendelés szabályozása nyitott'],
  'A kompetenciák 2025-től rendeleti szinten, tételesen meghatározva, négy végzési szinten.',
  'A tételes rendeleti felsorolás nemzetközi összevetésben ritka: a legtöbb ország keretszabályozást ad, és a részleteket a szakmai testületre bízza. Ez egyértelmű kiindulópont, de kevésbé rugalmas.',
  '2026-09-07'::date, 'published'
) on conflict (code) do nothing;

insert into public.apn_sources (country_id, title, org, url, accessed_on)
select id, '13/2025. (IV. 17.) BM rendelet, 2. melléklet', 'Magyar Közlöny', null, current_date
from public.apn_countries where code = 'HU'
on conflict do nothing;
insert into public.apn_sources (country_id, title, org, url, accessed_on)
select id, 'Advanced practice nursing in the European Union: A scoping review', 'Nursing Outlook', 'https://www.sciencedirect.com/science/article/pii/S0029655425002416', current_date
from public.apn_countries where code = 'HU'
on conflict do nothing;

-- ══ Idővonal ══
insert into public.apn_timeline (period, title, description, ord, publish_status)
values ('1960-as évek', 'Az első haladó ápolói szerepkörök', 'Az Egyesült Államokban megjelennek az első nurse practitioner programok, elsősorban a gyermek-alapellátás orvoshiányára válaszul.', 0, 'published') on conflict do nothing;
insert into public.apn_timeline (period, title, description, ord, publish_status)
values ('1970-es évek', 'A szerepkör kiépülése', 'Kanadában és az Egyesült Államokban formális képzési programok indulnak, a hangsúly az alapellátáson és a távoli térségeken van.', 1, 'published') on conflict do nothing;
insert into public.apn_timeline (period, title, description, ord, publish_status)
values ('1980-as évek', 'Terjeszkedés és szakosodás', 'A szerepkör kórházi és szakellátási területekre is kiterjed; megjelennek a klinikai szakápolói és aneszteziológiai irányok.', 2, 'published') on conflict do nothing;
insert into public.apn_timeline (period, title, description, ord, publish_status)
values ('1990-es évek', 'Nemzetközi megjelenés', 'Ausztrália, az Egyesült Királyság és több európai ország kezdi bevezetni a haladó ápolói szerepköröket.', 3, 'published') on conflict do nothing;
insert into public.apn_timeline (period, title, description, ord, publish_status)
values ('2000-es évek', 'Szabályozási keretek', 'Ausztrália, Írország és Hollandia jogszabályi keretet ad a szerepkörnek; az ICN meghatározza a nemzetközi alapfogalmakat.', 4, 'published') on conflict do nothing;
insert into public.apn_timeline (period, title, description, ord, publish_status)
values ('2010-es évek', 'Formalizálás', 'A védett cím és a kötelező nyilvántartás több országban bevezetésre kerül; a felírási jog kérdése előtérbe kerül.', 5, 'published') on conflict do nothing;
insert into public.apn_timeline (period, title, description, ord, publish_status)
values ('2020-as évek', 'Munkaerő-átalakulás', 'Az ellátóhiány felgyorsítja a bevezetést; Franciaország, Magyarország és több közép-európai ország új szabályozást alkot.', 6, 'published') on conflict do nothing;

-- Ellenőrzés
select code, name, status, data_confidence, publish_status
from public.apn_countries order by name;
