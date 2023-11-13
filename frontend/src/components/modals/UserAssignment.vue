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
  business: {
    label: "Empresa",
    type: "options",
    placeholder: "Seleccione la empresa a la que pertenece la posición",
    name: "business",
    url: "business",
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
    value: "",
  },
  agency: {
    label: "Agencia",
    type: "options",
    placeholder: "Seleccione la agencia a la que pertenece la posición",
    name: "agency",
    url: "business/list/agencies",
    depends_on: {
        name: "business",
        query_param: "value"
    },
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
    value: "",
  },
  role: {
    label: "Rol",
    type: "options",
    placeholder: "Seleccione el rol del agente",
    name: "role",
    url: "roles/list",
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
    value: "",
  },
  salary: {
    type: "number",
    name: "salary",
    label: "Salario",
		placeholder: "Ingresa el salario",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2
    },
    value: "",
  },
};

const reactiveFields = reactive(fields);

function onSubmit(e: any) {
  loading.value = true
  const payload = {
    'assignment.agency': e.agency,
    role: e.role,
    salary: parseFloat(e.salary),
  }
  ApiGateway.put(`agents/update/assigment/${FormModule.getId}`, payload).then(response => {
    if (response.data._id) {
      emits("changeModal", { show: false })
      FormModule.setUpdateData()
      ElMessage({
        message: `Se ha actualizado la asignación correctamente!!!`,
        type: "success",
      })
    }
  }).catch(() => {
    ElMessage({
      message: `No se ha actualizado la asignación correctamente!!!`,
      type: "error",
    })
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  if(FormModule.getData.business && FormModule.getData.agency) {
    reactiveFields.business.value = FormModule.getData.business
    reactiveFields.agency.value = FormModule.getData.agency
  }
  if(FormModule.getData.role)
    reactiveFields.role.value = FormModule.getData.role

  if(FormModule.getData.salary)
    reactiveFields.salary.value = FormModule.getData.salary
})
</script>
<template>
  <form-modal
    :show="show"
    :title="`Assignación del agente: ${FormModule.getData.name}`"
    modal-name="formAgentAssignmentModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="reactiveFields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmit"
  />
</template>
