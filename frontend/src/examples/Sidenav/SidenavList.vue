<script lang="ts" setup>
import SidenavItem from "./SidenavItem.vue"
import SidenavCollapse from "./SidenavCollapse.vue"
import SidenavCard from "./SidenavCard.vue"
import SidenavCollapseItem from "./SidenavCollapseItem.vue"
import { useRoute } from "vue-router"
import { GuardGroupsRoles, GuardRoles } from "@/types/router"
import { AuthModule } from "@/store/modules/Auth"
import { computed } from "vue"

const route = useRoute()
const role = computed(() => AuthModule.user?.role)
function getRoute() {
  const root = route.path.split("/")
  return root[1]
}
</script>
<template>
  <div
    id="sidenav-collapse-main"
    class="collapse navbar-collapse w-auto w-100 h-auto h-100"
  >
    <ul class="navbar-nav">
      <!--       <li class="nav-item">
        <sidenav-collapse
          collapse-ref="dashboardsExamples"
          nav-text="Dashboards"
          :class="getRoute() === 'dashboards' ? 'active' : ''"
        >
          <template #icon>
            <i class="ni ni-shop text-primary text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4"> -->
      <!-- nav links -->
      <!--<sidenav-item
                :to="{ name: 'Landing' }"
                mini-icon="L"
                text="Landing"
              />
                             <sidenav-item :to="{ name: 'Default' }" mini-icon="D" text="Default" />
              <sidenav-item :to="{ name: 'Automotive' }" mini-icon="A" text="Automotive" />
              <sidenav-item :to="{ name: 'Smart Home' }" mini-icon="S" text="Smart Home" />
              <sidenav-collapse-item refer="vrExamples" mini-icon="V" text="Virtual Reality">
                <template #nav-child-item>
                  <sidenav-item :to="{ name: 'VR Default' }" mini-icon="V" text="VR Default" />
                  <sidenav-item :to="{ name: 'VR Info' }" mini-icon="V" text="VR Info" />
                </template>
              </sidenav-collapse-item>
              <sidenav-item :to="{ name: 'CRM' }" mini-icon="C" text="CRM" /> -->
      <!--             </ul>
          </template>
        </sidenav-collapse>
      </li> -->
      <li class="mt-3 nav-item">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6 ms-2"
        >
          PAGES
        </h6>
      </li>
      <!--       <li class="nav-item">
        <sidenav-item class="ps-2" :to="{ name: 'QR' }" mini-icon="G" text="QR">
        </sidenav-item>
      </li> -->
      <li class="nav-item" v-if="role?.name !== 'securityAgent'">
        <sidenav-collapse
          collapse-ref="checkinout"
          nav-text="Check-in / Check-out"
          :class="getRoute() === 'pages' ? 'active' : ''"
        >
          <template #icon>
            <i class="ni ni-ungroup text-warning text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <!-- nav links -->
              <!-- <sidenav-collapse-item
                refer="profileExample"
                mini-icon="P"
                text="Profile"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Default' }"
                    mini-icon="P"
                    text="Profile Overview"
                  />
                  <sidenav-item
                    :to="{ name: 'Default' }"
                    mini-icon="T"
                    text="Teams"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="usersExample"
                mini-icon="U"
                text="Users"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'ChekIn' }"
                    mini-icon="R"
                    text="Reports"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="accountExample"
                mini-icon="A"
                text="Account"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Confirm' }"
                    mini-icon="S"
                    text="Settings"
                  />
                  <sidenav-item
                    :to="{ name: 'Agents' }"
                    mini-icon="B"
                    text="Billing"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="projectsExample"
                mini-icon="P"
                text="Projects"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'AgentsCreate' }"
                    mini-icon="G"
                    text="General"
                  />
                  <sidenav-item
                    :to="{ name: 'Login' }"
                    mini-icon="T"
                    text="Timeline"
                  />
                </template>
              </sidenav-collapse-item> -->

              <sidenav-item
                :to="{ name: 'CheckInOutHistory' }"
                mini-icon="H"
                text="Historial"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      <li class="nav-item" v-if="role?.name !== 'securityAgent'">
        <sidenav-collapse
          collapse-ref="payroll"
          nav-text="Nomina"
          :class="getRoute() === 'applications' ? 'active' : ''"
        >
          <template #icon>
            <i class="ni ni-money-coins text-success text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'PayrollTable' }"
                mini-icon="D"
                text="Planilla activa"
                :guard="[
                  GuardRoles.ADMIN,
                  ...GuardGroupsRoles.RRHH_GROUP,
                  ...GuardGroupsRoles.MANAGER_GROUP,
                ]"
              />
              <sidenav-collapse-item refer="Types" mini-icon="P" text="Tipos">
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'PayrollGratificationsTable' }"
                    mini-icon="D"
                    text="Tipos de gratificantes"
                    :guard="[
                      ...GuardGroupsRoles.RRHH_GROUP,
                      GuardRoles.ADMIN,
                      GuardRoles.RRHH,
                    ]"
                  />
                  <sidenav-item
                    :to="{ name: 'PayrollDiscountsTable' }"
                    mini-icon="D"
                    text="Tipos de descuentos"
                    :guard="[...GuardGroupsRoles.RRHH_GROUP, GuardRoles.ADMIN]"
                  />
                </template>
              </sidenav-collapse-item>
              <sidenav-collapse-item
                refer="Pending"
                mini-icon="P"
                text="Pendientes"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'PayrollDiscountPendingAdminTable' }"
                    mini-icon="D"
                    text="Descuentos pendientes"
                    :guard="[
                      GuardRoles.ADMIN,
                      GuardRoles.ASSISTANT_RRHH,
                      GuardRoles.MANAGER_RRHH,
                    ]"
                  />
                  <sidenav-item
                    :to="{ name: 'PayrollGratificationPendingAdminTable' }"
                    mini-icon="D"
                    text="Gratificantes pendientes"
                    :guard="[
                      GuardRoles.ADMIN,
                      GuardRoles.ASSISTANT_RRHH,
                      GuardRoles.MANAGER_RRHH,
                    ]"
                  />
                </template>
              </sidenav-collapse-item>
              <sidenav-item
                :to="{ name: 'PayrollDiscountPendingTable' }"
                mini-icon="D"
                text="Descuentos"
                :guard="[GuardRoles.SUPERVISOR, GuardRoles.ADMIN]"
              />
              <sidenav-item
                :to="{ name: 'PayrollGratificationPendingTable' }"
                mini-icon="D"
                text="Gratificantes"
                :guard="[GuardRoles.SUPERVISOR, GuardRoles.ADMIN]"
              />
              <sidenav-collapse-item
                refer="Scheduled"
                mini-icon="P"
                text="Recurrentes"
                :guard="[...GuardGroupsRoles.RRHH_GROUP]"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'PayrollScheduledDiscountsTable' }"
                    mini-icon="D"
                    text="Descuentos recurrentes"
                    :guard="[
                      GuardRoles.ASSISTANT_RRHH,
                      GuardRoles.MANAGER_RRHH,
                      GuardRoles.ADMIN,
                    ]"
                  />
                  <sidenav-item
                    :to="{ name: 'PayrollScheduledGratificationsTable' }"
                    mini-icon="D"
                    text="Gratificantes recurrentes"
                    :guard="[
                      GuardRoles.ASSISTANT_RRHH,
                      GuardRoles.MANAGER_RRHH,
                      GuardRoles.ADMIN,
                    ]"
                  />
                </template>
              </sidenav-collapse-item>
              <sidenav-item
                :to="{ name: 'PayrollHistoryTable' }"
                mini-icon="D"
                text="Historial de planillas"
                :guard="[
                  ...GuardGroupsRoles.RRHH_GROUP,
                  GuardRoles.ADMIN,
                  GuardRoles.OP_COORDINATOR,
                ]"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      <li class="nav-item" v-if="role?.name !== 'securityAgent'">
        <sidenav-collapse
          HEAD
          collapse-ref="payroll"
          nav-text="Horarios"
          :class="getRoute() === 'applications' ? 'active' : ''"
        >
          <template #icon>
            <i class="fa fa-clock-o text-success text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'WorkshiftTable' }"
                mini-icon="D"
                text="Horario"
                :guard="[
                  ...GuardGroupsRoles.MANAGER_GROUP,
                  ...GuardGroupsRoles.RRHH_GROUP,
                  GuardRoles.LOGISTIC_ASSISTANT,
                  GuardRoles.GROUP_BOSS,
                  GuardRoles.ASSISTANT_SUPERVISOR,
                  GuardRoles.VSA_ANALIST,
                  GuardRoles.VSA_COORDINATOR,
                  GuardRoles.ADMINISTRATIVE_ASSISTANT,
                  GuardRoles.ADMIN,
                ]"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="portal"
          nav-text="Portal de empleados"
          :class="getRoute() === 'applications' ? 'active' : ''"
        >
          <template #icon>
            <i class="ni ni-circle-08 text-info text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'HolidayTable' }"
                mini-icon="D"
                text="Solicitudes"
                :guard="[
                  GuardRoles.SUPERVISOR,
                  GuardRoles.PREVENTION_AGENT,
                  GuardRoles.SECURITY_AGENT,
                  GuardRoles.RRHH,
                  GuardRoles.ADMIN,
                ]"
              />
            </ul>

            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'ComplaintTable' }"
                mini-icon="D"
                text="Buzon"
                :guard="[
                  ...GuardGroupsRoles.MANAGER_GROUP,
                  GuardRoles.ADMIN,
                  GuardRoles.ASSISTANT_SUPERVISOR,
                  GuardRoles.GROUP_BOSS,
                  GuardRoles.RRHH,
                  GuardRoles.SUPERVISOR,
                  GuardRoles.LOGISTIC_ASSISTANT,
                  GuardRoles.OP_ASSISTANT,
                  GuardRoles.PREVENTION_AGENT,
                  GuardRoles.RECEPTION,
                  GuardRoles.SECURITY_AGENT,
                  GuardRoles.SYSTEM,
                ]"
              />
            </ul>

            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'NewsTable' }"
                mini-icon="D"
                text="Novedades"
                :guard="[
                  GuardRoles.SUPERVISOR,
                  GuardRoles.PREVENTION_AGENT,
                  GuardRoles.SECURITY_AGENT,
                  GuardRoles.OP_MANAGER,
                  GuardRoles.ADMIN,
                ]"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="portal"
          nav-text="Compras y Logistica"
          :class="getRoute() === 'applications' ? 'active' : ''"
        >
          <template #icon>
            <i class="fas fa-book-open text-warning text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'InventoryGeneralTable' }"
                mini-icon="D"
                text="General"
                :guard="[GuardRoles.SUPERVISOR, GuardRoles.ADMIN]"
              />
              <sidenav-item
                :to="{ name: 'InventoryAmmoTable' }"
                mini-icon="D"
                text="Municiones"
                :guard="[GuardRoles.SUPERVISOR, GuardRoles.ADMIN]"
              />
              <sidenav-item
                :to="{ name: 'InventoryFleetTable' }"
                mini-icon="D"
                text="Flota"
                :guard="[GuardRoles.SUPERVISOR, GuardRoles.ADMIN]"
              />
              <sidenav-item
                :to="{ name: 'InventoryPersonalTable' }"
                mini-icon="D"
                text="Mi inventario"
                :guard="[
                  GuardRoles.SUPERVISOR,
                  GuardRoles.ADMIN,
                  GuardRoles.SECURITY_AGENT,
                ]"
              />

              <sidenav-item
                :to="{ name: 'InventoryAgency' }"
                mini-icon="D"
                text="Inventario por agencia"
                :guard="[GuardRoles.SUPERVISOR, GuardRoles.ADMIN]"
              />
              <sidenav-item
                :to="{ name: 'InventoryStore' }"
                mini-icon="D"
                text="Inventario por bodega"
                :guard="[GuardRoles.SUPERVISOR, GuardRoles.ADMIN]"
              />
              <sidenav-item
                :to="{ name: 'InventoryUniformsTable' }"
                mini-icon="D"
                text="Uniformes"
                :guard="[GuardRoles.SUPERVISOR, GuardRoles.ADMIN]"
              />
              <sidenav-item
                :to="{ name: 'InventoryWeaponsTable' }"
                mini-icon="D"
                text="Armas"
                :guard="[GuardRoles.SUPERVISOR, GuardRoles.ADMIN]"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      <li class="nav-item" v-if="role?.name !== 'securityAgent'">
        <sidenav-collapse
          collapse-ref="portal"
          nav-text="Reportes"
          :class="getRoute() === 'applications' ? 'active' : ''"
        >
          <template #icon>
            <i
              class="fas far fa fa-calendar-check-o text-dark text-smc opacity-10"
            ></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'ReportTable' }"
                mini-icon="D"
                text="Reportes de usuarios"
                :guard="[
                  GuardRoles.SUPERVISOR,
                  GuardRoles.PREVENTION_AGENT,
                  GuardRoles.SECURITY_AGENT,
                  GuardRoles.OP_MANAGER,
                  GuardRoles.ADMIN,
                ]"
              />
            </ul>

            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'ReportTableNews' }"
                mini-icon="D"
                text="Reportes de novedades"
                :guard="[
                  GuardRoles.SUPERVISOR,
                  GuardRoles.PREVENTION_AGENT,
                  GuardRoles.SECURITY_AGENT,
                  GuardRoles.OP_MANAGER,
                  GuardRoles.ADMIN,
                ]"
              />
            </ul>

            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'ReportTableHolidays' }"
                mini-icon="D"
                text="Reportes de vacaciones"
                :guard="[
                  GuardRoles.SUPERVISOR,
                  GuardRoles.PREVENTION_AGENT,
                  GuardRoles.SECURITY_AGENT,
                  GuardRoles.OP_MANAGER,
                  GuardRoles.ADMIN,
                ]"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      <li class="nav-item" v-if="role?.name !== 'securityAgent'">
        <sidenav-collapse
          collapse-ref="agents"
          nav-text="Agentes"
          :class="getRoute() === 'applications' ? 'active' : ''"
        >
          <template #icon>
            <i class="ni ni-user-run text-info text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'Agents' }"
                mini-icon="L"
                text="Listado"
              />
              <sidenav-item
                :to="{ name: 'AgentNew' }"
                mini-icon="A"
                text="Agregar"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      <li class="nav-item" v-if="role?.name !== 'securityAgent'">
        <sidenav-collapse
          collapse-ref="business"
          nav-text="Empresas"
          :class="getRoute() === 'applications' ? 'active' : ''"
        >
          <template #icon>
            <i class="fa fa-building text-info text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'Business' }"
                mini-icon="L"
                text="Listado"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" v-if="role?.name !== 'securityAgent'">
        <sidenav-collapse
          collapse-ref="agencies"
          nav-text="Agencias"
          :class="getRoute() === 'applications' ? 'active' : ''"
        >
          <template #icon>
            <i class="fa fa-city text-info text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'Agencies' }"
                mini-icon="L"
                text="Listado"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" v-if="role?.name !== 'securityAgent'">
        <sidenav-collapse
          collapse-ref="physicalPositions"
          nav-text="Posiciones Fisicas"
          :class="getRoute() === 'applications' ? 'active' : ''"
        >
          <template #icon>
            <i class="fa fa-location-arrow text-info text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'PhysicalPositions' }"
                mini-icon="L"
                text="Listado"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" v-if="role?.name !== 'securityAgent'">
        <sidenav-collapse
          collapse-ref="Test"
          nav-text="Pruebas"
          :class="getRoute() === 'applications' ? 'active' : ''"
        >
          <template #icon>
            <i class="fa fa-head-side-virus text-danger text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'Psychological' }"
                mini-icon="P"
                text="Psicológico"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" v-if="role?.name !== 'securityAgent'">
        <sidenav-collapse
          collapse-ref="Configuraciones"
          nav-text="Configuraciones"
          :class="getRoute() === 'config' ? 'active' : ''"
        >
          <template #icon>
            <i class="fas fa-cog text-success text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <!-- nav links -->
              <sidenav-item
                :to="{ name: 'Salary' }"
                mini-icon="S"
                text="Salario"
              />

              <sidenav-collapse-item
                refer="productsExample"
                mini-icon="P"
                text="Products"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Agents' }"
                    mini-icon="N"
                    text="New Product"
                  />
                  <sidenav-item
                    :to="{ name: 'AgentNew' }"
                    mini-icon="E"
                    text="Edit Product"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="ordersExample"
                mini-icon="O"
                text="Orders"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Agents' }"
                    mini-icon="O"
                    text="Order List"
                  />
                  <sidenav-item
                    :to="{ name: 'AgentNew' }"
                    mini-icon="O"
                    text="Order Details"
                  />
                </template>
              </sidenav-collapse-item>
              <sidenav-item
                :to="{ name: 'Agents' }"
                mini-icon="R"
                text="Referral"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      <!--       <li class="nav-item">
        <sidenav-collapse
          collapse-ref="authExamples"
          nav-text="Authentication"
          :class="getRoute() === 'authentication' ? 'active' : ''"
        >
          <template #icon>
            <i class="ni ni-single-copy-04 text-danger text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              \<\!-- nav links \-\-\>
              <sidenav-collapse-item
                refer="signinExample"
                mini-icon="S"
                text="Sign In"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'CheckInOutHistory' }"
                    mini-icon="B"
                    text="Basic"
                  />
                  <sidenav-item
                    :to="{ name: 'Agents' }"
                    mini-icon="C"
                    text="Cover"
                  />
                  <sidenav-item
                    :to="{ name: 'AgentNew' }"
                    mini-icon="I"
                    text="Illustration"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="signupExample"
                mini-icon="S"
                text="Sign Up"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Login' }"
                    mini-icon="B"
                    text="Basic"
                  />
                  <sidenav-item
                    :to="{ name: 'CheckInOutHistory' }"
                    mini-icon="C"
                    text="Cover"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="resetExample"
                mini-icon="R"
                text="Reset Password"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Agents' }"
                    mini-icon="B"
                    text="Basic"
                  />
                  <sidenav-item
                    :to="{ name: 'AgentNew' }"
                    mini-icon="C"
                    text="Cover"
                  />
                </template>
              </sidenav-collapse-item>
            </ul>
          </template>
        </sidenav-collapse>
      </li> -->
      <!-- <li class="mt-3 nav-item">
        <hr class="mt-0 horizontal dark" />
        <h6
          class="text-xs ps-4 ms-2 text-uppercase font-weight-bolder opacity-6 ms-2"
        >
          DOCS
        </h6>
      </li> -->
    </ul>
  </div>
  <div class="mt-3 sidenav-footer">
    <!-- <sidenav-card
      :card="{
        title: 'Need Help?',
        description: 'Please check our docs',
        links: [
          {
            label: 'Documentation',
            route:
              'https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/',
            color: 'dark',
          },
          {
            label: 'Buy now',
            route:
              'https://www.creative-tim.com/product/vue-argon-dashboard-pro?ref=vadp',
            color: 'success',
          },
        ],
      }"
    /> -->
  </div>
</template>
