import Link from 'next/link'
import { getFlag } from '@/lib/flags'
import { ShortcutConfig } from '@/components/shortcut-config'

export const dynamic = 'force-dynamic'

export default async function TestreszabasPage() {
  // A kikapcsolt modulok nem választhatók: különben a felhasználó felvehetne
  // egy csempét, ami zárt oldalra visz.
  const [gyogyszertar, kompterkep, ertekeles, apnWorld] = await Promise.all([
    getFlag('gyogyszertar', false),
    getFlag('kompetenciaterkep', false),
    getFlag('ertekeles', false),
    getFlag('apn_world', false),
  ])
  const rejtett = [
    !gyogyszertar && 'gyogyszertar',
    !kompterkep && 'kompterkep',
    !ertekeles && 'ertekeles',
    !apnWorld && 'apnworld',
  ].filter(Boolean) as string[]

  return (
    <>
      <Link className="sh-back" href="/">‹ Kezdőlap</Link>
      <h1 className="h1">Kezdőlap testreszabása</h1>
      <p className="sub">Válaszd ki, mely menük jelenjenek meg gyorsindító gombként a kezdőlapon. Bármikor módosíthatod.</p>
      <ShortcutConfig hidden={rejtett} />
    </>
  )
}
