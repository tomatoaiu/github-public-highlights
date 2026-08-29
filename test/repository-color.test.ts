import { describe, expect, it } from "vitest"

import { getRepositoryColor } from "../src/repository-color"

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
