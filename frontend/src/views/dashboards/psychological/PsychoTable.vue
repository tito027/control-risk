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

function edit(payload: any) {
  FormModule.setId(payload._id)
  FormModule.setType(ModalType.edit)
  FormModule.setEndpoint("/psychic/find")
  FormModule.setData({})
  emits("changeModal", {
    modal: "formPsychoModal",
    payload: {
      show: true,
    },
  })
}
function create() {
  FormModule.setType(ModalType.create)
  FormModule.setEndpoint("")
  FormModule.setId("")
  FormModule.setData({})
  emits("changeModal", {
    modal: "formPsychoModal",
    payload: { show: true },
  })
}

function drop(payload: any) {
  ConfirmModalModule.setTitle(`Deshabilitar preeba`)
  ConfirmModalModule.setText(`¿Desea deshabilitar la prueba ${payload.name}?`)
  ConfirmModalModule.setButtonColor("danger")
  ConfirmModalModule.setIcon({ color: "#FF6978", size: 17 })
  ConfirmModalModule.setButtonText("Deshabilitar")
  ConfirmModalModule.setEndpoint(`/psychic/delete/${payload._id}`)
  emits("changeModal", {
    modal: "confirmModal",
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
              <h5 class="mb-0">Listado de pruebas psicológicas</h5>
              <p class="mb-0 text-sm">
                A continuación se listan todos las pruebas VSA psicológicas.
              </p>
            </div>
            <argon-button @click="create">Agregar prueba </argon-button>
          </div>
          <div class="table-responsive">
            <base-table
              :columns="[
                {
                  label: 'Nombre',
                  prop: 'name',
                  minWidth: 175,
                },
                {
                  label: 'Indicación',
                  prop: 'indication',
                  minWidth: 175,
                },
                {
                  label: 'Requiere comentario',
                  prop: 'comment',
                  minWidth: 150,
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
              endpoint="/psychic/find-all"
              :reload-data="FormModule.getUpdateData"
              @edit="edit"
              @delete="drop"
            >
              <template #comment="scope">
                <el-tag
                  :type="scope.row.comment === true ? 'success' : 'danger'"
                >
                  {{ scope.row.comment === true ? "Si" : "No" }}
                </el-tag>
              </template>
              <template #active="scope">
                <el-tag
                  :type="scope.row.active === true ? 'success' : 'danger'"
                >
                  {{ scope.row.active === true ? "Activo" : "Inactivo" }}
                </el-tag>
              </template>

              <template #name="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ scope.row.name }}
                </div>
              </template>
              <template #indication="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ scope.row.indication }}
                </div>
              </template>
            </base-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
