import { AxiosError } from "axios"
import { ElMessage } from "element-plus"
import type { Colors, States } from "@/types/app"
import { AlertModule } from "@/store/modules/Alert"

export enum AlertState {
  error = "error",
  success = "success",
  warning = "warning",
  info = "info",
}
const AlertTypeByStatus: { [k in AlertState]: number[] } = {
  error: [400, 404, 403, 401, 402],
  success: [200, 201, 202, 205, 220],
  warning: [300],
  info: [],
}
const AlertMessageByStatus: { [k in AlertState]: string } = {
  error: "Error: ",
  success: "Completado: ",
  warning: "Alerta: ",
  info: "",
}
export const AlertColorByStatus: { [k in AlertState]: Colors } = {
  error: "danger",
  success: "success",
  warning: "warning",
  info: "info",
}
export const AlertIconByStatus: { [k in AlertState]: string } = {
  error: "fas fa-exclamation-circle",
  success: "fas fa-check-circle",
  warning: "fas fa-exclamation-triangle",
  info: "fas fa-info-circle",
}

function getTypeByStatus(status: number): States {
  for (const k in AlertTypeByStatus) {
    if (AlertTypeByStatus[k as AlertState].includes(status)) return k as States
  }
  return AlertState.error
}

export function handleErrors(error: any) {
  if (error instanceof AxiosError) {
    const type = getTypeByStatus(error.response?.status ?? 0)
    AlertModule.add({
      state: type,
      color: AlertColorByStatus[type],
      message: `<strong>${AlertMessageByStatus[type]}</strong> ${error.response?.data.error.message}`,
      icon: AlertIconByStatus[type],
    })
    ElMessage({
      type,
      message: `${AlertMessageByStatus[type]} ${error.response?.data.error.message}`,
    })
  }
}
