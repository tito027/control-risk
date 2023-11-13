<script setup lang="ts">
import { Colors } from "@/types/app"
import { reactive, ref, watch } from "vue"
import SingleAccordion from "../SingleAccordion.vue"
// Types
export interface IStep {
  title: string
  color: Colors
  action: () => Promise<any> | void
  labelButton: string
  description?: string
  img: string
}
export type StepProps = { activeStep: number; index: number; step: IStep }

// Refs
const transition = reactive({
  enter: "fadeInRightMini",
  leave: "fadeOutLeftMini",
})
const loading = ref(false)

// Props
const props = defineProps<StepProps>()
watch(
  () => props.activeStep,
  (prev, next) => {
    transition.enter = prev < next ? "fadeInLeftMini" : "fadeInRightMini"
    transition.leave = prev < next ? "fadeOutRightMini" : "fadeOutLeftMini"
  }
)

async function handleAction() {
  loading.value = true
  await props.step.action()
  loading.value = false
}
</script>
<template>
  <transition
    name="fade"
    :enter-active-class="transition.enter"
    :leave-active-class="transition.leave"
  >
    <div
      v-if="activeStep === index"
      class="d-flex flex-column absolute-animate flex-md-row justify-content-center align-items-center"
    >
      <h4 :class="`d-block mt-4 d-md-none text-wrap text-${step.color}`">
        {{ step.title }}
      </h4>
      <div
        class="py-md-4 d-flex justify-content-center flex-lg-shrink-1 ms-md-2 align-items-center order-md-1"
      >
        <img
          :src="step.img"
          v-tilt="{ speed: 500, perspective: 1200 }"
          class="mw-100 mw-md-none max-vh-50 max-vw-lg-25 w-md-100 max-vh-lg-50 my-sm-3 mx-auto"
        />
      </div>

      <div
        class="d-flex flex-column w-md-60 flex-fill order-md-0 me-md-2 text-start"
      >
        <h4 :class="`d-none d-md-block text-wrap text-${step.color}`">
          {{ step.title }}
        </h4>
        <p class="d-none d-md-block text-grey">{{ step.description }}</p>
        <SingleAccordion
          v-if="step.description"
          :description="step.description"
          class-description="fs-7 text-info"
          class="mt-2"
        />
        <el-button
          :loading="loading"
          class="mb-2 mt-4 mx-auto mx-md-0"
          :type="step.color"
          @click="handleAction"
        >
          {{ step.labelButton }}
        </el-button>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
.el-dialog__body {
  word-break: normal !important;
}
</style>
