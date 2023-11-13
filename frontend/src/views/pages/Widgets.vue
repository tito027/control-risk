<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-lg-3 col-md-6">
        <mini-statistics-card
          class="bg-gradient-dark p-0"
          :title="{ text: 'Battery Health', color: 'opacity-7 text-white' }"
          :value="{ text: '99 %', color: 'text-white' }"
          :icon="{
            component: 'ni ni-controller text-dark',
            background: 'bg-white',
          }"
        />
        <mini-statistics-card
          class="bg-gradient-dark p-0"
          :title="{ text: 'Music Volume', color: 'opacity-7 text-white' }"
          :value="{ text: '15/100', color: 'text-white' }"
          :icon="{
            component: 'ni ni-note-03 text-dark',
            background: 'bg-white',
          }"
        />
      </div>
      <div class="col-lg-3 col-md-6">
        <line-chart
          id="chart-widgets"
          title="Income"
          :value="{
            amount: '$130,832',
            percentage: { value: '+90%', color: 'success' },
          }"
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
            datasets: {
              label: 'Income',
              data: [50, 45, 60, 60, 80, 65, 90, 80, 100],
            },
          }"
        />
      </div>
      <div class="col-lg-6">
        <progress-line-chart
          title="Tasks"
          :count="480"
          :progress="60"
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
            data: [40, 45, 42, 41, 40, 43, 40, 42, 39],
          }"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4 col-sm-6">
        <div class="card">
          <div class="card-header p-3 pb-0">
            <h6 class="mb-0">Upcoming events</h6>
            <p class="text-sm mb-0 text-capitalize font-weight-bold">Joined</p>
          </div>
          <div class="card-body border-radius-lg p-3">
            <default-item
              color="info"
              icon="ni ni-money-coins"
              title="Cyber Week"
              description="27 March 2020, at 12:30 PM"
            />
            <default-item
              class="mt-4"
              color="primary"
              icon="ni ni-bell-55"
              title="Meeting with Marry"
              description="24 March 2020, at 10:00 PM"
            />
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-sm-6">
        <div class="row">
          <div class="col-md-6">
            <default-info-card
              :icon="{
                component: 'fas fa-landmark',
                background: 'bg-gradient-success',
              }"
              title="Salary"
              description="Belong Interactive"
              value="+$2000"
            />
          </div>
          <div class="col-md-6">
            <default-info-card
              :icon="{
                component: 'fab fa-paypal',
                background: 'bg-gradient-success',
              }"
              title="Paypal"
              description="Freelance payment"
              value="$455.00"
            />
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <master-card />
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-lg-3 col-md-6">
        <info-card
          title="Full Body"
          description="What matters is the people who are sparked by it. And the people who are liked."
          :badge="{ text: 'Moderate', color: 'success' }"
        />
      </div>
      <div class="col-lg-2 col-md-6">
        <controller-card
          id="switch-on"
          controller-is="On"
          :image="{
            url: bulbIcon,
            alt: 'Bulb Icon',
            label: 'Lights',
          }"
        />
      </div>
      <div class="col-lg-3">
        <line-chart
          id="chart-widgets-4"
          title="Calories"
          :value="{
            amount: '97',
            percentage: { value: '+5%', color: 'success' },
          }"
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
            datasets: {
              label: 'Income',
              data: [50, 45, 60, 60, 80, 65, 90, 80, 100],
            },
          }"
        />
      </div>
      <div class="col-lg-2 col-md-6">
        <mini-info-card
          :icon="{ component: 'ni ni-curved-next', background: 'success' }"
          title="754
        <span class='text-sm text-secondary'>m</span>"
          description="New York City"
        />
      </div>
      <div class="col-lg-2 col-md-6">
        <steps-card
          title="Steps"
          count="11.4K"
          :badge="{ label: '+4.3%', color: 'success' }"
        />
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-lg-5">
        <calendar />
      </div>
      <div class="col-lg-3 mt-0">
        <categories-list
          :categories="[
            {
              icon: {
                component: 'ni ni-mobile-button',
                background: 'dark',
              },
              label: 'Devices',
              description: '250 in stock <strong>346+ sold</strong>',
            },
            {
              icon: {
                component: 'ni ni-tag',
                background: 'dark',
              },
              label: 'Tickets',
              description: '123 closed <strong>15 open</strong>',
            },
            {
              icon: { component: 'ni ni-box-2', background: 'dark' },
              label: 'Error logs',
              description: '1 is active <strong>40 closed</strong>',
            },
            {
              icon: { component: 'ni ni-satisfied', background: 'dark' },
              label: 'Happy Users',
              description: '+ 430',
            },
          ]"
        />
        <mini-player-card
          color="dark"
          :song="{ label: 'Some Kind Of Blues', album: 'Deftones' }"
        />
      </div>
      <div class="col-lg-4">
        <timeline-list
          class="h-100"
          title="Orders overview"
          description="<i class='fa fa-arrow-up text-success' aria-hidden='true'></i>
        <span class='font-weight-bold'>24%</span> this month"
        >
          <timeline-item
            :icon="{ component: 'ni ni-bell-55', color: 'success' }"
            title="$2400, Design changes"
            date-time="22 DEC 7:20 PM"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-html5', color: 'danger' }"
            title="New order #1832412"
            date-time="21 DEC 11 PM"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-cart', color: 'info' }"
            title="Server payments for April"
            date-time="21 DEC 9:34 PM"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-credit-card', color: 'warning' }"
            title="New card added for order #4395133"
            date-time="20 DEC 2:20 AM"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-key-25', color: 'primary' }"
            title="Unlock packages for development"
            date-time="18 DEC 4:54 AM"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-box-2', color: 'dark' }"
            title="Launch the product"
            date-time="21 DEC 09:00 AM"
          />
        </timeline-list>
      </div>
    </div>
  </div>
</template>

<script>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import ProgressLineChart from "@/examples/Charts/ProgressLineChart.vue";
import LineChart from "@/examples/Charts/LineChart.vue";
import DefaultInfoCard from "@/examples/Cards/DefaultInfoCard.vue";
import MasterCard from "@/examples/Cards/MasterCard.vue";
import DefaultItem from "@/examples/Cards/DefaultItem.vue";
import InfoCard from "@/examples/Cards/InfoCard.vue";
import ControllerCard from "./components/ControllerCard.vue";
import MiniInfoCard from "@/examples/Cards/MiniInfoCard.vue";
import StepsCard from "./components/StepsCard.vue";
import Calendar from "@/examples/Calendar.vue";
import CategoriesList from "@/examples/Cards/CategoriesList.vue";
import MiniPlayerCard from "@/examples/Cards/MiniPlayerCard.vue";
import TimelineList from "@/examples/Cards/TimelineList.vue";
import TimelineItem from "@/examples/Cards/TimelineItem.vue";
import bulbIcon from "@/assets/img/small-logos/icon-bulb.svg";

export default {
  name: "Widgets",
  components: {
    MiniStatisticsCard,
    ProgressLineChart,
    DefaultInfoCard,
    MasterCard,
    LineChart,
    DefaultItem,
    InfoCard,
    ControllerCard,
    MiniInfoCard,
    StepsCard,
    Calendar,
    CategoriesList,
    TimelineList,
    TimelineItem,
    MiniPlayerCard,
  },
  data() {
    return {
      bulbIcon,
    };
  },
};
</script>
