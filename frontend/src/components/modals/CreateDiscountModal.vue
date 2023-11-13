<script lang="ts" setup>
import { Field, ModalState, Modals } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { ref } from "vue"
import { AuthModule } from "@/store/modules/Auth"
import { GuardRoles } from "@/types/router"
import { TablesModule } from "@/store/table/Table"

// props
const props = defineProps<{ show: boolean }>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

// state
const loading = ref(false)

const fields: { [k: string]: Field } = {
  agents: {
    label: "Agente",
    type: "options",
    placeholder: "Seleccione un agente",
    name: "user",
    url: "payrolls/modals/users",
    options: {
      key: "value",
      label: "label",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  discount_types: {
    label: "Descuentos",
    type: "options",
    placeholder: "Seleccione un descuento",
    name: "discount_type",
    url: "payrolls/discounts/modals/types?is_scheduled=false",
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  value: {
    label: "Valor del descuento",
    type: "text",
    placeholder: "Digite un valor de descuento",
    name: "value",
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
}

const onSubmitCreateDiscount = (payload: any) => {
  loading.value = true
  const role: any = AuthModule.role
  /* si no es admin queda pendiente a revisión */
  payload.is_pending = ![GuardRoles.ADMIN].includes(role)
  payload.by_user = AuthModule.id
  payload.is_rejected = false
  const route = "payrolls/discounts/modals/assign"
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
    .catch(() => {
      ElMessage({
        message: `No se ha podido crear correctamente!!!`,
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
    title="Asignar descuento"
    modal-name="formAssignDiscountModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="fields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmitCreateDiscount"
  />
</template>
