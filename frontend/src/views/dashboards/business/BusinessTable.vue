<script setup lang="ts">
import BaseTable from "@/components/tables/Base.vue"
import ArgonButton from "@/components/ArgonButton.vue"
import { Modals, ModalState } from "@/types/components"
import { FormModule } from "@/store/modules/FormModule"
import { ref } from "vue"
import { ConfirmModalModule } from "@/store/modules/ConfirmModal"
import { useRouter } from "vue-router"

// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void
}>()

enum ModalType {
  create = "create",
  edit = "edit",
}

const loading = ref(false)

const router = useRouter()

function openModalNewBusiness() {
  emits("changeModal", {
    modal: "formBusinessModal",
    payload: {
      show: true,
    },
  })

  FormModule.setType(ModalType.create)
  FormModule.setEndpoint("")
  FormModule.setId("")
}

function edit(payload: any) {
  // abrimos modal con la información de la empresa seleccionada
  emits("changeModal", {
    modal: "formBusinessModal",
    payload: {
      show: true,
    },
  })

  // seteamos la información de la empresa a editar en el store
  FormModule.setId(payload._id)
  FormModule.setType(ModalType.edit)
  FormModule.setEndpoint("/business/find") // para obtener la información de la empresa
}

function drop(payload: any) {
  ConfirmModalModule.setTitle(`Deshabilitar empresa`)
  ConfirmModalModule.setText(`¿Desea deshabilitar la empresa ${payload.name}?`)
  ConfirmModalModule.setButtonColor("danger")
  ConfirmModalModule.setIcon({ color: "#FF6978", size: 17 })
  ConfirmModalModule.setButtonText("Deshabilitar")
  ConfirmModalModule.setEndpoint(`/business/delete/${payload._id}`)
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
    modal: "formBusinessConfigModal",
    payload: {
      show: true,
    },
  })
}

function pushContacts(payload: any) {
  console.log(payload)
  router.push(`/admin/business/contacts?business=${payload._id}`)
}

function newAgency(payload: any) {
  FormModule.setType(ModalType.create)
  FormModule.setEndpoint("")
  FormModule.setId("")
  FormModule.setData({ business: payload._id })
  emits("changeModal", {
    modal: "formAgencyModal",
    payload: {
      show: true,
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
              <h5 class="mb-0">Listado de empresas</h5>
              <p class="mb-0 text-sm">
                A continuación se listan todos las empresas.
              </p>
            </div>
            <argon-button
              @click="openModalNewBusiness"
              class="btn btn-sm btn-primary mb-0 ms-auto"
            >
              Nueva empresa
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
                  label: 'Nombre simplificado',
                  prop: 'nickname',
                  minWidth: 100,
                },
                {
                  label: 'Modo de pago horas extra',
                  prop: 'extraMode',
                  minWidth: 80,
                },
                {
                  label: 'N° AG',
                  prop: 'assignedAgents',
                  minWidth: 85,
                },
                {
                  label: 'N° AR',
                  prop: 'totalAgents',
                  minWidth: 85,
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
                  minWidth: 50,
                },
              ]"
              :options="[
                {
                  name: 'Configuraciones',
                  icon: 'fa fa-cog',
                  function: openConfigModal,
                },
                {
                  name: 'Nueva agencia',
                  icon: 'fa fa-city',
                  function: newAgency,
                },
                {
                  name: 'Contactos',
                  icon: 'fa fa-phone',
                  function: pushContacts,
                },
              ]"
              endpoint="/business/find-all"
              :reload-data="FormModule.getUpdateData"
              @edit="edit"
              @delete="drop"
            >
              <template #nickname="scope">
                <router-link
                  class="w-100 d-flex align-items-center text-decoration-none"
                  :to="{
                    name: 'BusinessOverview',
                    query: { b: scope.row.slug },
                  }"
                >
                  {{ scope.row.nickname }}
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
