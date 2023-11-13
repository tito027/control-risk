<script lang="ts" setup>
import { Field, ModalState } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage } from "element-plus"
import { onMounted, ref } from "vue"
import { FormModule } from "@/store/modules/FormModule"
import { reactive } from "vue"

// props
const props = defineProps<{ show: boolean }>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

// state
const loading = ref(false)
const title = ref("Agregar Agencia")
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
  zone: {
    label: "Zona",
    type: "text",
    placeholder: "Digite la zona a la que pertenece la agencia",
    name: "zone",
    validate: {
      required: "Este campo es obligatorio",
      min: 3,
    },
    value: "",
  },
  business: {
    label: "Empresa",
    type: "options",
    placeholder: "Seleccione la empresa a la que pertenece la agencia",
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
}

const reactiveFields = reactive(fields)

onMounted(async () => {
  // obtenemos los datos del formulario si estamos en modo editar
  if (FormModule.getType === "edit") {
    title.value = "Editar Agencia"
    buttonText.value = "Actualizar"

    loading.value = true
    ApiGateway.get(`${FormModule.getEndpoint}/${FormModule.getId}`).then(response => {
      reactiveFields.name.value = response.data.name
      reactiveFields.zone.value = response.data.zone
      reactiveFields.business.value = response.data.business
    }).catch(() => {
      ElMessage({
        message: `No se ha podido obtener la información de la empresa!!!`,
        type: "error",
      })
    }).finally(() => {
      loading.value = false
    })
  }

  if(FormModule.getData.business) {
    reactiveFields.business.value = FormModule.getData.business
    reactiveFields.business.disabled = true
  }
})

function onSubmit(e: any) {
  loading.value = true
  if (FormModule.getType === "edit") {
    ApiGateway.put(`/agencies/update/${FormModule.getId}`, e).then(response => {
      if (response.data._id) {
        emits("changeModal", { show: false })
        FormModule.setUpdateData()
        ElMessage({
          message: `Se ha editado la agencia ${e.name} correctamente!!!`,
          type: "success",
        })
      }
    }).catch(ex => {
      console.log(ex)
      ElMessage({
        message: `No se ha podido editar la empresa ${e.name} correctamente!!!`,
        type: "error",
      })
    }).finally(() => {
      loading.value = false
    })
    return
  }

  ApiGateway.post("/agencies/create", e)
    .then(response => {
      if (response.data._id) {
        emits("changeModal", { show: false })
        FormModule.setUpdateData()
        ElMessage({
          message: `Se ha creado la agencia ${e.name} correctamente!!!`,
          type: "success",
        })
      }
    })
    .catch(() => {
      ElMessage({
        message: `No se ha podido crear la agencia ${e.name} correctamente!!!`,
        type: "error",
      })
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
<template>
  <form-modal
    :show="show"
    :title="title"
    :submit-button-text="buttonText"
    modal-name="formAgencyConfigModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="reactiveFields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmit"
  />
</template>
