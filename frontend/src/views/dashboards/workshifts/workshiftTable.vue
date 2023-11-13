<script setup lang="ts">
import BaseTable from "@/components/tables/Base.vue"
import { Modals, Field, ModalState } from "@/types/components"
import DinamicOptions from "@/components/DinamicOptions.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { TablesModule } from "@/store/table/Table"
import moment from "moment"
import { number, string } from "yup"
import { onBeforeMount, ref, watch } from "vue"
import { PayrollsModule } from "@/store/modules/Payroll"
import * as ExcelJS from "exceljs"
import { GuardGroupsRoles, GuardRoles } from "@/types/router"
import { AuthModule } from "@/store/modules/Auth"

// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void
}>()
const options = ref<{ key: string; value: string; label: string }[]>([])

const obtenerMatrizTraspuesta = (matriz: any[]) =>
  matriz[0].map((_: any, i: any) => matriz.map(fila => fila[i]))

function generateArray(letters: string[], n: number) {
  const numLetters = letters.length
  return Array.from({ length: n }, (_, i) => letters[i % numLetters])
}

function getAgentGridData(
  turns: string[],
  turn_letters: string[],
  data: string[][],
  is_only_night: boolean,
  schedule_turns: string[]
) {
  const X = is_only_night ? 0.5 : schedule_turns.length === 1 ? 9 / 24 : 0
  const resultado = []
  const md: boolean = turn_letters.includes("MD")
  for (const segmento of data) {
    const filteredSegment = segmento.filter(s => s.length === 1 || s === "MD")
    const fragmentos = Array.from(
      { length: Math.ceil(filteredSegment.length / 14) },
      (_, i) => filteredSegment.slice(i * 14, i * 14 + 14)
    )
    const segmentoResult: any = {}
    let dayExtra = 29
    const fragmentosFormat =
      fragmentos.length === 5
        ? [
            fragmentos[0],
            fragmentos[1],
            fragmentos[2],
            fragmentos[3],
            ...Array.from(
              { length: Math.ceil(fragmentos[4].length / 2) },
              (_, i) => fragmentos[4].slice(i * 2, i * 2 + 2)
            ),
          ]
        : fragmentos
    turns.map(turn => {
      fragmentosFormat.map((semana, i) => {
        let segmentoIndex = `${i + 1}`
        const semanaIndex =
          i >= 4 ? (dayExtra + i - 4).toString() : segmentoIndex
        const plus = md ? semana.filter(dia => dia === "MD").length * X : 0
        let valor = semana.filter(dia => dia === turn).length
        valor = valor === 0 ? 0 : valor + plus
        if (!segmentoResult[semanaIndex]) {
          segmentoResult[semanaIndex] = {}
        }

        if (!segmentoResult[semanaIndex][turn]) {
          segmentoResult[semanaIndex][turn] = 0
        }

        segmentoResult[semanaIndex][turn] = valor
      })
    })

    resultado.push(segmentoResult)
  }
  return resultado
}

async function exportAgencyExcel(operation: boolean = false): Promise<void> {
  const is_operation = operation === true ? operation : false
  try {
    const id = TablesModule.AgencyId
    console.log("ID: " + id)
    // Crear un objeto Blob con el contenido de las tareas
    const { success, result }: any =
      await PayrollsModule.getAgencyExportExcelData(id)
    if (success && result.data && result.data.agents.length > 0) {
      // Define los datos para rellenar la tabla
      const data: any[] = result.data.agents
      const { HXD, HXN, base_salary, turn_letters, extras_44, extras_turn } =
        result.data
      const count = data[0]?.workdayInfo.days.length
      const turns = ["D", "N"]
      turn_letters.sort((a: string, b: string) => a[0].localeCompare(b[0]))
      const schedule_turns = Object.keys(data[0]?.workdayInfo.schedule)
      const agency_name = data[0]?.agency_name
      const is_only_night =
        schedule_turns.length === 1 && schedule_turns.includes("N")
      // Recorrer el objeto turnos y calcular la diferencia de horas
      const diffHours = turns.map(turn => {
        const value = data[0]?.workdayInfo.schedule[turn]
        let result = 0
        if (value) {
          const { checkIn, checkOut } = value

          const diferencia =
            checkOut < checkIn ? checkOut + 2400 - checkIn : checkOut - checkIn
          result = diferencia / 100
        }
        return result
      })
      // días del mes
      const extras = [
        "TOTAL DE TURNOS",
        "TOTAL DE HORAS AL MES",
        "HR EXTRA MENSUALES",
      ]
      const extrasSingle = []
      if (!is_operation) {
        extras.push("HR EXTRA MENSUALES $")
        extrasSingle.push(...["NOCTURNIDAD", "SALARIO BASE", "SALARIO TOTAL"])
      }
      const days = [
        ...Array.from({ length: count }, (_, index) => index + 1),
        ...extras,
      ]
      const turnRow = generateArray(turns, days.length * 2)

      const fileName = `agencia_${agency_name}_${moment()
        .utc()
        .unix()
        .toString()}.xlsx`
      // Crear una nueva instancia de ExcelJS
      const workbook = new ExcelJS.Workbook()

      // Agregar una hoja de cálculo al libro
      const worksheet = workbook.addWorksheet(
        "Cobertura de posicion con agentes"
      )

      const matrix = data.map(agent => agent.workdayInfo.days.flat())
      // Agregar los encabezados personalizados a la hoja de cálculo
      let excelContent: any[] = []

      /** setear valores */
      matrix.forEach((items, index) => {
        /* write days table */
        excelContent.push([`Agent ${index + 1}`, ...items])
      })

      //guardo los datos
      // Iterar sobre los valores y combinar celdas horizontalmente
      let columna = 1
      let fila = 1
      const alignment: any = { horizontal: "center" }
      let contador = 0
      let changeBG = true
      const yellow: any = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      }
      const defaultColor = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFFFF" },
      }
      const freeFormat: any = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE2EFDA" },
      }
      const dayFormat: any = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF002060" },
      }

      for (const valor of ["DIAS DEL MES", ...days]) {
        if (columna > 1) worksheet.mergeCells(fila, columna, fila, columna + 1)
        const celda = worksheet.getCell(fila, columna)
        celda.value = valor
        celda.alignment = alignment
        columna += columna > 1 ? 2 : 1
        changeBG = contador != 0 && contador % 7 === 0 ? !changeBG : changeBG
        celda.fill = changeBG ? yellow : defaultColor
        if (valor !== "DIAS DEL MES") contador++
      }

      for (const valor of extrasSingle) {
        const celda = worksheet.getCell(fila, columna)
        celda.value = valor
        celda.alignment = alignment
        columna += 1
      }

      fila++
      columna = 1
      const subTitle = [
        "",
        ...turnRow,
        ...generateArray([""], extrasSingle.length),
      ]
      for (const value of subTitle) {
        const celda = worksheet.getCell(fila, columna)
        celda.value = value
        celda.alignment = alignment
        columna += 1
      }

      let celdasHsExtraTurns: any[] = []

      /** guardo patron */
      excelContent.forEach(dato => {
        let hsExtraCalculadas = false
        let hsExtraCalculadasUSD = false
        fila++
        let col = 0
        dato.forEach((value: string) => {
          const celda = worksheet.getCell(fila, col + 1)
          celda.value = value
          celda.alignment = alignment
          celda.fill = value === "L" ? freeFormat : dayFormat
          celda.font =
            value === "L"
              ? { color: { argb: "FF002060" } }
              : { color: { argb: "FFFFFFFF" } }
          col++
        })
        const celdasTotales: any = []

        turns.forEach((turn: string, key: number) => {
          /** total turno */
          const X = is_only_night
            ? 0.5
            : schedule_turns.length === 1
            ? 9 / 24
            : 0
          const plus = schedule_turns.includes(turn)
            ? dato.filter((d: string) => d === "MD").length * X
            : 0
          const count = dato.filter((d: string) => d === turn).length + plus
          const celda = worksheet.getCell(fila, col + 1 + key)
          celda.value = count
          celda.alignment = alignment
          /** fin total turno */

          /** total hs turno al mes */
          const colHsTurnMes = col + turns.length
          const celdaHsMes: any = worksheet.getCell(
            fila,
            colHsTurnMes + 1 + key
          )
          celdaHsMes.value = {
            formula: `${celda.address} * ${diffHours[key]}`,
          }
          celdaHsMes.alignment = alignment
          /** total hs turno al mes */

          /** total hs extras turno al mes */
          const colHsExtrasTurnMes = colHsTurnMes + turns.length
          /*es por turnos */
          const extraTemp: any[] = []
          if (!hsExtraCalculadas) {
            /** agrupo las celdas de cada turno mensuales */
            let celdasHsMes: any[] = []
            for (let t = 0; t < turns.length; t++) {
              celdasHsMes.push(
                worksheet.getCell(fila, colHsTurnMes + 1 + key + t)
              )
            }

            for (let t = 0; t < turns.length; t++) {
              const celdaHsExtraMes: any = worksheet.getCell(
                fila,
                colHsExtrasTurnMes + 1 + key + t
              )

              celdaHsExtraMes.alignment = alignment
              extraTemp.push(celdaHsExtraMes)
            }

            hsExtraCalculadas = !hsExtraCalculadas
            celdasHsExtraTurns.push(extraTemp)
          }
          /** total hs extras turno al mes */
          console.log("is_operation: ", is_operation)
          /** total $  hs extras turno al mes */
          if (!hsExtraCalculadasUSD && !is_operation) {
            const colHsExtrasTurnMesUSD = colHsExtrasTurnMes + turns.length
            const celdasTotalesTemp: any = []
            extraTemp.map((celdaHsExtraTurn: any, index: number) => {
              const celdaHsExtraMes: any = worksheet.getCell(
                fila,
                colHsExtrasTurnMesUSD + 1 + key + index
              )
              const HX = index === extraTemp.length - 1 ? HXN : HXD
              celdaHsExtraMes.value = {
                formula: `${celdaHsExtraTurn.address}*${HX}`,
              }
              celdaHsExtraMes.alignment = alignment
              celdaHsExtraMes.numFmt = "$#,##0.00"

              celdasTotalesTemp.push({
                celda: celdaHsExtraMes,
                col: colHsExtrasTurnMesUSD + 1 + key + index,
                fila: fila,
              })
            })
            celdasTotales.push(celdasTotalesTemp)

            hsExtraCalculadasUSD = !hsExtraCalculadasUSD
          }
          /** total $  hs extras turno al mes */
        })
        if (!is_operation) {
          const nocturnality = (base_salary * 0.25) / excelContent.length
          celdasTotales.map((celdas: any, keyAgent: number) => {
            const primeraCelda = celdas[0]
            const finalCelda = celdas[celdas.length - 1]

            /** nocturnidad */
            const celdaNocturnality: any = worksheet.getCell(
              finalCelda.fila,
              finalCelda.col + 1
            )
            celdaNocturnality.value = nocturnality
            celdaNocturnality.alignment = alignment
            celdaNocturnality.numFmt = "$#,##0.00"

            /** salario base */
            const celdaSalarioBase: any = worksheet.getCell(
              finalCelda.fila,
              finalCelda.col + 2
            )
            celdaSalarioBase.value = base_salary
            celdaSalarioBase.alignment = alignment
            celdaSalarioBase.numFmt = "$#,##0.00"

            let formula = {
              formula: `SUM(${primeraCelda.celda.address}:${celdaSalarioBase.address})`,
            }
            /** total */
            const celdaTotal: any = worksheet.getCell(
              finalCelda.fila,
              finalCelda.col + 3
            )
            celdaTotal.value = formula
            celdaTotal.alignment = alignment
            celdaTotal.numFmt = "$#,##0.00"
          })
        }
      })

      const agentVerticalTitles = [
        "TURNO SEMANAL",
        "HORAS SEMANALES",
        "TOTAL HR LABORADAS",
        "HORAS DE LEY",
        "HR EXTRA SEMANAL",
        "HR EXTRA DIURNA",
        "HR EXTRA NOCTURNA",
      ]

      // Iterar sobre los valores y combinar celdas
      columna = 1
      fila += 1 /* siguiente */ + 2 /* separador */ + 2 /* filas de titulos */

      agentVerticalTitles.map((valor, key) => {
        let sumFila = 1
        if (Number(key) < 2) {
          // Combinar dos celdas verticalmente para las primeras dos iteraciones
          worksheet.mergeCells(
            fila,
            columna,
            fila + turns.length - 1,
            columna + 2
          )
          sumFila = turns.length
        } else {
          // Combinar dos celdas horizontalmente para las iteraciones restantes
          worksheet.mergeCells(fila, columna, fila, columna + 2)
        }

        const celda = worksheet.getCell(fila, columna)
        celda.value = valor
        celda.alignment = alignment
        celda.alignment.vertical = "middle"
        fila += sumFila
      })
      /** AGENT GRIDS */
      const agentGrid = getAgentGridData(
        turns,
        turn_letters,
        excelContent,
        is_only_night,
        schedule_turns
      )
      console.log("Grids", agentGrid)
      /** AGENT GRID TITLES */
      // Columna y fila a partir de las cuales se agregan los títulos
      const columnaInicio = 4
      /*
        resto despues de poner los titulos n cantidad de titulo impresos -2 (titulos dobles merge verticamente)
        - 2 filas de separación
      */
      const filaInicio = fila - (agentVerticalTitles.length + 2 + 2)

      // Iterar sobre los títulos y agregarlos al archivo de Excel
      columna = columnaInicio
      fila = filaInicio
      let filaResetGridInicioWeek: number
      const celdasExtraTurn: any[] = []

      /** guardo agent grid */
      agentGrid.forEach((agent, agentIndex: number) => {
        const agentTitle = `${data[agentIndex].full_name}`
        const weeks = Object.keys(agent).map(key =>
          key.length === 1 ? `S${key}` : key
        )
        // Combinar celdas horizontalmente (7 columnas)
        worksheet.mergeCells(fila, columna, fila, columna + 6)

        const celda = worksheet.getCell(fila, columna)
        celda.value = agentTitle
        celda.alignment = alignment

        // Agregar los valores de weeks en las filas siguientes a los títulos
        let columnTitle = columna
        for (const week of ["", ...weeks]) {
          const celda = worksheet.getCell(fila + 1, columnTitle)
          celda.value = week
          celda.alignment = alignment

          columnTitle++
        }

        // Columna y fila de inicio para insertar los valores
        let columnaGridInicio = columna + 1
        /* inicio de fila es lo que vale fila mas 2 de titulos */
        let filaGridInicio = fila + 2
        const filaResetGridInicio = filaGridInicio
        filaResetGridInicioWeek = filaResetGridInicio
        // Obtener los valores del objeto agent como un array
        const valoresAgent: any[] = Object.values(agent)
        // Iterar sobre los valores
        // Iterar sobre las propiedades del objeto valores
        let filaTurn = filaResetGridInicio
        /** imprimo letras turnos */
        turns.map((turn: string) => {
          let celda = worksheet.getCell(filaTurn, columna)
          celda.value = turn
          celda.alignment = alignment
          celda = worksheet.getCell(filaTurn + 2, columna)
          celda.value = turn
          celda.alignment = alignment
          celda = worksheet.getCell(filaTurn + 7, columna)
          celda.value = turn
          celda.alignment = alignment
          filaTurn++
        })

        let weekIndex = 1
        for (const valores of valoresAgent) {
          let turnDiffIndex = 0
          for (const key in valores) {
            const valor = valores[key]

            // Insertar el valor en la celda correspondiente
            let celda: any = worksheet.getCell(
              filaGridInicio,
              columnaGridInicio
            )
            celda.value = valor
            celda.alignment = alignment
            const coordenadas = celda.address

            // agrego la formula n celdas abajo sumar horas semanales
            const celdaFormulaSemanal: any = worksheet.getCell(
              filaGridInicio + turns.length,
              columnaGridInicio
            )
            celdaFormulaSemanal.value = {
              formula: `${coordenadas} * ${diffHours[turnDiffIndex]}`,
            }
            celdaFormulaSemanal.alignment = alignment

            // Avanzar a la siguiente filaGridInicio
            filaGridInicio++
            turnDiffIndex++
          }
          // agrego la suma de horas de turnos
          // agrego la formula n celdas abajo sumar horas semanales
          const filaFormula =
            filaGridInicio + turns.length /** agentGrid.length*/

          const cantidadFilasArriba = 2 // Número de filas por encima de la celda de la fórmula
          const celdaSumSemanal: any = worksheet.getCell(
            filaFormula,
            columnaGridInicio
          )
          const celdaSumSemanalInicio: any = worksheet.getCell(
            filaFormula - cantidadFilasArriba,
            columnaGridInicio
          )
          const celdaSumSemanalFin: any = worksheet.getCell(
            filaFormula - 1,
            columnaGridInicio
          )
          // Construir la fórmula de suma con referencia relativa al rango de celdas
          //const collumnLetter = celdaSumSemanal.address.split("")[0]
          const rangoSuma = `${celdaSumSemanalInicio.address}:${celdaSumSemanalFin.address}` // Rango de celdas para sumar
          let formula = { formula: `SUM(${rangoSuma})` }

          // Aplicar la fórmula a la celda
          celdaSumSemanal.value = formula
          celdaSumSemanal.alignment = alignment

          /** fin sum horas semanles */
          /** horas de ley */
          const celdaHSLey: any = worksheet.getCell(
            filaFormula + 1,
            columnaGridInicio
          )
          /* TODO hay que ver que sea de noche unicamente  */
          let valor = turns.length === 1 && turns[0] === "N" ? 39 : 44
          valor = weekIndex < 5 ? valor : valor === 44 ? 8 : 7

          celdaHSLey.value = valor
          celdaHSLey.alignment = alignment
          /** fin horas de ley */

          /** hs extras semanal */
          const filaHsExtraSemanal = filaFormula + 2
          const celdaHSExtraSemanal: any = worksheet.getCell(
            filaHsExtraSemanal,
            columnaGridInicio
          )

          formula = {
            formula: `IF(${celdaSumSemanal.address} - ${celdaHSLey.address} < 0, 0, ${celdaSumSemanal.address} - ${celdaHSLey.address})`,
          }
          celdaHSExtraSemanal.value = formula
          celdaHSExtraSemanal.alignment = alignment
          /** fin hs extras semanal */

          /** hs extras x turno */
          const celdasExtraTurnTemp: any[] = []
          turns.map((turn, index) => {
            const filaHsExtra = filaHsExtraSemanal + index + 1

            const celdaHSExtraTurn: any = worksheet.getCell(
              filaHsExtra,
              columnaGridInicio
            )
            celdaHSExtraTurn.value = {
              formula: `${celdaHSExtraSemanal.address} / ${turns.length}`,
            }
            celdaHSExtraTurn.alignment = alignment
            celdasExtraTurnTemp.push(celdaHSExtraTurn.address)
          })
          celdasExtraTurn.push(celdasExtraTurnTemp)
          // Volver a la filaGridInicio de inicio y avanzar a la siguiente columnaGridInicio
          filaGridInicio = filaResetGridInicio
          columnaGridInicio++
          weekIndex++
        }

        // Avanzar dos columnas para el siguiente título
        columna += 9
      })
      const traspuesta = obtenerMatrizTraspuesta(celdasExtraTurn)
      /*
      calculo horas extras en total del patron
      */
      for (let h = 0; h < excelContent.length; h++) {
        celdasHsExtraTurns[h].map((celdaExt: any, indexCeldas: number) => {
          if (extras_44) {
            const a = h * 6
            const b = (h + 1) * 6 - 1
            console.log(`x:${h},y:${indexCeldas},a:${a},b:${b}`)
            //console.log("celdaExt", celdaExt)
            const addressA = traspuesta[indexCeldas][a]
            const addressB = traspuesta[indexCeldas][b]
            celdaExt.value = {
              formula: `SUM(${addressA}:${addressB})`,
            }
          } else {
            celdaExt.value = 0
          }
        })
      }

      /** resumen por quincena */
      /*
      el nuevo inicio debe ser
      + 2 de titulos
      + n de titulos verticales que tiene 2 con span doble
      + 2 de separación
      */
      fila += 2 + (agentVerticalTitles.length + 2) + 2
      columna = 1

      /* vericals quincena */
      let verticalQ = fila + 2
      agentVerticalTitles.map((valor, key) => {
        let sumFila = 1
        if (Number(key) < 2) {
          // Combinar dos celdas verticalmente para las primeras dos iteraciones
          worksheet.mergeCells(verticalQ, columna, verticalQ + 1, columna + 2)
          sumFila = 2
        } else {
          // Combinar dos celdas horizontalmente para las iteraciones restantes
          worksheet.mergeCells(verticalQ, columna, verticalQ, columna + 2)
        }

        const celda = worksheet.getCell(verticalQ, columna)
        celda.value = valor
        celda.alignment = alignment
        celda.alignment.vertical = "middle"
        verticalQ += sumFila
      })
      /* fin vericals quincena */
      /** guardo agent grid */
      columna = columnaInicio
      agentGrid.forEach((agent, agentIndex: number) => {
        const agentTitle = `${data[agentIndex].full_name}`
        /*const weeks = Object.keys(agent).map(key =>
          key.length === 1 ? `S${key}` : key
        )*/
        // Combinar celdas horizontalmente (7 columnas)
        worksheet.mergeCells(fila, columna, fila, columna + 2)

        const celda = worksheet.getCell(fila, columna)
        celda.value = agentTitle
        celda.alignment = alignment

        // Agregar los valores de weeks en las filas siguientes a los títulos
        let columnTitle = columna
        const title = ["", "Q1", "Q2"]
        for (const week of title) {
          const celda = worksheet.getCell(fila + 1, columnTitle)
          celda.value = week
          celda.alignment = alignment

          columnTitle++
        }

        // Columna y fila de inicio para insertar los valores
        let columnaGridInicio = columna + 1
        /* inicio de fila es lo que vale fila mas 2 de titulos */
        let filaGridInicio = fila + 2
        const filaResetGridInicio = filaGridInicio

        // Obtener los valores del objeto agent como un array
        const valoresAgent: any[] = Object.values(agent)

        // Iterar sobre los valores
        // Iterar sobre las propiedades del objeto valores
        let filaTurn = filaResetGridInicio
        /** imprimo letras turnos */
        turns.map(turn => {
          let celda = worksheet.getCell(filaTurn, columna)
          celda.value = turn
          celda.alignment = alignment
          celda = worksheet.getCell(filaTurn + 2, columna)
          celda.value = turn
          celda.alignment = alignment
          celda = worksheet.getCell(filaTurn + 7, columna)
          celda.value = turn
          celda.alignment = alignment
          filaTurn++
        })

        const countQ = title.length - 1
        /** itero cantidas de quincenas */
        for (let l = 0; l < countQ; l++) {
          /** itero cantidad de titulos para las formulas (+2 por que hay 2 dobles) */
          for (
            let filaTitle = 0;
            filaTitle < agentVerticalTitles.length + 2;
            filaTitle++
          ) {
            // Q primer turno
            let celdaInicial: any = worksheet.getCell(
              filaResetGridInicioWeek + filaTitle,
              columnaGridInicio + countQ * l
            )
            let celdaFin: any = worksheet.getCell(
              filaResetGridInicioWeek + filaTitle,
              columnaGridInicio + countQ * l + 1
            )
            let coordenadasInicio = celdaInicial.address
            let coordenadasFin = celdaFin.address

            // agrego la formula n celdas abajo sumar horas semanales
            let celdaFormulaquincenal: any = worksheet.getCell(
              filaGridInicio + filaTitle,
              columnaGridInicio + l
            )
            const hsLey = filaTitle === 5 ? 2 : 1
            let formula = {
              formula: `SUM(${coordenadasInicio}:${coordenadasFin}) / ${hsLey}`,
            }

            // Aplicar la fórmula a la celda
            celdaFormulaquincenal.value = formula
            celdaFormulaquincenal.alignment = alignment
            //fin Q primer turno
          }
        }

        // Avanzar dos columnas para el siguiente título
        columna += 9
      })
      /** fin resumen por quincena */

      /* color */
      const fontColor = { color: { argb: "FF002060" } }

      // Recorrer todas las hojas del documento
      workbook.eachSheet(sheet => {
        // Recorrer todas las filas de la hoja
        sheet.eachRow(row => {
          // Recorrer todas las celdas de la fila
          row.eachCell(cell => {
            // Verificar si el color de fuente existente es blanco
            if (
              cell.font &&
              cell.font.color &&
              cell.font.color.argb === "FFFFFFFF"
            ) {
              // Mantener el color de fuente existente (blanco)
              return
            }
            // Aplicar el nuevo color de fuente
            cell.font = fontColor
            // Aplicar la fuente "Arial Narrow"
            cell.font = { name: "Arial Narrow", ...cell.font }
          })
        })
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
      console.log(result)
      ElMessage({
        showClose: true,
        message: "No se pudo descargar cobertura de posición en formato Excel!",
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

function getVerticalValues(
  posiotionsPeerTRRs: string,
  agentsPeerPosition: string,
  budgetDeployment: string,
  budgetServicePriceNoIVA: string,
  basicSalary: string,
  bono: string,
  HxD: string,
  HxN: string,
  nocturnity: string,
  weeklyRest: string,
  opCostsAndServiceFee: string
) {
  return [
    {
      titlesTableCels: "",
      font: {
        bold: true,
        size: 11,
      },
      value: "AS",
    },
    {
      titlesTableCels: "",
      font: {
        bold: true,
        size: 11,
      },
      value: "",
    },
    {
      titlesTableCels: "POSICIONES SOLICITADAS",
      font: {
        bold: true,
        size: 12,
        color: { argb: "ffff0000" },
      },
      value: posiotionsPeerTRRs,
    },
    {
      titlesTableCels: "AGENTES POR POSICIÓN",
      font: {
        bold: true,
        size: 12,
        color: { argb: "ffff0000" },
      },
      value: agentsPeerPosition,
    },
    {
      titlesTableCels: "DESPLIEGUE PROPUESTO",
      font: {
        bold: true,
        size: 12,
        color: { argb: "ffff0000" },
      },
      value: budgetDeployment,
    },
    {
      titlesTableCels: "",
      font: {
        bold: true,
        size: 11,
      },
      value: "",
    },
    {
      titlesTableCels: "Precio del Servicio Propuesto -no incluye IVA-",
      font: {
        bold: true,
        size: 12,
      },
      value: budgetServicePriceNoIVA,
    },
    {
      titlesTableCels: "",
      font: {
        bold: true,
        size: 11,
      },
      value: "",
    },
    {
      titlesTableCels: "Costo del Servicio",
      font: {
        bold: true,
        size: 12,
      },
      value: { formula: "=REDONDEAR.MENOS((B15+B22+B33),0)" },
    },
    {
      titlesTableCels: "",
      font: {
        bold: true,
        size: 11,
      },
      value: "",
    },
    {
      titlesTableCels: "Salario + Bonificación",
      font: {
        bold: true,
        size: 12,
      },
      value: { formula: "=SUMA(B16:B21)" },
    },
    {
      titlesTableCels: "Salario Básico",
      font: {
        bold: true,
        size: 11,
      },
      value: basicSalary,
    },
    {
      titlesTableCels: "Bono",
      font: {
        bold: true,
        size: 11,
      },
      value: bono,
    },
    {
      titlesTableCels: "Hora Extra-Diruna-",
      font: {
        bold: true,
        size: 11,
      },
      value: HxD,
    },
    {
      titlesTableCels: "Hora Extra-Nocturna-",
      font: {
        bold: true,
        size: 11,
      },
      value: HxN,
    },
    {
      titlesTableCels: "Nocturnidad",
      font: {
        bold: true,
        size: 11,
      },
      value: nocturnity,
    },
    {
      titlesTableCels: "",
      font: {
        bold: true,
        size: 11,
      },
      value: "",
    },
    {
      titlesTableCels: "Beneficios Legales",
      font: {
        bold: true,
        size: 12,
      },
      value: { formula: "=SUMA(B23:B30)" },
    },
    {
      titlesTableCels: "AFP´s = 8.75%",
      font: {
        bold: true,
        size: 11,
      },
      value: { formula: "=B$15*$B$2" },
    },
    {
      titlesTableCels: "ISSS = 7.50%",
      font: {
        bold: true,
        size: 11,
      },
      value: { formula: "=B$15*$C$2" },
    },
    {
      titlesTableCels: "Insaforp = 1.00%",
      font: {
        bold: true,
        size: 11,
      },
      value: { formula: "=B$15*$D$2" },
    },
    {
      titlesTableCels: "Vacaciones. Una quincena más el 30% / 12",
      font: {
        bold: true,
        size: 11,
      },
      value: { formula: "=((B$16/2)+((B$16/2)*$F$2))/12" },
    },
    {
      titlesTableCels: "Aguinaldo. 15 días / 12 meses",
      font: {
        bold: true,
        size: 11,
      },
      value: { formula: "=((B$16/30)*$G$2)/12" },
    },
    {
      titlesTableCels: "Indemnización. Mes por año / 12 meses",
      font: {
        bold: true,
        size: 11,
      },
      value: { formula: "=B$15/12" },
    },
    {
      titlesTableCels:
        "Pago dobles de días festivos y asuetos. Enero 1; Jueves, Viernes y Sábado Santos; 1 y 10 de Mayo; 17 de Junio; 3, 4 y 5 de Agosto; 15 de Septiembre; 2 de Noviembre; 25 de Diciembre: 13 días X (Salario + AFP´s + ISSS + Insaforp + Descanso Semanal) / 12 meses",
      font: {
        bold: true,
        size: 11,
      },
      value: { formula: "=I2" },
    },
    {
      titlesTableCels: "Descanso Semanal",
      font: {
        bold: true,
        size: 11,
      },
      value: weeklyRest,
    },
    {
      titlesTableCels: "",
      font: {
        bold: true,
        size: 11,
      },
      value: "",
    },
    {
      titlesTableCels: "",
      font: {
        bold: true,
        size: 12,
      },
      value: "",
    },
    {
      titlesTableCels:
        "Costos y Gastos Operativos y Administrativos + Fee del Servicio",
      font: {
        bold: true,
        size: 12,
      },
      value: { formula: `=${opCostsAndServiceFee}*1,02*1,02` },
    },
    {
      titlesTableCels: "",
      font: {
        bold: true,
        size: 11,
      },
      value: "",
    },
    {
      titlesTableCels:
        "Margen Unitario de Contribución Control Risk adicionalmente al precio preferencial indicado absorberá Costos y Gastos Administrativos conforme a las Categorías indicadas.",
      font: {
        bold: true,
        size: 11,
      },
      value: "",
    },
    {
      titlesTableCels: "Margen Unitario",
      font: {
        bold: true,
        size: 11,
      },
      value: { formula: "=B11-B13" },
    },
    {
      titlesTableCels: "Mensual por Categoría",
      font: {
        bold: true,
        size: 11,
      },
      value: { formula: "=B36*B9" },
    },
    {
      titlesTableCels: "Anual Por Categoria",
      font: {
        bold: true,
        size: 11,
      },
      value: { formula: "=B37*12" },
    },
    {
      titlesTableCels: "Total Anual",
      font: {
        bold: true,
        size: 11,
      },
      value: { formula: "=SUMA(B38:F38)" },
    },
    {
      titlesTableCels: "",
      font: {
        bold: true,
        size: 11,
      },
      value: "",
    },
    {
      titlesTableCels: "RESUMEN OFERTA",
      font: {
        bold: true,
        size: 12,
      },
      value: "",
    },
    {
      titlesTableCels: "Personal Desplegable Fijo",
      font: {
        bold: true,
        size: 11,
      },
      value: { formula: "=B9" },
    },
    {
      titlesTableCels: "Precio Unitario Ofertado -No Incluye IVA-",
      font: {
        bold: true,
        size: 11,
      },
      value: { formula: "=B11" },
    },
    {
      titlesTableCels: "Oferta Económica Mensual",
      font: {
        bold: true,
        size: 11,
      },
      value: { formula: "=B43*B42" },
    },
    {
      titlesTableCels: "Oferta Económica Anual",
      font: {
        bold: true,
        size: 11,
      },
      value: { formula: "=B44*12" },
    },
  ]
}

async function exportAgencyActualPriceExcel() {
  try {
    const id = TablesModule.AgencyId
    console.log("ID: " + id)
    const dayFormat: any = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF002060" },
    }
    // Crear un objeto Blob con el contenido de las tareas
    const { success, result }: any =
      await PayrollsModule.getAgencyActualPriceExportExcelData(id)
    const titlesTables = [
      "AFP",
      "ISSS",
      "INSAFORP",
      "VACACION",
      "AGUINALDO",
      "ASUETOS",
    ]
    const titlesTableCels = []
    const alignment: any = { horizontal: "center" }
    const costAlignment: any = { horizontal: "right" }

    if (success && result.data && result.data.agents.length > 0) {
      // Define los datos para rellenar la tabla
      console.log(result.data)

      const {
        AFP,
        AGUINALDO,
        ASUETOS,
        INSAFORP,
        ISSS,
        VACACION,
        agency_info,
        agents,
        /**agregar calcular*/
        HXD,
        HXN,
        nocturnity,
      } = result.data
      const titlesTableValues = [
        AFP,
        ISSS,
        INSAFORP,
        VACACION,
        AGUINALDO,
        ASUETOS,
      ]

      const verticalData: any[] = getVerticalValues(
        "35", //posiotionsPeerTRRs: string,
        "1", //  agentsPeerPosition: string,
        "35", //  budgetDeployment: string,
        "743,89", //  budgetServicePriceNoIVA: string,
        agency_info.base_salary.securityAgent,
        "0", //  bono: string,
        HXD, //  HxD: string,
        HXN, //  HxN: string,
        nocturnity, //  nocturnity: string,
        "52,14", //  weeklyRest: string,
        "230,49" //  opCostsAndServiceFee: string
      )

      const fileName = `agencia_${agency_info.name}_${moment()
        .utc()
        .unix()
        .toString()}.xlsx`
      // Crear una nueva instancia de ExcelJS
      const workbook = new ExcelJS.Workbook()

      // Agregar una hoja de cálculo al libro
      const worksheet = workbook.addWorksheet("Posicion con agentes")
      //guardo los datos
      // Iterar sobre los valores y combinar celdas horizontalmente

      // Iterar sobre los valores y combinar celdas horizontalmente
      let columna = 1
      let fila = 1
      for (let i = 0; i < titlesTables.length + 3; i++) {
        const title = i < 3 ? "" : titlesTables[i - 3]
        const value = i < 3 ? "" : titlesTableValues[i - 3]
        const celdaTitle = worksheet.getCell(fila, columna + i)
        const celdaValue = worksheet.getCell(fila + 1, columna + i)
        celdaTitle.value = title
        celdaValue.value = value
        celdaTitle.alignment = alignment
        celdaValue.alignment = alignment
        if (i >= 3) {
          celdaTitle.fill = dayFormat
          celdaTitle.font = { color: { argb: "FFFFFFFF" } }
          titlesTableCels.push({
            fila: fila + 1,
            columna: columna + i,
            address: celdaValue.address,
          })
        }
      }
      /** sumo 2 ya que hay una tabla de 2 filas arriba */
      fila = 3

      for (let j = 0; j < verticalData.length /*+ 3*/; j++) {
        const title = verticalData[j].titlesTableCels
        const value = verticalData[j].value
        const font = verticalData[j].font

        const celdaTitle = worksheet.getCell(fila + j, columna)
        const celdaValue = worksheet.getCell(fila + j, columna + 1)
        celdaTitle.value = title
        celdaValue.value = value
        celdaTitle.alignment = alignment
        celdaValue.alignment = costAlignment
        celdaTitle.font = font
        celdaValue.font = font
      }
      /* color */
      const fontColor = { color: { argb: "FF002060" } }

      // Recorrer todas las hojas del documento
      workbook.eachSheet(sheet => {
        // Recorrer todas las filas de la hoja
        sheet.eachRow(row => {
          // Recorrer todas las celdas de la fila
          row.eachCell(cell => {
            // Verificar si el color de fuente existente es blanco
            if (
              cell.font &&
              cell.font.color &&
              cell.font.color.argb === "FFFFFFFF"
            ) {
              // Mantener el color de fuente existente (blanco)
              return
            }
            // Aplicar el nuevo color de fuente
            cell.font = fontColor
            // Aplicar la fuente "Arial Narrow"
            cell.font = { name: "Arial Narrow", ...cell.font }
          })
        })
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
      console.log(result)
      ElMessage({
        showClose: true,
        message: "No se pudo descargar cobertura de posición en formato Excel!",
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

async function exportAgencyExcelOP(): Promise<void> {
  const is_operation = true
  exportAgencyExcel(is_operation)
}

console.log("AGENCIA: " + typeof TablesModule.AgencyId)
const customOpstions = {
  icon: "fas fa-cog mx-1",
  options: [
    {
      name: "Asignar a agentes",
      icon: "fas fa-user-plus mx-1",
      handler: () =>
        emits("changeModal", {
          modal: "formCreateWorkshiftAgentModal",
          payload: { show: true },
        }),
    },
    {
      name: "Exportar agencia Excel",
      icon: "fas fa-file-excel",
      handler: exportAgencyExcel,
      guard: [GuardRoles.ADMIN, GuardRoles.RRHH],
      hidden: !TablesModule.AgencyId,
    },
    {
      name: "Exportar precio actual",
      icon: "fas fa-file-excel",
      handler: exportAgencyActualPriceExcel,
      guard: [GuardRoles.ADMIN, GuardRoles.RRHH],
      hidden: !TablesModule.AgencyId,
    },
    {
      name: "Exportar agencia OP",
      icon: "fas fa-file-excel",
      handler: exportAgencyExcelOP,
      guard: [GuardRoles.OP_MANAGER, GuardRoles.OP_ASSISTANT, GuardRoles.ADMIN],
      hidden: !TablesModule.AgencyId,
    },
  ],
}

watch(
  () => TablesModule.AgencyId,
  () => {
    customOpstions.options = customOpstions.options.map(option => {
      if (option.hasOwnProperty("hidden")) {
        option.hidden = !TablesModule.AgencyId
        console.log(!TablesModule.AgencyId)
      }
      return option
    })
  }
)

onBeforeMount(async () => {
  const user = AuthModule.id
  const isManagerRole = [
    ...GuardGroupsRoles.MANAGER_GROUP,
    GuardRoles.ADMIN,
  ].includes(AuthModule.role)
  console.log(AuthModule.role, isManagerRole)
  const agencies: any[] = await PayrollsModule.getAgenciesDropdownData({
    user,
    isManagerRole,
  })
  options.value = agencies
})

const rowOptions = [
  {
    name: "Asignar",
    icon: "fas fa-plus mx-1",
    function: (values: any) => {
      emits("changeModal", {
        modal: "formAssignWorkshiftAgentModal",
        payload: { show: true, payload: values },
      })
    },
    guard: [
      GuardRoles.OP_COORDINATOR,
      GuardRoles.SUPERVISOR,
      GuardRoles.ASSISTANT_SUPERVISOR,
      GuardRoles.ASSISTANT_RRHH,
    ],
  },
  {
    name: "Quitar",
    icon: "fas fa-times mx-1",
    function: (values: any) => {
      emits("changeModal", {
        modal: "formUnassignWorkshiftAgentModal",
        payload: { show: true, payload: values },
      })
    },
    guard: [
      GuardRoles.OP_COORDINATOR,
      GuardRoles.SUPERVISOR,
      GuardRoles.ASSISTANT_SUPERVISOR,
      GuardRoles.ASSISTANT_RRHH,
    ],
  },
]
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
              <h5 class="mb-0">Turnos</h5>
              <p class="mb-0 text-sm">
                A continuación se listan turnos que se pueden aplicar a agentes.
              </p>
            </div>
            <div>
              <dinamic-options :customOpstions="customOpstions" />
            </div>
          </div>
          <div class="table-responsive">
            <base-table
              :hideDefaultOptions="true"
              :options="rowOptions"
              :select-filter-show="true"
              :select-filter-options="options"
              select-filter-title="Agencia:"
              :columns="[
                {
                  label: 'Agente',
                  prop: 'user_detail',
                  minWidth: 300,
                },
                {
                  label: 'Empresa',
                  prop: 'business_name',
                  minWidth: 250,
                },
                {
                  label: 'Días',
                  prop: 'days',
                  minWidth: 300,
                },
                {
                  label: 'Horarios',
                  prop: 'schedule',
                  minWidth: 280,
                },
                {
                  label: 'Activo',
                  prop: 'active',
                  minWidth: 100,
                },
                {
                  label: 'Día de inicio',
                  prop: 'startDate',
                  minWidth: 130,
                },
                {
                  label: 'Creado por',
                  prop: 'username',
                  minWidth: 120,
                },
              ]"
              endpoint="/workshifts/workdays/table/"
            >
              <template #active="scope">
                <el-tag
                  :type="scope.row.active === true ? 'success' : 'danger'"
                >
                  {{ scope.row.active === true ? "Activo" : "Inactivo" }}
                </el-tag>
              </template>
              <template #startDate="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ moment(scope.row.startDate).format("DD-MM-yyyy") }}
                </div>
              </template>
              <template #days="scope">
                <div
                  style="max-width: 1200px; overflow: auto; white-space: nowrap"
                >
                  <table>
                    <tbody>
                      <tr v-for="(day, i) in scope.row.days" :key="i">
                        <td v-for="(turn, j) in day" :key="j">
                          <div class="tag-wrapper">
                            <el-tag
                              class="full-width"
                              :key="j"
                              :type="turn === 'L' ? 'info' : ''"
                              effect="dark"
                            >
                              {{ turn }}
                            </el-tag>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
              <template #schedule="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                  class="flex flex-wrap gap-1 my-1"
                  v-for="(turn, index) in scope.row.schedule"
                >
                  <el-tag :key="index" :type="''" class="mx-1" effect="dark">
                    {{ index }}: {{ turn.label }} entrada:
                    {{ turn.checkIn }} salida:
                    {{ turn.checkOut }}
                  </el-tag>
                </div>
              </template>
              <template #user_detail="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  <el-tag
                    :type="
                      scope.row.user_detail === 'Plaza vacante' ? 'warning' : ''
                    "
                    class="mx-1"
                    effect="dark"
                  >
                    {{ scope.row.user_detail }}
                  </el-tag>
                </div>
              </template>
              <template #username="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  {{ scope.row.username }}
                </div>
              </template>
              <template #business_name="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  {{ scope.row.business_name }}
                </div>
              </template>
            </base-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.full-width {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
