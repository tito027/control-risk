import { CascaderProps, UploadProps } from "element-plus"
import { RouteLocationRaw } from "vue-router"
import { IUserInformation } from "./control"
import { CascaderOption, SelectContext } from "element-plus"
import { ConditionOptions } from "yup/lib/Condition"

/**
 * @Modal Component
 */

export type Modals =
  | "formBusinessModal"
  | "formBusinessContactModal"
  | "formPsychoModal"
  | "formPayrollDiscountModal"
  | "formPayrollGratificationModal"
  | "formCreateGratificationTypeModal"
  | "formCreateDiscountModal"
  | "formAssignDiscountModal"
  | "formCreateDiscountTypeModal"
  | "formCreateMasiveDiscountModal"
  | "formCreateMasiveGratificationModal"
  | "formCreateUnknownModal"
  | "formCreateScheduledDiscountModal"
  | "formCreatePayrollModal"
  | "formAssignGratificationModal"
  | "formCreateScheduledGratificationModal"
  | "formClosePayrollModal"
  | "formAgentStatusModal"
  | "formCreateWorkshiftAgentModal"
  | "formAssignWorkshiftAgentModal"
  | "formUnassignWorkshiftAgentModal"
  | "formHolidayModal"
  | "formInventoryModal"
  | "formUpdateInventoryModal"
  | "formWeaponMaintenanceModal"
  | "formCloseHolidayModal"
  | "formApproveHolidayModal"
  | "formRemoveUserModal"
  | "formComplaintModal"
  | "formNewsModal"
  | "formCheckedNewsModal"
  | "formBusinessConfigModal"
  | "confirmModal"
  | "formAgencyModal"
  | "formAgencyConfigModal"
  | "formPhysicalPositionModal"
  | "formAgentAssignmentModal"
export type ModalState = {
  show?: boolean
  isEdit?: boolean
  payload?: any
  isSingular?: boolean
}

// Select
export interface IOptions<T = string> {
  value: T
  label: string
  selected: boolean
  disabled?: boolean
}

/**
 * @Select component
 */
export type Options<T = any> = {
  value: T
  label: string
  disabled?: boolean
}

export type MultiOptions = {
  value: string
  label: string
  children?: {
    value: string
    label: string
  }[]
}

export type ArgonOptions<T = any> = {
  value: string
  item?: T
  label: string
  placeholder?: boolean
  disabled?: boolean
  selected?: boolean
}

/**
 * @Table Components
 */
export type FilterTypes = "string" | "date" | "time" | "simple-date"
export type ITableColumns = {
  textAlign?: "center" | "right" | "left"
  prop: string
  label: string
  minWidth: number
  default?: string
  link?: RouteLocationRaw
  formatter?: (
    row: any,
    column: any,
    cellValue?: number,
    index?: number
  ) => string
  headerAlign?: "center" | "right" | "left"
  labelClassName?: string
  type?: FilterTypes
  className?: string
  cellClassName?: string
}

export type ParamFilter<T extends FilterTypes = FilterTypes> = {
  value: T extends "string" ? string : Date[]
  label?: string
  column?: string
  type: T
}
export interface FilterTable {
  seeAll: boolean
  // pag: number
  params: ParamFilter[]
}

export type SelectProp<T extends InputTypes = InputTypes> = {
  remote: string
  query_param: string
  options: {
    key: string
    label: string
    multiple?: boolean
  }
}

export type SelectProps = {
  label?: string
  labelClasses?: string
  required?: boolean
  errorMessage?: string
  hasIcon?: boolean
  alternative?: boolean
  inputGroupClasses?: { [k: string]: string } | string
  class?: string
  inputClasses?: { [k: string]: string } | string
  group?: string
  addonLeftIcon?: string
  addonRightIcon?: string
  name: string
  placeholder: string
  disabled?: boolean
  value?: unknown
  options?: Options<any>[]
  formGroupClasses?: { [k: string]: string } | string
  fetch?: string
  remote?: string
  query_param?: string
  loading?: boolean
  select?: (e: any) => void
  params?: { [k: string]: string | number }
  selectOptions: Pick<SelectContext, "props">["props"] & {
    size?: "large" | "default" | "small"
    valueKey: string
    returnAll?: boolean
    labelKey: string
    noDataText?: string
    multiple?: boolean
  }
}

export type DatePickerProps = { classPicker: string; classParent: string }

export type InputTypes =
  | "text"
  | "textarea"
  | "alpha"
  | "options"
  | "multioptions"
  | "file"
  | "date"
  | "daterange"
  | "dates"
  | "datetime"
  | "datetimerange"
  | "month"
  | "monthrange"
  | "week"
  | "year"
  | "checkbox"
  | "number"

export type Field<T extends InputTypes = InputTypes> = {
  label: string
  type: T
  rows?: string
  name: string
  format?: string
  size?: "sm" | "md" | "lg"
  className?: string
  placeholder?: string
  tip?: string
  indication?: string
  depends_on?: {
    name: string
    query_param: string
  }
  cascaderOptions?: T extends "multioptions" ? CascaderProps : undefined
  value?: T extends "file" ? IUserInformation["docs"][0] : string
  checked?: boolean
  url?: string
  staticOptions?: Options<string>[]
  disabled?: boolean
  hidden?: { [k: string]: string | string[] | boolean | boolean[] }
  step?: number
  min?: number
  max?: number
  validate?: {
    required?: boolean | string
    min?: number | [number, string] | Date | [Date, string]
    max?: number | [number, string] | Date | [Date, string]
    regex?: RegExp | [RegExp, string]
    email?: string
    when?: [string | string[], ConditionOptions]
    integer?: boolean | string
    decimalAllows?: number | [number, string]
    integer?: string
    typeError?: string
  }
} & (Partial<SelectProp<T>> | SelectProp<T>) &
  (Partial<UploadProps> | UploadProps) &
  (Partial<DatePickerProps> | DatePickerProps)

export type ControlOption = CascaderOption & { parent?: string }

export type MassivePayload = {
  users: string[][]
  discount_type?: string
  gratification_type?: string
  value: string
  is_pending: boolean
  is_rejected: boolean
  by_user: string
}
