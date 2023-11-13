<script lang="ts" setup>
import { Field, ModalState } from '@/types/components';
import FormModal from './FormModal.vue';
import ApiGateway from '@/store/api';
import { ElMessage } from 'element-plus';
import { onMounted,ref } from 'vue';
import multiOptions,{FormField} from '../inputs/multiOptions.vue';
import { FormModule } from "@/store/modules/FormModule"
import { reactive } from "vue"

// props
const props = defineProps<{ show: boolean }>();
const model = ref<FormField[]>([
  {
    type: 1,
    id: "control-0",
	label: "Opciones",

  }],
)
// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void;
}>();
const loading = ref(false);
const title = ref("Agregar prueba psicológica")
const buttonText = ref("Guardar")
const fields: { [k: string]: Field } = {
	"name": {
		label: "Nombre de la prueba",
		type: "text",
		placeholder: "Digite el nombre de la prueba",
		name: "name",
		validate: {
			required: "Este campo es obligatorio",
			min: 5,
			max: 100,
		},
	},
	"indication": {
		label: "Indicaciones",
		type: "text",
		placeholder: "Digite las indicaciones",
		name: "indication",
		validate: {
			required: "Este campo es obligatorio",
			min: 3,
			max: 255,
		},
	},
	"comment": {
		label: "Habilitar comentario",
		type: "checkbox",
		name: "comment",
		checked:true,
	},
	"dynamic": {
		label: "Campos dinámicos",
		type: "checkbox",
		name: "dynamicInput",
		checked:false,
	},
};
const reactiveFields = reactive(fields)

onMounted(async () => {
  // obtenemos los datos del formulario si estamos en modo editar
  if (FormModule.getType === "edit") {
    title.value = "Editar Prueba"
    buttonText.value = "Actualizar"

    loading.value = true
    ApiGateway.get(`${FormModule.getEndpoint}/${FormModule.getId}`).then(response => {
      reactiveFields.name.value = response.data.name
      reactiveFields.indication.value = response.data.indication
	  reactiveFields.comment.checked = response.data.comment
	  reactiveFields.dynamic.checked = response.data.dynamic

	  model.value[0].options = response.data.questions;
    }).catch(() => {
      ElMessage({
        message: `No se ha podido obtener la información de la prueba!!!`,
        type: "error",
      })
    }).finally(() => {
      loading.value = false
    })
  }

})
// state


function onSubmit(e: any) {
	loading.value = true
	console.log(e)

	if (FormModule.getType === "edit") {
    ApiGateway.put(`/psychic/update/${FormModule.getId}`, {...e,questions:model.value[0].options}).then(response => {
      if (response.data._id) {
        emits("changeModal", { show: false })
        FormModule.setUpdateData()
        ElMessage({
          message: `Se ha editado la prueba ${e.name} correctamente!!!`,
          type: "success",
        })
      }
    }).catch(ex => {
      console.log(ex)
      ElMessage({
        message: `No se ha podido editar la prueba ${e.name} correctamente!!!`,
        type: "error",
      })
    }).finally(() => {
      loading.value = false
    })
    return
  }

  loading.value = true;
	ApiGateway.post("/psychic/create", {...e,questions:model.value[0].options}).then(response => {
		if(response.data._id) {
			emits('changeModal', { show: false });
			FormModule.setUpdateData()
			ElMessage({
				message: `Se ha creado la prueba ${e.name} correctamente!!!`,
				type: "success",
			})
		}
	}).catch(() => {
		ElMessage({
			message: `No se ha podido crear la prueba ${e.name} correctamente!!!`,
			type: "error",
		})
	}).finally(() => {
		 loading.value = false;
	})
}
// Methods
function addControl(index: number) {
	console.log("Entra add control2")
  model.value.splice(index + 1, 0, {
    type: 0,
    id: `control-${index + 1}`,
  })
}
function updateControl({
  index,
  payload,
}: {
  index: number
  payload: Partial<FormField & { parentOption: string }>
}) {

  model.value[index] = { ...model.value[index], ...payload }
}
function removeControl(index: number) {
  model.value.splice(index, 1)
}
function getOptions(control?: string) {
  const parent = model.value.find(ctrl => control === ctrl.id)
  return parent?.options
}
</script>
<template>
    <form-modal
        :show="show"
        :title="title"
		modal-name="formPsychoModal"
		column-classes="col-lg-6 col-md-6 col-12"
        :inputs="reactiveFields"
		:loading="loading"
        @change-modal="p => emits('changeModal', p.payload)"
        @submit="onSubmit"
		:submit-button-text="buttonText"

    >
	<div v-for="(item, index) in model">
		<multiOptions
              :index="index"
              :show-delete="model.length > 1"
              :value="item"
              :controls="model"
              :parent-options="
                item.dependsOn ? getOptions(item.dependsOn) : undefined
              "
              :options="item.options"
              @add-control="addControl"
              @update-control="updateControl"
              @remove-control="removeControl"
            />
          </div>
	</form-modal>
</template>