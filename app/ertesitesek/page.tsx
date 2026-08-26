import Link from 'next/link'
import { getNotifications } from '@/lib/notifications'
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
