<script setup lang="ts">
import BaseTable from "@/components/tables/Base.vue"
import { Modals, Field, ModalState } from "@/types/components"
import DinamicOptions from "@/components/DinamicOptions.vue"
import { GuardGroupsRoles, GuardRoles } from "@/types/router"
// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void
}>()

const customOpstions = {
  icon: "fas fa-cog mx-1",
  options: [
    {
      name: "Nuevo gratificante",
      icon: "fas fa-plus mx-1",
      handler: () =>
        emits("changeModal", {
          modal: "formCreateGratificationTypeModal",
          payload: { show: true },
        }),
      guard: [GuardRoles.ADMIN, , ...GuardGroupsRoles.RRHH_GROUP],
    },
    {
      name: "Asignar a agente",
      icon: "fas fa-user-plus mx-1",
      handler: () =>
        emits("changeModal", {
          modal: "formAssignGratificationModal",
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
          modal: "formCreateMasiveGratificationModal",
          payload: { show: true },
        }),
      guard: [
        GuardRoles.ASSISTANT_RRHH,
        GuardRoles.MANAGER_RRHH,
        GuardRoles.ADMIN,
      ],
    },
    // {
    //   name: "Asignación de prueba",
    //   icon: "fas fa-user-plus mx-1",
    //   handler: () =>
    //     emits("changeModal", {
    //       modal: "formCreateUnknownModal",
    //       payload: { show: true },
    //     }),
    // },
    {
      name: "Programar recurrente",
      icon: "fas fa-users-cog mx-1",
      handler: () =>
        emits("changeModal", {
          modal: "formCreateScheduledGratificationModal",
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
        modal: "formCreateGratificationTypeModal",
        payload: { show: true, isEdit: true, payload: values },
      })
    },
    guard: [...GuardGroupsRoles.RRHH_GROUP, GuardRoles.ADMIN],
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
              <h5 class="mb-0">Gratificantes</h5>
              <p class="mb-0 text-sm">
                A continuación se listan todos los gratificantes que se pueden
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
                  minWidth: 40,
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
                  minWidth: 150,
                },
              ]"
              endpoint="/payrolls/gratifications/types/table"
            >
              <template #description="scope">
                <div
                  style="
                    text-align: left;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ scope.row.description }}
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
              <template #is_scheduled="scope"
                ><div
                  style="
                    text-align: left;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                ></div>
                <el-tag
                  :type="scope.row.is_scheduled === true ? 'success' : 'danger'"
                >
                  {{ scope.row.is_scheduled === true ? "Si" : "No" }}
                </el-tag>
              </template>
            </base-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
