<script setup lang="ts">
import { ref, toRefs, reactive, h } from "vue"
import { Modals, Field, ModalState } from "@/types/components"
import BaseTable from "@/components/tables/Base.vue"
import DinamicOptions from "@/components/DinamicOptions.vue"
import { getStatusColor, getStatusText } from "./InventoryUtil"

import { AuthModule } from "@/store/modules/Auth"
import moment from "moment"

import { GuardRoles } from "@/types/router"

// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void
}>()

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

// const customOpstions = {
//   icon: "fas fa-cog mx-1",
//   options: [
//     {
//       name: "Cargar Inventario",
//       icon: "fas fa-plus mx-1",
//       handler: (values: any) => {
//         emits("changeModal", {
//           modal: "formInventoryModal",
//           payload: { show: true, isEdit: false, payload: values },
//         })
//       },
//     },
//     {
//       name: "Asignacion a agencia",
//       icon: "fas fa-plus mx-1",
//       handler: (values: any) => {
//         emits("changeModal", {
//           modal: "formUpdateInventoryModal",
//           payload: { show: true, isEdit: false, payload: values },
//         })
//       },
//     },
//   ],
// }
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
const route: string = "/inventory/table?type=PERSONAL&id=" + AuthModule.id
const rowVariable: any = [
  GuardRoles.RRHH,
  GuardRoles.ADMIN,
  GuardRoles.SUPERVISOR,
  GuardRoles.SECURITY_AGENT,
].includes(role.name)
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
              
            </div>
          </div>
          <div class="table-responsive">
            <BaseTable
              :reload="state.table.reload"
              :hide-default-options="true"
              :hide-row-options="!rowVariable"
              :options="rowOptions"
              :columns="[
                {
                  label: 'Item:',
                  prop: 'item_name',
                  minWidth: 250,
                  headerAlign: 'left',
                },
                {
                  label: 'Marca:',
                  prop: 'brand',
                  minWidth: 120,
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
                {
                  label: 'Calibre :',
                  prop: 'caliber',
                  minWidth: 200,
                  headerAlign: 'right',
                },
                {
                  label: 'Clasificacion :',
                  prop: 'clasification',
                  minWidth: 200,
                  headerAlign: 'right',
                },
                {
                  label: 'Serie :',
                  prop: 'code',
                  minWidth: 200,
                  headerAlign: 'right',
                },
                {
                  label: 'Inventario actual :',
                  prop: 'actual_inventory',
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
                  <el-tag
                    :type="!scope.row.item_name ? 'info' : scope.row.item_name"
                  >
                    {{ scope.row.item_name || "N/A" }}</el-tag
                  >
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
              <template #caliber="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag
                    :type="!scope.row.caliber ? 'info' : scope.row.caliber"
                    >{{
                      !scope.row.caliber ? "N/A" : scope.row.caliber
                    }}</el-tag
                  >
                </div>
              </template>
              <template #clasification="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag
                    :type="
                      !scope.row.clasification
                        ? 'info'
                        : scope.row.clasification
                    "
                    >{{
                      !scope.row.clasification ? "N/A" : scope.row.clasification
                    }}</el-tag
                  >
                </div>
              </template>
              <template #actual_inventory="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag
                    :type="
                      !scope.row.actual_inventory
                        ? 'info'
                        : scope.row.actual_inventory
                    "
                    >{{
                      !scope.row.actual_inventory
                        ? "N/A"
                        : scope.row.actual_inventory
                    }}</el-tag
                  >
                </div>
              </template>

              <template #code="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag :type="!scope.row.code ? 'info' : scope.row.code">{{
                    !scope.row.code ? "N/A" : scope.row.code
                  }}</el-tag>
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
                    {{ scope.row.store_name || "N/A" }}</el-tag
                  >
                </div>
              </template>
              <template #brand="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag :type="!scope.row.brand ? 'info' : scope.row.brand">
                    {{ scope.row.brand || "N/A" }}</el-tag
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
