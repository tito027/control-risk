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

const STATUS = {
  INITIAL_STATUS: ["Pendiente de revisión"],
  REVISION_STATUS: ["En revisión", "En investigación", "En resolución"],
  FINALIZED_STATUS: ["Cerrado"],
}
// funcitons
function changeModal(payload: ModalState, modal: Modals) {
  state[modal].show = payload.show
}

const customOpstions = {
  icon: "fas fa-cog mx-1",
  options: [
    {
      name: "Nueva sugerencia / denuncia",
      icon: "fas fa-plus mx-1",
      handler: () =>
        emits("changeModal", {
          modal: "formComplaintModal",
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
        modal: "formComplaintModal",
        payload: { show: true, isEdit: true, payload: values },
      })
    },
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
              <h5 class="mb-0">Buzon</h5>
              <p class="mb-0 text-sm">
                A continuación se listan todas las denuncias y sugerencias.
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
                  label: 'Creado por:',
                  prop: 'user_detail',
                  minWidth: 130,
                  headerAlign: 'left',
                },
                {
                  label: 'Posicion:',
                  prop: 'agency_name',
                  minWidth: 150,
                  headerAlign: 'left',
                },
                {
                  label: 'Fecha',
                  prop: 'date',
                  minWidth: 110,
                  headerAlign: 'right',
                },
                {
                  label: 'Tipo:',
                  prop: 'type',
                  minWidth: 120,
                  headerAlign: 'right',
                },
                {
                  label: 'Asunto:',
                  prop: 'complaint_type',
                  minWidth: 120,
                  headerAlign: 'right',
                },
                {
                  label: 'Dirigido hacia:',
                  prop: 'to_user_detail',
                  minWidth: 200,
                  headerAlign: 'right',
                },
                {
                  label: 'Estado',
                  prop: 'status_detail',
                  minWidth: 190,
                  headerAlign: 'right',
                },
              ]"
              endpoint="/complaints/table"
            >
              <template #date="scope">
                <div
                  style="
                    text-align: right;
                    padding-right: 24px;
                    white-space: nowrap;
                  "
                >
                  {{ moment(scope.row.date).format("DD-MM-yyyy") }}
                </div>
              </template>
              <template #status_detail="scope">
                <el-tag
                  :type="
                    STATUS.INITIAL_STATUS.includes(scope.row.status_detail)
                      ? 'danger'
                      : STATUS.REVISION_STATUS.includes(scope.row.status_detail)
                      ? 'success'
                      : STATUS.FINALIZED_STATUS.includes(
                          scope.row.status_detail
                        )
                      ? 'info'
                      : 'info'
                  "
                >
                  {{ scope.row.status_detail ?? "N/A" }}
                </el-tag>
              </template>
            </BaseTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
