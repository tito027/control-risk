<script lang="ts" setup>
import DataDocsComposables, {
  FormItemDocProps,
  getAlertStateForET,
  getExpirationTime,
} from "@/composables/DataDocsComposables"

import FormItem from "./FormItem.vue"
import { AlertState } from "@/types/app"
import { computed } from "vue"

const addOneYear = (date?: string): string => {
  const yDate = date ? new Date(date) : new Date()
  if (yDate) yDate.setFullYear(yDate.getFullYear() + 1)
  return yDate.toISOString()
}
const { docs } = DataDocsComposables()
const items = computed<FormItemDocProps[]>(() => [
  // ========= INIT - Lavado de dinero ========= //
  {
    title:
      "Técnicas, Tipologías y Señales de Alerta del Delito de Lavado de Dinero y Activos y reporte de actividades sospechosas",
    keyDoc: "moneyLaund",
    icon: "fas fa-graduation-cap",
    state: !docs.value.moneyLaund ? AlertState.warning : AlertState.success,
    hints: {
      [AlertState.warning]: "El agente aún no posee esta capacitación",
      [AlertState.success]: "El agente ya posee esta capacitación",
    },
    itemProps: {
      category: "moneyLaund",
      updateUser: false,
      inputs: {
        moneyLaund: {
          type: "file",
          name: "moneyLaundFile",
          label: "Seleccione un archivo",
          autoUpload: false,
          value: docs.value.moneyLaund,
          limit: 1,
        },
      },
    },
  },
  // ========= END - Lavado de dinero ========= //
  // ========= INIT - Relaciones interpersonales ========= //
  {
    title: "Relaciones Interpersonales y Trabajo en Equipo",
    keyDoc: "interRel",
    icon: "fas fa-graduation-cap",
    state: getAlertStateForET(
      getExpirationTime(
        addOneYear(docs.value.interRel?.data?.interRelDate ?? undefined)
      )
    ),
    hints: {
      [AlertState.warning]: "El agente aún no posee esta capacitación",
      [AlertState.success]: "El agente ya posee esta capacitación",
    },
    itemProps: {
      category: "interRel",
      updateUser: false,
      inputs: {
        interRelDate: {
          type: "date",
          name: "interRelDate",
          label: "Fecha de capacitación:",
          value: docs.value.interRel?.data?.interRelDate ?? "",
          classPicker: "w-100",
          format: "DD/MM/YYYY",
        },
        interRel: {
          type: "file",
          name: "interRelFile",
          label: "Seleccione un archivo",
          autoUpload: false,
          value: docs.value.interRel,
          limit: 1,
        },
      } as any,
    },
  },
  // ========= END - Relaciones Interpersonales ========= //
])
</script>

<template>
  <div class="card-body p-0">
    <ul class="list-group">
      <li
        class="list-group-item border-0 d-flex p-4 mb-2 bg-primary-soft border-radius-lg"
      >
        <div class="d-flex flex-column w-100">
          <h6 class="mb-3 text-sm">Capacitaciones UU</h6>
          <template v-for="item in items">
            <el-collapse accordion>
              <form-item v-bind="item" :docs="docs" />
            </el-collapse>
            <hr class="horizontal dark my-2" />
          </template>
          <!--           <span class="mb-2 text-xs">
            Company Name:
            <span class="text-dark font-weight-bold ms-sm-2">
              {{ company }}</span
            >
          </span>
          <span class="mb-2 text-xs">
            Email Address:
            <span class="text-dark ms-sm-2 font-weight-bold"> {{ email }}</span>
          </span>
          <span class="text-xs">
            VAT Number:
            <span class="text-dark ms-sm-2 font-weight-bold">{{ id }}</span>
          </span>  -->
        </div>
        <!--         <div class="ms-auto text-end">
          <a
            class="btn btn-link text-danger text-gradient px-3 mb-0"
            :href="action[0].route"
          >
            <i class="far fa-trash-alt me-2" aria-hidden="true"></i
            >{{ action[0].label }}
          </a>
          <a class="btn btn-link text-dark px-3 mb-0" :href="action[1].route">
            <i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true"></i
            >{{ action[1].label }}
          </a>
        </div -->
      </li>
    </ul>
  </div>
</template>
