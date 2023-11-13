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

const onSubmitApprovePayroll = (payload: any) => {
  loading.value = true
  payload._id = props.state.payload._id
  const route = `requests/${payload._id}`
  payload.user = props.state.payload.user
  payload.change_by = AuthModule.id

  payload.is_pending = false
  payload.is_rejected = false
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
    title="¿Está seguro de aprobar la planilla actual? 
	  Al aprobar una planilla ya no se pueden hacer modificaciones y pasa al historial!"
    modal-name="formApproveHolidayModal"
    column-classes="col-sm-6 col-sm-6 col-12"
    :inputs="fields"
    :loading="loading"
    submitButtonText="Aprobar"
    submitButtonColor="success"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmitApprovePayroll"
  />
</template>
