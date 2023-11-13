<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from "vue"
import "vue-advanced-cropper/dist/style.css"
import { getMimeType, handleRequests } from "@/utils/utils"
import { Cropper } from "vue-advanced-cropper"
import { AgentsModule } from "@/store/modules/Agents"
import useModelValue from "@/composables/ModelValueSync"
import { UploadFilled } from "@element-plus/icons-vue"
import { ElMessage, UploadFile, UploadFiles } from "element-plus"
import api from "@/store/api"

// Props & Emits
const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<{
  (e: "update:modelValue", payload: boolean): void
}>()

// Data
const cropperEl = ref<any>(null)
const { value } = useModelValue(props, "modelValue", emit)
const uploading = ref(false)
const image = ref({
  src: "",
  type: "",
})

// Computed
const agent = computed(() => AgentsModule.getAgentOverview)
/* function onChange(...values: any[]) {
  console.log(values)
} */
function fileChange(uploadFile: UploadFile, files: UploadFiles) {
  // if (uploadFile.status !== "ready") return
  if (image.value.src) URL.revokeObjectURL(image.value.src)
  const blob = URL.createObjectURL(uploadFile.raw as Blob)
  const reader = new FileReader()

  reader.onload = (e: any) => {
    setTimeout(() => {
      image.value = {
        src: blob,
        type: getMimeType(e.target.result, uploadFile.raw?.type ?? null) ?? "",
      }
    }, 100)
  }
  reader.readAsArrayBuffer(uploadFile.raw as Blob)
}
function save() {
  const { canvas } = cropperEl.value.getResult()
  canvas.toBlob((blob: Blob) => {
    const form = new FormData()
    form.append("name", agent.value?.carnet + ".jpg")
    form.append("path", "./carnets")
    form.append("file", blob) // It's important to keep this file always in the end
    handleRequests(
      api.post<{ saved: true }>("/assets/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      {
        hideAlert: true,
        loadingState: uploading,
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
        await AgentsModule.upgradeOverview({ image: true })
        emit("update:modelValue", false)
      })
      .catch(err => {
        console.error(err)
        ElMessage({
          type: "error",
          message: "Algo salió mal por favor contactar con soporte técnico",
        })
      })
  }, image.value.type)
}
/* onUnmounted(() => {
  console.log("unmounted")
}) */
</script>

<template>
  <el-dialog v-model="value" title="Foto de carné">
    <el-upload
      v-if="!image.src"
      class="upload-demo"
      drag
      multiple
      :on-change="fileChange"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>
    <cropper
      v-else
      ref="cropperEl"
      :src="image.src"
      :stencil-props="{ aspectRatio: 58.5 / 73.1 }"
      :default-size="{
        height: 500,
        width: 300,
      }"
      class="cropper-carnet"
    />
    <template #footer v-if="image.src">
      <div class="d-flex w-100 pt-2">
        <el-button
          :loading="uploading"
          class="ms-auto"
          type="primary"
          @click="save"
        >
          Guardar
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style>
.cropper-carnet {
  max-height: 400px;
}
</style>
