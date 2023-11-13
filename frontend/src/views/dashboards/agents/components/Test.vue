<script setup lang="ts">
import { computed, onMounted, ref, Ref, watch } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { AlertState } from "@/types/app"
import { Plus } from "@element-plus/icons-vue"
import { object, string } from "yup"
import { v4 as uuidv4 } from "uuid"
import ListTest from "./ListTest.vue"
import { Form } from "vee-validate"
import yup from "@/utils/yup"
import { TestModule } from "@/store/modules/Tests"
import { AgentsModule } from "@/store/modules/Agents"
import api from "@/store/api/index"
import { ElLoading } from "element-plus"
import { DateTime } from "luxon"

interface items {
  question: string
  answer: string
  needResponse: boolean
  name: string
}
let loadingService: ReturnType<(typeof ElLoading)["service"]>

let arr: items[] = []
const text: Ref<items[]> = ref(arr)
const comment = ref("")

let schema = object({ name: string().required() })

const tests = computed(() => TestModule.getTestsList)
const testsByUser = computed(() => TestModule.getUserTestsList)
onMounted(() => {
  TestModule.pullTest()
  TestModule.pullUserTest()
})
const openModal = computed(() => TestModule.getOpenModal)
const openOverviewModal = computed(() => TestModule.getOverviewOpenModal)
const answerOverview = computed(() => TestModule.getAnswerOverview)

const test = computed(() => {
  schema = object({ name: string().required() })
  text.value = []
  let testDocument = TestModule.getDocument
  const schemaShape: { [k: string]: any } = {}
  testDocument?.questions.forEach((x, i) => {
    schemaShape["regularName" + i] = string().required(
      "Este campo es requerido"
    )
    text.value.push({
      question: x["label"],
      answer: "",
      needResponse: x["needResponse"],
      name: "regularName" + i,
    })
  })
  let schemaConcat = yup.object().shape(schemaShape)
  schema.concat(schemaConcat)
  return testDocument
})
// Methods

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("¿Esta seguro de cerrar esta prueba?")
    .then(() => {
      TestModule.setOpenModal(false)
      done()
    })
    .catch(() => {
      // catch error
    })
}
const handleCloseOverview = (done: () => void) => {
  TestModule.setOverviewOpenModal(false)
  done()
}
watch(
  () => TestModule.getLoading,
  loading => {
    if (loading)
      loadingService = ElLoading.service({
        lock: true,
        background: "rgba(0,0,0,.7)",
      })
    else !!loadingService && loadingService.close()
  }
)
const saveValues = () => {
  TestModule.setLoading(true)
  api
    .post("/psychic/register", {
      userID: AgentsModule.getAgentOverview?._id,
      testID: TestModule.getDocument?._id,
      comment: comment.value,
      answers: text.value,
    })
    .then(res => {
      TestModule.setLoading(false)
      TestModule.setDocument(undefined)
      TestModule.setOpenModal(false)
      TestModule.pullUserTest()
      text.value = []
      comment.value = ""
      if ((res.status = 201))
        ElMessage({
          type: "success",
          message: "Test realizado correctamente",
        })
    })
    .catch((e: any) => {
      TestModule.setLoading(false)
      console.error(e)
      ElMessage({
        type: "warning",
        message: "Test no insertado",
      })
      ElMessage({
        type: "warning",
        message: "ERR//" + e.message,
      })
    })
}

function addOnClick(e: number) {
  ElMessageBox.prompt("Ingrese su pregunta", "Pregunta nueva", {
    confirmButtonText: "Agregar",
    cancelButtonText: "Cancelar",
  })
    .then(({ value }) => {
      const value4 = uuidv4()
      text.value.splice(e + 1, 0, {
        question: value + " *",
        answer: "",
        needResponse: true,
        name: value4,
      })
      //  const `especialName${e+1}` = string().required('Este campo es requerido')
      //   schema.concat({ })
      ElMessage({
        type: "success",
        message: "Pregunta gregada correctamente",
      })
    })
    .catch(e => {
      console.warn("Error add question", e)
      ElMessage({
        type: "warning",
        message: `Cancelar agregar pregunta`,
      })
    })
  console.log("Add input ", e)
}
</script>
<template>
  <p class="text-sm">
    Este es un listado de los test que se pueden realizar al agente
  </p>
  <el-tabs model-value="first" class="demo-tabs">
    <el-tab-pane label="Test disponibles" name="first">
      <el-scrollbar max-height="400px">
        <div class="card-body pt-0 files-list">
          <hr class="horizontal dark my-2" />
          <template v-for="test in tests">
            <list-test :test="test" icon="fa-file-alt" />
            <hr class="horizontal dark my-2" />
          </template>
        </div>
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane label="Test realizados" name="second">
      <el-scrollbar max-height="400px">
        <div class="card-body pt-0 files-list">
          <hr class="horizontal dark my-2" />
          <template v-for="testUser in testsByUser">
            <list-test
              :test="testUser.test"
              icon="fa-file-contract"
              :state="AlertState.info"
              :isVisualization="true"
              :answerID="testUser._id"
              :createdAt="testUser.createdAt"
              :evaluatedBy="testUser?.createdBy?.username"
            />
            <hr class="horizontal dark my-2" />
          </template>
        </div>
      </el-scrollbar>
    </el-tab-pane>
  </el-tabs>
  <el-dialog
    :title="test?.name"
    v-model="openModal"
    :before-close="handleClose"
  >
    <p class="text-sm">
      {{ test?.indication }}
    </p>
    <Form
      class="w-100 px-4 py-2"
      @submit="(e: any) => saveValues()"
      :validation-schema="schema"
    >
      <div class="w-100">
        <div class="row mb-2">
          <div v-for="(item, index) in text">
            <div class="d-flex align-items-center justify-content-between mt-3">
              <p class="mb-0">
                <b>#{{ index + 1 }}</b> {{ item.question }}
              </p>
              <el-tooltip
                v-if="test?.dynamicInput === true"
                class="box-item"
                effect="dark"
                content="Agregar pregunta"
                placement="top"
                :show-after="2500"
              >
                <el-button
                  :icon="Plus"
                  size="small"
                  @click="addOnClick(index)"
                  circle
                />
              </el-tooltip>
            </div>

            <el-input
              v-if="item.needResponse === true"
              :name="item.name"
              class="mt--2"
              placeholder="Ingrese respuesta"
              v-model="item.answer"
            />
          </div>
          <p class="mb-0 mt-3"><b>Comentario</b></p>
          <el-input
            v-model="comment"
            :rows="5"
            type="textarea"
            placeholder="Escriba su comentario"
          />

          <el-row class="mt-4" justify="end">
            <el-col :span="4">
              <div class="grid-content ep-bg-purple" />
              <el-button
                type="primary"
                @click="saveValues()"
                native-type="submit"
                >Registrar Prueba</el-button
              >
            </el-col>
          </el-row>
        </div>
      </div>
    </Form>
  </el-dialog>
  <el-dialog
    :title="test?.name"
    v-model="openOverviewModal"
    :before-close="handleCloseOverview"
  >
  <p >
      {{ test?.indication }}
      <br>
      <i class="text-sm mt--2">
        Evaluado por {{ answerOverview?.createdBy?.username }} el
        {{
          DateTime.fromISO(answerOverview?.createdAt ?? "").toFormat(
            "dd/MM/yyyy hh:mm a"
        )
      }}
      </i>
      <hr>
    </p>

    <div class="w-100">
      <div class="row mb-2">
        <div v-for="(item, index) in answerOverview?.answers">
          <div class="d-flex flex-column mt-3">
            <div class="">
              <p class="mb-0">
                <b>#{{ index + 1 }}</b> {{ item.question }}
              </p>
            </div>
            <div class="">
              <p class="mb-0 mx-4" v-if="item.answer !== ''">
                <b>R// </b> {{ item.answer }}
              </p>
            </div>
          </div>
        </div>
        <el-row class="mt-4 mb-4" justify="start">
          <el-col>
            <p class="mb-0 mt-3"><b>Comentario</b></p>
            <p class="mb-0 mt-3">{{ answerOverview?.comment }}</p>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>
<style>
.btn-upload {
  background-color: white;
  color: var(--primary);
  border-style: dashed;
}
.files-list .el-collapse-item__header,
.files-list .el-collapse {
  border: 0;
}
</style>
