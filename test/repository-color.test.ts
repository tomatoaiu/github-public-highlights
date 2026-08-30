import { describe, expect, it } from "vitest"

import {
  DEFAULT_PRIVATE_REPOSITORY_COLOR,
  DEFAULT_PUBLIC_REPOSITORY_COLOR,
  getRepositoryColor,
  getRepositoryColors,
} from "../src/repository-color"

describe("getRepositoryColors", () => {
  it("uses muted defaults and migrates retired defaults", () => {
    const expected = {
      publicColor: "#46705a",
      privateColor: "#8a5942",
    }

    expect(DEFAULT_PUBLIC_REPOSITORY_COLOR).toBe(expected.publicColor)
    expect(DEFAULT_PRIVATE_REPOSITORY_COLOR).toBe(expected.privateColor)
    expect(getRepositoryColors(undefined, undefined)).toEqual(expected)
    expect(getRepositoryColors("#aaaaaa", "#aa22aa")).toEqual(expected)
    expect(getRepositoryColors("#6fe86e", "#d35829")).toEqual(expected)
  })

  it("preserves customized colors", () => {
    expect(getRepositoryColors("#111111", "#222222")).toEqual({
      publicColor: "#111111",
      privateColor: "#222222",
    })
  })
})

describe("getRepositoryColor", () => {
  it("returns the configured color for a public repository", () => {
    expect(getRepositoryColor("Public", "#111111", "#222222")).toBe("#111111")
  })

  it("returns the configured color for a private repository", () => {
    expect(getRepositoryColor("Private", "#111111", "#222222")).toBe("#222222")
  })

  it("leaves an unknown repository visibility unchanged", () => {
    expect(getRepositoryColor("Archived", "#111111", "#222222")).toBeNull()
  })
})
