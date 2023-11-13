<script setup lang="ts">
import { ref, toRefs, reactive, h, onBeforeMount, watch } from "vue"
import { Modals, Field, ModalState } from "@/types/components"
import BaseTable from "@/components/tables/Base.vue"
import DinamicOptions from "@/components/DinamicOptions.vue"
import { getStatusColor, getStatusText } from "./InventoryUtil"

import { AuthModule } from "@/store/modules/Auth"
import moment from "moment"

import { GuardGroupsRoles, GuardRoles } from "@/types/router"
import { PayrollsModule } from "@/store/modules/Payroll"

// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void
}>()
const options = ref<{ key: string; value: string; label: string }[]>([])

const state = reactive<any>({
  formPayrollDiscountModal: {
    show: false,
  },
  formPayrollGratificationModal: {
    show: false,
  },
  table: {
    relaod: false,
  },
})

const props = defineProps<{}>()

// funcitons
function changeModal(payload: ModalState, modal: Modals) {
  state[modal].show = payload.show
}

const customOpstions = {
  icon: "fas fa-cog mx-1",
  options: [
    /*{
      name: "Cargar Inventario",
      icon: "fas fa-plus mx-1",
      handler: (values: any) => {
        emits("changeModal", {
          modal: "formInventoryModal",
          payload: { show: true, isEdit: false, payload: values },
        })
      },
    },*/
    {
      name: "Asignacion a agencia",
      icon: "fas fa-plus mx-1",
      handler: (values: any) => {
        emits("changeModal", {
          modal: "formUpdateInventoryModal",
          payload: { show: true, isEdit: false, payload: values },
        })
      },
    },
  ],
}

onBeforeMount(async () => {  
  const stores: any = await PayrollsModule.getStoreData()  
  options.value = stores.data
})
const rowOptions = [
  {
    name: "Asignar ",
    icon: "fas fa-edit mx-1",
    function: (values: any) => {
      emits("changeModal", {
        modal: "formUpdateInventoryModal",
        payload: { show: true, isEdit: true, payload: values },
      })
    },
  },
  {
    name: "Remover usuario",
    icon: "fas fa-edit mx-1",
    function: (values: any) => {
      emits("changeModal", {
        modal: "formRemoveUserModal",
        payload: { show: true, isEdit: true, payload: values },
      })
    },
  },
]

const role: any = AuthModule.user?.role
const route: string = "/inventory/table?type=STORE"
const rowVariable: any = [GuardRoles.ADMIN, GuardRoles.SUPERVISOR].includes(
  role.name
)
</script>
<template>
  <div class="py-4 container-fluid">
    <div class="mt-4 row">
      <div class="col-12">
        <div class="card">
          <!-- Card header -->
          <div
            class="card-header d-flex align-items-center justify-content-between w-100"
          >
            <div>
              <h5 class="mb-0">Inventario</h5>
              <p class="mb-0 text-sm">
                A continuación se listan los inventarios.
              </p>
            </div>
            <div>
              <div>
                <dinamic-options
                  v-if="AuthModule.user?.role.name === GuardRoles.ADMIN"
                  :customOpstions="customOpstions"
                />
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <BaseTable
              :reload="state.table.reload"
              :hide-default-options="true"
              :hide-row-options="!rowVariable"
              :options="rowOptions"
              :select-filter-show="true"
              :select-filter-options="options"
              select-filter-title="Bodega:"
              :columns="[
                {
                  label: 'Item:',
                  prop: 'item_name',
                  minWidth: 250,
                  headerAlign: 'left',
                },
                {
                  label: 'Agencia:',
                  prop: 'agency_name',
                  minWidth: 120,
                  headerAlign: 'left',
                },
                {
                  label: 'Compra',
                  prop: 'date',
                  minWidth: 120,
                  headerAlign: 'left',
                },
                {
                  label: 'Asignación',
                  prop: 'assign_date',
                  minWidth: 120,
                  headerAlign: 'left',
                },
                {
                  label: 'Vencimiento',
                  prop: 'expiration_date',
                  minWidth: 130,
                  headerAlign: 'left',
                },
                {
                  label: 'Estado',
                  prop: 'status',
                  minWidth: 120,
                  headerAlign: 'center',
                },
                {
                  label: 'Usuario :',
                  prop: 'user_detail',
                  minWidth: 200,
                  headerAlign: 'right',
                },
                {
                  label: 'Bodega :',
                  prop: 'store_name',
                  minWidth: 200,
                  headerAlign: 'right',
                },
              ]"
              :endpoint="route"
            >
              <template #item_name="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  {{ scope.row.item_name }}
                </div>
              </template>
              <template #agency_name="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag
                    :type="
                      !scope.row.agency_name ? 'info' : scope.row.agency_name
                    "
                    >{{
                      !scope.row.agency_name
                        ? "Sin Asignar"
                        : scope.row.agency_name
                    }}</el-tag
                  >
                </div>
              </template>

              <template #store_name="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag
                    :type="
                      !scope.row.store_name ? 'info' : scope.row.store_name
                    "
                  >
                    {{ scope.row.store_name }}</el-tag
                  >
                </div>
              </template>

              <template #status="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag :type="getStatusColor(scope.row)">
                    {{ getStatusText(scope.row) }}
                  </el-tag>
                </div>
              </template>
              <template #user_detail="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag
                    :type="
                      !scope.row.user_detail ? 'info' : scope.row.user_detail
                    "
                    >{{
                      !scope.row.user_detail
                        ? "Sin Asignar"
                        : scope.row.user_detail
                    }}</el-tag
                  >
                </div>
              </template>
              <template #assign_date="scope">
                <div
                  style="
                    text-align: center;
                    padding-right: 24px;
                    white-space: nowrap;
                  "
                >
                  {{
                    scope.row.assign_date
                      ? new Date(scope.row.assign_date).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : "N/A"
                  }}
                </div>
              </template>

              <template #expiration_date="scope">
                <div
                  style="
                    text-align: center;
                    padding-right: 24px;
                    white-space: nowrap;
                  "
                >
                  {{
                    !!scope.row.expiration_date
                      ? new Date(scope.row.expiration_date).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : "N/A"
                  }}
                </div>
              </template>
              <template #date="scope">
                <div
                  style="
                    text-align: center;
                    padding-right: 24px;
                    white-space: nowrap;
                  "
                >
                  {{ moment(scope.row.date).format("DD-MM-yyyy") }}
                </div>
              </template>
            </BaseTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
