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
  "master": {
    institution: "",
    place: "",
    date: "",
    title: "",
  },
  "university": {
    institution: "",
    place: "",
    date: "",
    title: "",
  },
  "certified": {
    institution: "",
    place: "",
    date: "",
    title: "",
  },
  "highSchool": {
    institution: "",
    place: "",
    date: "",
    title: "",
  },
  "thirdCycle": {
    institution: "",
    place: "",
    date: "",
    title: "",
  },
  "secondCycle": {
    institution: "",
    place: "",
    date: "",
    title: "",
  },
  "firstCycle": {
    institution: "",
    place: "",
    date: "",
    title: "",
  },
  "previousJob": {
    institution: "",
    place: "",
    date: "",
    title: "",
  },
  "militaryService": {
    institution: "",
    place: "",
    date: "",
    title: "",
  },
  "currentlyStudying": {
    isStudying: false,
    place: "",
    name: "",
    title: "",
  },
  // isEditing: false,
  userInfoId: "",
  userId: "",
  nextStep: 4,
  isEdit: false,
})

const rulesStep = reactive<FormRules>({

})

async function handleSubmit() {
  const userInfoId = route.query.uII
  const userId = route.query.uI
  if (!userId || !userInfoId) return

  await ruleFormRef.value?.validate(async (valid, fields) => {
    if (!valid) return
    ruleFormStep.userInfoId = userInfoId.toString() || ""
    ruleFormStep.userId = userId.toString() || ""
    const { success, reply } = await AgentsModule.createAgentStep3({
      ...ruleFormStep,
    })
    if (!success)
      return ElMessage.error(
        "Error: No se pudo guardar la información, favor revisar los datos o ponerse en contacto con el administrador"
      )
    else if (reply && reply.data.status === true) {
      ElMessage({
        type: "success",
        message: "El paso número tres ha sido completado y guardado con éxito",
      })

      await router.replace({
        query: { ...route.query, s: 4 },
      })

      emit("next")
    }
  })
}

onMounted(async () => {
  // si en el query parameter viene uI y uII significa que es una edición y rellenamos los campos
  const { uI, uII, edit } = route.query
  let auxNextStep = null;

  if (uI && uII) {
    await AgentsModule.getOneAgent({userId: uI.toString()}).then(resp => {
      if (resp) {
        // console.log({resp});
        ruleFormStep.userInfoId = resp.s3._id ?? ""
        ruleFormStep.userId = resp.s3?.userId ?? ""
        ruleFormStep.master = resp.s3?.master ?? { title: "", date: "", institution: "", place: "" }
        ruleFormStep.university = resp.s3?.university ?? { title: "", date: "", institution: "", place: "" }
        ruleFormStep.certified = resp.s3?.certified ?? { title: "", date: "", institution: "", place: "" }
        ruleFormStep.highSchool = resp.s3?.highSchool ?? { title: "", date: "", institution: "", place: "" }
        ruleFormStep.thirdCycle = resp.s3?.thirdCycle ?? { title: "", date: "", institution: "", place: "" }
        ruleFormStep.secondCycle = resp.s3?.secondCycle ?? { title: "", date: "", institution: "", place: "" }
        ruleFormStep.firstCycle = resp.s3?.firstCycle ?? { title: "", date: "", institution: "", place: "" }
        ruleFormStep.previousJob = resp.s3?.previousJob ?? { title: "", date: "", institution: "", place: "" }
        ruleFormStep.militaryService = resp.s3?.militaryService ?? { title: "", date: "", institution: "", place: "" }
        ruleFormStep.currentlyStudying = resp.s3?.currentlyStudying ?? { title: "", name: "", place: "", isStudying: false }

        auxNextStep = resp?.nextStep;
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
    <h5 class="font-weight-bolder">Formación Académica</h5>
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
                <h6>Maestría</h6>
              </template>
              <div class="row px-3">
                <el-form-item class="col-6 col-sm-3" label="Centro educativo">
                  <el-input v-model="ruleFormStep.master.institution" />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Lugar">
                  <el-input v-model="ruleFormStep.master.place" />
                </el-form-item>
                <el-form-item
                  class="col-6 col-sm-3"
                  label="Fecha"
                >
                  <el-date-picker
                    v-model="ruleFormStep.master.date"
                    type="date"
                    label="Fecha"
                    placeholder="Seleccionar fecha"
                    format="DD/MM/YYYY"
                  />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Título">
                  <el-input v-model="ruleFormStep.master.title" />
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item name="2">
              <template #title>
                <h6>Universitaria</h6>
              </template>
              <div class="row px-3">
                <el-form-item class="col-6 col-sm-3" label="Centro educativo">
                  <el-input v-model="ruleFormStep.university.institution" />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Lugar">
                  <el-input v-model="ruleFormStep.university.place" />
                </el-form-item>
                <el-form-item
                  class="col-6 col-sm-3"
                  label="Fecha"
                >
                  <el-date-picker
                    v-model="ruleFormStep.university.date"
                    type="date"
                    label="Fecha"
                    placeholder="Seleccionar fecha"
                    format="DD/MM/YYYY"
                  />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Título">
                  <el-input v-model="ruleFormStep.university.title" />
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item name="3">
              <template #title>
                <h6>Diplomado, técnico</h6>
              </template>
              <div class="row px-3">
                <el-form-item class="col-6 col-sm-3" label="Centro educativo">
                  <el-input v-model="ruleFormStep.certified.institution" />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Lugar">
                  <el-input v-model="ruleFormStep.certified.place" />
                </el-form-item>
                <el-form-item
                  class="col-6 col-sm-3"
                  label="Fecha"
                >
                  <el-date-picker
                    v-model="ruleFormStep.certified.date"
                    type="date"
                    label="Fecha"
                    placeholder="Seleccionar fecha"
                    format="DD/MM/YYYY"
                  />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Título">
                  <el-input v-model="ruleFormStep.certified.title" />
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item name="4">
              <template #title>
                <h6>Bachillerato</h6>
              </template>
              <div class="row px-3">
                <el-form-item class="col-6 col-sm-3" label="Centro educativo">
                  <el-input v-model="ruleFormStep.highSchool.institution" />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Lugar">
                  <el-input v-model="ruleFormStep.highSchool.place" />
                </el-form-item>
                <el-form-item
                  class="col-6 col-sm-3"
                  label="Fecha"
                >
                  <el-date-picker
                    v-model="ruleFormStep.highSchool.date"
                    type="date"
                    label="Fecha"
                    placeholder="Seleccionar fecha"
                    format="DD/MM/YYYY"
                  />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Título">
                  <el-input v-model="ruleFormStep.highSchool.title" />
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item name="5">
              <template #title>
                <h6>Tercer ciclo</h6>
              </template>
              <div class="row px-3">
                <el-form-item class="col-6 col-sm-3" label="Centro educativo">
                  <el-input v-model="ruleFormStep.thirdCycle.institution" />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Lugar">
                  <el-input v-model="ruleFormStep.thirdCycle.place" />
                </el-form-item>
                <el-form-item
                  class="col-6 col-sm-3"
                  label="Fecha"
                >
                  <el-date-picker
                    v-model="ruleFormStep.thirdCycle.date"
                    type="date"
                    label="Fecha"
                    placeholder="Seleccionar fecha"
                    format="DD/MM/YYYY"
                  />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Título">
                  <el-input v-model="ruleFormStep.thirdCycle.title" />
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item name="6">
              <template #title>
                <h6>Segundo ciclo</h6>
              </template>
              <div class="row px-3">
                <el-form-item class="col-6 col-sm-3" label="Centro educativo">
                  <el-input v-model="ruleFormStep.secondCycle.institution" />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Lugar">
                  <el-input v-model="ruleFormStep.secondCycle.place" />
                </el-form-item>
                <el-form-item
                  class="col-6 col-sm-3"
                  label="Fecha"
                >
                  <el-date-picker
                    v-model="ruleFormStep.secondCycle.date"
                    type="date"
                    label="Fecha"
                    placeholder="Seleccionar fecha"
                    format="DD/MM/YYYY"
                  />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Título">
                  <el-input v-model="ruleFormStep.secondCycle.title" />
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item name="7">
              <template #title>
                <h6>Primer ciclo</h6>
              </template>
              <div class="row px-3">
                <el-form-item class="col-6 col-sm-3" label="Centro educativo">
                  <el-input v-model="ruleFormStep.firstCycle.institution" />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Lugar">
                  <el-input v-model="ruleFormStep.firstCycle.place" />
                </el-form-item>
                <el-form-item
                  class="col-6 col-sm-3"
                  label="Fecha"
                >
                  <el-date-picker
                    v-model="ruleFormStep.firstCycle.date"
                    type="date"
                    label="Fecha"
                    placeholder="Seleccionar fecha"
                    format="DD/MM/YYYY"
                  />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Título">
                  <el-input v-model="ruleFormStep.firstCycle.title" />
                </el-form-item>
              </div>
            </el-collapse-item>
            <!-- Oficio -->
            <el-collapse-item name="8">
              <template #title>
                <h6>Oficio</h6>
              </template>
              <div class="row px-3">
                <el-form-item class="col-6 col-sm-3" label="Centro educativo">
                  <el-input v-model="ruleFormStep.previousJob.institution" />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Lugar">
                  <el-input v-model="ruleFormStep.previousJob.place" />
                </el-form-item>
                <el-form-item
                  class="col-6 col-sm-3"
                  label="Fecha"
                >
                  <el-date-picker
                    v-model="ruleFormStep.previousJob.date"
                    type="date"
                    label="Fecha"
                    placeholder="Seleccionar fecha"
                    format="DD/MM/YYYY"
                  />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Título">
                  <el-input v-model="ruleFormStep.previousJob.title" />
                </el-form-item>
              </div>
            </el-collapse-item>
            <!-- servicio militar -->
            <el-collapse-item name="9">
              <template #title>
                <h6>Servicio militar</h6>
              </template>
              <div class="row px-3">
                <el-form-item class="col-6 col-sm-3" label="Centro educativo">
                  <el-input v-model="ruleFormStep.militaryService.institution" />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Lugar">
                  <el-input v-model="ruleFormStep.militaryService.place" />
                </el-form-item>
                <el-form-item
                  class="col-6 col-sm-3"
                  label="Fecha"
                >
                  <el-date-picker
                    v-model="ruleFormStep.militaryService.date"
                    type="date"
                    label="Fecha"
                    placeholder="Seleccionar fecha"
                    format="DD/MM/YYYY"
                  />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Título">
                  <el-input v-model="ruleFormStep.militaryService.title" />
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item name="10">
              <template #title>
                <h6>Estudio actual</h6>
              </template>
              <div class="row">
                <div>
                  <el-form-item class="col-9" label="¿Actualmente estudia?" prop="gender">
                    <el-radio-group v-model="ruleFormStep.currentlyStudying.isStudying">
                      <el-radio :label="true" class="pe-5">Si</el-radio>
                      <el-radio :label="false">No</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <el-form-item class="col-6 col-sm-3" label="Lugar">
                  <el-input v-model="ruleFormStep.currentlyStudying.place" />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Nombre carrera o técnico">
                  <el-input v-model="ruleFormStep.currentlyStudying.name" />
                </el-form-item>
                <el-form-item class="col-6 col-sm-3" label="Título">
                  <el-input v-model="ruleFormStep.currentlyStudying.title" />
                </el-form-item>
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
