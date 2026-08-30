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
  run([
    "eval",
    `(() => {
      const header = document.querySelector('#repository-container-header')
      if (!(header instanceof HTMLElement)) throw new Error('Repository header not found')
      const color = getComputedStyle(header).backgroundColor
      if (color !== 'rgb(111, 232, 110)') {
        throw new Error('Original public color was not applied: ' + color)
      }
    })()`,
  ])
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
    })()`,
  ])
  for (const route of ["issues", "pulls"]) {
    run([
      "open",
      `https://github.com/tomatoaiu/github-public-highlights/${route}`,
    ])
    run(["wait", "#repository-container-header"])
    run([
      "eval",
      `(() => {
        const header = document.querySelector('.AppHeader-globalBar') ??
          document.querySelector('#repository-container-header')
        if (!(header instanceof HTMLElement)) throw new Error('${route} header not found')
        const color = getComputedStyle(header).backgroundColor
        if (color !== 'rgb(0, 255, 0)') {
          throw new Error('${route} header was not highlighted: ' + color)
        }
      })()`,
    ])
  }
  run([
    "eval",
    `(() => {
      const repositoryPublic = document.querySelector(
        'meta[name="octolytics-dimension-repository_public"]',
      )
      if (!(repositoryPublic instanceof HTMLMetaElement)) {
        throw new Error('Repository visibility metadata not found')
      }
      repositoryPublic.content = 'false'
      document.body.innerHTML = \`
        <header class="AppHeader">
          <div id="signed-in-global-bar" class="AppHeader-globalBar">
            <nav aria-label="GitHub Breadcrumb"></nav>
          </div>
          <div id="signed-in-repository-tabs">
            <nav aria-label="Repository"></nav>
          </div>
        </header>
        <div id="signed-in-title-band"><span class="prc-Label">Private</span></div>
      \`
    })()`,
  ])
  run(["wait", "300"])
  run([
    "eval",
    `(() => {
      const globalBar = document.getElementById('signed-in-global-bar')
      if (!(globalBar instanceof HTMLElement)) throw new Error('Global bar not found')
      const color = getComputedStyle(globalBar).backgroundColor
      if (color !== 'rgb(211, 88, 41)') {
        throw new Error('Global bar did not receive the original private color: ' + color)
      }
      for (const id of ['signed-in-repository-tabs', 'signed-in-title-band']) {
        const element = document.getElementById(id)
        if (!(element instanceof HTMLElement)) throw new Error(id + ' not found')
        if (getComputedStyle(element).backgroundColor !== 'rgba(0, 0, 0, 0)') {
          throw new Error(id + ' was highlighted instead of the global bar')
        }
      }
    })()`,
  ])
  run(["tab", "t2"])
  run([
    "eval",
    `(() => {
      const input = document.querySelectorAll('input[type="color"]')[1]
      if (!(input instanceof HTMLInputElement)) throw new Error('Private color input not found')
      input.value = '#ff6600'
      input.dispatchEvent(new Event('change', { bubbles: true }))
    })()`,
  ])
  run(["tab", "t1"])
  run(["wait", "300"])
  run([
    "eval",
    `(() => {
      const globalBar = document.querySelector('.AppHeader-globalBar')
      if (!(globalBar instanceof HTMLElement)) throw new Error('Global bar not found')
      const color = getComputedStyle(globalBar).backgroundColor
      if (color !== 'rgb(255, 102, 0)') {
        throw new Error('Private color was not applied: ' + color)
      }
    })()`,
  ])
  for (const route of ["issues", "pulls"]) {
    run([
      "eval",
      `(() => {
        document.body.innerHTML = \`
          <header class="AppHeader">
            <div id="${route}-global-bar" class="AppHeader-globalBar">
              <nav aria-label="GitHub Breadcrumb"></nav>
            </div>
          </header>
        \`
        history.pushState(null, '', '/tomatoaiu/github-public-highlights/${route}')
      })()`,
    ])
    run(["wait", "300"])
    run([
      "eval",
      `(() => {
        const globalBar = document.getElementById('${route}-global-bar')
        if (!(globalBar instanceof HTMLElement)) throw new Error('${route} global bar not found')
        const color = getComputedStyle(globalBar).backgroundColor
        if (color !== 'rgb(255, 102, 0)') {
          throw new Error('${route} global bar was not highlighted: ' + color)
        }
      })()`,
    ])
  }
  console.log("Browser test passed")
} finally {
  close()
}
