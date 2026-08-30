import { defineContentScript } from "#imports"

import { paintRepositoryHeaders } from "../repository-header"
import { getRepositoryColors } from "../repository-color"

const PUBLIC_REPOSITORY = "color0"
const PRIVATE_REPOSITORY = "color1"

async function paintRepositoryHeader(): Promise<void> {
  const storedColors = await chrome.storage.local.get([
    PUBLIC_REPOSITORY,
    PRIVATE_REPOSITORY,
  ])
  const { publicColor, privateColor } = getRepositoryColors(
    storedColors[PUBLIC_REPOSITORY],
    storedColors[PRIVATE_REPOSITORY],
  )
  paintRepositoryHeaders(document, publicColor, privateColor)
}

export default defineContentScript({
  matches: ["https://github.com/*/*"],
  runAt: "document_idle",
  main(ctx) {
    let paintQueued = false
    const schedulePaint = () => {
      if (paintQueued) return
      paintQueued = true
      ctx.requestAnimationFrame(() => {
        paintQueued = false
        void paintRepositoryHeader()
      })
    }
    const handleStorageChange = (
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string,
    ) => {
      if (
        areaName === "local" &&
        (PUBLIC_REPOSITORY in changes || PRIVATE_REPOSITORY in changes)
      ) {
        schedulePaint()
      }
    }
    const observer = new MutationObserver(schedulePaint)

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })
    chrome.storage.onChanged.addListener(handleStorageChange)
    ctx.addEventListener(window, "wxt:locationchange", schedulePaint)
    ctx.onInvalidated(() => {
      observer.disconnect()
      chrome.storage.onChanged.removeListener(handleStorageChange)
    })
    schedulePaint()
  },
})
