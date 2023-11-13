<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { useRoute, useRouter } from "vue-router"
import { AgentsModule } from "@/store/modules/Agents"
import { vMaska } from "maska"

const ruleFormRef = ref<FormInstance>()
const emit = defineEmits<{
  (e: "prev"): void
  (e: "next"): void
}>()

const router = useRouter()
const route = useRoute()
const ruleFormStep = reactive({
  userInfoId: "",
  height: "",
  weight: "",
  face: "",
  lips: "",
  eyesColor: "",
  hairTypeColor: "",
  nose: "",
  skinColor: "",
  specialSings: "",
  tattos: "",
  job: "",
  salary: "",
  isEdit: false,
  nextStep: 3,
})

const rulesStep2 = reactive<FormRules>({
  height: [
    {
      required: true,
      message: "El campo altura es requerido",
      trigger: "blur",
    },
  ],
  tattos: [
    {
      required: true,
      message: "El campo tatuajes es requerido",
      trigger: "blur",
    },
  ],
  job: [
    {
      required: true,
      message: "El campo aspiraciones laborales es requerido",
      trigger: "blur",
    },
  ],
})

async function handleSubmit() {
  const userInfoId = route.query.uII
  const userId = route.query.uI
  if (!userId || !userInfoId) {
    await router.replace({
      query: { ...route.query, s: 1 },
    })
    emit("prev")
  }

  await ruleFormRef.value?.validate(async (valid, fields) => {
    if (!valid) return
    ruleFormStep.userInfoId = userInfoId.toString() || ""
    const { success, reply } = await AgentsModule.createAgentStep2(ruleFormStep)
    if (!success)
      return ElMessage.error(
        "Error: No se pudo guardar la información, favor revisar los datos o ponerse en contacto con el administrador"
      )
    else if (reply && reply.data.status === true) {
      ElMessage({
        type: "success",
        message: "Paso número dos completado y guardado correctamente",
      })

      await router.replace({
        query: { ...route.query, s: 3 },
      })
      emit("next")
    }
  })
}

onMounted(async () => {
  // si en el query parameter viene uI y uII significa que es una edición y rellenamos los campos
  const { uI, uII, edit } = route.query
  let auxNextStep = null

  if (uI && uII) {
    await AgentsModule.getOneAgent({ userId: uI.toString() }).then(resp => {
      if (resp) {
        ruleFormStep.userInfoId = resp.s2._id ?? ""
        ruleFormStep.height = resp.s2.height ?? ""
        ruleFormStep.weight = resp.s2.weight ?? ""
        ruleFormStep.face = resp.s2.face ?? ""
        ruleFormStep.lips = resp.s2.lips ?? ""
        ruleFormStep.eyesColor = resp.s2.eyesColor ?? ""
        ruleFormStep.hairTypeColor = resp.s2.hairTypeColor ?? ""
        ruleFormStep.nose = resp.s2.nose ?? ""
        ruleFormStep.skinColor = resp.s2.skinColor ?? ""
        ruleFormStep.specialSings = resp.s2.specialSings ?? ""
        ruleFormStep.tattos = resp.s2.tattos ?? ""
        ruleFormStep.job = resp.s2.job ?? ""
        ruleFormStep.salary = resp.s2.salary ?? ""

        auxNextStep = resp?.nextStep;
      }
    })

    // si en query parameter viene edit significa que es una edición
    console.log({auxNextStep})
    if (edit && edit === "true" || (auxNextStep && auxNextStep >= ruleFormStep.nextStep)) {
      console.log("es edición, 2")
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
    <h5 class="font-weight-bolder">Descripción física</h5>
    <p class="mb-0 text-sm">Completar información relacionados al trabajador</p>
    <div class="multisteps-form__content">
      <div class="mt-3">
        <el-form
          label-position="top"
          ref="ruleFormRef"
          :model="ruleFormStep"
          status-icon
          :rules="rulesStep2"
          class="demo-ruleForm d-flex flex-wrap"
        >
          <div class="row w-100 px-3">
            <el-form-item class="col-6 col-sm-3" label="Estatura (mts)" prop="height">
              <el-input v-model="ruleFormStep.height" />
            </el-form-item>

            <el-form-item class="col-6 col-sm-3" label="Peso (lbs)">
              <el-input v-model="ruleFormStep.weight" />
            </el-form-item>

            <el-form-item class="col-6 col-sm-3" label="Cara">
              <el-input v-model="ruleFormStep.face" />
            </el-form-item>

            <el-form-item class="col-6 col-sm-3" label="Labios">
              <el-input v-model="ruleFormStep.lips" />
            </el-form-item>

            <el-form-item class="col-6 col-sm-3" label="Color de ojos">
              <el-input v-model="ruleFormStep.eyesColor" />
            </el-form-item>

            <el-form-item class="col-6 col-sm-3" label="Tipo y color de cabello">
              <el-input v-model="ruleFormStep.hairTypeColor" />
            </el-form-item>

            <el-form-item class="col-6 col-sm-3" label="Color de piel">
              <el-input v-model="ruleFormStep.skinColor" />
            </el-form-item>

            <el-form-item class="col-6 col-sm-3" label="Nariz">
              <el-input v-model="ruleFormStep.nose" />
            </el-form-item>

            <el-form-item class="col-9" label="Señales especiales" prop="gender">
              <el-radio-group v-model="ruleFormStep.specialSings">
                <el-radio label="Si" class="pe-5" />
                <el-radio label="No" />
              </el-radio-group>
            </el-form-item>

           <div v-if="ruleFormStep.specialSings == 'Si'">
             <el-form-item class="col-8" prop="tattos" label="Tatuajes (Ubicación, tipo, significado para la persona)">
               <el-input v-model="ruleFormStep.tattos" />
             </el-form-item>
           </div>

            <el-form-item class="col-6 col-sm-4" prop="job" label="Empleo solicitado">
              <el-input v-model="ruleFormStep.job" />
            </el-form-item>

            <el-form-item class="col-6 col-sm-3" label="Pretención salarial">
              <el-input v-model="ruleFormStep.salary" />
            </el-form-item>
          </div>

          <div class="button-row d-flex w-100">
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
