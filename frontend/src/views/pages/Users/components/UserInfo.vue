<script lang="ts" setup>
import ArgonInput from "@/components/ArgonInput.vue"
import ArgonButton from "@/components/ArgonButton.vue"
import { reactive, onMounted, watch, ref } from "vue"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { CountryLocationModule } from "@/store/modules/CountryLocation"
import { AgentsModule } from "@/store/modules/Agents"
import { useRouter, useRoute } from "vue-router"
import { vMaska } from "maska"
import { AxiosResponse } from "axios"
import { array } from "yup"

const emit = defineEmits<{
  (e: "next"): void
}>()

const ruleFormRef = ref<FormInstance>()
const enableOptionsMunicipalities = ref(false)
const enableOptionsMunicipalitiesV2 = ref(false)
const ruleForm = reactive({
  name: "",
  lastname: "",
  address: "",
  municipality: "",
  municipalityV2: "",
  department: "",
  departmentV2: "",
  carnet: "",
  expeditionDate: "",
  expeditionPlace: "",
  gender: "",
  dui: "",
  isss: "",
  email: "",
  nextStep: 2,
  isEdit: false,
  userId: "",
  birthdate: "",
  birthplace: "",
  homePhone: "",
  cellPhone: "",
  profession: "",
  allergic: "",
  afpNup: "",
  ipsfa: "",
  driverLicense: "",
  bloodType: "",
  maritalStatus: "",
  anspDate: "",
  anspNo: "",
  weaponLicense: "",
  expirationWeaponLicense: "",
  class: "",
  afpType: "",
  ansp: false,
  showLicWeapon: false,
  showLicDriver: false,
})

let ansp = ref("No")
const showFieldsANSP = ref(false)
const bloodTypeOptions = reactive([
  { value: "N/S", label: "Desconocido" },
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

const afiliacionesAFP = reactive([
  { value: "AFP Confía", label: "AFP Confía" },
  { value: "AFP Crecer", label: "AFP Crecer" },
  { value: "UPISS", label: "UPISS" },
  { value: "ISP", label: "ISP" }
])

const validateDepartament = (rule: any, value: string, callback: Function) => {
  if (!rules.departamentV2 && !value) {
    callback(new Error("Campo 1 es requerido si Campo 2 está vacío"))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: "El campo nombre es requerido",
      trigger: "blur",
    },
    {
      min: 3,
      max: 20,
      message: "El nombre debe tener entre 3 y 20 caracteres",
      trigger: "blur",
    },
  ],
  lastname: [
    {
      required: true,
      message: "El campo apellido es requerido",
      trigger: "blur",
    },
    {
      min: 3,
      max: 20,
      message: "El apellido debe tener entre 3 y 20 caracteres",
      trigger: "blur",
    },
  ],
  address: [
    {
      required: true,
      message: "El campo dirección es requerido",
      trigger: "blur",
    },
  ],
  municipality: [
    {
      required: true,
      message: "El campo municipio es requerido",
      trigger: "blur",
    },
  ],
  municipalityV2: [
    {
      required: true,
      message: "El campo municipio es requerido",
      trigger: "blur",
    },
  ],
  department: [
    {
      required: true,
      message: "El campo departamento es requerido",
      trigger: "blur",
      validator: validateDepartament,
    },
  ],
  departmentv2: [
    {
      required: true,
      message: "El campo departamento es requerido",
      trigger: "blur",
    },
  ],
  birthdate: [
    {
      required: true,
      asyncValidator: (rule, value) =>
        new Promise((res, rej) => {
          if (!value)
            rej("Ingrese una fecha de nacimiento")

          // convertimos value a Date para poder comparar
          let date = new Date(value)

          if (
            new Date().getFullYear() - date.getFullYear() >= 18
          )
            res()
          else if (new Date().getFullYear() - date.getFullYear() < 18)
            rej("La edad del candidato es muy corta")
        }),
      trigger: "blur",
    },
  ],
  birthplace: [
    {
      required: true,
      message: "El campo lugar de nacimiento es requerido",
      trigger: "blur",
    },
  ],
  gender: [
    {
      required: true,
      message: "El campo género es requerido",
      trigger: "blur",
    },
  ],
  dui: [
    {
      required: true,
      pattern: /^\d{9}/,
      message: "El campo DUI es requerido",
      trigger: "blur",
    },
  ],
  expeditionDate: [
    {
      required: true,
      message: "El campo fecha de expedición es requerido",
      trigger: "blur",
    },
  ],
  expeditionPlace: [
    {
      required: true,
      message: "El campo lugar de expedición es requerido",
      trigger: "blur",
    },
  ],
  isss: [
    { required: true, message: "El campo ISSS es requerido", trigger: "blur" },
  ],
  email: [
    {
      type: "email",
      message: "El correo electrónico no es válido",
      trigger: "blur",
    },
  ],
  maritalStatus: [
    {
      required: true,
      message: "El campo estado civil es requerido",
      trigger: "blur",
    },
  ],
})

// watch que ve si el departamento cambia para obtener los municipios
watch(
  () => ruleForm.department,
  newValue => {
    if (newValue) {
      CountryLocationModule.getMunicipalities(Number(newValue))
    }
  }
)

watch(
  () => ruleForm.departmentV2,
  newValue => {
    if (newValue) {
      CountryLocationModule.getMunicipalitiesByAPI(newValue)
    }
  }
)

watch(
  () => ruleForm.ansp,
  newValue => {
    showFieldsANSP.value = newValue
  }
)
const router = useRouter()
const route = useRoute()
async function handleSubmit() {
  await ruleFormRef.value?.validate(async (valid, fields) => {
    if (!valid) return
    // obtenemos el nombre del departamento
    const department = CountryLocationModule.Departments.find(
      item => item.id === Number(ruleForm.department)
    )
    // lo asignamos al objeto
    ruleForm.department = department?.nombre || ruleForm.departmentV2 || ""
    ruleForm.municipality = ruleForm.municipality || ruleForm.municipalityV2
    let resp: AxiosResponse<any> | undefined = undefined
    if (ruleForm.isEdit) {
      resp = await AgentsModule.updateAgentStepOne(ruleForm)

      // console.log({ resp })
      if (resp && resp.data?.status === true) {
        ElMessage({
          type: "success",
          message: "Paso número uno editado y guardado correctamente",
        })

        await router.replace({
          query: { ...route.query, s: 2 },
        })
        emit("next")
      } else {
        ElMessage.error("Error al editar agente, favor revisar la información")
      }
    } else {
      const { success, reply }: { success: boolean, reply: any } = await AgentsModule.createAgent(ruleForm)

      if (!success) {
        return
      }

      if (reply && reply.data && reply.data.status === true) {
        ElMessage({
          type: "success",
          message: "Paso número uno completado y guardado correctamente",
        })

        await router.replace({
          query: { uI: reply.data.userId, uII: reply.data.userInfoId, s: 2 },
        })
        emit("next")
      }
    }
    // resp = await AgentsModule.createAgent(ruleForm)
  })
}
onMounted(async () => {
  // Llamamos Endpoint para obtener los departamentos
  await CountryLocationModule.getDepartments()
  await CountryLocationModule.getDepartmentsByAPI()

  // si en el query parameter viene uI y uII significa que es una edición y rellenamos los campos
  const { uI, uII, edit } = route.query
  let auxNextStep = null

  if (uI && uII) {
    await AgentsModule.getOneAgent({ userId: uI.toString() }).then(resp => {
      if (resp) {
        // console.log({resp}); resp.birthdate.substring(0, 10)
        ruleForm.name = resp.s1.name ?? ""
        ruleForm.lastname = resp.s1.lastname ?? ""
        ruleForm.address = resp.s1.address ?? ""
        ruleForm.municipality = resp.s1.municipality ?? ""
        ruleForm.carnet = resp.s1.carnet ?? ""
        ruleForm.expeditionDate = resp.s1.expeditionDate ?? ""
        ruleForm.expeditionPlace = resp.s1.expeditionPlace ?? ""
        ruleForm.email = resp.s1.email ?? ""
        ruleForm.gender = resp.s1.gender ?? ""
        ruleForm.dui = resp.s1.dui ?? ""
        ruleForm.isss = resp.s1.isss ?? ""
        ruleForm.userId = resp.userInfoId ?? ""
        ruleForm.homePhone = resp.s1.homePhone ?? ""
        ruleForm.cellPhone = resp.s1.cellPhone ?? ""
        ruleForm.profession = resp.s1.profession ?? ""
        ruleForm.allergic = resp.s1.allergic ?? ""
        ruleForm.afpNup = resp.s1.afpNup ?? ""
        ruleForm.ipsfa = resp.s1.ipsfa ?? ""
        ruleForm.birthdate = resp.s1.birthdate ?? new Date()
        ruleForm.birthplace = resp.s1.birthplace ?? ""
        ruleForm.maritalStatus = resp.s1.maritalStatus ?? ""
        ruleForm.driverLicense = resp.s1.driverLicense ?? ""
        ruleForm.class = resp.s1.class ?? ""
        ruleForm.weaponLicense = resp.s1.weaponLicense ?? ""
        ruleForm.expirationWeaponLicense = resp.s1.expirationWeaponLicense ?? ""
        ruleForm.bloodType = resp.s1.bloodType ?? ""
        ruleForm.ansp = resp.s1.ansp ?? ""
        ruleForm.anspDate = resp.s1.anspDate ?? ""
        ruleForm.anspNo = resp.s1.anspNo ?? ""
        ruleForm.afpType = resp.s1.afpType ?? ""
        ruleForm.showLicWeapon = !!resp.s1.weaponLicense
        ruleForm.showLicDriver = !!resp.s1.driverLicense

        auxNextStep = resp.nextStep
        // obtenemos el id departamento
        const department = CountryLocationModule.Departments.find(
          item => item.nombre === resp.s1.department
        )
        // lo asignamos al objeto
        ruleForm.department = department?.id || ""
      }
    })

    // si en query parameter viene edit significa que es una edición
    if (
      (edit && edit === "true") ||
      (auxNextStep && auxNextStep >= ruleForm.nextStep)
    ) {
      ruleForm.isEdit = true
    }
  }
})
</script>
<template>
  <div
    class="card multisteps-form__panel p-3 border-radius-xl bg-white"
    data-animation="FadeIn"
  >
    <h5 class="font-weight-bolder mb-0">Datos generales</h5>
    <p class="mb-0 text-sm">
      Complete el primer paso ingresando tu información personal
    </p>
    <div class="multisteps-form__content">
      <div class="mt-3">
        <el-form
          label-position="top"
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          :rules="rules"
          class="demo-ruleForm d-flex flex-wrap"
        >
          <el-form-item
            class="w-sm-100 w-md-50 px-3"
            style="width: 100%"
            label="Apellidos"
            prop="lastname"
          >
            <el-input v-model="ruleForm.lastname" />
          </el-form-item>

          <el-form-item
            class="w-sm-100 w-md-50 px-3"
            style="width: 100%"
            label="Nombres"
            prop="name"
          >
            <el-input v-model="ruleForm.name" />
          </el-form-item>

          <el-form-item
            class="w-sm-100 w-md-50 px-3"
            style="width: 100%"
            label="Email"
            prop="email"
          >
            <el-input v-model="ruleForm.email" />
          </el-form-item>

          <el-form-item
            class="w-sm-100 w-md-50 px-3"
            style="width: 100%"
            label="Carnet"
            prop="carnet"
          >
            <el-input v-model="ruleForm.carnet" />
          </el-form-item>

          <el-form-item
            class="w-md-50 px-3"
            style="width: 100%"
            label="Fecha de nacimiento"
            prop="birthdate"
          >
            <el-date-picker
              v-model="ruleForm.birthdate"
              type="date"
              label="Fecha de nacimiento"
              placeholder="Seleccionar fecha"
              style="width: 100%"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item
            class="px-3 w-md-50"
            label="Lugar de nacimiento"
            prop="birthplace"
          >
            <el-input v-model="ruleForm.birthplace" />
          </el-form-item>

          <el-form-item class="w-100 px-3" label="Dirección" prop="address">
            <el-input v-model="ruleForm.address" type="textarea" />
          </el-form-item>

          <div class="row w-100 px-3">
            <div class="row">
              <el-form-item
                class="col-6 col-sm-4"
                label="Departamento"
                prop="department"
              >
                <el-select
                  class="w-100"
                  v-model="ruleForm.department"
                  placeholder="Seleccionar departamento"
                >
                  <el-option
                    v-for="item in CountryLocationModule.Departments"
                    :key="item.id"
                    :label="item.nombre"
                    :value="item.id"
                    @click="enableOptionsMunicipalities = true"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                class="col-6 col-sm-4"
                label="Municipio"
                prop="municipality"
              >
                <el-select
                  class="w-100"
                  v-model="ruleForm.municipality"
                  :disabled="!enableOptionsMunicipalities"
                  placeholder="Seleccionar municipio"
                >
                  <el-option
                    v-for="item in CountryLocationModule.Municipalities"
                    :key="item.id"
                    :label="item.nombre"
                    :value="item.nombre"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                class="col-6 col-sm-4"
                label="Departamento (2)"
                prop="department"
              >
                <el-select
                  class="w-100"
                  v-model="ruleForm.departmentV2"
                  placeholder="Seleccionar departamento"
                >
                  <el-option
                    v-for="item in CountryLocationModule.departmentsV2API"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    @click="enableOptionsMunicipalitiesV2 = true"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                class="col-6 col-sm-4"
                label="Municipio (2)"
                prop="municipality"
              >
                <el-select
                  class="w-100"
                  v-model="ruleForm.municipalityV2"
                  :disabled="!enableOptionsMunicipalitiesV2"
                  placeholder="Seleccionar municipio"
                >
                  <el-option
                    v-for="item in CountryLocationModule.MunicipalitiesByAPI"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </div>
            <el-form-item class="col-9" label="Sexo" prop="gender">
              <el-radio-group v-model="ruleForm.gender">
                <el-radio label="Masculino" class="pe-5" />
                <el-radio label="Femenino" />
              </el-radio-group>
            </el-form-item>

            <div class="row w-100">
              <el-form-item class="col-6 col-sm-4" label="Teléfono de casa">
                <el-input
                  v-model="ruleForm.homePhone"
                  v-maska
                  data-maska="####-####"
                />
              </el-form-item>

              <el-form-item class="col-6 col-sm-4" label="Celular">
                <el-input
                  v-model="ruleForm.cellPhone"
                  v-maska
                  data-maska="####-####"
                />
              </el-form-item>

              <el-form-item class="col-6 col-sm-4" label="Alérgico a">
                <el-input v-model="ruleForm.allergic" />
              </el-form-item>

              <el-form-item
                class="col-6 col-sm-4"
                label="Afiliación"
              >
                <el-select
                  class="w-100"
                  v-model="ruleForm.afpType"
                  placeholder="Seleccionar afiliación AFP"
                >
                  <el-option
                    v-for="item in afiliacionesAFP"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item class="col-6 col-sm-4" label="AFP NUP">
                <el-input v-model="ruleForm.afpNup" v-maska data-maska="############"/>
              </el-form-item>

              <el-form-item class="col-6 col-sm-4" label="IPSFA No.">
                <el-input v-model="ruleForm.ipsfa" />
              </el-form-item>

              <el-form-item class="col-12" label="Profesión u oficio">
                <el-input v-model="ruleForm.profession" />
              </el-form-item>
            </div>

            <el-form-item class="col-6 col-sm-4" label="DUI" prop="dui">
              <el-input
                v-model="ruleForm.dui"
                v-maska
                data-maska="#########"
              />
            </el-form-item>

            <el-form-item
              class="col-6 col-sm-4"
              label="Fecha de expedición"
              prop="expeditionDate"
            >
              <el-date-picker
                v-model="ruleForm.expeditionDate"
                type="date"
                label="ingresar fecha expedición"
                placeholder="Seleccionar fecha"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>

            <el-form-item
              class="col-6 col-sm-4"
              label="Lugar de expedición"
              prop="expeditionPlace"
            >
              <el-input v-model="ruleForm.expeditionPlace" />
            </el-form-item>

            <el-form-item class="col-6 col-sm-4" label="ISSS" prop="isss">
              <el-input v-model="ruleForm.isss" />
            </el-form-item>
          </div>

          <div class="row w-100 px-3">
            <el-form-item
              class="col-6 col-sm-4"
              label="Estado civil"
              prop="maritalStatus"
            >
              <el-select
                class="w-100"
                v-model="ruleForm.maritalStatus"
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
                v-model="ruleForm.bloodType"
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
          </div>

          <div class="row w-100 px-3">
            <el-form-item
              class="col-12 col-sm-4"
              label="Posee licencia de conducir"
            >
              <el-radio-group v-model="ruleForm.showLicDriver">
                <el-radio :label="true" class="pe-4">Si</el-radio>
                <el-radio :label="false">No</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              v-if="ruleForm.showLicDriver"
              class="col-6 col-sm-4"
              label="Licencia de conducir"
            >
              <el-input
                v-model="ruleForm.driverLicense"
                v-maska
                data-maska="['########-#','####-######-###-#']"
              />
            </el-form-item>

            <el-form-item v-if="ruleForm.showLicDriver" class="col-6 col-sm-4" label="Clase">
              <el-input v-model="ruleForm.class" />
            </el-form-item>
          </div>

          <div class="row w-100 px-3">
            <el-form-item
              class="col-12 col-sm-4"
              label="Curso ANSP"
              prop="ansp"
            >
              <el-radio-group v-model="ruleForm.ansp">
                <el-radio :label="true" class="pe-4">Si</el-radio>
                <el-radio :label="false">No</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              v-if="showFieldsANSP"
              class="col-6 col-sm-4"
              label="Fecha"
            >
              <el-date-picker
                v-model="ruleForm.anspDate"
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
              class="col-6 col-sm-4"
              label="No. ansp"
            >
              <el-input v-model="ruleForm.anspNo" />
            </el-form-item>
          </div>

          <div class="row w-100 px-3">
            <el-form-item
              class="col-12 col-sm-4"
              label="Posee licencia uso de armas"
            >
              <el-radio-group v-model="ruleForm.showLicWeapon">
                <el-radio :label="true" class="pe-4">Si</el-radio>
                <el-radio :label="false">No</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              v-if="ruleForm.showLicWeapon"
              class="col-6 col-sm-4"
              label="Lic. uso de armas"
            >
              <el-input v-model="ruleForm.weaponLicense" />
            </el-form-item>

            <el-form-item v-if="ruleForm.showLicWeapon" class="col-6 col-sm-4" label="Vencimiento">
              <el-date-picker
                v-model="ruleForm.expirationWeaponLicense"
                type="date"
                label="Vencimiento"
                placeholder="Seleccionar fecha"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </div>

          <el-form-item class="w-100 px-3"> </el-form-item>
          <div class="button-row d-flex mt-2 w-100">
            <el-button type="primary" class="ms-auto" @click="handleSubmit">
              Siguiente
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
