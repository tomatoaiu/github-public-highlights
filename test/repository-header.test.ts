import { beforeEach, describe, expect, it } from "vitest"

import { paintRepositoryHeaders } from "../src/repository-header"

function getElement(selector: string): HTMLElement {
  const element = document.querySelector<HTMLElement>(selector)
  if (element === null) throw new Error(`Missing fixture element: ${selector}`)
  return element
}

beforeEach(() => {
  document.head.innerHTML = ""
  document.body.innerHTML = ""
})

describe("paintRepositoryHeaders", () => {
  it("colors GitHub's original combined repository header", () => {
    document.head.innerHTML =
      '<meta name="octolytics-dimension-repository_public" content="true">'
    document.body.innerHTML = `
      <div id="repository-container-header">
        <span class="Label">Public</span>
        <nav aria-label="Repository"></nav>
      </div>
    `
    const header = getElement("#repository-container-header")

    paintRepositoryHeaders(document, "#6fe86e", "#d35829")

    expect(header.style.backgroundColor).toBe("rgb(111, 232, 110)")
  })

  it.each([
    "/tomatoaiu/github-public-highlights/issues",
    "/tomatoaiu/github-public-highlights/pulls",
  ])("colors the persistent top bar on %s", (path) => {
    history.replaceState(null, "", path)
    document.head.innerHTML =
      '<meta name="octolytics-dimension-repository_public" content="false">'
    document.body.innerHTML = `
      <header class="AppHeader">
        <div id="global-bar" class="AppHeader-globalBar">
          <nav aria-label="GitHub Breadcrumb"></nav>
        </div>
        <div id="repository-tabs">
          <nav aria-label="Repository"></nav>
        </div>
      </header>
      <div id="title-band">
        <span class="prc-Label">Private</span>
      </div>
    `
    const globalBar = getElement("#global-bar")
    const repositoryNavigation = getElement('nav[aria-label="Repository"]')
    const repositoryTabs = getElement("#repository-tabs")
    const titleBand = getElement("#title-band")

    paintRepositoryHeaders(document, "#6fe86e", "#d35829")

    expect(globalBar.style.backgroundColor).toBe("rgb(211, 88, 41)")
    expect(repositoryNavigation.style.backgroundColor).toBe("")
    expect(repositoryTabs.style.backgroundColor).toBe("")
    expect(titleBand.style.backgroundColor).toBe("")
  })
})
