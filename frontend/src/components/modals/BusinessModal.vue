<script lang="ts" setup>
import { Field, ModalState } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage } from "element-plus"
import { computed, onMounted, ref } from "vue"
import { FormModule } from "@/store/modules/FormModule"
import { reactive } from "vue"
import { DateTime } from "luxon"

// props
const props = defineProps<{ show: boolean }>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

const now = ref(DateTime.now().startOf('day'));
const minDate = ref(now.value.plus({ month: -1 }))

// state
const loading = ref(false)
const title = ref("Agregar Empresa")
const buttonText = ref("Guardar")

const fields: { [k: string]: Field } = {
  name: {
    label: "Razón social",
    type: "text",
    placeholder: "Digite la razón social de la empresa",
    name: "name",
    validate: {
      required: "Este campo es obligatorio",
      min: 5,
      max: 100,
    },
    value: "",
  },
  nickname: {
    label: "Nombre simplificado",
    type: "text",
    placeholder: "Digite el nombre simplificado de la empresa",
    name: "nickname",
    validate: {
      required: "Este campo es obligatorio",
      min: 3,
      max: 100,
    },
    value: "",
  },
  nit: {
    label: "NIT",
    type: "text",
    placeholder: "Digite el nit de la empresa",
    name: "nit",
    validate: {
      required: "Este campo es obligatorio",
      regex: [new RegExp('^[0-9]{4}[-]{1}[0-9]{6}[-]{1}[0-9]{3}[-]{1}[0-9]{1}$'), "Debes ingresar un nit valido (####-######-###-#)"]
    },
    value: "",
  },
  activityThatDevelops: {
    label: "Actividad que desarrolla",
    type: "text",
    placeholder: "Digite la actividad que desarrolla la empresa",
    name: "activityThatDevelops",
    validate: {
      min: 5,
      max: 100,
    },
    value: "",
  },
  creditTerm: {
    type: "number",
    name: "creditTerm",
    label: "Plazo de credito (meses)",
		placeholder: "Ingresa el plazo de credito de la empresa",
    step: 1,
    min: 1,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      integer: "Debes ingresar un número entero",
      min: [1, "Debes ingresar un numero mayor o igual a 1"],
    },
    value: "1",
  },
  address: {
    label: "Dirección",
    type: "text",
    placeholder: "Digite la dirección de la empresa",
    name: "address",
    validate: {
      min: 5,
      max: 100,
    },
    value: "",
  },
  department: {
		label: "Departamento",
		type: "options",
		placeholder: "Seleccione un departamento",
		name: "department",
		remote: "https://api.salud.gob.sv/departamentos?idPais=68",
		query_param: "nombre",
		options: {
			label: "nombre",
			key: "nombre",
		},
	},
  contractStartDate: {
    type: "date",
    name: "contractStartDate",
    label: "Seleccione la fecha de inicio de contrato",
    classPicker: 'w-100 mt-1',
    classParent: "form-group w-100 px-1",
    format: "DD/MM/YYYY",
    validate: {
      typeError: "Este campo es obligatorio",
      required: "Este campo es obligatorio",
    },
    value: now.value.toJSDate().toISOString(),
  }
}

const reactiveFields = reactive(fields)

onMounted(async () => {
  // obtenemos los datos del formulario si estamos en modo editar
  if (FormModule.getType === "edit") {
    title.value = "Editar Empresa"
    buttonText.value = "Actualizar"

    loading.value = true
    ApiGateway.post(FormModule.getEndpoint + "/" + FormModule.getId)
      .then(response => {
        reactiveFields.name.value = response.data.name
        reactiveFields.nickname.value = response.data.nickname
        reactiveFields.nit.value = response.data.nit
        reactiveFields.activityThatDevelops.value = response.data.activityThatDevelops
        reactiveFields.creditTerm.value = response.data.creditTerm ? response.data.creditTerm.toString() : ""
        reactiveFields.address.value = response.data.address
        reactiveFields.department.value = response.data.department
        reactiveFields.contractStartDate.value = response.data.contractStartDate ? DateTime.fromISO(response.data.contractStartDate).toJSDate().toISOString() : ""
      })
      .catch(() => {
        ElMessage({
          message: `No se ha podido obtener la información de la empresa!!!`,
          type: "error",
        })
      })
      .finally(() => {
        loading.value = false
      })
  }
})

function onSubmit(e: any) {
  const { department, ...data } = e;
  const payload = {
    department: department.nombre,
    ...data
  }
  if (FormModule.getType === "edit") {
    loading.value = true
    ApiGateway.put("/business/update/" + FormModule.getId, payload)
      .then(response => {
        if (response.data._id) {
          emits("changeModal", { show: false })
          FormModule.setUpdateData()
          ElMessage({
            message: `Se ha editado la empresa ${e.name} correctamente!!!`,
            type: "success",
          })
        }
      })
      .catch(ex => {
        console.log(ex)
        ElMessage({
          message: `No se ha podido editar la empresa ${e.name} correctamente!!!`,
          type: "error",
        })
      })
      .finally(() => {
        loading.value = false
      })

    return
  }

  loading.value = true
  ApiGateway.post("/business/create", payload)
    .then(response => {
      if (response.data._id) {
        emits("changeModal", { show: false })
        FormModule.setUpdateData()
        ElMessage({
          message: `Se ha creado la empresa ${e.name} correctamente!!!`,
          type: "success",
        })
      }
    })
    .catch(() => {
      ElMessage({
        message: `No se ha podido crear la empresa ${e.name} correctamente!!!`,
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
    :title="title"
    :submit-button-text="buttonText"
    modal-name="formBusinessModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="reactiveFields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmit"
  />
</template>
