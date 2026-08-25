import Link from 'next/link'

export function EmptyState({ icon, title, description, actionHref, actionLabel }: {
  icon?: string; title: string; description?: string; actionHref?: string; actionLabel?: string
}) {
  return (
    <div className="empty">
      {icon && <div className="empty-i">{icon}</div>}
      <div className="empty-t">{title}</div>
      {description && <p className="sub" style={{ margin: '4px 0 0' }}>{description}</p>}
      {actionHref && actionLabel && <Link className="btn sm" href={actionHref} style={{ marginTop: 12 }}>{actionLabel}</Link>}
    </div>
  )
}
