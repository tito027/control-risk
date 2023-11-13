<script lang="ts" setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue"
import { AgencyModule } from "@/store/modules/Agencies"
import type { Statistic } from "@/store/modules/Business"
import { computed, onMounted } from "vue"

// ===> Props
const props = defineProps<{
  agencyId: string
}>()

// ===> Computed
const statistics = computed<Statistic[]>(() =>
  Object.values(AgencyModule.statistics ?? {})
)

// ===> Event
onMounted(() => {
  AgencyModule.getStatistics(props.agencyId)
})
</script>
<template>
  <div class="pt-4 container-fluid px-4">
    <div class="row">
      <div
        class="mb-4 col-xl-3 col-sm-6 mb-xl-0"
        v-for="statistic in statistics"
        :key="statistic.id"
      >
        <mini-statistics-card
          :title="statistic['label']"
          :icon="{
            component: 'ni ni-circle-08',
            background: 'bg-gradient-primary',
          }"
          :description="`${statistic.assignment} / ${statistic.total}`"
          :percentage="{
            value: `${
              statistic.total <= 0
                ? '0'
                : Math.round((statistic.assignment / statistic.total) * 10000) /
                  100
            }%`,
            color:
              statistic.assignment / statistic.total < 0.5
                ? 'danger'
                : 'success',
          }"
        />
      </div>
    </div>
  </div>
</template>
