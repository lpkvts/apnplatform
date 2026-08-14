import { Copilot } from '@/components/copilot'

export default async function CopilotPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  return <Copilot initialQuery={q} />
}
