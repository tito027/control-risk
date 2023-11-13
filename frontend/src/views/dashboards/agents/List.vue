<script setup lang="ts">
import BaseTable from "@/components/tables/Base.vue"
import { AgentsModule } from "@/store/modules/Agents"
import { getUrlBackend } from "@/utils/utils"
import { useRouter } from "vue-router"
import { ref } from "vue"
import { ElMessage } from "element-plus"
import { ModalState, Modals } from "@/types/components"
import { FormModule, ModalType } from "@/store/modules/FormModule"
import ApiGateway from "@/store/api"

// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void
}>()

const router = useRouter()

const showModalCantEdit = ref(false)
let userId = ref(null)
let userInfoId = ref(null)
let s = ref(null)

function genereteCarnet(payload: any) {
  window.open(getUrlBackend(`./agents/carnet/${payload.carnet}`), "_blank")
}

function genereteGroupCarnet() {
  const query = ["QM60973", "ER37284", "SS28489"] // Query fijo

  query.forEach(pdfName => {
    const pdfUrl = getUrlBackend(`./agents/carnet/${pdfName}`)
    window.open(pdfUrl, "_blank")
  })
}

function onEdit(payload: any) {
  // si payload.nextStep != [] redirigimos al formulario de AgentNew sino mostramos modal informando que debecompletar el formulario
  if (!(payload.nextStep.length > 0) || payload.nextStep[0] === 4) {
    router.push({
      name: "AgentNew",
      query: {
        uI: payload.userid,
        uII: payload.userinfoid,
        edit: "true",
      },
    })
  } else {
    // mostramos modal informando que debecompletar el formulario
    userId.value = payload.userid
    userInfoId.value = payload.userinfoid
    s.value = payload.nextStep
    showModalCantEdit.value = true
  }
}
async function onDelete(payload: any) {
  if (!payload.active) {
    ElMessage.error("El usuario ya se encuentra inactivo")
    return
  }

  let res = await AgentsModule.deleteAgent(payload.userid)

  // console.log({ res })
  if (res) {
    // showModalDeleteSuccess.value = true;
    ElMessage.success("El usuario pasará a estado inactivo")
  } else {
    //showModalDeleteError.value = true;
    ElMessage.error("No se pudo desactivar el usuario")
  }
}

function openModalStatus(payload: any) {
  FormModule.setId(payload.userid)
  FormModule.setData({
    name: payload.nombre,
    carnet: payload.carnet,
  })
  emits("changeModal", {
    modal: "formAgentStatusModal",
    payload: {
      show: true,
    },
  })
}
import { defineEmits } from "vue"

const openFormCreateModal = () => {
  emits("changeModal", {
    modal: "formCreateUnknownModal",
    payload: { show: true },
  })
}

function changeAssigment(payload: any) {
  FormModule.setId(payload.userid)
  ApiGateway.get(`/agents/find/${FormModule.getId}`)
    .then(response => {
      FormModule.setData({
        name: payload.nombre,
        business: response.data?.assignment?.agency?.business ?? null,
        agency: response.data?.assignment?.agency?._id ?? null,
        role: response.data?.role ?? null,
        salary: response.data?.userInformation?.salary.toString() ?? "0",
      })
      emits("changeModal", {
        modal: "formAgentAssignmentModal",
        payload: {
          show: true,
        },
      })
    })
    .catch(() => {
      ElMessage({
        message: `No se ha podido obtener los datos del agente!!!`,
        type: "error",
      })
    })
}
</script>
<template>
  <div class="py-4 container-fluid">
    <!-- Modal aún no se completa registro -->
    <el-dialog v-model="showModalCantEdit" :close-on-click-modal="false">
      <div class="text-center">
        <h3>Aún no completas el registro de este agente</h3>
        <p>
          Parece que la información de este agente aún no ha sido completada,
          puedes continuar con el registro en el formulario desde el paso en el
          que lo dejó
        </p>
        <br />
        <el-button @click="showModalCantEdit = false">Cancelar</el-button>
        <el-button
          @click="
            $router.push({
              name: 'AgentNew',
              query: { uI: userId, uII: userInfoId, s: s, edit: 'false' },
            })
          "
          >Continuar editando</el-button
        >
      </div>
    </el-dialog>
    <div class="mt-4 row">
      <div class="col-12">
        <div class="card">
          <!-- Card header -->
          <div class="card-header d-flex align-items-center w-100 justify-content-between">
            <div>
              <h5 class="mb-0">Agentes</h5>
              <p class="mb-0 text-sm">
                Listado de expediente de los agentes en sistema
              </p>
            </div>
            <div class="mb-2 d-flex flex-column">
              <!-- Div para botones -->
              <button
                @click="$router.push({ name: 'AgentNew' })"
                class="btn btn-sm btn-primary mb-4"
              >
                Nuevo expediente
                <i class="fas fa-plus ps-1" />
              </button>
              <button
                @click="openFormCreateModal"
                class="btn btn-sm btn-primary mb-0"
              >
                Carnets masivos
                <i class="fas fa-plus ps-1" />
              </button>
            </div>
          </div>
          <div class="table-responsive">
            <base-table
              :columns="[
                {
                  label: 'Carnet',
                  prop: 'carnet',
                  minWidth: 100,
                },
                {
                  label: 'Nombre',
                  prop: 'nombre',
                  minWidth: 180,
                },
                {
                  label: 'Agencia',
                  prop: 'agencia',
                  minWidth: 180,
                },
                {
                  label: 'Estatus',
                  prop: 'status',
                  minWidth: 180,
                },
                {
                  label: 'Estado',
                  prop: 'active',
                  minWidth: 100,
                },
              ]"
              :options="[
                {
                  name: 'Carnet',
                  icon: 'fas fa-id-card',
                  function: genereteCarnet,
                },
                {
                  name: 'Carnet Test',
                  icon: 'fas fa-id-card',
                  function: genereteGroupCarnet,
                },
                {
                  name: 'Asignar',
                  icon: 'fas fa-house-user',
                  function: changeAssigment,
                },
                {
                  name: 'Estado',
                  icon: 'fas fa-user',
                  function: openModalStatus,
                },
              ]"
              endpoint="/agents/list"
              :reload-data="FormModule.getUpdateData"
              @edit="onEdit"
              @delete="onDelete"
            >
              <template #nombre="scope">
                <router-link
                  class="w-100 d-flex align-items-center text-decoration-none"
                  :to="{
                    name: 'AgentOverview',
                    query: { carnet: scope.row.carnet },
                  }"
                >
                  {{ scope.row.nombre }}
                  <i class="fs-8 fas fa-external-link-alt ms-auto" />
                </router-link>
              </template>
              <template #active="scope">
                <el-tag
                  :type="scope.row.active === true ? 'success' : 'danger'"
                >
                  {{ scope.row.active === true ? "Activo" : "Inactivo" }}
                </el-tag>
                <router-link
                  class="m-2 align-items-center text-decoration-none"
                  v-if="scope.row.active === false && scope.row.nextStep"
                  :to="{
                    name: 'AgentNew',
                    query: {
                      uI: scope.row.userid,
                      uII: scope.row.userinfoid,
                      s: scope.row.nextStep,
                    },
                  }"
                >
                  <i class="fs-8 fas fa-external-link-alt ms-auto" />
                </router-link>
              </template>
            </base-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
