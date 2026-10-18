import {useSyncExternalStore} from "react"

// A szerkesztő töréspontjai. FIGYELEM: egyezniük kell az app/globals.css média-lekérdezéseivel
// (@media(max-width:1050px) = keskeny, @media(max-width:760px) = telefon); az egyiket csak a másikkal együtt módosítsd.
export const EDITOR_NARROW = "(max-width:1050px)"
export const EDITOR_PHONE = "(max-width:760px)"

// matchMedia-figyelő; a szerveren (és a hidratálás első képkockájában) mindig hamis.
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", notify)
      return () => list.removeEventListener("change", notify)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
