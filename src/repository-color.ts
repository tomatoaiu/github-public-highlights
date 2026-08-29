export function getRepositoryColor(
  visibility: string,
  publicColor: string,
  privateColor: string,
): string | null {
  if (visibility.includes("Public")) return publicColor
  if (visibility.includes("Private")) return privateColor
  return null
}
