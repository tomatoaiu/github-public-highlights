import { getRepositoryColor } from "./repository-color"

function getVisibility(document: Document): string | null {
  const repositoryPublic = document.querySelector<HTMLMetaElement>(
    'meta[name="octolytics-dimension-repository_public"]',
  )?.content
  if (repositoryPublic === "true") return "Public"
  if (repositoryPublic === "false") return "Private"

  return (
    document.querySelector<HTMLElement>("#repository-container-header")
      ?.textContent ?? null
  )
}

export function paintRepositoryHeaders(
  document: Document,
  publicColor: string,
  privateColor: string,
): void {
  const visibility = getVisibility(document)
  if (visibility === null) return

  const color = getRepositoryColor(visibility, publicColor, privateColor)
  if (color === null) return

  const globalNavigation = document.querySelector<HTMLElement>(
    'header[aria-label="Global navigation menu"]',
  )
  const currentHeader = globalNavigation?.firstElementChild
  const header =
    (currentHeader instanceof HTMLElement ? currentHeader : null) ??
    document.querySelector<HTMLElement>(".AppHeader-globalBar") ??
    document.querySelector<HTMLElement>("#repository-container-header")
  header?.style.setProperty("background-color", color, "important")
}
