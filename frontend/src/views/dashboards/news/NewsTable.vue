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

const customOpstions = {
  icon: "fas fa-cog mx-1",
  options: [
    {
      name: "Nueva novedad",
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
  {
    name: "Atendido/Resuelto",
    icon: "fa fa-check-square-o mx-1",
    function: (values: any) =>
      emits("changeModal", {
        modal: "formCheckedNewsModal",
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
              <h5 class="mb-0">Novedades</h5>
              <p class="mb-0 text-sm">Libro de novedades o consignas.</p>
            </div>
            <div>
              <div>
                <dinamic-options
                  v-if="
                    AuthModule.user?.role.name === GuardRoles.ADMIN ||
                    AuthModule.user?.role.name === GuardRoles.SECURITY_AGENT ||
                    AuthModule.user?.role.name === GuardRoles.SUPERVISOR ||
                    AuthModule.user?.role.name === GuardRoles.PREVENTION_AGENT
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
                  label: 'Creado por:',
                  prop: 'full_name',
                  minWidth: 250,
                  headerAlign: 'left',
                },
                {
                  label: 'Empresa',
                  prop: 'business_name',
                  minWidth: 150,
                },
                {
                  label: 'Posicion:',
                  prop: 'agency_name',
                  minWidth: 110,
                  headerAlign: 'left',
                },
                {
                  label: 'Fecha',
                  prop: 'date',
                  minWidth: 100,
                  headerAlign: 'right',
                },
                {
                  label: 'Horario',
                  prop: 'schedule',
                  minWidth: 110,
                  headerAlign: 'right',
                },
                {
                  label: 'Asunto :',
                  prop: 'news_type_name',
                  minWidth: 350,
                  headerAlign: 'right',
                },
                {
                  label: 'Descripcion :',
                  prop: 'description',
                  minWidth: 1000,
                  headerAlign: 'right',
                },
                {
                  label: 'Estado',
                  prop: 'is_new',
                  minWidth: 80,
                  headerAlign: 'right',
                },
              ]"
              endpoint="/news/table"
            >
              <template #full_name="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  {{ scope.row.full_name }}
                </div> </template
              ><template #description="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  {{ scope.row.description }}
                </div>
              </template>
              <template #news_type_name="scope">
                <div class="text-right" style="white-space: nowrap">
                  <i
                    :class="
                      scope.row.importance_level < 4
                        ? 'fas fa-exclamation-circle text-success hovered h7 mb-0'
                        : scope.row.importance_level > 7
                        ? 'fas fa-exclamation-circle text-danger hovered h7 mb-0'
                        : 'fas fa-exclamation-circle text-warning hovered h7 mb-0'
                    "
                  ></i>
                  {{ scope.row.news_type_name }}
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
              <template #is_new="scope">
                <el-tag :type="scope.row.is_new === true ? 'info' : 'success'">
                  {{ scope.row.is_new === true ? "Pendiente" : "Ya visto" }}
                </el-tag>
              </template>
            </BaseTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
