<script setup lang="ts">
import Breadcrumbs from "../Breadcrumbs.vue"
import { AppModule } from "@/store/modules/App"
import { computed, ref } from "vue"
import { useRoute } from "vue-router"
import { AuthModule } from "@/store/modules/Auth"

// state
const showMenu = ref(false)

const route = useRoute()

// computed
const currentRouteName = computed(() => route.name)
const currentDirectory = computed(() => {
  const dir = route.path.split("/")[1]
  return dir.charAt(0).toUpperCase() + dir.slice(1)
})
const isRTL = computed(() => AppModule.isRTL)
const isNavFixed = computed(() => AppModule.isNavFixed)
const darkMode = computed(() => AppModule.darkMode)
</script>
<template>
  <nav
    id="navbarBlur"
    :class="`${
      !isNavFixed
        ? 'navbar navbar-main navbar-expand-lg px-0 mx-4 border-radius-xl shadow-none'
        : `navbar navbar-main navbar-expand-lg px-0 mx-4 border-radius-xl shadow-none position-sticky ${
            darkMode ? 'bg-default' : 'bg-white'
          } left-auto top-2 z-index-sticky`
    } ${isRTL ? 'top-0 position-sticky z-index-sticky' : ''}`"
    v-bind="$attrs"
    data-scroll="true"
  >
    <div class="px-3 py-1 container-fluid">
      <breadcrumbs
        :current-page="currentRouteName"
        :current-directory="currentDirectory"
      />
      <div
        class="sidenav-toggler sidenav-toggler-inner d-xl-block d-none"
        :class="isRTL ? 'me-3' : ''"
      >
        <a
          href="#"
          class="p-0 nav-link text-body"
          @click.prevent="AppModule.navbarMinimize"
        >
          <div class="sidenav-toggler-inner">
            <i
              class="sidenav-toggler-line"
              :class="
                isNavFixed && !darkMode ? ' opacity-8 bg-dark' : 'bg-white'
              "
            ></i>
            <i
              class="sidenav-toggler-line"
              :class="
                isNavFixed && !darkMode ? ' opacity-8 bg-dark' : 'bg-white'
              "
            ></i>
            <i
              class="sidenav-toggler-line"
              :class="
                isNavFixed && !darkMode ? ' opacity-8 bg-dark' : 'bg-white'
              "
            ></i>
          </div>
        </a>
      </div>
      <div
        id="navbar"
        class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
        :class="isRTL ? 'px-0' : 'me-sm-4'"
      >
        <div
          class="pe-md-3 d-flex align-items-center"
          :class="isRTL ? 'me-md-auto' : 'ms-md-auto'"
        >
          <div class="input-group">
            <span class="input-group-text text-body">
              <i class="fas fa-search" aria-hidden="true"></i>
            </span>
            <input
              type="text"
              class="form-control"
              :placeholder="isRTL ? 'أكتب هنا...' : 'Type here...'"
            />
          </div>
        </div>
        <ul class="navbar-nav justify-content-end">
          <!--           <li class="nav-item d-flex align-items-center">
            <router-link
              :to="{ name: 'Login' }"
              class="px-0 nav-link font-weight-bold"
              :class="
                isNavFixed && !darkMode ? ' opacity-8 text-dark' : 'text-white'
              "
              target="_blank"
            >
              <i class="fa fa-user" :class="isRTL ? 'ms-sm-2' : 'me-sm-1'"></i>
              <span class="d-sm-inline d-none">{{
                AuthModule.user?.username
              }}</span>
            </router-link>
          </li> -->

          <!-- <li class="px-3 nav-item d-flex align-items-center">
            <a class="p-0 nav-link" @click="AppModule.toggleConfigurator">
              <i
                :class="`cursor-pointer fa fa-cog fixed-plugin-button-nav ${
                  !isNavFixed || darkMode ? 'text-white' : 'opacity-8 text-dark'
                }`"
              ></i>
            </a>
          </li> -->
          <li
            class="nav-item dropdown d-flex align-items-center"
            :class="isRTL ? 'ps-2' : 'pe-2'"
          >
            <a
              id="dropdownMenuButton"
              href="#"
              :class="`p-0 nav-link ${
                isNavFixed && !darkMode ? ' opacity-8 text-dark' : 'text-white'
              } ${showMenu ? 'show' : ''}`"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              @click="showMenu = !showMenu"
            >
              <i class="fa fa-user" :class="isRTL ? 'ms-sm-2' : 'me-sm-1'"></i>
              <span class="d-sm-inline d-none">{{
                AuthModule.user?.username
              }}</span>
            </a>
            <ul
              class="py-1 dropdown-menu dropdown-menu-end me-sm-n4 mt-0"
              :class="showMenu ? 'show' : ''"
              aria-labelledby="dropdownMenuButton"
            >
              <li>
                <button
                  class="dropdown-item border-radius-md fs-7"
                  href="javascript:;"
                  @click="AuthModule.logout()"
                >
                  <i class="fas fa-sign-out-alt"></i>
                  <span class="ms-1">Cerrar sesión</span>
                </button>
              </li>
            </ul>
          </li>
          <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a
              id="iconNavbarSidenav"
              href="#"
              class="p-0 nav-link text-white"
              @click.prevent="AppModule.navbarMinimize"
            >
              <div class="sidenav-toggler-inner">
                <i
                  :class="`sidenav-toggler-line ${
                    isNavFixed && !darkMode ? ' opacity-8 bg-dark' : 'bg-white'
                  }`"
                ></i>
                <i
                  :class="`sidenav-toggler-line ${
                    isNavFixed && !darkMode ? ' opacity-8 bg-dark' : 'bg-white'
                  }`"
                ></i>
                <i
                  :class="`sidenav-toggler-line ${
                    isNavFixed && !darkMode ? ' opacity-8 bg-dark' : 'bg-white'
                  }`"
                ></i>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<style>
.no-dropdown-top {
  margin-top: 0 !important;
}
</style>
