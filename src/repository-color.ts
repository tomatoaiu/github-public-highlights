export const DEFAULT_PUBLIC_REPOSITORY_COLOR = "#46705a"
export const DEFAULT_PRIVATE_REPOSITORY_COLOR = "#8a5942"

export function getRepositoryColors(
  storedPublicColor: unknown,
  storedPrivateColor: unknown,
): { publicColor: string; privateColor: string } {
  return {
    publicColor:
      typeof storedPublicColor === "string" &&
      storedPublicColor !== "#aaaaaa" &&
      storedPublicColor !== "#6fe86e"
        ? storedPublicColor
        : DEFAULT_PUBLIC_REPOSITORY_COLOR,
    privateColor:
      typeof storedPrivateColor === "string" &&
      storedPrivateColor !== "#aa22aa" &&
      storedPrivateColor !== "#d35829"
        ? storedPrivateColor
        : DEFAULT_PRIVATE_REPOSITORY_COLOR,
  }
}

export function getRepositoryColor(
  visibility: string,
  publicColor: string,
  privateColor: string,
): string | null {
  if (visibility.includes("Public")) return publicColor
  if (visibility.includes("Private")) return privateColor
  return null
}
