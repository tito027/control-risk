<script lang="ts" setup>
import ApiGateway from '@/store/api';
import { Field, ModalState } from '@/types/components';
import FormModal from './FormModal.vue';
import { ref } from "vue"
import { reactive } from "vue"
import * as yup from "yup"
import { DateTime } from "luxon"
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

const now = DateTime.now().startOf('day');
const minDate = now.plus({ days: -10 })

const fields: { [k: string]: Field } = {
	status: {
		name: "status",
		type: "options",
		label: "Estado",
		placeholder: "Seleccione un estado",
    url: "agents/status/list",
    options: {
      label: "label",
      key: "value",
    },
		validate: {
			required: "Este campo es obligatorio",
		},
    value: "",
	},
  reason: {
		name: "reason",
		type: "options",
		label: "Razón",
		placeholder: "Selecciona una razón",
    hidden: {
      status: "5",
    },
    url: "agents/status/reason/list",
    options: {
      label: "label",
      key: "value",
    },
		validate: {
      when: ['status', {
        is: '5',
        then: yup.string().required('Este campo es obligatorio'),
        otherwise: yup.string(),
      }]
		},
    value: "",
	},
  comment: {
    type: "text",
    name: "comment",
    label: "Comentario",
		placeholder: "Ingresa un comentario sobre el cambio del estado",
    value: "",
  },
  date: {
    type: "date",
    name: "date",
    label: "Seleccione una fecha",
    classPicker: 'w-100 mt-1',
    classParent: "form-group w-100 px-1",
    format: "DD/MM/YYYY",
    validate: {
      required: "Este campo es obligatorio",
      min: [minDate.toJSDate(), `Debe ingresar una fecha mayor o igual al ${minDate.setLocale('es').toFormat("dd 'de' LLLL 'del' yyyy")}`],
      max: [now.toJSDate(), "Debe ingresar una fecha menor o igual al día de hoy"],
    },
    value: now.toJSDate().toISOString(),
  }
};

const reactiveFields = reactive(fields);

function onSubmit(e: any) {
  const { status, ...data } = e;
  const payload = {
    user: FormModule.getId,
    code: parseInt(status),
    ...data,
  }
  ApiGateway.post(`/agents/status/update/${FormModule.getData.carnet}`, payload).then(() => {
    FormModule.setUpdateData()
    ElMessage({
      message: `Se ha actualizado el estado de ${FormModule.getData.name} correctamente!!!`,
      type: "success",
    })
  }).catch(() => {
    ElMessage({
      message: `No se ha actualizado el estado de ${FormModule.getData.name}!!!`,
      type: "error",
    })
  })
  emits('changeModal', { show: false });
}
</script>
<template>
  <form-modal
    :show="show"
    :title="`Cambiar estado del agente ${FormModule.getData.name} (${FormModule.getData.carnet})`"
    modal-name="formAgentStatusModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="reactiveFields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmit"
  />
</template>