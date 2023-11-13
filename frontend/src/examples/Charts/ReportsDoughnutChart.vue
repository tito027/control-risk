<template>
  <div class="card">
    <div class="p-3 pb-0 card-header">
      <div class="d-flex align-items-center">
        <h6 class="mb-0">{{ title }}</h6>
        <button
          type="button"
          class="mb-0 btn btn-icon-only btn-rounded btn-outline-secondary ms-2 btn-sm d-flex align-items-center justify-content-center ms-auto"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          :title="tooltip"
        >
          <i class="fas fa-info"></i>
        </button>
      </div>
    </div>
    <div class="p-3 card-body">
      <div class="row">
        <div class="text-center col-5">
          <div class="chart">
            <canvas :id="id" class="chart-canvas" height="197"></canvas>
          </div>
          <h4 class="font-weight-bold mt-n8">
            <span>{{ count.number }}</span>
            <span class="text-sm d-block text-body">{{ count.text }}</span>
          </h4>
        </div>
        <div class="col-7">
          <div class="table-responsive">
            <table class="table mb-0 align-items-center">
              <tbody>
                <tr>
                  <td>
                    <div class="px-2 py-0 d-flex">
                      <span class="badge bg-primary me-2">&nbsp;</span>
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">Living Room</h6>
                      </div>
                    </div>
                  </td>
                  <td class="text-sm text-center align-middle">
                    <span class="text-xs font-weight-bold">15%</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="px-2 py-0 d-flex">
                      <span class="badge bg-secondary me-3">&nbsp;</span>
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">Kitchen</h6>
                      </div>
                    </div>
                  </td>
                  <td class="text-sm text-center align-middle">
                    <span class="text-xs font-weight-bold">20%</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="px-2 py-0 d-flex">
                      <span class="badge bg-info me-3">&nbsp;</span>
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">Attic</h6>
                      </div>
                    </div>
                  </td>
                  <td class="text-sm text-center align-middle">
                    <span class="text-xs font-weight-bold">13%</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="px-2 py-0 d-flex">
                      <span class="badge bg-success me-3">&nbsp;</span>
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">Garage</h6>
                      </div>
                    </div>
                  </td>
                  <td class="text-sm text-center align-middle">
                    <span class="text-xs font-weight-bold">32%</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="px-2 py-0 d-flex">
                      <span class="badge bg-warning me-3">&nbsp;</span>
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">Basement</h6>
                      </div>
                    </div>
                  </td>
                  <td class="text-sm text-center align-middle">
                    <span class="text-xs font-weight-bold">20%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "ReportsDoughnutChart",
  props: {
    id: {
      type: String,
      default: "reports-doughnut-chart",
    },
    title: {
      type: String,
      default: "",
    },
    tooltip: {
      type: String,
      default: "",
    },
    count: {
      type: Object,
      required: true,
      number: Number,
      text: String,
    },
    chart: {
      type: Object,
      required: true,
      labels: Array,
      datasets: {
        type: Object,
        label: String,
        data: String,
      },
    },
  },
  mounted() {
    var ctx1 = document.getElementById(this.id).getContext("2d");

    var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);

    gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
    gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
    gradientStroke1.addColorStop(0, "rgba(203,12,159,0)"); //purple colors

    let chartStatus = Chart.getChart(this.id);
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    new Chart(ctx1, {
      type: "doughnut",
      data: {
        labels: this.chart.labels,
        datasets: [
          {
            label: this.chart.datasets.label,
            weight: 9,
            cutout: 90,
            tension: 0.9,
            pointRadius: 2,
            borderWidth: 2,
            backgroundColor: [
              "#5e72e4",
              "#8392ab",
              "#11cdef",
              "#2dce89",
              "#fb6340",
            ],

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
