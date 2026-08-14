import { Ekg } from '@/components/ekg'

export default async function EkgPage({ searchParams }: { searchParams: Promise<{ open?: string }> }) {
  const { open } = await searchParams
  return <Ekg initialOpen={open} />
}
