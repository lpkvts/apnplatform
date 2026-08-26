import { redirect } from 'next/navigation'
// A verziókövetés az /ujdonsagok útvonalon él; ez csak egy beszédesebb alias.
export default function VerziokAlias() {
  redirect('/ujdonsagok')
}
