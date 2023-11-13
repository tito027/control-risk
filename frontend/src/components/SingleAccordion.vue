<script setup lang="ts">
import { onMounted, ref, VNode } from "vue"
import { IndexType } from "@/types/app"

// Types
export interface AccordionProps {
  title?: string
  icon?: string | VNode
  description: string
  classDescription: string | { [k: string]: boolean }
  class: string | IndexType<boolean>
}

// Props
withDefaults(defineProps<AccordionProps>(), {
  title: "Ver más",
  icon: "fas fa-chevron-down",
})

// Data
const open = ref(false)
const descriptionContainer = ref<HTMLDivElement | null>(null)
const heightDescription = ref(0)
const height = ref(0)

// Methods

function setOpen() {
  height.value = open.value ? 0 : heightDescription.value
  open.value = !open.value
}

onMounted(() => {
  setTimeout(() => {
    heightDescription.value = descriptionContainer.value?.scrollHeight ?? 0
  })
  const observer = new ResizeObserver(entries => {
    const newHeight = entries[0].target.scrollHeight
    heightDescription.value = newHeight
    if (height.value > 0) height.value = newHeight
  })
  descriptionContainer.value && observer.observe(descriptionContainer.value)
})
</script>
<template>
  <div class="d-md-none text-center text-dark" :class="class">
    <div
      class="d-flex position-relative justify-content-center align-items-center hoverable accordion--title"
      :class="{ active: open }"
    >
      <el-button type="primary" link @click="setOpen">
        {{ title }}
        <i
          v-if="typeof icon === 'string'"
          class="chevron-down-animate transition-basic mt-1 ms-2 fas fa-chevron-down"
          :class="{ 'rotate-180': open }"
        />
        <component v-else :is="icon" />
      </el-button>
    </div>
    <div
      ref="descriptionContainer"
      class="transition-basic overflow-hidden"
      :style="{
        height: height + 'px',
      }"
    >
      <div v-if="description" class="py-2 text-md-left px-4">
        <p class="m-0" :class="classDescription">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.chevron-down-animate {
  transform-origin: 50% 35%;
}
.accordion--title {
  &::before {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    box-shadow: 0 0.75px 0 rgba(var(--bs-dark-rgb), 0.5);
  }
}
.accordion--title.active {
  &::before {
    height: 1px;
  }
}
.rotate-180 {
  transform: rotate(-180deg);
}
</style>
