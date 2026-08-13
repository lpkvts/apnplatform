export function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div
      style={{
        background: 'var(--slate-200)',
        borderRadius: 999,
        height: 10,
        overflow: 'hidden',
      }}
      aria-valuenow={v}
      role="progressbar"
    >
      <div style={{ width: `${v}%`, height: '100%', background: 'var(--teal)' }} />
    </div>
  )
}
