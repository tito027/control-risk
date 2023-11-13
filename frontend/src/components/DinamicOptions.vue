<script setup lang="ts">
import { AuthModule } from "@/store/modules/Auth"
import { computed, watch } from "vue"

const props = defineProps<{
  customOpstions: {
    options: {
      name: string
      icon?: string
      handler?: any
      guard?: string[]
      hidden?: boolean
    }[]
    icon: string
    minWidth?: string
  }
}>()
const role = AuthModule.role
const options = computed(() => props.customOpstions.options)
</script>
<template v-else #default="scope">
  <el-popover
    placement="left"
    trigger="click"
    popper-style="padding: 0; width:auto; min-width:180px;"
  >
    <template #reference>
      <button class="btn btn-white btn-sm my-1">
        <i :class="customOpstions.icon"></i>
      </button>
    </template>
    <div @click.capture="" v-for="option in options ?? []" :key="option.name">
      <button
        v-if="(!option.guard || option.guard.includes(role)) && !option.hidden"
        class="bg-white p-2 text-left fs-7 border-0 w-100 text-start dropdown-control-menu__item"
        @click="option.handler"
      >
        <!--"emits('event', { event: option.name, payload: scope.row })"-->
        <i :class="option.icon" />
        {{ option.name }}
      </button>
    </div>
  </el-popover>
</template>
<style>
.dropdown-control-menu__item:hover {
  background-color: rgba(0, 0, 0, 0.1) !important;
}
</style>
