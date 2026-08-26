import Link from 'next/link'
import { Icon } from '@/components/icons'
import { APP_VERSION, CHANGELOG, CHANGE_KIND_META } from '@/lib/changelog/data'
import { getContentUpdates } from '@/lib/notifications'
import { markUpdatesSeen } from '@/app/ertesitesek/actions'

export const dynamic = 'force-dynamic'

export default async function UjdonsagokPage() {
  const { items: updates, seenAt } = await getContentUpdates()
  const since = seenAt ? seenAt.slice(0, 10) : null

  // Dátum szerinti csoportosítás
  const byDate: [string, typeof CHANGELOG][] = []
  for (const c of CHANGELOG) {
    const last = byDate[byDate.length - 1]
    if (last && last[0] === c.date) last[1].push(c)
    else byDate.push([c.date, [c]])
  }

  return (
    <>
      <Link className="sh-back" href="/ertesitesek">‹ Értesítések</Link>
      <h1 className="h1">Újdonságok</h1>
      <p className="sub">
        Platform-verzió: <b>v{APP_VERSION}</b>
        {since && <> · Legutóbb megtekintve: {since}</>}
      </p>

      {updates.length > 0 && (
        <div className="card" style={{ marginBottom: 14 }}>
          <b>{updates.length} új tétel a legutóbbi megtekintésed óta</b>
          <div className="sub" style={{ marginTop: 4 }}>
            Ebbe a friss szakmai tartalom (betegségleírás, irányelv, labor paraméter) és a
            platform-frissítések is beleszámítanak.
          </div>
          <form action={markUpdatesSeen} style={{ marginTop: 10 }}>
            <button className="btn ghost sm" type="submit">Megtekintettem</button>
          </form>
        </div>
      )}

      {byDate.map(([date, entries]) => (
        <div key={date} style={{ marginBottom: 18 }}>
          <div className="sec-h">
            <span className="sec-t">{date}</span>
            {entries.some((e) => e.version) && (
              <span className="sec-l" style={{ marginLeft: 'auto' }}>
                v{entries.find((e) => e.version)!.version}
              </span>
            )}
          </div>
          {entries.map((c) => {
            const meta = CHANGE_KIND_META[c.kind]
            const isNew = since ? c.date > since : false
            const inner = (
              <div className="notif">
                <span className="notif-i"><Icon name={meta.icon} size={20} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="notif-t">
                    {c.title}
                    {isNew && <span className="badge badge-uj" style={{ marginLeft: 8 }}>új</span>}
                  </div>
                  <div className="notif-b" style={{ opacity: .7, fontSize: 12 }}>{meta.label}</div>
                  {c.body && <div className="notif-b">{c.body}</div>}
                </div>
                {c.href && <span className="sh-chev">›</span>}
              </div>
            )
            return c.href
              ? <Link key={c.id} href={c.href} style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</Link>
              : <div key={c.id}>{inner}</div>
          })}
        </div>
      ))}

      <p className="sub" style={{ marginTop: 12 }}>
        A betegségleírások, irányelvek és labor paraméterek újdonságát a rendszer az adatbázisból,
        automatikusan ismeri fel. A kódban szállított tartalom (Labor Kisokos, forrás-regiszter,
        eszközök) ezen a listán jelenik meg.
      </p>
    </>
  )
}
