import Link from 'next/link'
import { Icon } from '@/components/icons'
import { APP_VERSION, RELEASES, CHANGE_KIND_META, compareVersions, type ChangeKind } from '@/lib/changelog/data'
import { getContentUpdates } from '@/lib/notifications'
import { markUpdatesSeen } from '@/app/ertesitesek/actions'

export const dynamic = 'force-dynamic'

const KIND_ORDER: ChangeKind[] = ['funkcio', 'eszkoz', 'szakmai', 'betegseg', 'labor', 'forras', 'javitas']

export default async function VerziokovetesPage() {
  const { items: updates, seenAt, seenVersion } = await getContentUpdates()
  const since = seenAt ? seenAt.slice(0, 10) : null

  return (
    <>
      <Link className="sh-back" href="/profil">‹ Profil</Link>
      <h1 className="h1">Verziókövetés</h1>
      <p className="sub">
        Jelenlegi verzió: <b>v{APP_VERSION}</b>
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

      {RELEASES.map((r) => {
        // Verzió szerint döntjük el, mi számít újnak — a dátum csak megjelenítés.
        const isNew = seenVersion
          ? compareVersions(r.version, seenVersion) > 0
          : since ? r.date > since : false
        // Bejegyzések típus szerint csoportosítva, rögzített sorrendben
        const groups = KIND_ORDER
          .map((k) => [k, r.entries.filter((e) => e.kind === k)] as const)
          .filter(([, list]) => list.length > 0)

        return (
          <div key={r.version} style={{ marginBottom: 22 }}>
            <div className="sec-h">
              <span className="sec-t">
                v{r.version} — {r.title}
                {isNew && <span className="badge badge-uj" style={{ marginLeft: 8 }}>új</span>}
              </span>
              <span className="sec-l" style={{ marginLeft: 'auto', fontWeight: 500 }}>{r.date}</span>
            </div>

            {r.summary && <p className="sub" style={{ marginTop: 0 }}>{r.summary}</p>}

            {groups.map(([kind, list]) => {
              const meta = CHANGE_KIND_META[kind]
              return (
                <details key={kind} className="kt-acc">
                  <summary className="kt-sum">
                    <span>{meta.label}</span>
                    <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 13, marginLeft: 'auto', marginRight: 8 }}>
                      {list.length}
                    </span>
                  </summary>
                  <div className="kt-body">
                    {list.map((e) => {
                      const inner = (
                        <div className="notif">
                          <span className="notif-i"><Icon name={meta.icon} size={20} /></span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="notif-t">{e.title}</div>
                            {e.body && <div className="notif-b">{e.body}</div>}
                          </div>
                          {e.href && <span className="sh-chev">›</span>}
                        </div>
                      )
                      return e.href
                        ? <Link key={e.id} href={e.href} style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</Link>
                        : <div key={e.id}>{inner}</div>
                    })}
                  </div>
                </details>
              )
            })}
          </div>
        )
      })}

      <p className="sub" style={{ marginTop: 12 }}>
        A betegségleírások, irányelvek és labor paraméterek újdonságát a rendszer az adatbázisból,
        automatikusan ismeri fel — azok nem szerepelnek ezen a listán. A kódban szállított tartalom
        és a funkciók itt jelennek meg, verziónként.
      </p>
    </>
  )
}
