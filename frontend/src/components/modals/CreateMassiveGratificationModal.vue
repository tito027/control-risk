<script lang="ts" setup>
import { Field, ModalState, Modals, MassivePayload } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { ref } from "vue"
import { AuthModule } from "@/store/modules/Auth"
import { GuardRoles } from "@/types/router"
import { TablesModule } from "@/store/table/Table"
import * as yup from "yup"

// props
const props = defineProps<{ show: boolean }>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

// state
const loading = ref(false)

const fields: { [k: string]: Field } = {
  filter: {
    label: "Filtros",
    type: "options",
    placeholder: "Puede filtrar por",
    name: "filter",
    staticOptions: [
      {
        value: "Empresas",
        label: "Empresas",
      },
      {
        value: "Roles",
        label: "Roles",
      },
      {
        value: "Zonas",
        label: "Zonas",
      },
    ],
    options: { label: "label", key: "value" },
    validate: {
      required: "Este campo es obligatorio",
    },
    value: "",
  },
  // este se muestra si se selecciona una empresa y debería filtrar por business seleccionadas
  agents_business: {
    label: "Agentes",
    type: "multioptions",
    placeholder: "Seleccione agentes",
    name: "users",
    url: "payrolls/modals/users/group/business",
    cascaderOptions: {
      label: "label",
      value: "value",
      multiple: true,
      children: "children",
    },
    hidden: { filter: "Empresas" },
    validate: {
      when: [
        "filter",
        {
          is: "Empresas",
          then: yup.array().required("Este campo es obligatorio"),
          otherwise: yup.array().nullable(),
        },
      ],
    },
  },
  // este se muestra si se selecciona un rol y debería filtrar por roles seleccionadas
  agents_roles: {
    label: "Agentes",
    type: "multioptions",
    placeholder: "Seleccione agentes",
    name: "users_roles",
    url: "payrolls/modals/users/group/roles",
    cascaderOptions: {
      label: "label",
      value: "value",
      multiple: true,
      children: "children",
    },
    hidden: { filter: "Roles" },
    validate: {
      when: [
        "filter",
        {
          is: "Roles",
          then: yup.array().required("Este campo es obligatorio"),
          otherwise: yup.array().nullable(),
        },
      ],
    },
  },

  // este se muestra si se selecciona un rol y debería filtrar por roles seleccionadas
  agents_zones: {
    label: "Agentes",
    type: "multioptions",
    placeholder: "Seleccione agentes",
    name: "users_zones",
    url: "payrolls/modals/users/group/zones",
    cascaderOptions: {
      label: "label",
      value: "value",
      multiple: true,
      children: "children",
    },
    hidden: { filter: "Zonas" },
    validate: {
      when: [
        "filter",
        {
          is: "Zonas",
          then: yup.array().required("Este campo es obligatorio"),
          otherwise: yup.array().nullable(),
        },
      ],
    },
  },
  gratification_types: {
    label: "Gratificantes",
    type: "options",
    placeholder: "Seleccione un gratificante",
    name: "gratification_type",
    url: "payrolls/gratifications/modals/types?is_scheduled=false",
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  description: {
    label: "Descripción",
    type: "text",
    placeholder: "Digite una descripción",
    name: "description",
  },
  value: {
    label: "Valor del gratificante",
    type: "text",
    placeholder: "Digite un valor de gratificante",
    name: "value",
    validate: {
      required: "Este campo es obligatorio",
    },
  },
}

const onSubmitMasiveCreateGratification = (payload: any) => {
  loading.value = true
  const role: any = AuthModule.role
  /* si no es admin queda pendiente a revisión */
  payload.is_pending = ![GuardRoles.ADMIN].includes(role)
  payload.by_user = AuthModule.id
  payload.is_rejected = false
  const {
    users_roles,
    users_zones,
    users_business,
  }: {
    users_roles: string[][]
    users_zones: string[][]
    users_business: string[][]
  } = payload
  const users = !!users_roles
    ? users_roles.map(user => user[2])
    : !!users_zones
    ? users_zones.map(user => user[2])
    : !!users_business
    ? users_business.map(user => user[3])
    : []
  const route = "payrolls/gratifications/modals/massive/assign"

  const body = { ...payload, users: users }

  ApiGateway.post(route, body)
    .then(response => {
      if (response.data.status) {
        emits("changeModal", { show: false })
        TablesModule.setReload(true)
        ElMessage({
          message: `Se han creado correctamente!!!`,
          type: "success",
        })
      }
    })
    .catch(() => {
      ElMessage({
        message: `No se han podido crear correctamente!!!`,
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
    title="Asignación masiva de gratificantes"
    modal-name="formCreateMasiveGratificationModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="fields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmitMasiveCreateGratification"
  />
</template>
