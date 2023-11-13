<script lang="ts" setup>
import { Field, ModalState, Modals } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { ref, onMounted } from "vue"
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

const fields: { [k: string]: Field } = {
  code: {
    label: "Código",
    type: "text",
    placeholder: "Digite un código",
    name: "code",
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  description: {
    label: "Nombre",
    type: "text",
    placeholder: "Digite un nombre par el gratificante",
    name: "description",
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  is_scheduled: {
    label: "Es programable",
    type: "checkbox",
    checked: false,
    name: "is_scheduled",
    validate: {
      required: "Este campo es obligatorio",
    },
  },
}
onMounted(() => {
  if (props.state.isEdit) {
    /** cargo los valores para el edit */
    Object.keys(props.state.payload).map(key => {
      const validateKeys = Object.keys(fields)
      if (validateKeys.includes(key)) {
        if (fields[key].type == "checkbox") {
          fields[key].checked = props.state.payload[key]
        } else {
          fields[key].value = props.state.payload[key]
        }
      }
    })
    /** agrego los que vienen por default */
    fields["active"] = {
      label: "Activo",
      type: "checkbox",
      name: "active",
      checked: props.state.payload.active,
    }
  }
})

const onSubmitCreateDiscountType = (payload: any) => {
  loading.value = true
  const route = "payrolls/discounts/types/create"

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

const handleSubmit = (payload: any) => {
  if (props.state.isEdit) {
    onSubmitEditDiscountType(payload)
  } else {
    onSubmitCreateDiscountType(payload)
  }
}

const onSubmitEditDiscountType = (payload: any) => {
  loading.value = true
  const route = "payrolls/discounts/types"
  payload._id = props.state.payload._id

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
    :show="state.show"
    :title="state.isEdit ? 'Editar descuento' : 'Nuevo descuento'"
    modal-name="formCreateDiscountTypeModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="fields"
    :loading="loading"
    :submit-button-text="state.isEdit ? 'Editar' : 'Guardar'"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="handleSubmit"
  />
</template>
