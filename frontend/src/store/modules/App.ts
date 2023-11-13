import { store } from "@/store"
import { Module, getModule, Mutation, Action } from "vuex-module-decorators"
import bootstrap from "bootstrap/dist/js/bootstrap.min.js"
import { IndexType, Pagination } from "@/types/app"
import Master from "./master"

export type Permissions = {
  permission: PermissionName
  state: PermissionState
  errorMessage?: any
}
export const AppPermissions: PermissionName[] = [
  "camera" as PermissionName,
  "geolocation",
]
export interface IApp {
  permissions: IndexType<Permissions>
  hideConfigButton: boolean
  isPinned: boolean
  showConfig: boolean
  isRTL: boolean
  color: string | IndexType<boolean>
  sidebarType: string
  darkMode: boolean
  isNavFixed: boolean
  isAbsolute: boolean
  showNavs: boolean
  showSideNav: boolean
  showNavbar: boolean
  showFooter: boolean
  showMain: boolean
  layout: string
  bootstrap: any
  zone: {
    lat: number
    lng: number
  }
}
@Module({ dynamic: true, namespaced: true, store, name: "app" })
export class App extends Master {
  // Properties
  permissions: IndexType<Permissions> = {}
  hideConfigButton = false
  isPinned = true
  showConfig = false
  isRTL = false
  color = ""
  sidebarType = "bg-white"
  darkMode = false
  isNavFixed = false
  isAbsolute = false
  showNavs = true
  showSideNav = true
  showNavbar = true
  showFooter = true
  showMain = true
  layout = "default"
  bootstrap = bootstrap
  zone = {
    lat: 0,
    lng: 0,
  }
  _pagination: Pick<Pagination, "currentPage" | "perPage"> | null = null
  agencyId: string = ""
  physicalPositionId: string = ""
  get getPermissions() {
    return this.permissions
  }

  get hasAllPermissions() {
    return (
      Object.values(this.permissions).length &&
      !Object.values(this.permissions).some(p => p.state !== "granted")
    )
  }

  get getZone() {
    return this.zone
  }
  get getAgencyId() {
    return this.agencyId
  }

  get physicalPosition() {
    return this.physicalPositionId
  }

  get pagination() {
    return this._pagination
  }

  @Mutation
  setPermission(permission: Permissions) {
    this.permissions[permission.permission] = permission
  }

  @Mutation
  toggleConfigurator() {
    this.showConfig = !this.showConfig
  }
  @Mutation
  minimize() {
    const sidenav_show = document.querySelector("#app")
    sidenav_show?.classList.add("g-sidenav-hidden")
    sidenav_show?.classList.remove("g-sidenav-pinned")
    sidenav_show?.classList.add("g-sidenav-show")
    this.isPinned = false
  }

  @Mutation
  maximize() {
    const sidenav_show = document.querySelector("#app")
    // sidenav_show?.classList.add("g-sidenav-pinned")
    sidenav_show?.classList.add("g-sidenav-show")
    sidenav_show?.classList.remove("g-sidenav-hidden")
  }
  @Mutation
  navbarMinimize() {
    const sidenav_show = document.querySelector("#app")
    if (
      sidenav_show?.classList.contains("g-sidenav-show") &&
      sidenav_show?.classList.contains("g-sidenav-hidden")
    ) {
      sidenav_show?.classList.add("g-sidenav-pinned")
      sidenav_show?.classList.remove("g-sidenav-hidden")
    } else if (
      sidenav_show?.classList.contains("g-sidenav-show") &&
      sidenav_show?.classList.contains("g-sidenav-pinned")
    ) {
      sidenav_show?.classList.add("g-sidenav-hidden")
      sidenav_show?.classList.remove("g-sidenav-pinned")
      this.isPinned = false
    } else if (sidenav_show?.classList.contains("g-sidenav-show")) {
      sidenav_show?.classList.add("g-sidenav-pinned")
      this.isPinned = true
    }
  }

  @Mutation
  setHideConfigButton(payload: boolean) {
    this.hideConfigButton = payload
  }

  @Mutation
  setSidebarType(payload: string) {
    this.sidebarType = payload
  }
  @Mutation
  navbarFixed() {
    if (this.isNavFixed === false) {
      this.isNavFixed = true
    } else {
      this.isNavFixed = false
    }
  }
  @Mutation
  toggleDefaultLayout() {
    this.showNavbar = !this.showNavbar
    this.showSideNav = !this.showSideNav
    this.showFooter = !this.showFooter
  }

  @Mutation
  setLayout(active: boolean) {
    this.showNavbar = active
    this.showSideNav = active
    this.showFooter = active
  }

  @Mutation
  setZone(payload: { lat: number; lng: number }) {
    this.zone = payload
  }
  @Mutation
  setAgency(payload: string) {
    this.agencyId = payload
  }

  @Mutation
  setPhysicalPosition(payload: string) {
    this.physicalPositionId = payload
  }

  @Mutation
  setPagination(pagination: Pick<Pagination, "currentPage" | "perPage">) {
    localStorage.setItem("pagination", JSON.stringify(pagination))
    this._pagination = pagination
  }

  @Action
  toggleSidebarColor(payload: string) {
    this.setSidebarType(payload)
  }
}

export const AppModule = getModule(App)
