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
  date: {
    label: "Fecha en que se realiza la gestion",
    type: "date",
    placeholder: "Seleccione la fecha correspondiente al mantenimiento",
    name: "date",
    rows: "1",
    validate: {
      required: "Este campo es obligatorio",
    },
    disabled: true,
  },
  user: {
    label: "Agente",
    type: "options",
    placeholder: "Seleccione al supervisor encargado del proyecto",
    name: "user",
    url: "payrolls/modals/users",
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
    disabled: true,
  },
  zone: {
    label: "Zona",
    type: "text",
    placeholder: "Ingrese la cantidad de items",
    name: "zone",
    validate: {
      min: 1,
      required: "La cantidad debe ser al menos 1",
    },
    disabled: true,
  },
  agency_name: {
    label: "Agencia",
    type: "options",
    placeholder: "Seleccione una agencia",
    name: "agency_name",
    url: "payrolls/agency/list",
    options: {
      label: "label",
      key: "key",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
    disabled: true,
  },
  type_name: {
    label: "Tipo de Arma",
    type: "text",
    placeholder: "Ingrese el tipo de arma",
    name: "type_name",
    validate: {
      required: "Este campo es obligatorio",
    },
    disabled: true,
  },
  brand: {
    label: "Marca del Arma",
    type: "text",
    placeholder: "Ingrese la marca del arma",
    name: "brand",
    validate: {
      required: "Este campo es obligatorio",
    },
    disabled: true,
  },
  serial: {
    label: "Serie del Arma",
    type: "text",
    placeholder: "Ingrese la cantidad de arma",
    name: "serial",
    validate: {
      required: "Este campo es obligatorio",
    },
    disabled: true,
  },
  maintenance_type: {
    label: "Tipo de Mantenimiento",
    type: "options",
    staticOptions: [
      {
        value: "Mantenimiento preventivo general de escopeta",
        label: "Mantenimiento preventivo general de escopeta",
      },
      {
        value: "Mantenimiento preventivo general de revolver",
        label: "Mantenimiento preventivo general de revolver",
      },
      {
        value: "Mantenimiento preventivo general de pistola",
        label: "Mantenimiento preventivo general de pistola",
      },
      {
        value: "Mantenimiento y reparacion por mal funcionamiento escopeta",
        label: "Mantenimiento y reparacion por mal funcionamiento escopeta",
      },
      {
        value: "Mantenimiento y reparacion por mal funcionamiento revolver",
        label: "Mantenimiento y reparacion por mal funcionamiento revolver",
      },
      {
        value: "Mantenimiento preventivo por refrenda de escopeta",
        label: "Mantenimiento preventivo por refrenda de escopeta",
      },
      {
        value: "Mantenimiento preventivo por refrenda de revolver",
        label: "Mantenimiento preventivo por refrenda de revolver",
      },
      {
        value: "Mantenimiento preventivo por refrenda de pistola",
        label: "Mantenimiento preventivo por refrenda de pistola",
      },
    ],
    options: {
      label: "label",
      key: "value",
    },
    placeholder: "Ingrese el tipo de mantenimiento",
    name: "maintenance_type",
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  maintenance_revolver: {
    label: "Mantenimiento preventivo de Revolver",
    type: "options",
    staticOptions: [
      {
        value: "LIMPIEZA Y LUBRICACION TAMBOR",
        label: "LIMPIEZA Y LUBRICACION TAMBOR",
      },
      {
        value: "LIMPIEZA Y LUBRICACION CANON",
        label: "LIMPIEZA Y LUBRICACION CANON",
      },
      {
        value: "LIMPIEZA Y LUBRICACION DE CAJA DE MECANISMO",
        label:
          "LIMPIEZA Y LUBRICACION DE CAJA DE MECANISMO(INCLUYE MARTILLO,MUEY,ESPION,CORREDERAS,GRANO,TORNILLO DE BISAGRA,BISAGRA,LENGUETA,RESORTE DE CORREDERA)",
      },
      {
        value: "LIMPIEZA Y LUBRICACION DE BROCHE DE TAMBOR",
        label: "LIMPIEZA Y LUBRICACION DE BROCHE DE TAMBOR",
      },
    ],
    options: {
      label: "label",
      key: "value",
    },
    placeholder: "Ingrese el mantenimiento de revólver",
    name: "maintenance_revolver",
  },
  maintenance_shotgun: {
    label: "Mantenimiento preventivo de Escopeta",
    type: "options",
    staticOptions: [
      {
        value: "LIMPIEZA Y LUBRICACION DE CANON",
        label: "LIMPIEZA Y LUBRICACION DE CANON",
      },
      {
        value: "LIMPIEZA Y LUBRICACION DE CILINDRO ALIMENTADOR DE CARTUCHO",
        label: "LIMPIEZA Y LUBRICACION DE CILINDRO ALIMENTADOR DE CARTUCHO",
      },
      {
        value:
          "LIMPIEZA Y LUBRICACION DE RESORTE DE CILINDRO DE ALIMENTADOR DE CARTUCHO",
        label:
          "LIMPIEZA Y LUBRICACION DE RESORTE DE CILINDRO DE ALIMENTADOR DE CARTUCHO",
      },
      {
        value: "LIMPIEZA Y LUBRICACION DE CANCELADORES",
        label: "LIMPIEZA Y LUBRICACION DE CANCELADORES",
      },
      {
        value: "LIMPIEZA Y LUBRICACION DE CAJA DE MECANISMO DE DISPARADOR",
        label: "LIMPIEZA Y LUBRICACION DE CAJA DE MECANISMO DE DISPARADOR",
      },
      {
        value: "LIMPIEZA Y LUBRICACION DE ELEVADOR DE CARTUCHO",
        label: "LIMPIEZA Y LUBRICACION DE ELEVADOR DE CARTUCHO",
      },
      {
        value: "LIMPIEZA Y LUBRICACION DEL CERROJO",
        label: "LIMPIEZA Y LUBRICACION DEL CERROJO",
      },
      {
        value: "LIMPIEZA Y LUBRICACION DE MAZORCA DE ESCOPETA",
        label: "LIMPIEZA Y LUBRICACION DE MAZORCA DE ESCOPETA",
      },
      {
        value: "LIMPIEZA Y LUBRICACION DEL MECANISMO",
        label: "LIMPIEZA Y LUBRICACION DEL MECANISMO",
      },
      {
        value: "LIMPIEZA Y LUBRICACION DE ARGOLLA DELANTERA Y TRASERA",
        label: "LIMPIEZA Y LUBRICACION DE ARGOLLA DELANTERA Y TRASERA",
      },
    ],
    options: {
      label: "label",
      key: "value",
    },
    placeholder: "Ingrese el mantenimiento de escopeta",
    name: "maintenance_shotgun",
  },
  maintenance_gun: {
    label: "Mantenimiento preventivo de Pistola",
    type: "options",
    staticOptions: [
      {
        value: "LIMPIEZA Y LUBRICACION MAGAZINE/CARGADOR",
        label: "LIMPIEZA Y LUBRICACION MAGAZINE/CARGADOR",
      },
      {
        value: "LIMPIEZA Y LUBRICACION CORREDERA",
        label: "LIMPIEZA Y LUBRICACION CORREDERA",
      },
      {
        value: "LIMPIEZA Y LUBRICACION DEL CAJON",
        label: "LIMPIEZA Y LUBRICACION DEL CAJON",
      },
    ],
    options: {
      label: "label",
      key: "value",
    },
    placeholder: "Ingrese el mantenimiento de pistola",
    name: "maintenance_gun",
  },
  corrective_shotgun_maintenance: {
    label: "Mantenimiento correctivo de Escopeta",
    type: "options",
    staticOptions: [
      {
        value: "REMARCACION DE SERIE",
        label: "REMARCACION DE SERIE",
      },
      {
        value: "AJUSTE DE PERCUTOR",
        label: "AJUSTE DE PERCUTOR",
      },
      {
        value: "AJUSTE DE CANCELADORES",
        label: "AJUSTE DE CANCELADORES",
      },
      {
        value: "AJUSTE DE MUEY",
        label: "AJUSTE DE MUEY",
      },
      {
        value: "CAMBIO DE ARGOLLA DELANTERA",
        label: "CAMBIO DE ARGOLLA DELANTERA",
      },
      {
        value: "CAMBIO DE ARGOLLA TRASERA",
        label: "CAMBIO DE ARGOLLA TRASERA",
      },
      {
        value: "CAMBIO DE MARTILLO",
        label: "CAMBIO DE MARTILLO",
      },
      {
        value: "CAMBIO DE PERCUTOR",
        label: "CAMBIO DE PERCUTOR",
      },
      {
        value: "AJUSTE DE CAMBIO DE RESORTE DE SEGUNDO ALIMENTADOR DE CARTUCHO",
        label: "AJUSTE DE CAMBIO DE RESORTE DE SEGUNDO ALIMENTADOR DE CARTUCHO",
      },
      {
        value: "CAMBIO DE ESTRACTOR",
        label: "CAMBIO DE ESTRACTOR",
      },
      {
        value: "CAMBIO DE EXPUSOR DE CARTUCHO",
        label: "CAMBIO DE EXPUSOR DE CARTUCHO",
      },
      {
        value: "ELABORACION DE ARGOLLA DELANTERA",
        label: "ELABORACION DE ARGOLLA DELANTERA",
      },
      {
        value: "ELABORACION DE ARGOLLA TRASERA",
        label: "ELABORACION DE ARGOLLA TRASERA",
      },
      {
        value: "ELABORACION DE MARTILLO",
        label: "ELABORACION DE MARTILLO",
      },
      {
        value: "ELABORACION DE CANCELADORES",
        label: "ELABORACION DE CANCELADORES",
      },
      {
        value: "ELABORACION DE MUEY",
        label: "ELABORACION DE MUEY",
      },
      {
        value: "ELABORACION DE PERCUTOR",
        label: "ELABORACION DE PERCUTOR",
      },
      {
        value: "ELABORACION DE RESORTE DE SEGUNDO ",
        label: "ELABORACION DE RESORTE DE SEGUNDO ",
      },
      {
        value: "ALIMENTADOR DE CARTUCHO",
        label: "ALIMENTADOR DE CARTUCHO",
      },
      {
        value: "ELABORACION DE ESTRACTOR",
        label: "ELABORACION DE ESTRACTOR",
      },
      {
        value: "ELABORACION DE EXPULSOR DE CARTUCHO",
        label: "ELABORACION DE EXPULSOR DE CARTUCHO",
      },
    ],
    options: {
      label: "label",
      key: "value",
    },
    placeholder: "Ingrese el mantenimiento de pistola",
    name: "corrective_shotgun_maintenance",
  },
  corrective_revólver_maintenance: {
    label: "Mantenimiento correctivo de Escopeta",
    type: "options",
    staticOptions: [
      {
        value: "AJUSTE DE TAMBOR",
        label: "AJUSTE DE TAMBOR",
      },
      {
        value: "AJUSTE DE MARTILLO",
        label: "AJUSTE DE MARTILLO",
      },
      {
        value: "AJUSTE DE MUEY",
        label: "AJUSTE DE MUEY",
      },
      {
        value: "CAMBIO DE MARTILLO",
        label: "CAMBIO DE MARTILLO",
      },
      {
        value: "CAMBIO DE GRANO",
        label: "CAMBIO DE GRANO",
      },
      {
        value: "CAMBIO DE TORNILLO DE BISAGRA",
        label: "CAMBIO DE TORNILLO DE BISAGRA",
      },
      {
        value: "CAMBIO DE BISAGRA",
        label: "CAMBIO DE BISAGRA",
      },
      {
        value: "CAMBIO DE LENGUENTA",
        label: "CAMBIO DE LENGUENTA",
      },
      {
        value: "CAMBIO DE ESPION DE MARTILLO",
        label: "CAMBIO DE ESPION DE MARTILLO",
      },
      {
        value: "CAMBIO DE CORREDERA",
        label: "CAMBIO DE CORREDERA",
      },
      {
        value: "CAMBIO DE RESORTE DE CORREDERA",
        label: "CAMBIO DE RESORTE DE CORREDERA",
      },
      {
        value: "CAMBIO DE DISPARADOR",
        label: "CAMBIO DE DISPARADOR",
      },
      {
        value: "ELABORACION DE MARTILLO",
        label: "ELABORACION DE MARTILLO",
      },
      {
        value: "ELABORACION DE MUEY",
        label: "ELABORACION DE MUEY",
      },
      {
        value: "ELABORACION DE GRANO",
        label: "ELABORACION DE GRANO",
      },
      {
        value: "ELABORACION DE TORNILLO DE BISAGRA",
        label: "ELABORACION DE TORNILLO DE BISAGRA",
      },
      {
        value: "ELABORACION DE BISAGRA",
        label: "ELABORACION DE BISAGRA",
      },
      {
        value: "ELABORACION DE LENGUENTA",
        label: "ELABORACION DE LENGUENTA",
      },
    ],
    options: {
      label: "label",
      key: "value",
    },
    placeholder: "Ingrese el mantenimiento de Revólver",
    name: "corrective_revólver_maintenance",
  },
  maintenance: {
    label:
      "Especificar procedimiento realizado para el mantenimiento y/o reparacion",
    type: "textarea",
    placeholder:
      "Describa estado original y especifique cual fue el resultado del mantenimiento",
    rows: "2",
    name: "maintenance",
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  costs: {
    label:
      "Especificar si hubo costo necesario para el mantenimiento y/o reparacion",
    type: "textarea",
    placeholder: "Describa costos y sino incurrio en costos dejar en blanco",
    name: "costs",
    rows: "1",
  },
  ammo_status: {
    label: "Especificar estado de la municion",
    type: "textarea",
    placeholder:
      "Describa cantidad, estado o si hubo cambio de la municion encontrada",
    rows: "2",
    name: "ammo_status",
    validate: {
      required: "Este campo es obligatorio",
    },
  },
}
const isLoading = ref(false) // Indicador de carga

onMounted(async () => {
  if (props.state.isEdit) {
    isLoading.value = true
    const payload = props.state.payload
    try {
      const response = await ApiGateway.post("/inventory/weapons/data", payload)
      const { item_id, zone, type_name, serial } = response.data
      props.state.payload.zone = zone
      props.state.payload.type_name = type_name
      props.state.payload.item_id = item_id
      props.state.payload.serial = serial
      props.state.payload.date = new Date().toISOString()

      /** cargo los valores para el edit */
      Object.keys(props.state.payload).forEach(key => {
        const validateKeys = Object.keys(fields)
        if (validateKeys.includes(key)) {
          if (fields[key].type == "checkbox") {
            fields[key].checked = props.state.payload[key]
          } else {
            fields[key].value = props.state.payload[key]
          }
        }
      })
    } catch (error) {
      ElMessage({
        message: "error",
        type: "error",
      })
    } finally {
      isLoading.value = false
    }
  } else {
    isSingular.value = false
  }
})

const onSubmit = (payload: any) => {
  loading.value = true
  const route = "/maintenance/create"
  payload.user = AuthModule.id
  payload.date = new Date().toISOString()
  payload.type = props.state.payload.type
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

// const editSingular = (payload: any) => {
//   const singular = props.state.isEdit
//   const route =
// }

const onEdit = (payload: any) => {
  loading.value = true
  const route = "/maintenance/create"
  payload.user = AuthModule.id
  payload.date = new Date().toISOString()
  //payload.type = props.state.payload.type
  payload.item_id = props.state.payload.item_id
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
    .catch(error => {
      ElMessage({
        message: "No se pudo crear correctamente!!",
        type: "error",
      })
    })
    .finally(() => {
      loading.value = false
    })

  loading.value = false
}

const getTitle = () => {
  return "REGISTRO DE MANTENIMIENTO DE ARMAS Y MUNICION"
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
    :title="getTitle()"
    modal-name="formWeaponMaintenanceModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="fields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="handleSubmit"
  />
</template>
