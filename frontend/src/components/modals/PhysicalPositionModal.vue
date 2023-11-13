<script lang="ts" setup>
import { Field, ModalState } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage } from "element-plus"
import { onMounted, ref } from "vue"
import { FormModule, ModalType } from "@/store/modules/FormModule"
import { reactive } from "vue"

// props
const props = defineProps<{ show: boolean }>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

// state
const loading = ref(false)
const title = ref("Agregar Posición Física")
const buttonText = ref("Guardar")

const fields: { [k: string]: Field } = {
  name: {
    label: "Nombre",
    type: "text",
    placeholder: "Digite el nombre de la agencia",
    name: "name",
    validate: {
      required: "Este campo es obligatorio",
      min: 5,
    },
    value: "",
  },
  numSecurityAgent: {
    type: "number",
    name: "numSecurityAgent",
    label: "Número de agentes",
    placeholder: "Ingrese el número de agentes a asignar",
    step: 1,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      integer: "Debes ingresar un número entero",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
    },
    value: "",
  },
  business: {
    label: "Empresa",
    type: "options",
    placeholder: "Seleccione la empresa a la que pertenece la posición",
    name: "business",
    url: "business",
    disabled: false,
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
    value: "",
  },
  agency: {
    label: "Agencia",
    type: "options",
    placeholder: "Seleccione la agencia a la que pertenece la posición",
    name: "agency",
    url: "business/list/agencies",
    disabled: false,
    depends_on: {
        name: "business",
        query_param: "value"
    },
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
    value: "",
  },
}

const reactiveFields = reactive(fields)

onMounted(() => {
  //obtenemos los datos del formulario si estamos en modo editar
  if (FormModule.getType === ModalType.edit) {
    title.value = "Editar Posición Física"
    buttonText.value = "Actualizar"
    loading.value = true
    reactiveFields.name.value = FormModule.getData.name
    reactiveFields.numSecurityAgent.value = FormModule.getData.numSecurityAgent
    reactiveFields.business.value = FormModule.getData.business
    reactiveFields.agency.value = FormModule.getData.agency
    loading.value = false
  }

  if(FormModule.getType === ModalType.create && FormModule.getData.business && FormModule.getData.agency) {
    reactiveFields.business.value = FormModule.getData.business
    reactiveFields.business.disabled = true
    reactiveFields.agency.value = FormModule.getData.agency
    reactiveFields.agency.disabled = true
  }
})

function onSubmit(e: any) {
  loading.value = true
  const { business, ...payload } = e
  if(FormModule.getType === ModalType.edit) {
    ApiGateway.put(`physical-position/update/${FormModule.getId}`, payload).then(response => {
      if (response.data._id) {
        emits("changeModal", { show: false })
        FormModule.setUpdateData()
        ElMessage({
          message: `Se ha actualizado la posición correctamente!!!`,
          type: "success",
        })
     }
    }).catch(() => {
      ElMessage({
        message: `No se ha actualizado la posición correctamente!!!`,
        type: "error",
      })
    }).finally(() => {
      loading.value = false
    })
    return
  }
  ApiGateway.post('physical-position/create', payload).then(response => {
    if (response.data._id) {
      emits("changeModal", { show: false })
      FormModule.setUpdateData()
      ElMessage({
        message: `Se ha creado la posición ${e.name} correctamente!!!`,
        type: "success",
      })
    }
  }).catch(() => {
    ElMessage({
      message: `No se ha creado la posición ${e.name} correctamente!!!`,
      type: "error",
    })
  }).finally(() => {
    loading.value = false
  })
}
</script>
<template>
  <form-modal
    :show="show"
    :title="title"
    :submit-button-text="buttonText"
    modal-name="formPhysicalPositionModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="reactiveFields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmit"
  />
</template>
