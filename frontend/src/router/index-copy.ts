import { createRouter, createWebHistory } from "vue-router"
const Landing = () => import("../views/dashboards/Landing.vue")
const Default = () => import("../views/dashboards/Default.vue")
const Automotive = () => import("../views/dashboards/Automotive.vue")
const SmartHome = () => import("../views/dashboards/SmartHome.vue")
const VRDefault = () => import("../views/dashboards/vr/VRDefault.vue")
const VRInfo = () => import("../views/dashboards/vr/VRInfo.vue")
const CRM = () => import("../views/dashboards/CRM.vue")
const Overview = () => import("../views/pages/profile/Overview.vue")
const Teams = () => import("../views/pages/profile/Teams.vue")
const Projects = () => import("../views/pages/profile/Projects.vue")
const General = () => import("../views/pages/projects/General.vue")
const Timeline = () => import("../views/pages/projects/Timeline.vue")
const NewProject = () => import("../views/pages/projects/NewProject.vue")
const Pricing = () => import("../views/pages/Pricing.vue")
const RTL = () => import("../views/pages/Rtl.vue")
const Charts = () => import("../views/pages/Charts.vue")
const SweetAlerts = () => import("../views/pages/SweetAlerts.vue")
const Notifications = () => import("../views/pages/Notifications.vue")
//import Kanban from "../views/applications/Kanban.vue";
const Wizard = () => import("../views/applications/wizard/Wizard.vue")
const DataTables = () => import("../views/applications/DataTables.vue")
const Calendar = () => import("../views/applications/Calendar.vue")
const Analytics = () => import("../views/applications/analytics/Analytics.vue")
const EcommerceOverview = () =>
  import("../views/ecommerce/overview/Overview.vue")
const NewProduct = () => import("../views/ecommerce/products/NewProduct.vue")
const EditProduct = () => import("../views/ecommerce/EditProduct.vue")
const ProductPage = () => import("../views/ecommerce/ProductPage.vue")
const ProductsList = () => import("../views/ecommerce/ProductsList.vue")
const OrderDetails = () => import("../views/ecommerce/Orders/OrderDetails.vue")
const OrderList = () => import("../views/ecommerce/Orders/OrderList.vue")
const Referral = () => import("../views/ecommerce/Referral.vue")
const Reports = () => import("../views/pages/Users/Reports.vue")

const CheckIn = () => import("../views/auth/signin/CheckIn.vue")
const HistoryCheckInOut = () => import("../views/dashboards/history/Checkin-checkout.vue")

const Confirm = () => import("../views/auth/signin/Confirm.vue")
const NewUser = () => import("../views/pages/Users/NewUser.vue")
const Settings = () => import("../views/pages/Account/Settings.vue")
const Billing = () => import("../views/pages/Account/Billing.vue")
const Invoice = () => import("../views/pages/Account/Invoice.vue")
const Security = () => import("../views/pages/Account/Security.vue")
const Widgets = () => import("../views/pages/Widgets.vue")
const Basic = () => import("../views/auth/signin/Basic.vue")
const Cover = () => import("../views/auth/signin/Cover.vue")
const Illustration = () => import("../views/auth/signin/Illustration.vue")
const ResetBasic = () => import("../views/auth/reset/Basic.vue")
const ResetCover = () => import("../views/auth/reset/Cover.vue")
const ResetIllustration = () => import("../views/auth/reset/Illustration.vue")
const VerificationBasic = () => import("../views/auth/verification/Basic.vue")
const VerificationCover = () => import("../views/auth/verification/Cover.vue")
const VerificationIllustration = () =>
  import("../views/auth/verification/Illustration.vue")
const SignupBasic = () => import("../views/auth/signup/Basic.vue")
const SignupCover = () => import("../views/auth/signup/Cover.vue")
const SignupIllustration = () => import("../views/auth/signup/Illustration.vue")
const Error404 = () => import("../views/auth/error/Error404.vue")
const Error500 = () => import("../views/auth/error/Error500.vue")
const lockBasic = () => import("../views/auth/lock/Basic.vue")
const lockCover = () => import("../views/auth/lock/Cover.vue")
const lockIllustration = () => import("../views/auth/lock/Illustration.vue")
const QR = () => import("../views/QR.vue")
const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboards/dashboard-default",
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
  },
  {
    path: "/dashboards/landing",
    name: "Landing",
    component: Landing,
  },
  {
    path: "/dashboards/automotive",
    name: "Automotive",
    component: Automotive,
  },
  {
    path: "/dashboards/smart-home",
    name: "Smart Home",
    component: SmartHome,
  },
  {
    path: "/dashboards/vr/vr-default",
    name: "VR Default",
    component: VRDefault,
  },
  {
    path: "/dashboards/vr/vr-info",
    name: "VR Info",
    component: VRInfo,
  },
  {
    path: "/dashboards/crm",
    name: "CRM",
    component: CRM,
  },
  {
    path: "/pages/profile/overview",
    name: "Profile Overview",
    component: Overview,
  },
  {
    path: "/pages/profile/teams",
    name: "Teams",
    component: Teams,
  },
  {
    path: "/pages/profile/projects",
    name: "All Projects",
    component: Projects,
  },
  {
    path: "/pages/projects/general",
    name: "General",
    component: General,
  },
  {
    path: "/pages/projects/timeline",
    name: "Timeline",
    component: Timeline,
  },
  {
    path: "/pages/projects/new-project",
    name: "New Project",
    component: NewProject,
  },
  {
    path: "/pages/pricing-page",
    name: "Pricing Page",
    component: Pricing,
  },
  {
    path: "/pages/rtl-page",
    name: "RTL",
    component: RTL,
  },
  {
    path: "/pages/charts",
    name: "Charts",
    component: Charts,
  },
  {
    path: "/pages/widgets",
    name: "Widgets",
    component: Widgets,
  },
  {
    path: "/pages/sweet-alerts",
    name: "Sweet Alerts",
    component: SweetAlerts,
  },
  {
    path: "/pages/notifications",
    name: "Notifications",
    component: Notifications,
  },
  {
    path: "/applications/kanban",
    name: "Kanban",
    component: Wizard,
  },
  {
    path: "/applications/wizard",
    name: "Wizard",
    component: Wizard,
  },
  {
    path: "/applications/data-tables",
    name: "Data Tables",
    component: DataTables,
  },
  {
    path: "/applications/calendar",
    name: "Calendar",
    component: Calendar,
  },
  {
    path: "/applications/analytics",
    name: "Analytics",
    component: Analytics,
  },
  {
    path: "/ecommerce/overview",
    name: "Overview",
    component: EcommerceOverview,
  },
  {
    path: "/ecommerce/products/new-product",
    name: "New Product",
    component: NewProduct,
  },
  {
    path: "/ecommerce/products/edit-product",
    name: "Edit Product",
    component: EditProduct,
  },
  {
    path: "/ecommerce/products/product-page",
    name: "Product Page",
    component: ProductPage,
  },
  {
    path: "/ecommerce/products/products-list",
    name: "Products List",
    component: ProductsList,
  },
  {
    path: "/ecommerce/Orders/order-details",
    name: "Order Details",
    component: OrderDetails,
  },
  {
    path: "/ecommerce/Orders/order-list",
    name: "Order List",
    component: OrderList,
  },
  {
    path: "/ecommerce/referral",
    name: "Referral",
    component: Referral,
  },
  {
    path: "/pages/users/reports",
    name: "Reports",
    component: Reports,
  },
  {
    path: "/pages/users/new-user",
    name: "New User",
    component: NewUser,
  },
  {
    path: "/pages/account/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/pages/account/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/pages/account/invoice",
    name: "Invoice",
    component: Invoice,
  },
  {
    path: "/pages/account/Security",
    name: "Security",
    component: Security,
  },
  {
    path: "/authentication/checkin",
    name: "ChekIn",
    component: CheckIn,
  },
  {
    path: "/dashboard/history/checkin-checkout",
    name: "HistoryCheckInOut",
    component: HistoryCheckInOut,
  },
  {
    path: "/authentication/checkin/confirm",
    name: "Confirm",
    component: Confirm,
  },
  {
    path: "/authentication/signin/basic",
    name: "Signin Basic",
    component: Basic,
  },
  {
    path: "/authentication/signin/cover",
    name: "Signin Cover",
    component: Cover,
  },
  {
    path: "/authentication/signin/illustration",
    name: "Signin Illustration",
    component: Illustration,
  },
  {
    path: "/authentication/reset/basic",
    name: "Reset Basic",
    component: ResetBasic,
  },
  {
    path: "/authentication/reset/cover",
    name: "Reset Cover",
    component: ResetCover,
  },
  {
    path: "/authentication/reset/illustration",
    name: "Reset Illustration",
    component: ResetIllustration,
  },
  {
    path: "/authentication/lock/basic",
    name: "Lock Basic",
    component: lockBasic,
  },
  {
    path: "/authentication/lock/cover",
    name: "Lock Cover",
    component: lockCover,
  },
  {
    path: "/authentication/lock/illustration",
    name: "Lock Illustration",
    component: lockIllustration,
  },
  {
    path: "/authentication/verification/basic",
    name: "Verification Basic",
    component: VerificationBasic,
  },
  {
    path: "/authentication/verification/cover",
    name: "Verification Cover",
    component: VerificationCover,
  },
  {
    path: "/authentication/verification/illustration",
    name: "Verification Illustration",
    component: VerificationIllustration,
  },
  {
    path: "/authentication/signup/basic",
    name: "Signup Basic",
    component: SignupBasic,
  },
  {
    path: "/authentication/signup/cover",
    name: "Signup Cover",
    component: SignupCover,
  },
  {
    path: "/authentication/signup/illustration",
    name: "Signup Illustration",
    component: SignupIllustration,
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
  history: createWebHistory(),
  routes,
  linkActiveClass: "active",
})

export default router
