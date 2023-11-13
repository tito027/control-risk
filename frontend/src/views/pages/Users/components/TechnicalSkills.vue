<script setup lang="ts">
import { AgentsModule } from "@/store/modules/Agents"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { reactive, watch, ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()
const activeNames = ref(['1'])
const ruleFormRef = ref<FormInstance>()

const emit = defineEmits<{
  (e: "prev"): void
  (e: "next"): void
}>()

const ruleFormStep = reactive({
  "computerKnowledge": {
    "word": "",
    "excel": "",
    "powerPoint": "",
    "access": "",
    "other": "",
  },
  "englishKnowledge": {
    "englisRead": "",
    "englishWrite": "",
    "englishSpeak": "",
    "otherLanguages": "",
  },
  "otherSkills": {
    "computer": "",
    "fax": "",
    "telephonePlant": "",
    "photocopier": "",
    "contometer": "",
    "proyector": "",
    "extinguisher": "",
    "powerPlant": "",
    "cctv": "",
    "alarms": "",
    "vehicle": "",
    "truck": "",
    "motorcycle": "",
    "trailer": "",
    "forklift": "",
    "bicycle": "",
    "crane": "",
    "firearms": "",
    "electricalConnections": "",
    "others": "",
  },
  userInfoId: "",
  nextStep: 5,
  isEdit: false,
  step: 4,
})

const rulesStep = reactive<FormRules>({

})

async function handleSubmit() {
  const userInfoId = route.query.uII
  const userId = route.query.uI

  if (!userId || !userInfoId) return

  ruleFormStep.userInfoId = userInfoId.toString() || ""

  const { success, reply } = await AgentsModule.createAgentBySteps(ruleFormStep)

  if (!success)
    return ElMessage.error(
      "Error: No se pudo guardar la información, favor revisar los datos o ponerse en contacto con el administrador"
    )
  else if (reply && reply.data.status === true) {
    ElMessage({
      type: "success",
      message: "Paso número cuatro completado y guardado correctamente",
    })

    await router.replace({
      query: { ...route.query, s: 5 },
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
        ruleFormStep.userInfoId = resp.s4._id ?? ""
        ruleFormStep.computerKnowledge = resp.s4?.computerKnowledge ?? { word: "", excel: "", powerPoint: "", access: "", other: "" }
        ruleFormStep.englishKnowledge = resp.s4?.englishKnowledge ?? { englisRead: "", englishWrite: "", englishSpeak: "", otherLanguages: ""}
        ruleFormStep.otherSkills = resp.s4?.otherSkills ?? { computer: "", fax: "", telephonePlant: "", photocopier: "", contometer: "", proyector: "", extinguisher: "", powerPlant: "", cctv: "", alarms: "", vehicle: "", truck: "", motorcycle: "", trailer: "", forklift: "", bicycle: "", crane: "", firearms: "", electricalConnections: "", others: "" }

        auxNextStep = resp?.nextStep
      }
    })

    // si en query parameter viene edit significa que es una edición
    if (edit && edit === "true" || (auxNextStep && auxNextStep >= ruleFormStep.nextStep)) {
      ruleFormStep.isEdit = true
    }
  }
})
</script>

<template>
  <div
    class="card multisteps-form__panel p-3 border-radius-xl bg-white"
    data-animation="FadeIn"
  >
    <h5 class="font-weight-bolder">Habilidades técnicas</h5>
    <p class="mb-0 text-sm">
      Selecciona las habilidades técnicas que posee el trabajador
    </p>
    <div class="multisteps-form__content">
      <div class="mt-3">
        <el-form
          label-position="top"
          ref="ruleFormRef"
          :model="ruleFormStep"
          status-icon
          :rules="rulesStep"
          class="demo-ruleForm"
        >
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
              <template #title>
                <h6>Conocimientos de computación</h6>
              </template>
              <p class="mb-0 text-sm" style="text-decoration: underline">
                Selecciona los conocimientos de computación que posee el trabajador
              </p>
              <div>
                <el-checkbox class="m-3" v-model="ruleFormStep.computerKnowledge.word" :label="true" size="large" border >Word</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.computerKnowledge.excel" :label="true" size="large" border >Excel</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.computerKnowledge.powerPoint" :label="true" size="large" border >Power Point</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.computerKnowledge.access" :label="true" size="large" border >Access</el-checkbox>
              </div>
              <div>
                <p>Otros (detallar)</p>
                <el-input v-model="ruleFormStep.computerKnowledge.other" placeholder="Ingresar conocimiento de computación" />
              </div>
            </el-collapse-item>
            <el-collapse-item name="2">
              <template #title>
                <h6>Conocimiento del idioma inglés u otros</h6>
              </template>
              <p class="mb-0 text-sm" style="text-decoration: underline">
                Seleecinona los conocimientos de idiomas que posee el trabajador
              </p>
              <div>
                <el-checkbox class="m-3" v-model="ruleFormStep.englishKnowledge.englisRead" :label="true" size="large" border >Lee inglés</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.englishKnowledge.englishWrite" :label="true" size="large" border >Escribe inglés</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.englishKnowledge.englishSpeak" :label="true" size="large" border >Habla inglés</el-checkbox>
              </div>
              <div>
                <p>Otros idiomas (detallar)</p>
                <el-input v-model="ruleFormStep.englishKnowledge.otherLanguages" placeholder="Detallar otros idiomas" />
              </div>
            </el-collapse-item>
            <el-collapse-item name="3">
              <template #title>
                <h6>Otras habilidades</h6>
              </template>
              <p class="mb-0 text-sm" style="text-decoration: underline">
                Selecciona las otras habilidades que posee el trabajador
              </p>
              <div>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.computer" :label="true" size="large" border >Computadora</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.fax" :label="true" size="large" border >Fax</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.telephonePlant" :label="true" size="large" border >Planta telefónica</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.photocopier" :label="true" size="large" border >Fotocopiador</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.contometer" :label="true" size="large" border >Contómetro</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.proyector" :label="true" size="large" border >Proyector</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.extinguisher" :label="true" size="large" border >Extintor</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.powerPlant" :label="true" size="large" border >Planta eléctrica</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.cctv" :label="true" size="large" border >CCTV</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.alarms" :label="true" size="large" border >Alarmas</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.vehicle" :label="true" size="large" border >Vehículos</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.truck" :label="true" size="large" border >Camión</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.motorcycle" :label="true" size="large" border >Motocicletas</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.trailer" :label="true" size="large" border >Trailer</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.forklift" :label="true" size="large" border >Montacargas</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.bicycle" :label="true" size="large" border >Bicicleta</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.crane" :label="true" size="large" border >Grua</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.firearms" :label="true" size="large" border >Armas de fuego</el-checkbox>
                <el-checkbox class="m-3" v-model="ruleFormStep.otherSkills.electricalConnections" :label="true" size="large" border >Conexiones eléctricas</el-checkbox>
              </div>
              <div>
                <p>Indique otras habilidades que posea</p>
                <el-input v-model="ruleFormStep.otherSkills.others" placeholder="Detallar otras habilidades" />
              </div>
            </el-collapse-item>
          </el-collapse>
          <div class="button-row d-flex w-100 mt-4">
            <el-button type="default" @click="$emit('prev')"> Atrás </el-button>
            <el-button type="primary" class="ms-auto" @click="handleSubmit">
              Siguiente
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
