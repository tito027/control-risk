<script setup lang="ts">
import { AlertState, AlertColorByStatus } from "@/plugins/error"
import ArgonSnackbar from "@/components/ArgonSnackbar.vue"
import { StringifyOptions } from "querystring"

// Props
const props = defineProps<{
  modelValue: boolean
  type: AlertState
  title?: string
  cancel: {
    text?: string
    action: () => void
  }
  accept: {
    text?: string
    action: () => void
  }
  text?: string
}>()
</script>
<template>
  <el-dialog
    v-model="props.modelValue"
    :class="`toast show fade bg-gradient-${AlertColorByStatus[type]}`"
    :show-close="false"
    align-center
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="p-2">
        <div class="toast-header bg-transparent border-0">
          <i class="me-2 ni ni-check-bold text-white" />
          <slot name="title" :props="{ close, title, titleId, titleClass }">
            <span class="me-auto font-weight-bold text-white">
              {{ title }}
            </span>
            <!-- <small :class="getTextColor(color)">{{ date }}</small> -->
            <i
              class="fas fa-times text-md ms-3 cursor-pointer text-white"
              @click="close"
            />
          </slot>
        </div>
        <hr class="horizontal dark m-0" />
      </div>
    </template>
    <slot :props="{ text }">
      <div class="w-100 p-2 text-center">
        <p class="fs-7 text-white text-break">
          {{ text }}
        </p>
      </div>
    </slot>
    <slot name="footer">
      <div class="w-100 d-flex pt-1 justify-content-between">
        <button class="btn btn-sm fs-7 m-0 btn-light" @click="cancel.action">
          {{ cancel.text ?? "Cancelar" }}
        </button>
        <button
          class="btn btn-sm fs-7 m-0 px-2 btn-dark"
          @click="accept.action"
        >
          {{ accept.text ?? "Aceptar" }}
        </button>
      </div>
    </slot>
    <!--       <h2 class="fs-6 text-success">Registro guardado correctamente</h2>
      <div class="w-100 d-flex">
        <el-button
          class="ms-auto"
          type="success"
          @click="$router.push({ name: 'Agents' })"
          >Finalizar</el-button
        >
      </div> -->
  </el-dialog>
</template>
