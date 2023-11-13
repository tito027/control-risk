import { AuthModule } from "@/store/modules/Auth"
import {
  GuardGroupsRoles,
  GuardRoles,
  IRouteLocationNormalized,
  IRouteRecordRaw,
} from "@/types/router"
import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteRecordRaw,
} from "vue-router"
const CheckIn = () => import("../views/auth/signin/CheckIn.vue")
const HistoryCheckInOut = () =>
  import("../views/dashboards/checkin-checkout/Main.vue")
const AgentsOverview = () => import("../views/dashboards/agents/Overview.vue")
const BusinessOverview = () =>
  import("../views/dashboards/business/Overview.vue")
const AgencyOverview = () => import("../views/dashboards/agencies/Overview.vue")
const Default = () => import("../views/dashboards/Default.vue")
const Confirm = () => import("../views/auth/signin/Confirm.vue")
const Illustration = () => import("../views/auth/signin/Illustration.vue")
const DashboardLayout = () => import("../views/pages/DashboardLayout.vue")
const NewUser = () => import("../views/pages/Users/NewUser.vue")
const AgentList = () => import("../views/dashboards/agents/List.vue")
const BusinessList = () =>
  import("../views/dashboards/business/BusinessTable.vue")
const AgenciesList = () =>
  import("../views/dashboards/business/AgencyTable.vue")
const PhysicalPositionList = () =>
  import("../views/dashboards/business/PhysicalPositionTable.vue")
const PsychicList = () =>
  import("../views/dashboards/psychological/PsychoTable.vue")
const Salary = () => import("../views/dashboards/configs/Salary.vue")

const Error404 = () => import("../views/auth/error/Error404.vue")
const Error500 = () => import("../views/auth/error/Error500.vue")
const WorkshiftTable = () =>
  import("../views/dashboards/workshifts/workshiftTable.vue")
const PayrollTable = () =>
  import("../views/dashboards/payroll/PayrollTable.vue")
const HolidayAdminTable = () =>
  import("../views/dashboards/holiday/HolidayAdminTable.vue")
const ComplaintAdminTable = () =>
  import("../views/dashboards/complaint/ComplaintTable.vue")
const HolidayTable = () =>
  import("../views/dashboards/holiday/HolidayTable.vue")
const NewsTable = () => import("../views/dashboards/news/NewsTable.vue")
const InventoryAmmoTable = () =>
  import("../views/dashboards/inventory/InventoryAmmoTable.vue")
const InventoryFleetTable = () =>
  import("../views/dashboards/inventory/InventoryFleetTable.vue")
const InventoryPersonalTable = () =>
  import("../views/dashboards/inventory/InventoryPersonalTable.vue")
const InventoryAgency = () =>
  import("../views/dashboards/inventory/InventoryAgency.vue")
const InventoryStore = () =>
  import("../views/dashboards/inventory/InventoryStore.vue")
const InventoryGeneralTable = () =>
  import("../views/dashboards/inventory/InventoryTable.vue")
const InventoryUniformsTable = () =>
  import("../views/dashboards/inventory/InventoryUniformsTable.vue")
const InventoryWeaponsTable = () =>
  import("../views/dashboards/inventory/InventoryWeaponsTable.vue")
const ReportTable = () => import("../views/dashboards/report/ReportTable.vue")
const ReportTableHolidays = () =>
  import("../views/dashboards/report/ReportTableHolidays.vue")
const ReportTableNews = () =>
  import("../views/dashboards/report/ReportTableNews.vue")
const PayrollGratificationsTable = () =>
  import("../views/dashboards/payroll/PayrollGratificationsTable.vue")
const PayrollDiscountsTable = () =>
  import("../views/dashboards/payroll/PayrollDiscountsTable.vue")
const PayrollScheduledDiscountsTable = () =>
  import("../views/dashboards/payroll/PayrollScheduledDiscountsTable.vue")
const PayrollScheduledGratificationsTable = () =>
  import("../views/dashboards/payroll/PayrollScheduledGratificationsTable.vue")
const PayrollHistoryTable = () =>
  import("../views/dashboards/payroll/PayrollHistoryTable.vue")
const PayrollGratificationPendingAdminTable = () =>
  import(
    "../views/dashboards/payroll/PayrollGratificationPendingAdminTable.vue"
  )
const PayrollDiscountPendingAdminTable = () =>
  import("../views/dashboards/payroll/PayrollDiscountPendingAdminTable.vue")
const PayrollDiscountPendingTable = () =>
  import("../views/dashboards/payroll/PayrollDiscountPendingTable.vue")
const PayrollGratificationPendingTable = () =>
  import("../views/dashboards/payroll/PayrollGratificationPendingTable.vue")
const ContactTable = () =>
  import("../views/dashboards/business/ContactTable.vue")
const QR = () => import("../views/QR.vue")
const routes: Array<
  Exclude<RouteRecordRaw, "children"> & {
    children?: IRouteRecordRaw[]
  }
> = [
  {
    path: "/",
    name: "/",
    redirect: "/authentication/login",
  },
  {
    path: "/QR",
    name: "QR",
    component: QR,
  },
  {
    path: "/dashboards/dashboard-default",
    name: "Default",
    component: Default,
    meta: {
      guard: [GuardRoles.ANY],
    },
  },
  {
    path: "/dashboards/landing",
    name: "Landing",
    component: Default,
    meta: {
      guard: [GuardRoles.ANY],
    },
  },

  {
    path: "/authentication/checkin",
    name: "ChekIn",
    component: CheckIn,
    meta: {
      guard: [GuardRoles.GUEST],
    },
  },
  {
    path: "/admin",
    name: "Dashboard",
    component: DashboardLayout,
    redirect: "/admin/checkinout/history",
    children: [
      {
        path: "/admin/checkinout/history",
        name: "CheckInOutHistory",
        component: HistoryCheckInOut,
      },
      {
        path: "/admin/workshifts/workdays/table",
        name: "WorkshiftTable",
        component: WorkshiftTable,
        meta: {
          guard: [
            GuardRoles.ADMIN,
            GuardRoles.SUPERVISOR,
            GuardRoles.LOGISTIC_ASSISTANT,
            GuardRoles.GROUP_BOSS,
            GuardRoles.ASSISTANT_SUPERVISOR,
            GuardRoles.VSA_ANALIST,
            GuardRoles.VSA_COORDINATOR,
            GuardRoles.ADMINISTRATIVE_ASSISTANT,
            GuardRoles.RRHH,
            GuardRoles.RECRUITER_RRHH,
            GuardRoles.INDUCTION_RRHH,
            GuardRoles.ASSISTANT_RRHH,
            GuardRoles.MANAGER_RRHH,
            GuardRoles.ARCHIVE_RRHH,
            GuardRoles.OP_MANAGER,
            GuardRoles.REP_FINANCIAL,
            GuardRoles.REP_LEGAL,
            GuardRoles.COS,
            GuardRoles.OP_COORDINATOR,
          ],
        },
      },
      {
        path: "/admin/payrolls/table/",
        name: "PayrollTable",
        component: PayrollTable,
        meta: {
          guard: [
            GuardRoles.ADMIN,
            GuardRoles.RRHH,
            GuardRoles.OP_MANAGER,
            GuardRoles.MANAGER_RRHH,
            GuardRoles.REP_FINANCIAL,
            GuardRoles.REP_LEGAL,
            GuardRoles.COS,
          ],
        },
      },
      {
        path: "/admin/complaint/table/",
        name: "ComplaintTable",
        component: ComplaintAdminTable,
        meta: {
          guard: [
            GuardRoles.OP_MANAGER,
            GuardRoles.SUPERVISOR,
            GuardRoles.PREVENTION_AGENT,
            GuardRoles.SECURITY_AGENT,
            GuardRoles.ADMIN,
          ],
        },
      },
      {
        path: "/admin/news/table/",
        name: "NewsTable",
        component: NewsTable,
        meta: {
          guard: [
            GuardRoles.OP_MANAGER,
            GuardRoles.SUPERVISOR,
            GuardRoles.PREVENTION_AGENT,
            GuardRoles.SECURITY_AGENT,
            GuardRoles.ADMIN,
          ],
        },
      },
      {
        path: "/admin/inventory/table/ammo",
        name: "InventoryAmmoTable",
        component: InventoryAmmoTable,
        meta: {
          guard: [
            GuardRoles.OP_MANAGER,
            GuardRoles.SUPERVISOR,
            GuardRoles.PREVENTION_AGENT,
            GuardRoles.SECURITY_AGENT,
            GuardRoles.ADMIN,
          ],
        },
      },
      {
        path: "/admin/inventory/table/fleet",
        name: "InventoryFleetTable",
        component: InventoryFleetTable,
        meta: {
          guard: [
            GuardRoles.OP_MANAGER,
            GuardRoles.SUPERVISOR,
            GuardRoles.PREVENTION_AGENT,
            GuardRoles.SECURITY_AGENT,
            GuardRoles.ADMIN,
          ],
        },
      },
      {
        path: "/admin/inventory/table/personal",
        name: "InventoryPersonalTable",
        component: InventoryPersonalTable,
        meta: {
          guard: [
            GuardRoles.OP_MANAGER,
            GuardRoles.SUPERVISOR,
            GuardRoles.PREVENTION_AGENT,
            GuardRoles.SECURITY_AGENT,
            GuardRoles.ADMIN,
          ],
        },
      },
      {
        path: "/admin/inventory/table/agency",
        name: "InventoryAgency",
        component: InventoryAgency,
        meta: {
          guard: [GuardRoles.SUPERVISOR, GuardRoles.ADMIN],
        },
      },
      {
        path: "/admin/inventory/table/store",
        name: "InventoryStore",
        component: InventoryStore,
        meta: {
          guard: [GuardRoles.SUPERVISOR, GuardRoles.ADMIN],
        },
      },
      {
        path: "/admin/inventory/table/general",
        name: "InventoryGeneralTable",
        component: InventoryGeneralTable,
        meta: {
          guard: [
            GuardRoles.OP_MANAGER,
            GuardRoles.SUPERVISOR,
            GuardRoles.PREVENTION_AGENT,
            GuardRoles.SECURITY_AGENT,
            GuardRoles.ADMIN,
          ],
        },
      },
      {
        path: "/admin/inventory/table/uniforms",
        name: "InventoryUniformsTable",
        component: InventoryUniformsTable,
        meta: {
          guard: [
            GuardRoles.OP_MANAGER,
            GuardRoles.SUPERVISOR,
            GuardRoles.PREVENTION_AGENT,
            GuardRoles.SECURITY_AGENT,
            GuardRoles.ADMIN,
          ],
        },
      },
      {
        path: "/admin/inventory/table/weapons",
        name: "InventoryWeaponsTable",
        component: InventoryWeaponsTable,
        meta: {
          guard: [
            GuardRoles.OP_MANAGER,
            GuardRoles.SUPERVISOR,
            GuardRoles.PREVENTION_AGENT,
            GuardRoles.SECURITY_AGENT,
            GuardRoles.ADMIN,
          ],
        },
      },
      {
        path: "/admin/reports/table/",
        name: "ReportTable",
        component: ReportTable,
        meta: {
          guard: [
            GuardRoles.OP_MANAGER,
            GuardRoles.SUPERVISOR,
            GuardRoles.ADMIN,
          ],
        },
      },
      {
        path: "/admin/reports/table/holidays",
        name: "ReportTableHolidays",
        component: ReportTableHolidays,
        meta: {
          guard: [
            GuardRoles.OP_MANAGER,
            GuardRoles.SUPERVISOR,
            GuardRoles.PREVENTION_AGENT,
            GuardRoles.ADMIN,
            GuardRoles.SECURITY_AGENT,
          ],
        },
      },
      {
        path: "/admin/reports/table/news",
        name: "ReportTableNews",
        component: ReportTableNews,
        meta: {
          guard: [
            GuardRoles.OP_MANAGER,
            GuardRoles.SUPERVISOR,
            GuardRoles.PREVENTION_AGENT,
            GuardRoles.ADMIN,
            GuardRoles.SECURITY_AGENT,
          ],
        },
      },
      {
        path: "/admin/holidays/table/",
        name: "HolidayTable",
        component: HolidayTable,
        meta: {
          guard: [
            GuardRoles.SUPERVISOR,
            GuardRoles.PREVENTION_AGENT,
            GuardRoles.SECURITY_AGENT,
            GuardRoles.RRHH,
            GuardRoles.ADMIN,
          ],
        },
      },

      {
        path: "/admin/payrolls/gratifications/types/table",
        name: "PayrollGratificationsTable",
        component: PayrollGratificationsTable,
        meta: {
          guard: [
            GuardRoles.ADMIN,
            GuardRoles.RRHH,
            GuardRoles.RECRUITER_RRHH,
            GuardRoles.INDUCTION_RRHH,
            GuardRoles.ASSISTANT_RRHH,
            GuardRoles.MANAGER_RRHH,
            GuardRoles.ARCHIVE_RRHH,
          ],
        },
      },
      {
        path: "/admin/payrolls/gratifications/pending/table/admin",
        name: "PayrollGratificationPendingAdminTable",
        component: PayrollGratificationPendingAdminTable,
        meta: {
          guard: [
            GuardRoles.ADMIN,
            GuardRoles.ASSISTANT_RRHH,
            GuardRoles.MANAGER_RRHH,
          ],
        },
      },
      {
        path: "/admin/payrolls/discounts/pending/table/admin",
        name: "PayrollDiscountPendingAdminTable",
        component: PayrollDiscountPendingAdminTable,
        meta: {
          guard: [
            GuardRoles.ADMIN,
            GuardRoles.ASSISTANT_RRHH,
            GuardRoles.MANAGER_RRHH,
          ],
        },
      },
      {
        path: "/admin/payrolls/gratifications/pending/table",
        name: "PayrollGratificationPendingTable",
        component: PayrollGratificationPendingTable,
        meta: {
          guard: [
            GuardRoles.ADMIN,
            GuardRoles.ASSISTANT_RRHH,
            GuardRoles.MANAGER_RRHH,
          ],
        },
      },
      {
        path: "/admin/payrolls/discounts/pending/table",
        name: "PayrollDiscountPendingTable",
        component: PayrollDiscountPendingTable,
        meta: {
          guard: [
            GuardRoles.ADMIN,
            GuardRoles.ASSISTANT_RRHH,
            GuardRoles.MANAGER_RRHH,
            GuardRoles.ADMIN,
          ],
        },
      },
      {
        path: "/admin/payrolls/discounts/types/table",
        name: "PayrollDiscountsTable",
        component: PayrollDiscountsTable,
        meta: {
          guard: [
            GuardRoles.ADMIN,
            GuardRoles.RRHH,
            GuardRoles.RECRUITER_RRHH,
            GuardRoles.INDUCTION_RRHH,
            GuardRoles.ASSISTANT_RRHH,
            GuardRoles.MANAGER_RRHH,
            GuardRoles.ARCHIVE_RRHH,
          ],
        },
      },
      {
        path: "/admin/payrolls/discounts/scheduled/table",
        name: "PayrollScheduledDiscountsTable",
        component: PayrollScheduledDiscountsTable,
        meta: {
          guard: [
            GuardRoles.ADMIN,
            GuardRoles.RRHH,
            GuardRoles.RECRUITER_RRHH,
            GuardRoles.INDUCTION_RRHH,
            GuardRoles.ASSISTANT_RRHH,
            GuardRoles.MANAGER_RRHH,
            GuardRoles.ARCHIVE_RRHH,
          ],
        },
      },
      {
        path: "/admin/payrolls/gratifications/scheduled/table",
        name: "PayrollScheduledGratificationsTable",
        component: PayrollScheduledGratificationsTable,
        meta: {
          guard: [
            GuardRoles.ADMIN,
            GuardRoles.RRHH,
            GuardRoles.RECRUITER_RRHH,
            GuardRoles.INDUCTION_RRHH,
            GuardRoles.ASSISTANT_RRHH,
            GuardRoles.MANAGER_RRHH,
            GuardRoles.ARCHIVE_RRHH,
          ],
        },
      },
      {
        path: "/admin/payrolls/history/table",
        name: "PayrollHistoryTable",
        component: PayrollHistoryTable,
        meta: {
          guard: [
            GuardRoles.ADMIN,
            GuardRoles.RRHH,
            GuardRoles.RECRUITER_RRHH,
            GuardRoles.INDUCTION_RRHH,
            GuardRoles.ASSISTANT_RRHH,
            GuardRoles.MANAGER_RRHH,
            GuardRoles.ARCHIVE_RRHH,
            GuardRoles.OP_MANAGER,
            GuardRoles.MANAGER_RRHH,
            GuardRoles.REP_FINANCIAL,
            GuardRoles.REP_LEGAL,
            GuardRoles.COS,
            GuardRoles.OP_COORDINATOR,
          ],
        },
      },
      {
        path: "/admin/agents",
        name: "Agents",
        component: AgentList,
      },
      {
        path: "/admin/agents/new",
        name: "AgentNew",
        component: NewUser,
        meta: {
          guard: [GuardRoles.ANY],
        },
      },
      {
        path: "/admin/agents/overview",
        name: "AgentOverview",
        component: AgentsOverview,
        meta: {
          guard: [GuardRoles.ANY],
        },
      },
      {
        path: "/admin/business",
        name: "Business",
        component: BusinessList,
        meta: {
          guard: [GuardRoles.ADMIN],
        },
      },
      {
        path: "/admin/business/contacts",
        name: "BusinessContacts",
        component: ContactTable,
        meta: {
          guard: [GuardRoles.ADMIN],
        },
      },
      {
        path: "/admin/agencies",
        name: "Agencies",
        component: AgenciesList,
        meta: {
          guard: [GuardRoles.ADMIN],
        },
      },
      {
        path: "/admin/physical-position",
        name: "PhysicalPositions",
        component: PhysicalPositionList,
        meta: {
          guard: [GuardRoles.ADMIN],
        },
      },
      {
        path: "/admin/configs",
        name: "Salary",
        component: Salary,
        meta: {
          guard: [GuardRoles.ADMIN],
        },
      },
      {
        path: "/admin/business/overview",
        name: "BusinessOverview",
        component: BusinessOverview,
        meta: {
          guard: [GuardRoles.ADMIN],
        },
      },
      {
        path: "/admin/agency/overview",
        name: "AgencyOverview",
        component: AgencyOverview,
        meta: {
          guard: [GuardRoles.ADMIN],
        },
      },
      {
        path: "/admin/test/psychological",
        name: "Psychological",
        component: PsychicList,
      },
    ],
    meta: {
      guard: [GuardRoles.ANY],
    },
  },
  {
    path: "/authentication/checkin/confirm",
    name: "Confirm",
    component: Confirm,
    meta: {
      guard: [GuardRoles.GUEST],
    },
  },
  {
    path: "/authentication/login",
    name: "Login",
    component: Illustration,
    meta: {
      guard: [GuardRoles.GUEST],
    },
  },
  {
    path: "/authentication/error/error404",
    name: "Error Error404",
    component: Error404,
  },
  {
    path: "/authentication/error/error500",
    name: "Error Error500",
    component: Error500,
  },
]

const router = createRouter({
  history: createWebHistory("/sistema/"),
  routes,
  linkActiveClass: "active",
})

const resolveGuard = (roles: GuardRoles[], next: NavigationGuardNext) => {
  if (roles.includes(GuardRoles.ANY)) return next()
  if (AuthModule.role)
    return !roles.includes(AuthModule.role as GuardRoles)
      ? next({ name: "CheckInOutHistory" })
      : next()
  else if (roles.includes(GuardRoles.GUEST)) return next()
  return next({ name: "Login" })
}

router.beforeResolve(async (to: IRouteLocationNormalized, _, next) => {
  await AuthModule.saveSession()
  resolveGuard(to.meta.guard ?? [GuardRoles.ANY], next)
})

export default router
