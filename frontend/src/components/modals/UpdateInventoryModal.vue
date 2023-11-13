<script lang="ts" setup>
import { Field, ModalState, Modals } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { onMounted, ref } from "vue"
import { AuthModule } from "@/store/modules/Auth"
import { TablesModule } from "@/store/table/Table"

// props
const props = defineProps<{ state: ModalState }>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

const isSingular = ref<boolean>(false)

// state
const loading = ref(false)

const fields: { [k: string]: Field } = {
  item_id: {
    label: "Items",
    type: "options",
    placeholder: "Seleccione los items correspondiente al inventario",
    name: "item_id",
    url: `inventory/table/items?type=${props.state.payload.type}&is_singular=1`,
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  item_ids: {
    label: "Items",
    type: "multioptions",
    placeholder: "Seleccione los items",
    name: "item_ids",
    url: `inventory/table/items?type=${props.state.payload.type}&need_list=true`,
    cascaderOptions: {
      label: "label",
      value: "value",
      multiple: true,
      children: "children",
    },
  },
  user_detail: {
    label: "Agente",
    type: "options",
    placeholder: "Seleccione el agente correspondiente al inventario",
    name: "user_detail",
    url: "payrolls/modals/users",
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  quantity: {
    label: "Cantidad",
    type: "text",
    placeholder: "Ingrese la cantidad de items",
    name: "quantity",
    validate: {
      min: 1,
      required: "La cantidad debe ser al menos 1",
    },
  },
  agency: {
    label: "Agencia",
    type: "options",
    placeholder: "Seleccione una agencia",
    name: "agency",
    url: "payrolls/agency/list",
    options: {
      label: "label",
      key: "key",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
  },
}
onMounted(() => {
  if (props.state.isEdit) {
    /** cargo los valores para el edit */
    delete fields["item_ids"]
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
    fields["item_id"].disabled = true
    fields["quantity"].disabled = true
    fields["quantity"].value = "1"
    isSingular.value = true
  } else {
    delete fields["item_id"]
    delete fields["user"]
    isSingular.value = false
  }
})

const onSubmit = (payload: any) => {
  loading.value = true
  const route = "/item/massive/agencies"
  payload.user = AuthModule.id
  payload.date = new Date().toISOString()
  payload.type = props.state.payload.type
  ApiGateway.put(route, payload)
    .then(response => {
      if (response.data.status) {
        emits("changeModal", { show: false })
        TablesModule.setReload(true)
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


const onEdit = (payload: any) => {
  loading.value = true
  payload._id = props.state.payload._id
  const route = `item/${payload._id}`

  payload.date = new Date().toISOString()
  const expirationDate = new Date(payload.date)
  expirationDate.setDate(expirationDate.getDate() + 90)

  payload.expiration_date = expirationDate.toISOString()

  ApiGateway.put(route, payload)
    .then(response => {
      if (response.data.status) {
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
const getTitle = (status: boolean = false) => {
  return status ? "Asignar" : "Nueva asignacion"
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
    :title="getTitle(state.isEdit)"
    modal-name="formUpdateInventoryModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="fields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="handleSubmit"
  />
</template>
