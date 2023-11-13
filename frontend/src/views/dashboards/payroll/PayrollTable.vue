<script setup lang="ts">
import { ref, toRefs, reactive, onBeforeMount, computed, watch } from "vue"
import { Modals, Field, ModalState } from "@/types/components"
import ArgonButton from "@/components/ArgonButton.vue"
import BaseTable from "@/components/tables/Base.vue"
import PayrollModal from "@/components/modals/PayrollModal.vue"
import PayrollDropdown from "@/components/PayrollDropdown.vue"
import DinamicOptions from "@/components/DinamicOptions.vue"
import { PayrollsModule } from "@/store/modules/Payroll"
import { ElMessage } from "element-plus"
import * as pdfMakeLib from "pdfmake/build/pdfmake"
import * as pdfFonts from "pdfmake/build/vfs_fonts"
import * as XLSX from "xlsx"
import * as ExcelJS from "exceljs"
import { AuthModule } from "@/store/modules/Auth"
import moment from "moment"
import { GuardRoles } from "@/types/router"

const pdfMake = {
  ...pdfMakeLib,
  vfs: pdfFonts.pdfMake.vfs,
}

// types
export type Option = Array<string>
type TxtResponseElemnt = {
  _id: string
  origin_acount: string
  target_acount: string
  year: number
  month: number
  day: number
  salary: number
}
type TxtResponse = {
  success: boolean
  result: {
    status: boolean
    payroll_code: string
    data: TxtResponseElemnt[]
  }
}

type CSVResponseElemnt = {
  acount_target: string
  full_name: string
  days: number
  count: number
  detail: string
}

type CSVResponse = {
  success: boolean
  result: {
    status: boolean
    detail: string
    payroll_code: string
    data: CSVResponseElemnt[]
  }
}

// Definición de las interfaces
type DataTable = {
  carnet: string
  full_name: string
  project: string
  zone: string
  salary: string
  gratifications: string
  discounts: string
  working_days: string
  imp_rent: string
  iss: string
  afp: string
  total_pay: string
}

type PDFBaseResponse = {
  success: boolean
  result: {
    status: boolean
    detail: string
    payroll_code: string
    data: DataTable[]
  }
}

type groupDataByZoneAndProjectgratifications = {
  gratification_type: string
  gratification_name: string
  users: {
    carnet: string
    full_name: string
    banco: number
    cheque: number
    efectivo: number
  }[]
  totals: {
    banco: number
    cheque: number
    efectivo: number
  }
}

type groupDataByZoneAndProjectResponse = {
  zone: string
  projects: {
    project: string
    gratifications: groupDataByZoneAndProjectgratifications[]
  }[]
}

type PDFGratificationResponse = {
  success: boolean
  result: {
    status: boolean
    detail: string
    payroll_code: string
    data: groupDataByZoneAndProjectResponse[]
    totals: {
      banco: number
      cheque: number
      efectivo: number
    }
  }
}

const date = moment().format("DD/MM/YYYY hh:mm A")

// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void
}>()

const state = reactive<any>({
  formPayrollDiscountModal: {
    show: false,
  },
  formPayrollGratificationModal: {
    show: false,
  },
  table: {
    relaod: false,
  },
})

const props = defineProps<{}>()

// funcitons
function changeModal(payload: ModalState, modal: Modals) {
  state[modal].show = payload.show
}

const modalUser = ref<string>("")
const modalTitle = ref<string>("")
const modalPayrollConfig = ref<string>("")
const payrollFrom = ref<string>("")
const payrollUntil = ref<string>("")
const customOpstions = ref<any>({})

function formatNumber(
  num: number,
  count: number,
  withDecimals: boolean = false
) {
  // Obtiene la parte entera del número y la completa con ceros a la izquierda
  let integerPart = Math.floor(num).toString()
  integerPart =
    integerPart.length < count ? integerPart.padStart(count, "0") : integerPart
  let decimalPart = ""
  if (withDecimals) {
    // Obtiene los decimales del número y los completa con ceros a la derecha
    decimalPart = (num % 1).toFixed(2).slice(2).padEnd(2, "0")
  }
  // Concatena la parte entera y los decimales y devuelve el resultado
  return integerPart + decimalPart
}

async function exportTXT() {
  // Crear un objeto Blob con el contenido de las tareas
  const { success, result }: TxtResponse =
    await PayrollsModule.getPayrollExportTXTData()
  console.log(result)
  if (success) {
    const { data, payroll_code } = result
    let fileName = `Cuscatlan - ANTICIPO ${payroll_code}.txt`
    let fileContent = data
      .map(item =>
        [
          item.origin_acount,
          "     ",
          item.target_acount,
          item.year,
          formatNumber(item.month, 2),
          formatNumber(item.day, 2),
          formatNumber(item.salary, 7, true).replace(".", ""),
          "            ",
          payroll_code,
        ].join("")
      )
      .join("\n")
    // Crea un objeto Blob
    const blob = new Blob([fileContent], { type: "text/plain" })
    // Crea un objeto URL para el objeto Blob
    const url = window.URL.createObjectURL(blob)

    // Crea un elemento <a> para descargar el archivo
    const link = document.createElement("a")

    link.href = url
    link.setAttribute("download", fileName)

    // Agrega el elemento <a> al DOM
    document.body.appendChild(link)

    // Simula un clic en el enlace para descargar el archivo
    link.click()

    // Remueve el elemento <a> del DOM
    document.body.removeChild(link)

    // Libera el objeto URL
    window.URL.revokeObjectURL(url)
  } else {
    ElMessage({
      showClose: true,
      message: "No se pudo descargar el archivo Cuscatlan txt!",
      type: "error",
    })
  }
}

async function exportCSV() {
  // Crear un objeto Blob con el contenido de las tareas
  const { success, result }: CSVResponse =
    await PayrollsModule.getPayrollExportCSVData()
  if (success) {
    const { data, payroll_code, detail } = result
    const fileName = "Agricola - " + detail + ".csv"
    // Formato de los datos en CSV
    let csvContent = ""
    data.forEach(item => {
      csvContent += [
        item.acount_target,
        item.full_name.toLocaleUpperCase(),
        "",
        item.days,
        item.count,
        item.detail,
        "\n",
      ].join(",")
    })

    // Crear un enlace de descarga para el archivo CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", fileName)
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    ElMessage({
      showClose: true,
      message: "No se pudo descargar Agricola CSV!",
      type: "error",
    })
  }
}

async function exportPDFBase(): Promise<void> {
  // Crear un objeto Blob con el contenido de las tareas
  const { success, result }: PDFBaseResponse =
    await PayrollsModule.getPayrollExportBasePDFData()
  if (success) {
    // Define los datos para rellenar la tabla
    const data: DataTable[] = result.data
    const totals = {
      salary: 0,
      iss: 0,
      afp: 0,
      imp_rent: 0,
      gratifications: 0,
      discounts: 0,
      total_pay: 0,
    }
    data.map(item => {
      totals.salary += Number(item.salary)
      totals.iss += Number(item.iss)
      totals.afp += Number(item.afp)
      totals.imp_rent += Number(item.imp_rent)
      totals.gratifications += Number(item.gratifications)
      totals.discounts += Number(item.discounts)
      totals.total_pay += Number(item.total_pay)
    })
    const docDefinition: any = {
      pageOrientation: "landscape",
      content: [
        {
          text: `F. PLANILLA DE EMPLEADOS No.${result.payroll_code}`,
          alignment: "left",
          margin: [0, 0, 0, 0],
          fontSize: 12,
          bold: true,
        },
        {
          text: `HORA Y FECHA DE EMISION: ${date}`,
          alignment: "left",
          margin: [0, 0, 0, 0],
          fontSize: 12,
          bold: true,
        },
        {
          text: `EMPRESA: Internacional Control Risk Group S.A. de C.V.`,
          alignment: "left",
          margin: [0, 0, 0, 0],
          fontSize: 12,
          bold: true,
        },
        {
          style: "tableExample",
          layout: {
            fillColor: function (rowIndex: any, node: any, columnIndex: any) {
              return rowIndex === 0 ? "#32a8a2" : null
            },
          },
          table: {
            headerRows: 1,
            //widths: [ '100%'],
            heights: [10, 10],
            body: [
              [
                {
                  text: "Carnet",
                  style: "header",
                  fontSize: 9,
                  bold: true,
                  color: "#FFFFFF",
                },
                {
                  text: "Nombre Completo",
                  style: "header",
                  fontSize: 9,
                  bold: true,
                  color: "#FFFFFF",
                },
                {
                  text: "Proyecto",
                  style: "header",
                  fontSize: 9,
                  bold: true,
                  color: "#FFFFFF",
                },
                {
                  text: "Zona",
                  style: "header",
                  fontSize: 9,
                  bold: true,
                  color: "#FFFFFF",
                },
                {
                  text: "Salario",
                  style: "header",
                  fontSize: 9,
                  bold: true,
                  color: "#FFFFFF",
                },
                {
                  text: "Días Laborados",
                  style: "header",
                  fontSize: 9,
                  bold: true,
                  color: "#FFFFFF",
                },
                {
                  text: "AFP",
                  style: "header",
                  fontSize: 9,
                  bold: true,
                  color: "#FFFFFF",
                },
                {
                  text: "ISSS",
                  style: "header",
                  fontSize: 9,
                  bold: true,
                  color: "#FFFFFF",
                },
                {
                  text: "Imp./Renta",
                  style: "header",
                  fontSize: 9,
                  bold: true,
                  color: "#FFFFFF",
                },
                {
                  text: "Gratificaciones",
                  style: "header",
                  fontSize: 9,
                  bold: true,
                  color: "#FFFFFF",
                },
                {
                  text: "Descuentos",
                  style: "header",
                  fontSize: 9,
                  bold: true,
                  color: "#FFFFFF",
                },
                {
                  text: "Pago Total",
                  style: "header",
                  fontSize: 9,
                  bold: true,
                  color: "#FFFFFF",
                },
              ],
              ...data.map(row => [
                { text: row.carnet, fontSize: 8 },
                { text: row.full_name, fontSize: 8 },
                { text: row.project, fontSize: 8 },
                { text: row.zone, fontSize: 8 },
                {
                  text: formatMoney(Number(row.salary)),
                  fontSize: 8,
                  alignment: "right",
                },
                { text: row.working_days, fontSize: 8, alignment: "right" },
                {
                  text: formatMoney(Number(row.afp)),
                  fontSize: 8,
                  alignment: "right",
                },
                {
                  text: formatMoney(Number(row.iss)),
                  fontSize: 8,
                  alignment: "right",
                },
                {
                  text: formatMoney(Number(row.imp_rent)),
                  fontSize: 8,
                  alignment: "right",
                },
                {
                  text: formatMoney(Number(row.gratifications)),
                  fontSize: 8,
                  alignment: "right",
                },
                {
                  text: formatMoney(Number(row.discounts)),
                  fontSize: 8,
                  alignment: "right",
                },
                {
                  text: formatMoney(Number(row.total_pay)),
                  fontSize: 8,
                  alignment: "right",
                },
              ]),
              [
                {
                  text: "Totales:",
                  colSpan: 4,
                  fontSize: 9,
                  bold: true,
                },
                {},
                {},
                {},
                {
                  text: formatMoney(totals.salary),
                  fontSize: 9,
                  bold: true,
                  alignment: "right",
                },
                {},
                {
                  text: formatMoney(totals.afp),
                  fontSize: 9,
                  bold: true,
                  alignment: "right",
                },
                {
                  text: formatMoney(totals.iss),
                  fontSize: 9,
                  bold: true,
                  alignment: "right",
                },
                {
                  text: formatMoney(totals.imp_rent),
                  fontSize: 9,
                  bold: true,
                  alignment: "right",
                },
                {
                  text: formatMoney(totals.gratifications),
                  fontSize: 9,
                  bold: true,
                  alignment: "right",
                },
                {
                  text: formatMoney(totals.discounts),
                  fontSize: 9,
                  bold: true,
                  alignment: "right",
                },
                {
                  text: formatMoney(totals.total_pay),
                  fontSize: 9,
                  bold: true,
                  alignment: "right",
                },
              ],
            ],
          },
        },
      ],
      footer: footer,
      pageSize: "A4",
      pageMargins: [40, 60, 40, 60],
    }

    pdfMake.createPdf(docDefinition).download(result.payroll_code + ".pdf")
  } else {
    ElMessage({
      showClose: true,
      message: "No se pudo descargar archivo planilla base PDF!",
      type: "error",
    })
  }
}

async function exportPDFGratification(): Promise<void> {
  // Crear un objeto Blob con el contenido de las tareas
  const { success, result }: PDFGratificationResponse =
    await PayrollsModule.getPayrollExportGratificationPDFData()
  if (success) {
    // Define los datos para rellenar la tabla
    const data: groupDataByZoneAndProjectResponse[] = result.data
    const totals: {
      banco: number
      cheque: number
      efectivo: number
    } = result.totals

    const docDefinition: any = {
      pageOrientation: "portrait",
      content: [
        {
          table: {
            headerRows: 1,
            //widths: ["auto", "auto", "auto", "auto", "auto"],
            body: [
              [
                { text: "Código", border: [false, false, false, false] },
                { text: "Nombre", border: [false, false, false, false] },
                { text: "Depósito", border: [false, false, false, false] },
                { text: "Efectivo", border: [false, false, false, false] },
                { text: "Cheque", border: [false, false, false, false] },
              ],
              ...data
                .map(zone => {
                  const content = []
                  /** seteo el nombre de zona */
                  content.push([
                    {
                      text: `Zona: ${zone.zone}`,
                      colSpan: 5,
                      fontSize: 9,
                      bold: true,
                      border: [false, false, false, false],
                    },
                    {},
                    {},
                    {},
                    {},
                  ])
                  /** itero cada proyecto */
                  zone.projects.map(project => {
                    project.gratifications.map(gratification => {
                      /** agrego la cabecera de gratificante */
                      content.push([
                        {
                          text: `TIPO: ${gratification.gratification_name}`,
                          colSpan: 5,
                          fontSize: 9,
                          bold: true,
                          border: [false, false, false, false],
                        },
                        {},
                        {},
                        {},
                        {},
                      ])
                      gratification.users.map(user => {
                        /**itero los usuarios */
                        content.push([
                          {
                            text: user.carnet,
                            fontSize: 8,
                            border: [false, false, false, false],
                          },
                          {
                            text: user.full_name,
                            fontSize: 8,
                            border: [false, false, false, false],
                          },
                          {
                            text: formatMoney(user.banco),
                            fontSize: 8,
                            alignment: "right",
                            border: [false, false, false, false],
                          },
                          {
                            text: formatMoney(user.efectivo),
                            fontSize: 8,
                            alignment: "right",
                            border: [false, false, false, false, false],
                          },
                          {
                            text: formatMoney(user.cheque),
                            fontSize: 8,
                            alignment: "right",
                            border: [false, false, false, false, false],
                          },
                        ])
                      })
                      /** agrego el nombre del proyecto y totales */
                      content.push([
                        {
                          text: "",
                          border: [false, false, false, false, false],
                        },
                        {
                          text: `Proyecto: ${project.project}`,
                          fontSize: 9,
                          bold: true,
                          border: [false, false, false, false], //Quita la línea izquierda, y deja las demás
                        },
                        {
                          text: formatMoney(gratification.totals.banco),
                          alignment: "right",
                          fontSize: 8,
                          bold: true,
                          border: [false, false, false, false],
                        },
                        {
                          text: formatMoney(gratification.totals.efectivo),
                          alignment: "right",
                          fontSize: 8,
                          border: [false, false, false, false, false],
                        },
                        {
                          text: formatMoney(gratification.totals.cheque),
                          alignment: "right",
                          fontSize: 8,
                          border: [false, false, false, false, false],
                        },
                      ])
                    })
                  })
                  return content
                })
                .flat(),
              /** separador */
              [
                { text: "", colSpan: 5, border: [false, false, false, false] },
                {},
                {},
                {},
                {},
              ],
              [
                {
                  text: "Sub totales",
                  fontSize: 9,
                  border: [false, false, false, false],
                },
                { text: "", border: [false, false, false, false] },
                {
                  text: formatMoney(totals.banco),
                  fontSize: 8,
                  border: [false, false, false, false],
                  alignment: "right",
                },
                {
                  text: formatMoney(totals.efectivo),
                  fontSize: 8,
                  border: [false, false, false, false],
                  alignment: "right",
                },
                {
                  text: formatMoney(totals.cheque),
                  fontSize: 8,
                  border: [false, false, false, false],
                  alignment: "right",
                },
              ],
              [
                {
                  text: "Total",
                  fontSize: 9,
                  border: [false, false, false, false],
                },
                { text: "", border: [false, false, false, false] },
                { text: "", border: [false, false, false, false] },
                { text: "", border: [false, false, false, false] },
                {
                  text: formatMoney(
                    totals.cheque + totals.banco + totals.efectivo
                  ),
                  fontSize: 8,
                  border: [false, false, false, false],
                  alignment: "right",
                },
              ],
            ],
          },
          width: "100%", //la tabla ocupa todo el ancho de la pagina
        },
      ],
      footer: footer,
      pageSize: "A4",
      pageMargins: [40, 60, 40, 60],
    }

    pdfMake.createPdf(docDefinition).download(result.payroll_code + ".pdf")
  } else {
    ElMessage({
      showClose: true,
      message: "No se pudo descargar archivo planilla gratificantes PDF!",
      type: "error",
    })
  }
}

async function exportExcelV2Gratification(): Promise<void> {
  try {
    // Crear un objeto Blob con el contenido de las tareas
    const { success, result }: PDFGratificationResponse =
      await PayrollsModule.getPayrollExportGratificationPDFData()
    if (success) {
      // Define los datos para rellenar la tabla
      const data: groupDataByZoneAndProjectResponse[] = result.data
      const payroll_code = result.payroll_code
      const finalTotals: {
        banco: number
        cheque: number
        efectivo: number
      } = result.totals
      const fileName = `gratificantes_${payroll_code}_${moment()
        .utc()
        .unix()
        .toString()}.xlsx`
      // Crear una nueva instancia de ExcelJS
      const workbook = new ExcelJS.Workbook()

      // Agregar una hoja de cálculo al libro
      const worksheet = workbook.addWorksheet(payroll_code)

      // Obtener los encabezados de las columnas
      const headers = ["Código", "Nombre", "Depósito", "Efectivo", "Cheque"]

      // Agregar los encabezados personalizados a la hoja de cálculo
      worksheet.addRow(headers)
      let excelContent: {
        Código: {
          value: string | number
          colspan?: number
          alignment?: { horizontal: string }
          format?: string
        }
        Nombre: {
          value: string | number
          colspan?: number
          alignment?: { horizontal: string }
          format?: string
        }
        Depósito: {
          value: string | number
          colspan?: number
          alignment?: { horizontal: string }
          format?: string
        }
        Efectivo: {
          value: string | number
          colspan?: number
          alignment?: { horizontal: string }
          format?: string
        }
        Cheque: {
          value: string | number
          colspan?: number
          alignment?: { horizontal: string }
          format?: string
        }
      }[] = []

      /** setear columnas */
      data.forEach(item => {
        const { zone, projects } = item
        /* write Zone */
        excelContent.push({
          Código: { value: zone[0], colspan: 5 },
          Nombre: { value: "" },
          Depósito: { value: "" },
          Efectivo: { value: "" },
          Cheque: { value: "" },
        })

        /** Proyect - gratification */
        projects.forEach(projectItem => {
          const { gratifications, project } = projectItem

          /** Gratifications */
          /** Proyect - gratification */
          gratifications.forEach(gratificationItem => {
            const { totals, users, gratification_name } = gratificationItem
            excelContent.push({
              Código: { value: `TIPO: ${gratification_name}`, colspan: 2 },
              Nombre: { value: "" },
              Depósito: { value: "" },
              Efectivo: { value: "" },
              Cheque: { value: "" },
            })

            /** User - gratification */
            users.forEach(userItem => {
              const { full_name, banco, cheque, efectivo } = userItem
              excelContent.push({
                Código: { value: "" },
                Nombre: { value: full_name },
                Depósito: {
                  value: banco,
                  alignment: { horizontal: "right" },
                  format: "currency",
                },
                Efectivo: {
                  value: efectivo,
                  alignment: { horizontal: "right" },
                  format: "currency",
                },
                Cheque: {
                  value: cheque,
                  alignment: { horizontal: "right" },
                  format: "currency",
                },
              })
            })
            /** Totales proyecto */
            excelContent.push({
              Código: { value: "" },
              Nombre: { value: `Proyecto: ${project[0]}` },
              Depósito: {
                value: totals.banco,
                alignment: { horizontal: "right" },
                format: "currency",
              },
              Efectivo: {
                value: totals.efectivo,
                alignment: { horizontal: "right" },
                format: "currency",
              },
              Cheque: {
                value: totals.cheque,
                alignment: { horizontal: "right" },
                format: "currency",
              },
            })
          })
        })
      })
      /** separador */
      excelContent.push({
        Código: { value: "", colspan: 5 },
        Nombre: { value: "" },
        Depósito: { value: "" },
        Efectivo: { value: "" },
        Cheque: { value: "" },
      })
      /** Subtotales */
      excelContent.push({
        Código: { value: `Sub totales`, colspan: 2 },
        Nombre: { value: "" },
        Depósito: {
          value: finalTotals.banco,
          alignment: { horizontal: "right" },
          format: "currency",
        },
        Efectivo: {
          value: finalTotals.efectivo,
          alignment: { horizontal: "right" },
          format: "currency",
        },
        Cheque: {
          value: finalTotals.cheque,
          alignment: { horizontal: "right" },
          format: "currency",
        },
      })
      /** Totales */
      excelContent.push({
        Código: { value: `Total`, colspan: 2 },
        Nombre: { value: "" },
        Depósito: { value: "" },
        Efectivo: { value: "" },
        Cheque: {
          value: finalTotals.cheque + finalTotals.efectivo + finalTotals.banco,
          alignment: { horizontal: "right" },
          format: "currency",
        },
      })
      // Agregar los datos a la hoja de cálculo
      excelContent.forEach(row => {
        const rowData = Object.values(row)
        const rowValues = rowData.map(value =>
          typeof value === "object" ? value.value : value
        )
        worksheet.addRow(rowValues)
      })

      // Aplicar estilos y fusionar celdas según los datos
      excelContent.forEach((row, rowIndex) => {
        Object.entries(row).forEach(([column, cellData]) => {
          if (typeof cellData === "object" && cellData.colspan) {
            const colspan = cellData.colspan
            const startCell = XLSX.utils.encode_cell({
              r: rowIndex + 1,
              c: headers.indexOf(column),
            })
            const endCell = XLSX.utils.encode_cell({
              r: rowIndex + 1,
              c: headers.indexOf(column) + colspan - 1,
            })
            console.log(startCell, endCell)
            worksheet.mergeCells(`${startCell}:${endCell}`)
          }
          const cell = worksheet.getCell(
            rowIndex + 2,
            headers.indexOf(column) + 1
          )
          if (typeof cellData === "object" && cellData.alignment) {
            const alignment: any = cellData.alignment
            cell.alignment = alignment
          }
          if (typeof cellData === "object" && cellData.format === "currency") {
            const value = cellData.value
            const currencyFormat = "$#,##0.00" // Formato de moneda personalizado, ajusta según tus necesidades
            cell.value = value
            cell.numFmt = currencyFormat
          }
        })
      })

      // Ajustar el ancho de las columnas según el contenido más ancho
      headers.forEach((header, columnIndex) => {
        const column = worksheet.getColumn(columnIndex + 1)
        const columnValues = excelContent.map(
          (row: any) => row[header]?.value ?? ""
        )
        const maxLength = columnValues.reduce(
          (max, value) => Math.max(max, String(value).length),
          header.length
        )
        const columnWidth = Math.min(20, maxLength) // Ajusta el valor máximo del ancho de columna según tus necesidades
        column.width = columnWidth
      })
      // Generar el archivo Excel
      const buffer = await workbook.xlsx.writeBuffer()

      // Crear un objeto Blob con el contenido del archivo Excel
      const blob = new Blob([buffer], {
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
        message: "No se pudo descargar Planilla gratificante en formato Excel!",
        type: "error",
      })
    }
  } catch (error: any) {
    console.log(error)
    ElMessage({
      showClose: true,
      message: "Error" + error.message,
      type: "error",
    })
  }
}

function footer(currentPage: any, pageCount: any): any {
  return {
    columns: [
      { text: `${currentPage}/${pageCount}`, alignment: "left" },
      { text: `${AuthModule.user?.username}`, alignment: "center" },
      { text: date, alignment: "right" },
    ],
    margin: [10, 0, 10, 0],
  }
}

function formatMoney(num: number): string {
  const opciones = {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
    currency: "USD",
  }
  return "$" + num.toLocaleString("en-US", opciones)
}

function getCustomOptions() {
  return {
    icon: "fas fa-cog mx-1",
    options: [
      {
        name: "Nueva planilla",
        icon: "fas fa-clipboard-list mx-1",
        hidden: !!PayrollsModule.CurrentPayroll,
        handler: () =>
          emits("changeModal", {
            modal: "formCreatePayrollModal",
            payload: { show: true },
          }),
        guard: [
          GuardRoles.ADMIN,
          GuardRoles.ASSISTANT_RRHH,
          GuardRoles.MANAGER_RRHH,
        ],
      },
      {
        name: "Cerrar planilla",
        icon: "fa fa-close mx-1",
        hidden: !PayrollsModule.CurrentPayroll,
        handler: () =>
          emits("changeModal", {
            modal: "formClosePayrollModal",
            payload: { show: true },
          }),
        guard: [
          GuardRoles.ADMIN,
          GuardRoles.ASSISTANT_RRHH,
          GuardRoles.MANAGER_RRHH,
        ],
      },
      {
        name: "Banco CUSCATLAN",
        icon: "fas fa-file-alt",
        handler: () => exportTXT(),
      },
      {
        name: "Banco Agrícola",
        icon: "fas fa-file-csv",
        handler: exportCSV,
        guard: [GuardRoles.ADMIN, GuardRoles.ASSISTANT_RRHH],
      },
      {
        name: "Planilla base",
        icon: "fas fa-file-pdf",
        handler: exportPDFBase,
        guard: [GuardRoles.ADMIN, GuardRoles.ASSISTANT_RRHH],
      },
      {
        name: "Planilla gratificantes PDF",
        icon: "fas fa-file-pdf",
        handler: exportPDFGratification,
        guard: [GuardRoles.ADMIN, GuardRoles.ASSISTANT_RRHH],
      },
      {
        name: "Planilla gratificantes Excel",
        icon: "fas fa-file-excel",
        handler: exportExcelV2Gratification,
        guard: [GuardRoles.ADMIN, GuardRoles.ASSISTANT_RRHH],
      },
      {
        name: "Planilla descuentos ",
        icon: "fas fa-file-excel",
        handler: exportExcelDiscount,
      },
    ],
  }
}

const formatDate = (dateStr: string) =>
  new Date(dateStr)
    .toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
    .replace(/\//g, "-")

async function exportExcelDiscount(): Promise<void> {
  try {
    // Crear un objeto Blob con el contenido de las tareas
    const { success, result }: any =
      await PayrollsModule.getPayrollDiscountUserExcell()
    if (success) {
      // Define los datos para rellenar la tabla
      const data: any[] = result
      const fileName = `descuentos_${moment().utc().unix().toString()}.xlsx`
      // Crear una nueva instancia de ExcelJS
      const workbook = new ExcelJS.Workbook()

      // Agregar una hoja de cálculo al libro
      const worksheet = workbook.addWorksheet("descuentos")

      // Obtener los encabezados de las columnas
      const headers = [
        "Usuario",
        "Carnet",
        "Valor de Descuento",
        "Tipo de Descuento",
        "Descripcion de Descuento",
        "Fecha de Descuento",
      ]

      // Agregar los encabezados personalizados a la hoja de cálculo
      worksheet.addRow(headers)
      let excelContent: any[] = []

      /** setear columnas */
      data.forEach(item => {
        const {
          discount_date,
          discount_description,
          discount_type,
          discount_value,
          user_carnet,
          user_name,
        } = item

        excelContent.push({
          Usuario: { value: user_name },
          Carnet: { value: user_carnet },
          Valor_de_Descuento: { value: discount_value },
          Tipo_de_Descuento: { value: discount_type },
          Descripcion_de_Descuento: { value: discount_description },
          Fecha_de_Descuento: { value: formatDate(discount_date) },
        })
      })

      // Agregar los datos a la hoja de cálculo
      excelContent.forEach(row => {
        const rowData = Object.values(row)
        const rowValues = rowData.map((value: any) =>
          typeof value === "object" ? value.value : value
        )
        worksheet.addRow(rowValues)
      })

      // Ajustar el ancho de las columnas según el contenido más ancho
      headers.forEach((header, columnIndex) => {
        const column = worksheet.getColumn(columnIndex + 1)
        const columnValues = excelContent.map(
          (row: any) => row[header]?.value ?? ""
        )
        const maxLength = columnValues.reduce(
          (max, value) => Math.max(max, String(value).length),
          header.length
        )
        const columnWidth = Math.min(20, maxLength) // Ajusta el valor máximo del ancho de columna según tus necesidades
        column.width = columnWidth
      })
      // Generar el archivo Excel
      const buffer = await workbook.xlsx.writeBuffer()

      // Crear un objeto Blob con el contenido del archivo Excel
      const blob = new Blob([buffer], {
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
        message: "No se pudo descargar Planilla gratificante en formato Excel!",
        type: "error",
      })
    }
  } catch (error: any) {
    console.log(error)
    ElMessage({
      showClose: true,
      message: "Error" + error.message,
      type: "error",
    })
  }
}

function getAgentFields(type: string): { [k: string]: Field } {
  return {
    selects: {
      label: title(type),
      type: "options",
      placeholder: "Seleccione una opcion",
      name: selectType(type),
      url: getURLByType(type),
      options: {
        label: "label",
        key: "value",
      },
      validate: {
        required: "Este campo es obligatorio",
      },
    },
    value: {
      label: "Valor",
      type: "text",
      placeholder: "Digite el valor del ajuste",
      name: "value",
      validate: {
        required: "Este campo es obligatorio",
      },
    },
  }
}

function getURLByType(type: string) {
  return type === "DISCOUNTS"
    ? "payrolls/discounts/modals/types?is_scheduled=false"
    : type === "GRATIFICATIONS"
    ? "payrolls/gratifications/modals/types?is_scheduled=false"
    : "Agregar"
}

function title(type: string) {
  return type === "DISCOUNTS"
    ? "Agregar descuento"
    : type === "GRATIFICATIONS"
    ? "Agregar gratificacion"
    : "Agregar"
}

function selectType(type: string) {
  return type === "DISCOUNTS"
    ? "discount"
    : type === "GRATIFICATIONS"
    ? "gratification"
    : "Items"
}

async function onDiscount(payload: any) {
  try {
    modalPayrollConfig.value = payload.payrollConfig
    modalUser.value = payload.agent
    modalTitle.value = title("DISCOUNTS")
    state.formPayrollDiscountModal.show = true
  } catch (error) {
    console.error(error)
  }
}

async function onGratification(payload: any) {
  try {
    modalPayrollConfig.value = payload.payrollConfig
    modalUser.value = payload.agent
    modalTitle.value = title("GRATIFICATIONS")
    state.formPayrollGratificationModal.show = true
  } catch (error) {
    console.error(error)
  }
}

onBeforeMount(async () => {
  await PayrollsModule.payrollActive()
  customOpstions.value = getCustomOptions()
})

watch(
  () => PayrollsModule.CurrentPayroll,
  () => {
    customOpstions.value = getCustomOptions()
    payrollFrom.value = PayrollsModule.CurrentPayrollFrom
    payrollUntil.value = PayrollsModule.CurrentPayrollUntil
  }
)
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="mt-4 row">
      <div class="col-12">
        <div class="card">
          <div
            class="card-header d-flex justify-content-between align-items-center"
          >
            <div>
              <h5 class="mb-0">Planilla</h5>
              <p class="mb-0 text-sm">
                Desde: {{ payrollFrom }} Hasta: {{ payrollUntil }}
              </p>
              <p class="mb-0 text-sm">
                A continuación se listan todos los registros de agentes con
                cantidad de horas trabajadas.
              </p>
            </div>

            <div>
              <div>
                <dinamic-options :customOpstions="customOpstions" />
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <BaseTable
              :reload="state.table.reload"
              :hide-default-options="true"
              :options="[
                {
                  name: 'Aplicar descuento ',
                  icon: 'fas fa-minus-circle mx-1',
                  function: onDiscount,
                },
                {
                  name: 'Aplicar gratificante',
                  icon: 'fas fa-plus-circle mx-1',
                  function: onGratification,
                },
              ]"
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
                  minWidth: 110,
                  headerAlign: 'right',
                },
                {
                  label: 'ISSS',
                  prop: 'isss',
                  minWidth: 100,
                  headerAlign: 'right',
                },
                {
                  label: 'AFP',
                  prop: 'afp',
                  minWidth: 100,
                  headerAlign: 'right',
                },
                {
                  label: 'IMP. Renta',
                  prop: 'imp_rent',
                  minWidth: 110,
                  headerAlign: 'right',
                },
                {
                  label: 'Horas',
                  prop: 'totalHoursWorked',
                  minWidth: 90,
                  headerAlign: 'right',
                },
                {
                  label: 'Días',
                  prop: 'totalDaysWorked',
                  minWidth: 80,
                  headerAlign: 'right',
                },
                {
                  label: 'Descuentos',
                  prop: 'totalDiscounts',
                  minWidth: 150,
                  headerAlign: 'right',
                },
                {
                  label: 'Gratificaciones',
                  prop: 'totalGratifications',
                  minWidth: 150,
                  headerAlign: 'left',
                },
                {
                  label: 'Total',
                  prop: 'total',
                  minWidth: 150,
                  headerAlign: 'right',
                },
              ]"
              endpoint="/payrolls/table/"
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
              <template #carnet="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ scope.row.carnet }}
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
              <template #isss="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{
                    scope.row.isss.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  }}
                </div>
              </template>
              <template #afp="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{
                    scope.row.afp.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  }}
                </div>
              </template>
              <template #imp_rent="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{
                    scope.row.imp_rent.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  }}
                </div>
              </template>
              <template #total="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{
                    scope.row.total.toLocaleString("en-US", {
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
  <PayrollModal
    :title="modalTitle"
    :show="state.formPayrollGratificationModal.show"
    :modalName="'formPayrollGratificationModal'"
    :fields="getAgentFields('GRATIFICATIONS')"
    :type="'GRATIFICATIONS'"
    :userSelected="modalUser"
    :payrollConfig="modalPayrollConfig"
    @close="state.formPayrollGratificationModal.show = false"
    @change-modal="p => changeModal(p, 'formPayrollGratificationModal')"
  />
  <PayrollModal
    :title="modalTitle"
    :show="state.formPayrollDiscountModal.show"
    :modalName="'formPayrollDiscountModal'"
    :fields="getAgentFields('DISCOUNTS')"
    :type="'DISCOUNTS'"
    :userSelected="modalUser"
    :payrollConfig="modalPayrollConfig"
    @close="state.formPayrollDiscountModal.show = false"
    @change-modal="p => changeModal(p, 'formPayrollDiscountModal')"
  />
</template>
<style>
.fecha-label {
  font-weight: bold;
  margin-bottom: 5px;
}

.fecha-valor {
  font-size: 18px;
  color: #333;
}
</style>
