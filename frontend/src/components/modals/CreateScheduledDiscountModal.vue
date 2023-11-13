<script lang="ts" setup>
import { Field, ModalState, Modals } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { ref, onMounted } from "vue"
import { AuthModule } from "@/store/modules/Auth"
import { TablesModule } from "@/store/table/Table"
import moment from "moment"

// props
const props = defineProps<{ state: ModalState }>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

// state
const loading = ref(false)

const fields: { [k: string]: Field } = {
  user: {
    label: "Agente",
    type: "options",
    placeholder: "Seleccione un agente",
    name: "user",
    url: "payrolls/modals/users",
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  discount_type: {
    label: "Descuentos",
    type: "options",
    placeholder: "Seleccione un agente",
    name: "discount_type",
    url: "payrolls/discounts/modals/types?is_scheduled=true",
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  init_date: {
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
  end_date: {
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
  scheduled_value: {
    label: "Valor del descuento",
    type: "text",
    placeholder: "Digite un valor de descuento",
    name: "scheduled_value",
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
  first_fortnight: {
    label: "Primera quincena",
    type: "checkbox",
    checked: false,
    name: "first_fortnight",
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  second_fortnight: {
    label: "Segunda quincena",
    type: "checkbox",
    checked: false,
    name: "second_fortnight",
    validate: {
      required: "Este campo es obligatorio",
    },
  },
}

const onSubmit = (payload: any) => {
  loading.value = true
  const route = "payrolls/discounts/scheduled"
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

onMounted(() => {
  if (props.state.isEdit) {
    Object.keys(props.state.payload).map(key => {
      const validateKeys = Object.keys(fields)
      if (validateKeys.includes(key)) {
        if (fields[key].type == "checkbox") {
          fields[key].checked = props.state.payload[key]
        } else if (fields[key].type === "date") {
          fields[key].value = moment(props.state.payload[key]).calendar()
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
const onEdit = (payload: any) => {
  console.log("Editado")
  loading.value = true
  const route = "payrolls/discounts/scheduled"

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
const handleSubmit = (payload: any) => {
  if (props.state.isEdit) {
    onEdit(payload)
  } else {
    onSubmit(payload)
  }
}
</script>
<template>
  <form-modal
    :show="state.show"
    :title="
      state.isEdit
        ? 'Editar descuento recurrente'
        : 'Nuevo descuento recurrente'
    "
    modal-name="formCreateScheduledDiscountModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="fields"
    :loading="loading"
    :submit-button-text="state.isEdit ? 'Editar' : 'Guardar'"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="handleSubmit"
  />
</template>
