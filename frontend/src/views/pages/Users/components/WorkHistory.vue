<script setup lang="ts">
import { AgentsModule } from "@/store/modules/Agents"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { onMounted, reactive, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()
const activeNames = ref(['1'])
const ruleFormRef = ref<FormInstance>()

const emit = defineEmits<{
  (e: "prev"): void
  (e: "next"): void
}>()

let auxStep = ref(5)
let auxNextStep = ref(6)
let auxIsEdit = ref(false)

let showOtherExitReason = ref(false)
const ruleFormStep = reactive({
  companyName: "",
  address: "",
  activity: "",
  telephone: [],
  immediateBoss: "",
  positionCompany: "",
  exitReason: "",
  otherExitReason: "",
  entryDate: "",
  exitDate: "",
})

let dataToShow: { companyName: string, address: string, activity: string, positionCompany: string, telephone: never[], immediateBoss: string, exitReason: string, otherExitReason: string, entryDate: string, exitDate: string }[] = reactive([]);

const rulesStep = reactive<FormRules>({
  companyName: [
    { required: true, message: "Por favor ingrese el nombre de la empresa", trigger: "blur" },
  ],
  immediateBoss: [
    { required: true, message: "Por favor ingrese el nombre del jefe inmediato", trigger: "blur" },
  ],
})

// watch que mira el valor de ruleFormStep.exitReason y si es igual a "Otro" muestra el input para ingresar el motivo de retiro
watch(() => ruleFormStep.exitReason, (val) => {
  showOtherExitReason.value = val === "Otro";
})

async function addItemToArray() {
  await ruleFormRef.value?.validate(async (valid, fields) => {
    if (!valid) return

    // Agregar el item al array
    dataToShow.push({
      companyName: ruleFormStep.companyName,
      address: ruleFormStep.address,
      activity: ruleFormStep.activity,
      telephone: ruleFormStep.telephone,
      positionCompany: ruleFormStep.positionCompany,
      immediateBoss: ruleFormStep.immediateBoss,
      exitReason: ruleFormStep.exitReason,
      otherExitReason: ruleFormStep.otherExitReason,
      entryDate: ruleFormStep.entryDate,
      exitDate: ruleFormStep.exitDate,
    });

    // Limpiar el formulario
    setTimeout(() => {
      ruleFormStep.companyName = "";
      ruleFormStep.address = "";
      ruleFormStep.activity = "";
      ruleFormStep.telephone = [];
      ruleFormStep.positionCompany = "";
      ruleFormStep.immediateBoss = "";
      ruleFormStep.exitReason = "";
      ruleFormStep.otherExitReason = "";
      ruleFormStep.entryDate = "";
      ruleFormStep.exitDate = "";
    }, 1000);

    // Mostrar mensaje de éxito
    ElMessage.success("Empresa agregada");
  })
}

function removeItemFromArray(index: number) {
  dataToShow.splice(index, 1);
}

function getIndexHistory() {
  return dataToShow.length + 1;
}

async function handleSubmit() {
  const userInfoId = route.query.uII
  const userId = route.query.uI
  // verificamos que dataToShow tenga al menos un item
  if (dataToShow.length === 0) {
    ElMessage.error("Debe agregar al menos un antecedente laboral");
    return;
  }

  // camibamos el exitReason si es Otro y hay texto en otherExitReason
  dataToShow.forEach((item) => {
    if (item.exitReason === "Otro" && item.otherExitReason !== "") {
      item.exitReason = item.otherExitReason;
    }
  });
  // creamos objeto que tendra dataToSHow y userInfoId, isEdit, nextStep y step
  const data = {
    workHistory: dataToShow,
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
      message: "Paso número cinco completado y guardado correctamente",
    })

    await router.replace({
      query: { ...route.query, s: 6 },
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
        // recorremos el arreglo resp.s5?.workHistory y lo agregamos a dataToShow
        resp.s5?.workHistory?.forEach((item) => {
          dataToShow.push({
            companyName: item.companyName,
            address: item.address,
            activity: item.activity,
            telephone: item.telephone,
            positionCompany: item.positionCompany,
            immediateBoss: item.immediateBoss,
            exitReason: item.exitReason,
            otherExitReason: item.otherExitReason,
            entryDate: item.entryDate,
            exitDate: item.exitDate,
          });
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
    <h5 class="font-weight-bolder">Antecedentes laborales</h5>
    <p class="mb-0 text-sm">
      Ingresar el historial laboral del agente
    </p>
    <div class="multisteps-form__content">
      <div class="mt-3 row">
        <el-form
          label-position="top"
          ref="ruleFormRef"
          :model="ruleFormStep"
          status-icon
          :rules="rulesStep"
          class="demo-ruleForm col-12 col-sm-6"
        >
          <el-form-item :label="'Nombre de la empresa ' + getIndexHistory()" prop="companyName">
            <el-input v-model="ruleFormStep.companyName" />
          </el-form-item>

          <el-form-item label="Dirección">
            <el-input v-model="ruleFormStep.address" />
          </el-form-item>

          <el-form-item label="Actividad de la empresa">
            <el-input v-model="ruleFormStep.activity" />
          </el-form-item>

          <p>Teléfono para verificar datos</p>
          <div class="row">
            <el-form-item class="col-6 col-sm-4">
              <el-input v-model="ruleFormStep.telephone[0]" placeholder="Teléfono 1" />
            </el-form-item>
            <el-form-item class="col-6 col-sm-4">
              <el-input v-model="ruleFormStep.telephone[1]" placeholder="Teléfono 2" />
            </el-form-item>
            <el-form-item class="col-6 col-sm-4">
              <el-input v-model="ruleFormStep.telephone[2]" placeholder="Teléfono 3" />
            </el-form-item>
          </div>

          <el-form-item label="Jefe inmediato (Nombre y cargo)" prop="immediateBoss">
            <el-input v-model="ruleFormStep.immediateBoss" />
          </el-form-item>

          <el-form-item label="Cargo o puesto que desempeño">
            <el-input v-model="ruleFormStep.positionCompany" />
          </el-form-item>

          <p>Motivo de retiro</p>
          <div>
            <el-radio-group v-model="ruleFormStep.exitReason">
              <el-radio class="me-3 mt-2" label="Despido" size="large" border>Despido</el-radio>
              <el-radio class="me-3 mt-2" label="Renuncia" size="large" border>Renuncia</el-radio>
              <el-radio class="me-3 mt-2" label="Abandono" size="large" border>Abandono</el-radio>
              <el-radio class="mt-2" label="Otro" size="large" border>Otro</el-radio>
            </el-radio-group>
          </div>

          <el-form-item v-if="showOtherExitReason" class="mt-1" label="Otro (Explique)">
            <el-input v-model="ruleFormStep.otherExitReason" />
          </el-form-item>

          <div class="row mt-3">
            <el-form-item label="Fecha de ingreso" class="col-6">
              <el-date-picker
                v-model="ruleFormStep.entryDate"
                type="date"
                placeholder="Ingresar fecha de ingreso"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item label="Fecha de retiro" class="col-6">
              <el-date-picker
                v-model="ruleFormStep.exitDate"
                type="date"
                placeholder="Ingresar fecha de retiro"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </div>
          <div class="button-row mt-3">
            <el-button type="primary" class="ms-auto" @click="addItemToArray">
              Guardar empresa {{ dataToShow.length + 1}}
            </el-button>
          </div>
        </el-form>
        <!-- Mostramos la información que el usuario vaya ingresando v-if="dataToShow.length > 1" -->
        <div class="col-12 mt-3 mt-sm-0 col-sm-6">
          <div v-if="dataToShow.length > 0" class="overflow-auto" style="height: 800px">
            <div v-for="(item, index) in dataToShow" :key="index" class="border rounded-3 p-3 text-sm my-target-bussines my-3">
              <p><span class="font-weight-bold">Nombre empresa {{index + 1}}:</span> {{ item.companyName }}</p>
              <p><span class="font-weight-bold">Dirección:</span> {{ item.address }}</p>
              <p><span class="font-weight-bold">Actividad de la empresa:</span> {{ item.activity }}</p>
              <p><span class="font-weight-bold">Teléfono:</span> {{ item.telephone[0] }}, {{ item.telephone[1] }}, {{ item.telephone[2] }}</p>
              <p><span class="font-weight-bold">Jefe inmediato:</span> {{ item.immediateBoss }}</p>
              <p><span class="font-weight-bold">Cargo:</span> {{ item.positionCompany }}</p>
              <p><span class="font-weight-bold">Motivo de retiro:</span> {{ item.exitReason }}</p>
              <div class="row custom-dates-bussines-information">
                <p class="col-5"><span class="font-weight-bold">Fecha de ingreso:</span> {{ item.entryDate }}</p>
                <p class="col-5"><span class="font-weight-bold">Fecha de retiro:</span> {{ item.exitDate }}</p>
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
              Ingresa información sobre las experiencias laborales del agente
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

<style>
.my-target-bussines p {
  line-height: 80%;
  font-size: 14px;
}
.custom-dates-bussines-information p {
  line-height: 100% !important;
}
</style>