<script setup lang="ts">
import { onMounted } from "vue"
import { UploadProps, UploadUserFile } from "element-plus"
import { useField } from "vee-validate"

export interface ArgonUploadProps extends UploadProps {
  tip: string
  indication: string
  defaultValue: UploadUserFile
  url?: string
}

const props = defineProps<{
  onExceed?: UploadProps["onExceed"]
  onChange?: UploadProps["onChange"]
  limit: UploadProps["limit"]
  autoUpload: UploadProps["autoUpload"]
  accept: UploadProps["accept"]
  defaultValue: UploadUserFile
  tip: string
  indication: string
  name: string
  url?: string
}>()

// data
const { value: files, handleChange } = useField<UploadUserFile[]>(
  props.name,
  undefined
)
const onChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  files.value = uploadFiles
}
onMounted(() =>
  props.defaultValue ? (files.value = [props.defaultValue]) : null
)
</script>
<template>
  <div>
    <!-- <input type="hidden" :name="name" /> -->
    <el-upload
      :on-exceed="onExceed"
      :on-change="onChange"
      :limit="limit"
      :name="name"
      :auto-upload="autoUpload"
      :accept="accept"
      v-model:file-list="files"
    >
      <template #trigger>
        <el-button type="default" class="w-100 btn-upload">
          {{ indication }}
        </el-button>
      </template>
      <template #tip>
        <div class="el-upload__tip text-red">
          {{ tip }}
        </div>
      </template>

      <template #file="{ file }">
        <li class="el-upload-list__item is-success" tabindex="0">
          <div class="el-upload-list__item-info">
            <a :href="url" target="_blank" class="el-upload-list__item-name">
              <i class="el-icon el-icon--document">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="currentColor"
                    d="M832 384H576V128H192v768h640V384zm-26.496-64L640 154.496V320h165.504zM160 64h480l256 256v608a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32zm160 448h384v64H320v-64zm0-192h160v64H320v-64zm0 384h384v64H320v-64z"
                  ></path>
                </svg>
              </i>
              <span class="el-upload-list__item-file-name">
                {{ file.name }}
              </span>
            </a>
          </div>
          <label class="el-upload-list__item-status-label"
            ><i class="el-icon el-icon--upload-success el-icon--circle-check"
              ><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="currentColor"
                  d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"
                ></path>
                <path
                  fill="currentColor"
                  d="M745.344 361.344a32 32 0 0 1 45.312 45.312l-288 288a32 32 0 0 1-45.312 0l-160-160a32 32 0 1 1 45.312-45.312L480 626.752l265.344-265.408z"
                ></path></svg></i></label
          ><i class="el-icon el-icon--close"
            ><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="currentColor"
                d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
              ></path>
            </svg>
          </i>
          <i class="el-icon--close-tip"> press delete to remove </i>
        </li>
      </template>
    </el-upload>
  </div>
</template>
