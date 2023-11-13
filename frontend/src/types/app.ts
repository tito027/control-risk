import { EpPropMergeType } from "element-plus/es/utils"

export enum AlertState {
  error = "error",
  success = "success",
  warning = "warning",
  info = "info",
}
export type States = EpPropMergeType<StringConstructor, AlertState, unknown>
export type Colors = "danger" | "warning" | "primary" | "success" | "info"

export type Pagination = {
  perPage: number
  currentPage: number
  perPageOptions: number[]
  total: number
}

export enum ExpireTime {
  EXPIRE,
  SOON,
  LATER,
  FINE,
}
export type ErrorItem = {
  state: AlertState
  message: string
  icon?: string
  color?: Colors
}

export interface IndexType<T> {
  [k: string]: T
}

export type Response<T> = {
  data: T
  total: number
}
