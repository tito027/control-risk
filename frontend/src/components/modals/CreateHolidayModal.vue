<script lang="ts" setup>
import { Field, ModalState, Modals } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { onMounted, ref } from "vue"
import { AuthModule } from "@/store/modules/Auth"
import { TablesModule } from "@/store/table/Table"
import { GuardRoles } from "@/types/router"
import * as yup from "yup"

// props
const props = defineProps<{ state: ModalState }>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

// state
const loading = ref(false)
const isAgent = ref(false)
const role: any = AuthModule.user?.role

const fields: { [k: string]: Field } = {
  type: {
    label: "Tipo de solicitud",
    type: "options",
    placeholder: "Seleccione un tipo",
    name: "type",
    staticOptions: [
      {
        value: "holidays",
        label: "Solicitud vacaciones",
      },
      {
        value: "permissions",
        label: "Solicitud de permisos",
      },
      {
        value: "psychological_assistance",
        label: "Asistencia psicológica",
      },
      {
        value: "legal_assistance",
        label: "Asistencia legal",
      },
      {
        value: "assistance_social_aid",
        label: "Asistencia ayuda social",
      },
    ],
    options: { label: "label", key: "value" },
    validate: {
      required: "Este campo es requerido",
    },
  },
  // VACACIONES
  init_date: {
    label: "Fecha inicio",
    type: "date",
    placeholder: "Seleccione una fecha de inicio",
    name: "init_date",
    classPicker: "w-100 mt-1",
    classParent: "form-group w-100 px-1",
    format: "DD/MM/YYYY",
    hidden: { type: "holidays" },
    /*validate: {
      when: [
        "type",
        {
          is: "holidays",
          then: yup.date().required("Este campo es obligatorio"),
          otherwise: yup.date().nullable(),
        },
      ],
    },*/
  },
  end_date: {
    label: "Fecha fin",
    type: "date",
    placeholder: "Seleccione una fecha de fin",
    classPicker: "w-100 mt-1",
    classParent: "form-group w-100 px-1",
    format: "DD/MM/YYYY",
    name: "end_date",
    hidden: { type: "holidays" },
    /*validate: {
      when: [
        "type",
        {
          is: "holidays",
          then: yup.date().required("Este campo es obligatorio"),
          otherwise: yup.date().nullable(),
        },
      ],
    },*/
  },
  // PERMISOS
  permission_type: {
    label: "Tipo de permiso",
    type: "options",
    placeholder: "Seleccione un tipo",
    name: "permission_type",
    staticOptions: [
      {
        value: "vacaciones",
        label: "Solicitud vacaciones",
      },
      {
        value: "permisos",
        label: "Solicitud de permisos",
      },
      {
        value: "asistencia_psicologica",
        label: "Asistencia psicológica",
      },
      {
        value: "asistencia_legal",
        label: "Asistencia legal",
      },
    ],
    options: { label: "label", key: "value" },
    hidden: { type: "permissions" },
    validate: {
      when: [
        "type",
        {
          is: "permissions",
          then: yup.string().required("Este campo es obligatorio"),
          otherwise: yup.string().nullable(),
        },
      ],
    },
  },
  date: {
    label: "Fecha",
    type: "date",
    placeholder: "Seleccione una fecha",
    name: "date",
    classPicker: "w-100 mt-1",
    classParent: "form-group w-100 px-1",
    format: "DD/MM/YYYY",
    hidden: { type: "permissions" },
    /*validate: {
      when: [
        "type",
        {
          is: "permissions",
          then: yup.date().required("Este campo es obligatorio"),
          otherwise: yup.date().nullable(),
        },
      ],
    },*/
  },
  // ASIST PSICO
  psico_assist_type: {
    label: "Tipo de asistencia",
    type: "options",
    placeholder: "Seleccione un tipo",
    name: "psico_assist_type",
    staticOptions: [
      {
        value: "personal",
        label: "Personal",
      },
      {
        value: "nucleo_familiar",
        label: "Nucleo familiar",
      },
    ],
    options: { label: "label", key: "value" },
    hidden: { type: "psychological_assistance" },
    validate: {
      when: [
        "type",
        {
          is: "psychological_assistance",
          then: yup.string().required("Este campo es obligatorio"),
          otherwise: yup.string().nullable(),
        },
      ],
    },
  },
  // ALL
  observations: {
    label: "Observacion",
    type: "textarea",
    placeholder: "Detalle alguna observacion de la planilla",
    name: "observations",
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  user: {
    label: "Agente",
    type: "options",
    placeholder: "Seleccione un agente",
    name: "user",
    url: `payrolls/modals/users?role=${role._id}&user=${AuthModule.id}`,
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
  },
}
onMounted(() => {
  if (props.state.isEdit) {
    /** cargo los valores para el edit */
    Object.keys(props.state.payload).map(key => {
      const validateKeys = Object.keys(fields)
      //fields["type"].value = props.state.payload["type"]
      if (validateKeys.includes(key)) {
        if (fields[key].type == "checkbox") {
          fields[key].checked = props.state.payload[key]
        } else {
          fields[key].value = props.state.payload[key]
        }
      }
    })
  } else {
    isAgent.value = GuardRoles.SECURITY_AGENT === AuthModule.role
    if (isAgent.value) {
      delete fields["user"]
    }
  }
})

const getBody = (type: string, payload: any) => {
  let body: any = {
    observations: payload.observations,
    by_user: AuthModule.id,
    user: isAgent.value ? AuthModule.id : payload.user,
    type: payload.type,
  }
  switch (type) {
    case "holidays":
      body.init_date = payload.init_date
      body.end_date = payload.end_date
      break
    case "permissions":
      body.init_date = payload.date
      body.end_date = payload.date
      body.permission_type = payload.permission_type
      break
    case "psychological_assistance":
      body.psico_assist_type = payload.psico_assist_type
      break
    default:
      break
  }

  return body
}

const onSubmit = (payload: any) => {
  loading.value = true

  const route = "requests/create"
  const body = getBody(payload.type, payload)
  ApiGateway.post(route, body)
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
  const route = `requests/${payload._id}`

  ApiGateway.put(route, payload)
    .then(response => {
      if (response.data._id) {
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
    title="Solicitud nueva"
    modal-name="formCreatePayrollModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="fields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="handleSubmit"
  />
</template>
