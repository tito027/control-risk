<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card mt-4">
          <div class="card-header p-3">
            <h5 class="mb-0">QR</h5>
            <p class="text-sm mb-0">
              QR Reader
            </p>

          </div>
          <div class="card-body p-3">
            <div class="row">
              <div class="col-12">
                <argon-button color="primary">Escanear</argon-button>
                <qrcode-stream @decode="onDecode" @init="onInit"></qrcode-stream>
                <qrcode-capture @decode="onDecode" class="form-control" />

              </div>
              <div class="col-2">
                <h5>{{ scanResult }}</h5>
              </div>


            </div>
          </div>
        </div>
      </div>
      <div class="col-md-8 mx-auto">
        <div class="card mt-4">
          <div class="card-header p-3">
            <h5 class="mb-0">QR</h5>
            <p class="text-sm mb-0">
              QR Generator
            </p>

          </div>
          <div class="card-body p-3">
            <div class="row">
              <div class="col-12 col-lg-2 d-flex justify-content-center">
                <input class="form-control" v-model="code">
              </div>
              <div class="col-12 col-lg-10 d-flex">
                <QRCodeVue3  :width="300" :height="300" :value="code" :qrOptions="{
                  typeNumber: 0,
                  mode: 'Byte',
                  errorCorrectionLevel: 'H',
                }" :imageOptions="{
                  hideBackgroundDots: true,
                  imageSize: 0.5,
                  margin: 0,
                }" :dotsOptions="{
                  type: 'extra-rounded',
                  color: '#3a3786',
                }" :backgroundOptions="{ color: '#ffffff' }" :cornersSquareOptions="{ type: 'dot', color: '#1f2a5a' }"
                                  :cornersDotOptions="{ type: '', color: '#1f2a5a' }" fileExt="png" :download="false"
                  downloadButton="Descargar" :downloadOptions="{ name: 'Codigo', extension: 'png' }"
                  image="/img/ControlRisk/SmallLogo.png" />
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import ArgonAlert from "@/components/ArgonAlert.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import QRCodeVue3 from "qrcode-vue3";
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "qrcode-reader-vue3";

export default {
  name: "Notifications",
  components: {
    ArgonAlert,
    ArgonInput,
    ArgonButton,
    QRCodeVue3,
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture
  },
  data() {
    return {
      snackbar: null,
      scanResult: "",
      code: "SY29781"
    };
  },
  methods: {
    closeSnackbar() {
      this.snackbar = null;
    },
    onDecode(decodedString) {
      this.scanResult = decodedString;
    },
    async onInit(promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = "ERROR: you need to grant camera access permission"
        } else if (error.name === 'NotFoundError') {
          this.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "ERROR: Stream API is not supported in this browser"
        } else if (error.name === 'InsecureContextError') {
          this.error = 'ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.';
        } else {
          this.error = `ERROR: Camera error (${error.name})`;
        }
      }
    }
  },
};
</script>
