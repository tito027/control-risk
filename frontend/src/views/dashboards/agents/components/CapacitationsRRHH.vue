<script lang="ts" setup>
import DataDocsComposables, {
  FormItemDocProps,
} from "@/composables/DataDocsComposables"

import FormItem from "./FormItem.vue"
import { AlertState } from "@/types/app"
import { computed } from "vue"

const { docs } = DataDocsComposables()
const items = computed<FormItemDocProps[]>(() => [
  // ========= INIT - Lavado de dinero ========= //
  {
    title: "Plan de bienestar de personal",
    keyDoc: "benefitsPer",
    icon: "fas fa-graduation-cap",
    state: !docs.value.benefitsPer ? AlertState.warning : AlertState.success,
    hints: {
      [AlertState.warning]: "El agente aún no posee esta capacitación",
      [AlertState.success]: "El agente ya posee esta capacitación",
    },
    itemProps: {
      category: "benefitsPer",
      updateUser: false,
      inputs: {
        benefitsPer: {
          type: "file",
          name: "benefitsPerFile",
          label: "Seleccione un archivo",
          autoUpload: false,
          value: docs.value.benefitsPer,
          limit: 1,
        },
      },
    },
  },
  // ========= END - Lavado de dinero ========= //
])
</script>

<template>
  <div class="card-body p-0">
    <ul class="list-group">
      <li
        class="list-group-item border-0 d-flex p-4 mb-2 bg-warning-soft border-radius-lg"
      >
        <div class="d-flex flex-column w-100">
          <h6 class="mb-3 text-sm">Capacitaciones RRHH</h6>
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
