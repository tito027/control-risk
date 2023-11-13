<script setup lang="ts">
import BaseTable from "@/components/tables/Base.vue"
import { Modals, Field, ModalState } from "@/types/components"
import DinamicOptions from "@/components/DinamicOptions.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { TablesModule } from "@/store/table/Table"
import { GuardGroupsRoles, GuardRoles } from "@/types/router"

// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void
}>()

const customOpstions = {
  icon: "fas fa-cog mx-1",
  options: [
    {
      name: "Nuevo descuento",
      icon: "fas fa-plus mx-1",
      handler: () =>
        emits("changeModal", {
          modal: "formCreateDiscountTypeModal",
          payload: { show: true },
        }),
      guard: [GuardRoles.ADMIN, ...GuardGroupsRoles.RRHH_GROUP],
    },
    {
      name: "Asignar a agente",
      icon: "fas fa-user-plus mx-1",
      handler: () =>
        emits("changeModal", {
          modal: "formAssignDiscountModal",
          payload: { show: true },
        }),
      guard: [
        GuardRoles.ASSISTANT_RRHH,
        GuardRoles.MANAGER_RRHH,
        GuardRoles.ADMIN,
      ],
    },
    {
      name: "Asignación masiva",
      icon: "fas fa-user-plus mx-1",
      handler: () =>
        emits("changeModal", {
          modal: "formCreateMasiveDiscountModal",
          payload: { show: true },
        }),
      guard: [
        GuardRoles.ASSISTANT_RRHH,
        GuardRoles.MANAGER_RRHH,
        GuardRoles.ADMIN,
      ],
    },
    {
      name: "Programar recurrente",
      icon: "fas fa-users-cog mx-1",
      handler: () =>
        emits("changeModal", {
          modal: "formCreateScheduledDiscountModal",
          payload: { show: true },
        }),
      guard: [
        GuardRoles.ASSISTANT_RRHH,
        GuardRoles.MANAGER_RRHH,
        GuardRoles.ADMIN,
      ],
    },
  ],
}

const rowOptions = [
  {
    name: "Editar",
    icon: "fas fa-edit mx-1",
    function: (values: any) => {
      emits("changeModal", {
        modal: "formCreateDiscountTypeModal",
        payload: { show: true, isEdit: true, payload: values },
      })
    },
    guard: [...GuardGroupsRoles.RRHH_GROUP],
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
              <h5 class="mb-0">Descuentos</h5>
              <p class="mb-0 text-sm">
                A continuación se listan todos los descuentos que se pueden
                aplicar a agentes.
              </p>
            </div>
            <div>
              <dinamic-options :customOpstions="customOpstions" />
            </div>
          </div>
          <div class="table-responsive">
            <base-table
              :options="rowOptions"
              :hideDefaultOptions="true"
              :columns="[
                {
                  label: 'Cod.',
                  prop: 'code',
                  minWidth: 60,
                },
                {
                  label: 'Nombre',
                  prop: 'description',
                  minWidth: 180,
                },
                {
                  label: 'Activo',
                  prop: 'active',
                  minWidth: 100,
                },
                {
                  label: 'Programable',
                  prop: 'is_scheduled',
                  minWidth: 100,
                },
              ]"
              endpoint="/payrolls/discounts/types/table"
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
              <template #code="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ scope.row.code }}
                </div>
              </template>
              <template #is_scheduled="scope"
                ><div
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
              <template #description="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ scope.row.description }}
                </div>
              </template>
            </base-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
