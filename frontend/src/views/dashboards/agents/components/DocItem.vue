<script setup lang="ts">
import { Form } from "vee-validate"
import ArgonInput from "@/components/ArgonInput.vue"
import Select from "@/components/SelectControlled.vue"
import { Field, SelectProps } from "@/types/components.d"
import { generateDynamicSchema } from "@/schemas/form-generator"
import { ref, computed, onMounted, h } from "vue"
import ArgonDatePicker from "@/components/ArgonDatePicker.vue"
import {
  getDateOrUndefined,
  getFileOrUndefined,
  getUrlBackend,
  handleRequests,
} from "@/utils/utils"
import ArgonUpload, {
  ArgonUploadProps as UploadProps,
} from "@/components/ArgonUpload.vue"
import { AgentsModule } from "@/store/modules/Agents"
import { IndexType } from "@/types/app"
import api from "@/store/api"
import { ElMessage } from "element-plus"

const form = ref<{ [k: string]: Field }>({})

// types
type FormPayload = {
  [k: string]: any
}

// props
const props = defineProps<{
  inputs: { [k: string]: Field }
  updateUser: boolean
  category: string
}>()

// form
const formRef = ref<typeof Form | null>(null)
// state
const state = ref<FormPayload>({})
const loading = ref(false)

// computeds
const formState = computed(() => state.value)
const fields = computed(() => props.inputs)

// Methods
function getComponent(type: Field["type"]) {
  switch (type) {
    case "options":
      return Select
    case "file":
      return ArgonUpload
    case "text":
      return ArgonInput
    default:
      return ArgonDatePicker
  }
}

function getProps(input: Field, updt: { [k: string]: any }) {
  switch (input.type) {
    case "options":
      return {
        value: input.value,
        label: input.label,
        placeholder: input.placeholder,
        name: input.name,
        parent: input.remote
          ? undefined
          : input.depends_on?.name
          ? updt[input.depends_on.name]
            ? updt[input.depends_on.name]
            : null
          : undefined,
        remote: input.remote,
        fetch: input.url,
        query_param: input.query_param,
        options: input.staticOptions,
        inputGroupClasses: "input-group",
        select: e => {
          state.value = {
            ...state.value,
            [input.name]: Array.isArray(e) ? e.join(",") : e,
          }
        },
        selectOptions: {
          noDataText: "Sin coincidencias",
          size: "small",
          valueKey: input.options?.key ?? "",
          labelKey: input.options?.label ?? "",
        },
        params: input.depends_on
          ? {
              [input.depends_on.query_param]:
                updt[input.depends_on.name]?.[input.options?.key ?? ""],
            }
          : undefined,
      } as SelectProps
    case "file":
      return {
        onExceed: input.onExceed,
        onChange: input.onChange,
        limit: input.limit,
        autoUpload: input.autoUpload,
        accept: ".pdf",
        defaultValue: getFileOrUndefined(input.value as any),
        tip: "Solamente puede adjuntar un archivo PDF",
        indication: "Subir Certificación",
        url: getUrlBackend(
          `./public/${props.category}/${AgentsModule.getAgentOverview?.carnet}.pdf`
        ),
      } as UploadProps
    case "text":
      return input
    default:
      return {
        type: input.type,
        "default-value": getDateOrUndefined(input.value as string),
        label: input.label,
        classPicker: input.classPicker,
        classParent: input.classParent,
        format: input.format,
      }
  }
}
async function onSubmit(params: IndexType<any>) {
  loading.value = true
  // consts
  const carnet = AgentsModule.getAgentOverview?.carnet
  const fileName = carnet + ".pdf"
  const inputFile = Object.values(props.inputs).find(val => val.type === "file")
  //form data
  if (inputFile) {
    const form = new FormData()
    form.append("name", fileName)
    form.append("path", props.category)
    if (inputFile) form.append("file", params[inputFile.name][0].raw)
    // fetchs
    const { reply, success } = await handleRequests(
      api.post<{ saved: boolean }>("/assets/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      { hideAlert: true }
    )
    loading.value = false
    if (!success)
      return ElMessage({
        message: "No se pudo subir el archivo",
        showClose: true,
        type: "error",
      })
    params[inputFile.name] = undefined
  }
  // Update Fields
  await AgentsModule.setDoc({
    file: `./${props.category}/${fileName}`,
    name: props.category,
    type: props.category,
    data: !props.updateUser ? params : undefined,
  })
  if (props.updateUser) await AgentsModule.updateUserInformation(params)
  ElMessage({
    message: "La información se ha actualizado exitosamente!",
    showClose: true,
    type: "success",
  })
  loading.value = false
}
onMounted(() => {
  form.value = fields.value
})
</script>
<template>
  <Form
    class="w-100 m-0 p-0 d-flex flex-wrap"
    ref="formRef"
    :validation-schema="generateDynamicSchema(Object.values(fields))"
    @submit="(e:any) => onSubmit(e)"
  >
    <template v-for="(input, index) in form">
      <component
        :is="getComponent(input.type)"
        v-bind="getProps(input, formState)"
        :class="{
          'upload-control w-100': input.type === 'file',
          ...(input.className ? { [input.className]: true } : {}),
        }"
        :name="input.name"
        :type="input.type"
        :label="input.label"
        :placeholder="input.placeholder"
        small-label
      >
      </component>
    </template>
    <div class="d-flex w-100">
      <el-button
        type="primary"
        native-type="submit"
        class="ms-auto"
        size="small"
        :loading="loading"
      >
        Guardar
      </el-button>
    </div>
  </Form>
</template>
<style>
.upload-control .el-upload {
  width: 100%;
}
</style>
