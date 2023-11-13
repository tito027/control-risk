<script setup lang="ts">
defineProps<{ activeStep: number; key: number }>()
const emits = defineEmits<{
  (e: "update:activeStep", value: number): void
}>()
</script>
<template>
  <img
    src="/src/assets/img/illustrations/welcome.webp"
    class="img-welcome mx-auto"
  />
  <el-button type="danger" @click="emits('update:activeStep', activeStep + 1)">
    Comenzar configuración
  </el-button>
</template>
