<script lang="ts" setup>
import { AgentsModule } from "@/store/modules/Agents"
import ArgonBadge from "@/components/ArgonBadge.vue"
import DocItem from "../DocItem.vue"

defineProps<{
  docs: Record<string, { type: string; file: string; name: string }>
}>()
</script>
<template>
  <el-collapse-item name="1">
    <template #title>
      <div class="d-flex align-items-center h-100 w-100">
        <div class="text-center w-5">
          <i class="fas fa-w"></i>
          <i class="fas fa-car text-lg opacity-6"></i>
        </div>
        <div class="my-auto ms-3">
          <div class="h-100">
            <p class="text-sm mb-1">Licencia de conducir</p>
            <p
              class="mb-0 text-xs"
              :class="!docs.driverLicense ? 'text-warning' : 'text-success'"
            >
              {{
                !docs.driverLicense
                  ? "El usuario no posee comprobante de licencia de conducir"
                  : "El usuario posee licencia"
              }}
            </p>
          </div>
        </div>
        <argon-badge
          :color="!docs.driverLicense ? 'warning' : 'success'"
          size="sm"
          class="my-auto ms-auto me-3"
        >
          <i
            class="fas fs-7"
            :class="{
              'fa-exclamation-triangle text-warning': !docs.driverLicense,
              'fa-check-circle text-success': docs.driverLicense,
            }"
          ></i>
        </argon-badge>
        <!-- <p class="text-secondary text-sm my-auto me-3">EU</p> -->
        <a
          href="javascript:;"
          class="text-primary text-sm icon-move-right my-auto me-1"
        >
          Editar
        </a>
      </div>
    </template>
    <div class="px-3 pt-3 d-flex flex-wrap align-items-center">
      <doc-item
        category="driverLicense"
        :inputs="{
          driver: {
            type: 'text',
            name: 'driverLicense',
            label: 'Número de licencia: ',
            value:
              AgentsModule.getAgentOverview?.userinformation.driverLicense?.toString() ??
              '',
            size: 'sm',
            className: 'form-group w-50 px-1',
            validate: {
              regex: [
                /^(\d{8}-\d)|(\d{4}-\d{6}-\d{3}-\d)$/i,
                'Ingrese un identificativo válido',
              ],
            },
          },
          expirationDriverLicense: {
            type: 'date',
            name: 'expirationDriverLicense',
            label: 'Vencimiento de la licencia:',
            value:
              AgentsModule.getAgentOverview?.userinformation?.expirationDriverLicense?.toString(),
            classPicker: 'w-100',
            validate: {
              min: [new Date(), 'Debe ingresar una fecha no menor a hoy'],
            },
            format: 'DD/MM/YYYY',
          },
          driverLicense: {
            type: 'file',
            name: 'driverLicenseFile',
            label: 'Seleccione un archivo',
            autoUpload: false,
            value: docs.driverLicense,
            limit: 1,
          },
        }"
      />
    </div>
  </el-collapse-item>
</template>
