<script setup lang="ts">
import BaseTable from "@/components/tables/Base.vue"
import { Modals, Field, ModalState } from "@/types/components"
import DinamicOptions from "@/components/DinamicOptions.vue"
import { PayrollsModule } from "@/store/modules/Payroll"
import { AuthModule } from "@/store/modules/Auth"
import { TablesModule } from "@/store/table/Table"
import { ElMessage } from "element-plus"
import { GuardRoles } from "@/types/router"

// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void
}>()

async function onAccepted(payload: any) {
  try {
    const body = {
      _id: payload._id,
      is_pending: false,
      change_by: AuthModule.id,
    }
    const result = await PayrollsModule.updateDiscountStatus(body)
    if (result.update) {
      ElMessage({
        showClose: true,
        message: "Se aceptó correctamente el descuento pendiente a revisión",
        type: "success",
      })
      TablesModule.setReload(true)
    } else {
      ElMessage({
        showClose: true,
        message: "No se pudo actualizar el descuento pendiente a revisión",
        type: "error",
      })
    }
  } catch (error: any) {
    ElMessage({
      showClose: true,
      message: error.message,
      type: "error",
    })
  }
}

async function onRejected(payload: any) {
  try {
    const body = {
      _id: payload._id,
      is_pending: false,
      is_rejected: true,
      change_by: AuthModule.id,
    }
    const result = await PayrollsModule.updateDiscountStatus(body)
    if (result.update) {
      ElMessage({
        showClose: true,
        message: "Se rechazó correctamente el descuento pendiente a revisión",
        type: "success",
      })
      TablesModule.setReload(true)
    } else {
      ElMessage({
        showClose: true,
        message: "No se pudo actualizar el descuento pendiente a revisión",
        type: "error",
      })
    }
  } catch (error: any) {
    ElMessage({
      showClose: true,
      message: error.message,
      type: "error",
    })
  }
}
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
              <h5 class="mb-0">Descuentos pendientes a revisión</h5>
              <p class="mb-0 text-sm">
                A continuación se listan todos los descuentos pendientes a
                revisón que se pueden aplicar a agentes.
              </p>
            </div>
            <!--div>
              <dinamic-options :customOpstions="customOpstions" />
            </div-->
          </div>
          <div class="table-responsive">
            <base-table
              :hide-default-options="true"
              :options="[
                {
                  name: 'Aceptar',
                  icon: 'fas fa-check-circle mx-1',
                  function: onAccepted,
                },
                {
                  name: 'Rechazar',
                  icon: 'fas fa-times-circle mx-1',
                  function: onRejected,
                },
              ]"
              :columns="[
                {
                  label: 'Agente',
                  prop: 'user_from_full_name',
                  minWidth: 150,
                },
                {
                  label: 'Supervisor',
                  prop: 'by_user_full_name',
                  minWidth: 150,
                },
                {
                  label: 'Valor',
                  prop: 'value',
                  minWidth: 100,
                },
                {
                  label: 'Descuento',
                  prop: 'discount_type',
                  minWidth: 150,
                },
                {
                  label: 'Estado',
                  prop: 'is_pending',
                  minWidth: 100,
                },
              ]"
              endpoint="/payrolls/discounts/pending/table/admin"
            >
              <template #is_pending="scope"
                ><div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                ></div>
                <el-tag
                  :type="scope.row.is_pending === true ? 'success' : 'danger'"
                >
                  {{
                    scope.row.is_pending === true ? "Pendiente" : "No pendiente"
                  }}
                </el-tag>
              </template>
              <template #user_from_full_name="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ scope.row.user_from_full_name }}
                </div>
              </template>
              <template #by_user_full_name="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                >
                  {{ scope.row.by_user_full_name }}
                </div>
              </template>
              <template #value="scope">
                <div
                  style="
                    text-align: right;
                    white-space: nowrap;
                    padding-right: 24px;
                  "
                ></div>
                {{
                  scope.row.value.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }}
              </template>
            </base-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
