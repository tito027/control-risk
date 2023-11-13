<script lang="ts" setup>
import { ElLoading } from "element-plus"
import Info from "@/components/Loading/Info.vue"
import { AuthModule } from "@/store/modules/Auth"
import { computed, h, onMounted, watch } from "vue"
import { AppModule } from "./store/modules/App"
import Sidenav from "@/examples/Sidenav/index.vue"
import Configurator from "@/examples/Configurator.vue"
import Navbar from "@/examples/Navbars/Navbar.vue"
import AppFooter from "@/examples/Footer.vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()

const showConfig = computed(() => AppModule.showConfig)
const hideConfigButton = computed(() => AppModule.hideConfigButton)
let loadingService: ReturnType<typeof ElLoading["service"]>
const layout = computed(() => AppModule.layout)
const showSidenav = computed(() => AppModule.showSideNav)
const showNavbar = computed(() => AppModule.showNavbar)
const showFooter = computed(() => AppModule.showFooter)
const showBg = computed(() => route.fullPath.indexOf("admin") > -1)

watch(
  () => AuthModule.LoggingIn,
  loading => {
    if (loading)
      loadingService = ElLoading.service({
        lock: true,
        text: h(Info) as any,
        background: "rgba(0,0,0,.7)",
      })
    else !!loadingService && loadingService.close()
  }
)
</script>
<template>
  <div
    v-show="showBg"
    class="min-height-300 position-absolute w-100 bg-gradient-primary"
  ></div>
  <sidenav v-if="showSidenav" />
  <main class="main-content position-relative max-height-vh-100 h-100">
    <navbar v-if="showNavbar" />
    <router-view />
    <app-footer v-show="showFooter" />
    <!--     <configurator
      :class="[showConfig ? 'show' : '', hideConfigButton ? 'd-none' : '']"
    /> -->
  </main>
</template>
