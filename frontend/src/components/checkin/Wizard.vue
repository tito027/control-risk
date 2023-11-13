<script setup lang="ts">
// prettier-ignore
import { AppModule } from "@/store/modules/App"
import { computed, onMounted, ref } from "vue"
import { ElMessage } from "element-plus"
import { getUrl } from "@/utils/utils"
//Components
import Steps, { IStep } from "./Steps.vue"

// Data
const activeStep = ref(0)
const activeClass = ref("js-active position-relative active")

const container = ref<HTMLDivElement | null>(null)
// Computed
const show = ref(true)
const steps = computed<IStep[]>(() => [
  {
    title: "Bienvenida",
    action: () => {
      activeStep.value += 1
    },
    color: "danger",
    description:
      "Este es el ayudante de configuración, para un nuevo dispositivo que ayudará a marcar las entradas y salidas",
    img: getUrl("./assets/img/illustrations/welcome.webp"),
    labelButton: "Comenzar",
  },
  {
    title: "Permisos de Cámara",
    action: getPermissionCamera,
    color: "primary",
    description:
      "Concede los permisos de acceso a la cámara al dipositivo, para poder realizar el escaneo del código QR del carné de los agentes, de esta manera el CheckIn es mucho más rápido y eficiente!",
    img: getUrl("./assets/img/illustrations/camera.svg"),
    labelButton:
      AppModule.getPermissions["camera"]?.state === "granted"
        ? "Continuar"
        : "Dar permisos de cámara",
  },
  {
    title: "Permisos de Geolocalización",
    action: getPermissionGeo,
    color: "primary",
    description:
      "Concede los permisos de acceso a la geolocalización en el dispositivo, para poder ubicar desde qué lugar se está realizando el proceso de marcaje de entrada!",
    img: getUrl("./assets/img/illustrations/geolocalization.svg"),
    labelButton:
      AppModule.getPermissions["geolocation"]?.state === "granted"
        ? "Continuar"
        : "Dar permisos de GPS",
  },
  {
    title: "¡Configuración Finalizada!",
    action: () => {
      activeStep.value++
      show.value = false
    },
    img: getUrl("./assets/img/illustrations/completed.svg"),
    labelButton: "Finalizar",
    color: "primary",
  },
])

async function getPermissionCamera() {
  try {
    if (AppModule.getPermissions["camera"].state === "granted")
      return (activeStep.value += 1)
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
      },
    })
    const tracks = stream.getVideoTracks()
    tracks[0].stop()
    AppModule.setPermission({
      permission: "camera" as PermissionName,
      state: "granted",
    })
    ElMessage({
      message: "Acceso concedido",
      type: "success",
    })
    activeStep.value += 1
  } catch (e) {
    ElMessage({
      message: "Permisos no otorgados, por favor intente de nuevo!",
      type: "error",
    })
  }
}

async function getPermissionGeo() {
  if (AppModule.getPermissions["geolocation"].state === "granted")
    return (activeStep.value += 1)
  navigator.geolocation.getCurrentPosition(
    pos => {
      ElMessage({
        message: "Acceso concedido",
        type: "success",
      })
      AppModule.setPermission({
        permission: "geolocation",
        state: "granted",
      })
      activeStep.value += 1
    },
    e => {
      ElMessage({
        message: "Permisos no otorgados, por favor intente de nuevo!",
        type: "error",
      })
    }
  )
}
onMounted(() => {
  if (AppModule.hasAllPermissions) {
    activeStep.value = 4
    show.value = false
  }
})
</script>
<template>
  <el-dialog v-model="show" :close-on-click-modal="false" width="70%">
    <template #header> </template>
    <div class="row">
      <div class="mx-auto col-12 col-lg-8">
        <div class="multisteps-form__progress">
          <button
            class="multisteps-form__progress-btn"
            type="button"
            title="User Info"
            :class="{
              [activeClass]: activeStep >= 0,
              current: activeStep === 0,
            }"
            @click="activeStep = 0"
          >
            <span><i class="fas fa-door-open" /></span>
          </button>
          <button
            class="multisteps-form__progress-btn"
            type="button"
            title="Address"
            :class="{
              [activeClass]: activeStep >= 1,
              current: activeStep === 1,
            }"
            @click="activeStep = 1"
          >
            <span><i class="fas fa-camera" /></span>
          </button>
          <button
            class="multisteps-form__progress-btn"
            type="button"
            title="Order Info"
            :class="{
              [activeClass]: activeStep >= 2,
              current: activeStep === 2,
            }"
          >
            <span><i class="fas fa-globe" /></span>
          </button>
          <button
            class="multisteps-form__progress-btn"
            type="button"
            title="Completado"
            :class="{
              [activeClass]: activeStep >= 3,
              current: activeStep === 3,
            }"
          >
            <span><i class="far fa-check-circle"></i></span>
          </button>
        </div>
      </div>
    </div>
    <!--form panels-->
    <div class="row">
      <div class="m-auto col-12 col-lg-8">
        <!--single form panel-->
        <div
          class="w-100 text-center overflow-hidden position-relative"
          ref="container"
        >
          <Steps
            v-for="(step, index) in steps"
            :key="index"
            v-bind="{ step, index, activeStep }"
          />
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<style lang="scss">
.active.current {
  i {
    color: var(--bs-danger);
  }
}
</style>
