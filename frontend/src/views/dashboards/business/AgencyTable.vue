<script setup lang="ts">
import BaseTable from "@/components/tables/Base.vue"
import ArgonButton from "@/components/ArgonButton.vue"
import { Modals, ModalState } from "@/types/components"
import { FormModule, ModalType } from "@/store/modules/FormModule"
import { ConfirmModalModule } from "@/store/modules/ConfirmModal"

// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void
}>()

function create() {
  FormModule.setType(ModalType.create);
  FormModule.setEndpoint('');
  FormModule.setId('');
  FormModule.setData({});
  emits('changeModal', {
    modal: 'formAgencyModal',
    payload: {
      show: true,
    },
  })
}

function edit(payload: any) {
  FormModule.setId(payload._id);
  FormModule.setType(ModalType.edit);
  FormModule.setEndpoint('/agencies/find');
  FormModule.setData({});
  emits('changeModal', {
    modal: 'formAgencyModal',
    payload: {
      show: true,
    },
  })
}

function drop(payload: any) {
  ConfirmModalModule.setTitle(`Deshabilitar agencia`)
  ConfirmModalModule.setText(`¿Desea deshabilitar la agencia ${payload.name}?`)
  ConfirmModalModule.setButtonColor("danger")
  ConfirmModalModule.setIcon({ color: "#FF6978", size: 17 })
  ConfirmModalModule.setButtonText("Deshabilitar")
  ConfirmModalModule.setEndpoint(`/agencies/delete/${payload._id}`)
  emits("changeModal", {
    modal: "confirmModal",
    payload: {
      show: true,
    },
  })
}

function openConfigModal(payload: any) {
  FormModule.setId(payload._id)
  FormModule.setData({ name: payload.name })
  emits("changeModal", {
    modal: "formAgencyConfigModal",
    payload: {
      show: true,
    },
  })
}

function createPhysicalPosition(payload: any) {
  FormModule.setType(ModalType.create);
  FormModule.setEndpoint('');
  FormModule.setId('');
  FormModule.setData({ business: payload.businessId, agency: payload._id })
  emits('changeModal', {
    modal: 'formPhysicalPositionModal',
    payload: {
      show: true
    },
  })
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
              <h5 class="mb-0">Listado de agencias</h5>
              <p class="mb-0 text-sm">
                A continuación se listan todos las agencias.
              </p>
            </div>
            <argon-button
              @click="create"
              class="btn btn-sm btn-primary mb-0 ms-auto"
            >
              Nueva agencia
              <i class="fas fa-plus ps-1" />
            </argon-button>
          </div>
          <div class="table-responsive">
            <base-table
              :columns="[
                {
                  label: 'Nombre',
                  prop: 'name',
                  minWidth: 100,
                },
                {
                  label: 'Empresa',
                  prop: 'business',
                  minWidth: 100,
                },
                {
                  label: 'Zona',
                  prop: 'zone',
                  minWidth: 100,
                },
                {
                  label: 'N° AG',
                  prop: 'assignedAgents',
                  minWidth: 80,
                },
                {
                  label: 'N° AR',
                  prop: 'totalAgents',
                  minWidth: 80,
                },
                {
                  label: 'Supervisor',
                  prop: 'supervisor',
                  minWidth: 100,
                  formatter: (row: any, column: any) => {
                    return row[column.property] ? row[column.property] : 'Administrador'
                  }
                },
                {
                  label: 'Creado por',
                  prop: 'createdBy',
                  minWidth: 100,
                  formatter: (row: any, column: any) => {
                    return row[column.property] ? row[column.property] : 'Administrador'
                  }
                },
                {
                  label: 'Estado',
                  prop: 'active',
                  minWidth: 100,
                }
              ]"
              :options="[
                {
                  name: 'Configuraciones',
                  icon: 'fa fa-cog',
                  function: openConfigModal,
                },
                {
                  name: 'Agregar posición',
                  icon: 'fa fa-location-arrow',
                  function: createPhysicalPosition,
                },
              ]"
              endpoint="/agencies/find-all"
              :reload-data="FormModule.getUpdateData"
              @edit="edit"
              @delete="drop"
            >
              <template #name="scope">
                <router-link
                  class="w-100 d-flex align-items-center text-decoration-none"
                  :to="{
                    name: 'AgencyOverview',
                    query: { a: scope.row.slug },
                  }"
                >
                  {{ scope.row.name }}
                  <i class="fs-8 fas fa-external-link-alt ms-auto" />
                </router-link>
              </template>
              <template #business="scope">
                <router-link
                  class="w-100 d-flex align-items-center text-decoration-none"
                  :to="{
                    name: 'BusinessOverview',
                    query: { b: scope.row.businessSlug },
                  }"
                >
                  {{ scope.row.business }}
                  <i class="fs-8 fas fa-external-link-alt ms-auto" />
                </router-link>
              </template>
              <template #extraMode="scope">
                <el-tag
                  :type="scope.row.extraMode === 0 ? 'danger' : 'success'"
                >
                  {{
                    scope.row.extraMode === 0
                      ? "No se pagan"
                      : scope.row.extraMode === 1
                      ? "Sobre 44"
                      : "Sobre turno"
                  }}
                </el-tag>
              </template>
              <template #active="scope">
                <el-tag
                  :type="scope.row.active === true ? 'success' : 'danger'"
                >
                  {{ scope.row.active === true ? "Activo" : "Inactivo" }}
                </el-tag>
              </template>
            </base-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
