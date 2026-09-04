/**
 * Hitelesítési hibaüzenetek magyarul.
 *
 * A háttérszolgáltatás angolul válaszol, és ezek az üzenetek eddig
 * változtatás nélkül jelentek meg a felhasználónak. A fordítás nem csak
 * nyelvi kérdés: az eredeti üzenetek gyakran technikaiak, és nem mondják
 * meg, mit tegyen a felhasználó.
 */

const FORDITAS: { minta: RegExp; szoveg: string }[] = [
  {
    minta: /user already registered|already been registered/i,
    szoveg: 'Ezzel az e-mail címmel már van fiók. Jelentkezz be, vagy kérj új jelszót, ha elfelejtetted.',
  },
  {
    minta: /invalid login credentials/i,
    szoveg: 'Hibás e-mail cím vagy jelszó. Ellenőrizd, és próbáld újra.',
  },
  {
    minta: /email not confirmed/i,
    szoveg: 'A fiók még nincs megerősítve. Nézd meg a postaládádat — a levélszemetet is —, és kattints a megerősítő hivatkozásra.',
  },
  {
    minta: /password should be at least (\d+)/i,
    szoveg: 'A jelszó túl rövid. Legalább 6 karakter szükséges.',
  },
  {
    minta: /unable to validate email|invalid email/i,
    szoveg: 'Az e-mail cím nem érvényes. Ellenőrizd a leírását.',
  },
  {
    minta: /email rate limit exceeded|over_email_send_rate_limit/i,
    szoveg: 'Túl sok levelet kértél rövid idő alatt. Várj néhány percet, és próbáld újra.',
  },
  {
    minta: /for security purposes.*(\d+) seconds/i,
    szoveg: 'Biztonsági okból várni kell egy kicsit a következő próbálkozásig.',
  },
  {
    minta: /signups not allowed|signup is disabled/i,
    szoveg: 'A regisztráció jelenleg nem elérhető. Írj nekünk a Kapcsolat oldalon.',
  },
  {
    minta: /token has expired|expired/i,
    szoveg: 'A hivatkozás lejárt. Kérj újat.',
  },
  {
    minta: /same password/i,
    szoveg: 'Az új jelszó nem egyezhet meg a régivel.',
  },
  {
    minta: /network|fetch failed/i,
    szoveg: 'Nem sikerült elérni a szolgáltatást. Ellenőrizd a kapcsolatot, és próbáld újra.',
  },
]

/**
 * Magyar üzenet a nyers hibából.
 *
 * Ismeretlen hiba esetén általános üzenetet adunk vissza, nem a technikai
 * szöveget: az a felhasználónak nem segít, és néha többet árul el a
 * rendszerről, mint kellene.
 */
export function authHiba(nyers: string | null | undefined): string {
  if (!nyers) return 'A művelet nem sikerült. Próbáld újra.'
  for (const f of FORDITAS) {
    if (f.minta.test(nyers)) return f.szoveg
  }
  return 'A művelet nem sikerült. Ha ismétlődik, jelezd a Kapcsolat oldalon.'
}
