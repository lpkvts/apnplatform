import { redirect } from 'next/navigation'
export default function ElozmenyekRedirect() {
  redirect('/klinika/esetek?type=assessment')
}
