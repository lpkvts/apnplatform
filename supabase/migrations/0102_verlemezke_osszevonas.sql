-- APN-MED — A vérlemezke-gátló csoportok összevonása.
--
-- Két csoport keletkezett ugyanarra a szerre:
--
--   · „vérlemezke-gatlok" — a 0069-ből, hatóanyagok nélkül. A slugjában
--     ékezetes betű van, ami önmagában is hiba: a slug célja, hogy
--     hivatkozható és gépelhető legyen;
--
--   · „thrombocyta-gatlok" — a 0099-ből, négy hatóanyaggal.
--
-- Az utóbbi megnevezése szakmailag pontosabb, ezért az marad. A 0069-es
-- csoport leírása viszont helyenként jobb — különösen a kettős kezelés
-- időtartamáról és a beavatkozás előtti szüneteltetésről szóló rész —,
-- ezért azt átemeljük.
--
-- Hogy ez megtörténhetett: a 0099 írásakor a meglévő csoportokat
-- ellenőriztem, de a keresés az ékezetes slugot nem találta meg. A
-- tanulság az ellenőrző szkriptbe kerül.

-- ══ 1. A megmaradó csoport gazdagítása ═══════════════════
-- A két leírás legjobb részei egy helyre.
update public.drug_groups set
  short = 'Acetilszalicilsav, klopidogrél, prazugrél, tikagrelor',
  description =
    'Az artériás érelzáródás megelőzésének alapszerei: szívinfarktus, stroke és '
    'érbeavatkozás után. Gyakran tévesztik össze őket az alvadásgátlókkal, pedig '
    'más a szerepük.',
  name_meaning =
    'A vérlemezkék összecsapzódását gátolják. Nem az alvadási fehérjeláncra hatnak, '
    'hanem a vérlemezkék működésére — ezért a hatásukat az alvadási értékek nem '
    'mutatják. A javallatuk is eltér: az artériás elzáródásra ezek valók, a vénás '
    'trombózisra és a pitvarfibrillációra az alvadásgátlók.',
  key_points = array[
    'Nem azonosak az alvadásgátlókkal: az INR nem mutatja a hatásukat, és a '
    'javallatuk is eltér.',
    'Az alvadásgátlóval együtt adva a vérzési kockázat jelentősen nő — a kettős '
    'vagy hármas kezelés időtartamát ezért szigorúan korlátozzák.',
    'A kettős gátlás időtartama a beavatkozástól és a beteg vérzési kockázatától '
    'függ; a lejárta után egy szerre kell váltani.',
    'A hatás a vérlemezke élettartamáig tart: a leállítás után napokba telik, míg a '
    'működés helyreáll.'
  ],
  apn_notes = array[
    'A kettős gátlás befejezési idejének nyilvántartása — a fölöslegesen hosszú '
    'kezelés vérzést okoz',
    'Vérzésjelek keresése, különösen emésztőrendszeri: melaena, véres vizelet, '
    'bőrvérzések',
    'Gyomorvédelem szükségességének felvetése',
    'A gyulladáscsökkentők együttes szedésének felmérése',
    'A beavatkozás előtti szüneteltetés kérdése: nem minden esetben indokolt'
  ],
  ord = 4
where slug = 'thrombocyta-gatlok';

-- ══ 2. Az esetleges hatóanyagok átmozgatása ══════════════
-- Ha az üresnek hitt csoportba mégis került hatóanyag, az átkerül. Enélkül
-- a csoport lezárásakor elárvulnának.
update public.drug_substances s
set group_id = uj.id
from public.drug_groups regi, public.drug_groups uj
where regi.slug = 'vérlemezke-gatlok'
  and uj.slug = 'thrombocyta-gatlok'
  and s.group_id = regi.id;

-- ══ 3. A duplikált csoport lezárása ══════════════════════
-- Nem töröljük: ha bárhol hivatkozás mutat rá, az nem szakad meg. A nevében
-- jelezzük, mi váltotta fel.
update public.drug_groups set
  publish_status = 'draft',
  name = 'Vérlemezke-gátlók — felváltotta: Thrombocytaaggregáció-gátlók',
  short = 'Összevonva a thrombocytaaggregáció-gátlók csoportjába'
where slug = 'vérlemezke-gatlok';

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- A véralvadás alcsoportjai: négy közzétett csoportnak kell maradnia.
select
  g.slug,
  g.name,
  g.publish_status,
  count(s.id) as hatoanyag
from public.drug_groups g
join public.drug_groups p on p.id = g.parent_id
left join public.drug_substances s
  on s.group_id = g.id and s.publish_status = 'published'
where p.slug = 'veralvadas'
group by g.slug, g.name, g.publish_status, g.ord
order by g.publish_status, g.ord;

-- Árva hatóanyag nem maradhat: olyan, amelynek a csoportja nincs közzétéve.
select s.slug, s.name, g.name as csoport
from public.drug_substances s
left join public.drug_groups g on g.id = s.group_id
where s.publish_status = 'published'
  and (g.id is null or g.publish_status <> 'published');
