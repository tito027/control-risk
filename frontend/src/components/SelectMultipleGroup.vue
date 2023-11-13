<script lang="ts" setup>
import { onMounted, ref } from "vue"
import axios from "axios"
import { env } from "@/config"
import { MultiOptions } from "@/types/components"
import { CascaderProps } from "element-plus"
import { useField } from "vee-validate"
const props = withDefaults(
  defineProps<{
    name: string
    label?: string
    multiple: boolean
    options?: MultiOptions[]
    placeholder: string
    cascaderOptions?: CascaderProps
    selectedOptions?: []
    fetch: string
    query_param?: string
    remote?: string
    parent?: string | null | undefined
    params?: { [k: string]: string | number }
    formGroupClasses?: { [k: string]: string } | string
    smallLabel?: boolean
    required?: boolean
    errorMessage?: string
    inputGroupClasses?: { [k: string]: string } | string
  }>(),
  {
    multiple: true,
  }
)

// State data
const focused = ref(false)
const model = ref<any>()
const options = ref<MultiOptions[]>([])
const selectedOpts = ref<any[]>([])
const filteredOptions = ref()
const loading = ref(false)

// hooks
const { errorMessage, handleChange } = useField(props.name, undefined, {
  initialValue: props.selectedOptions,
})

// Methods
const onChange = (a: any) => {
  // if (props.se) props.select(a)
  return handleChange(a)
}

const getOptions = (query = "", value?: any) => {
  loading.value = true
  if ((!props.remote || !props.query_param) && props.fetch) {
    if (props.parent === undefined || props.parent) {
      const url = props.parent
        ? `${env.apiGateway}/${props.fetch}/${props.parent}`
        : `${env.apiGateway}/${props.fetch}`
      axios
        .get<{ data: any[] }>(url)
        .then(res => {
          options.value = res.data.data
        })
        .finally(() => {
          loading.value = false
          if (value) model.value = value
        })
    } else {
      loading.value = false
    }
    return
  } else if (props.remote && props.query_param)
    axios
      .get<any[]>(props.remote, {
        params: {
          [props.query_param]: query,
          ...props.params,
        },
      })
      .then(res => {
        options.value = res.data
        filteredOptions.value = options.value
      })
      .finally(() => (loading.value = false))
  else if (props.options) {
    if (value !== undefined) model.value = value
    options.value = props.options
    filteredOptions.value = options.value
    loading.value = false
  }
}
onMounted(getOptions)
</script>

<template>
  <div class="form-group" :class="formGroupClasses">
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
          focused: focused,
          'has-label': label || $slots.label,
        },
        inputGroupClasses,
      ]"
      class="input-group"
    >
      <el-cascader
        :props="props.cascaderOptions"
        :options="options"
        :placeholder="placeholder"
        v-model="selectedOpts"
        class="w-100 form-control"
        :class="[
          {
            'is-invalid': !!errorMessage,
          },
        ]"
        size="small"
        filterable
        clearable
        show-all-levels
        @change="onChange"
        :collapse-tags="multiple"
      />
    </div>
    <slot name="helpBlock">
      <small
        class="text-danger invalid-feedback"
        style="display: block"
        v-show="errorMessage"
      >
        {{ errorMessage }}
      </small>
    </slot>
  </div>
</template>
