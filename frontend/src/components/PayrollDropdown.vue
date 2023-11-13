/* eslint-disable prettier/prettier */
<script lang="ts">
import { PayrollsModule } from "@/store/modules/Payroll"
import { ElMessage } from "element-plus"
import * as pdfMakeLib from "pdfmake/build/pdfmake"
import * as pdfFonts from "pdfmake/build/vfs_fonts"
import { AuthModule } from "@/store/modules/Auth"
import moment from "moment"

const pdfMake = {
  ...pdfMakeLib,
  vfs: pdfFonts.pdfMake.vfs,
}

const date = moment().format("DD/MM/YYYY hh:mm A")

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
  total_value: number
  users: { carnet: string; full_name: string; value: number }[]
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
  }
}

export default {
  data() {
    return {
      opciones: [
        {
          key: "TXT",
          label: "Banco CUSCATLAN",
        },
        {
          key: "CSV",
          label: "Banco Agrícola",
        },
        {
          key: "Planilla base",
          label: "Planilla base",
        },
        {
          key: "Planilla gratificantes",
          label: "Planilla gratificantes",
        },
      ],
      opcionSeleccionada: "",
    }
  },
  methods: {
    async exportFile(): Promise<any> {
      switch (this.opcionSeleccionada) {
        case "TXT":
          await this.exportTXT()
          break
        case "CSV":
          await this.exportCSV()
          break
        case "Planilla base":
          await this.exportPDFBase()
          break
        case "Planilla gratificantes":
          this.exportPDFGratification()
          break
        default:
          ElMessage({
            showClose: true,
            message: "Seleccione una opción para exportar!",
            type: "warning",
          })
          break
      }
      // Aquí puedes realizar cualquier acción que desees con la opción seleccionada
    },
    formatNumber(num: number, count: number, withDecimals: boolean = false) {
      // Obtiene la parte entera del número y la completa con ceros a la izquierda
      let integerPart = Math.floor(num).toString()
      integerPart =
        integerPart.length < count
          ? integerPart.padStart(count, "0")
          : integerPart
      let decimalPart = ""
      if (withDecimals) {
        // Obtiene los decimales del número y los completa con ceros a la derecha
        decimalPart = (num % 1).toFixed(2).slice(2).padEnd(2, "0")
      }
      // Concatena la parte entera y los decimales y devuelve el resultado
      return integerPart + decimalPart
    },

    async exportTXT() {
      // Crear un objeto Blob con el contenido de las tareas
      const { success, result }: TxtResponse =
        await PayrollsModule.getPayrollExportTXTData()
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
              this.formatNumber(item.month, 2),
              this.formatNumber(item.day, 2),
              this.formatNumber(item.salary, 7, true).replace(".", ""),
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
    },

    async exportCSV() {
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
            item.full_name,
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
    },

    async exportPDFBase(): Promise<void> {
      // Crear un objeto Blob con el contenido de las tareas
      const { success, result }: PDFBaseResponse =
        await PayrollsModule.getPayrollExportBasePDFData()
      if (success) {
        // Define los datos para rellenar la tabla
        const data: DataTable[] = result.data
        const totals = {
          salary: 0,
          gratifications: 0,
          discounts: 0,
          imp_rent: 0,
          iss: 0,
          afp: 0,
          total_pay: 0,
        }
        data.map(item => {
          totals.salary += Number(item.salary)
          totals.gratifications += Number(item.gratifications)
          totals.discounts += Number(item.discounts)
          totals.imp_rent += Number(item.imp_rent)
          totals.iss += Number(item.iss)
          totals.afp += Number(item.afp)
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
                fillColor: function (
                  rowIndex: any,
                  node: any,
                  columnIndex: any
                ) {
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
                      text: "Días Laborados",
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
                      text: "ISSS",
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
                      text: this.formatMoney(Number(row.salary)),
                      fontSize: 8,
                      alignment: "right",
                    },
                    {
                      text: this.formatMoney(Number(row.gratifications)),
                      fontSize: 8,
                      alignment: "right",
                    },
                    {
                      text: this.formatMoney(Number(row.discounts)),
                      fontSize: 8,
                      alignment: "right",
                    },
                    { text: row.working_days, fontSize: 8, alignment: "right" },
                    {
                      text: this.formatMoney(Number(row.imp_rent)),
                      fontSize: 8,
                      alignment: "right",
                    },
                    {
                      text: this.formatMoney(Number(row.iss)),
                      fontSize: 8,
                      alignment: "right",
                    },
                    {
                      text: this.formatMoney(Number(row.afp)),
                      fontSize: 8,
                      alignment: "right",
                    },
                    {
                      text: this.formatMoney(Number(row.total_pay)),
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
                      text: this.formatMoney(totals.salary),
                      fontSize: 9,
                      bold: true,
                      alignment: "right",
                    },
                    {
                      text: this.formatMoney(totals.gratifications),
                      fontSize: 9,
                      bold: true,
                      alignment: "right",
                    },
                    {
                      text: this.formatMoney(totals.discounts),
                      fontSize: 9,
                      bold: true,
                      alignment: "right",
                    },
                    {},
                    {
                      text: this.formatMoney(totals.imp_rent),
                      fontSize: 9,
                      bold: true,
                      alignment: "right",
                    },
                    {
                      text: this.formatMoney(totals.iss),
                      fontSize: 9,
                      bold: true,
                      alignment: "right",
                    },
                    {
                      text: this.formatMoney(totals.afp),
                      fontSize: 9,
                      bold: true,
                      alignment: "right",
                    },
                    {
                      text: this.formatMoney(totals.total_pay),
                      fontSize: 9,
                      bold: true,
                      alignment: "right",
                    },
                  ],
                ],
              },
            },
          ],
          footer: this.footer,
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
    },

    async exportPDFGratification(): Promise<void> {
      // Crear un objeto Blob con el contenido de las tareas
      const { success, result }: PDFGratificationResponse =
        await PayrollsModule.getPayrollExportGratificationPDFData()
      if (success) {
        // Define los datos para rellenar la tabla
        const data: groupDataByZoneAndProjectResponse[] = result.data

        const docDefinition: any = {
          pageOrientation: "portrait",
          content: [
            {
              table: {
                headerRows: 1,
                //widths: ["auto", "auto", "auto", "auto", "auto"],
                body: [
                  ["Código", "Nombre", "Depósito", "Efectivo", "Cheque"],
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
                            },
                            {},
                            {},
                            {},
                            {},
                          ])
                          gratification.users.map(user => {
                            /**itero los usuarios */
                            content.push([
                              { text: user.carnet, fontSize: 8 },
                              { text: user.full_name, fontSize: 8 },
                              { text: user.value, fontSize: 8 },
                              {},
                              {},
                            ])
                          })
                          /** agrego el nombre del proyecto y totales */
                          content.push([
                            {},
                            {
                              text: `Proyecto: ${project.project}`,
                              fontSize: 9,
                              bold: true,
                              border: [false, true, true, true], //Quita la línea izquierda, y deja las demás
                            },
                            {
                              text: gratification.total_value,
                              fontSize: 9,
                              bold: true,
                            },
                            {},
                            {},
                          ])
                        })
                      })
                      return content
                    })
                    .flat(),
                ],
              },
              width: "100%", //la tabla ocupa todo el ancho de la pagina
            },
          ],
          //footer: this.footer,
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
    },

    footer(currentPage: any, pageCount: any): any {
      return {
        columns: [
          { text: `${currentPage}/${pageCount}`, alignment: "left" },
          { text: `${AuthModule.user?.username}`, alignment: "center" },
          { text: date, alignment: "right" },
        ],
        margin: [10, 0, 10, 0],
      }
    },

    formatMoney(num: number): string {
      const opciones = {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
        currency: "USD",
      }
      return "$" + num.toLocaleString("en-US", opciones)
    },
  },
}
</script>
<template>
  <div class="wrapper">
    <select v-model="opcionSeleccionada">
      <option value="" disabled selected>Seleccione</option>
      <option v-for="opcion in opciones" :value="opcion.key" :key="opcion.key">
        {{ opcion.label }}
      </option>
    </select>
    <button class="btn btn-success btn-sm" @click="exportFile">
      <i class="fas fa-file-download"></i>
    </button>
  </div>
</template>

<style>
.wrapper {
  display: flex;
  justify-content: space-between;
}

select {
  height: 29px;
  border-radius: 4px;
  border: none;
  appearance: none;
  background-color: #f5f5f5;
  padding: 5px;
  font-size: 14px;
  color: #333;
}
</style>
