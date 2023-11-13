<script lang="ts" setup>
import { Field, ModalState, Modals } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { ref } from "vue"
import { AuthModule } from "@/store/modules/Auth"
import { TablesModule } from "@/store/table/Table"

// props
const props = defineProps<{
  show: boolean
  title: string
  fields: { [k: string]: Field }
  type: string
  userSelected: string
  payrollConfig: string
  modalName: Modals
}>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

// state
const loading = ref(false)

const getRouteByType = (type: string) => {
  return type === "DISCOUNTS" ? "/payrolls/discounts/modals" : type === "GRATIFICATIONS" ? "/payrolls/gratifications/modals" : ""
}

const getPayloadByType = (type: string, payrollConfig: string, data: any) => {
  const payload: any = {}
  payload.payroll_config = payrollConfig
  payload.value = data.value
  payload.date = new Date().toISOString()
  payload.by_user = AuthModule.id
  payload.is_pending = false
  payload.rejected = false
  if (type === "GRATIFICATIONS") {
    payload.gratification_type = data.gratification
  } else {
    payload.discount_type = data.discount
  }
  return payload
}

const onSubmit = (e: any) => {
  loading.value = true
  const { type, userSelected, payrollConfig } = props
  const route = getRouteByType(type)
  e.user = userSelected
  const payload = getPayloadByType(type, payrollConfig, e)

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
    :title="title"
    :modal-name="modalName"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="fields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmit"
  />
</template>
