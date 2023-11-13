<script lang="ts" setup>
import { Field, ModalState, Modals } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { onMounted, ref } from "vue"
import { AuthModule } from "@/store/modules/Auth"
import { TablesModule } from "@/store/table/Table"
import * as yup from "yup"
import { GuardRoles } from "@/types/router"

// props
const props = defineProps<{ state: ModalState }>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

// state
const loading = ref(false)
const isAgent = ref(false)

const fields: { [k: string]: Field } = {
  to_user: {
    label: "Usuario",
    type: "options",
    placeholder: "Seleccione un usuario",
    name: "to_user",
    url: "payrolls/modals/users",
    options: {
      label: "label",
      key: "value",
    },
    //value: props.state.payload.user_detail
  },
  type: {
    label: "Tipo",
    type: "options",
    placeholder: "Seleccione un tipo",
    name: "type",
    staticOptions: [
      {
        value: "sugerencia",
        label: "Sugerencia",
      },
      {
        value: "denuncia",
        label: "Denuncia",
      },
    ],
    options: { label: "label", key: "value" },
  },
  complaint_type: {
    label: "Asunto",
    type: "options",
    placeholder: "Seleccione un asunto",
    name: "complaint_type",
    staticOptions: [
      {
        value: "robo",
        label: "Robo",
      },
      {
        value: "actividad sospechosa",
        label: "Actividad sospechosa",
      },
      {
        value: "acoso",
        label: "Acoso",
      },
    ],
    hidden: { type: "denuncia" },
    options: { label: "label", key: "value" },
    validate: {
      when: [
        "type",
        {
          is: "denuncia",
          then: yup.string().required("Este campo es obligatorio"),
        },
      ],
    },
  },
  description: {
    label: "Observacion",
    type: "textarea",
    placeholder: "Detalle alguna observacion de la queja",
    name: "description",
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  agent_id: {
    label: "Denunciado",
    type: "options",
    placeholder: "Seleccione",
    name: "agent_id",
    url: "payrolls/modals/users",
    options: {
      label: "label",
      key: "value",
    },
    hidden: { complaint_type: "acoso" },
    validate: {},
  },
}
onMounted(() => {
  if (props.state.isEdit) {
    /** cargo los valores para el edit */
    console.log(props.state.payload)
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
    if (props.state.payload.type == "denuncia") {
      /** agrego los que vienen por default */
      fields["complaint_status"] = {
        label: "Estado",
        type: "options",
        placeholder: "Estados",
        name: "complaint_status",
        url: "complaints/status",
        options: {
          label: "label",
          key: "value",
        },
        value: props.state.payload.complaint_status,
        validate: {},
      }
    }
  } else {
    isAgent.value = GuardRoles.ADMIN /*SECURITY_AGENT*/ === AuthModule.role
    if (isAgent.value) {
      delete fields["to_user"]
    }
  }
})

const onSubmit = (payload: any) => {
  loading.value = true
  const route = "complaints/create"
  payload.user_id = AuthModule.id
  payload.date = new Date().toISOString()
  payload.to_user = isAgent.value ? AuthModule.id : payload.to_user

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
  console.log(payload)
  payload._id = props.state.payload._id
  const route = `complaints/${payload._id}`

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
    title="Nuevo descargo"
    modal-name="formComplaintModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="fields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="handleSubmit"
  />
</template>
