<script setup lang="ts">
import BaseTable from "@/components/tables/Base.vue"
import { Modals, Field, ModalState } from "@/types/components"
import ArgonButton from "@/components/ArgonButton.vue"
import moment from "moment"

// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void
}>()
// row options
const rowOptions = [
  {
    name: "Editar",
    icon: "fas fa-edit mx-1",
    function: (values: any) => {
      emits("changeModal", {
        modal: "formCreateScheduledGratificationModal",
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
              <h5 class="mb-0">Gratificantes programados</h5>
              <p class="mb-0 text-sm">
                A continuación se listan todos los gratificantes programados
                aplicados a agentes.
              </p>
            </div>
            <div>
              <argon-button
                size="sm"
                @click="
                  () =>
                    emits('changeModal', {
                      modal: 'formCreateScheduledGratificationModal',
                      payload: { show: true },
                    })
                "
                >Programar gratificante
              </argon-button>
            </div>
          </div>
          <div class="table-responsive">
            <base-table
              :options="rowOptions"
              :hide-default-options="true"
              :columns="[
                {
                  label: 'Agente',
                  prop: 'user_detail',
                  minWidth: 180,
                },
                {
                  label: 'Code - gratificante',
                  prop: 'gratification_type_detail',
                  minWidth: 180,
                },
                {
                  label: 'Valor',
                  prop: 'scheduled_value',
                  minWidth: 90,
                },
                {
                  label: 'Activo',
                  prop: 'active',
                  minWidth: 90,
                },
                {
                  label: 'Primera quincena',
                  prop: 'first_fortnight',
                  minWidth: 100,
                },
                {
                  label: 'Segunda quincena',
                  prop: 'second_fortnight',
                  minWidth: 100,
                },
                {
                  label: 'Fecha inicio',
                  prop: 'init_date',
                  minWidth: 150,
                  type: 'date',
                },
                {
                  label: 'Fecha fin',
                  prop: 'end_date',
                  minWidth: 150,
                  type: 'date',
                },
                {
                  label: 'Fecha creación',
                  prop: 'createdAt',
                  minWidth: 150,
                  type: 'date',
                },
                {
                  label: 'Por usuario',
                  prop: 'by_user_detail',
                  minWidth: 180,
                },
              ]"
              endpoint="/payrolls/gratifications/scheduled/table"
            >
              <template #active="scope"
                ><div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  <el-tag
                    :type="scope.row.active === true ? 'success' : 'danger'"
                  >
                    {{ scope.row.active === true ? "Activo" : "Inactivo" }}
                  </el-tag>
                </div>
              </template>
              <template #first_fortnight="scope"
                ><div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  <el-tag
                    :type="
                      scope.row.first_fortnight === true ? 'success' : 'danger'
                    "
                  >
                    {{ scope.row.first_fortnight === true ? "Si" : "No" }}
                  </el-tag>
                </div>
              </template>
              <template #second_fortnight="scope"
                ><div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  <el-tag
                    :type="
                      scope.row.second_fortnight === true ? 'success' : 'danger'
                    "
                  >
                    {{ scope.row.second_fortnight === true ? "Si" : "No" }}
                  </el-tag>
                </div>
              </template>
              <template #init_date="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ moment(scope.row.init_date).format("DD-MM-yyyy") }}
                </div>
              </template>
              <template #end_date="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ moment(scope.row.end_date).format("DD-MM-yyyy") }}
                </div>
              </template>
              <template #createdAt="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ scope.row.createdAt }}
                </div>
              </template>
              <template #by_user_detail="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ scope.row.by_user_detail }}
                </div>
              </template>

              <template #user_detail="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ scope.row.user_detail }}
                </div>
              </template>
            </base-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
