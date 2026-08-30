import { defineBackground } from "#imports"

import { getRepositoryColors } from "../repository-color"

const PUBLIC_REPOSITORY = "color0"
const PRIVATE_REPOSITORY = "color1"

export default defineBackground(() => {
  void chrome.storage.local
    .get([PUBLIC_REPOSITORY, PRIVATE_REPOSITORY])
    .then((storedColors) => {
      const { publicColor, privateColor } = getRepositoryColors(
        storedColors[PUBLIC_REPOSITORY],
        storedColors[PRIVATE_REPOSITORY],
      )
      return chrome.storage.local.set({
        [PUBLIC_REPOSITORY]: publicColor,
        [PRIVATE_REPOSITORY]: privateColor,
      })
    })
})
