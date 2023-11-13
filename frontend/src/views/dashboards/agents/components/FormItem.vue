<script lang="ts" setup>
import { AgentsModule } from "@/store/modules/Agents"
import ArgonBadge from "@/components/ArgonBadge.vue"
import DocItem from "./DocItem.vue"
import { DocsProps } from "../../../../composables/DataDocsComposables"
import { Field, InputTypes } from "@/types/components"
import { AlertState, ExpireTime } from "@/types/app"
import { AlertColorByStatus, AlertIconByStatus } from "@/plugins/error"

const props = defineProps<{
  docs: DocsProps
  keyDoc: string
  title: string
  icon: string
  state: AlertState
  hints?: { [k in AlertState]?: string }
  itemProps: {
    inputs: {
      [k: string]: Field<InputTypes>
    }
    category: string
    updateUser: boolean
  }
}>()

function getColor() {
  return props.state
    ? `text-${AlertColorByStatus[props.state]}`
    : !props.docs[props.keyDoc]
    ? "text-warning"
    : "text-success"
}
function getMessageForET(
  defaultMessage: string = "El documento se encuentra en regla"
) {
  if (props.hints?.[props.state]) return props.hints[props.state]
  return (
    {
      [AlertState.error]: "Este documento ha cumplido su fecha de vencimiento",
      [AlertState.warning]: "Este documento está próximo a vencerse",
      [AlertState.info]: "El documento vence en unos meses",
      [AlertState.success]: defaultMessage,
    } as { [k in AlertState]: string }
  )[props.state]
}
function getIcon() {
  return `${AlertIconByStatus[props.state]} text-${
    AlertColorByStatus[props.state]
  }`
}
</script>
<template>
  <el-collapse-item name="1">
    <template #title>
      <div class="d-flex align-items-center h-100 w-100">
        <div class="text-center w-5 ms-1">
          <i class="fas fa-w"></i>
          <i class="text-lg opacity-6" :class="icon"></i>
        </div>
        <div class="my-auto ms-3">
          <div class="h-100 w-100">
            <p
              class="text-sm mb-1"
              style="
                max-height: 1.4em;
                overflow: hidden;
                white-space: pre-wrap;
                text-overflow: ellipsis;
              "
            >
              {{ title }}
            </p>
            <p class="mb-0 text-xs" :class="getColor()">
              {{ getMessageForET() }}
            </p>
          </div>
        </div>
        <argon-badge :color="getColor()" size="sm" class="my-auto ms-auto me-3">
          <i class="fas fs-7" :class="getIcon()"></i>
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
      <doc-item v-bind="itemProps" />
    </div>
  </el-collapse-item>
</template>
