import { beforeEach, describe, expect, it } from "vitest"

import { paintRepositoryHeaders } from "../src/repository-header"

function setRect(selector: string, width: number, height: number): HTMLElement {
  const element = document.querySelector<HTMLElement>(selector)
  if (element === null) throw new Error(`Missing fixture element: ${selector}`)

  element.getBoundingClientRect = () =>
    ({
      bottom: height,
      height,
      left: 0,
      right: width,
      top: 0,
      width,
      x: 0,
      y: 0,
      toJSON() {},
    }) as DOMRect
  return element
}

beforeEach(() => {
  document.head.innerHTML = ""
  document.body.innerHTML = ""
  Object.defineProperty(document.documentElement, "clientWidth", {
    configurable: true,
    value: 1000,
  })
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
    const header = setRect("#repository-container-header", 1000, 140)

    paintRepositoryHeaders(document, "#6fe86e", "#d35829")

    expect(header.style.backgroundColor).toBe("rgb(111, 232, 110)")
  })

  it("colors the separate navigation and title bands in the signed-in layout", () => {
    document.head.innerHTML =
      '<meta name="octolytics-dimension-repository_public" content="false">'
    document.body.innerHTML = `
      <div id="navigation-band">
        <nav aria-label="Repository"></nav>
      </div>
      <div id="title-band">
        <div><span class="prc-Label">Private</span></div>
      </div>
    `
    const navigation = setRect("nav", 900, 48)
    const navigationBand = setRect("#navigation-band", 1000, 70)
    const titleBand = setRect("#title-band", 1000, 100)

    paintRepositoryHeaders(document, "#6fe86e", "#d35829")

    expect(navigation.style.backgroundColor).toBe("")
    expect(navigationBand.style.backgroundColor).toBe("rgb(211, 88, 41)")
    expect(titleBand.style.backgroundColor).toBe("rgb(211, 88, 41)")
  })
})
