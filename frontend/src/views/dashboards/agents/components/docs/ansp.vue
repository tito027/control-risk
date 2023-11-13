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
          <i class="fas fa-user-shield text-lg opacity-6"></i>
        </div>
        <div class="my-auto ms-3">
          <div class="h-100">
            <p class="text-sm mb-1">Curso ANSP</p>
            <p
              class="mb-0 text-xs"
              :class="!docs.ansp ? 'text-warning' : 'text-success'"
            >
              {{
                !docs.ansp
                  ? "El usuario no posee diploma de ANSP"
                  : "El usuario posee diploma ANSP"
              }}
            </p>
          </div>
        </div>
        <argon-badge
          :color="!docs.ansp ? 'warning' : 'success'"
          size="sm"
          class="my-auto ms-auto me-3"
        >
          <i
            class="fas fs-7"
            :class="{
              'fa-exclamation-triangle text-warning': !docs.ansp,
              'fa-check-circle text-success': docs.ansp,
            }"
          ></i>
        </argon-badge>
        <!-- <p class="text-secondary text-sm my-auto me-3">EU</p> -->
        <a
          href="javascript:;"
          class="text-primary text-sm icon-move-right my-auto"
        >
          Editar
        </a>
      </div>
    </template>
    <div class="px-2 pt-3 d-flex flex-wrap align-items-center">
      <doc-item
        update-user
        :inputs="{
          ansp: {
            type: 'text',
            name: 'anspNo',
            label: 'No. ANSP',
            value:
              AgentsModule.getAgentOverview?.userinformation.anspNo?.toString() ??
              '',
            size: 'sm',
            className: 'form-group w-50 px-1',
            validate: {
              regex: [/^\d+$/i, 'Ingrese un número valido'],
            },
          },
          anspDate: {
            type: 'date',
            name: 'anspDate',
            label: 'Fecha de acreditación',
            value: AgentsModule.getAgentOverview?.userinformation?.anspDate,
            classPicker: 'w-100',
            validate: {
              max: [new Date(), 'Debe ingresar una fecha no mayor a hoy'],
            },
            format: 'DD/MM/YYYY',
          },
          anspFile: {
            type: 'file',
            name: 'anspFile',
            label: 'Seleccione un archivo',
            autoUpload: false,
            value: docs.ansp,
            limit: 1,
          },
        }"
        category="ansp"
      />
    </div>
  </el-collapse-item>
</template>
