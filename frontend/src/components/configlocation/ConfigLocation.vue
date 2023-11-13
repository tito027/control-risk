<template>
  <el-dialog
    v-model="props.showConfigLocation"
    :close-on-click-modal="false"
    :before-close="() => emit('update:showConfigLocation', false)"
    width="90%"
  >
    <template #header> </template>
    <div class="row">
      <div class="mx-auto col-12 col-lg-8">
        <div class="multisteps-form__progress">
          <button
            class="multisteps-form__progress-btn"
            type="button"
            title="Configurar ubicación"
            :class="{
              [activeClass]: activeStep >= 0,
              current: activeStep === 0,
            }"
          >
            <span><i class="fas fa-door-open" /></span>
          </button>
          <button
            class="multisteps-form__progress-btn"
            type="button"
            title="Seleccionar ubicación"
            :class="{
              [activeClass]: activeStep >= 1,
              current: activeStep === 1,
            }"
          >
            <span><i class="fas fa-cog" /></span>
          </button>
          <button
            class="multisteps-form__progress-btn"
            type="button"
            title="Confirmar ubicación"
            :class="{
              [activeClass]: activeStep >= 2,
              current: activeStep === 2,
            }"
          >
            <span><i class="fas fa-check-circle" /></span>
          </button>
        </div>
      </div>
    </div>
    <!--form panels-->
    <div class="row">
      <div class="m-auto col-12 col-lg-8 w-100">
        <!--single form panel-->
        <div
          class="w-100 text-center overflow-hidden position-relative"
          ref="container"
        >
          <StepsLocation
            v-for="(step, index) in steps"
            :key="index"
            v-bind="{ step, index, activeStep, businessRef }"
            @credentialValidation="credentialValidation"
            @validateLocation="validateLocation"
          />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { AppModule } from "@/store/modules/App"
import { computed, onMounted, ref } from "vue"
import { ElMessage } from "element-plus"
import { useConfigLocation } from "@/composables/useConfigLocation.js"

// Components
import StepsLocation, { IStep } from "./StepsLocation.vue"

// Types
export type ActiveProp = { showConfigLocation: boolean }

// Emmits
const emit = defineEmits(["update:showConfigLocation"])

// Props
const props = defineProps<ActiveProp>()

// Data
let { business, fetchBusiness, updateCoordinates } = useConfigLocation()
const businessRef = ref(business)
const activeStep = ref(0)
const activeClass = ref("js-active position-relative active")
const container = ref<HTMLDivElement | null>(null)

// Computed
const show = ref(props.showConfigLocation)
const steps = computed<IStep[]>(() => [
  {
    title: "Configurar ubicación",
    action: () => {
      activeStep.value += 1
    },
    color: "danger",
    description:
      "Solo el administrador de este dispositivo puede configurar la ubicación.",
    labelButton: "Ingresar",
  },
  {
    title: "Seleccionar ubicación",
    action: () => {
      activeStep.value += 1
    },
    color: "primary",
    description:
      "Selecciona la ubicación en la que se encuentra el dispositivo.",
    labelButton: "Siguiente",
  },
  {
    title: "Confirmar ubicación",
    action: () => {
      updateCoordinates(AppModule.agencyId, AppModule.getZone)
      activeStep.value = 0
      show.value = false
      emit("update:showConfigLocation", false)
    },
    color: "success",
    description: "Confirma que la ubicación seleccionada es correcta.",
    labelButton: "Confirmar",
    actionSecondary: () => {
      navigator.geolocation.getCurrentPosition(
        data => {
          AppModule.setZone({
            lat: data.coords.latitude,
            lng: data.coords.longitude,
          })
        },
        error => {
          console.error(error)
        },
        {
          enableHighAccuracy: true,
        }
      )
    },
    colorSecondary: "primary",
    labelButtonSecondary: "Ubicación actual",
    actionCancel: () => {
      activeStep.value = 0
      show.value = false
      emit("update:showConfigLocation", false)
    },
    colorCancel: "danger",
    labelButtonCancel: "Cancelar",
  },
])

fetchBusiness()

function credentialValidation(value: { userName: string; password: string }) {
  // validate credential value.userName and value.password
  if (value.status === 202) {
    return (activeStep.value += 1)
  }
}

function validateLocation(value: { company: string; agency: string }) {
  // validate data value
  if (value.company !== "" && value.agency !== "" && value.position !== "") {
    return (activeStep.value += 1)
  } else {
    ElMessage({
      message: "Completar todos los campos.",
      type: "error",
    })
  }
}
</script>
<style lang="scss">
.active.current {
  i {
    color: var(--bs-danger);
  }
}
</style>
