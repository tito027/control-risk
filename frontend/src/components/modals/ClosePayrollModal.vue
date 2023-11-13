<script lang="ts" setup>
import { Field, ModalState, Modals } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { ref } from "vue"
import { AuthModule } from "@/store/modules/Auth"
import { TablesModule } from "@/store/table/Table"
import { PayrollsModule } from "@/store/modules/Payroll"

// props
const props = defineProps<{ show: boolean }>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

// state
const loading = ref(false)

const fields: { [k: string]: Field } = {}

const onSubmitClosePayroll = (payload: any) => {
  loading.value = true
  const route = "payrolls/close"
  payload.user = AuthModule.id
  payload.payroll = PayrollsModule.CurrentPayroll
  ApiGateway.post(route, payload)
    .then(response => {
      if (response.data._id) {
        emits("changeModal", { show: false })
        TablesModule.setReload(true)
        PayrollsModule.setActivePayroll("")
        ElMessage({
          message: `Se ha cerrado correctamente!!!`,
          type: "success",
        })
      }
    })
    .catch(() => {
      ElMessage({
        message: `No se ha podido cerrar correctamente!!!`,
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
    title="¿Está seguro de cerrar la planilla actual? 
	  Al cerrar una planilla ya no se pueden hacer modificaciones y pasa al historial!"
    modal-name="formClosePayrollModal"
    column-classes="col-sm-6 col-sm-6 col-12"
    :inputs="fields"
    :loading="loading"
    submitButtonText="Cerrar"
    submitButtonColor="danger"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmitClosePayroll"
  />
</template>
