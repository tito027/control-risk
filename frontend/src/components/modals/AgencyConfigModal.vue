<script lang="ts" setup>
import ApiGateway from '@/store/api';
import { Field, ModalState } from '@/types/components';
import FormModal from './FormModal.vue';
import { onMounted, ref } from "vue"
import { reactive } from "vue"
import { FormModule } from '@/store/modules/FormModule';
import { ElMessage } from 'element-plus';
// props
const props = defineProps<{ show: boolean }>();

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void;
}>();

// state
const loading = ref(false);

const fields: { [k: string]: Field } = {
  supervisor: {
    label: "Supervisor",
    type: "options",
    placeholder: "Seleccione al supervisor de la empresa",
    name: "supervisor",
    url: "user/find/supervisor",
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
    value: "",
  },
	numSecurityAgent: {
    type: "number",
    name: "numSecurityAgent",
    label: "Número de agentes de seguridad",
		placeholder: "Ingresa el número de agentes de seguridad",
    step: 1,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      integer: "Debes ingresar un número entero",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
    },
    value: "",
  },
  numGroupLeader: {
    type: "number",
    name: "numGroupLeader",
    label: "Número de lideres de grupo",
		placeholder: "Ingresa el número de lideres de grupo",
    step: 1,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      integer: "Debes ingresar un número entero",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
    },
    value: "",
  },
  numPpi: {
    type: "number",
    name: "numPpi",
    label: "Número de agentes de protección a personas importantes",
		placeholder: "Ingresa número de agentes ppi",
    step: 1,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      integer: "Debes ingresar un número entero",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
    },
    value: "",
  },
  numMotorAgent: {
    type: "number",
    name: "numMotorAgent",
    label: "Número de agentes de motorizados",
		placeholder: "Ingresa el número de agentes motorizados",
    step: 1,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      integer: "Debes ingresar un número entero",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
    },
    value: "",
  },
  numDriver: {
    type: "number",
    name: "numDriver",
    label: "Número de motoristas",
		placeholder: "Ingresa el número de motoristas",
    step: 1,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      integer: "Debes ingresar un número entero",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
    },
    value: "",
  },
  numPreventionAgent: {
    type: "number",
    name: "numPreventionAgent",
    label: "Número de agentes de prevensión",
		placeholder: "Ingresa número de agentes de prevensión",
    step: 1,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      integer: "Debes ingresar un número entero",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
    },
    value: "",
  },
};

const reactiveFields = reactive(fields);

function onSubmit(e: any) {
  loading.value = true
  ApiGateway.post(`/agencies/update/config/${FormModule.getId}`, e).then(() => {
    ElMessage({
      message: `Se han actualizado las configuraciones con exito!!!`,
      type: "success",
    })
    FormModule.setUpdateData()
    emits("changeModal", { show: false })
  }).catch(err => {
    ElMessage({
      message: `No se han podido actualizar las configuraciones correctamente!!!`,
      type: "error",
    })
  }).finally(() => {
    loading.value = false
  })
}

onMounted(async () => {
  loading.value = true
  ApiGateway.get(`/agencies/find/config/${FormModule.getId}`).then(response => {
    reactiveFields.supervisor.value = response.data.supervisor.toString()
    reactiveFields.numSecurityAgent.value = response.data.numSecurityAgent.toString()
    reactiveFields.numGroupLeader.value = response.data.numGroupLeader.toString()
    reactiveFields.numPpi.value = response.data.numPpi.toString()
    reactiveFields.numMotorAgent.value = response.data.numMotorAgent.toString()
    reactiveFields.numDriver.value = response.data.numDriver.toString()
    reactiveFields.numPreventionAgent.value = response.data.numPreventionAgent.toString()
  }).catch(err => {
    if(!err.message.includes('undefined'))
      ElMessage({
        message: `No se ha podido obtener la configuración de la empresa!!!`,
        type: "error",
      })
  }).finally(() => {
    loading.value = false
  })
})
</script>
<template>
  <form-modal
    :show="show"
    :title="`Configuraciones de la agencia ${FormModule.getData.name}`"
    modal-name="formBusinessConfigModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="reactiveFields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmit"
  />
</template>