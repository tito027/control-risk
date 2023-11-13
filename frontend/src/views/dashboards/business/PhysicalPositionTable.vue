<script setup lang="ts">
import BaseTable from "@/components/tables/Base.vue"
import ArgonButton from "@/components/ArgonButton.vue";
import { Modals, ModalState } from "@/types/components";
import { FormModule } from "@/store/modules/FormModule";
import { ConfirmModalModule } from "@/store/modules/ConfirmModal";
import ApiGateway from "@/store/api"
import { ElMessage } from "element-plus";

// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void;
}>();

enum ModalType {
  create = "create",
  edit = "edit",
}

function create() {
  FormModule.setType(ModalType.create);
  FormModule.setEndpoint('');
  FormModule.setId('');
  FormModule.setData({});
  emits('changeModal', {
    modal: 'formPhysicalPositionModal',
    payload: {
      show: true
    },
  })
}

function edit(payload: any) {
  FormModule.setId(payload._id);
  FormModule.setType(ModalType.edit);
  FormModule.setEndpoint('/physical-position/find');
  ApiGateway.get(FormModule.getEndpoint + "/" + FormModule.getId).then(response => {
    FormModule.setData({
      name: response.data.name,
      numSecurityAgent: response.data.numSecurityAgent.toString(),
      business: response.data.agency.business,
      agency: response.data.agency._id,
    });
    emits('changeModal', {
      modal: 'formPhysicalPositionModal',
      payload: {
        show: true
      },
    })
  }).catch(() => {
    ElMessage({
      message: `No se ha podido obtener la información de la posición!!!`,
      type: "error",
    })
  })
}

function drop(payload: any) {
  ConfirmModalModule.setTitle(`Deshabilitar posición física`)
  ConfirmModalModule.setText(`¿Desea deshabilitar la posición física ${payload.name}?`)
  ConfirmModalModule.setButtonColor('danger')
  ConfirmModalModule.setIcon({ color: '#FF6978', size: 17 })
  ConfirmModalModule.setButtonText('Deshabilitar')
  ConfirmModalModule.setEndpoint(`/physical-position/delete/${payload._id}`)
  emits('changeModal', {
    modal: 'confirmModal',
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
          <div class="card-header d-flex align-items-center justify-content-between w-100">
            <div>
              <h5 class="mb-0">Listado de posiciones físicas</h5>
              <p class="mb-0 text-sm">
                A continuación se listan todos las posiciones físicas.
              </p>
            </div>
            <argon-button
              @click="create"
              class="btn btn-sm btn-primary mb-0 ms-auto"
            >
              Nueva posición física
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
                  label: 'Agencia',
                  prop: 'agency',
                  minWidth: 100,
                },
                {
                  label: 'Empresa',
                  prop: 'business',
                  minWidth: 100,
                },
                {
                  label: 'Número de agentes',
                  prop: 'numSecurityAgent',
                  minWidth: 100,
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
              endpoint="physical-position/find-all"
              :reload-data="FormModule.getUpdateData"
              @edit="edit"
              @delete="drop"
            >
              <template #extraMode="scope">
                <el-tag
                  :type="scope.row.extraMode === 0 ? 'danger' : 'success'"
                >
                  {{
                    scope.row.extraMode === 0 ?
                      'No se pagan' :
                      scope.row.extraMode === 1 ?
                        'Sobre 44' : 'Sobre turno'
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
