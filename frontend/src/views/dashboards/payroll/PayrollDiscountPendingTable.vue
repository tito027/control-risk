<script setup lang="ts">
import BaseTable from "@/components/tables/Base.vue"
import { Modals, Field, ModalState } from "@/types/components"
import DinamicOptions from "@/components/DinamicOptions.vue"
import { GuardRoles } from "@/types/router"

// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void
}>()

const customOpstions = {
  icon: "fas fa-cog mx-1",
  options: [
    {
      name: "Asignar a agente",
      icon: "fas fa-user-plus mx-1",
      handler: () =>
        emits("changeModal", {
          modal: "formAssignDiscountModal",
          payload: { show: true },
        }),
    },
    {
      name: "Programar recurrente",
      icon: "fas fa-users-cog mx-1",
      handler: () =>
        emits("changeModal", {
          modal: "formCreateScheduledDiscountModal",
          payload: { show: true },
        }),
    },
  ],
}
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
              <h5 class="mb-0">Descuentos</h5>
              <p class="mb-0 text-sm">
                A continuación se listan todos los descuentos que se pueden
                aplicar a agentes, quedan sujetos a revisión.
              </p>
            </div>
            <div>
              <dinamic-options :customOpstions="customOpstions" />
            </div>
          </div>
          <div class="table-responsive">
            <base-table
              :hideDefaultOptions="true"
              :hideRowOptions="true"
              :columns="[
                {
                  label: 'Descuento',
                  prop: 'discount_type',
                  minWidth: 180,
                },
                {
                  label: 'Agente',
                  prop: 'user_from_full_name',
                  minWidth: 100,
                },
                {
                  label: 'Supervisor',
                  prop: 'by_user_full_name',
                  minWidth: 100,
                },
                {
                  label: 'Valor',
                  prop: 'value',
                  minWidth: 100,
                },
                {
                  label: 'Programable',
                  prop: 'is_scheduled',
                  minWidth: 100,
                },
                {
                  label: 'Estado',
                  prop: 'is_pending',
                  minWidth: 100,
                },
              ]"
              endpoint="/payrolls/discounts/pending/table"
            >
              <template #is_pending="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  <el-tag
                    :type="scope.row.is_pending === true ? 'success' : 'danger'"
                  >
                    {{ scope.row.is_pending === true ? "Si" : "No" }}
                  </el-tag>
                </div>
              </template>
              <template #user_from_full_name="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ scope.row.user_from_full_name }}
                </div>
              </template>
              <template #by_user_full_name="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ scope.row.by_user_full_name }}
                </div>
              </template>
              <template #is_scheduled="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  <el-tag
                    :type="
                      scope.row.is_scheduled === true ? 'success' : 'danger'
                    "
                  >
                    {{ scope.row.is_scheduled === true ? "Si" : "No" }}
                  </el-tag>
                </div>
              </template>
              <template #value="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{
                    scope.row.value.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  }}
                </div>
              </template>
            </base-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
