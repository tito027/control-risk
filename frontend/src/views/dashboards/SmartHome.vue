<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-xl-7">
        <div class="card">
          <div class="p-3 pb-0 card-header d-flex">
            <h6 class="my-auto">Cameras</h6>
            <div class="nav-wrapper position-relative ms-auto w-50">
              <ul class="p-1 nav nav-pills nav-fill" role="tablist">
                <li class="nav-item">
                  <a
                    class="px-0 py-1 mb-0 nav-link active"
                    data-bs-toggle="tab"
                    href="#cam1"
                    role="tab"
                    aria-controls="cam1"
                    aria-selected="true"
                    >Lounge</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="px-0 py-1 mb-0 nav-link"
                    data-bs-toggle="tab"
                    href="#cam2"
                    role="tab"
                    aria-controls="cam2"
                    aria-selected="false"
                    >Office</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="px-0 py-1 mb-0 nav-link"
                    data-bs-toggle="tab"
                    href="#cam3"
                    role="tab"
                    aria-controls="cam3"
                    aria-selected="false"
                    >Attic</a
                  >
                </li>
              </ul>
            </div>
            <div class="pt-2 dropdown">
              <a
                id="dropdownCam"
                href="#"
                class="text-secondary ps-4"
                :class="{ show: showMenu }"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                @click="showMenu = !showMenu"
              >
                <i class="fas fa-ellipsis-v"></i>
              </a>
              <ul
                class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4"
                :class="{ show: showMenu }"
                aria-labelledby="dropdownCam"
              >
                <li>
                  <a class="dropdown-item border-radius-md" href="#">Pause</a>
                </li>
                <li>
                  <a class="dropdown-item border-radius-md" href="#">Stop</a>
                </li>
                <li>
                  <a class="dropdown-item border-radius-md" href="#"
                    >Schedule</a
                  >
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item border-radius-md text-danger" href="#"
                    >Remove</a
                  >
                </li>
              </ul>
            </div>
          </div>
          <div class="p-3 mt-2 card-body">
            <div id="v-pills-tabContent" class="tab-content">
              <div
                id="cam1"
                class="tab-pane fade show position-relative active height-400 border-radius-lg"
                role="tabpanel"
                aria-labelledby="cam1"
                style="
                  background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/smart-home-1.jpg');
                  background-size: cover;
                "
              >
                <div class="top-0 position-absolute d-flex w-100">
                  <p class="p-3 mb-0 text-white">17.05.2021 4:34PM</p>
                  <div class="p-3 ms-auto">
                    <span class="badge badge-secondary">
                      <i class="fas fa-dot-circle text-danger"></i>
                      Recording
                    </span>
                  </div>
                </div>
              </div>
              <div
                id="cam2"
                class="tab-pane fade position-relative height-400 border-radius-lg"
                role="tabpanel"
                aria-labelledby="cam2"
                style="
                  background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/smart-home-2.jpg');
                  background-size: cover;
                "
              >
                <div class="top-0 position-absolute d-flex w-100">
                  <p class="p-3 mb-0 text-white">17.05.2021 4:35PM</p>
                  <div class="p-3 ms-auto">
                    <span class="badge badge-secondary">
                      <i class="fas fa-dot-circle text-danger"></i>
                      Recording
                    </span>
                  </div>
                </div>
              </div>
              <div
                id="cam3"
                class="tab-pane fade position-relative height-400 border-radius-lg"
                role="tabpanel"
                aria-labelledby="cam3"
                style="
                  background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/smart-home-3.jpg');
                  background-size: cover;
                "
              >
                <div class="top-0 position-absolute d-flex w-100">
                  <p class="p-3 mb-0 text-white">17.05.2021 4:57PM</p>
                  <div class="p-3 ms-auto">
                    <span class="badge badge-secondary">
                      <i class="fas fa-dot-circle text-danger"></i>
                      Recording
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 col-xl-5 ms-auto mt-xl-0">
        <div class="row">
          <div class="col-12">
            <weather-card />
          </div>
        </div>
        <div class="mt-4 row">
          <div class="col-md-6">
            <default-counter-card
              id="status1"
              :count="21"
              suffix=" °C"
              title="Living Room"
              description="Temperature"
            />
          </div>
          <div class="mt-4 col-md-6 mt-md-0">
            <default-counter-card
              id="status2"
              :count="44"
              suffix=" %"
              title="Outside"
              description="Humidity"
            />
          </div>
        </div>
        <div class="mt-4 row">
          <div class="col-md-6">
            <default-counter-card
              id="status3"
              :count="87"
              suffix=" m³"
              title="Water"
              description="Consumption"
            />
          </div>
          <div class="mt-4 col-md-6 mt-md-0">
            <default-counter-card
              id="status4"
              :count="417"
              suffix=" GB"
              title="Internet"
              description="All devices"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4 row">
      <div class="col-lg-6 ms-auto">
        <reports-doughnut-chart
          title="Consumption per room"
          tooltip="See the consumption per room"
          :count="{ number: 471.3, text: 'WATTS' }"
          :chart="{
            labels: ['Living Room', 'Kitchen', 'Attic', 'Garage', 'Basement'],
            datasets: {
              label: 'Consumption',
              data: [15, 20, 13, 32, 20],
            },
          }"
        />
      </div>
      <div class="mt-4 col-lg-6 mt-lg-0">
        <div class="row">
          <div class="col-sm-6">
            <thin-bar-chart
              title="Consumption per day"
              :chart="{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: {
                  label: 'Watts',
                  data: [150, 230, 380, 220, 420, 200, 70, 500],
                },
              }"
            />
          </div>
          <div class="mt-4 col-sm-6 mt-sm-0">
            <div class="card h-100">
              <div class="card-body text-center p-3">
                <h6 class="text-start">Device limit</h6>
                <round-slider
                  value="21"
                  valuelabel="Temperature"
                ></round-slider>
                <h4 class="font-weight-bold">
                  <span id="value" class="text-dark">21</span>
                  <span class="text-body">°C</span>
                </h4>
                <p class="ps-1 mt-5 mb-0">
                  <span class="text-xs">16°C</span>
                  <span class="px-3">Temperature</span>
                  <span class="text-xs">38°C</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr class="my-5 horizontal dark" />
    <div class="row">
      <div class="col-lg-2 col-sm-6">
        <controller-card
          :item="{
            state: 'Off',
            label: { text: 'Humidity', class: 'mt-4' },
            description: 'Inactive since: 2 days',
          }"
        >
          <humidity />
        </controller-card>
      </div>
      <div class="mt-4 col-lg-2 col-sm-6 mt-lg-0">
        <controller-card
          class="text-white bg-gradient-success"
          :item="{
            state: 'On',
            label: { text: 'Temperature', class: 'mt-2' },
            description: 'Active',
            isChecked: true,
          }"
        >
          <temperature />
        </controller-card>
      </div>
      <div class="mt-4 col-lg-2 col-sm-6 mt-lg-0">
        <controller-card
          :item="{
            state: 'Off',
            label: { text: 'Air Conditioner', class: 'mt-4' },
            description: 'Inactive since: 1 hour',
          }"
        >
          <air />
        </controller-card>
      </div>
      <div class="mt-4 col-lg-2 col-sm-6 mt-lg-0">
        <controller-card
          :item="{
            state: 'Off',
            label: { text: 'Lights', class: 'mt-4' },
            description: 'Inactive since: 27 min',
          }"
        >
          <lights />
        </controller-card>
      </div>
      <div class="mt-4 col-lg-2 col-sm-6 mt-lg-0">
        <controller-card
          class="text-white bg-gradient-success"
          :item="{
            state: 'On',
            label: { text: 'Wi-fi', class: 'mt-4' },
            description: 'Active',
            isChecked: true,
          }"
        >
          <wifi />
        </controller-card>
      </div>
      <div class="mt-4 col-lg-2 col-sm-6 mt-sm-0">
        <placeholder-card :title="{ text: 'New Device', variant: 'h5' }" />
      </div>
    </div>
  </div>
</template>

<script>
import ReportsDoughnutChart from "@/examples/Charts/ReportsDoughnutChart.vue";
import ThinBarChart from "@/examples/Charts/ThinBarChart.vue";
import DefaultCounterCard from "@/examples/Cards/DefaultCounterCard.vue";
import PlaceholderCard from "@/examples/Cards/PlaceholderCard.vue";
import ControllerCard from "@/examples/Cards/ControllerCard.vue";
import WeatherCard from "./components/WeatherCard.vue";
import Humidity from "@/components/Icons/Humidity.vue";
import Temperature from "@/components/Icons/Temperature.vue";
import Air from "../../components/Icons/Air.vue";
import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import Lights from "../../components/Icons/Lights.vue";
import Wifi from "../../components/Icons/Wifi.vue";

export default {
  name: "SmartHome",
  components: {
    DefaultCounterCard,
    ReportsDoughnutChart,
    ThinBarChart,
    PlaceholderCard,
    ControllerCard,
    WeatherCard,
    Humidity,
    Temperature,
    Air,
    Lights,
    Wifi,
  },
  data() {
    return {
      showMenu: false,
    };
  },

  mounted() {
    setNavPills();
    setTooltip(this.$store.state.bootstrap);
    // Rounded slider
    const setValue = function (value, active) {
      document.querySelectorAll("round-slider").forEach(function (el) {
        if (el.value === undefined) return;
        el.value = value;
      });
      const span = document.querySelector("#value");
      span.innerHTML = value;
      if (active) span.style.color = "red";
      else span.style.color = "black";
    };

    document.querySelectorAll("round-slider").forEach(function (el) {
      el.addEventListener("value-changed", function (ev) {
        if (ev.detail.value !== undefined) setValue(ev.detail.value, false);
        // eslint-disable-next-line no-undef
        else if (ev.detail.low !== undefined) setLow(ev.detail.low, false);
        // eslint-disable-next-line no-undef
        else if (ev.detail.high !== undefined) setHigh(ev.detail.high, false);
      });

      el.addEventListener("value-changing", function (ev) {
        if (ev.detail.value !== undefined) setValue(ev.detail.value, true);
        // eslint-disable-next-line no-undef
        else if (ev.detail.low !== undefined) setLow(ev.detail.low, true);
        // eslint-disable-next-line no-undef
        else if (ev.detail.high !== undefined) setHigh(ev.detail.high, true);
      });
    });
  },
};
</script>
