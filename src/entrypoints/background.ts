import { defineBackground } from "#imports"

const PUBLIC_REPOSITORY = "color0"
const PRIVATE_REPOSITORY = "color1"

export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason !== "install") return
    void chrome.storage.local.set({
      [PUBLIC_REPOSITORY]: "#aaaaaa",
      [PRIVATE_REPOSITORY]: "#aa22aa",
    })
  })
})
