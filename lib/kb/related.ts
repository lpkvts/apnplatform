import { TESTS, type Test } from '@/lib/scores/data'

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const RULES: [RegExp, string[]][] = [
  [/(copd|obstruktiv|tudo|legz|inhal|dohany)/, ['cat', 'mmrc', 'curb65', 'news2']],
  [/(asztma)/, ['cat', 'mmrc']],
  [/(szivelegtelen|kardio)/, ['news2']],
  [/(pitvarfibrill|antikoagul|ritmuszavar)/, ['cha2ds2', 'hasbled']],
  [/(stroke|tia|neurolog|agyi)/, ['fast', 'cincinnati', 'abcd2', 'gcs']],
  [/(diabet|cukor|glukoz|retinopath)/, ['findrisc', 'bmi']],
  [/(taplal|malnutri|tapertek)/, ['must', 'nrs2002', 'mnasf', 'bmi']],
  [/(decubitus|felfekves|nyomasi|sebkezel)/, ['braden', 'norton']],
  [/(eses|geriatr|frailty|torekeny)/, ['morse', 'hendrich', 'tug', 'cfs']],
  [/(fajdalom)/, ['vas', 'nrs']],
  [/(depresszio|szorong|mental|hangulat)/, ['phq9', 'gad7']],
  [/(pneumonia|tudogyullad|fertoz|szepszis)/, ['curb65', 'qsofa', 'centor']],
]

export function relatedScores(title: string, summary: string): Test[] {
  const query = norm(`${title} ${summary}`)
  let ids: string[] = []
  RULES.forEach(([re, list]) => { if (re.test(query)) ids = ids.concat(list) })
  ids = [...new Set(ids)]
  return ids.map((id) => TESTS.find((t) => t.id === id)).filter((t): t is Test => !!t)
}
