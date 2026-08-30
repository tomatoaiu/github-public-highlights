import { getRepositoryColor } from "./repository-color"

function getVisibilityLabel(document: Document): HTMLElement | null {
  return (
    [...document.querySelectorAll<HTMLElement>('span, [class*="Label"]')].find(
      (element) => /^(Public|Private)$/.test(element.textContent?.trim() ?? ""),
    ) ?? null
  )
}

function getVisibility(
  document: Document,
  label: HTMLElement | null,
): string | null {
  const repositoryPublic = document.querySelector<HTMLMetaElement>(
    'meta[name="octolytics-dimension-repository_public"]',
  )?.content
  if (repositoryPublic === "true") return "Public"
  if (repositoryPublic === "false") return "Private"

  const labelText = label?.textContent?.trim()
  if (labelText === "Public" || labelText === "Private") return labelText

  return (
    document.querySelector<HTMLElement>("#repository-container-header")
      ?.innerText ?? null
  )
}

function getHeaderBand(
  element: HTMLElement,
  viewportWidth: number,
): HTMLElement {
  let band: HTMLElement | null = null

  for (
    let current: HTMLElement | null = element;
    current !== null;
    current = current.parentElement
  ) {
    const { width, height } = current.getBoundingClientRect()
    if (height > 240) break
    if (width >= viewportWidth * 0.75 && height >= 48) band = current
  }

  return band ?? element.parentElement ?? element
}

export function paintRepositoryHeaders(
  document: Document,
  publicColor: string,
  privateColor: string,
): void {
  const label = getVisibilityLabel(document)
  const visibility = getVisibility(document, label)
  if (visibility === null) return

  const color = getRepositoryColor(visibility, publicColor, privateColor)
  if (color === null) return

  const viewportWidth =
    document.documentElement.clientWidth ||
    document.defaultView?.innerWidth ||
    1
  const headers = new Set<HTMLElement>()
  const repositoryContainer = document.querySelector<HTMLElement>(
    "#repository-container-header",
  )
  const repositoryNavigation = document.querySelector<HTMLElement>(
    'nav[aria-label="Repository"]',
  )

  if (repositoryContainer !== null) headers.add(repositoryContainer)
  if (repositoryNavigation !== null) {
    headers.add(getHeaderBand(repositoryNavigation, viewportWidth))
  }
  if (label !== null) headers.add(getHeaderBand(label, viewportWidth))

  for (const header of headers) header.style.backgroundColor = color
}
