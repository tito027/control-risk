<template>
  <div class="card z-index-2">
    <div class="p-3 pb-0 card-header">
      <h6>{{ title }}</h6>
    </div>
    <div class="p-5 card-body">
      <div class="chart">
        <canvas :id="id" class="chart-canvas" :height="height"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
export default {
  name: "PolarChart",
  props: {
    id: {
      type: String,
      default: "polar-chart",
    },
    title: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "100",
    },
    chart: {
      type: Object,
      required: true,
      labels: Array,
      datasets: {
        type: Object,
        label: String,
        data: Array,
      },
    },
  },
  mounted() {
    // Polar chart
    var ctx = document.getElementById(this.id).getContext("2d");

    let chartStatus = Chart.getChart(this.id);
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    new Chart(ctx, {
      type: "polarArea",
      data: {
        labels: this.chart.labels,
        datasets: [
          {
            label: this.chart.datasets.label,
            data: this.chart.datasets.data,
            backgroundColor: [
              "#17c1e8",
              "#5e72e4",
              "#3A416F",
              "#a8b8d8",
              "#82d616",
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  },
};
</script>
