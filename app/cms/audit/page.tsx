import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { currentRole, isStaff } from '@/lib/roles'
export const dynamic = 'force-dynamic'
const ENTITY_LABEL: Record<string, string> = { guideline: 'Irányelv', disease: 'Betegség', career: 'Career' }
const ACTION_LABEL: Record<string, string> = { insert: 'Létrehozás', update: 'Módosítás', status_change: 'Állapotváltás', delete: 'Törlés' }
const ACTION_ICON: Record<string, string> = { insert: '➕', update: '✏️', status_change: '🔄', delete: '🗑️' }
const STATUS_HU: Record<string, string> = { draft: 'piszkozat', review: 'lektorálásra vár', published: 'publikált', expired: 'lejárt' }
interface Row { id: string; actor_email: string | null; action: string; entity: string; entity_title: string | null; details: { from?: string; to?: string }; created_at: string }
export default async function AuditPage({ searchParams }: { searchParams: Promise<{ entity?: string }> }) {
  const { role } = await currentRole()
  if (!isStaff(role)) return <><h1 className="h1">Audit napló</h1><div className="card">Ehhez szerkesztő/lektor/admin jog szükséges.</div></>
  const { entity } = await searchParams; const supabase = await createClient()
  let query = supabase.from('audit_log').select('id, actor_email, action, entity, entity_title, details, created_at').order('created_at', { ascending: false }).limit(150)
  if (entity && ['guideline', 'disease', 'career'].includes(entity)) query = query.eq('entity', entity)
  const { data } = await query.returns<Row[]>(); const items = data ?? []
  const chip = (val: string, label: string) => (<Link href={val ? `/cms/audit?entity=${val}` : '/cms/audit'} className={`sh-chip ${(entity ?? '') === val ? 'on' : ''}`}>{label}</Link>)
  return (<><Link className="sh-back" href="/cms">‹ Tartalomkezelés</Link><h1 className="h1">Audit napló</h1><p className="sub">Ki, mit, mikor módosított a szabályozott tartalmakban.</p><div className="sh-chips">{chip('', 'Összes')}{chip('guideline', 'Irányelvek')}{chip('disease', 'Betegségek')}{chip('career', 'Career')}</div>{items.length === 0 && <div className="card"><p style={{ margin: 0 }}>Nincs naplóbejegyzés (a naplózás a trigger telepítése utáni eseményekre indul).</p></div>}{items.map((r) => (<div className="card" key={r.id} style={{ padding: '12px 14px' }}><div className="row" style={{ border: 'none', padding: 0 }}><b style={{ fontSize: 14 }}>{ACTION_ICON[r.action] ?? '•'} {ACTION_LABEL[r.action] ?? r.action}</b><span className="sub" style={{ margin: 0, fontSize: 12 }}>{new Date(r.created_at).toLocaleString('hu-HU')}</span></div><div style={{ marginTop: 4 }}><span className="cms-badge s-published" style={{ marginRight: 6 }}>{ENTITY_LABEL[r.entity] ?? r.entity}</span>{r.entity_title}</div>{r.action === 'status_change' && r.details?.to && (<div className="sub" style={{ margin: '6px 0 0' }}>{STATUS_HU[r.details.from ?? ''] ?? r.details.from} → <b>{STATUS_HU[r.details.to] ?? r.details.to}</b></div>)}<div className="sub" style={{ margin: '6px 0 0', fontSize: 12 }}>👤 {r.actor_email ?? 'rendszer / SQL'}</div></div>))}</>)
}
