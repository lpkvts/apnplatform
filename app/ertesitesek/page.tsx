import Link from 'next/link'
import { getNotifications, getAdminCounts, getRecentSignups, getRecentEvents, eventLabel } from '@/lib/notifications'
import { Icon } from '@/components/icons'
import { markAllRead, markUpdatesSeen } from './actions'

function NotifCard({ n }: { n: { id: string; icon: string; title: string; body?: string; href?: string; urgent?: boolean; when?: string } }) {
  const inner = (
    <div className={`notif ${n.urgent ? 'urgent' : ''}`}>
      <span className="notif-i"><Icon name={n.icon} size={20} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="notif-t">{n.title}</div>
        {n.body && <div className="notif-b">{n.body}</div>}
        {n.when && <div className="notif-b" style={{ opacity: .7, fontSize: 12 }}>{n.when}</div>}
      </div>
      {n.href && <span className="sh-chev">›</span>}
    </div>
  )
  return n.href
    ? <Link href={n.href} style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</Link>
    : <div>{inner}</div>
}

export default async function ErtesitesekPage() {
  const { items } = await getNotifications()

  // Adminisztrátori áttekintés — a függvény nem adminisztrátornak üres
  // eredményt ad, ezért nincs szükség külön szerepkör-ellenőrzésre.
  const adminCounts = await getAdminCounts()
  const [signups, events] = adminCounts
    ? await Promise.all([getRecentSignups(8), getRecentEvents(12)])
    : [[], []]

  const napok = (iso: string) => {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 864e5)
    return d === 0 ? 'ma' : d === 1 ? 'tegnap' : `${d} napja`
  }
  const tasks = items.filter((n) => !n.update)
  const updates = items.filter((n) => n.update)
  const hasStored = tasks.some((n) => n.stored)

  return (
    <>
      <Link className="sh-back" href="/">‹ Kezdőlap</Link>
      <div className="row" style={{ border: 'none' }}>
        <h1 className="h1" style={{ margin: 0 }}>Értesítések</h1>
        {hasStored && (
          <form action={markAllRead}><button className="btn ghost sm" type="submit">Mind olvasott</button></form>
        )}
      </div>
      {/* ── Adminisztrátori áttekintés ── */}
      {adminCounts && (
        <>
          <div className="sec-h"><span className="sec-t">Platform</span></div>

          <div className="card">
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-num">{adminCounts.uj_regisztracio}</div>
                <div className="stat-lbl">Új regisztráció</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">{adminCounts.uj_tartalom}</div>
                <div className="stat-lbl">Tartalomváltozás</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">{adminCounts.uj_szerepkor}</div>
                <div className="stat-lbl">Felhasználó-módosítás</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">{adminCounts.karbantartas_valtas}</div>
                <div className="stat-lbl">Beállításváltozás</div>
              </div>
            </div>
            <p className="sub" style={{ margin: '10px 0 0', fontSize: 12 }}>
              A legutóbbi megtekintésed óta. Csak adminisztrátorként látod.
            </p>
          </div>

          {signups.length > 0 && (
            <details className="kt-acc">
              <summary className="kt-sum">
                <span>Legutóbb regisztráltak</span>
                <span className="kt-sum-n">{signups.length}</span>
              </summary>
              <div className="kt-body">
                {signups.map((u) => (
                  <div className="row" key={u.id}>
                    <span>
                      <b>{u.full_name || '(nincs megadva név)'}</b>
                      {u.specialty && <span className="sub" style={{ display: 'block', margin: 0, fontSize: 12 }}>{u.specialty}</span>}
                    </span>
                    <span className="sub" style={{ margin: 0, fontSize: 12 }}>{napok(u.created_at)}</span>
                  </div>
                ))}
                <Link className="btn ghost sm" href="/cms/felhasznalok" style={{ marginTop: 10 }}>
                  Felhasználókezelés
                </Link>
              </div>
            </details>
          )}

          {events.length > 0 && (
            <details className="kt-acc">
              <summary className="kt-sum">
                <span>Legutóbbi események</span>
                <span className="kt-sum-n">{events.length}</span>
              </summary>
              <div className="kt-body">
                {events.map((e) => (
                  <div className="row" key={e.id}>
                    <span>
                      <b style={{ fontSize: 13.5 }}>{eventLabel(e)}</b>
                      {e.entity_title && (
                        <span className="sub" style={{ display: 'block', margin: 0, fontSize: 12 }}>{e.entity_title}</span>
                      )}
                    </span>
                    <span className="sub" style={{ margin: 0, fontSize: 11.5, textAlign: 'right' }}>
                      {napok(e.created_at)}
                      {e.actor_email && <span style={{ display: 'block' }}>{e.actor_email}</span>}
                    </span>
                  </div>
                ))}
                <Link className="btn ghost sm" href="/cms/audit" style={{ marginTop: 10 }}>
                  Teljes napló
                </Link>
              </div>
            </details>
          )}

          <div className="sec-h"><span className="sec-t">Neked szóló értesítések</span></div>
        </>
      )}


      {items.length === 0 && (
        <div className="card"><p style={{ margin: 0 }}>Nincs új értesítés. 🎉</p></div>
      )}

      {tasks.length > 0 && (
        <>
          <div className="sec-h"><span className="sec-t">Teendők</span></div>
          {tasks.map((n) => <NotifCard key={n.id} n={n} />)}
        </>
      )}

      {updates.length > 0 && (
        <>
          <div className="sec-h" style={{ marginTop: tasks.length ? 18 : 4 }}>
            <span className="sec-t">Új a platformon</span>
            <span className="sec-l" style={{ marginLeft: 'auto' }}>{updates.length}</span>
          </div>
          {updates.map((n) => <NotifCard key={n.id} n={n} />)}
          <form action={markUpdatesSeen} style={{ marginTop: 10 }}>
            <button className="btn ghost sm" type="submit">Megtekintettem — ne jelezze újra</button>
          </form>
        </>
      )}

      <p className="sub" style={{ marginTop: 12 }}>
        A teendők a fiókod aktuális állapotából származnak. Az „Új a platformon” rész azt mutatja, milyen
        jóváhagyott szakmai tartalom került fel a legutóbbi megtekintésed óta. A teljes lista a{' '}
        <Link href="/ujdonsagok">verziókövetésben</Link> érhető el.
      </p>
    </>
  )
}
