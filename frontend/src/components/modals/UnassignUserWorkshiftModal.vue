<script lang="ts" setup>
import { Field, ModalState, Modals } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { computed, ref } from "vue"
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
const fields = computed<{ [k: string]: Field }>(() => ({}))

const onSubmit = (payload: any) => {
  loading.value = true
  payload.by_user = AuthModule.id
  payload._id = props.state.payload._id
  payload.user = props.state.payload.user
  payload.agency = props.state.payload.agency
  payload.type = "unassignment"
  console.log(payload)
  if (props.state.payload.user) {
    const route = "workshifts/workdays"
    ApiGateway.put(route, payload)
      .then(response => {
        console.log(response.data)
        if (response.data.status) {
          emits("changeModal", { show: false })
          TablesModule.setReload(true)
          ElMessage({
            message: `Se ha desasignado correctamente al agente de la posición!!!`,
            type: "success",
          })
        }
      })
      .catch(() => {
        ElMessage({
          message: `No se ha podido desasignar correctamente!!!`,
          type: "error",
        })
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    ElMessage({
      message: `No se puede desasignar un turno vacante!!!`,
      type: "error",
    })
  }
  loading.value = false
}
</script>
<template>
  <form-modal
    :show="state.show"
    title="Desasignar agente"
    modal-name="formUnassignWorkshiftAgentModal"
    column-classes="col-sm-6 col-md-6 col-12"
    :loading="loading"
    :inputs="fields"
    @change-modal="(p: any) => emits('changeModal', p.payload)"
    @submit="onSubmit"
  >
    <div>
      ¿Está seguro de desasignar el agente del turno? Al realizar esta acción el
      turno queda vacante.
    </div>
  </form-modal>
</template>
<style>
.custom-el-tag {
  min-width: 220px;
}
.full-width {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
