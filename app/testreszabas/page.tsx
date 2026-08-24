import Link from 'next/link'
import { ShortcutConfig } from '@/components/shortcut-config'
export const dynamic = 'force-dynamic'
export default function TestreszabasPage() {
  return (
    <>
      <Link className="sh-back" href="/">‹ Kezdőlap</Link>
      <h1 className="h1">Kezdőlap testreszabása</h1>
      <p className="sub">Válaszd ki, mely menük jelenjenek meg gyorsindító gombként a kezdőlapon. Bármikor módosíthatod.</p>
      <ShortcutConfig />
    </>
  )
}
