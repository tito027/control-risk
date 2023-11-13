<script lang="ts" setup>
import { computed, onMounted, onBeforeMount, ref } from "vue"
import EditPhoto from "@/components/EditPhoto.vue"
import { BusinessModule } from "@/store/modules/Business"
import ProfileInfoCard from "@/components/ProfileInfoCard.vue"
import BaseTable from "@/components/tables/Base.vue"
import { getUrlBackend, handleRequests } from "@/utils/utils"
import ApiGateway from "@/store/api"
import { useStore } from "vuex"
import setNavPills from "@/assets/js/nav-pills"
import { Modals, ModalState } from "@/types/components"
import { useRoute } from "vue-router"
import { ElMessage } from "element-plus"
import { confSalaries } from "./consts"
import { FormModule } from "@/store/modules/FormModule"
import Statistics from "./Statistics.vue"
import { DateTime } from "luxon"

// props & emits
const emits = defineEmits<{
  (
    e: "changeModal",
    payload: {
      modal: Modals
      payload: ModalState
    }
  ): void
}>()
// hooks
const route = useRoute()
const store = useStore()
// ===> Data
const body = document.getElementsByTagName("body")[0]
const editPhoto = ref(false)

// ===> Computed
const business = computed(() => BusinessModule.overview)
const slugBusiness = computed(() => route.query.b as string)

const imageProfile = computed(() =>
  business.value
    ? getUrlBackend(`/public/business/${business.value.slug}.jpg`)
    : ""
)

// ===> Events
function onConfSalary() {
  if (!business.value) return
  FormModule.setId(business.value._id)
  FormModule.setData({ name: business.value.name })
  emits("changeModal", {
    modal: "formBusinessConfigModal",
    payload: {
      show: true,
    },
  })
}

function onImageSave(blob: Blob) {
  const form = new FormData()
  form.append("name", business.value?.slug + ".jpg")
  form.append("path", "./business")
  form.append("file", blob) // It's important to keep this file always in the end
  handleRequests(
    ApiGateway.post<{ saved: true }>("/assets/upload", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
    {
      hideAlert: true,
    }
  )
    .then(async rep => {
      if (!rep.success || !rep.reply.data.saved)
        throw new Error(
          "Algo salió mal por favor reintentar recargando el navegador"
        )
      ElMessage({
        type: "success",
        message: "La foto de usuario ha sido modificada!",
      })
      await BusinessModule.upgradeOverview({ image: true })
      editPhoto.value = false
    })
    .catch(err => {
      console.error(err)
      ElMessage({
        type: "error",
        message: "Algo salió mal por favor contactar con soporte técnico",
      })
    })
}

function formatMoneyObject(obj: Record<string, any>) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = `$${Math.round(value * 100) / 100}`
    return acc
  }, {} as Record<string, string>)
}

function formatContactsObject(array: any[]) {
  let response: any = {}
  array.map((contact: any) => {
    response.tittle = contact.contactName
    response.type = String
    response[
      contact.contactName
    ] = `${contact.contactPhone} / ${contact.contactEmail}`
  })
  console.log(response)
  return response
}

function formatContactsContentList(array: any[]) {
  let response: any[] = array.map((contact: any) => ({
    tittle: contact.contactName,
    name: contact.contactName,
    type: String,
    icon: "",
  }))
  console.log(response)
  return response
}

onBeforeMount(() => {
  store.state.showNavbar = false
  store.state.layout = "custom"
  store.state.showSidenav = false
  store.state.showFooter = true
  store.state.hideConfigButton = true
  body.classList.add("profile-overview")
  BusinessModule.clearOverview()
})
onMounted(async () => {
  setNavPills()
  await BusinessModule.pullBusiness({
    slug: slugBusiness.value,
  })
})
</script>
<template>
  <main>
    <edit-photo
      title="Foto o logo de empresa"
      :aspectRatio="4 / 3"
      :onImageSave="onImageSave"
      v-model="editPhoto"
    />
    <div class="mt--5">
      <div class="card shadow-lg mx-4 card-profile-bottom">
        <div class="card shadow-lg">
          <el-skeleton
            :loading="BusinessModule.isOverviewLoading"
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
                      style="min-height: 100px"
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
                      {{ business?.name }}
                    </h5>

                    <p class="mb-0 font-weight-bold">
                      {{ business?.nickname }}
                    </p>
                    <div class="d-flex my-1">
                      <p class="mb-0 text-sm me-2">
                        <span class="font-weight-bold">NIT:</span>
                        {{ business?.nit }}
                      </p>
                      <p class="mb-0 text-sm me-2">
                        <span class="font-weight-bold"
                          >Actividad que desarrolla:</span
                        >
                        {{ business?.activityThatDevelops }}
                      </p>
                    </div>
                    <div class="d-flex my-1">
                      <p class="mb-0 text-sm me-2">
                        <span class="font-weight-bold"
                          >Inicio de Contrato:</span
                        >
                        {{
                          business?.contractStartDate
                            ? DateTime.fromISO(
                                business.contractStartDate.toString()
                              ).toFormat("dd/MM/yyyy")
                            : "Sin fecha de inicio"
                        }}
                      </p>
                      <p class="mb-0 text-sm me-2">
                        <span class="font-weight-bold"
                          >Términos de crédito:</span
                        >
                        {{ business?.creditTerm }}
                      </p>
                    </div>
                    <div class="d-flex my-1">
                      <p class="mb-0 text-sm me-2">
                        <span class="font-weight-bold">Dirección:</span>
                        {{ business?.address }}
                      </p>
                      <p class="mb-0 text-sm me-2">
                        <span class="font-weight-bold">Horas extras: </span>
                        <el-tag
                          :type="
                            business?.extraMode === 0 ? 'danger' : 'success'
                          "
                        >
                          {{
                            business?.extraMode === 0
                              ? "No se pagan"
                              : business?.extraMode === 1
                              ? "Sobre 44"
                              : "Sobre turno"
                          }}
                        </el-tag>
                      </p>
                      <p class="mb-0 text-sm">
                        Estado:
                        <span class="font-weight-bold">{{
                          business?.active ? "Activo" : "Inactivo"
                        }}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-skeleton>
        </div>
      </div>

      <statistics v-if="business?._id" :business-id="business._id" />

      <!-- INFOMACIÓN de la  empresa -->
      <div class="pb-4 container-fluid px-4">
        <div class="mt-3 row">
          <div class="mt-4 col-12 col-md-6 col-xs-6 col-xxl-4 mt-md-0">
            <profile-info-card
              title="Configuraciones de salario base"
              :info="formatMoneyObject(business?.baseSalary ?? {})"
              :contentList="confSalaries"
              :action="{
                icon: 'fas fa-cog',
                onClick: onConfSalary,
              }"
            />
          </div>
          <div class="mt-4 col-12 col-md-6 col-xs-6 col-xxl-4 mt-md-0">
            <profile-info-card
              title="Configuraciones de salario extra"
              :info="formatMoneyObject(business?.extraSalary ?? {})"
              :contentList="confSalaries"
              :action="{
                icon: 'fas fa-cog',
              }"
            />
          </div>
          <div class="mt-4 col-12 col-md-6 col-xs-6 col-xxl-4 mt-md-0">
            <profile-info-card
              title="Configuraciones de salario nocturno"
              :info="formatMoneyObject(business?.nightlyExtraSalary ?? {})"
              :contentList="confSalaries"
              :action="{
                icon: 'fas fa-cog',
              }"
            />
          </div>
          <div class="mt-4 col-12 col-md-6 col-xs-6 col-xxl-4 mt-3">
            <profile-info-card
              title="Configuraciones de pago por agente"
              :info="formatMoneyObject(business?.customerPayment ?? {})"
              :contentList="confSalaries"
              :action="{
                icon: 'fas fa-cog',
              }"
            />
          </div>
          <div class="mt-4 col-12 col-md-6 col-xs-6 col-xxl-4 mt-3">
            <profile-info-card
              title="Configuraciones de contacto"
              :info="formatContactsObject(business?.contacts ?? [])"
              :contentList="formatContactsContentList(business?.contacts ?? [])"
              :action="{
                icon: 'fas fa-cog',
              }"
            />
          </div>
        </div>

        <div class="mt-3 row" v-if="business?._id">
          <div class="card">
            <!-- Card header -->
            <div
              class="card-header d-flex align-items-center justify-content-between w-100"
            >
              <div>
                <h5 class="mb-0">Listado de agencias</h5>
                <p class="mb-0 text-sm">
                  A continuación se listan las agencias pertenecientes a esta
                  empresa.
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
                :endpoint="`/business/find/agencies/${business?._id}`"
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
  width: 200px;
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
