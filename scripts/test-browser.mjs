import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { resolve } from "node:path"

const browser = resolve("node_modules/.bin/agent-browser")
const extension = resolve(".output/chrome-mv3")
const session = [
  "--session",
  `github-public-highlights-test-${process.pid}`,
  "--headed",
  "false",
  "--args",
  "--headless=new",
]

function run(args, stdio = "inherit") {
  return execFileSync(browser, [...session, ...args], {
    encoding: "utf8",
    stdio,
    timeout: 120_000,
  })
}

function close() {
  try {
    run(["close"], "ignore")
  } catch {}
}

const extensionId = createHash("sha256")
  .update(extension)
  .digest("hex")
  .slice(0, 32)
  .replace(/[0-9a-f]/g, (digit) =>
    String.fromCharCode(97 + Number.parseInt(digit, 16)),
  )

try {
  run(["open", "https://github.com/tomatoaiu/github-public-highlights"])
  run([
    "eval",
    `if (!navigator.userAgent.includes('HeadlessChrome')) {
      throw new Error('Browser test must run headlessly')
    }`,
  ])
  run(["wait", "#repository-container-header"])
  run(["tab", "new"])
  run(["open", `chrome-extension://${extensionId}/popup.html`])
  run([
    "eval",
    `(() => {
      const input = document.querySelector('input[type="color"]')
      if (!(input instanceof HTMLInputElement)) throw new Error('Public color input not found')
      input.value = '#00ff00'
      input.dispatchEvent(new Event('change', { bubbles: true }))
    })()`,
  ])
  run(["tab", "t1"])
  run(["wait", "300"])
  run([
    "eval",
    `(() => {
      const header = document.querySelector('#repository-container-header')
      if (!(header instanceof HTMLElement)) throw new Error('Repository header not found')
      const color = getComputedStyle(header).backgroundColor
      if (color !== 'rgb(0, 255, 0)') {
        throw new Error('Public color was not applied: ' + color)
      }
      return color
    })()`,
  ])
  console.log("Browser test passed")
} finally {
  close()
}
