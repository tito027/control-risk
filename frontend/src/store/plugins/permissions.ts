import { IRootState } from "@/store"
import { IndexType } from "@/types/app"
import { Store } from "vuex"
export type Permissions = {
  permission: PermissionName
  state: PermissionState
  errorMessage?: any
}
export const AppPermissions: PermissionName[] = [
  "camera" as PermissionName,
  "geolocation",
]

export const CheckPermissions = async (store: Store<IRootState>) => {
  const config = localStorage.getItem("data")
  const paginationConfig = localStorage.getItem("pagination")
  const MyPermissions: IndexType<Permissions> = {}
  await Promise.all(
    AppPermissions.map(async permission => {
      try {
        const response = await navigator.permissions.query({ name: permission })
        MyPermissions[permission] = { permission, state: response.state }
      } catch (e) {
        MyPermissions[permission] = {
          permission,
          state: "denied",
          errorMessage: e,
        }
      }
    })
  )
  store.state.app.permissions = MyPermissions
  if (config) {
    const parseConfig = JSON.parse(config)
    store.state.app.agencyId = parseConfig.agency
    store.state.app.physicalPositionId = parseConfig.position
  }

  if (paginationConfig) {
    store.state.app._pagination = JSON.parse(paginationConfig)
  }
}
