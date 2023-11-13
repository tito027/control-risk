<script setup lang="ts">
import { ref, toRefs, reactive } from "vue"
import { Modals, Field, ModalState } from "@/types/components"
import BaseTable from "@/components/tables/Base.vue"
import DinamicOptions from "@/components/DinamicOptions.vue"

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

const modalUser = ref<string>("")
const modalTitle = ref<string>("")
const modalPayrollConfig = ref<string>("")

const customOpstions = {
  icon: "fas fa-cog mx-1",
  options: [
    {
      name: "Nuevo reporte",
      icon: "fas fa-plus mx-1",
      handler: () =>
        emits("changeModal", {
          modal: "formNewsModal",
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
        modal: "formNewsModal",
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
              <h5 class="mb-0">Reportes</h5>
              <p class="mb-0 text-sm">
                A continuación se listan todas los reportes.
              </p>
            </div>
            <div>
              <div>
                <dinamic-options
                  v-if="
                    AuthModule.user?.role.name === GuardRoles.SECURITY_AGENT ||
                    AuthModule.user?.role.name ===
                      GuardRoles.PREVENTION_AGENT ||
                    AuthModule.user?.role.name === GuardRoles.SUPERVISOR ||
                    AuthModule.user?.role.name === GuardRoles.ADMIN
                  "
                  :customOpstions="customOpstions"
                />
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
                  label: 'Creado por :',
                  prop: 'fullName',
                  minWidth: 150,
                  headerAlign: 'left',
                },
                {
                  label: 'Documento :',
                  prop: 'document_id',
                  minWidth: 120,
                  headerAlign: 'left',
                },
                {
                  label: 'Fecha :',
                  prop: 'date',
                  minWidth: 120,
                  headerAlign: 'right',
                },
                {
                  label: 'Tipo :',
                  prop: 'type',
                  minWidth: 120,
                  headerAlign: 'right',
                },
                {
                  label: 'Detalle :',
                  prop: 'details',
                  minWidth: 120,
                  headerAlign: 'right',
                },
              ]"
              endpoint="/reports/table?type=News"
            >
              <template #fullName="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  {{ scope.row.fullName }}
                </div>
              </template>
              <template #details="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  {{ scope.row.details }}
                </div>
              </template>
              <template #type="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  {{ scope.row.type }}
                </div>
              </template>
              <template #document_id="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  {{ scope.row.document_id }}
                </div>
              </template>
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
            </BaseTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
