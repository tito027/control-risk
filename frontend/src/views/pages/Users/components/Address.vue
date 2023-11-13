<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { useRoute, useRouter } from "vue-router"
import { AgentsModule } from "@/store/modules/Agents"
import { vMaska } from "maska"
import { PaymentMethodModule } from "@/store/modules/PaymentMethodModule"

const ruleFormRef = ref<FormInstance>()
const emit = defineEmits<{
  (e: "prev"): void
  (e: "next"): void
}>()

const router = useRouter()
const route = useRoute()
const ruleFormStep = reactive({
  userInfoId: "",
  homePhone: "",
  cellPhone: "",
  profession: "",
  allergic: "",
  afp: "",
  nup: "",
  ipsfa: "",
  nextStep: 3,
  birthdate: new Date(),
  birthplace: "",
  isEdit: false,
  paymentMethod: "",
  paymentEntity: "",
  paymentAccount: "",
})

const rulesStep2 = reactive<FormRules>({
  birthdate: [
    {
      required: true,
      asyncValidator: (rule, value) =>
        new Promise((res, rej) => {
          if (value instanceof Date && new Date().getFullYear() - value.getFullYear() >= 18) res()
          else if (value instanceof Date) rej("La edad del candidato es muy corta")
          else rej("Ingrese una fecha de nacimiento")
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
})

const paymentMethodOptions = ref<{ label: string; value: string; key: string }[]>([])
const paymentEntityOptions = ref<string[]>([])

async function handleSubmit() {
  const userInfoId = route.query.uII
  const userId = route.query.uI
  if (!userId || !userInfoId) return

  await ruleFormRef.value?.validate(async (valid, fields) => {
    if (!valid) return
    ruleFormStep.userInfoId = userInfoId.toString() || ""
    const { success, reply } = await AgentsModule.createAgentStep2(ruleFormStep)
    if (!success) return ElMessage.error("Error: No se pudo guardar la información, favor revisar los datos o ponerse en contacto con el administrador")
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

function getEntities() {
  console.log(ruleFormStep.paymentMethod)
  const paymentMethod: any = paymentMethodOptions.value.find(method => method.key === ruleFormStep.paymentMethod)
  paymentEntityOptions.value = paymentMethod.bank_entities
  console.log(paymentMethod)

  if (!paymentMethod.need_accont) {
    ruleFormStep.paymentEntity = ""
  }
  ruleFormStep.paymentAccount = ""
}

onMounted(() => {
  // si en el query parameter viene uI y uII significa que es una edición y rellenamos los campos
  const { uI, uII, edit } = route.query

  if (uI && uII) {
    AgentsModule.getOneAgent({ userId: uI.toString() }).then(resp => {
      if (resp) {
        // console.log({resp});

        ruleFormStep.userInfoId = resp._id ?? ""
        ruleFormStep.homePhone = resp.homePhone ?? ""
        ruleFormStep.cellPhone = resp.cellPhone ?? ""
        ruleFormStep.profession = resp.profession ?? ""
        ruleFormStep.allergic = resp.allergic ?? ""
        ruleFormStep.afp = resp.afp ?? ""
        ruleFormStep.nup = resp.nup ?? ""
        ruleFormStep.ipsfa = resp.ipsfa ?? ""
        ruleFormStep.birthdate = resp.birthdate ?? new Date()
        ruleFormStep.birthplace = resp.birthplace ?? ""
        //ruleFormStep.paymentMethod = resp.paymentMethod
      }
    })

    // si en query parameter viene edit significa que es una edición
    if (edit && edit === "true") {
      ruleFormStep.isEdit = true
    }
  }

  PaymentMethodModule.getPaymentMethods().then(resp => {
    console.log(resp)
    paymentMethodOptions.value = resp
  })
})
</script>

<template>
  <div class="card multisteps-form__panel p-3 border-radius-xl bg-white" data-animation="FadeIn">
    <h5 class="font-weight-bolder">Datos del trabajador</h5>
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
          <el-form-item
            class="w-md-50 px-3"
            style="width: 100%"
            label="Fecha de nacimiento"
            prop="birthdate"
          >
            <el-date-picker
              v-model="ruleFormStep.birthdate"
              type="date"
              label="Fecha de nacimiento"
              placeholder="Seleccionar fecha"
              style="width: 100%"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item class="px-3 w-md-50" label="Lugar de nacimiento" prop="birthplace">
            <el-input v-model="ruleFormStep.birthplace" />
          </el-form-item>

          <div class="row w-100 px-3">
            <el-form-item class="col-6 col-sm-4" label="Teléfono de casa">
              <el-input v-model="ruleFormStep.homePhone" v-maska data-maska="####-####" />
            </el-form-item>

            <el-form-item class="col-6 col-sm-4" label="Celular">
              <el-input v-model="ruleFormStep.cellPhone" v-maska data-maska="####-####" />
            </el-form-item>

            <el-form-item class="col-6 col-sm-4" label="Alérgico a">
              <el-input v-model="ruleFormStep.allergic" />
            </el-form-item>

            <el-form-item class="col-6 col-sm-4" label="AFP">
              <el-input v-model="ruleFormStep.afp" />
            </el-form-item>

            <el-form-item class="col-6 col-sm-4" label="NUP">
              <el-input v-model="ruleFormStep.nup" />
            </el-form-item>

            <el-form-item class="col-6 col-sm-4" label="IPSFA No.">
              <el-input v-model="ruleFormStep.ipsfa" />
            </el-form-item>

            <el-form-item class="col-6 col-sm-4" label="Forma de pago" prop="paymentMethod">
              <el-select class="w-100" v-model="ruleFormStep.paymentMethod" @change="getEntities" placeholder="Seleccionar">
                <el-option v-for="item in paymentMethodOptions" :key="item.key" :label="item.label" :value="item.key" />
              </el-select>
            </el-form-item>

            <el-form-item class="col-6 col-sm-4" label="Banco" prop="paymentEntity">
              <el-select class="w-100" v-model="ruleFormStep.paymentEntity" placeholder="Seleccionar">
                <el-option v-for="item in paymentEntityOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>

            <el-form-item class="col-12 px-3" label="Nº de cuenta">
              <el-input v-model="ruleFormStep.paymentAccount" />
            </el-form-item>

            <el-form-item class="col-12 px-3" label="Profesión u oficio">
              <el-input v-model="ruleFormStep.profession" />
            </el-form-item>
          </div>

          <div class="button-row d-flex w-100">
            <el-button type="default" @click="$emit('prev')"> Atrás </el-button>
            <el-button type="primary" class="ms-auto" @click="handleSubmit"> Siguiente </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style></style>
