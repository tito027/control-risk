<script lang="ts" setup>
import ApiGateway from "@/store/api"
import { Field, ModalState } from "@/types/components"
import FormModal from "./FormModal.vue"
import { onMounted, ref } from "vue"
import { reactive } from "vue"
import { FormModule } from "@/store/modules/FormModule"
import { ElMessage } from "element-plus"
import yup from "@/utils/yup"
// props
const props = defineProps<{ show: boolean }>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

// state
const loading = ref(false)

const fields: { [k: string]: Field } = {
  extraMode: {
    type: "options",
    name: "extraMode",
    label: "Modalidad pago de horas extra",
    placeholder: "Seleccione una modalidad de pago de horas extra",
    staticOptions: [
      {
        value: "0",
        label: "No se pagan horas extra",
      },
      {
        value: "1",
        label: "Pago de horas extra pasadas 44 horas",
      },
      {
        value: "2",
        label: "Pago de horas extra al exceder su horario en su turno",
      },
    ],
    options: {
      label: "label",
      key: "value",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
    value: "",
  },
  useMinimumSalary: {
    type: "checkbox",
    name: "useMinimumSalary",
    label: "Usar salario mínimo",
    classParent: "justify-content-center align-items-center",
    checked: false,
  },
  agentBaseSalary: {
    type: "number",
    name: "agentBaseSalary",
    label: "Salario base (agente)",
    placeholder: "Ingresa el salario base de agente de seguridad",
    step: 0.01,
    min: 0,
    hidden: {
      useMinimumSalary: false,
    },
    validate: {
      when: [
        "useMinimumSalary",
        {
          is: false,
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  bossGroupBaseSalary: {
    type: "number",
    name: "bossGroupBaseSalary",
    label: "Salario base (jefe de grupo)",
    placeholder: "Ingresa el salario base de jefe de grupo",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2,
    },
    value: "",
  },
  supervisorBaseSalary: {
    type: "number",
    name: "supervisorBaseSalary",
    label: "Salario base (supervisor)",
    placeholder: "Ingresa el salario base de supervisor",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2,
    },
    value: "",
  },
  assistantSupervisorBaseSalary: {
    type: "number",
    name: "assistantSupervisorBaseSalary",
    label: "Salario base (supervisor asistente)",
    placeholder: "Ingresa el salario base de supervisor asistente",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2,
    },
    value: "",
  },
  ppiBaseSalary: {
    type: "number",
    name: "ppiBaseSalary",
    label: "Salario base (ppi)",
    placeholder: "Ingresa el salario base de ppi",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2,
    },
    value: "",
  },
  motorAgentBaseSalary: {
    type: "number",
    name: "motorAgentBaseSalary",
    label: "Salario base (agente motorizado)",
    placeholder: "Ingresa el salario base de agente motorizado",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2,
    },
    value: "",
  },
  driverBaseSalary: {
    type: "number",
    name: "driverBaseSalary",
    label: "Salario base (motorista)",
    placeholder: "Ingresa el salario base de motorista",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2,
    },
    value: "",
  },
  preventionAgentBaseSalary: {
    type: "number",
    name: "preventionAgentBaseSalary",
    label: "Salario base (agente de prevensión)",
    placeholder: "Ingresa el salario base de agente de prevensión",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2,
    },
    value: "",
  },
  agentCustomerPayment: {
    type: "number",
    name: "agentCustomerPayment",
    label: "Precio al cliente de agente",
    placeholder: "Ingresa el precio al cliente de agente de seguridad",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2,
    },
    value: "",
  },
  bossGroupCustomerPayment: {
    type: "number",
    name: "bossGroupCustomerPayment",
    label: "Precio al cliente de jefe de grupo",
    placeholder: "Ingresa el precio al cliente de jefe de grupo",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2,
    },
    value: "",
  },
  supervisorCustomerPayment: {
    type: "number",
    name: "supervisorCustomerPayment",
    label: "Precio al cliente de supervisor",
    placeholder: "Ingresa el precio al cliente de supervisor",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2,
    },
    value: "",
  },
  assistantSupervisorCustomerPayment: {
    type: "number",
    name: "assistantSupervisorCustomerPayment",
    label: "Precio al cliente de supervisor asistente",
    placeholder: "Ingresa el precio al cliente de supervisor asistente",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2,
    },
    value: "",
  },
  ppiCustomerPayment: {
    type: "number",
    name: "ppiCustomerPayment",
    label: "Precio al cliente de ppi",
    placeholder: "Ingresa el precio al cliente de ppi",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2,
    },
    value: "",
  },
  motorAgentCustomerPayment: {
    type: "number",
    name: "motorAgentCustomerPayment",
    label: "Precio al cliente de agente motorizado",
    placeholder: "Ingresa el precio al cliente de agente motorizado",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2,
    },
    value: "",
  },
  driverCustomerPayment: {
    type: "number",
    name: "driverCustomerPayment",
    label: "Precio al cliente de motorista",
    placeholder: "Ingresa el precio al cliente de motorista",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2,
    },
    value: "",
  },
  preventionAgentCustomerPayment: {
    type: "number",
    name: "preventionAgentCustomerPayment",
    label: "Precio al cliente de agente de prevensión",
    placeholder: "Ingresa el precio al cliente de agente de prevensión",
    step: 0.01,
    min: 0,
    validate: {
      required: "Este campo es requerido",
      typeError: "Este campo es requerido",
      min: [0, "Debes ingresar un numero mayor o igual a 0"],
      decimalAllows: 2,
    },
    value: "",
  },
  agentExtraSalary: {
    type: "number",
    name: "agentExtraSalary",
    label: "Salario extra (agente)",
    placeholder: "Ingresa el salario extra de agente de seguridad",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  bossGroupExtraSalary: {
    type: "number",
    name: "bossGroupExtraSalary",
    label: "Salario extra (jefe de grupo)",
    placeholder: "Ingresa el salario extra de jefe de grupo",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  supervisorExtraSalary: {
    type: "number",
    name: "supervisorExtraSalary",
    label: "Salario extra (supervisor)",
    placeholder: "Ingresa el salario extra de supervisor",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  assistantSupervisorExtraSalary: {
    type: "number",
    name: "assistantSupervisorExtraSalary",
    label: "Salario extra (supervisor asistente)",
    placeholder: "Ingresa el salario extra de supervisor asistente",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  ppiExtraSalary: {
    type: "number",
    name: "ppiExtraSalary",
    label: "Salario extra (ppi)",
    placeholder: "Ingresa el salario extra de ppi",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  motorAgentExtraSalary: {
    type: "number",
    name: "motorAgentExtraSalary",
    label: "Salario extra (agente motorizado)",
    placeholder: "Ingresa el salario extra de agente motorizado",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  driverExtraSalary: {
    type: "number",
    name: "driverExtraSalary",
    label: "Salario extra (motorista)",
    placeholder: "Ingresa el salario extra de motorista",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  preventionAgentExtraSalary: {
    type: "number",
    name: "preventionAgentExtraSalary",
    label: "Salario extra (agente de prevensión)",
    placeholder: "Ingresa el salario extra de agente de prevensión",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  agentNightlyExtraSalary: {
    type: "number",
    name: "agentNightlyExtraSalary",
    label: "Salario extra nocturno (agente)",
    placeholder: "Ingresa el salario extra nocturno de agente de seguridad",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  bossGroupNightlyExtraSalary: {
    type: "number",
    name: "bossGroupNightlyExtraSalary",
    label: "Salario extra nocturno (jefe de grupo)",
    placeholder: "Ingresa el salario extra nocturno de jefe de grupo",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  supervisorNightlyExtraSalary: {
    type: "number",
    name: "supervisorNightlyExtraSalary",
    label: "Salario extra nocturno (supervisor)",
    placeholder: "Ingresa el salario extra nocturno de supervisor",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  assistantSupervisorNightlyExtraSalary: {
    type: "number",
    name: "assistantSupervisorNightlyExtraSalary",
    label: "Salario extra nocturno (supervisor asistente)",
    placeholder: "Ingresa el salario extra nocturno de supervisor asistente",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  ppiNightlyExtraSalary: {
    type: "number",
    name: "ppiNightlyExtraSalary",
    label: "Salario extra nocturno (ppi)",
    placeholder: "Ingresa el salario extra nocturno de agente de ppi",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  motorAgentNightlyExtraSalary: {
    type: "number",
    name: "motorAgentNightlyExtraSalary",
    label: "Salario extra nocturno (agente motorizado)",
    placeholder: "Ingresa el salario extra nocturno de agente motorizado",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  driverNightlyExtraSalary: {
    type: "number",
    name: "driverNightlyExtraSalary",
    label: "Salario extra nocturno (motorista)",
    placeholder: "Ingresa el salario extra nocturno de motorista",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
  preventionAgentNightlyExtraSalary: {
    type: "number",
    name: "preventionAgentNightlyExtraSalary",
    label: "Salario extra nocturno (agente de prevensión)",
    placeholder: "Ingresa el salario extra nocturno de agente de prevensión",
    step: 0.01,
    min: 0,
    hidden: {
      extraMode: ["1", "2"],
    },
    validate: {
      when: [
        "extraMode",
        {
          is: (val: string) => ["1", "2"].includes(val),
          then: yup
            .number()
            .typeError("Este campo es requerido")
            .required("Este campo es requerido")
            .min(0, "Debes ingresar un numero mayor o igual a 0")
            .decimalAllows(2),
          otherwise: yup.number().nullable(),
        },
      ],
    },
    value: "",
  },
}

const reactiveFields = reactive(fields)

function onSubmit(e: any) {
  loading.value = true
  const extraMode = parseInt(e.extraMode)
  const baseSalary = {
    securityAgent: e.useMinimumSalary ? 0 : parseFloat(e.agentBaseSalary),
    groupBoss: parseFloat(e.bossGroupBaseSalary),
    supervisor: parseFloat(e.supervisorBaseSalary),
    assistantSupervisor: parseFloat(e.assistantSupervisorBaseSalary),
    ppi: parseFloat(e.ppiBaseSalary),
    motorAgent: parseFloat(e.motorAgentBaseSalary),
    driver: parseFloat(e.driverBaseSalary),
    preventionAgent: parseFloat(e.preventionAgentBaseSalary),
  }
  const customerPayment = {
    securityAgent: parseFloat(e.agentCustomerPayment),
    groupBoss: parseFloat(e.bossGroupCustomerPayment),
    supervisor: parseFloat(e.supervisorCustomerPayment),
    assistantSupervisor: parseFloat(e.assistantSupervisorCustomerPayment),
    ppi: parseFloat(e.ppiCustomerPayment),
    motorAgent: parseFloat(e.motorAgentCustomerPayment),
    driver: parseFloat(e.driverCustomerPayment),
    preventionAgent: parseFloat(e.preventionAgentCustomerPayment),
  }
  const extraSalary = {
    securityAgent: extraMode !== 0 ? parseFloat(e.agentExtraSalary) : 0,
    groupBoss: extraMode !== 0 ? parseFloat(e.bossGroupExtraSalary) : 0,
    supervisor: extraMode !== 0 ? parseFloat(e.supervisorExtraSalary) : 0,
    assistantSupervisor:
      extraMode !== 0 ? parseFloat(e.assistantSupervisorExtraSalary) : 0,
    ppi: extraMode !== 0 ? parseFloat(e.ppiExtraSalary) : 0,
    motorAgent: extraMode !== 0 ? parseFloat(e.motorAgentExtraSalary) : 0,
    driver: extraMode !== 0 ? parseFloat(e.driverExtraSalary) : 0,
    preventionAgent:
      extraMode !== 0 ? parseFloat(e.preventionAgentExtraSalary) : 0,
  }
  const nightlyExtraSalary = {
    securityAgent: extraMode !== 0 ? parseFloat(e.agentNightlyExtraSalary) : 0,
    groupBoss: extraMode !== 0 ? parseFloat(e.bossGroupNightlyExtraSalary) : 0,
    supervisor:
      extraMode !== 0 ? parseFloat(e.supervisorNightlyExtraSalary) : 0,
    assistantSupervisor:
      extraMode !== 0 ? parseFloat(e.assistantSupervisorNightlyExtraSalary) : 0,
    ppi: extraMode !== 0 ? parseFloat(e.ppiNightlyExtraSalary) : 0,
    motorAgent:
      extraMode !== 0 ? parseFloat(e.motorAgentNightlyExtraSalary) : 0,
    driver: extraMode !== 0 ? parseFloat(e.driverNightlyExtraSalary) : 0,
    preventionAgent:
      extraMode !== 0 ? parseFloat(e.preventionAgentNightlyExtraSalary) : 0,
  }

  const payload = {
    extraMode,
    baseSalary,
    customerPayment,
    extraSalary,
    nightlyExtraSalary,
  }

  ApiGateway.post(`/business/update/config/${FormModule.getId}`, payload)
    .then(() => {
      ElMessage({
        message: `Se han actualizado las configuraciones con exito!!!`,
        type: "success",
      })
      FormModule.setUpdateData()
      emits("changeModal", { show: false })
    })
    .catch(err => {
      console.log(err)
      ElMessage({
        message: `No se han podido actualizar las configuraciones correctamente!!!`,
        type: "error",
      })
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(async () => {
  loading.value = true
  ApiGateway.get(`/business/find/config/${FormModule.getId}`)
    .then(response => {
      console.log(response.data, "CONFIGS")
      reactiveFields.extraMode.value = response.data.extraMode.toString()
      // Base salary
      reactiveFields.useMinimumSalary.label = `Usar salario mínimo ($${response.data.minimunSalary})`
      reactiveFields.useMinimumSalary.checked = response.data.baseSalary
        .securityAgent
        ? false
        : true
      reactiveFields.agentBaseSalary.value =
        response.data.baseSalary.securityAgent.toString()
      reactiveFields.bossGroupBaseSalary.value =
        response.data.baseSalary.groupBoss.toString()
      reactiveFields.supervisorBaseSalary.value =
        response.data.baseSalary.supervisor.toString()
      reactiveFields.assistantSupervisorBaseSalary.value =
        response.data.baseSalary.assistantSupervisor.toString()
      reactiveFields.ppiBaseSalary.value =
        response.data.baseSalary.ppi.toString()
      reactiveFields.motorAgentBaseSalary.value =
        response.data.baseSalary.motorAgent.toString()
      reactiveFields.driverBaseSalary.value =
        response.data.baseSalary.driver.toString()
      reactiveFields.preventionAgentBaseSalary.value =
        response.data.baseSalary.preventionAgent.toString()
      // Customer payment
      reactiveFields.agentCustomerPayment.value =
        response.data.customerPayment.securityAgent.toString()
      reactiveFields.bossGroupCustomerPayment.value =
        response.data.customerPayment.groupBoss.toString()
      reactiveFields.supervisorCustomerPayment.value =
        response.data.customerPayment.supervisor.toString()
      reactiveFields.assistantSupervisorCustomerPayment.value =
        response.data.customerPayment.assistantSupervisor.toString()
      reactiveFields.ppiCustomerPayment.value =
        response.data.customerPayment.ppi.toString()
      reactiveFields.motorAgentCustomerPayment.value =
        response.data.customerPayment.motorAgent.toString()
      reactiveFields.driverCustomerPayment.value =
        response.data.customerPayment.driver.toString()
      reactiveFields.preventionAgentCustomerPayment.value =
        response.data.customerPayment.preventionAgent.toString()
      // Extra salary
      reactiveFields.agentExtraSalary.value =
        response.data.extraSalary.securityAgent.toString()
      reactiveFields.bossGroupExtraSalary.value =
        response.data.extraSalary.groupBoss.toString()
      reactiveFields.supervisorExtraSalary.value =
        response.data.extraSalary.supervisor.toString()
      reactiveFields.assistantSupervisorExtraSalary.value =
        response.data.extraSalary.assistantSupervisor.toString()
      reactiveFields.ppiExtraSalary.value =
        response.data.extraSalary.ppi.toString()
      reactiveFields.motorAgentExtraSalary.value =
        response.data.extraSalary.motorAgent.toString()
      reactiveFields.driverExtraSalary.value =
        response.data.extraSalary.driver.toString()
      reactiveFields.preventionAgentExtraSalary.value =
        response.data.extraSalary.preventionAgent.toString()
      // Nigthly extra salary
      reactiveFields.agentNightlyExtraSalary.value =
        response.data.nigthlyExtraSalary.securityAgent.toString()
      reactiveFields.bossGroupNightlyExtraSalary.value =
        response.data.nigthlyExtraSalary.groupBoss.toString()
      reactiveFields.supervisorNightlyExtraSalary.value =
        response.data.nigthlyExtraSalary.supervisor.toString()
      reactiveFields.assistantSupervisorNightlyExtraSalary.value =
        response.data.nigthlyExtraSalary.assistantSupervisor.toString()
      reactiveFields.ppiNightlyExtraSalary.value =
        response.data.nigthlyExtraSalary.ppi.toString()
      reactiveFields.motorAgentNightlyExtraSalary.value =
        response.data.nigthlyExtraSalary.motorAgent.toString()
      reactiveFields.driverNightlyExtraSalary.value =
        response.data.nigthlyExtraSalary.driver.toString()
      reactiveFields.preventionAgentNightlyExtraSalary.value =
        response.data.nigthlyExtraSalary.preventionAgent.toString()
    })
    .catch(err => {
      if (!err.message.includes("undefined"))
        ElMessage({
          message: `No se ha podido obtener la configuración de la empresa!!!`,
          type: "error",
        })
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
<template>
  <form-modal
    :show="show"
    :title="`Configuraciones de la empresa ${FormModule.getData.name}`"
    modal-name="formBusinessConfigModal"
    column-classes="col-lg-4 col-md-6 col-12"
    :inputs="reactiveFields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmit"
  />
</template>
