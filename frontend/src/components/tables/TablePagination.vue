<script setup lang="ts">
import { computed } from "vue"
import BasePagination from "./BasePagination.vue"

export interface ITablePaginationProps {
  perPage: number
  currentPage: number
  perPageOptions: number[]
  total: number
}

// props & emits
const props = withDefaults(defineProps<ITablePaginationProps>(), {
  perPage: 5,
  currentPage: 1,
  perPageOptions: () => [5, 10, 25, 50],
  total: 50,
})
const emit = defineEmits<{
  (e: "update:currentPage", payload: number): void
  (e: "update:perPage", payload: number): void
}>()

// computed
const from = computed(() => {
  return props.perPage * (props.currentPage - 1)
})
const to = computed(() => {
  let highBound = from.value + props.perPage
  if (props.total < highBound) {
    highBound = props.total
  }
  return highBound
})
</script>
<template>
  <div class="d-flex px-3 py-3 align-items-center w-100">
    <el-select
      class="select-primary pagination-select me-2"
      size="small"
      style="width: 60px"
      :model-value="props.perPage"
      @update:model-value="pp => $emit('update:perPage', pp)"
      placeholder="Per page"
    >
      <el-option
        class="select-primary"
        v-for="item in perPageOptions"
        :key="item"
        :label="item"
        :value="item"
      >
      </el-option>
    </el-select>
    <p class="card-category me-auto mb-0" style="font-size: 0.8125rem">
      Mostrando {{ from + 1 }} - {{ to }} de {{ total }} registros
    </p>
    <base-pagination
      type="primary"
      class="pagination-no-border"
      :model-value="props.currentPage"
      :per-page="props.perPage"
      :total="props.total"
      @update:model-value="item => $emit('update:currentPage', item)"
    >
    </base-pagination>
  </div>
</template>
