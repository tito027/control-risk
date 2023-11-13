<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import BaseTable from "@/components/tables/Base.vue"
import { PayrollsModule } from "@/store/modules/Payroll"
import DinamicOptions from "@/components/DinamicOptions.vue"
import moment from "moment"
import { TablesModule } from "@/store/table/Table"
import { ElMessage } from "element-plus"
import * as XLSX from "xlsx"
import { GuardRoles } from "@/types/router"

type payrollHistory = {
  _id: string
  payrollData: {
    code: string
  }
}
type ExcelResponseElemnt = {
  carnet: string
  name: string
  salary: number
  totalHoursWorked: number
  totalDiscounts: number
  totalGratifications: number
}

type ExcelResponse = {
  success: boolean
  result: {
    status: boolean
    detail: string
    payroll_code: string
    data: ExcelResponseElemnt[]
  }
}

const options = ref<{ key: string; value: string; label: string }[]>([])

const urlParams = new URLSearchParams(window.location.search)
const payrollHistoryId = urlParams.get("payroll_history") ?? ""
const endpoint = ref<string>(`/payrolls/history/table/${payrollHistoryId}`)

const exportExcel = async () => {
  const payrollHistoryId = TablesModule.HistoryId
  // Crear un objeto Blob con el contenido de las tareas
  const { success, result }: ExcelResponse =
    await PayrollsModule.getPayrollHistoyExportExcelData(payrollHistoryId)
  if (success) {
    const { data, payroll_code, detail } = result
    const fileName = `historico_${payroll_code}_${moment()
      .utc()
      .unix()
      .toString()}.xlsx`
    // Formato de los datos en CSV
    let excelContent: ExcelResponseElemnt[] = []
    data.forEach(item => {
      const {
        carnet,
        name,
        salary,
        totalHoursWorked,
        totalDiscounts,
        totalGratifications,
      } = item
      excelContent.push({
        carnet,
        name,
        salary,
        totalHoursWorked,
        totalDiscounts,
        totalGratifications,
      })
    })

    // Crear una nueva hoja de cálculo
    const book = XLSX.utils.book_new()
    const hojaCalculo = XLSX.utils.json_to_sheet(excelContent)

    // Calcular el ancho máximo para las primeras columnas hasta la columna "H"
    /*const columnas = Object.keys(hojaCalculo).map((columna, index) => {
      if (index < 6) {
        // Ajusta el número 8 al índice correspondiente a la columna "H" + 1
        const anchoMaximo = excelContent.reduce((ancho, fila: any) => {
          const valor = fila[columna]
          const longitud = String(valor).length
          return longitud > ancho ? longitud : ancho
        }, columna.length + 2) // Agregar un margen adicional

        return { wch: anchoMaximo }
      }

      return { wch: 10 } // Ancho predeterminado para las columnas restantes
    })

    // Establecer el ancho de las columnas
    hojaCalculo["!cols"] = columnas
    */
    // Formato de moneda
    const formatoMoneda = {
      numFmt: '"$"#,##0.00',
    }

    // Aplicar formato de moneda a la columna "salario"
    Object.keys(hojaCalculo).forEach(celda => {
      const columnasMoneda = ["C", "E", "F"]
      if (
        columnasMoneda.includes(celda.charAt(0)) &&
        celda !== "C1" &&
        celda !== "E1" &&
        celda !== "F1"
      ) {
        hojaCalculo[celda].z = formatoMoneda
      }
    })

    // Agregar la hoja de cálculo al libro
    XLSX.utils.book_append_sheet(book, hojaCalculo, payroll_code)

    // Generar el archivo Excel como BLOB
    const libroExcel = XLSX.write(book, { type: "array", bookType: "xlsx" })
    const blob = new Blob([libroExcel], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    // Crear una URL del BLOB
    const url = URL.createObjectURL(blob)

    // Crear un elemento <a> para descargar el archivo
    const link = document.createElement("a")
    link.href = url
    link.download = fileName

    // Simular un clic en el enlace para iniciar la descarga
    link.click()

    // Liberar la URL del BLOB
    URL.revokeObjectURL(url)
  } else {
    ElMessage({
      showClose: true,
      message: "No se pudo descargar Historico!",
      type: "error",
    })
  }
}

const customOpstions = {
  icon: "fas fa-cog mx-1",
  options: [
    {
      name: "Exportar a Excel",
      icon: "fas fa-file-excel",
      handler: exportExcel,
      guard: [
        GuardRoles.RRHH,
        GuardRoles.ADMIN,
        GuardRoles.OP_MANAGER,
        GuardRoles.MANAGER_RRHH,
        GuardRoles.REP_FINANCIAL,
        GuardRoles.REP_LEGAL,
        GuardRoles.COS,
      ],
    },
  ],
}

onBeforeMount(async () => {
  const payrollHistory: any[] = await PayrollsModule.getHistoryDropdownData()
  console.log(payrollHistory)
  const dropDownOptions = payrollHistory.map(payrollHistory => {
    // Divide la fecha de inicio en sus componentes: año, mes y día
    const initDateComponents = payrollHistory.payrollData.init_date
      .split("T")[0]
      .split("-")
    const endDateComponents = payrollHistory.payrollData.end_date
      .split("T")[0]
      .split("-")

    // Reformatea las fechas en el formato "dd/mm/yy"
    const initDateFormatted = `${initDateComponents[2]}/${
      initDateComponents[1]
    }/${initDateComponents[0].slice(-2)}`
    const endDateFormatted = `${endDateComponents[2]}/${
      endDateComponents[1]
    }/${endDateComponents[0].slice(-2)}`

    // Construye la cadena de texto con el formato deseado
    const label = `${payrollHistory.payrollData.code} - ${initDateFormatted} - ${endDateFormatted}`

    return {
      key: payrollHistory._id,
      value: payrollHistory._id,
      label: label,
    }
  })

  options.value = dropDownOptions
})
</script>
<template>
  <div class="py-4 container-fluid">
    <div class="mt-4 row">
      <div class="col-12">
        <div class="card">
          <!-- Card header -->
          <div
            class="card-header d-flex align-items-center justify-content-between w-100"
          >
            <div>
              <h5 class="mb-0">Historial de planilla</h5>
              <p class="mb-0 text-sm">
                A continuación se listan todos los registros de agentes con
                cantidad de horas trabajadas.
              </p>
            </div>
            <div>
              <div>
                <dinamic-options
                  v-if="TablesModule.HistoryId != ''"
                  :customOpstions="customOpstions"
                />
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <BaseTable
              :hide-default-options="true"
              :hide-row-options="true"
              :select-filter-show="true"
              :select-filter-options="options"
              :select-filter-title="'Planilla:'"
              :columns="[
                {
                  label: 'Carnet',
                  prop: 'carnet',
                  minWidth: 100,
                  headerAlign: 'left',
                },
                {
                  label: 'Nombre',
                  prop: 'name',
                  minWidth: 180,
                  headerAlign: 'left',
                },
                {
                  label: 'Salario',
                  prop: 'salary',
                  minWidth: 120,
                  headerAlign: 'right',
                },
                {
                  label: 'Horas Trabajadas',
                  prop: 'totalHoursWorked',
                  minWidth: 150,
                  headerAlign: 'right',
                },
                {
                  label: 'Días Trabajadas',
                  prop: 'totalDaysWorked',
                  minWidth: 140,
                  headerAlign: 'right',
                },
                {
                  label: 'Descuentos',
                  prop: 'totalDiscounts',
                  minWidth: 120,
                  headerAlign: 'right',
                },
                {
                  label: 'Gratificaciones',
                  prop: 'totalGratifications',
                  minWidth: 120,
                  headerAlign: 'left',
                },
                {
                  label: 'Fecha',
                  prop: 'date',
                  minWidth: 120,
                  type: 'date',
                  headerAlign: 'left',
                },
              ]"
              :endpoint="endpoint"
            >
              <template #date="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ moment(scope.row.date).format("DD-MM-yyyy") }}
                </div>
              </template>
              <template #salary="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{
                    scope.row.salary.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  }}
                </div>
              </template>
              <template #totalDaysWorked="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ "15" }}
                </div>
              </template>
              <template #totalHoursWorked="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ scope.row.totalHoursWorked }}
                </div>
              </template>
              <template #totalDiscounts="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{
                    scope.row.totalDiscounts.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  }}
                </div>
              </template>
              <template #totalGratifications="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{
                    scope.row.totalGratifications.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  }}
                </div>
              </template>
            </BaseTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
