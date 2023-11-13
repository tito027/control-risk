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
  name: "PieChart",
  props: {
    id: {
      type: String,
      default: "pie-chart",
    },
    height: {
      type: [String, Number],
      default: "300",
    },
    title: {
      type: String,
      default: "",
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
    // Pie chart
    var pieChart = document.getElementById(this.id).getContext("2d");

    let chartStatus = Chart.getChart(this.id);
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    new Chart(pieChart, {
      type: "pie",
      data: {
        labels: this.chart.labels,
        datasets: [
          {
            label: this.chart.datasets.label,
            weight: 9,
            cutout: 0,
            tension: 0.9,
            pointRadius: 2,
            borderWidth: 2,
            backgroundColor: ["#17c1e8", "#4BB543 ", "#3A416F", "#a8b8d8"],
            data: this.chart.datasets.data,
            fill: false,
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
        interaction: {
          intersect: false,
          mode: "index",
        },
        scales: {
          y: {
            grid: {
              drawBorder: false,
              display: false,
              drawOnChartArea: false,
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
          },
          x: {
            grid: {
              drawBorder: false,
              display: false,
              drawOnChartArea: false,
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
          },
        },
      },
    });
  },
};
</script>
