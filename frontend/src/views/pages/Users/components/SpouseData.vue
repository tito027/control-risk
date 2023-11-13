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

const ruleFormStep = reactive({
  userId: "",
  userInfoId: "",
  cohabitant: {
    name: "",
    age: "",
    birthdate: "",
    dui: "",
    job: "",
    workplace: "",
    address: "",
    position: "",
    salary: "",
    officePhone: "",
    cellPhone: "",
  },
  step: 8,
  isEdit: false,
})

const rulesStep = reactive({

})

async function handleSubmit() {
  const userInfoId = route.query.uII ?? ""
  const userId = route.query.uI ?? ""

  ruleFormStep.userInfoId = userInfoId.toString() || ""
  ruleFormStep.userId = userId.toString() || ""

  const { success, reply } = await AgentsModule.createAgentBySteps(ruleFormStep)

  if (!success)
    return ElMessage.error(
      "Error: No se pudo guardar la información, favor revisar los datos o ponerse en contacto con el administrador"
    )
  else if (reply && reply.data.status === true) {
    ElMessage({
      type: "success",
      message: "Paso número ocho completado y guardado correctamente",
    })

    await router.replace({
      query: { ...route.query, s: 9 },
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
        ruleFormStep.userInfoId = resp.s8._id ?? ""
        ruleFormStep.cohabitant.name = resp.s8.cohabitant.name ?? ""
        ruleFormStep.cohabitant.age = resp.s8.cohabitant.age ?? ""
        ruleFormStep.cohabitant.birthdate = resp.s8.cohabitant.birthdate ?? ""
        ruleFormStep.cohabitant.dui = resp.s8.cohabitant.dui ?? ""
        ruleFormStep.cohabitant.job = resp.s8.cohabitant.job ?? ""
        ruleFormStep.cohabitant.workplace = resp.s8.cohabitant.workplace ?? ""
        ruleFormStep.cohabitant.address = resp.s8.cohabitant.address ?? ""
        ruleFormStep.cohabitant.position = resp.s8.cohabitant.position ?? ""
        ruleFormStep.cohabitant.salary = resp.s8.cohabitant.salary ?? ""
        ruleFormStep.cohabitant.officePhone = resp.s8.cohabitant.officePhone ?? ""
        ruleFormStep.cohabitant.cellPhone = resp.s8.cohabitant.cellPhone ?? ""
      }
    })

    // si en query parameter viene edit significa que es una edición
    if (edit && edit === "true") {
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
    <h5 class="font-weight-bolder">Datos del cónyugue o conviviente</h5>
    <p class="mb-0 text-sm">
      Complete la información solicitada
    </p>
    <div class="multisteps-form__content">
      <div class="mt-3">
        <el-form
          label-position="top"
          ref="ruleFormRef"
          :model="ruleFormStep"
          :rules="rulesStep"
          status-icon
          class="demo-ruleForm"
        >
          <div class="row">
            <el-form-item :label="'Nombre: '" prop="cohabitant.name" class="col-sm-6">
              <el-input v-model="ruleFormStep.cohabitant.name" />
            </el-form-item>

            <el-form-item :label="'Edad: '" prop="cohabitant.age" class="col-sm-2">
              <el-input-number v-model="ruleFormStep.cohabitant.age" :min="1" :max="100" />
            </el-form-item>

            <el-form-item :label="'Fecha de nacimiento: '" prop="cohabitant.birthdate" class="col-sm-4">
              <el-date-picker
                v-model="ruleFormStep.cohabitant.birthdate"
                type="date"
                placeholder="Seleccione una fecha"
                value-format="yyyy-MM-dd"
                :picker-options="{
                  disabledDate(time) {
                    return time.getTime() > Date.now();
                  }
                }"
              />
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item :label="'DUI: '" prop="cohabitant.dui" class="col-sm-4">
              <el-input v-maska data-maska="########-#" v-model="ruleFormStep.cohabitant.dui" />
            </el-form-item>

            <el-form-item :label="'Ocupación: '" prop="cohabitant.job" class="col-sm-4">
              <el-input v-model="ruleFormStep.cohabitant.job" />
            </el-form-item>

            <el-form-item :label="'Lugar de trabajo: '" prop="cohabitant.workplace" class="col-sm-4">
              <el-input v-model="ruleFormStep.cohabitant.workplace" />
            </el-form-item>
          </div>

          <el-form-item label="Dirección">
            <el-input v-model="ruleFormStep.cohabitant.address" type="textarea" />
          </el-form-item>

          <div class="row">
            <el-form-item :label="'Cargo: '" prop="cohabitant.position" class="col-sm-4">
              <el-input v-model="ruleFormStep.cohabitant.position" />
            </el-form-item>

            <el-form-item :label="'Salario: '" prop="cohabitant.salary" class="col-sm-2">
              <el-input-number v-model="ruleFormStep.cohabitant.salary" :min="1" :max="1000000" />
            </el-form-item>

            <el-form-item :label="'Teléfono de oficina: '" prop="cohabitant.officePhone" class="col-sm-3">
              <el-input v-maska data-maska="####-####" v-model="ruleFormStep.cohabitant.officePhone" />
            </el-form-item>

            <el-form-item :label="'Teléfono celular: '" prop="cohabitant.cellPhone" class="col-sm-3">
              <el-input v-maska data-maska="####-####" v-model="ruleFormStep.cohabitant.cellPhone" />
            </el-form-item>
          </div>

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
