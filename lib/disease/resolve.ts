// Kórképnév → Betegségtár-rekord feloldás (kliens és szerver oldalon is használható, tiszta függvények)

export interface DzLite { id: string; name: string; aliases: string[] | null; is_stub: boolean }

export const normName = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

export function resolveDisease(name: string, dz: DzLite[]): DzLite | null {
  const n = normName(name)
  let hit = dz.find((d) => normName(d.name) === n)
  if (!hit) hit = dz.find((d) => (d.aliases ?? []).some((a) => normName(a) === n))
  if (!hit) {
    const cands = dz.filter((d) => normName(d.name).includes(n) || n.includes(normName(d.name)))
    hit = cands.find((d) => !d.is_stub) ?? cands[0]
  }
  if (!hit) {
    const cands = dz.filter((d) => (d.aliases ?? []).some((a) => normName(a).includes(n) || n.includes(normName(a))))
    hit = cands.find((d) => !d.is_stub) ?? cands[0]
  }
  return hit ?? null
}
