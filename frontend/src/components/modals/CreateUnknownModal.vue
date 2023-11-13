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
        value: "Todos",
        label: "Todos",
      },
      {
        value: "Agencias",
        label: "Agencias",
      },

      {
        value: "Proyecto",
        label: "Proyecto",
      },
    ],
    options: { label: "label", key: "value" },
    validate: {
      required: "Este campo es obligatorio",
    },
    value: "",
  },
  // este se muestra si se selecciona todos y debería mostrar todos los usuarios

  agents: {
    label: "Agentes",
    type: "multioptions",
    placeholder: "Seleccione agentes",
    name: "users_data",
    url: "payrolls/modals/users/group/users",
    cascaderOptions: {
      label: "label",
      value: "value",
      multiple: true,
      children: "children",
    },
    hidden: { filter: "Todos" },
    validate: {
      when: [
        "filter",
        {
          is: "Todos",
          then: yup.array().required("Este campo es obligatorio"),
          otherwise: yup.array().nullable(),
        },
      ],
    },
  },

  // este se muestra si se selecciona una empresa y debería filtrar por business seleccionadas
  agents_business: {
    label: "Agentes",
    type: "multioptions",
    placeholder: "Seleccione agentes",
    name: "users_business",
    url: "payrolls/modals/users/group/carnet/business",
    cascaderOptions: {
      label: "label",
      value: "value",
      multiple: true,
      children: "children",
    },
    hidden: { filter: "Proyecto" },
    validate: {
      when: [
        "filter",
        {
          is: "Proyecto",
          then: yup.array().required("Este campo es obligatorio"),
          otherwise: yup.array().nullable(),
        },
      ],
    },
  },

  // este se muestra si se selecciona un agency y debería filtrar por agency seleccionadas
  agents_agencies: {
    label: "Agentes",
    type: "multioptions",
    placeholder: "Seleccione agentes",
    name: "users_agencies",
    url: "payrolls/modals/users/group/agencies",
    cascaderOptions: {
      label: "label",
      value: "value",
      multiple: true,
      children: "children",
    },
    hidden: { filter: "Agencias" },
    validate: {
      when: [
        "filter",
        {
          is: "Agencias",
          then: yup.array().required("Este campo es obligatorio"),
          otherwise: yup.array().nullable(),
        },
      ],
    },
  },
}

const onSubmitMasiveCreateCarnets = async (payload: any) => {
  loading.value = true
  const role: any = AuthModule.role
  /* si no es admin queda pendiente a revisión */
  payload.is_pending = ![GuardRoles.ADMIN].includes(role)
  payload.by_user = AuthModule.id
  payload.is_rejected = false
  const {
    users_data,
    users_agencies,
    users_business,
  }: {
    users_data: string[]
    users_agencies: string[][]
    users_projects: string[][]
    users_business: string[][]
  } = payload

  let carnets: any = []

  const dataArrays = [users_agencies, users_business, users_data]

  for (const dataArray of dataArrays) {
    if (dataArray) {
      carnets = dataArray.map(
        carnetArray => carnetArray[carnetArray.length - 1]
      )
      break // Detenerse en el primer arreglo no nulo
    }
  }

  const route = `agents/carnets/group`
  // Unir carnets en una cadena
  const body = { ...payload, carnets: carnets }

  try {
    const response = await ApiGateway.get(route)
    if (response.data.status === true) {
      emits("changeModal", { show: false })
      TablesModule.setReload(true)
      ElMessage({
        message: `Se han creado correctamente!!!`,
        type: "success",
      })
    } else {
      throw new Error("Validar que todos los carnet tengan su imagen")
    }
  } catch (error) {
    ElMessage({
      message: `Validar que todos los carnet tengan su imagen`,
      type: "error",
    })
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <form-modal
    :show="show"
    title="Generacion masiva de carnets"
    modal-name="formCreateUnknownModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="fields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmitMasiveCreateCarnets"
  />
</template>
