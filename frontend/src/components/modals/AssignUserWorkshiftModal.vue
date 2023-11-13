<script lang="ts" setup>
import { Field, ModalState, Modals } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { computed, ref } from "vue"
import { AuthModule } from "@/store/modules/Auth"
import { TablesModule } from "@/store/table/Table"
import * as yup from "yup"

// props
const props = defineProps<{ state: ModalState }>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

// state
const loading = ref(false)
const schedules = ref([])
const fields = computed<{ [k: string]: Field }>(() => ({
  user: {
    label: "Agente",
    type: "options",
    placeholder: "Seleccione agentes",
    name: "user",
    url: "payrolls/modals/users?workshifts_data=true",
    options: {
      label: "label",
      key: "value",
    },
  },
}))

const onSubmit = (payload: any) => {
  loading.value = true
  payload.by_user = AuthModule.id
  payload._id = props.state.payload._id
  payload.agency = props.state.payload.agency
  payload.type = "assignment"
  const route = "workshifts/workdays"
  ApiGateway.put(route, payload)
    .then(response => {
      if (response.data.status) {
        emits("changeModal", { show: false })
        TablesModule.setReload(true)
        ElMessage({
          message: `Se ha asignado correctamente!!!`,
          type: "success",
        })
      } else {
        ElMessage({
          message: `No se ha podido asignar correctamente!!! puede ser que el agente que asignó esté activo en otra posición`,
          type: "error",
        })
      }
    })
    .catch(() => {
      ElMessage({
        message: `No se ha podido asignar correctamente!!!`,
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
    :show="state.show"
    title="Asignar agente"
    modal-name="formAssignWorkshiftAgentModal"
    column-classes="col-lg-6"
    :loading="loading"
    :inputs="fields"
    @change-modal="(p: any) => emits('changeModal', p.payload)"
    @submit="onSubmit"
  >
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
