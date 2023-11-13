<script setup lang="ts">
import { ref, toRefs, reactive, h } from "vue"
import { Modals, Field, ModalState } from "@/types/components"
import BaseTable from "@/components/tables/Base.vue"
import DinamicOptions from "@/components/DinamicOptions.vue"
import { getStatusColor, getStatusText } from "./InventoryUtil"

import { AuthModule } from "@/store/modules/Auth"
import moment from "moment"

import { GuardRoles } from "@/types/router"
import { PayrollsModule } from "@/store/modules/Payroll"
import * as ExcelJS from "exceljs"
import { ElMessage } from "element-plus"

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

async function exportExcelAmmo() {
  try {
    // Crear un objeto Blob con el contenido de las tareas
    const { success, result }: any = await PayrollsModule.getInventoryExcell(
      "ammo"
    )
    if (success) {
      // Define los datos para rellenar la tabla
      const data: any[] = result.data
      const fileName = `inventario_municiones_${moment()
        .utc()
        .unix()
        .toString()}.xlsx`
      // Crear una nueva instancia de ExcelJS
      const workbook = new ExcelJS.Workbook()

      // Agregar una hoja de cálculo al libro
      const worksheet = workbook.addWorksheet("municiones")

      // Obtener los encabezados de las columnas
      const headers = [
        "Nombre",
        "Codigo",
        "Calibre",
        "Proveedor",
        "Marca",
        "Clase",
        "Clasificación",
        "Condición",
        "Estado",
        "Expriración",
        "Asignación",
        "Usuario",
        "Inicial",
        "Depósito",
        "Entrada",
        "Salida",
      ]

      // Agregar los encabezados personalizados a la hoja de cálculo
      worksheet.addRow(headers)
      let excelContent: any[] = []

      /** setear columnas */
      data.forEach(item => {
        const {
          status,
          store_name,
          item_name,
          expiration_date,
          assign_date,
          user_detail,
          code,
          clasification,
          caliber,
          provider,
          brand,
          class_name,
          initial_inventary,
          condition,
          entry,
          exit,
        } = item

        excelContent.push({
          Nombre: { value: item_name },
          Código: { value: code },
          Calibre: { value: caliber },
          Proveedor: { value: provider },
          Marca: { value: brand },
          Clase: { value: class_name },
          Clasificación: { value: clasification },
          Condición: { value: condition },
          Estado: {
            value: status == "New" ? "Nuevo" : status == "Used" ? "Usado" : "",
          },
          Expriración: { value: expiration_date },
          Asignación: { value: assign_date },
          Usuario: { value: user_detail },
          Depósito: { value: store_name },
          Inicial: { value: initial_inventary },
          Entrada: { value: entry },
          Salida: { value: exit },
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
        message:
          "No se pudo descargar inventario de municiones en formato Excel!",
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

const customOpstions = {
  icon: "fas fa-cog mx-1",
  options: [
    {
      name: "Cargar Inventario",
      icon: "fas fa-plus mx-1",
      handler: (values: any) => {
        emits("changeModal", {
          modal: "formInventoryModal",
          payload: {
            show: true,
            isEdit: false,
            payload: { type: "AMMO", ...values },
          },
        })
      },
    },
    {
      name: "Asignacion a agencia",
      icon: "fas fa-plus mx-1",
      handler: (values: any) => {
        emits("changeModal", {
          modal: "formUpdateInventoryModal",
          payload: {
            show: true,
            isEdit: false,
            payload: { type: "AMMO", ...values },
          },
        })
      },
    },
    {
      name: "Exportar",
      icon: "fas fa-file-excel",
      handler: exportExcelAmmo,
    },
  ],
}
const rowOptions = [
  {
    name: "Asignar ",
    icon: "fas fa-edit mx-1",
    function: (values: any) => {
      emits("changeModal", {
        modal: "formUpdateInventoryModal",
        payload: {
          show: true,
          isEdit: true,
          payload: { type: "AMMO", ...values },
        },
      })
    },
  },

  {
    name: "Remover usuario",
    icon: "fas fa-edit mx-1",
    function: (values: any) => {
      emits("changeModal", {
        modal: "formRemoveUserModal",
        payload: { show: true, isEdit: true, payload: values },
      })
    },
  },
]
const role: any = AuthModule.user?.role
const rowVariable: any = [
  GuardRoles.RRHH,
  GuardRoles.ADMIN,
  GuardRoles.SUPERVISOR,
].includes(role.name)
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
              <h5 class="mb-0">Municiones</h5>
              <p class="mb-0 text-sm">
                A continuación se listan los inventarios.
              </p>
            </div>
            <div>
              <div>
                <dinamic-options
                  v-if="rowVariable"
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
                  label: 'Item:',
                  prop: 'item_name',
                  minWidth: 250,
                  headerAlign: 'left',
                },
                {
                  label: 'Agencia:',
                  prop: 'agency_name',
                  minWidth: 120,
                  headerAlign: 'left',
                },
                {
                  label: 'Compra',
                  prop: 'date',
                  minWidth: 120,
                  headerAlign: 'left',
                },
                {
                  label: 'Asignación',
                  prop: 'assign_date',
                  minWidth: 120,
                  headerAlign: 'left',
                },
                {
                  label: 'Vencimiento',
                  prop: 'expiration_date',
                  minWidth: 130,
                  headerAlign: 'left',
                },
                {
                  label: 'Estado',
                  prop: 'status',
                  minWidth: 120,
                  headerAlign: 'center',
                },
                {
                  label: 'Usuario :',
                  prop: 'user_detail',
                  minWidth: 200,
                  headerAlign: 'right',
                },
                {
                  label: 'Bodega :',
                  prop: 'store_name',
                  minWidth: 200,
                  headerAlign: 'right',
                },
                {
                  label: 'Marca :',
                  prop: 'brand',
                  minWidth: 200,
                  headerAlign: 'right',
                },
                {
                  label: 'Calibre :',
                  prop: 'caliber',
                  minWidth: 200,
                  headerAlign: 'right',
                },
                {
                  label: 'Serie :',
                  prop: 'code',
                  minWidth: 200,
                  headerAlign: 'right',
                },
                {
                  label: 'Inventario Inicial :',
                  prop: 'initial_inventary',
                  minWidth: 200,
                  headerAlign: 'right',
                },
                {
                  label: 'Inventario Actual :',
                  prop: 'actual_inventory',
                  minWidth: 200,
                  headerAlign: 'right',
                },
              ]"
              endpoint="/inventory/table?type=AMMO"
            >
              <template #item_name="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  {{ scope.row.item_name }}
                </div>
              </template>
              <template #agency_name="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag :type="!scope.row.agency_name ? 'info' : ''">{{
                    !scope.row.agency_name
                      ? "Sin Asignar"
                      : scope.row.agency_name
                  }}</el-tag>
                </div>
              </template>

              <template #store_name="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag :type="!scope.row.store_name ? 'info' : ''">
                    {{ scope.row.store_name }}</el-tag
                  >
                </div>
              </template>

              <template #status="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag :type="getStatusColor(scope.row)">
                    {{ getStatusText(scope.row) }}
                  </el-tag>
                </div>
              </template>
              <template #user_detail="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag :type="!scope.row.user_detail ? 'info' : ''">{{
                    !scope.row.user_detail
                      ? "Sin Asignar"
                      : scope.row.user_detail
                  }}</el-tag>
                </div>
              </template>
              <template #brand="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag :type="!scope.row.brand ? 'info' : ''">{{
                    !scope.row.brand ? "Sin Asignar" : scope.row.brand
                  }}</el-tag>
                </div>
              </template>
              <template #caliber="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag :type="!scope.row.caliber ? 'info' : ''">{{
                    !scope.row.caliber ? "Sin Asignar" : scope.row.caliber
                  }}</el-tag>
                </div>
              </template>
              <template #initial_inventary="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag :type="!scope.row.initial_inventary ? 'info' : ''">{{
                    !scope.row.initial_inventary
                      ? "Sin Asignar"
                      : scope.row.initial_inventary
                  }}</el-tag>
                </div>
              </template>
              <template #actual_inventory="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag :type="!scope.row.actual_inventory ? 'info' : ''">{{
                    !scope.row.actual_inventory
                      ? "Sin Asignar"
                      : scope.row.actual_inventory
                  }}</el-tag>
                </div>
              </template>
              <template #code="scope">
                <div
                  class="text-right"
                  style="padding-right: 24px; white-space: nowrap"
                >
                  <el-tag :type="!scope.row.code ? 'info' : ''">{{
                    !scope.row.code ? "Sin Asignar" : scope.row.code
                  }}</el-tag>
                </div>
              </template>
              <template #assign_date="scope">
                <div
                  style="
                    text-align: center;
                    padding-right: 24px;
                    white-space: nowrap;
                  "
                >
                  {{
                    scope.row.assign_date
                      ? new Date(scope.row.assign_date).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : "N/A"
                  }}
                </div>
              </template>

              <template #expiration_date="scope">
                <div
                  style="
                    text-align: center;
                    padding-right: 24px;
                    white-space: nowrap;
                  "
                >
                  {{
                    !!scope.row.expiration_date
                      ? new Date(scope.row.expiration_date).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : "N/A"
                  }}
                </div>
              </template>
              <template #date="scope">
                <div
                  style="
                    text-align: center;
                    padding-right: 24px;
                    white-space: nowrap;
                  "
                >
                  {{ moment(scope.row.date).format("DD-MM-yyyy") }}
                </div>
              </template>
            </BaseTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
