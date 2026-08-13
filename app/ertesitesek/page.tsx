import Link from 'next/link'
import { getNotifications } from '@/lib/notifications'
import { Icon } from '@/components/icons'
import { markAllRead } from './actions'

export default async function ErtesitesekPage() {
  const { items } = await getNotifications()
  const hasStored = items.some((n) => n.stored)

  return (
    <>
      <Link className="sh-back" href="/">‹ Kezdőlap</Link>
      <div className="row" style={{ border: 'none' }}>
        <h1 className="h1" style={{ margin: 0 }}>Értesítések</h1>
        {hasStored && (
          <form action={markAllRead}><button className="btn ghost sm" type="submit">Mind olvasott</button></form>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card"><p style={{ margin: 0 }}>Nincs új értesítés. 🎉</p></div>
      ) : (
        items.map((n) => {
          const inner = (
            <div className={`notif ${n.urgent ? 'urgent' : ''}`}>
              <span className="notif-i"><Icon name={n.icon} size={20} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="notif-t">{n.title}</div>
                {n.body && <div className="notif-b">{n.body}</div>}
              </div>
              {n.href && <span className="sh-chev">›</span>}
            </div>
          )
          return n.href
            ? <Link key={n.id} href={n.href} style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</Link>
            : <div key={n.id}>{inner}</div>
        })
      )}
      <p className="sub" style={{ marginTop: 12 }}>Az értesítések a fiókod aktuális állapotából és a jóváhagyott tartalmakból származnak.</p>
    </>
  )
}
