<script lang="ts" setup>
import { Field, ModalState, Modals } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { onMounted, ref } from "vue"
import { AuthModule } from "@/store/modules/Auth"
import { TablesModule } from "@/store/table/Table"

// props
const props = defineProps<{ state: ModalState }>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

// state
const loading = ref(false)

const fields: { [k: string]: Field } = {
  news_type: {
    label: "Asunto",
    type: "options",
    placeholder: "Seleccione el tipo de novedad que reporta",
    name: "news_type",
    url: "news/types",
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  description: {
    label: "Observacion",
    type: "textarea",
    placeholder: "Detalle alguna observacion de la novedad",
    name: "description",
    validate: {
      required: "Este campo es obligatorio",
    },
    value: "",
  },
  schedule: {
    label: "Horario del suceso",
    type: "text",
    placeholder: "Detalle el horario de la novedad en formato 24:00HH",
    name: "schedule",
    validate: {
      required: "Este campo es obligatorio",
      regex: [
        /^(?:[01]\d|2[0-3]):[0-5]\d$/,
        "El horario debe estar en formato de 24:00HH (por ejemplo, 08:30)",
      ],
    },
  },
}
onMounted(() => {
  if (props.state.isEdit) {
    /** cargo los valores para el edit */

    Object.keys(props.state.payload).map(key => {
      const validateKeys = Object.keys(fields)
      if (validateKeys.includes(key)) {
        if (fields[key].type == "checkbox") {
          fields[key].checked = props.state.payload[key]
        } else {
          fields[key].value = props.state.payload[key]
        }
      }
      console.log(fields["description"].value, props.state.payload.description)
    })
  }
})

const onSubmit = (payload: any) => {
  loading.value = true
  const route = "/news"
  payload.user_id = AuthModule.id
  payload.is_new = true
  payload.date = new Date().toISOString()
  ApiGateway.post(route, payload)
    .then(response => {
      if (response.data._id) {
        emits("changeModal", { show: false })
        TablesModule.setReload(true)
        ElMessage({
          message: `Se ha creado correctamente!!!`,
          type: "success",
        })
      }
    })
    .catch(error => {
      ElMessage({
        message: "No se pudo crear correctamente!!",
        type: "error",
      })
    })
    .finally(() => {
      loading.value = false
    })
}
const onEdit = (payload: any) => {
  loading.value = true
  payload._id = props.state.payload._id
  const route = `news/${payload._id}`
  payload.user_id = AuthModule.id

  ApiGateway.put(route, payload)
    .then(response => {
      if (response.data.modifiedCount == 1) {
        emits("changeModal", { show: false })
        TablesModule.setReload(true)
        ElMessage({
          message: `Se ha editado correctamente!!!`,
          type: "success",
        })
      }
    })
    .catch(() => {
      ElMessage({
        message: `No se ha podido editar correctamente!!!`,
        type: "error",
      })
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSubmit = (payload: any) => {
  if (props.state.isEdit) {
    onEdit(payload)
  } else {
    onSubmit(payload)
  }
}
</script>
<template>
  <form-modal
    :show="state.show"
    :title="props.state.isEdit ? 'Editar novedad' : 'Nueva novedad'"
    modal-name="formNewsModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="fields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="handleSubmit"
  />
</template>
