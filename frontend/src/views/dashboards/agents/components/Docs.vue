<script setup lang="ts">
import { ref } from "vue"
import { ElMessage, genFileId, UploadUserFile } from "element-plus"
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus"
import Ansp from "./docs/ansp.vue"
import WeaponLicense from "./docs/weaponLicense.vue"
import DataDocsComposables from "@/composables/DataDocsComposables"
import FormItem from "./FormItem.vue"
import CapacitationsUU from "./CapacitationsUU.vue"
import CapacitationsRrhh from "./CapacitationsRRHH.vue"
import CapacitationsOperations from "./CapacitationsOperations.vue"

const upload = ref<UploadInstance>()
const files = ref<UploadUserFile[]>([])

const activeName = ref<string | undefined>()
const { items, docs } = DataDocsComposables()

// Methods
const handleChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  if (uploadFile.raw?.type.indexOf("pdf") === -1) {
    setTimeout(() => (files.value = []))
    return ElMessage({
      type: "error",
      message: "Solamente puede subir archivos PDF",
    })
  }
  files.value.push(uploadFile)
  // fileList.value = fileList.value.slice(-3)
}
const handleExceed: UploadProps["onExceed"] = files => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}
</script>
<template>
  <p class="text-sm">
    Este es un listado de los documentos necesarios para el agente
  </p>
  <el-tabs model-value="first" class="demo-tabs">
    <el-tab-pane label="Copias de archivos" name="first">
      <el-scrollbar max-height="400px">
        <div class="card-body pt-0 files-list">
          <el-collapse v-model="activeName" accordion class="m-0">
            <ansp :docs="docs" />
          </el-collapse>
          <hr class="horizontal dark my-2" />
          <el-collapse accordion>
            <weapon-license :docs="docs" />
          </el-collapse>
          <hr class="horizontal dark my-2" />
          <template v-for="item in items">
            <el-collapse accordion>
              <form-item v-bind="item" :docs="docs" />
            </el-collapse>
            <hr class="horizontal dark my-2" />
          </template>
        </div>
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane label="Capacitaciones" name="second">
      <el-scrollbar max-height="400px">
        <capacitations-u-u />
        <capacitations-rrhh />
        <capacitations-operations />
      </el-scrollbar>
    </el-tab-pane>
  </el-tabs>
</template>
<style>
.btn-upload {
  background-color: white;
  color: var(--primary);
  border-style: dashed;
}
.files-list .el-collapse-item__header,
.files-list .el-collapse {
  border: 0;
}
</style>
