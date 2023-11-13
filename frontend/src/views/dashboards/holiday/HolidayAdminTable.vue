<script setup lang="ts">
import { ref, toRefs, reactive } from "vue"
import { Modals, Field, ModalState } from "@/types/components"
import ArgonButton from "@/components/ArgonButton.vue"
import BaseTable from "@/components/tables/Base.vue"
import PayrollModal from "@/components/modals/PayrollModal.vue"
import PayrollDropdown from "@/components/PayrollDropdown.vue"
import DinamicOptions from "@/components/DinamicOptions.vue"
import { PayrollsModule } from "@/store/modules/Payroll"
import { ElMessage } from "element-plus"

import { AuthModule } from "@/store/modules/Auth"
import moment from "moment"
import { getTagType } from "./HolidayUtils"
import { HolidayModule } from "@/store/modules/Holiday"

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
async function exportMonth() {
  // Crear un objeto Blob con el contenido de las tareas
  const { success, result }: any = await HolidayModule.getExportTableData()
  console.log({ success, result })
  /*if (success && result.data && result.data.agents.length > 0) {
  }*/
}

const customOpstions = {
  icon: "fas fa-cog mx-1",
  options: [
    {
      name: "Nueva solicitud",
      icon: "fas fa-plus mx-1",
      handler: () =>
        emits("changeModal", {
          modal: "formHolidayModal",
          payload: { show: true },
        }),
    },
  ],
}
const rowOptions = [
  {
    name: "Editar",
    icon: "fas fa-edit mx-1",
    function: (values: any) => {
      emits("changeModal", {
        modal: "formHolidayModal",
        payload: { show: true, isEdit: true, payload: values },
      })
    },
  },
  {
    name: "Rechazar ",
    icon: "fa fa-close mx-1",
    function: (values: any) =>
      emits("changeModal", {
        modal: "formCloseHolidayModal",
        payload: { show: true, isEdit: true, payload: values },
      }),
  },

  {
    name: "Aprobar ",
    icon: " fas fa-handshake mx-1",
    function: (values: any) =>
      emits("changeModal", {
        modal: "formApproveHolidayModal",
        payload: { show: true, isEdit: true, payload: values },
      }),
  },
]
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
              <h5 class="mb-0">Vacaciones</h5>
              <p class="mb-0 text-sm">
                A continuación se listan todas las solicitudes de vacaciones.
              </p>
            </div>
            <div>
              <div>
                <dinamic-options :customOpstions="customOpstions" />
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <BaseTable
              :reload="state.table.reload"
              :hide-default-options="true"
              :options="rowOptions"
              :columns="[
                {
                  label: 'Nombre',
                  prop: 'user_detail',
                  minWidth: 170,
                  headerAlign: 'left',
                },
                {
                  label: 'Desde',
                  prop: 'init_date',
                  minWidth: 90,
                  headerAlign: 'left',
                },
                {
                  label: 'Hasta',
                  prop: 'end_date',
                  minWidth: 90,
                  headerAlign: 'right',
                },
                {
                  label: 'Nombre de Agencia',
                  prop: 'agency_name',
                  minWidth: 100,
                  headerAlign: 'right',
                },
                {
                  label: 'Estado',
                  prop: 'is_rejected',
                  minWidth: 110,
                  headerAlign: 'right',
                },
                {
                  label: 'Modificado por:',
                  prop: 'change_by',
                  minWidth: 150,
                  headerAlign: 'right',
                },
              ]"
              endpoint="/holidays/table"
            >
              <template #change_by="scope">
                <el-tag :type="scope.row.change_by ? 'info' : 'danger'">
                  {{
                    scope.row.change_by
                      ? scope.row.change_by
                      : "Sin modificaciones"
                  }}
                </el-tag>
              </template>
              <template #init_date="scope">
                <div
                  style="
                    text-align: right;
                    padding-right: 24px;
                    white-space: nowrap;
                  "
                >
                  {{ moment(scope.row.init_date).format("DD-MM-yyyy") }}
                </div>
              </template>
              <template #end_date="scope">
                <div
                  style="
                    text-align: right;
                    padding-right: 24px;
                    white-space: nowrap;
                  "
                >
                  {{ moment(scope.row.end_date).format("DD-MM-yyyy") }}
                </div>
              </template>
              <template #is_rejected="scope">
                <el-tag :type="getTagType(scope.row)">
                  {{
                    scope.row.is_pending && !scope.row.is_rejected
                      ? "Pendiente"
                      : scope.row.is_rejected
                      ? "Rechazado"
                      : "Aprobado"
                  }}
                </el-tag>
              </template>
            </BaseTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
