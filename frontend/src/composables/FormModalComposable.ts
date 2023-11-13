import { Field, SelectProps } from "@/types/components"
import Select from "@/components/SelectControlled.vue"
import ArgonCheckbox from "@/components/ArgonCheckbox.vue"
import ArgonDatePicker from "@/components/ArgonDatePicker.vue"
import ArgonUpload from "@/components/ArgonUpload.vue"
import ArgonInput from "@/components/ArgonInput.vue"
import ArgonTextarea from "@/components/ArgonTextarea.vue"
import MultiOptions from "@/components/SelectMultipleGroup.vue"
import { ref } from "vue"
import { getDateOrUndefined, getFileOrUndefined } from "@/utils/utils"
import { UploadProps, UploadUserFile } from "element-plus"

export interface ArgonUploadProps extends UploadProps {
  tip: string
  indication: string
  defaultValue: UploadUserFile
  url?: string
}
export default function () {
  // types
  type FormPayload = {
    [k: string]: any
  }

  // state
  const state = ref<FormPayload>({})

  function getComponent(type: Field["type"]) {
    switch (type) {
      case "options":
        return Select
      case "multioptions":
        return MultiOptions
      case "checkbox":
        return ArgonCheckbox
      case "text":
      case "number":
        return ArgonInput
      case "textarea":
        return ArgonTextarea
      case "file":
        return ArgonUpload
      default:
        return ArgonDatePicker
    }
  }

  function getProps(input: Field, updt: { [k: string]: any }) {
    switch (input.type) {
      case "options":
        return {
          value: input.value,
          label: input.label,
          placeholder: input.placeholder,
          name: input.name,
          parent: input.depends_on?.name
            ? updt[input.depends_on.name]
              ? updt[input.depends_on.name]
              : null
            : undefined,
          remote: input.remote,
          fetch: input.url,
          query_param: input.query_param,
          options: input.staticOptions,
          disabled: input.disabled,
          inputGroupClasses: "input-group",
          select: e => {
            state.value = {
              ...state.value,
              [input.name]: Array.isArray(e) ? e.join(",") : e,
            }
          },
          selectOptions: {
            noDataText: "Sin coincidencias",
            size: "small",
            valueKey: input.options?.key ?? "",
            labelKey: input.options?.label ?? "",
            multiple: input.multiple ?? false,
          },
          params: input.depends_on
            ? {
                [input.depends_on.query_param]:
                  updt[input.depends_on.name]?.[input.options?.key ?? ""],
              }
            : undefined,
        } as SelectProps
      case "multioptions":
        return {
          label: input.label,
          name: input.name,
          fetch: input.url,
          query_param: input.query_param,
          multiple: input.multiple,
          options: input.options,
          placeholder: input.placeholder,
          cascaderOptions: input.cascaderOptions,
        }
      case "checkbox":
        return {
          id: `checkbox-${input.name}`,
          name: input.name,
          label: input.label,
          checked: input.checked ?? false,
          disabled: input.disabled,
          "group-classes": input.classParent,
        }
      case "file":
        return {
          onExceed: input.onExceed,
          onChange: input.onChange,
          limit: input.limit,
          autoUpload: input.autoUpload,
          accept: input.accept || ".pdf",
          defaultValue: getFileOrUndefined(input.value as any),
          tip: input.tip || "Solamente puede adjuntar un archivo PDF",
          indication: input.indication || "Subir Certificación",
          url: input.url,
        } as ArgonUploadProps
      case "textarea":
      case "text":
      case "number":
        const valueNum = input.value as string
        //console.log(input.name, valueNum)
        const { hidden, ...cleanInput } = input
        return { ...cleanInput, value: valueNum }
      default:
        const value = getDateOrUndefined(input.value as string)
        return {
          type: input.type,
          "default-value": value,
          label: input.label,
          classPicker: input.classPicker,
          classParent: input.classParent,
          format: input.format,
          valueChange: value ? value.getTime() : 0,
        }
    }
  }

  function hiddenInput(
    name: string,
    type: string,
    params: { [k: string]: string | string[] },
    data: { [k: string]: string },
    setField: any
  ): boolean {
    const hidden: boolean[] = []
    Object.keys(params).forEach(p => {
      if (Array.isArray(params[p])) hidden.push(!params[p].includes(data[p]))
      else hidden.push(params[p] !== data[p])
    })
    const hide = hidden.includes(true)
    if (hide)
      if (type === "number") setField(name, null)
      else setField(name, "")
    return hide
  }

  return {
    hiddenInput,
    getProps,
    getComponent,
    state,
  }
}
