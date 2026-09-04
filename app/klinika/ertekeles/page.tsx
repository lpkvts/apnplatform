import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { AssessmentFlow } from '@/components/assessment-flow'

export const dynamic = 'force-dynamic'

export default async function ErtekelesPage() {
  // A modul a következő fejlesztésig kikapcsolt. A már rögzített értékelések
  // nem vesznek el — csak a belépési pont zárul be.
  if (!(await getFlag('ertekeles', false))) return <FeatureOff title="Új betegértékelés" />
  return <AssessmentFlow />
}
