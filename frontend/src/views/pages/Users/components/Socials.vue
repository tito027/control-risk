<script setup lang="ts">
import { AgentsModule } from "@/store/modules/Agents"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { reactive, watch, ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { vMaska } from "maska"

const masks = {
  dui: "00000000-0#",
  nit: "0000-000000-000-0",
}
// props & emit
const emit = defineEmits<{
  (e: "next"): void
  (e: "prev"): void
}>()

// Data
const router = useRouter()
const route = useRoute()
const mask = ref(masks.dui)
const ruleFormRef = ref<FormInstance>()
const showFieldsANSP = ref(false)
const bloodTypeOptions = reactive([
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
])

const maritalStatusOptions = reactive([
  { value: "Soltero", label: "Soltero" },
  { value: "Casado", label: "Casado" },
  { value: "Divorciado", label: "Divorciado" },
  { value: "Viudo", label: "Viudo" },
  { value: "Unión libre", label: "Unión libre" },
])
const rulesStep = reactive<FormRules>({
  maritalStatus: [
    {
      required: true,
      message: "El campo estado civil es requerido",
      trigger: "blur",
    },
  ],
  bloodType: [
    {
      required: true,
      message: "El campo tipo de sangre es requerido",
      trigger: "blur",
    },
  ],
  ansp: [
    {
      required: true,
      message: "El campo curso ANSP es requerido",
      trigger: "blur",
    },
  ],
})
const ruleFormStep = reactive({
  userInfoId: "",
  userId: "",
  maritalStatus: "",
  driverLicense: "",
  class: "",
  weaponLicense: "",
  expirationWeaponLicense: "",
  bloodType: "",
  ansp: "",
  anspDate: "",
  anspNo: "",
  isEdit: false,
})
// watch que ve si el usuario selecciona ANSP para mostrar los campos
watch(
  () => ruleFormStep.ansp,
  newValue => {
    if (newValue === "Si") {
      showFieldsANSP.value = true
    } else {
      showFieldsANSP.value = false
    }
  }
)
async function handleSubmit() {
  const userInfoId = route.query.uII
  const userId = route.query.uI
  if (!userId || !userInfoId) return

  await ruleFormRef.value?.validate(async (valid, fields) => {
    if (!valid) return
    // si ansp es si, entonces enviamos true, si no, enviamos false
    const ansp = ruleFormStep.ansp === "Si" ? true : false
    ruleFormStep.userInfoId = userInfoId.toString() || ""
    ruleFormStep.userId = userId.toString() || ""
    const { success, reply } = await AgentsModule.createAgentStep3({
      ...ruleFormStep,
      ansp,
    })
    if (!success)
      return ElMessage.error(
        "Error: No se pudo guardar la información, favor revisar los datos o ponerse en contacto con el administrador"
      )
    else if (reply && reply.data.status === true)
      ElMessage({
        type: "success",
        message: "El paso número tres ha sido completado y guardado con éxito",
      }),
        emit("next")
  })
}

onMounted(() => {
  // si en el query parameter viene uI y uII significa que es una edición y rellenamos los campos
  const { uI, uII, edit } = route.query

  if (uI && uII) {
    AgentsModule.getOneAgent({userId: uI.toString()}).then(resp => {
      if (resp) {
        // console.log({resp});
        ruleFormStep.userInfoId = resp._id
        ruleFormStep.userId = resp.userId
        ruleFormStep.maritalStatus = resp.maritalStatus
        ruleFormStep.driverLicense = resp.driverLicense
        ruleFormStep.class = resp.class
        ruleFormStep.weaponLicense = resp.weaponLicense
        ruleFormStep.expirationWeaponLicense = resp.expirationWeaponLicense
        ruleFormStep.bloodType = resp.bloodType
        ruleFormStep.ansp = resp.ansp ? "Si" : "No"
        ruleFormStep.anspDate = resp.anspDate
        ruleFormStep.anspNo = resp.anspNo
      }
    })

    // si en query parameter viene edit significa que es una edición
    if (edit && edit === "true") {
      ruleFormStep.isEdit = true
    }
  }

})

function changeLicense(license: string) {
  const numbers = license.replace(/\D/g, "")
  mask.value = numbers.length >= 10 ? masks.nit : masks.dui
}
</script>
<template>
  <div
    class="card multisteps-form__panel p-3 border-radius-xl bg-white"
    data-animation="FadeIn"
  >
    <h5 class="font-weight-bolder">Licencias</h5>
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
          <div class="row px-3">
            <el-form-item
              class="col-2 w-xxl-50 w-sm-50"
              label="Licencia de conducir"
            >
              <el-input
                v-model="ruleFormStep.driverLicense"
                v-maska
                data-maska="['########-#','####-######-###-#']"
              />
            </el-form-item>

            <el-form-item class="col-2 w-xxl-50 w-sm-50" label="clase">
              <el-input v-model="ruleFormStep.class" />
            </el-form-item>
          </div>

          <div class="row px-3">
            <el-form-item
              class="col-2 w-lg-50 w-sm-50"
              style="width: 100%"
              label="Lic. uso de armas"
            >
              <el-input v-model="ruleFormStep.weaponLicense" />
            </el-form-item>

            <el-form-item class="col-sm-2 w-lg-50 w-sm-50" label="Vencimiento">
              <el-date-picker
                v-model="ruleFormStep.expirationWeaponLicense"
                type="date"
                label="Vencimiento"
                placeholder="Seleccionar fecha"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </div>

          <div class="row px-3">
            <el-form-item
              class="col-6 col-sm-4"
              label="Estado civil"
              prop="maritalStatus"
            >
              <el-select
                class="w-100"
                v-model="ruleFormStep.maritalStatus"
                placeholder="Seleccionar"
              >
                <el-option
                  v-for="item in maritalStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              class="col-6 col-sm-4"
              label="Tipo sanguineo"
              prop="maritalStatus"
            >
              <el-select
                class="w-100"
                v-model="ruleFormStep.bloodType"
                placeholder="Seleccionar"
              >
                <el-option
                  v-for="item in bloodTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              class="col-12 col-sm-4"
              label="Curso ANSP"
              prop="ansp"
            >
              <el-radio-group v-model="ruleFormStep.ansp">
                <el-radio label="Si" class="pe-4" />
                <el-radio label="No" />
              </el-radio-group>
            </el-form-item>

            <el-form-item
              v-if="showFieldsANSP"
              class="w-lg-50 w-sm-50"
              label="Fecha"
            >
              <el-date-picker
                v-model="ruleFormStep.anspDate"
                type="date"
                label="Fecha"
                placeholder="Seleccionar fecha"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>

            <el-form-item
              v-if="showFieldsANSP"
              class="w-lg-50 w-sm-50"
              style="width: 100%"
              label="No. ansp"
            >
              <el-input v-model="ruleFormStep.anspNo" />
            </el-form-item>
          </div>

          <el-form-item class="w-100 px-3"> </el-form-item>
          <div class="button-row d-flex mt-4 w-100">
            <el-button type="default" @click="$emit('prev')"> Atrás </el-button>
            <el-button type="primary" class="ms-auto" @click="handleSubmit">
              Siguiente
            </el-button>
          </div>
        </el-form>
        <br />
      </div>
    </div>
  </div>
</template>
