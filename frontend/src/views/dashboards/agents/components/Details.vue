<script setup lang="ts">
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue"
import { ref, computed } from "vue"
import Docs from "./Docs.vue"
import Test from "./Test.vue"

const openModal = ref(false)
const documentation = ref(false)
const test = ref(false)

// getters
const title = computed(() => {
  if (documentation.value) return "Documentación"
  if (test.value) return "Pruebas"

})
// Methods
function openDocumentation(e: any) {
  openModal.value = true
  documentation.value = true
  test.value = false

}
// Methods
function openTest(e: any) {
  openModal.value = true
  documentation.value = false
  test.value = true
}
</script>
<template>
  <el-dialog :title="title" v-model="openModal" 
>
    <docs v-if="documentation" />
    <Test v-if="test" />
 
  </el-dialog>
  <div class="pt-4 container-fluid px-4">
    <div class="row">
      <div class="mb-4 col-xl-3 col-sm-6 mb-xl-0">
        <mini-statistics-card
          title="Curso ANSP"
          :icon="{
            component: 'ni ni-circle-08',
            background: 'bg-gradient-primary',
          }"
          :tag="{
            value: 'Pendiente',
            color: 'warning',
          }"
        />
      </div>
      <div class="mb-4 col-xl-3 col-sm-6 mb-xl-0">
        <mini-statistics-card
        @click="openTest"
        :tag="{
            value: 'Pendiente',
            color: 'warning',
          }"
          title="Pruebas"
          :icon="{
            component: 'fa fa-head-side-virus',
            background: 'bg-gradient-secondary',
          }"
        />
      </div>
      <div class="mb-4 col-xl-3 col-sm-6 mb-xl-0">
        <mini-statistics-card
          @click="openDocumentation"
          title="Documentación"
          :tag="{
            value: 'Pendiente',
            color: 'warning',
          }"
          :icon="{
            component: 'fa fa-file-archive',
            background: 'bg-gradient-info',
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6">
        <mini-statistics-card
          title="Equipamiento"
          :tag="{
            value: 'Pendiente',
            color: 'warning',
          }"
          :icon="{
            component: 'fa fa-tshirt',
            background: 'bg-gradient-danger',
          }"
        />
      </div>
    </div>
  </div>
</template>
