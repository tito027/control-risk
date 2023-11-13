<script setup lang="ts">
import ArgonButton from "@/components/ArgonButton.vue"
import {
  onBeforeUnmount,
  onMounted,
  computed,
  reactive,
  ComputedRef,
  initCustomFormatter,
} from "vue"
import { AppModule } from "@/store/modules/App"
import ArgonInput from "@/components/ArgonInput.vue"
import { useRouter } from "vue-router"
import { Action, ElMessage, ElMessageBox } from "element-plus"
import { CheckioModule } from "@/store/modules/CheckInOut"
import { Form as VForm } from "vee-validate"
import { confirmSchema } from "./confirm.schema"
import type { IOptions } from "@/types/components"
import SelectControlled from "@/components/SelectControlled.vue"
import { getUrl, getUrlBackend } from "@/utils/utils"
import api from "@/store/api"

const body = document.getElementsByTagName("body")[0]
const router = useRouter()
const options: IOptions[] = [
  {
    value: "",
    label: "",
    selected: true,
    disabled: true,
  },
]

const reasons = reactive<{ inSite: IOptions[]; inTime: IOptions[] }>({
  inSite: [],
  inTime: [],
})

// Computed
const name = computed(() => CheckioModule.checkin.username)
const user = computed(() => CheckioModule.checkin.user)
const checkReasons: ComputedRef<["inSite" | "inTime", boolean][]> = computed<
  [any, boolean][]
>(() => Object.entries(CheckioModule.reasons).filter(([_k, v]) => !v))

// Methods
function getReasonPlaceholder(reason: string) {
  return (
    {
      inSite: "Seleccione motivo por checkin fuera de sitio",
      inTime: "Seleccione motivo por checkin fuera de horario",
    }[reason] ?? ""
  )
}
async function onSubmit(e: {
  inSite: string
  inTime: string
  password: string
}) {
  const response = await CheckioModule.sign({
    reasonSite: e.inSite,
    reasonTime: e.inTime,
    password: e.password,
    physicalPosition: AppModule.physicalPosition,
  })
  if (response) {
    ElMessageBox.alert(
      `${CheckioModule.checkin.type} realizado con éxito`,
      "Nuevo mensaje del sistema",
      {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: "OK",
        callback: (action: Action) => {
          router.push("/authentication/checkin")
          ElMessage({
            type: "success",
            message: `${CheckioModule.checkin.type} registrado`,
          })
          CheckioModule.clearState()
        },
      }
    )
  }
}
async function getReasonOptions(
  reason: "inSite" | "inTime",
  defaultLabel?: string
) {
  if (reasons[reason].length) return reasons[reason]
  const defaultOption = options[0]
  defaultOption.label = defaultLabel ?? ""
  const reasonOptions = await api.post<{ _id: string; reason: string }[]>(
    "/reasons",
    {
      data: { type: reason === "inSite" ? "position" : "time" },
    }
  )
  reasons[reason] = reasonOptions.data.map(rs => ({
    label: rs.reason,
    value: rs._id,
    selected: false,
  }))
  return [defaultOption]
}
onMounted(async () => {
  AppModule.setHideConfigButton(true)
  AppModule.toggleDefaultLayout()
  body.classList.remove("bg-gray-100")
  // checkReasons.value.forEach(([reason]) => getReasonOptions(reason))
  if (!CheckioModule.checkin.username) {
    router.push("/authentication/checkin")
    ElMessage({
      message: "Escanee el carnet primero",
      type: "error",
    })
  }
})
onBeforeUnmount(() => {
  AppModule.setHideConfigButton(false)
  AppModule.toggleDefaultLayout()
  body.classList.add("bg-gray-100")
})
</script>
<template>
  <main class="main-content mt-0">
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-11"
      style="
        background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/lock-cover.jpg');
      "
    >
      <!--       <h3 class="text-position text-style">
        El único modo de hacer un gran trabajo es amar lo que haces
      </h3> -->
      <span class="mask bg-gradient-dark opacity-6"></span>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-5 col-lg-5 col-md-7 mx-auto">
          <div class="card">
            <div class="card-body text-center">
              <div class="info mb-4 mt-n6">
                <img
                  class="avatar avatar-xxl shadow-lg border border-white"
                  style="width: auto !important"
                  alt="Image placeholder"
                  :src="
                    user?.image
                      ? getUrlBackend(`/public/carnets/${user?.carnet}.jpg`)
                      : getUrl('./src/assets/img/shapes/no-image-available.png')
                  "
                />
              </div>
              <h4 class="mb-2 font-weight-bolder">{{ name }}</h4>
              <div class="my-2">
                <el-alert
                  v-if="CheckioModule.checkin.alerts.length"
                  type="warning"
                  show-icon
                  :closable="false"
                >
                  <div
                    v-for="(alert, i) in CheckioModule.checkin.alerts"
                    :key="i"
                    class="text-start"
                  >
                    <strong> {{ alert }}</strong>
                  </div>
                </el-alert>
              </div>
              <p class="mb-4">
                Debe ingresar contraseña para continuar con el
                {{ CheckioModule.checkin.type }}
              </p>
              <VForm
                @submit="(e: any) => onSubmit(e)"
                :validation-schema="confirmSchema(checkReasons)"
                role="form"
              >
                <select-controlled
                  v-if="CheckioModule.checkin.alerts"
                  v-for="[reason] in checkReasons"
                  :key="reason"
                  :placeholder="getReasonPlaceholder(reason)"
                  :select-options="{
                    valueKey: '_id',
                    labelKey: 'reason',
                    multiple: false,
                  }"
                  :name="reason"
                  :fetch="`reasons/${
                    reason === 'inSite' ? 'position' : 'time'
                  }`"
                ></select-controlled>

                <argon-input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  aria-label="password"
                />
                <div class="text-center">
                  <argon-button
                    type="submit"
                    color="dark"
                    variant="gradient"
                    size="lg"
                    class="mt-3 mb-0"
                  >
                    Continuar
                  </argon-button>
                </div>
              </VForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style>
.text-position {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1 !important;
}
.text-style {
  color: white;
  font-style: italic;
  text-align: center;
}
</style>
