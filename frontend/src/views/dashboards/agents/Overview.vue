<script lang="ts" setup>
import BaseTable from "@/components/tables/Base.vue"
import { ref, computed } from "vue"
import { useStore } from "vuex"
import { onMounted, onBeforeMount, onBeforeUnmount } from "vue"
import { AgentsModule } from "@/store/modules/Agents"
import ProfileInfoCard from "./components/ProfileInfoCard.vue"
import setNavPills from "@/assets/js/nav-pills.js"
import { generalInformation, workerData, licencias } from "@/store/constantes"
import EditPhoto from "./components/EditPhoto.vue"
import { getUrlBackend } from "@/utils/utils"
import QrPreview from "./components/QrPreview.vue"
import DetailsComponent from "./components/Details.vue"
import { DateTime } from "luxon"

const body = document.getElementsByTagName("body")[0]
// si tenemos nextStep en la url lo tomamos, si no, tomamos el valor del prop
const urlParams = new URLSearchParams(window.location.search)
const editPhoto = ref(false)
const Carnet = urlParams.get("carnet")
const store = useStore()

const imageProfile = computed(() =>
  AgentsModule.getAgentOverview?.image
    ? getUrlBackend(
        `./public/carnets/${AgentsModule.getAgentOverview.carnet}.jpg`
      )
    : ""
)

onMounted(async () => {
  store.state.isAbsolute = true
  setNavPills()
  await AgentsModule.pullAgent({
    carnet: Carnet,
  })
  // setTooltip(this.$store.state.bootstrap);
})
onBeforeMount(() => {
  store.state.showNavbar = false
  store.state.layout = "custom"
  store.state.showSidenav = false
  store.state.showFooter = true
  store.state.hideConfigButton = true
  body.classList.add("profile-overview")
})
onBeforeUnmount(() => {
  store.state.isAbsolute = false
  store.state.layout = "text-white"
  store.state.showNavbar = false
  store.state.showFooter = true
  store.state.hideConfigButton = false
  body.classList.remove("profile-overview")
})
</script>
<template>
  <main>
    <edit-photo v-model="editPhoto" />
    <div class="mt--4">
      <div class="card shadow-lg mx-4 card-profile-bottom">
        <div class="card shadow-lg">
          <el-skeleton
            :loading="AgentsModule.getIsOverviewLoading"
            animated
            class="my-4"
          >
            <template #template>
              <div class="container mx-3">
                <div class="row">
                  <div class="col-xxl-1 col-xl-2 col-md-2">
                    <el-skeleton-item
                      variant="image"
                      style="width: 100px; height: 100px"
                    />
                  </div>
                  <div class="col-xxl-11 col-xl-8 col-md-10">
                    <div style="padding: 14px">
                      <el-skeleton-item variant="h1" style="width: 100%" />
                      <el-skeleton-item variant="text" style="width: 100%" />
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <div class="card-body p-3">
              <div class="row gx-4 flex-nowrap">
                <div class="avatarCR d-flex align-items-center">
                  <div class="demo-image__preview position-relative w-100">
                    <span
                      class="d-flex justify-content-center align-items-center position-absolute btn-edit can-hover"
                      @click="editPhoto = true"
                    >
                      <i class="fs-8 fas fa-pen text-white"></i>
                    </span>
                    <el-image
                      loading="eager"
                      alt="profile_image"
                      class="rounded d-block shadow-sm w-100 border-radius-lg"
                      :src="imageProfile"
                      :zoom-rate="1"
                      :preview-src-list="[imageProfile]"
                      :initial-index="1"
                      fit="fill"
                      :lazy="true"
                      :hide-on-click-modal="true"
                      style="min-height: 70px"
                    >
                      <template #placeholder>
                        <div v-loading="true" class="h-100"></div>
                      </template>
                    </el-image>
                  </div>
                </div>

                <div class="col-auto my-auto">
                  <div class="h-100">
                    <h5 class="mb-1 font-weight-bold">
                      {{ AgentsModule.getUserInformation?.name }}
                      {{ AgentsModule.getUserInformation?.lastname }}
                    </h5>

                    <p class="mb-0 font-weight-bold">
                      {{ AgentsModule.getAgentOverview?.carnet }}
                    </p>

                    <p class="mb-0 text-sm">
                      Estado:
                      <span class="font-weight-bold">{{
                        AgentsModule.getAgentOverview?.status
                      }}</span>
                    </p>
                  </div>
                </div>

                <div class="ms-auto" style="flex: 0">
                  <qr-preview />
                </div>
                <!--                 <div
                  class="mx-auto mt-3 col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0"
                ></div> -->
              </div>
            </div>
          </el-skeleton>
        </div>
      </div>
      <!-- Detalles de informacion -->
      <details-component />

      <!-- INFOMACIÓN DEL AGENTE -->
      <div class="pb-4 container-fluid px-4">
        <div class="mt-3 row">
          <div class="mt-4 col-12 col-md-6 col-xs-6 col-xxl-4 mt-md-0">
            <profile-info-card
              title="Información general"
              :info="AgentsModule.getUserInformation"
              :contentList="generalInformation"
            />
          </div>
          <div class="mt-4 col-12 col-md-6 col-xs-6 col-xxl-4 mt-md-0">
            <profile-info-card
              title="Datos del trabajador"
              :info="AgentsModule.getUserInformation"
              :contentList="workerData"
            />
          </div>
          <div class="mt-4 col-12 col-md-6 col-xs-6 col-xxl-4 mt-md-2">
            <profile-info-card
              title="Licencias"
              :info="AgentsModule.getUserInformation"
              :action="{
                to: {
                  name: 'AgentNew',
                  query: {
                    edit: 'true',
                    uI: AgentsModule.getAgentOverview?._id,
                    uII: AgentsModule.getUserInformation?._id,
                    s: 3,
                  },
                },
              }"
              :contentList="licencias"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 pb-4 container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div
              class="card-header d-flex align-items-center justify-content-between w-100"
            >
              <div>
                <h5 class="mb-0">Historial de estados</h5>
                <p class="mb-0 text-sm">
                  A continuación se listan los diferentes estados por los que ha
                  pasado el agente {{ AgentsModule.getUserInformation?.name }}
                  {{ AgentsModule.getUserInformation?.lastname }}
                </p>
              </div>
            </div>
            <div class="table-responsive">
              <base-table
                :columns="[
                  {
                    label: 'Estado',
                    prop: 'status',
                    minWidth: 100,
                  },
                  {
                    label: 'Razón',
                    prop: 'reason',
                    minWidth: 100,
                    default: 'Sin razón'
                  },
                  {
                    label: 'Comentario',
                    prop: 'comment',
                    minWidth: 250,
                    default: 'Sin comentario'
                  },
                  {
                    label: 'Fecha',
                    prop: 'date',
                    minWidth: 150,
                    formatter: (row: any, column: any) => {
                      return `${DateTime.fromISO(row[column.property]).toFormat(
                        'dd/MM/yyyy'
                      )}`
                    }
                  },
                ]"
                :endpoint="`/agents/status/list/${Carnet}`"
                :hide-default-options="true"
              >
              </base-table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div
              class="card-header d-flex align-items-center justify-content-between w-100"
            >
              <div>
                <h5 class="mb-0">Historial de asignaciones</h5>
                <p class="mb-0 text-sm">
                  A continuación se listan las diferentes asignaciones por los
                  que ha pasado el agente
                  {{ AgentsModule.getUserInformation?.name }}
                  {{ AgentsModule.getUserInformation?.lastname }}
                </p>
              </div>
            </div>
            <div class="table-responsive">
              <base-table
                :columns="[
                  {
                    label: 'Empresa',
                    prop: 'business',
                    minWidth: 100,
                  },
                  {
                    label: 'Agencia',
                    prop: 'agency',
                    minWidth: 100,
                    default: 'Sin razón'
                  },
                  {
                    label: 'Rol',
                    prop: 'role',
                    minWidth: 100,
                  },
                  {
                    label: 'Salario',
                    prop: 'salary',
                    minWidth: 85,
                    formatter: (row: any, column: any) => {
                      return row[column.property] ? `$${row[column.property]}` : 'Salario base'
                    }
                  },
                  {
                    label: 'Efectuado por',
                    prop: 'createdBy',
                    minWidth: 100,
                    formatter: (row: any, column: any) => {
                      return row[column.property] ? row[column.property] : 'Administrador'
                    }
                  },
                  {
                    label: 'Fecha',
                    prop: 'date',
                    minWidth: 100,
                    formatter: (row: any, column: any) => {
                      return `${DateTime.fromISO(row[column.property]).toFormat(
                        'dd/MM/yyyy'
                      )}`
                    }
                  },
                ]"
                :endpoint="`/agents/assignment/list/${Carnet}`"
                :hide-default-options="true"
              >
              </base-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style>
.avatarCR {
  width: 120px;
  /* height: auto; */
  border-radius: 50%;
}

.loadingCR {
  min-height: 72px;
}
.btn-edit {
  width: 25px;
  height: 25px;
  z-index: 1;
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 1 1 rgba(255, 255, 255, 0.3);
  top: 0;
  right: 0;
  border-bottom-left-radius: 50%;
}
.qr-container .qr-code {
  max-height: 100px;
}
</style>
