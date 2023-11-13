<script lang="ts" setup>
import { AgencyModule } from "@/store/modules/Agencies"
import { computed, ref } from "vue"
import FormLocation from "./FormLocation.vue"

// ===> data
const title = ref("Configuración nueva ubicación")
const openModal = ref(false)

// ===> Computed
const mapInfo = computed(() => ({
  center: {
    lat: AgencyModule.overview?.latitude,
    lng: AgencyModule.overview?.longitude,
  },
  markers: [
    {
      position: {
        lat: AgencyModule.overview?.latitude,
        lng: AgencyModule.overview?.longitude,
      },
    }, // Along list of clusters
  ],
}))
</script>
<template>
  <el-dialog :title="title" v-model="openModal">
    <form-location :model-value="openModal" />
  </el-dialog>
  <div class="card h-100">
    <div class="p-3 pb-0 card-header">
      <div class="row">
        <div class="col-md-8 d-flex align-items-center">
          <h6 class="mb-0">Geolocalización</h6>
        </div>
        <div class="col-md-4 text-end">
          <button
            @click="() => (openModal = true)"
            class="border-0"
            style="background: transparent"
          >
            <i
              class="text-sm text-secondary fas fa-cog"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              :title="'Cambiar configuración'"
            ></i>
          </button>
        </div>
      </div>
    </div>

    <div class="p-3 card-body">
      <GMapMap
        :center="mapInfo.markers[0].position"
        :zoom="15"
        style="width: 100%; height: 300px"
        :options="{
          gestureHandling: 'greedy',
        }"
      >
        <GMapMarker
          :key="index"
          v-for="(m, index) in mapInfo.markers"
          :position="m.position"
          @click="() => (mapInfo.center = m.position)"
        />
      </GMapMap>
    </div>
  </div>
</template>
