<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Today's Money"
              value="$53,000"
              description="<span
                class='text-sm font-weight-bolder text-success'
                >+55%</span> since yesterday"
              :icon="{
                component: 'ni ni-money-coins',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle'
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Today's Users"
              value="2,300"
              description="<span
                class='text-sm font-weight-bolder text-success'
                >+3%</span> since last week"
              :icon="{
                component: 'ni ni-world',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle'
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="New Clients"
              value="+3,462"
              description="<span
                class='text-sm font-weight-bolder text-danger'
                >-2%</span> since last quarter"
              :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-success',
                shape: 'rounded-circle'
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Sales"
              value="$103,430"
              description="<span
                class='text-sm font-weight-bolder text-success'
                >+5%</span> than last month"
              :icon="{
                component: 'ni ni-cart',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle'
              }"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-7 mb-lg">
            <gradient-line-chart
              id="chart-line"
              title="Sales Overview"
              description="<i class='fa fa-arrow-up text-success'></i>
      <span class='font-weight-bold'>4% more</span> in 2021"
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
                  'Dec'
                ],
                datasets: [
                  {
                    label: 'Mobile Apps',
                    data: [50, 40, 300, 220, 500, 250, 400, 230, 500]
                  }
                ]
              }"
            />
          </div>
          <div class="col-lg-5">
            <carousel
              :items="[
                {
                  img: image2,
                  title: 'Get started with Argon',
                  description:
                    'There’s nothing I really wanted to do in life that I wasn’t able to get good at.',
                  icon: {
                    component: 'ni ni-camera-compact text-dark',
                    background: 'bg-white'
                  }
                },
                {
                  img: image1,
                  title: 'Faster way to create web pages',
                  description:
                    'That’s my skill. I’m not really specifically talented at anything except for the ability to learn.',
                  icon: {
                    component: 'ni ni-bulb-61 text-dark',
                    background: 'bg-white'
                  }
                },
                {
                  img: image3,
                  title: 'Share with us your design tips!',
                  description:
                    'Don’t be afraid to be wrong because you can’t learn anything from a compliment.',
                  icon: {
                    component: 'ni ni-trophy text-dark',
                    background: 'bg-white'
                  }
                }
              ]"
            />
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
            <member-card
              :members="[
                {
                  img: team1,
                  profile: { name: 'John Michael', link: 'javascript:;' },
                  badge: { label: 'Online', color: 'success' }
                },
                {
                  img: team2,
                  profile: { name: 'Alex Smith', link: 'javascript:;' },
                  badge: { label: 'In meeting', color: 'danger' }
                },
                {
                  img: team5,
                  profile: { name: 'Samantha Ivy', link: 'javascript:;' },
                  badge: { label: 'Offline', color: 'danger' }
                },
                {
                  img: team4,
                  profile: { name: 'John Michael', link: 'javascript:;' },
                  badge: { label: 'Online', color: 'success' }
                }
              ]"
            />
          </div>
          <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
            <todo-list-card
              :list="[
                {
                  label: 'Call with Dave',
                  dateTime: '09:30 AM',
                  isChecked: true
                },
                {
                  label: 'Brunch Meeting',
                  dateTime: '11:00 AM'
                },
                {
                  label: 'Argon Dashboard Launch',
                  dateTime: '02:00 PM'
                },
                {
                  label: 'Winter Hackaton',
                  dateTime: '10:30 AM',
                  isChecked: true
                }
              ]"
            />
          </div>
          <div class="col-lg-4">
            <progress-track-card
              title="Progress track"
              :list="[
                {
                  brand: { logo: jira, link: 'javascript:;' },
                  label: 'React Material Dashboard',
                  progress: { percentage: 90, color: 'primary' }
                },
                {
                  brand: { logo: asana, link: 'javascript:;' },
                  label: 'Argon Design System',
                  progress: { percentage: 60, color: 'warning' }
                },
                {
                  brand: { logo: spotify, link: 'javascript:;' },
                  label: 'VueJs Now UI Kit PRO',
                  progress: { percentage: 100, color: 'success' }
                },
                {
                  brand: { logo: bootstrap, link: 'javascript:;' },
                  label: 'Soft UI Dashboard',
                  progress: { percentage: 72, color: 'primary' }
                }
              ]"
            />
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-12 col-lg-5">
            <post-card />
          </div>
          <div class="col-12 col-lg-7">
            <project-card
              :headers="['Project', 'Budget', 'Status', 'Completion', '']"
              :items="[
                {
                  brand: { logo: spotify, name: 'Spotify' },
                  badge: { text: 'working', color: 'info' },
                  progress: 60,
                  budget: '$2,500'
                },
                {
                  brand: { logo: invision, name: 'Invision' },
                  badge: { text: 'done', color: 'success' },
                  progress: 100,
                  budget: '$5,000'
                },
                {
                  brand: { logo: jira, name: 'Jira' },
                  badge: { text: 'canceled', color: 'danger' },
                  progress: 30,
                  budget: '$3,400'
                },
                {
                  brand: { logo: slack, name: 'Slack' },
                  badge: { text: 'canceled', color: 'danger' },
                  progress: 0,
                  budget: '$1,000'
                },
                {
                  brand: {
                    logo:
                      'https://demos.creative-tim.com/soft-ui-design-system-pro/assets/img/logos/small-logos/logo-webdev.svg',
                    name: 'Webdev'
                  },
                  badge: { text: 'working', color: 'info' },
                  progress: 80,
                  budget: '$14,000'
                },
                {
                  brand: { logo: adobe, name: 'Adobe XD' },
                  badge: { text: 'done', color: 'success' },
                  progress: 100,
                  budget: '$2,300'
                }
              ]"
            />
            <div class="row mt-4">
              <div class="col-12 col-md-6 mb-4 mb-md-0">
                <credit-card />
              </div>
              <div class="col-12 col-md-6">
                <info-card />
              </div>
            </div>
            <div class="mt-4">
              <div class="card">
                <div class="p-3 pb-0 card-header">
                  <div class="d-flex justify-content-between">
                    <h6 class="mb-2">Sales by Country</h6>
                  </div>
                </div>
                <div class="table-responsive">
                  <table class="table align-items-center">
                    <tbody>
                      <tr
                        v-for="(
                          { flag, country, sale, value, bounce }, index
                        ) in sales"
                        :key="index"
                      >
                        <td class="w-30">
                          <div class="px-2 py-1 d-flex align-items-center">
                            <div>
                              <img :src="flag" alt="Country flag" />
                            </div>
                            <div class="ms-4">
                              <p class="mb-0 text-xs font-weight-bold">
                                Country:
                              </p>
                              <h6 class="mb-0 text-sm">{{ country }}</h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="text-center">
                            <p class="mb-0 text-xs font-weight-bold">Sales:</p>
                            <h6 class="mb-0 text-sm">{{ sale }}</h6>
                          </div>
                        </td>
                        <td>
                          <div class="text-center">
                            <p class="mb-0 text-xs font-weight-bold">Value:</p>
                            <h6 class="mb-0 text-sm">{{ value }}</h6>
                          </div>
                        </td>
                        <td class="text-sm align-middle">
                          <div class="text-center col">
                            <p class="mb-0 text-xs font-weight-bold">Bounce:</p>
                            <h6 class="mb-0 text-sm">{{ bounce }}</h6>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-12 col-md-8 mb-4 mb-md-0">
            <authors-table />
          </div>
          <div class="col-md-4">
            <categories-list
              :categories="[
                {
                  icon: {
                    component: 'ni ni-mobile-button',
                    background: 'dark'
                  },
                  label: 'Devices',
                  description: '250 in stock <strong>346+ sold</strong>'
                },
                {
                  icon: {
                    component: 'ni ni-tag',
                    background: 'dark'
                  },
                  label: 'Tickets',
                  description: '123 closed <strong>15 open</strong>'
                },
                {
                  icon: { component: 'ni ni-box-2', background: 'dark' },
                  label: 'Error logs',
                  description: '1 is active <strong>40 closed</strong>'
                },
                {
                  icon: { component: 'ni ni-satisfied', background: 'dark' },
                  label: 'Happy Users',
                  description: '1 is active <strong>+ 430</strong>'
                }
              ]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MiniStatisticsCard from "../../examples/Cards/MiniStatisticsCard.vue";
import GradientLineChart from "../../examples/Charts/GradientLineChart.vue";
import Carousel from "././components/Carousel.vue";
import MemberCard from "./components/MemberCard.vue";
import TodoListCard from "./components/TodoListCard.vue";
import ProgressTrackCard from "./components/ProgressTrackCard.vue";
import PostCard from "@/examples/Cards/PostCard.vue";
import AuthorsTable from "./components/AuthorsTable.vue";
import CategoriesList from "@/examples/Cards/CategoriesList.vue";
import ProjectCard from "./components/ProjectCard.vue";
import CreditCard from "./components/CreditCard.vue";
import InfoCard from "./components/InfoCard.vue";

import image2 from "../../assets/img/img-2.jpg";
import image1 from "../../assets/img/img-1.jpg";
import image3 from "../../assets/img/img-3.jpg";

import team1 from "../../assets/img/team-1.jpg";
import team2 from "../../assets/img/team-2.jpg";
import team5 from "../../assets/img/team-5.jpg";
import team4 from "../../assets/img/team-4.jpg";

import jira from "../../assets/img/small-logos/logo-jira.svg";
import asana from "../../assets/img/small-logos/logo-asana.svg";
import spotify from "../../assets/img/small-logos/logo-spotify.svg";
import bootstrap from "../../assets/img/small-logos/bootstrap.svg";
import invision from "../../assets/img/small-logos/logo-invision.svg";
import slack from "../../assets/img/small-logos/logo-slack.svg";
import adobe from "../../assets/img/small-logos/logo-xd.svg";

import US from "../../assets/img/icons/flags/US.png";
import DE from "../../assets/img/icons/flags/DE.png";
import GB from "../../assets/img/icons/flags/GB.png";
import BR from "../../assets/img/icons/flags/BR.png";

export default {
  name: "DashboardDefault",
  components: {
    MiniStatisticsCard,
    GradientLineChart,
    Carousel,
    MemberCard,
    TodoListCard,
    ProgressTrackCard,
    PostCard,
    AuthorsTable,
    CategoriesList,
    ProjectCard,
    CreditCard,
    InfoCard
  },
  data() {
    return {
      image2,
      image1,
      image3,
      team1,
      team2,
      team5,
      team4,
      jira,
      asana,
      spotify,
      bootstrap,
      invision,
      slack,
      adobe,
      sales: {
        us: {
          country: "United States",
          sale: 2500,
          value: "$230,900",
          bounce: "29.9%",
          flag: US
        },
        germany: {
          country: "Germany",
          sale: "3.900",
          value: "$440,000",
          bounce: "40.22%",
          flag: DE
        },
        britain: {
          country: "Great Britain",
          sale: "1.400",
          value: "$190,700",
          bounce: "23.44%",
          flag: GB
        },
        brasil: {
          country: "Brasil",
          sale: "562",
          value: "$143,960",
          bounce: "32.14%",
          flag: BR
        }
      }
    };
  }
};
</script>
