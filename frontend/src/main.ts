import { createApp } from "vue"
import App from "./App.vue"
import { store } from "@/store"
import router from "./router/index"
import "./assets/css/nucleo-icons.css"
import "./assets/css/nucleo-svg.css"
import "vue2-animate/dist/vue2-animate.min.css"
import VueTilt from "vue-tilt.js"
import ElementPlus from "element-plus"
import VueGoogleMaps from "@fawmi/vue-google-maps"
// import VueSweetalert2 from "vue-sweetalert2"
import ArgonDashboard from "./argon-dashboard"

const appInstance = createApp(App)
appInstance.use(store)
appInstance.use(router)
appInstance.use(VueTilt)
// appInstance.use(VueSweetalert2)
appInstance.use(ElementPlus)
appInstance.use(ArgonDashboard)
// Instancia de librería google maps
appInstance.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAfbQTdPZ20B5DhujHzKcQp_IQfjkVLoss",
  },
})

appInstance.mount("#app")
