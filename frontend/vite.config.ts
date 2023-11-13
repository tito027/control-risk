import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
const path = require("path")
import vueJsx from "@vitejs/plugin-vue-jsx"
import mkcert from "vite-plugin-mkcert"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/sistema/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["@fawmi/vue-google-maps", "fast-deep-equal"],
  },
  server: {
    host: true,
    // https: true,
  },
  plugins: [vue(), vueJsx({})],
})
