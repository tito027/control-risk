<script setup lang="ts">
import Navbar from "@/layout/Navbar/index.vue"
import { QrcodeStream } from "qrcode-reader-vue3"
import AppFooter from "@/examples/PageLayout/Footer.vue"
import ArgonButton from "@/components/ArgonButton.vue"
import { AppModule } from "@/store/modules/App"
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue"
import ConfigLocation from "@/components/configlocation/ConfigLocation.vue"
import Wizard from "@/components/checkin/Wizard.vue"
import Settings from "@/components/Icons/Settings.vue"
import api from "@/store/api"
import { ElMessage } from "element-plus"
import { useRouter } from "vue-router"
import { handleErrors } from "@/plugins/error"
import ArgonAlert from "@/components/ArgonAlert.vue"
import { AlertModule } from "@/store/modules/Alert"
import { CheckioModule, CheckPayload } from "@/store/modules/CheckInOut"

onMounted(() => {
  AppModule.setHideConfigButton(true)
  AppModule.toggleDefaultLayout()
})
onBeforeUnmount(() => {
  AppModule.setHideConfigButton(false)
  AppModule.toggleDefaultLayout()
})

const router = useRouter()
const showConfigLocation = ref(false)
const loading = ref(false)
const model = reactive({
  scan: false,
  snackbar: null,
  scanResult: "",
  code: "SY29781",
  loading: false,
  error: "",
})

const alerts = computed(() => AlertModule.alerts)

const onDecode = async (decodedString: string) => {
  // model.scanResult = decodedString
  if (model.loading) return
  loading.value = true
  const url = new URL(decodedString)
  if (!url.searchParams.get("carnet"))
    return ElMessage({
      type: "error",
      message: "El QR presentado no pertenece a la Compañía",
    })
  model.scanResult = url.searchParams.get("carnet") ?? ""

  navigator.geolocation.getCurrentPosition(
    async pos => {
      try {
        const response = await api.post<CheckPayload>("check-in-out/try", {
          user: model.scanResult,
          physicalPosition: AppModule.physicalPosition,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
        if (typeof response.data === "object") {
          model.scan = false
          // Resetea checkin preload
          AlertModule.set([])
          CheckioModule.setCoords(pos.coords)
          CheckioModule.setCheckIn(response.data)
          router.push("/authentication/checkin/confirm")
        } else {
          ElMessage({
            message: "Carnet inválido, recargue e intente de nuevo",
            type: "error",
          })
        }
      } catch (error) {
        handleErrors(error)
      } finally {
        loading.value = false
      }
    },
    error => {
      console.error(error, "error")
    },
    {
      enableHighAccuracy: true,
    }
  )
}
const onInit = async (promise: any) => {
  model.loading = true

  try {
    const response = await promise

    console.log("response: ", response)
  } catch (error: any) {
    if (error.name === "NotAllowedError") {
      model.error = "ERROR: you need to grant camera access permission"
    } else if (error.name === "NotFoundError") {
      model.error = "ERROR: no camera on this device"
    } else if (error.name === "NotSupportedError") {
      model.error = "ERROR: secure context required (HTTPS, localhost)"
    } else if (error.name === "NotReadableError") {
      model.error = "ERROR: is the camera already in use?"
    } else if (error.name === "OverconstrainedError") {
      model.error = "ERROR: installed cameras are not suitable"
    } else if (error.name === "StreamApiNotSupportedError") {
      model.error = "ERROR: Stream API is not supported in this browser"
    } else if (error.name === "InsecureContextError") {
      model.error =
        "ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP."
    } else {
      model.error = `ERROR: Camera error (${error.name})`
    }
  } finally {
    model.loading = false
  }
}

/* const onInit = async (promise: any) => {
  model.loading = false

  try {
    const response = await promise
  } catch (error: any) {
    if (error.name === "NotAllowedError") {
      model.error = "ERROR: you need to grant camera access permission"
    } else if (error.name === "NotFoundError") {
      model.error = "ERROR: no camera on this device"
    } else if (error.name === "NotSupportedError") {
      model.error = "ERROR: secure context required (HTTPS, localhost)"
    } else if (error.name === "NotReadableError") {
      model.error = "ERROR: is the camera already in use?"
    } else if (error.name === "OverconstrainedError") {
      model.error = "ERROR: installed cameras are not suitable"
    } else if (error.name === "StreamApiNotSupportedError") {
      model.error = "ERROR: Stream API is not supported in this browser"
    } else if (error.name === "InsecureContextError") {
      model.error =
        "ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP."
    } else {
      model.error = `ERROR: Camera error (${error.name})`
    }
  } finally {
    model.loading = false
  }
} */

const paintOutline = (detectedCodes: any, ctx: any) => {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

    ctx.strokeStyle = "red"

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y)
    }
    ctx.lineTo(firstPoint.x, firstPoint.y)
    ctx.closePath()
    ctx.stroke()
  }
}
function initScan() {
  model.loading = !model.scan
  model.scan = !model.scan
}
</script>
<template>
  <div
    class="d-flex align-items-center justify-content-center top-0 position-sticky z-index-sticky p-0 m-0"
  >
    <div class="row">
      <div class="col-12">
        <navbar
          is-blur="blur border-radius-lg no-border-radius-top start-0 end-0 shadow"
          btn-background="bg-gradient-success"
          dark-mode
          sticky
        >
          <Settings
            @click="() => (showConfigLocation = true)"
            class="d-block me-1 text-dark hoverable"
            size="18px"
          />
        </navbar>
      </div>
    </div>
  </div>
  <wizard />
  <ConfigLocation v-model:showConfigLocation="showConfigLocation" />
  <main class="main-content main-content-bg mt-0">
    <div
      class="page-header min-vh-100 pt-6"
      style="
        background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-basic.jpg');
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-4 col-md-7 mt-2">
            <div class="card border-0 mb-0">
              <div class="card-header bg-transparent pb-0">
                <h5 class="text-dark text-center mt-2">Escaneé su carnet</h5>
              </div>
              <div class="card-body px-lg-5 pt-2">
                <ArgonAlert
                  v-for="(alert, index) in alerts"
                  :key="index"
                  :icon="alert.icon"
                  :color="alert.color"
                  dismissible
                >
                  <span v-html="alert.message"></span>
                </ArgonAlert>
                <div class="text-center pt-0">
                  <qrcode-stream
                    v-if="model.scan"
                    @decode="onDecode"
                    @init="onInit"
                    :track="paintOutline"
                    :camera="'auto'"
                  >
                    <div
                      v-if="model.loading"
                      v-loading="model.loading"
                      element-loading-text="Cargando..."
                      :element-loading-background="`rgba(var(--bs-dark-rgb,.5))`"
                      class="d-flex justify-content-center align-items-center bg-dark w-100 h-100"
                    ></div>
                  </qrcode-stream>
                  <div
                    v-else
                    class="d-flex justify-content-center align-items-center qr-load w-100 vh-50 bg-white"
                  >
                    <div class="d-block text-dark">
                      <i class="display-1 fw-bold fas fa-qrcode" />
                      <p class="fs-6 fw-light">Inicie su cámara primero</p>
                    </div>
                  </div>

                  <!--                   <div
                    v-if="model.loading || loading"
                    v-loading="model.loading || loading"
                    :element-loading-text="
                      model.loading ? 'Cargando...' : 'Enviando...'
                    "
                    :element-loading-background="`rgba(var(--bs-dark-rgb,.5))`"
                    class="d-flex justify-content-center align-items-center bg-dark w-100 vh-50"
                  ></div>
                  <StreamBarcodeReader
                    v-if="model.scan && !loading"
                    @decode="onDecode"
                    @loaded="onInit"
                    :track="paintOutline"
                  >
                  </StreamBarcodeReader> -->
                  <!--                   <div
                    v-else-if="!loading"
                    class="d-flex justify-content-center align-items-center qr-load w-100 vh-50 bg-white"
                  >
                    <div class="d-block text-dark">
                      <i class="display-1 fw-bold fas fa-qrcode" />
                      <p class="fs-6 fw-light">Inicie su cámara primero</p>
                    </div>
                  </div> -->
                  <argon-button
                    :color="model.scan ? 'danger' : 'success'"
                    variant="gradient"
                    full-width
                    class="my-4 mb-2"
                    @click.capture="initScan"
                  >
                    <i class="fas fa-camera me-2" />{{
                      model.scan ? "Desactivar escaneo" : "Escanear"
                    }}
                  </argon-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <app-footer />
</template>
<style lang="scss">
.no-border-radius-bottom {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.no-border-radius-top {
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}
.qr-load {
  border: 10px dashed var(--bs-dark);
}
.el-loading-spinner svg circle.path {
  stroke: var(--bs-white);
}
.el-loading-spinner .el-loading-text {
  color: var(--bs-white);
}
</style>
