<script setup lang="ts">
import { AgentsModule } from "@/store/modules/Agents"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { reactive, watch, ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()
const activeNames = ref('first')
const ruleFormRef = ref<FormInstance>()


const emit = defineEmits<{
  (e: "prev"): void
  (e: "next"): void
}>()


let auxStep = ref(6)
let auxNextStep = ref(7)
let auxIsEdit = ref(false)

const ruleFormStep = reactive({
  familyReferences: {
    name: "",
    kinship: "",
    cellPhone: "",
  },
  personalReferences: {
    name: "",
    kinship: "",
    cellPhone: "",
  },
})

let dataToShowFamilyReferences: { name: string; kinship: string; cellPhone: string; }[] = reactive([]);
let dataToShowPersonalReferences: { name: string; kinship: string; cellPhone: string; }[] = reactive([]);

async function addItemToArray(typeReference: string) {
  if (typeReference == 'family') {
    // validamos que no esten vacios los campos
    if (ruleFormStep.familyReferences.name == "" || ruleFormStep.familyReferences.kinship == "" || ruleFormStep.familyReferences.cellPhone == "") {
      ElMessage.error("Por favor complete todos los campos de la referencia familiar");
      return;
    }

    // Agregar el item al array
    let otraPersona = Object.assign({}, ruleFormStep.familyReferences);
    dataToShowFamilyReferences.push(otraPersona);

    // Limpiar el formulario
    setTimeout(() => {
      ruleFormStep.familyReferences.name = "";
      ruleFormStep.familyReferences.kinship = "";
      ruleFormStep.familyReferences.cellPhone = "";
    }, 1000);

    // mostramos mensaje de éxito
    ElMessage.success("Referencia familiar agregada");
  }

  if (typeReference == 'personal') {
    // validamos que no esten vacios los campos
    if (ruleFormStep.personalReferences.name == "" || ruleFormStep.personalReferences.kinship == "" || ruleFormStep.personalReferences.cellPhone == "") {
      ElMessage.error("Por favor complete todos los campos de la referencia personal");
      return;
    }

    // Agregar el item al array
    let otraPersona = Object.assign({}, ruleFormStep.personalReferences);
    dataToShowPersonalReferences.push(otraPersona);

    // Limpiar el formulario
    setTimeout(() => {
      ruleFormStep.personalReferences.name = "";
      ruleFormStep.personalReferences.kinship = "";
      ruleFormStep.personalReferences.cellPhone = "";
    }, 1000);

    // mostramos mensaje de éxito
    ElMessage.success("Referencia personal agregada");
  }
}

function removeItemFromArray(index: number, typeReference: string) {
  if (typeReference == 'family') {
    dataToShowFamilyReferences.splice(index, 1);
  }

  if (typeReference == 'personal') {
    dataToShowPersonalReferences.splice(index, 1);
  }
}

async function handleSubmit() {
  const userInfoId = route.query.uII
  const userId = route.query.uI

  // verificamos que exista al menos 1 referencia ya sea familiar o personal
  if (dataToShowFamilyReferences.length == 0 && dataToShowPersonalReferences.length == 0) {
    ElMessage.error("Debe agregar al menos una referencia familiar o personal");
    return;
  }

  // creamos objeto que tendra dataToShowFamilyReferences, dataToShowPersonalReferences, userInfoId, isEdit, nextStep y step
  let data = {
    familyReferences: dataToShowFamilyReferences,
    personalReferences: dataToShowPersonalReferences,
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
      message: "Paso número seis completado y guardado correctamente",
    })

    await router.replace({
      query: { ...route.query, s: 7 },
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
        // recorremos el array de referencias familiares y lo agregamos al array dataToShowFamilyReferences
        resp.s6.familyReferences.forEach((element: { name: string; kinship: string; cellPhone: string; }) => {
          dataToShowFamilyReferences.push(element);
        });

        // recorremos el array de referencias personales y lo agregamos al array dataToShowPersonalReferences
        resp.s6.personalReferences.forEach((element: { name: string; kinship: string; cellPhone: string; }) => {
          dataToShowPersonalReferences.push(element);
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
    <h5 class="font-weight-bolder">Referencias personales y personales</h5>
    <p class="mb-0 text-sm">
      Ingresar las referencias personales y personales del agente
    </p>
    <div class="multisteps-form__content">
      <div class="mt-3 row">
        <div class="col-12 col-sm-6">
          <el-form
            label-position="top"
            ref="ruleFormRef"
            :model="ruleFormStep"
            status-icon
            class="demo-ruleForm"
          >
            <hr>
            <p>Referencias familiares</p>
            <hr>
            <el-form-item :label="'Nombre'" prop="name">
              <el-input v-model="ruleFormStep.familyReferences.name" />
            </el-form-item>

            <el-form-item label="Parentesco">
              <el-input v-model="ruleFormStep.familyReferences.kinship" />
            </el-form-item>

            <el-form-item label="Teléfono">
              <el-input v-model="ruleFormStep.familyReferences.cellPhone" />
            </el-form-item>

            <div class="button-row mt-3">
              <el-button type="primary" class="ms-auto" @click="addItemToArray('family')">
                Guardar referencia familiar
              </el-button>
            </div>
          </el-form>

          <el-form
            label-position="top"
            ref="ruleFormRef"
            :model="ruleFormStep"
            status-icon
            class="demo-ruleForm mt-3"
          >
            <hr>
            <p>Referencias personales</p>
            <hr>
            <el-form-item :label="'Nombre'" prop="namePersonal">
              <el-input v-model="ruleFormStep.personalReferences.name" />
            </el-form-item>

            <el-form-item label="Relación">
              <el-input v-model="ruleFormStep.personalReferences.kinship" />
            </el-form-item>

            <el-form-item label="Teléfono">
              <el-input v-model="ruleFormStep.personalReferences.cellPhone" />
            </el-form-item>

            <div class="button-row mt-3">
              <el-button type="primary" class="ms-auto" @click="addItemToArray('personal')">
                Guardar referencia personal
              </el-button>
            </div>
          </el-form>
        </div>
        <div class="col-12 col-sm-6 mt-3 mt-sm-0">
          <el-tabs v-model="activeNames" class="demo-tabs">
            <el-tab-pane label="Referencias familiares" name="first">
              <div v-if="dataToShowFamilyReferences.length > 0" class="overflow-auto" style="height: 800px">
                <div v-for="(item, index) in dataToShowFamilyReferences" :key="index" class="border rounded-3 p-3 text-sm my-target-bussines my-3">
                  <p><span class="font-weight-bold">Nombre: {{index + 1}}:</span> {{ item.name }}</p>
                  <p><span class="font-weight-bold">Parentesco: </span> {{ item.kinship }}</p>
                  <p><span class="font-weight-bold">Teléfono:</span> {{ item.cellPhone }}</p>

                  <div class="w-100 d-flex justify-content-end">
                    <button
                      type="button"
                      class="bg-white border-0"
                      @click="removeItemFromArray(index, 'family')"
                    >
                      <i class="fas fa-trash-alt text-danger"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else>
                <p class="mb-0 text-sm text-center">
                  No hay referencias familiares registradas
                </p>
              </div>
            </el-tab-pane>

            <el-tab-pane label="Referencias personales" name="second">
              <div v-if="dataToShowFamilyReferences.length > 0" class="overflow-auto" style="height: 800px">
                <div v-for="(item, index) in dataToShowPersonalReferences" :key="index" class="border rounded-3 p-3 text-sm my-target-bussines my-3">
                  <p><span class="font-weight-bold">Nombre: {{index + 1}}:</span> {{ item.name }}</p>
                  <p><span class="font-weight-bold">Parentesco: </span> {{ item.kinship }}</p>
                  <p><span class="font-weight-bold">Teléfono:</span> {{ item.cellPhone }}</p>

                  <div class="w-100 d-flex justify-content-end">
                    <button
                      type="button"
                      class="bg-white border-0"
                      @click="removeItemFromArray(index, 'personal')"
                    >
                      <i class="fas fa-trash-alt text-danger"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else>
                <p class="mb-0 text-sm text-center">
                  No hay referencias personales registradas
                </p>
              </div>
            </el-tab-pane>
          </el-tabs>
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
