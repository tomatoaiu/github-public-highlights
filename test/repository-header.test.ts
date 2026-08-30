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
    "/tomatoaiu/github-public-highlights",
    "/tomatoaiu/github-public-highlights/issues",
    "/tomatoaiu/github-public-highlights/pulls",
  ])("colors the persistent top bar on %s", (path) => {
    history.replaceState(null, "", path)
    document.head.innerHTML =
      '<meta name="octolytics-dimension-repository_public" content="false">'
    document.body.innerHTML = `
      <header aria-label="Global navigation menu" role="banner">
        <div id="global-row" class="prc-Stack-Stack-UQ9k6">
          <nav aria-label="Breadcrumbs"></nav>
        </div>
        <nav id="repository-tabs" aria-label="Repository"></nav>
      </header>
      <div id="title-band">
        <span class="prc-Label">Private</span>
      </div>
    `
    const globalRow = getElement("#global-row")
    const repositoryTabs = getElement("#repository-tabs")
    const titleBand = getElement("#title-band")

    paintRepositoryHeaders(document, "#6fe86e", "#d35829")

    expect(globalRow.style.backgroundColor).toBe("rgb(211, 88, 41)")
    expect(repositoryTabs.style.backgroundColor).toBe("")
    expect(titleBand.style.backgroundColor).toBe("")
  })
})
