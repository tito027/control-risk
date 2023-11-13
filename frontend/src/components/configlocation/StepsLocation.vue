<template>
  <transition
    name="fade"
    :enter-active-class="transition.enter"
    :leave-active-class="transition.leave"
  >
    <div
      v-if="activeStep === index"
      class="d-flex flex-column absolute-animate flex-md-row justify-content-center align-items-center"
    >
      <div class="w-md-50 p-md-3">
        <h4 :class="`d-block text-center text-wrap text-${step.color}`">
          {{ step.title }}
        </h4>
        <p class="">{{ step.description }}</p>
      </div>

      <div v-if="activeStep === 0" class="py-md-4">
        <el-form
          label-position="top"
          label-width="100px"
          :model="form"
          style="max-width: 460px"
        >
          <el-form-item label="Carnet">
            <el-input v-model="form.userName" />
          </el-form-item>
          <el-form-item label="Contraseña">
            <el-input
              v-model="form.password"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item class="">
            <el-button
              class="mx-auto"
              :type="step.color"
              @click="sendCredential"
            >
              {{ step.labelButton }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="activeStep === 1" class="py-md-4">
        <el-form
          label-position="top"
          label-width="100px"
          :model="selects"
          style="max-width: 460px"
        >
          <el-form-item label="Empresa">
            <el-select
              v-model="selects.company"
              placeholder="Seleccione una empresa"
            >
              <el-option
                v-for="company in businessRef.data"
                :key="company._id"
                :label="company.label"
                :value="company.value"
                @click="enable = false"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Agencia">
            <el-select
              v-model="selects.agency"
              :disabled="enable"
              placeholder="Seleccione una agencia"
            >
              <el-option
                v-for="(agency, i) in agencies"
                :key="agency._id"
                :label="agency.name"
                :value="agency._id"
                @click="enablePosition = false"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Ubicación física">
            <el-select
              v-model="selects.position"
              :disabled="enablePosition"
              placeholder="Seleccione ubicación de la agencia"
            >
              <el-option
                v-for="position in physicalPositions"
                :key="position._id"
                :label="position.name"
                :value="position._id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              class="mx-auto"
              :type="step.color"
              @click="sendBusinessAndAgency"
            >
              {{ step.labelButton }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="activeStep === 2" class="py-md-4">
        <GMapMap
          :center="mapInfo.markers[0].position"
          :zoom="15"
          style="width: 500px; height: 300px"
          :options="{
            gestureHandling: 'greedy',
          }"
        >
          <GMapMarker
            :key="index"
            v-for="(m, index) in mapInfo.markers"
            :position="m.position"
            @click="center = m.position"
          />
        </GMapMap>
        <el-button
          class="mt-3"
          :type="step.colorCancel"
          @click="step.actionCancel"
        >
          {{ step.labelButtonCancel }}
        </el-button>
        <el-button
          class="mt-3"
          :type="step.colorSecondary"
          @click="step.actionSecondary"
        >
          {{ step.labelButtonSecondary }}
        </el-button>
        <el-button class="mt-3" :type="step.color" @click="step.action">
          {{ step.labelButton }}
        </el-button>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { Colors } from "@/types/app"
import { AppModule } from "@/store/modules/App"
import { computed, reactive, ref, watch } from "vue"
import { useConfigLocation } from "@/composables/useConfigLocation.js"

// Types
export interface IStep {
  title: string
  color: Colors
  action: () => void
  labelButton: string
  description?: string
  colorSecondary?: Colors
  actionSecondary?: () => void
  labelButtonSecondary?: string
  colorCancel?: Colors
  actionCancel?: () => void
  labelButtonCancel?: string
}

export type StepProps = {
  activeStep: number
  index: number
  step: IStep
  businessRef: Array<any>
}

// Data
let {
  agencies,
  fetchAgencies,
  physicalPositions,
  fetchPhysicalPositions,
  loginData,
  adminLogin,
} = useConfigLocation()

// Refs
const transition = reactive({
  enter: "fadeInRightMini",
  leave: "fadeOutLeftMini",
})
const enable = ref(true)
const enablePosition = ref(true)

const form = reactive({
  userName: "",
  password: "",
})

let selects = reactive({
  company: "",
  agency: "",
  position: "",
  dataCompany: {},
  dataAgency: {},
  dataPosition: {},
})

let zone = reactive({
  lat: 0,
  lng: 0,
})

const mapInfo = computed(() => ({
  center: {
    lat: AppModule.zone.lat,
    lng: AppModule.zone.lng,
  },
  markers: [
    {
      position: {
        lat: AppModule.zone.lat,
        lng: AppModule.zone.lng,
      },
    }, // Along list of clusters
  ],
}))

// Props
const props = defineProps<StepProps>()
watch(
  () => props.activeStep,
  (prev, next) => {
    transition.enter = prev < next ? "fadeInLeftMini" : "fadeInRightMini"
    transition.leave = prev < next ? "fadeOutRightMini" : "fadeOutLeftMini"
  }
)
// watch que ve company de selects
watch(
  () => selects.company,
  async (prev, next) => {
    // llamamos a fetchAgencies y le pasamos el id de la empresa
    await fetchAgencies(prev)

    // Obtenemos toda la data de la empresa seleccionada
    selects.dataCompany = props.businessRef.find(b => b._id === prev)
  }
)
// watch que ve agency de selects
watch(
  () => selects.agency,
  async (prev, next) => {
    // llamamos a función que nos obtiene las posiciones físicas de la agencia seleccionada
    await fetchPhysicalPositions(prev)
    // obtenemos la data de la agencia seleccionada
    selects.dataAgency = agencies.value.find(a => a._id === prev)
    AppModule.setAgency(selects.dataAgency._id)
    AppModule.setZone({
      lat: parseFloat(selects.dataAgency.latitude),
      lng: parseFloat(selects.dataAgency.longitude),
    })
  }
)
// watch que ve position de selects
watch(
  () => selects.position,
  async (prev, next) => {
    // obtenemos la data de la posición física seleccionada
    AppModule.setPhysicalPosition(prev)
    selects.dataPosition = physicalPositions.value.find(p => p._id === prev)
    //obtenemos lat y lng de la posición física, ejemplo de datos: zone: "-71.1917, 47.0724"
  }
)

async function sendCredential() {
  // enviamos credenciales al servidor
  await adminLogin({
    username: form.userName,
    password: form.password,
  })
  // console.log("form", form)
  // Limpiamos usuario y contraseña y enviamos el formulario con emmit
  emit("credentialValidation", loginData.value)
  form.userName = ""
  form.password = ""
}

function sendBusinessAndAgency() {
  // console.log("selects", selects)
  // guardamos la company y agency en localstorage
  localStorage.setItem("data", JSON.stringify(selects))
  // Limpiamos selects y enviamos el formulario con emmit
  emit("validateLocation", selects)
}

// Emmits
const emit = defineEmits(["credentialValidation", "validateLocation"])
</script>
