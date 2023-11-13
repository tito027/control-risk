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
  contactPhone: {
    label: "Número de contacto",
    type: "text",
    placeholder: "Detalle alguna observacion de la novedad",
    name: "contactPhone",
    validate: {
      required: "Este campo es obligatorio",
      regex: [
        /^(?:\+?503)?[67]\d{7}$/,
        'El nùmero de contacto debe tener el formato  "+503XXXXXXXX" o "6XXXXXXXX". El prefijo de país opcional, ',
      ],
    },
    value: "",
  },
  contactName: {
    label: "Nombre del contacto",
    type: "text",
    placeholder: "Detalle el nombre del contacto",
    name: "contactName",
    validate: {
      required: "Este campo es obligatorio",
    },
    value: "",
  },
  contactEmail: {
    label: "Email del contacto",
    type: "text",
    placeholder: "Detalle el email del contacto",
    name: "contactEmail",
    validate: {
      regex: [
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        "El formato del mail es incorrecto",
      ],
    },
  },
}
onMounted(() => {
  console.log("modal create business contact", props.state)
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
    })
  }
})

const onSubmit = (payload: any) => {
  loading.value = true
  const route = `business/contacts/${props.state.payload._id}`
  payload.user_id = AuthModule.id

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
  const route = `business/contacts/${payload._id}`
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
    title="Contacto"
    modal-name="formBusinessContactModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="fields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="handleSubmit"
  />
</template>
