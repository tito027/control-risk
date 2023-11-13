<template>
  <div class="py-4 container-fluid">
    <div class="mt-4 row">
      <div class="col-12">
        <card-detail />
      </div>
    </div>
    <div class="mt-4 row">
      <div class="col-lg-3 col-md-6 col-12">
        <mini-statistics-card
          class="bg-success"
          :title="{ text: 'Today\'s Trip', color: 'opacity-7 text-white' }"
          :value="{ text: '145 Km', color: 'text-white' }"
          :icon="{
            component: 'ni ni-money-coins text-dark',
            background: 'bg-white',
            shape: 'rounded-circle',
          }"
        />
      </div>
      <div class="mt-4 col-lg-3 col-md-6 col-12 mt-md-0">
        <mini-statistics-card
          class="bg-success"
          :title="{ text: 'Battery Health', color: 'opacity-7 text-white' }"
          :value="{ text: '99 %', color: 'text-white' }"
          :icon="{
            component: 'ni ni-controller text-dark',
            background: 'bg-white',
            shape: 'rounded-circle',
          }"
        />
      </div>
      <div class="mt-4 col-lg-3 col-md-6 col-12 mt-lg-0">
        <mini-statistics-card
          class="bg-success"
          :title="{ text: 'Average Speed', color: 'opacity-7 text-white' }"
          :value="{ text: '56 Km/h', color: 'text-white' }"
          :icon="{
            component: 'ni ni-delivery-fast text-dark',
            background: 'bg-white',
            shape: 'rounded-circle',
          }"
        />
      </div>
      <div class="mt-4 col-lg-3 col-md-6 col-12 mt-lg-0">
        <mini-statistics-card
          class="bg-success"
          :title="{ text: 'Music Volume', color: 'opacity-7 text-white' }"
          :value="{ text: '15/100', color: 'text-white' }"
          :icon="{
            component: 'ni ni-note-03 text-dark',
            background: 'bg-white',
            shape: 'rounded-circle',
          }"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <player-card />
      </div>
    </div>
  </div>
</template>

<script>
import MiniStatisticsCard from "../../examples/Cards/MiniStatisticsCard.vue";
import PlayerCard from "./components/PlayerCard.vue";
import CardDetail from "./components/CardDetail.vue";
import setTooltip from "@/assets/js/tooltip.js";

export default {
  name: "Automotive",
  components: {
    MiniStatisticsCard,
    PlayerCard,
    CardDetail,
  },
  data() {
    return {};
  },
  mounted() {
    setTooltip(this.$store.state.bootstrap);
  },
};
</script>
