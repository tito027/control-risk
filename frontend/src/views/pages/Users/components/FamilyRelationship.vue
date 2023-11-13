<script setup lang="ts">
import { AgentsModule } from "@/store/modules/Agents"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { reactive, watch, ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { vMaska } from "maska"

const router = useRouter()
const route = useRoute()
const activeNames = ref('first')
const ruleFormRef = ref<FormInstance>()

const emit = defineEmits<{
  (e: "prev"): void
  (e: "next"): void
}>()

let auxStep = ref(7)
let auxNextStep = ref(8)
let auxIsEdit = ref(false)

const ruleFormStep = reactive({
  familyRelationship: {
    completeName: "",
    relationship: "",
    age: "",
    job: "",
    cellPhone: "",
  }
})

const rulesStep = reactive<FormRules>({
  familyRelationship: {
    completeName: [
      { required: true, message: "El campo nombre es requerido", trigger: "blur" }
    ],
    relationship: [
      { required: true, message: "El campo relación es requerido", trigger: "blur" }
    ],
    age: [
      { required: true, message: "El campo edad es requerido", trigger: "blur" }
    ],
  },
})

let dataToShowFamilyRelationship: { completeName: string; relationship: string; age: string; job: string; cellPhone: string; }[] = reactive([]);

async function addItemToArray() {
await ruleFormRef.value?.validate(async (valid, fields) => {
    if (!valid) return

    // Agregar el item al array
    let otraPersona = Object.assign({}, ruleFormStep.familyRelationship);
    dataToShowFamilyRelationship.push(otraPersona);
    // Limpiar el formulario
    setTimeout(() => {
      ruleFormRef.value?.resetFields();
    }, 1000);

    // Mostrar mensaje de éxito
    ElMessage.success("Relación familiar agregada");
  });
}

function removeItemFromArray(index: number) {
  dataToShowFamilyRelationship.splice(index, 1);
}

async function handleSubmit() {
  const userInfoId = route.query.uII
  const userId = route.query.uI

  // creamos objeto que tendra dataToShowFamilyRelationship, userInfoId, isEdit, nextStep y step
  let data = {
    familyRelationship: dataToShowFamilyRelationship,
    userInfoId: userInfoId,
    isEdit: auxIsEdit.value,
    nextStep: auxNextStep.value,
    step: auxStep.value,
  };

  const { success, reply } = await AgentsModule.createAgentBySteps(data)

  if (!success)
    return ElMessage.error(
      "Error: No se pudo guardar la información, favor revisar los datos o ponerse en contacto con el administrador"
    )
  else if (reply && reply.data.status === true) {
    ElMessage({
      type: "success",
      message: "Paso número siete completado y guardado correctamente",
    })

    await router.replace({
      query: { ...route.query, s: 8 },
    })
    emit("next")
  }
}

onMounted(async () => {
  // si en el query parameter viene uI y uII significa que es una edición y rellenamos los campos
  const { uI, uII, edit } = route.query
  let auxNextStep = null;

  if (uI && uII) {
    await AgentsModule.getOneAgent({userId: uI.toString()}).then(resp => {
      if (resp) {
        // recorremos el array de familyRelationship
        resp.s7.familyRelationship.forEach((element: any) => {
          // agregamos cada elemento al array dataToShowFamilyRelationship
          dataToShowFamilyRelationship.push(element);
        });

        auxNextStep = resp?.nextStep
      }
    })

    // si en query parameter viene edit significa que es una edición
    if (edit && edit === "true" || (auxNextStep && auxNextStep >= auxNextStep)) {
      auxIsEdit.value = true
    }
  }
})

</script>

<template>
  <div
    class="card multisteps-form__panel p-3 border-radius-xl bg-white"
    data-animation="FadeIn"
  >
    <h5 class="font-weight-bolder">Relaciones familiares</h5>
    <p class="mb-0 text-sm">
      Completar los datos sobre la relación familiar del agente
    </p>
    <div class="multisteps-form__content">
      <div class="mt-3 row">
        <el-form
          label-position="top"
          ref="ruleFormRef"
          :model="ruleFormStep"
          :rules="rulesStep"
          status-icon
          class="demo-ruleForm col-12 col-sm-6"
        >
          <el-form-item :label="'Nombre: '" prop="familyRelationship.completeName">
            <el-input v-model="ruleFormStep.familyRelationship.completeName" />
          </el-form-item>

          <div class="row">
            <el-form-item :label="'Relación: '" prop="familyRelationship.relationship" class="col-sm-6">
              <el-input v-model="ruleFormStep.familyRelationship.relationship" />
            </el-form-item>

            <el-form-item :label="'Edad: '" prop="familyRelationship.age" class="col-sm-6">
              <el-input-number v-model="ruleFormStep.familyRelationship.age" :min="1" :max="100" />
            </el-form-item>
          </div>

          <div class="row">
            <el-form-item :label="'Ocupación: '" prop="familyRelationship.job" class="col-sm-6">
              <el-input v-model="ruleFormStep.familyRelationship.job" />
            </el-form-item>

            <el-form-item :label="'Teléfono: '" prop="familyRelationship.cellPhone" class="col-sm-6">
              <el-input v-maska data-maska="####-####" v-model="ruleFormStep.familyRelationship.cellPhone" />
            </el-form-item>
          </div>

          <div class="button-row mt-3">
            <el-button type="primary" class="ms-auto" @click="addItemToArray">
              Agregar familiar
            </el-button>
          </div>
        </el-form>

        <div class="col-12 mt-3 mt-sm-0 col-sm-6">
          <div v-if="dataToShowFamilyRelationship.length > 0" class="overflow-auto" :style="dataToShowFamilyRelationship.length > 3 ? 'height: 800px': ''">
            <div v-for="(item, index) in dataToShowFamilyRelationship" :key="index" class="border rounded-3 p-3 text-sm my-target-bussines my-3">
              <p><span class="font-weight-bold">Nombre empresa {{index + 1}}:</span> {{ item.completeName }}</p>
              <p><span class="font-weight-bold">Dirección:</span> {{ item.relationship }}</p>
              <p><span class="font-weight-bold">Actividad de la empresa:</span> {{ item.age }}</p>
              <div class="row custom-dates-bussines-information">
                <p><span class="font-weight-bold">Ocupación:</span> {{ item.job }}</p>
                <p><span class="font-weight-bold">Teléfono:</span> {{ item.cellPhone }}</p>
              </div>

              <div class="w-100 d-flex justify-content-end">
                <button
                  type="button"
                  class="bg-white border-0"
                  @click="removeItemFromArray(index)"
                >
                  <i class="fas fa-trash-alt text-danger"></i>
                </button>
              </div>
            </div>
          </div>
          <div v-else>
            <p class="mb-0 text-sm text-center">
              No hay datos para mostrar
            </p>
          </div>
        </div>

        <div class="button-row d-flex w-100 mt-4">
          <el-button type="default" @click="$emit('prev')"> Atrás </el-button>
          <el-button type="primary" class="ms-auto" @click="handleSubmit">
            Siguiente
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
