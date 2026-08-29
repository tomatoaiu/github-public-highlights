import { defineConfig } from "wxt"

export default defineConfig({
  srcDir: "src",
  manifestVersion: 3,
  manifest: {
    name: "github-public-highlights",
    description: "Highlight public repos on GitHub",
    permissions: ["storage"],
  },
})
