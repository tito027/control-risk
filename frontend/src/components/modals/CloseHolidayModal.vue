<script lang="ts" setup>
import { Field, ModalState, Modals } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { ref } from "vue"
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

const fields: { [k: string]: Field } = {}

const onSubmitClosePayroll = (payload: any) => {
  loading.value = true
  payload._id = props.state.payload._id
  const route = `requests/${payload._id}`
  payload.user = props.state.payload.user
  payload.change_by = AuthModule.id
  payload.is_pending = false
  payload.is_rejected = true
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
</script>
<template>
  <form-modal
    title="¿Está seguro de rechazar la solicitud actual? 
	  Al rechazar una solicitud ya no se pueden hacer modificaciones!"
    modal-name="formCloseHolidayModal"
    column-classes="col-sm-6 col-sm-6 col-12"
    :inputs="fields"
    :loading="loading"
    submitButtonText="Rechazar"
    submitButtonColor="danger"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmitClosePayroll"
  />
</template>
