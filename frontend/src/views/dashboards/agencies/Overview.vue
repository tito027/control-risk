<script lang="ts" setup>
import { computed, onMounted, onBeforeMount, ref, h } from "vue"
import statistics from "./Statistics.vue"
import { AgencyModule } from "@/store/modules/Agencies"
import ProfileInfoCard from "@/components/ProfileInfoCard.vue"
import BaseTable from "@/components/tables/Base.vue"
import { getUrlBackend } from "@/utils/utils"
import { useStore } from "vuex"
import setNavPills from "@/assets/js/nav-pills"
import { useRoute } from "vue-router"
import { ElTag } from "element-plus"
import { Business, BusinessDocument } from "control-risk/business.schema"
import { businessInfo, supervisorInfo } from "./consts"
import { UserDocument } from "control-risk/user.schema"
import { UserInformation } from "control-risk/userInformation.schema"
import Location from "./Location.vue"

// hooks
const route = useRoute()
const store = useStore()
// ===> Data
const body = document.getElementsByTagName("body")[0]

// ===> Computed
const agency = computed(() => AgencyModule.overview)
const business = computed<BusinessDocument | null>(
  () => agency.value?.business as BusinessDocument
)
const supervisor = computed<UserDocument | null>(
  () => agency.value?.supervisor as UserDocument
)
const slugBusiness = computed(() => route.query.a as string)

const imageProfile = computed(() =>
  business.value
    ? getUrlBackend(`/public/business/${business.value.slug}.jpg`)
    : ""
)

// ===> Events

function formatSupervisor() {
  if (!supervisor.value) return {}
  console.log(supervisor.value)
  const userInformation = supervisor.value.userInformation as UserInformation
  return {
    carnet: supervisor.value.carnet,
    name: userInformation
      ? `${userInformation.name} ${userInformation.lastname}`
      : `Sin mayor información`,
  }
}
function formatBusiness(obj: Business | null) {
  if (!obj) return {}
  console.log(obj)
  return {
    ...obj,
    extraMode: () =>
      h(
        ElTag,
        {
          type: obj.extraMode === 0 ? "danger" : "success",
        },
        () =>
          obj.extraMode === 0
            ? "No se pagan"
            : obj.extraMode === 1
            ? "Sobre 44"
            : "Sobre turno"
      ),
  }
}

onBeforeMount(() => {
  store.state.showNavbar = false
  store.state.layout = "custom"
  store.state.showSidenav = false
  store.state.showFooter = true
  store.state.hideConfigButton = true
  body.classList.add("profile-overview")
  AgencyModule.clearOverview()
})
onMounted(async () => {
  setNavPills()
  await AgencyModule.pullBusiness({
    slug: slugBusiness.value,
  })
})
/* import BaseTable from "@/components/tables/Base.vue"
import { ref, computed } from "vue"
import { onMounted, onBeforeMount, onBeforeUnmount } from "vue"
import { AgentsModule } from "@/store/modules/Agents"
import ProfileInfoCard from "./components/ProfileInfoCard.vue"
import setNavPills from "@/assets/js/nav-pills.js"
import { generalInformation, workerData, licencias } from "@/store/constantes"
import { getUrlBackend } from "@/utils/utils"
import QrPreview from "./components/QrPreview.vue"
import DetailsComponent from "./components/Details.vue"
import { DateTime } from "luxon"

const body = document.getElementsByTagName("body")[0]
// si tenemos nextStep en la url lo tomamos, si no, tomamos el valor del prop
const urlParams = new URLSearchParams(window.location.search)
const Carnet = urlParams.get("carnet")

const imageProfile = computed(() =>
  AgentsModule.getAgentOverview?.image
    ? getUrlBackend(
        `/public/carnets/${AgentsModule.getAgentOverview.carnet}.jpg`
      )
    : ""
)

onBeforeUnmount(() => {
  store.state.isAbsolute = false
  store.state.layout = "text-white"
  store.state.showNavbar = false
  store.state.showFooter = true
  store.state.hideConfigButton = false
  body.classList.remove("profile-overview")
}) */
</script>
<template>
  <main>
    <div class="mt--5">
      <div class="card shadow-lg mx-4 card-profile-bottom">
        <div class="card shadow-lg">
          <el-skeleton
            :loading="AgencyModule.isOverviewLoading"
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
                      {{ agency?.name }}
                    </h5>

                    <p class="mb-0">
                      <span>Empresa: </span>
                      <span class="font-weight-bold">{{ business?.name }}</span>
                    </p>

                    <p class="mb-0 text-sm">
                      Estado:
                      <span class="font-weight-bold">{{
                        agency?.active ? "Activo" : "Inactivo"
                      }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </el-skeleton>
        </div>
      </div>

      <statistics v-if="agency?._id" :agency-id="agency._id" />
      <!-- INFOMACIÓN de la  empresa -->
      <div class="pb-4 container-fluid px-4" style="padding: 0">
        <div class="mt-3 row mx-0 px-0">
          <div class="mt-4 col-12 col-md-6 col-xs-6 col-xxl-4 mt-md-0">
            <profile-info-card
              title="Empresa"
              :info="formatBusiness(business)"
              :contentList="businessInfo"
              :action="{
                icon: 'fas fa-building',
                to: {
                  name: 'BusinessOverview',
                  query: {
                    b: business?.slug,
                  },
                },
              }"
            />
          </div>
          <div class="mt-4 col-12 col-md-6 col-xs-6 col-xxl-4 mt-md-0">
            <profile-info-card
              title="Supervisor"
              :info="formatSupervisor()"
              :contentList="supervisorInfo"
              :action="{
                to: {
                  name: 'BusinessOverview',
                  query: {
                    b: business?.slug,
                  },
                },
              }"
            />
          </div>
          <div class="mt-4 col-12 col-md-6 col-xs-6 col-xxl-4 mt-md-0">
            <Location />
          </div>
        </div>

        <div class="mt-3 row mx-0" v-if="agency?._id">
          <div class="card">
            <!-- Card header -->
            <div
              class="card-header d-flex align-items-center justify-content-between w-100"
            >
              <div>
                <h5 class="mb-0">Listado de agentes</h5>
                <p class="mb-0 text-sm">
                  A continuación se listan los agentes pertenecientes a la
                  agencia
                  {{ agency.name }}.
                </p>
              </div>
              <!--               <argon-button
                @click="create"
                class="btn btn-sm btn-primary mb-0 ms-auto"
              >
                Nueva agencia
                <i class="fas fa-plus ps-1" />
              </argon-button> -->
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
                    // link: { name: 'Agent Overview', query: {carnet:   } },
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
                :endpoint="`/agencies/find/agents/${agency._id}`"
              >
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
        <div class="mt-3 row mx-0" v-if="agency?._id">
          <div class="card">
            <!-- Card header -->
            <div
              class="card-header d-flex align-items-center justify-content-between w-100"
            >
              <div>
                <h5 class="mb-0">Listado de posiciones físicas</h5>
                <p class="mb-0 text-sm">
                  A continuación se listan las posiciones físicas pertenecientes
                  a esta empresa.
                </p>
              </div>
              <!--               <argon-button
                @click="create"
                class="btn btn-sm btn-primary mb-0 ms-auto"
              >
                Nueva agencia
                <i class="fas fa-plus ps-1" />
              </argon-button> -->
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
                :endpoint="`/agencies/find/physicalpositions/${agency?._id}`"
              >
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
  max-width: 100px;
  max-height: 100px;
}
</style>
