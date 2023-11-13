<script lang="ts" setup>
import { ref } from "vue"
import "vue-advanced-cropper/dist/style.css"
import { getMimeType } from "@/utils/utils"
import { Cropper } from "vue-advanced-cropper"
import useModelValue from "@/composables/ModelValueSync"
import { UploadFilled } from "@element-plus/icons-vue"
import { UploadFile, UploadFiles } from "element-plus"

// Props & Emits
const props = defineProps<{
  title: string
  modelValue: boolean
  aspectRatio: number
  onImageSave: (blob: Blob) => void
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
  canvas.toBlob(props.onImageSave, image.value.type)
}
</script>

<template>
  <el-dialog v-model="value" :title="title">
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
      :stencil-props="{ aspectRatio }"
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
