import { AxiosError } from "axios"
import { ElMessage, UploadUserFile } from "element-plus"
import { Ref } from "vue"
import { useRouter } from "vue-router"
import { DateTime } from "luxon"
import { Field } from "@/types/components"
import { IError } from "control-risk/default.interface"
import router from "@/router"
import { AuthModule } from "@/store/modules/Auth"
import { env } from "@/config"

export function getUrl(asset: string): string {
  return new URL(asset, location.origin + import.meta.env.BASE_URL).href
}
export function getUrlBackend(asset: string): string {
  return new URL(
    asset,
    import.meta.env.MODE === "development" ? env.apiGateway : env.apiGateway
  ).href
}

export function getDateOrUndefined(date: string | undefined) {
  return date ? new Date(date) : undefined
}
export function getFileOrUndefined(
  upload: Field<"file">["value"] | undefined
): UploadUserFile | undefined {
  return upload
    ? {
        name: upload.name,
        url: new URL(upload.file, getUrlBackend("./public")).href,
      }
    : upload
}

export function getMimeType<T>(file: any, fallback: string | null = null) {
  const byteArray = new Uint8Array(file).subarray(0, 4)
  let header = ""
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16)
  }
  switch (header) {
    case "89504e47":
      return "image/png"
    case "47494638":
      return "image/gif"
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
    case "ffd8ffe3":
    case "ffd8ffe8":
      return "image/jpeg"
    default:
      return fallback
  }
}
export type OptionsHandleRequest = {
  loadingState?: Ref<boolean>
  hideAlert?: boolean
}
export async function handleRequests<T>(
  request: Promise<T>,
  options?: OptionsHandleRequest
): Promise<
  { success: true; reply: T } | { success: false; reply: AxiosError<any> }
> {
  try {
    if (options?.loadingState) options.loadingState.value = true
    const response = await request
    if (options?.loadingState) options.loadingState.value = false
    return { success: true, reply: response }
  } catch (payload: any) {
    const error: IError = payload.response.data
    const errors: string[] = Array.isArray(error.error.message)
      ? error.error?.message
      : [error.error.message ?? payload.message]
    if (!options?.hideAlert)
      errors.forEach(msg =>
        ElMessage({
          showClose: true,
          message: msg,
          type: "error",
        })
      )
    if (options?.loadingState) options.loadingState.value = false
    if (payload.response.status === 401) {
      AuthModule.localLogout()
    }

    return {
      success: false,
      reply: payload,
    }
  }
}

export function removeKey<T>(obj: T, keys: Array<keyof T>) {
  keys.forEach(k => delete obj[k])
  return obj
}

export function flatObject(obj: object, key?: string): object {
  return Object.entries(obj).reduce((prev, [k, v]) => {
    if (typeof v === "object" && v !== null)
      return Object.assign(prev, flatObject(v, key ? `${key}.${k}` : k))
    prev[key ? `${key}.${k}` : k] = v
    return prev
  }, {} as { [k: string]: any })
}
export function formatDate(date: any): string {
  return DateTime.fromISO(typeof date === "string" ? date : "").toFormat(
    "dd.MM.yyyy"
  )
}
