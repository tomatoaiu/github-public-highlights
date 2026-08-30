import { getRepositoryColors } from "./repository-color"

const colorInputs = document.querySelectorAll('input[type="color"]')

const PUBLIC_REPOSITORY = "color0"
const PRIVATE_REPOSITORY = "color1"

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(
    [PUBLIC_REPOSITORY, PRIVATE_REPOSITORY],
    (storedColors) => {
      const { publicColor, privateColor } = getRepositoryColors(
        storedColors[PUBLIC_REPOSITORY],
        storedColors[PRIVATE_REPOSITORY],
      )
      const publicInput = colorInputs[0] as HTMLInputElement
      const privateInput = colorInputs[1] as HTMLInputElement
      publicInput.value = publicColor
      privateInput.value = privateColor
    },
  )

  colorInputs.forEach((input, index) => {
    input.addEventListener("change", (event) => {
      const color = (event.target as HTMLInputElement).value
      void chrome.storage.local.set({ [`color${index}`]: color })
    })
  })
})
