import Link from 'next/link'
import { mikorVolt } from '@/lib/datum'
import { getNotifications, getAdminCounts, getRecentSignups, getRecentEvents, eventLabel } from '@/lib/notifications'
import { Icon } from '@/components/icons'
import { markAllRead, markUpdatesSeen, deleteNotif, clearAllNotifs } from './actions'

interface CardNotif {
  id: string; icon: string; title: string; body?: string
  href?: string; urgent?: boolean; when?: string
  rowId?: string; torolheto?: boolean
}

function NotifCard({ n }: { n: CardNotif }) {
  const inner = (
    <>
      <span className="notif-i"><Icon name={n.icon} size={20} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="notif-t">{n.title}</div>
        {n.body && <div className="notif-b">{n.body}</div>}
        {n.when && <div className="notif-b" style={{ opacity: .7, fontSize: 12 }}>{n.when}</div>}
      </div>
      {n.href && <span className="sh-chev">›</span>}
    </>
  )
  return (
    <div className={`notif ${n.urgent ? 'urgent' : ''}`}>
      {n.href
        ? <Link className="notif-l" href={n.href}>{inner}</Link>
        : <div className="notif-l">{inner}</div>}
      {n.torolheto && (
        <form action={deleteNotif}>
          <input type="hidden" name="key" value={n.id} />
          {n.rowId && <input type="hidden" name="rowId" value={n.rowId} />}
          <button className="notif-x" type="submit" title="Értesítés törlése" aria-label={`Értesítés törlése: ${n.title}`}>×</button>
        </form>
      )}
    </div>
  )
}

export default async function ErtesitesekPage() {
  const { items } = await getNotifications()

  // Adminisztrátori áttekintés — a függvény nem adminisztrátornak üres
  // eredményt ad, ezért nincs szükség külön szerepkör-ellenőrzésre.
  const adminCounts = await getAdminCounts()
  const [signups, events] = adminCounts
    ? await Promise.all([getRecentSignups(8), getRecentEvents(12)])
    : [[], []]


  const tasks = items.filter((n) => !n.update)
  const updates = items.filter((n) => n.update)
  const hasStored = tasks.some((n) => n.stored)

  // Az adminisztrátori összesítés is számít a harangon, de nem tétel a
  // listában. Ha csak ez van, akkor is kell legyen mit megnyomni — különben a
  // szám ott marad, és semmi nem tünteti el.
  const adminJelez = !!adminCounts && (
    adminCounts.uj_regisztracio + adminCounts.uj_tartalom +
    adminCounts.uj_szerepkor + adminCounts.karbantartas_valtas) > 0

  // A „Mind törlése” akkor is elérhető, ha a lista üresnek látszik: ez a
  // biztonsági szelep arra az esetre, ha a harangon mégis ragadna szám.
  const vanJelzes = items.length > 0 || adminJelez

  return (
    <>
      <Link className="sh-back" href="/">‹ Kezdőlap</Link>
      <div className="row" style={{ border: 'none', gap: 8, flexWrap: 'wrap' }}>
        <h1 className="h1" style={{ margin: 0 }}>Értesítések</h1>
        <span style={{ flex: 1 }} />
        {hasStored && (
          <form action={markAllRead}><button className="btn ghost sm" type="submit">Mind olvasott</button></form>
        )}
        <form action={clearAllNotifs}><button className="btn ghost sm" type="submit">Mind törlése</button></form>
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
                    <span className="sub" style={{ margin: 0, fontSize: 12 }}>{mikorVolt(u.created_at)}</span>
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
                      {mikorVolt(e.created_at)}
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


      {!vanJelzes && (
        <div className="card"><p style={{ margin: 0 }}>Nincs új értesítés. 🎉</p></div>
      )}

      {items.length === 0 && adminJelez && (
        <div className="card">
          <p style={{ margin: 0 }}>
            Neked szóló teendő nincs — a fenti platform-összesítés viszont tartalmaz újdonságot.
            A „Megtekintettem” gombbal ez is nullázható.
          </p>
          <form action={markUpdatesSeen} style={{ marginTop: 10 }}>
            <button className="btn ghost sm" type="submit">Megtekintettem — ne jelezze újra</button>
          </form>
        </div>
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
      <p className="sub" style={{ marginTop: 6, fontSize: 12 }}>
        A tételek melletti <b>×</b> eltünteti az adott jelzést. A teendőknél ez csak a jelzést
        némítja el — a tanúsítvány, az eset és a felülvizsgálati dátum változatlan marad.
      </p>
    </>
  )
}
