<script setup lang="ts">
import { getDateOrUndefined } from "@/utils/utils"
import { useField } from "vee-validate"
import { onMounted, ref, watch, watchEffect } from "vue"

const props = defineProps<{
  defaultValue?: Date | undefined
  type:
    | "year"
    | "month"
    | "date"
    | "dates"
    | "week"
    | "datetime"
    | "datetimerange"
    | "daterange"
    | "monthrange"
  classPicker?: string
  classParent?: string
  label: string
  format: string
  name: string
  smallLabel?: boolean
  isRequired?: boolean
  valueChange?: number
}>()

// Data
const modelValue = ref<Date>()
const { value: inputValue, errorMessage, handleChange } = useField<Date>(
  props.name,
  undefined,
  {
    initialValue: props.defaultValue,
  }
)

watch(
  () => props.valueChange,
  () => {
    if(props.defaultValue)
      inputValue.value = props.defaultValue
  }
)

onMounted(() => {
  if (props.defaultValue) inputValue.value = new Date(props.defaultValue)
})
</script>
<template>
  <div :class="classParent ? classParent : 'form-group w-50 px-1'">
    <div>
      <label
        v-if="label"
        :class="{
          'fs-7': smallLabel,
          'text-danger': errorMessage,
          'text-muted': !errorMessage,
        }"
      >
        {{ label }}
        <span v-if="isRequired">*</span>
      </label>
    </div>
    <!-- <input type="hidden" :name="name" :value="modelValue?.valueOf()" /> -->
    <el-date-picker
      :type="type"
      :name="name"
      :class="classPicker"
      :format="format"
      v-model:model-value="inputValue"
    />

    <div
      class="text-danger invalid-feedback"
      style="display: block"
      v-show="errorMessage"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>
