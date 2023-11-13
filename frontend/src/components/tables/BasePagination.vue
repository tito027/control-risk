<script lang="ts" setup>
import { Colors } from "@/types/app"
import { computed, ref, watch } from "vue"

// ===> Emits & props
const emits = defineEmits<{
  (e: "update:modelValue", value: any): void
}>()
const props = withDefaults(
  defineProps<{
    type?: Colors
    pageCount?: number
    perPage: number
    total: number
    modelValue: number
    size?: string
    align?: string
    showPages?: boolean
  }>(),
  {
    pageCount: 0,
    perPage: 0,
    total: 0,
    modelValue: 1,
    size: "",
    align: "",
    showPages: true,
  }
)
// ===> Data
const defaultPagesToDisplay = ref(5)

// ===> computed
const paginationClass = computed(() => `pagination-${props.type}`)
const totalPages = computed(() => {
  if (props.pageCount > 0) return props.pageCount
  if (props.total > 0) {
    return Math.ceil(props.total / props.perPage)
  }
  return 1
})
const pagesToDisplay = computed(() => {
  if (totalPages.value > 0 && totalPages.value < defaultPagesToDisplay.value) {
    return totalPages.value
  }
  return defaultPagesToDisplay.value
})
const minPage = computed(() => {
  if (props.modelValue >= pagesToDisplay.value) {
    const pagesToAdd = Math.floor(pagesToDisplay.value / 2)
    const newMaxPage = pagesToAdd + props.modelValue
    if (newMaxPage > totalPages.value) {
      return totalPages.value - pagesToDisplay.value + 1
    }
    return props.modelValue - pagesToAdd
  } else {
    return 1
  }
})
const maxPage = computed(() => {
  if (props.modelValue >= pagesToDisplay.value) {
    const pagesToAdd = Math.floor(pagesToDisplay.value / 2)
    const newMaxPage = pagesToAdd + props.modelValue
    if (newMaxPage < totalPages.value) {
      return newMaxPage
    } else {
      return totalPages.value
    }
  } else {
    return pagesToDisplay.value
  }
})

// ===> Methods:
function range(min: number, max: number) {
  let arr = []
  for (let i = min; i <= max; i++) {
    arr.push(i)
  }
  return arr
}
function changePage(item: number) {
  emits("update:modelValue", item)
}
function nextPage() {
  if (props.modelValue < totalPages.value) {
    emits("update:modelValue", props.modelValue + 1)
  }
}
function prevPage() {
  if (props.modelValue > 1) {
    emits("update:modelValue", props.modelValue - 1)
  }
}
watch(
  () => props.perPage,
  (a, p) => {
    // console.log("cambia perpage", a, p)
    emits("update:modelValue", 1)
  }
)
watch(
  () => props.total,
  (a, p) => {
    if (p) emits("update:modelValue", 1)
  }
)
</script>
<template>
  <ul
    class="pagination mb-0"
    :class="
      ([size && `pagination-${size}`, align && `justify-content-${align}`],
      paginationClass)
    "
  >
    <li v-if="modelValue > 1" class="page-item prev-page">
      <a class="page-link" aria-label="Previous" @click="prevPage">
        <i class="fa fa-angle-left"></i>
      </a>
    </li>
    <div v-if="showPages" class="d-flex">
      <li
        class="page-item can-hover"
        v-for="item in range(minPage, maxPage)"
        :key="item"
        :class="{ active: modelValue === item }"
      >
        <a class="page-link" @click="changePage(item)">{{ item }}</a>
      </li>
    </div>
    <li v-if="modelValue < totalPages" class="page-item page-pre next-page">
      <a class="page-link" aria-label="Next" @click="nextPage">
        <i class="fa fa-angle-right"></i>
      </a>
    </li>
  </ul>
</template>
