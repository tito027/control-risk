<script setup lang="ts">
import { h, onBeforeMount, useSlots } from "vue"
import type {
  ITableColumns,
  FilterTable,
  ParamFilter,
} from "@/types/components"
import { DateTime } from "luxon"
import FilterControl from "./FilterControl.vue"
import type { FilterOptions } from "./FilterControl.vue"
import { onMounted, ref, reactive, watch } from "vue"
import TablePagination from "./TablePagination.vue"
import ApiGateway from "@/store/api"
import { handleRequests } from "@/utils/utils"
import { AuthModule } from "@/store/modules/Auth"
import { TablesModule } from "@/store/table/Table"
import { IndexType } from "@/types/app"
import { RouteLocationRaw, useRoute, useRouter } from "vue-router"
import { App, AppModule } from "@/store/modules/App"

// Props & Emits
const slots = useSlots()
const props = withDefaults(
  defineProps<{
    columns: ITableColumns[]
    // pagination: Partial<ITablePaginationProps>
    map?: (data: any, i: number) => any
    endpoint: string
    showOptions?: boolean
    options?: { name: string; icon?: string; function?: any }[]
    selectFilterShow?: boolean
    selectFilterOptions?: any[]
    selectFilterTitle?: string
    defaultFilters?: ParamFilter[]
    filterOptions?: FilterOptions
    hideDefaultOptions?: boolean
    hideRowOptions?: boolean
    reloadData?: number
  }>(),
  {
    showOptions: true,
    hideRowOptions: false,
  }
)
const emits = defineEmits<{
  (e: "edit", row: any): void
  (e: "delete", row: any): void
  (e: "discount", row: any): void
  (e: "event", row: any): void
}>()

// funcitons
watch(
  () => TablesModule.reload,
  () => {
    if (TablesModule.Reload) getData()
    TablesModule.setReload(false)
  }
)

watch(
  () => props.reloadData,
  async () => {
    await getData()
  }
)

// State
const router = useRouter()
const route = useRoute()
const pagination = reactive({
  perPage: 5,
  currentPage: AppModule.pagination?.currentPage ?? 1,
  perPageOptions: [5, 10, 25, 50],
  total: 0,
})

const filters = ref<FilterTable>({
  seeAll: false,
  params: [],
})
const endpointValue = ref(props.endpoint)
const data = ref<Object[]>([])
const loading = ref(false)
const selectedOption = ref("")

// Methods
const setInactiveClassName = <T extends { active: boolean }>(payload: {
  row: T
  rowIndex: number
}) => (!payload.row.active ? "disabled-row" : "")

async function addFilter(payload: ParamFilter) {
  filters.value.params.push(payload)
  await getData()
}

async function removeFilter(index: number) {
  filters.value.params.splice(index, 1)
  await getData()
}

function removeIdParams(path: string) {
  const lastSlashIndex = path.lastIndexOf("/")
  return path.substring(0, lastSlashIndex + 1)
}

async function onSelectedChange() {
  if (props.selectFilterShow) {
    switch (props.selectFilterTitle) {
      case "Agencia:":
        endpointValue.value =
          removeIdParams(endpointValue.value) + `${selectedOption.value}`
        TablesModule.setAgencyId(selectedOption.value)
        break
      case "Planilla:":
         endpointValue.value =
          removeIdParams(endpointValue.value) + `${selectedOption.value}`
        TablesModule.setHistoryId(selectedOption.value)
        break
      case "Bodega:":
        endpointValue.value = endpointValue.value.split('?')[0] + `?type=STORE&store=${selectedOption.value}`
        TablesModule.setHistoryId(selectedOption.value)
        break
      case "Agencia ":
        endpointValue.value = endpointValue.value.split('?')[0] + `?type=AGENCY&agency=${selectedOption.value}`
        TablesModule.setHistoryId(selectedOption.value)
        break
      default:
        break
    }
    await getData()
  }
}

function formatTag(payload: ParamFilter) {
  if (payload.type === "date")
    return `Desde ${DateTime.fromJSDate(
      (payload as ParamFilter<"date">).value[0]
    ).toFormat("dd/MM/yyyy")} hasta ${DateTime.fromJSDate(
      (payload as ParamFilter<"date">).value[1]
    ).toFormat("dd/MM/yyyy")}`
  else if (payload.type === "simple-date")
    return `Consultando día: ${DateTime.fromJSDate(
      payload.value[0] as Date
    ).toFormat("dd/MM/yyyy")}`
  else if (payload.type === "time")
    return `Desde ${DateTime.fromJSDate(
      (payload as ParamFilter<"date">).value[0]
    ).toFormat("HH:mm a")} hasta ${DateTime.fromJSDate(
      (payload as ParamFilter<"date">).value[1]
    ).toFormat("HH:mm a")}`
  else return payload.value
}

function ColumnProp({
  scope,
  column,
}: {
  scope: any
  column: ITableColumns
  index: number
}) {
  if (slots.hasOwnProperty(scope.column.property))
    return h("div", slots[scope.column.property]?.(scope))
  const text = scope.column?.formatter
    ? scope.column?.formatter(scope.row, scope.column)
    : scope.row[scope.column.property]
    ? scope.row[scope.column.property]
    : column.default
    ? column.default
    : "-"
  return column.link
    ? h(
        "a",
        {
          href: "#",
          class: "d-flex w-100 text-decoration-none align-items-center me-2",
          onClick(event: PointerEvent) {
            event.preventDefault()
            router.push(column.link as RouteLocationRaw)
          },
        },
        [
          text,
          h("i", {
            class: "fs-8 fas fa-external-link-alt ms-auto",
          }),
        ]
      )
    : text
}
async function updateData(index: number) {
  console.group("**** update data ****")
  console.log(index)
  console.groupEnd()
}

async function getData() {
  AppModule.setPagination({
    currentPage: pagination.currentPage,
    perPage: pagination.perPage,
  })

  const { reply, success } = await handleRequests(
    ApiGateway.post<{
      data: Record<string, unknown>[]
      totalRegistros: number
    }>(endpointValue.value, {
      user: AuthModule.id,
      pagination,
      pag: 1,
      params: filters.value.params.reduce((acc, curr) => {
        if (!curr.column) return acc
        if (!acc.hasOwnProperty(curr.column)) acc[curr.column] = [curr.value]
        else acc[curr.column].push(curr.value)
        return acc
      }, {} as IndexType<any>),
      seeAll: filters.value.seeAll,
    }),
    { loadingState: loading }
  )
  if (!success) return
  pagination.total = reply.data.totalRegistros
  data.value = props.map ? reply.data.data.map(props.map) : reply.data.data
}
async function updateCurrent(val: number) {
  if (val !== pagination.currentPage)
    (pagination.currentPage = val), await getData()
}

onBeforeMount(() => {
  if (AppModule.pagination) {
    pagination.perPage = AppModule.pagination.perPage
    pagination.currentPage = route.query.p
      ? parseInt(route.query.p as string)
      : AppModule.pagination.currentPage
  }
})

onMounted(() => {
  if (props.defaultFilters?.length)
    props.defaultFilters.forEach(f => filters.value.params.push(f))
  getData()
})
</script>
<template>
  <div>
    <div
      v-if="selectFilterShow"
      class="d-flex align-items-center"
      style="margin-left: 24px"
    >
      <h6 class="mb-0">{{ selectFilterTitle }}</h6>
      <div style="margin-left: 4px">
        <!--div class="el-select el-select--small form-control"-->
        <!--div class="select-trigger el-tooltip__trigger el-tooltip__trigger"-->
        <select
          v-model="selectedOption"
          :onChange="onSelectedChange"
          style="height: 29px; margin-top: 0px; width: auto"
          class="el-input__wrapper"
          filtetable
        >
          <option value="" disabled selected>Seleccione</option>
          <option
            v-for="option in selectFilterOptions"
            :value="option.value"
            :key="option.key"
            class="el-input el-input--suffix"
          >
            {{ option.label }}
          </option>
        </select>
        <!--/div-->
        <!--/div-->
      </div>
    </div>
    <div class="col-12 d-flex align-items-center p-2">
      <div class="col-12 d-flex w-50 align-items-center">
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="!filters.seeAll ? 'Ver todos' : 'Ver activos'"
        >
          <button
            class="btn base-button btn-icon btn-fab btn-white btn-sm mb-0 me-1"
            style="display: flex; justify-content: center; align-items: center"
            @click=";(filters.seeAll = !filters.seeAll), getData()"
          >
            <i v-if="!filters.seeAll" class="fas fa-eye"></i>
            <i v-else class="fas fa-eye-slash"></i>
          </button>
        </el-tooltip>
        <filter-control
          :filter-options="filterOptions"
          :columns="columns"
          @add="addFilter"
        />
      </div>
      <el-scrollbar class="col-12 py-2 px-3 w-50">
        <div class="d-flex align-items-center">
          <el-tag
            v-for="(value, key) in filters.params"
            :key="key"
            class="mx-1"
            closable
            @close="removeFilter(key)"
          >
            {{ value.label }}:
            <span>{{ formatTag(value) }}</span>
          </el-tag>
        </div>
      </el-scrollbar>
    </div>
    <el-table
      :data="data"
      v-loading="loading && !data.length"
      class="table table-flush mb-0"
      :row-class-name="setInactiveClassName"
      row-key="id"
      header-row-class-name="thead-light"
      header-cell-class-name="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
    >
      <el-table-column
        v-for="(column, index) in columns"
        :key="column.label"
        v-bind="column"
        sortable
      >
        <template #default="scope">
          <el-skeleton v-if="loading" :rows="1" animated>
            <template #template>
              <el-skeleton-item variant="text" />
            </template>
          </el-skeleton>
          <div v-else>
            <ColumnProp :scope="scope" :column="column" :index="index" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label=""
        v-if="showOptions"
        min-width="50"
        class-name="p-0"
        label-class-name="p-0"
        fixed="right"
      >
        <template v-if="loading" #default>
          <el-skeleton :rows="1" animated>
            <template #template>
              <el-skeleton-item variant="text" />
            </template>
          </el-skeleton>
        </template>
        <template v-else #default="scope" v-if="!hideRowOptions">
          <el-popover
            placement="left"
            trigger="click"
            popper-style="padding: 0; width:155px; min-width:155px;"
          >
            <template #reference>
              <button class="btn btn-white btn-sm my-1">
                <i class="fas fa-ellipsis-v"></i>
              </button>
            </template>
            <div v-for="option in props.options ?? []" :key="option.name">
              <button
                class="bg-white p-2 text-left fs-7 border-0 w-100 text-start dropdown-control-menu__item"
                @click="option.function(scope.row)"
              >
                <!--"emits('event', { event: option.name, payload: scope.row })"-->
                <i :class="option.icon" />
                {{ option.name }}
              </button>
            </div>
            <div v-if="!hideDefaultOptions">
              <button
                class="bg-white p-2 text-left fs-7 border-0 w-100 text-start dropdown-control-menu__item"
                @click="emits('edit', scope.row)"
              >
                <i class="fas fa-edit mx-1"></i>
                Editar
              </button>
            </div>
            <div v-if="!hideDefaultOptions">
              <button
                class="bg-white p-2 text-left fs-7 border-0 w-100 text-start dropdown-control-menu__item"
                @click="emits('delete', scope.row)"
              >
                <i class="fas fa-trash-alt mx-1"></i>
                Deshabilitar
              </button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <table-pagination
      v-bind="pagination"
      @update:current-page="updateCurrent"
      @update:per-page="(val:any) => ((pagination.perPage = val), getData())"
    />
  </div>
</template>
<style>
.dropdown-control-menu__item:hover {
  background-color: rgba(0, 0, 0, 0.1) !important;
}
.container {
  display: flex;
}

.container > div {
  flex: 1;
}
</style>
