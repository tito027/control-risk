<script lang="ts" setup>
import { Field, ModalState, Modals } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { computed, ref } from "vue"
import { AuthModule } from "@/store/modules/Auth"
import { TablesModule } from "@/store/table/Table"
import * as yup from "yup"

// props
const props = defineProps<{ state: ModalState }>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

// state
const loading = ref(false)
const value = ref<string>("0")
const nocturnality = ref<string>("0")
const schedules = ref([])
const schedulesMapped = ref<string[][]>([])
const agent_hours = ref([])
const userState = ref<string[]>([])
const turnLetters = ref<string[]>([])
const day_headers = ref<string[]>([])
const selectedOption = ref<string>()
/** modal values */
const daysModals = ref<string>("")
const shiftsModals = ref<string>("")
const typeModals = ref<string>("")
const styleModals = ref<string>("")
const agentsNeededModals = ref<string>("")
const hoursModals = ref<string>("")
const turnLettersModal = ref<string>("")

const regex =
  /^(?:([01]\d|2[0-3]):[0-5]\d-(?:(?!\1)([01]\d|2[0-3]):[0-5]\d);?)+$/

const fields = computed<{ [k: string]: Field }>(() => ({
  days: {
    label: "Dias de ciclo",
    type: "text",
    placeholder: "Digite cantidad de días del ciclo",
    name: "days",
    validate: {
      required: "Este campo es obligatorio",
    },
    value: daysModals.value,
  },
  shifts: {
    label: "Cantidad de turnos necesarios",
    type: "text",
    placeholder: "Digite cantidad de turnos totales para el ciclo",
    name: "shifts",
    validate: {
      required: "Este campo es obligatorio",
    },
    value: shiftsModals.value,
  },
  type: {
    label: "Tipo de turnos",
    type: "options",
    placeholder: "seleccione el tipo de turno",
    name: "type",
    staticOptions: [
      {
        value: "10",
        label: "10 hs",
      },
      {
        value: "12",
        label: "12 hs",
      },
      {
        value: "24",
        label: "24 hs",
      },
    ],
    options: { label: "label", key: "value" },
    validate: {
      required: "Este campo es obligatorio",
    },
    value: typeModals.value,
  },
  style: {
    label: "Tipo de coberturas",
    type: "options",
    placeholder: "seleccione el tipo de coberturas",
    name: "style",
    staticOptions: [
      {
        value: "5/2",
        label: "5/2",
      },
      {
        value: "5.5/1.5",
        label: "5.5/1.5",
      },
      {
        value: "6/1",
        label: "6/1",
      },
      {
        value: "24/7",
        label: "24/7",
      },
    ],
    options: { label: "label", key: "value" },
    validate: {
      required: "Este campo es obligatorio",
    },
    value: styleModals.value,
  },
  agents_needed: {
    label: "Cantidad de agentes necesarios por turno",
    type: "text",
    placeholder: "seleccione cantidad de agentes totales para un turno",
    name: "agents_needed",
    validate: {
      required: "Este campo es obligatorio",
    },
    value: agentsNeededModals.value,
  },
  hours: {
    label: "Horarios de turnos",
    type: "text",
    placeholder: "Digite turno. formato HH:mm-HH:mm;HH:mm-HH:mm;....",
    name: "hours",
    validate: {
      required: "Este campo es obligatorio",
      regex: [
        regex,
        "el formato debe ser formato HH:mm-HH:mm;HH:mm-HH:mm;....",
      ],
    },
    value: hoursModals.value,
  },
  turn_letters: {
    label: "Letras de turnos",
    type: "text",
    placeholder: "Digite las Letras que represente los turnos. ",
    name: "turn_letters",
    validate: {
      required: "Este campo es obligatorio",
      regex: [
        /^[A-Za-z](?:;[A-Za-z])*$/,
        "el formato debe ser por ejemplo M o M;N o M;T;N ....",
      ],
    },
    value: turnLettersModal.value,
  },
  init_date: {
    label: "Fecha inicio",
    type: "date",
    classPicker: "w-100 mt-1",
    classParent: "form-group w-100 px-1",
    placeholder: "Seleccione una fecha de inicio",
    name: "init_date",
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  agency: {
    label: "Agencia",
    type: "options",
    placeholder: "Seleccione una agencia",
    name: "agency",
    url: "payrolls/agency/list",
    options: {
      label: "label",
      key: "key",
    },
    validate: {
      required: "Este campo es obligatorio",
    },
  },
  agents: {
    label: "Agente",
    type: "multioptions",
    placeholder: "Seleccione agentes",
    name: "users",
    url: "payrolls/modals/users?workshifts_data=true&filter_workshift=true",
    multiple: true,
    cascaderOptions: {
      label: "label",
      value: "value",
      multiple: true,
      children: "children",
    },
  },
  extra_info: {
    label: "Horas extras calculadas",
    type: "text",
    value: value.value,
    name: "extra_info",
    disabled: true,
  },
  nocturnality: {
    label: "Nocturnidad calculada",
    type: "text",
    value: nocturnality.value,
    name: "nocturnality",
    disabled: true,
  },
}))

const getTurn = (turn: number) => {
  return turnLetters.value[turn - 1]
}

const validarDiferenciaHoras = (hora1: string, hora2: string, type: string) => {
  const date1: any = new Date(`2000-01-01T${hora1}:00`)
  const date2: any = new Date(`2000-01-01T${hora1}:00`)

  const horasASumar = Number(type) // Cantidad de horas a sumar
  date2.setHours(date1.getHours() + horasASumar)

  const diferenciaMilisegundos = date2 - date1
  const diferenciaSegundos = Math.abs(diferenciaMilisegundos / 1000)
  const diferenciaMinutos = Math.abs(diferenciaSegundos / 60)
  const diferenciaHoras = Math.floor(diferenciaMinutos / 60)

  return diferenciaHoras === Number(type)
}

const validarFormatoHorarios = (horarios: string, type: string) => {
  const rangos = horarios.split(";") // Dividir la cadena en rangos separados por ";"

  for (let i = 0; i < rangos.length; i++) {
    const rango = rangos[i] // Obtener el rango actual
    const [inicio, fin] = rango.split("-") // Dividir el rango en inicio y fin

    if (
      !validarHorario(inicio) ||
      !validarHorario(fin) ||
      !validarDiferenciaHoras(inicio, fin, type)
    ) {
      // Validar el horario de inicio y fin
      // Si alguno de los horarios no es válido, retornar falso
      return false
    }
  }

  return true // Si todos los rangos pasan las validaciones, retornar verdadero
}

const validarHorario = (horario: string) => {
  const regex = /^(?:2[0-3]|[01]\d):[0-5]\d$/ // Expresión regular para validar el formato del horario
  return regex.test(horario) // Validar el horario con la expresión regular y retornar el resultado
}

const validateShiftsCount = (
  shifts: string,
  hours: string,
  turn_letters: string
) => {
  return (
    Number(shifts) === hours.split(";").length &&
    Number(shifts) === turn_letters.split(";").length
  )
}

const validateCountDays = (days: string, style: string) => {
  const [a, b] = style.split("/")
  const daysNeeded = Number(a) + Number(b)
  const validCountDays = Number(days) >= daysNeeded || style === "24/7"
  return {
    validCountDays,
    daysNeeded,
  }
}

const validateUsersCount = (agents_needed: string, users: string[][] = []) => {
  const userNeeded: number = agents_needed
    .split(";")
    .reduce((acc: any, num: any): number => acc + Number(num), 0)
  const validUsersCount =
    users && users.length >= 0 && userNeeded >= users.flat().length
  return { validUsersCount, userNeeded }
}

const onTest = (payload: any) => {
  // validate
  
  const {
    days,
    hours,
    type,
    shifts,
    turn_letters,
    users,
    init_date,
    agents_needed,
    style,
    agency,
    extra_info,    
  } = payload

  const validRanges = validarFormatoHorarios(hours, type)

  const validInitDate = !!init_date

  const validShiftsCount = validateShiftsCount(shifts, hours, turn_letters)

  const { validCountDays, daysNeeded } = validateCountDays(days, style)

  const { validUsersCount, userNeeded } = validateUsersCount(
    agents_needed,
    users
  )

  if (
    validRanges &&
    validShiftsCount &&
    validUsersCount &&
    validCountDays &&
    validInitDate
  ) {
    loading.value = true
    console.log(payload)
    payload.users = payload.users ? payload.users.flat() : []
    const body = {
      days,
      shifts,
      type,
      style,
      agents_needed,
      hours,
      agency,
      turn_letters,
      users,
      init_date,
      extra_info,
      nocturnality: payload.nocturnality
    }
    const route = "payrolls/validate/extramode"
    ApiGateway.post(route, body)
      .then(response => {
        if (response.data.status) {
          value.value = response.data.payload.extra_info.toString()
          nocturnality.value = Number(
            response.data.payload.nocturnality
          ).toFixed(2)
          userState.value = response.data.payload.users
          turnLetters.value = response.data.payload.turn_letters.split(";")
          day_headers.value = response.data.payload.day_headers
          agent_hours.value = response.data.payload.agent_hours
          schedules.value = response.data.payload.schedules
          schedulesMapped.value = userState.value.map((user, index) => {
            return [
              `${user} (${agent_hours.value[index]})`,
              ...response.data.payload.schedules[index],
            ]
          })
          ElMessage({
            message: `Se consultó correctamente!!!`,
            type: "success",
          })
        } else {
          ElMessage({
            message: `completa o revisa los campos!!!`,
            type: "error",
          })
        }
      })
      .catch(() => {
        ElMessage({
          message: `No se ha podido consultar correctamente la info!!!`,
          type: "error",
        })
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    const defaultMessage = "Complete el formulario"
    const message = !validRanges
      ? "El formato de horarios no es correcto!!!"
      : !validShiftsCount
      ? `La cantidad de horarios o letras de turno no es correcto, se necesitan ${shifts}!!!`
      : !validUsersCount
      ? `La cantidad inválida de agentes seleccionado, necesitas ${userNeeded} !!!`
      : !validCountDays
      ? `La cantidad de días debería ser mayor o igual a ${daysNeeded}`
      : !validInitDate
      ? "El formato de la fecha de inicio es requerido !!!"
      : defaultMessage

    ElMessage({
      message: message,
      type: "error",
    })
    value.value = "0"
    nocturnality.value = "0"
    schedules.value = []
    userState.value = []
    turnLetters.value = []
    day_headers.value = []
  }
}
const TEMPLATES: any = {
  T1N_12HS_2A: {
    days: "30",
    shifts: "1",
    type: "12",
    style: "6/1",
    agents_needed: "2",
    hours: "18:00-06:00",
    turn_letters: "N",
  },
  T1D_12HS_2A: {
    days: "30",
    shifts: "1",
    type: "12",
    style: "6/1",
    agents_needed: "2",
    hours: "06:00-18:00",
    turn_letters: "D",
  },
  T2_12HS_3A: {
    days: "30",
    shifts: "2",
    type: "12",
    style: "24/7",
    agents_needed: "3",
    hours: "06:00-18:00;18:00-06:00",
    turn_letters: "D;N",
  },
  T2_24_7HS_4A: {
    days: "30",
    shifts: "2",
    type: "12",
    style: "24/7",
    agents_needed: "4",
    hours: "06:00-18:00;18:00-06:00",
    turn_letters: "D;N",
  },
}
const handleChange = () => {
  // Acciones a realizar cuando cambia la opción seleccionada
  console.log("Opción seleccionada:", selectedOption.value)
  if (selectedOption.value) {
    const { days, shifts, type, style, agents_needed, hours, turn_letters } =
      TEMPLATES[selectedOption.value]

    daysModals.value = days
    shiftsModals.value = shifts
    typeModals.value = type
    styleModals.value = style
    agentsNeededModals.value = agents_needed
    hoursModals.value = hours
    turnLettersModal.value = turn_letters
  }
}

const onSubmit = (payload: any) => {
  loading.value = true
  payload.by_user = AuthModule.id
  payload.schedules = schedules.value
  console.log({
    payload,
  })
  const route = "workshifts/workdays"
  ApiGateway.post(route, payload)
    .then(response => {
      if (response.status) {
        emits("changeModal", { show: false })
        TablesModule.setReload(true)
        ElMessage({
          message: `Se ha creado correctamente!!!`,
          type: "success",
        })
      }
    })
    .catch(() => {
      ElMessage({
        message: `No se ha podido crear correctamente!!!`,
        type: "error",
      })
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
<template>
  <form-modal
    :show="state.show"
    title="Asignación de turnos y agentes"
    modal-name="formCreateWorkshiftAgentModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="fields"
    :loading="loading"
    :specialButtonShow="true"
    specialButtonColor="success"
    specialButtonText="Test"
    @change-modal="(p: any) => emits('changeModal', p.payload)"
    @submit="onSubmit"
    @specialSubmit="onTest"
  >
    <template v-slot:header>
      <div>
        <label for="my-selector">Plantillas:</label>
        <select
          id="my-selector"
          v-model="selectedOption"
          @change="handleChange"
        >
          <option value="">Seleccionar</option>
          <option value="T2_12HS_3A">2 turnos / 12hs / 3 agentes</option>
          <option value="T2_24_7HS_4A">2 turnos / 24/7 / 4 agentes</option>
          <option value="T1N_12HS_2A">1 turno(N)/ 12 hs/ 2 agentes</option>
          <option value="T1D_12HS_2A">1 turno(D)/ 12 hs/ 2 agentes</option>
        </select>
      </div>
    </template>
    <div
      v-if="schedules.length"
      style="max-width: 1200px; overflow: auto; white-space: nowrap"
    >
      <div>
        <h5 class="mb-0">Patrón de turnos</h5>
        <p class="mb-0 text-sm">
          A continuación se muestra el patron de turnos que se aplicaría a los
          agentes.
        </p>
      </div>
      <br />

      <table>
        <thead>
          <tr>
            <th
              v-for="(day, k) in [
                'Agentes (horas totales) / Días',
                ...day_headers,
              ]"
            >
              <div class="tag-wrapper">
                <el-tag class="full-width" :key="k" effect="dark">
                  {{ day }}
                </el-tag>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in schedulesMapped" :key="i">
            <td v-for="(item, j) in row" :key="j">
              <div class="tag-wrapper">
                <el-tag
                  class="full-width"
                  :key="j"
                  :type="j === 0 ? '' : item.toString() === 'L' ? 'info' : ''"
                  :effect="j === 0 ? 'dark' : 'dark'"
                >
                  {{
                    ["L", "CD", "MD"].includes(item.toString()) || j === 0
                      ? item
                      : getTurn(Number(item))
                  }}
                </el-tag>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </form-modal>
</template>
<style>
.custom-el-tag {
  min-width: 220px;
}
.full-width {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
