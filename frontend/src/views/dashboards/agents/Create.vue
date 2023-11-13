<template>
  <div class="p-2 mt-5">

    <el-dialog
      v-model="showModalSuccess"
      :close-on-click-modal="false"
    >
      <div class="text-center">
        <h2>Registro guardado correctamente</h2>
        <br>
        <el-button @click="$router.push({ name: 'Agents' })">Finalizar</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-model="showModalError"
      :close-on-click-modal="false"
    >
      <div class="text-center">
        <h2>Ocurrio un error</h2>
        <p>Ha ocurrido un error a la hora de registrar este paso, favor volver a intentar</p>
        <el-button @click="showModalError = false">Finalizar</el-button>
      </div>
    </el-dialog>
    <div class="card mx-xl-12 mx-3">
    <!-- Crear Agentes -->
    <div class="">
      <div class="card-header">
            <h5 class="mb-0">Crear agentes</h5>
            <p class="mb-0 text-sm">
              Complete los pasos del formulario para registrar la solicitud
            </p>
      </div>
      <!-- <h1 class="fs-2">Crear agentes</h1>
      <p class="text-secondary">Complete los pasos del formulario para registrar la solicitud</p>
     -->
    </div>
    <!-- <br> -->
    
    <div class="bg-white shadow rounded px-2">
      <br>
      <!-- <h5 class="bg-primary text-white w-100 p-1 rounded-top" style="--bs-bg-opacity: .9; margin-bottom: 20px;">Datos generales</h5> -->
      <el-steps :active="steps" align-center>
        <el-step title="Paso 1" />
        <el-step title="Paso 2" />
        <el-step title="Paso 3" />
      </el-steps>
      <!-- Formulario paso 1 -->
      <div class="mt-3" v-if="steps === 0">
        <el-form
          label-position="top"
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          :rules="rules"
          class="demo-ruleForm d-flex flex-wrap"
        >
          <el-form-item class="w-sm-100 w-md-50 px-3" style="width:100%" label="Apellidos" prop="lastname">
            <el-input v-model="ruleForm.lastname" />
          </el-form-item>

          <el-form-item class="w-sm-100 w-md-50 px-3" style="width:100%" label="Nombres" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>

          <el-form-item class="w-sm-100 w-md-50 px-3" style="width:100%" label="Email" prop="email">
            <el-input v-model="ruleForm.email" />
          </el-form-item>

          <el-form-item class="w-md-50 w-sm-100 px-3" label="Dirección" prop="address">
            <el-input v-model="ruleForm.address" type="textarea" />
          </el-form-item>

          <el-form-item class="px-3" label="Departamento" prop="department">
            <el-select v-model="ruleForm.department" filterable placeholder="Seleccionar departamento">
              <el-option
                v-for="item in CountryLocationModule.Departments"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item class="px-3" label="Municipio" prop="municipality">
            <el-select v-model="ruleForm.municipality" filterable :disabled="!enableOptionsMunicipalities" placeholder="Seleccionar municipio">
              <el-option
                v-for="item in CountryLocationModule.Municipalities"
                :key="item.id"
                :label="item.nombre"
                :value="item.nombre"
              />
            </el-select>
          </el-form-item>

          <el-form-item class="w-md-50 px-3" style="width:100%" label="Lugar de nacimiento" prop="bithplace">
            <el-input v-model="ruleForm.bithplace" />
          </el-form-item>

          <el-form-item class="px-3" label="Fecha de nacimiento" prop="birthdate">
            <el-date-picker
              v-model="ruleForm.birthdate"
              type="date"
              label="Fecha de nacimiento"
              placeholder="Seleccionar fecha"
              style="width: 100%"
            />
          </el-form-item>

          <div class="w-100">
            <el-form-item class="px-3" label="Sexo" prop="gender">
              <el-radio-group v-model="ruleForm.gender">
                <el-radio label="Masculino" />
                <el-radio label="Femenino" />
              </el-radio-group>
            </el-form-item>
          </div>

          <el-form-item class="w-md-25 px-3" label="DUI" prop="dui">
            <el-input v-model="ruleForm.dui"/>
          </el-form-item>

          <el-form-item class="w-md-25 px-3" label="NIT" prop="nit">
            <el-input v-model="ruleForm.nit"/>
          </el-form-item>

          <el-form-item class="w-md-25 px-3" label="ISSS" prop="isss">
            <el-input v-model="ruleForm.isss" />
          </el-form-item>

          <el-form-item class="w-100 px-3">
            <el-button type="primary" @click="nextStep(ruleFormRef)"
              >Siguiente</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!-- Formulario paso 2 -->
      <div class="mt-3" v-if="steps === 1">
        <el-form
          label-position="top"
          ref="ruleFormRef"
          :model="ruleFormStep2"
          status-icon
          :rules="rulesStep2"
          class="demo-ruleForm d-flex flex-wrap"
        >
          <el-form-item class="w-md-50 px-3" style="width:100%" label="Lugar de expedición" prop="expeditionPlace">
            <el-input v-model="ruleFormStep2.expeditionPlace" />
          </el-form-item>

          <el-form-item class="px-3 w-md-50" label="Fecha de expedición" prop="expeditionDate">
            <el-date-picker
              v-model="ruleFormStep2.expeditionDate"
              type="date"
              label="fecha de expedición"
              placeholder="Seleccionar fecha"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item class="w-md-25 px-3" style="width:100%" label="Teléfono de casa">
            <el-input v-model="ruleFormStep2.phone" />
          </el-form-item>
          
          <el-form-item class="w-md-25 px-3" style="width:100%" label="Celular">
            <el-input v-model="ruleFormStep2.cellPhone" />
          </el-form-item>

          <el-form-item class="w-md-50 px-3" style="width:100%" label="Alérgico a">
            <el-input v-model="ruleFormStep2.allergicTo" />
          </el-form-item>

          <el-form-item class="w-md-25 px-3" style="width:100%" label="AFP">
            <el-input v-model="ruleFormStep2.afp" />
          </el-form-item>
          
          <el-form-item class="w-md-25 px-3" style="width:100%" label="NUP">
            <el-input v-model="ruleFormStep2.nup" />
          </el-form-item>

          <el-form-item class="w-md-25 px-3" style="width:100%" label="IPSFA No.">
            <el-input v-model="ruleFormStep2.ipsfa" />
          </el-form-item>

          <el-form-item class="w-md-75 px-3" style="width:100%" label="Profesión u oficio">
            <el-input v-model="ruleFormStep2.profession" />
          </el-form-item>

          <el-form-item class="w-100 px-3">
            <el-button type="primary" @click="nextStep(ruleFormRef)"
              >Siguiente</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!-- Formulario paso 3 -->
      <div class="mt-3" v-if="steps === 2">
        <el-form
          label-position="top"
          ref="ruleFormRef"
          :model="ruleFormStep3"
          status-icon
          :rules="rulesStep3"
          class="demo-ruleForm"
        >
          <div class="row px-3">
            <el-form-item class="col-2 w-xxl-25 w-sm-50" style="width:100%" label="Licencia de conducir">
              <el-input v-model="ruleFormStep3.driverLicense" />
            </el-form-item>

            <el-form-item class="col-2 w-xxl-25 w-sm-50" style="width:100%" label="Clase">
              <el-input v-model="ruleFormStep3.clase" />
            </el-form-item>
          </div>

          <div class="row px-3">
            <el-form-item class="col-2 w-lg-25 w-sm-50" style="width:100%" label="Lic. uso de armas">
              <el-input v-model="ruleFormStep3.weaponsLicense" />
            </el-form-item>

            <el-form-item class="col-sm-2 w-lg-25 w-sm-50" label="Vencimiento">
              <el-date-picker
                v-model="ruleFormStep3.expiration"
                type="date"
                label="Vencimiento"
                placeholder="Seleccionar fecha"
                style="width: 100%"
              />
            </el-form-item>
          </div>

          <div class="row px-3">
            <el-form-item class="col-sm-2 w-lg-25 w-sm-50" label="Estado civil" prop="maritalStatus">
              <el-select v-model="ruleFormStep3.maritalStatus" placeholder="Seleccionar">
                <el-option
                  v-for="item in maritalStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item class="col-sm-2 w-lg-25 w-sm-50" label="Tipo sanguineo" prop="maritalStatus">
              <el-select v-model="ruleFormStep3.bloodType" placeholder="Seleccionar">
                <el-option
                  v-for="item in bloodTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>

          <div class="row px-3">
            <el-form-item class="w-lg-25 w-sm-50" label="Curso ANSP" prop="ansp">
              <el-radio-group v-model="ruleFormStep3.ansp">
                <el-radio label="Si" />
                <el-radio label="No" />
              </el-radio-group>
            </el-form-item>

            <el-form-item v-if="showFieldsANSP" class="w-lg-25 w-sm-50" label="Fecha">
              <el-date-picker
                v-model="ruleFormStep3.date"
                type="date"
                label="Fecha"
                placeholder="Seleccionar fecha"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item v-if="showFieldsANSP" class="w-lg-25 w-sm-50" style="width:100%" label="No. ansp">
              <el-input v-model="ruleFormStep3.numberAnsp" />
            </el-form-item>
          </div>

          <el-form-item class="w-100 px-3">
            <el-button type="primary" @click="nextStep(ruleFormRef)"
              >Siguiente</el-button
            >
          </el-form-item>
        </el-form>
        <br>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
import { CountryLocationModule } from "@/store/modules/CountryLocation";
import { AgentsModule } from "@/store/modules/Agents";
import DashboardMenu from "@/components/dashboard/DashboardMenu.vue"
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from "element-plus"
import { useRouter, useRoute } from 'vue-router'

// si tenemos nextStep en la url lo tomamos, si no, tomamos el valor del prop
const steps = ref(useRoute().query.nextStep ? Number(useRoute().query.nextStep) - 1 : 0)

const ruleFormRef = ref<FormInstance>()
const enableOptionsMunicipalities = ref(false)
const showModalSuccess = ref(false)
const showModalError = ref(false)
const showFieldsANSP = ref(false)

const ruleForm = reactive({
  name: '',
  lastname: '',
  address: '',
  municipality: '',
  department: '',
  birthdate: '',
  bithplace: '',
  gender: '',
  dui: '',
  nit: '',
  isss: '',
  email: '',
  nextStep: 2,
})

const ruleFormStep2 = reactive({
  userInfoId: '',
  expeditionPlace: '',
  expeditionDate: '',
  phone: '',
  cellPhone: '',
  profession: '',
  allergicTo: '',
  afp: '',
  nup: '',
  ipsfa: '',
  nextStep: 3,
})

const ruleFormStep3 = reactive({
  userInfoId: '',
  userId: '',
  maritalStatus: '',
  driverLicense: '',
  clase: '',
  weaponsLicense: '',
  expiration: '',
  bloodType: '',
  ansp: '',
  date: '',
  numberAnsp: '',
})

const maritalStatusOptions = reactive([
  { value: 'Soltero', label: 'Soltero' },
  { value: 'Casado', label: 'Casado' },
  { value: 'Divorciado', label: 'Divorciado' },
  { value: 'Viudo', label: 'Viudo' },
  { value: 'Unión libre', label: 'Unión libre' },
])

const bloodTypeOptions = reactive([
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
])

const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'El campo nombre es requerido', trigger: 'blur' },
    { min: 3, max: 20, message: 'El nombre debe tener entre 3 y 20 caracteres', trigger: 'blur' }
  ],
  lastname: [
    { required: true, message: 'El campo apellido es requerido', trigger: 'blur' },
    { min: 3, max: 20, message: 'El apellido debe tener entre 3 y 20 caracteres', trigger: 'blur' }
  ],
  address: [
    { required: true, message: 'El campo dirección es requerido', trigger: 'blur' }
  ],
  municipality: [
    { required: true, message: 'El campo municipio es requerido', trigger: 'blur' }
  ],
  department: [
    { required: true, message: 'El campo departamento es requerido', trigger: 'blur' }
  ],
  birthdate: [
    { required: true, message: 'El campo fecha de nacimiento es requerido', trigger: 'blur' }
  ],
  bithplace: [
    { required: true, message: 'El campo lugar de nacimiento es requerido', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: 'El campo género es requerido', trigger: 'blur' }
  ],
  dui: [
    { required: true, message: 'El campo DUI es requerido', trigger: 'blur' }
  ],
  // nit: [
  //   { required: true, message: 'El campo NIT es requerido', trigger: 'blur' }
  // ],
  isss: [
    { required: true, message: 'El campo ISSS es requerido', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'El campo correo electrónico es requerido', trigger: 'blur' },
    { type: 'email', message: 'El correo electrónico no es válido', trigger: 'blur' }
  ]
})

const rulesStep2 = reactive<FormRules>({
  expeditionPlace: [
    { required: true, message: 'El campo lugar de expedición es requerido', trigger: 'blur' }
  ],
  expeditionDate: [
    { required: true, message: 'El campo fecha de expedición es requerido', trigger: 'blur' }
  ]
})

const rulesStep3 = reactive<FormRules>({
  maritalStatus: [
    { required: true, message: 'El campo estado civil es requerido', trigger: 'blur' }
  ],
  bloodType: [
    { required: true, message: 'El campo tipo de sangre es requerido', trigger: 'blur' }
  ],
  ansp: [
    { required: true, message: 'El campo curso ANSP es requerido', trigger: 'blur' }
  ]
})

// Llamamos Endpoint para obtener los departamentos
CountryLocationModule.getDepartments()

// watch que ve si el departamento cambia para obtener los municipios
watch(() => ruleForm.department, (newValue) => {
  if (newValue) {
    CountryLocationModule.getMunicipalities(Number(newValue))
    enableOptionsMunicipalities.value = true
  }
})

// watch que ve si el usuario selecciona ANSP para mostrar los campos
watch(() => ruleFormStep3.ansp, (newValue) => {
  if (newValue === 'Si') {
    showFieldsANSP.value = true
  } else {
    showFieldsANSP.value = false
  }
})

const nextStep = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res: any
      // obtenemos userInfoId y userId de la url que viene como queryparameter en la url con javascript
      const urlParams = new URLSearchParams(window.location.search)
      const userInfoId = urlParams.get('uII')
      const userId = urlParams.get('uI')

      // asignamos el id al objeto
      ruleFormStep2.userInfoId = userInfoId || ''
      ruleFormStep3.userInfoId = userInfoId || ''
      ruleFormStep3.userId = userId || ''

      // dependiendo del step que estemos, llamamos a la función que incertara los datos en la base de datos
      if (steps.value === 0) {
        // obtenemos el nombre del departamento
        const department = CountryLocationModule.Departments.find((item) => item.id === Number(ruleForm.department))
        // lo asignamos al objeto
        ruleForm.department = department?.nombre || ''

        res = await AgentsModule.createAgent(ruleForm)
      }
      else if (steps.value === 1) {
        res = await AgentsModule.createAgentStep2(ruleFormStep2)
      }
      else if (steps.value === 2) {
        // si ansp es si, entonces enviamos true, si no, enviamos false
        let ansp = ruleFormStep3.ansp === 'Si' ? true : false
        res = await AgentsModule.createAgentStep3({
          ...ruleFormStep3,
          ansp
        })
      }
      
      // si todo sale bien, validamos por paso
      console.log('res', res);
      if (res && res.data.status === true) {
        if (steps.value === 0) {
          // agregar id que vienen enr res a la url como queryparam con javascript
          const url = new URL(window.location.href)
          url.searchParams.set('uI', res.data.userId)
          url.searchParams.set('uII', res.data.userInfoId)
          window.history.pushState({}, '', url.toString())
        }

        steps.value++
      } else {
        // si no, mostramos el error
        ElMessage.error('Error: No se pudo guardar la información, favor revisar los datos o ponerse en contacto con el administrador')
      }

      if (steps.value === 3) {
        showModalSuccess.value = true
      }
    }
  })
}
</script>