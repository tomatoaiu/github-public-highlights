import { defineContentScript } from "#imports"

import { getRepositoryColor } from "../repository-color"

const PUBLIC_REPOSITORY = "color0"
const PRIVATE_REPOSITORY = "color1"

function getHeader(): HTMLElement | null {
  return document.querySelector<HTMLElement>("#repository-container-header")
}

function getStatusLabel(header: HTMLElement): HTMLElement | null {
  return (
    header.querySelector<HTMLElement>(
      ".Label.Label--secondary.v-align-middle.mr-1",
    ) ?? null
  )
}

async function paintRepositoryHeader(): Promise<void> {
  const colors = await chrome.storage.local.get([
    PUBLIC_REPOSITORY,
    PRIVATE_REPOSITORY,
  ])
  const storedPublicColor = colors[PUBLIC_REPOSITORY]
  const storedPrivateColor = colors[PRIVATE_REPOSITORY]
  const publicColor =
    typeof storedPublicColor === "string" ? storedPublicColor : "#22aa22"
  const privateColor =
    typeof storedPrivateColor === "string" ? storedPrivateColor : "#aa2222"

  const header = getHeader()
  if (header === null) {
    return
  }

  const visibility = getStatusLabel(header)?.innerText ?? header.innerText
  const color = getRepositoryColor(visibility, publicColor, privateColor)
  if (color !== null) header.style.backgroundColor = color
}

export default defineContentScript({
  matches: ["https://github.com/*/*"],
  runAt: "document_idle",
  main() {
    void paintRepositoryHeader()
  },
})
