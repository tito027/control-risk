import { createStore } from "vuex"
import { Alert } from "./modules/Alert"
import { App } from "./modules/App"
import { Auth } from "./modules/Auth"
import { CheckInOut } from "./modules/CheckInOut"
import { CheckPermissions } from "./plugins/permissions"
import { ConfirmModal } from "./modules/ConfirmModal"
import { FormModal } from "./modules/FormModule"
import { Config } from "./modules/Configs"

export interface IRootState {
  auth: Auth
  app: App
  alert: Alert
  checkio: CheckInOut
  formModal: FormModal
  confirmModal: ConfirmModal
  config: Config
}
export const store = createStore<IRootState>({
  plugins: [CheckPermissions],
})
