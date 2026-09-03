import { THEME_KEY } from '@/lib/theme'

/**
 * A téma beállítása még az első kirajzolás előtt.
 *
 * Enélkül a világos felület egy pillanatra felvillanna sötét beállítás mellett
 * is: a React csak a betöltés után futna le. Ez a kis szkript a HTML fejlécében
 * fut, tehát a lap már a helyes témával jelenik meg.
 *
 * A szkript szándékosan tömör és önálló: nem hivatkozik semmire, ami később
 * töltődik be.
 */
export function ThemeInit() {
  const kod = `(function(){try{
var m=localStorage.getItem('${THEME_KEY}')||'system';
var d=false;
if(m==='dark')d=true;
else if(m==='light')d=false;
else if(m==='auto'){var h=new Date().getHours();d=h>=20||h<6}
else d=window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.dataset.theme=d?'dark':'light';
}catch(e){}})()`
  return <script dangerouslySetInnerHTML={{ __html: kod }} />
}
