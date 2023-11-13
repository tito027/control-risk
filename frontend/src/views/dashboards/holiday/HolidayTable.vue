<script setup lang="ts">
import { ref, toRefs, reactive } from "vue"
import { Modals, Field, ModalState } from "@/types/components"
import BaseTable from "@/components/tables/Base.vue"
import DinamicOptions from "@/components/DinamicOptions.vue"
import { ElMessage } from "element-plus"
import { AuthModule } from "@/store/modules/Auth"
import moment from "moment"
import { getTagType } from "./HolidayUtils"
import { GuardRoles } from "@/types/router"
import { HolidayModule } from "@/store/modules/Holiday"
import * as ExcelJS from "exceljs"

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

async function exportMonth() {
  // Crear un objeto Blob con el contenido de las tareas
  const { success, data } = await HolidayModule.getExportTableData()

  if (success) {
    const fileName = `vacaciones_${moment().utc().unix().toString()}.xlsx`
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("vacaciones del mes")
    const clearData: any[] = data.map((item: any) => {
      return {
        posicion: item.agency_name,
        empleado: item.user_detail,
        desde: moment(item.init_date).format("DD/MM/yyyy"),
        hasta: moment(item.end_date).format("DD/MM/yyyy"),
        observations: item.observations,
        estado: item.is_rejected
          ? "Rechazado"
          : item.is_pending
          ? "Pendiente"
          : "Aceptado",
        responsable: item.change_by,
      }
    })
    // Agregar encabezados de columnas
    const headers = Object.keys(clearData[0])
    worksheet.addRow(headers)

    // Aplica formato a los encabezados
    const headerRow = worksheet.getRow(1)
    headerRow.eachCell((cell, colNumber) => {
      cell.alignment = { horizontal: "center" }
    })

    // Agregar filas de datos
    clearData.forEach(item => {
      const row: any[] = []
      headers.forEach(header => {
        row.push(item[header])
      })
      worksheet.addRow(row)
    })

    // Obtener las columnas existentes en el worksheet
    const columns = worksheet.columns

    // Iterar sobre las columnas para calcular el ancho adecuado
    columns.forEach((column: any) => {
      let maxCellWidth = 0
      column.eachCell({ includeEmpty: true }, cell => {
        const cellWidth = cell.value ? cell.value.toString().length : 0
        maxCellWidth = Math.max(maxCellWidth, cellWidth)
      })

      // Establecer el ancho de columna en función del valor más largo
      const columnWidth = Math.ceil((maxCellWidth + 2) * 1.2)
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
      message: "No se pudo descargar el archivo Cuscatlan txt!",
      type: "error",
    })
  }
}
const customOpstions = {
  icon: "fas fa-cog mx-1",
  options: [
    {
      name: "Nueva solicitud",
      icon: "fas fa-plus mx-1",
      handler: () =>
        emits("changeModal", {
          modal: "formHolidayModal",
          payload: { show: true },
        }),
    },
    {
      name: "Export mes",
      icon: "fas fa-excel mx-1",
      handler: exportMonth,
      guard: [GuardRoles.RRHH, GuardRoles.ADMIN],
    },
  ],
}
const rowOptions = [
  {
    name: "Editar",
    icon: "fas fa-edit mx-1",
    function: (values: any) => {
      emits("changeModal", {
        modal: "formHolidayModal",
        payload: { show: true, isEdit: true, payload: values },
      })
    },
  },
  {
    name: "Rechazar ",
    icon: "fa fa-close mx-1",
    function: (values: any) =>
      emits("changeModal", {
        modal: "formCloseHolidayModal",
        payload: { show: true, isEdit: true, payload: values },
      }),
  },

  {
    name: "Aprobar ",
    icon: " fas fa-handshake mx-1",
    function: (values: any) =>
      emits("changeModal", {
        modal: "formApproveHolidayModal",
        payload: { show: true, isEdit: true, payload: values },
      }),
  },
]

const role: any = AuthModule.user?.role
const rowVariable: any = [GuardRoles.RRHH, GuardRoles.ADMIN].includes(role.name)
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
              <h5 class="mb-0">Solicitudes</h5>
              <p class="mb-0 text-sm">
                A continuación se listan todas las solicitudes.
              </p>
            </div>
            <div>
              <div>
                <dinamic-options
                  v-if="
                    [
                      GuardRoles.SUPERVISOR,
                      GuardRoles.SECURITY_AGENT,
                      GuardRoles.PREVENTION_AGENT,
                      GuardRoles.ADMIN,
                    ].includes(role.name)
                  "
                  :customOpstions="customOpstions"
                />
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <BaseTable
              :reload="state.table.reload"
              :hide-default-options="true"
              :hide-row-options="!rowVariable"
              :options="rowOptions"
              :columns="[
                {
                  label: 'Tipo',
                  prop: 'type_name',
                  minWidth: 180,
                },
                {
                  label: 'Tipo de permiso',
                  prop: 'permission_type',
                  minWidth: 180,
                },
                {
                  label: 'Tipo de asistencia',
                  prop: 'psico_assist_type',
                  minWidth: 180,
                },
                {
                  label: 'Nombre',
                  prop: 'user_detail',
                  minWidth: 350,
                  headerAlign: 'left',
                },
                {
                  label: 'Desde',
                  prop: 'init_date',
                  minWidth: 130,
                  headerAlign: 'left',
                },
                {
                  label: 'Hasta',
                  prop: 'end_date',
                  minWidth: 130,
                  headerAlign: 'right',
                },
                {
                  label: 'Posicion',
                  prop: 'agency_name',
                  minWidth: 130,
                  headerAlign: 'right',
                },
                {
                  label: 'Observaciones',
                  prop: 'observations',
                  minWidth: 150,
                  headerAlign: 'right',
                },
                {
                  label: 'Estado',
                  prop: 'is_rejected',
                  minWidth: 110,
                  headerAlign: 'right',
                },
                {
                  label: 'Modificado por:',
                  prop: 'change_by',
                  minWidth: 200,
                  headerAlign: 'right',
                },
              ]"
              endpoint="/requests/table"
            >
              <template #user_detail="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  {{ scope.row.user_detail }}
                </div>
              </template>
              <template #change_by="scope">
                <el-tag :type="scope.row.change_by ? 'success' : 'info'">
                  {{
                    scope.row.change_by
                      ? scope.row.change_by
                      : "Sin modificaciones"
                  }}
                </el-tag>
              </template>
              <template #init_date="scope">
                <div style="text-align: right; padding-right: 24px">
                  {{ moment(scope.row.init_date).format("DD-MM-yyyy") }}
                </div>
              </template>
              <template #end_date="scope">
                <div style="text-align: right; padding-right: 24px">
                  {{ moment(scope.row.end_date).format("DD-MM-yyyy") }}
                </div>
              </template>
              <template #is_rejected="scope">
                <el-tag :type="getTagType(scope.row)">
                  {{
                    scope.row.is_pending && !scope.row.is_rejected
                      ? "Pendiente"
                      : scope.row.is_rejected && !scope.row.is_pending
                      ? "Rechazado"
                      : !scope.row.is_rejected && !scope.row.is_pending
                      ? "Aprobado"
                      : "Pendiente"
                  }}
                </el-tag>
              </template>
            </BaseTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
