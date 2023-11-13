<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-md-6">
        <h5 class="mb-0 text-white">Charts</h5>
        <p class="mb-0 text-sm text-white">
          Charts on this page use Chart.js - Simple yet flexible JavaScript
          charting for designers & developers.
        </p>
      </div>
    </div>
    <div class="mt-4 row">
      <div class="col-md-6">
        <default-line-chart
          id="line-chart"
          title="Line chart"
          :chart="{
            labels: [
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            datasets: [
              {
                label: 'Organic Search',
                data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
              },
              {
                label: 'Referral',
                data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
              },
              {
                label: 'Direct',
                data: [40, 80, 70, 90, 30, 90, 140, 130, 200],
              },
            ],
          }"
        />
      </div>
      <div class="mt-4 col-md-6 mt-md-0">
        <gradient-line-chart
          id="chart-line"
          title="Line chart with gradient"
          :chart="{
            labels: [
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            datasets: [
              {
                label: 'Mobile Apps',
                data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
              },
              {
                label: 'Websites',
                data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
              },
            ],
          }"
        />
      </div>
    </div>
    <div class="mt-4 row">
      <div class="col-md-6">
        <bar-chart
          title="Bar Chart"
          height="300"
          :chart="{
            labels: ['16-20', '21-25', '26-30', '31-36', '36-42', '42+'],
            datasets: {
              label: 'Sales by age',
              data: [15, 20, 12, 60, 20, 15],
            },
          }"
        />
      </div>
      <div class="mt-4 col-md-6 mt-md-0">
        <bar-chart-horizontal
          title="Bar Chart Horizontal"
          :chart="{
            labels: ['16-20', '21-25', '26-30', '31-36', '36-42', '42+'],
            datasets: {
              label: 'Sales by age',
              data: [15, 20, 12, 60, 20, 15],
            },
          }"
        />
      </div>
    </div>
    <div class="mt-4 row">
      <div class="col-md-6">
        <mixed-chart
          title="Mixed Chart"
          :chart="{
            labels: [
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            datasets: [
              {
                label: 'Organic Search',
                data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
              },
              {
                label: 'Referral',
                data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
              },
            ],
          }"
        />
      </div>
      <div class="mt-4 col-md-6 mt-md-0">
        <bubble-chart
          title="Bubble Chart"
          height="163"
          :chart="{
            labels: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90'],
            datasets: [
              {
                label: 'Dataset 1',
                data: [
                  {
                    x: 100,
                    y: 0,
                    r: 10,
                  },
                  {
                    x: 60,
                    y: 30,
                    r: 20,
                  },
                  {
                    x: 40,
                    y: 350,
                    r: 10,
                  },
                  {
                    x: 80,
                    y: 80,
                    r: 10,
                  },
                  {
                    x: 20,
                    y: 30,
                    r: 15,
                  },
                  {
                    x: 0,
                    y: 100,
                    r: 5,
                  },
                ],
              },
              {
                label: 'Dataset 2',
                data: [
                  {
                    x: 70,
                    y: 40,
                    r: 10,
                  },
                  {
                    x: 30,
                    y: 60,
                    r: 20,
                  },
                  {
                    x: 10,
                    y: 300,
                    r: 25,
                  },
                  {
                    x: 60,
                    y: 200,
                    r: 10,
                  },
                  {
                    x: 50,
                    y: 300,
                    r: 15,
                  },
                  {
                    x: 20,
                    y: 350,
                    r: 5,
                  },
                ],
              },
            ],
          }"
        />
      </div>
    </div>
    <div class="mt-4 row">
      <div class="col-md-6">
        <doughnut-chart
          title="Bubble Chart"
          :chart="{
            labels: [
              'Creative Tim',
              'Github',
              'Bootsnipp',
              'Dev.to',
              'Codeinwp',
            ],
            datasets: {
              label: 'Projects',
              data: [15, 20, 12, 60, 20],
            },
          }"
        />
      </div>
      <div class="mt-4 col-md-6 mt-md-0">
        <pie-chart
          title="Pie Chart"
          :chart="{
            labels: ['Facebook', 'Direct', 'Organic', 'Referral'],
            datasets: {
              label: 'Projects',
              data: [15, 20, 12, 60],
            },
          }"
        />
      </div>
    </div>
    <div class="mt-4 row">
      <div class="col-md-6">
        <radar-chart
          title="Radar Chart"
          :chart="{
            labels: [
              'English',
              'Maths',
              'Physics',
              'Chemistry',
              'Biology',
              'History',
            ],
            datasets: [
              {
                label: 'Stduent A',
                data: [65, 75, 70, 80, 60, 80],
              },
              {
                label: 'Stduent B',
                data: [54, 65, 60, 70, 70, 75],
              },
            ],
          }"
        />
      </div>
      <div class="mt-4 col-md-6 mt-md-0">
        <polar-chart
          title="Polar Chart"
          :chart="{
            labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
            datasets: {
              label: 'My First Dataset',
              data: [11, 16, 7, 3, 14],
            },
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DefaultLineChart from "@/examples/Charts/DefaultLineChart.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
import BarChart from "./components/BarChart.vue";
import BarChartHorizontal from "./components/BarChartHorizontal.vue";
import MixedChart from "./components/MixedChart.vue";
import BubbleChart from "./components/BubbleChart.vue";
import DoughnutChart from "./components/DoughnutChart.vue";
import PieChart from "./components/PieChart.vue";
import RadarChart from "./components/RadarChart.vue";
import PolarChart from "./components/PolarChart.vue";

export default {
  name: "Charts",
  components: {
    DefaultLineChart,
    GradientLineChart,
    BarChart,
    BarChartHorizontal,
    MixedChart,
    BubbleChart,
    DoughnutChart,
    PieChart,
    RadarChart,
    PolarChart,
  },
};
</script>
