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

const fields: { [k: string]: Field } = {
  init: {
    label: "Fecha inicio",
    type: "date",
    classPicker: "w-100 mt-1",
    classParent: "form-group w-100 px-1",
    placeholder: "Seleccione una fecha de inicio",
    name: "init_date",
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  end: {
    label: "Fecha fin",
    type: "date",
    classPicker: "w-100 mt-1",
    classParent: "form-group w-100 px-1",
    placeholder: "Seleccione una fecha de fin",
    name: "end_date",
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  code: {
    label: "Codigo",
    type: "text",
    placeholder: "Digite el código representativo de la planilla",
    name: "code",
    validate: {
      required: "Este campo es obligatorio",
    },
  },
}

const onSubmit = (payload: any) => {
  loading.value = true
  const route = "payrolls/create"

  ApiGateway.post(route, payload)
    .then(response => {
      if (response.data._id) {
        emits("changeModal", { show: false })
        TablesModule.setReload(true)
        PayrollsModule.setActivePayroll(response.data._id)
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
</script>
<template>
  <form-modal
    :show="show"
    title="Planilla nueva"
    modal-name="formCreatePayrollModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="fields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmit"
  />
</template>
