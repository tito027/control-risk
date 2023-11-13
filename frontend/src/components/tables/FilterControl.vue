<script lang="ts" setup>
import { FilterTypes, ITableColumns, ParamFilter } from "@/types/components"
import { DateTime } from "luxon"
import { ref, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
// Props
export type FilterOptions = {
  [k: string]: {
    disabledDate?: (time: Date) => boolean
  }
}
const props = defineProps<{
  columns: ITableColumns[]
  filterOptions?: FilterOptions
}>()
const emits = defineEmits<{
  (e: "add", payload: ParamFilter): void
}>()

// Data
const filter = ref<ITableColumns | undefined>()
const searchQuery = ref<string | Date | undefined>()
const route = useRoute()
const router = useRouter()

// Functions
function newFilter(filter?: ITableColumns) {
  let value: string | Date[] = searchQuery.value as string
  if (!value) return
  if (filter?.type === "simple-date") {
    const now = DateTime.fromJSDate(searchQuery.value as Date)
    value = [now.startOf("day").toJSDate(), now.endOf("day").toJSDate()]
  }
  emits("add", {
    label: filter?.label,
    column: filter?.prop,
    type: filter?.type,
    value: value,
  } as ParamFilter<FilterTypes>)
}

// Watchs
watchEffect(() => {
  if (props.columns.length) filter.value = props.columns[0]
})
</script>
<template>
  <div class="control-filter d-flex">
    <div class="prepend">
      <el-select
        v-model="filter"
        placeholder="Seleccione un filtro"
        value-key="label"
        @change="searchQuery = undefined"
      >
        <el-option
          v-for="(col, i) in columns"
          :key="i"
          :label="col.label"
          :value="col"
        />
      </el-select>
    </div>
    <div class="wrapper">
      <el-input
        v-if="!filter?.type || filter.type === 'string'"
        class="mb-0 ml-1 d-flex control-filter"
        clearable
        placeholder="Buscar"
        v-model="(searchQuery as string)"
        aria-controls="datatables"
        @keyup.enter="newFilter(filter)"
      >
      </el-input>
      <el-date-picker
        v-else-if="filter.type === 'simple-date'"
        v-model="searchQuery"
        type="date"
        :disabled-date="filterOptions?.[filter.prop]?.disabledDate"
        placeholder="Seleccione una fecha"
      />
      <el-date-picker
        v-else-if="filter.type === 'date'"
        v-model="searchQuery"
        type="daterange"
        range-separator="hasta"
        start-placeholder="Fecha inicial"
        end-placeholder="Fecha final"
      />
      <el-time-picker
        v-else-if="filter.type === 'time'"
        v-model="searchQuery"
        is-range
        range-separator="To"
        start-placeholder="Start time"
        end-placeholder="End time"
      />
    </div>
    <div class="append">
      <el-button @click="newFilter(filter)">
        <i class="fas fa-search"></i>
      </el-button>
    </div>
  </div>
</template>

<style lang="scss">
.control-filter {
  max-width: 400px;
  .prepend {
    flex: 0.5;
    .el-input__wrapper {
      background-color: var(--el-fill-color-light);
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;
      box-shadow: 1px 0 0 var(--el-input-border-color, var(--el-border-color))
          inset,
        0 1px 0 var(--el-input-border-color, var(--el-border-color)) inset,
        0 -1px 0 var(--el-input-border-color, var(--el-border-color)) inset;
    }
  }
  .wrapper {
    flex: 1;
    .el-input__wrapper {
      border-radius: 0;
      box-shadow: 0 1px 0 var(--el-input-border-color, var(--el-border-color))
          inset,
        0 -1px 0 var(--el-input-border-color, var(--el-border-color)) inset;
    }
  }
  .append {
    flex: 0.1;
    .el-button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 0;
    }
  }
}
</style>
