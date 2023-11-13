<script setup lang="ts">
import { watchEffect, computed, ref } from "vue"
import QRCodeVue3 from "qrcode-vue3"
import { AgentsModule } from "@/store/modules/Agents"
import * as yup from "yup"
import { ElMessage } from "element-plus"
import type { UserInformation } from "control-risk/userInformation.schema"

const DEFAULT = "https://example.com"
const url = ref(DEFAULT)
// computed
const qrUrl = computed<URL>(() => {
  if (!url.value) return new URL(DEFAULT)
  const parseUrl = new URL(
    AgentsModule.getUserInformation?.certificates ?? url.value
  )
  if (AgentsModule.getAgentOverview?.carnet)
    parseUrl.searchParams.append(
      "carnet",
      AgentsModule.getAgentOverview?.carnet
    )
  return parseUrl
})

watchEffect(() => {
  url.value = new URL(
    AgentsModule.getUserInformation?.certificates ?? DEFAULT
  ).toString()
})

function changeUrl() {
  console.group("**** url ****")
  console.log(url.value)
  console.groupEnd()
  const validator = yup.object().shape({
    url: yup
      .string()
      .url("Ingrese una url válida")
      .required("Ingrese un valor"),
  })
  validator
    .validate({
      url: url.value,
    })
    .then(async valid =>
      AgentsModule.upgradeOverview({
        userInformation: {
          certificates: valid.url,
        } as UserInformation,
      })
    )
    .catch(err =>
      err.errors.forEach((error: any) =>
        ElMessage({
          type: "error",
          message: error,
        })
      )
    )
}
</script>

<template>
  <el-popover
    width="150"
    placement="left"
    trigger="hover"
    popper-style="padding: 0;"
  >
    <template #reference>
      <QRCodeVue3
        :value="qrUrl.toString()"
        class="qr-container"
        imgclass="qr-code"
        :dots-options="{
          type: 'square',
        }"
        :cornersSquareOptions="{ type: 'extra-rounded' }"
      />
    </template>
    <div class="m-0 p-2">
      <small class="fw-bold">Enlace de certificados</small>
      <div class="py-1">
        <el-input v-model="url" placeholder="Ingrese su URL" size="small" />
      </div>
      <!-- <el-button size="small" text @click="visible = false">cancel</el-button> -->
      <div class="d-flex w-100">
        <el-button
          class="ms-auto"
          size="small"
          type="primary"
          @click="changeUrl"
        >
          Guardar
        </el-button>
      </div>
    </div></el-popover
  >
</template>
