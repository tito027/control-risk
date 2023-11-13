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
          <i class="fas fa-certificate text-lg opacity-6"></i>
        </div>
        <div class="my-auto ms-3">
          <div class="h-100">
            <p class="text-sm mb-1">Licencia de armas</p>
            <p
              class="mb-0 text-xs"
              :class="!docs.weaponLicense ? 'text-warning' : 'text-success'"
            >
              {{
                !docs.ansp
                  ? "El usuario no posee certificado de licencia de armas"
                  : "El usuario posee certificado"
              }}
            </p>
          </div>
        </div>
        <argon-badge
          :color="!docs.weaponLicense ? 'warning' : 'success'"
          size="sm"
          class="my-auto ms-auto me-3"
        >
          <i
            class="fas fs-7"
            :class="{
              'fa-exclamation-triangle text-warning': !docs.weaponLicense,
              'fa-check-circle text-success': docs.weaponLicense,
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
    <div class="px-2 pt-3 d-flex flex-wrap align-items-center">
      <doc-item
        update-user
        category="weaponLicense"
        :inputs="{
          weapon: {
            type: 'text',
            name: 'weaponLicense',
            label: 'Identificativo: ',
            value:
              AgentsModule.getAgentOverview?.userinformation.weaponLicense?.toString() ??
              '',
            size: 'sm',
            className: 'form-group w-50 px-1',
            validate: {
              regex: [/^\d+$/i, 'Ingrese un identificativo válido'],
            },
          },
          expirationWeaponLicense: {
            type: 'date',
            name: 'expirationWeaponLicense',
            label: 'Vencimiento de la licencia:',
            value:
              AgentsModule.getAgentOverview?.userinformation?.expirationWeaponLicense?.toString(),
            classPicker: 'w-100',
            validate: {
              min: [new Date(), 'Debe ingresar una fecha no menor a hoy'],
            },
            format: 'DD/MM/YYYY',
          },
          weaponLicense: {
            type: 'file',
            name: 'weaponLicenseFile',
            label: 'Seleccione un archivo',
            autoUpload: false,
            value: docs.weaponLicense,
            limit: 1,
          },
        }"
      />
    </div>
  </el-collapse-item>
</template>
