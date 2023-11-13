<script lang="ts" setup>
import { useField } from "vee-validate"
import { SelectContext } from "element-plus"
import { computed, onMounted, ref, useSlots, watch } from "vue"
import { Options } from "@/types/components"
import axios from "axios"
import { env } from "@/config"
import ApiGateway from "@/store/api"

// axios client
export type SelectProps = {
  label?: string
  labelClasses?: string
  smallLabel?: boolean
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
  parent?: string | null | undefined
  select?: (e: any) => void
  params?: { [k: string]: string | number }
  hidden?: boolean
  selectOptions: Pick<SelectContext, "props">["props"] & {
    size?: "large" | "default" | "small"
    valueKey: string
    returnAll?: boolean
    labelKey: string
    noDataText?: string
    multiple: boolean
  }
}

// Props
const props = defineProps<SelectProps>()

// State data
const focused = ref(false)
const model = ref<any>()
const options = ref<Options[]>([])
const filteredOptions = ref<Options[]>([])
const loading = ref(false)

// hooks
const { errorMessage, handleChange, value } = useField(props.name, undefined, {
  initialValue: props.value,
})
const slots = useSlots()

const getOptions = (query = "", value?: any) => {
  loading.value = true
  if ((!props.remote || !props.query_param) && props.fetch) {
    if (props.parent === undefined || props.parent) {
      const url = props.parent
        ? `/${props.fetch}/${props.parent}`
        : `/${props.fetch}`
      ApiGateway.get<{ data: any[] }>(url)
        .then(res => {
          options.value = res.data.data.map(item => ({
            value: item,
            label: item[props.selectOptions.labelKey ?? "label"],
          }))
          if (props.parent === undefined || props.parent)
            filteredOptions.value = options.value
        })
        .finally(() => {
          loading.value = false
          if (value) model.value = value
        })
    } else {
      loading.value = false
    }
    return
  } else if (props.remote && props.query_param) {
    axios
      .get<any[]>(props.remote, {
        params: {
          [props.query_param]: query,
          ...props.params,
        },
      })
      .then(res => {
        options.value = res.data.map(item => ({
          value: item,
          label: item[props.selectOptions.labelKey ?? "label"],
        }))
        filteredOptions.value = options.value
      })
      .finally(() => (loading.value = false))
  } else if (props.options) {
    if (value !== undefined) model.value = value
    options.value = props.options.map(item => ({
      value: item,
      label: item.label,
    }))
    filteredOptions.value = options.value
    loading.value = false
  }
}
const fetchIndividual = (value: string | number) => {
  if (!props.remote || !props.query_param) return
  loading.value = true
  axios
    .get<any[]>(props.remote, {
      params: {
        [props.query_param]: value,
      },
    })
    .then(res => {
      options.value = res.data.map(item => ({
        value: item,
        label: item[props.selectOptions.labelKey ?? "label"],
      }))
      filteredOptions.value = options.value
    })
    .finally(() => {
      loading.value = false
      model.value = options.value[0].value
      change(model.value)
    })
}

const hasIcon = computed(() => {
  const { addonRight, addonLeft } = slots
  return (
    addonRight !== undefined ||
    addonLeft !== undefined ||
    props.addonRightIcon !== undefined ||
    props.addonLeftIcon !== undefined ||
    props.group
  )
})
const change = (a: any) => {
  if (props.select) props.select(a)
  return handleChange(a)
}

watch(
  () => props.value,
  () => {
    model.value = props.value
    handleChange(props.value)
  }
)

watch(
  () => props.hidden,
  hide => {
    if (hide) model.value = value.value
  }
)

watch(
  () => props.parent,
  () => {
    if (props.parent === null) filteredOptions.value = []
    else if (props.parent === undefined) filteredOptions.value = options.value
    else {
      model.value = ""
      getOptions()
    }
  }
)

onMounted(() => {
  if (
    (typeof props.value === "string" || typeof props.value === "number") &&
    props.remote
  )
    fetchIndividual(props.value)
  else getOptions("", props.value)
})
</script>
<template>
  <div v-if="!hidden" class="form-group" :class="formGroupClasses">
    <slot name="label">
      <label v-if="label">
        <small
          v-if="smallLabel"
          :class="!errorMessage ? 'text-muted' : 'text-danger'"
          >{{ label }}</small
        >
        <template v-else> {{ label }}</template>
        <span v-if="required">*</span>
      </label>
    </slot>

    <div
      :class="[
        {
          'has-danger': !!errorMessage,
          'input-group': hasIcon,
          'input-group-alternative': alternative,
          focused: focused,
          'has-label': label || $slots.label,
        },
        inputGroupClasses,
      ]"
    >
      <div v-if="addonLeftIcon || $slots.addonLeft" class="input-group-prepend">
        <span class="input-group-text">
          <slot name="addonLeft">
            <i :class="addonLeftIcon"></i>
          </slot>
        </span>
      </div>
      <el-select
        v-model="model"
        :placeholder="placeholder"
        :size="selectOptions.size"
        :value-key="selectOptions.valueKey"
        class="form-control"
        :class="[
          {
            'is-invalid': !!errorMessage,
          },
        ]"
        :no-data-text="selectOptions.noDataText"
        :loading="loading"
        filterable
        :remote="!!remote"
        :remote-method="!!remote ? getOptions : undefined"
        :multiple="selectOptions.multiple"
        :disabled="disabled"
        @change="change"
      >
        <el-option
          v-for="item in (filteredOptions as Options<any>[])"
          :key="item.value?.[selectOptions.valueKey]"
          :label="item.value?.[selectOptions.labelKey]"
          :class="props.selectOptions.size"
          :value="
            props.remote || selectOptions.returnAll
              ? item.value
              : item.value[selectOptions.valueKey]
          "
        >
        </el-option>
      </el-select>
      <div
        v-if="addonRightIcon || $slots.addonRight"
        class="input-group-append"
      >
        <span class="input-group-text">
          <slot name="addonRight">
            <i :class="addonRightIcon"></i>
          </slot>
        </span>
      </div>
    </div>
    <slot name="infoBlock"></slot>
    <slot name="helpBlock">
      <small
        class="text-danger invalid-feedback"
        style="display: block"
        :class="{ 'mt-2': hasIcon }"
        v-show="errorMessage"
      >
        {{ errorMessage }}
      </small>
    </slot>
  </div>
</template>
