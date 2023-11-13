<template>
  <div class="card z-index-2">
    <div class="p-3 pb-0 card-header">
      <h6>{{ title }}</h6>
    </div>
    <div class="p-3 card-body">
      <div class="chart">
        <canvas :id="id" class="chart-canvas" :height="height"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
export default {
  name: "BarChart",
  props: {
    id: {
      type: String,
      default: "bar-chart",
    },
    title: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "300px",
    },
    chart: {
      type: Object,
      required: true,
      labels: Array,
      datasets: {
        type: Object,
        required: true,
        label: String,
        data: Array,
      },
    },
  },
  mounted() {
    // Bar chart
    var ctx = document.getElementById(this.id).getContext("2d");

    let chartStatus = Chart.getChart(this.id);
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: this.chart.labels,
        datasets: [
          {
            label: this.chart.datasets.label,
            weight: 5,
            borderWidth: 0,
            borderRadius: 4,
            backgroundColor: "#3A416F",
            data: this.chart.datasets.data,
            fill: false,
            maxBarThickness: 35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            grid: {
              drawBorder: false,
              display: true,
              drawOnChartArea: true,
              drawTicks: false,
              borderDash: [5, 5],
            },
            ticks: {
              display: true,
              padding: 10,
              color: "#9ca2b7",
            },
          },
          x: {
            grid: {
              drawBorder: false,
              display: false,
              drawOnChartArea: true,
              drawTicks: true,
            },
            ticks: {
              display: true,
              color: "#9ca2b7",
              padding: 10,
            },
          },
        },
      },
    });
  },
};
</script>
