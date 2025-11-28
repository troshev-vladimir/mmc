import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Meta from "vue-meta";

Vue.use(VueRouter);
Vue.use(Meta, {
  maxConcurrentRoutes: 4,
});

const routes: Array<RouteConfig> = [
  {
    path: "/agreement",
    name: "Agreement",
    component: () => import("../views/AgreementPage.vue"),
  },
  {
    path: "/cars",
    name: "Cars",
    component: () => import("../views/CarsPage.vue"),
  },
  {
    path: "/contacts",
    name: "Contacts",
    component: () => import("../views/ContactsPage.vue"),
  },
  {
    path: "/download",
    name: "Download",
    component: () => import("../views/DownloadPage.vue"),
  },
  {
    path: "/history",
    name: "History",
    component: () => import("../views/HistoryPage.vue"),
  },
  {
    path: "/balance/:open?/",
    name: "Balance",
    component: () => import("../views/BalancePage.vue"),
    props: true,
  },
  {
    path: "/subscriptions",
    name: "subscriptions",
    component: () => import("../views/SubscriptionsPage.vue"),
  },
  {
    path: "/all-subscriptions",
    name: "AllSubscriptions",
    component: () => import("../views/AllSubscriptions.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginPage.vue"),
  },
  {
    path: "/manual-order",
    name: "ManualOrder",
    component: () => import("../views/ManualOrderPage.vue"),
  },
  {
    path: "/manual-order/:id",
    name: "ManualOrderCustom",
    component: () => import("../views/ManualOrderCustomPage.vue"),
  },
  {
    path: "/mmc-flash",
    name: "MMCFlash",
    component: () => import("../views/MMCFlashPage.vue"),
  },
  {
    path: "/hardware",
    name: "HardWare",
    component: () => import("../views/MMCFlashPageCopy.vue"),
  },
  {
    path: "/offer",
    name: "Offer",
    component: () => import("../views/OfferPage.vue"),
  },
  {
    path: "/order/:type?/:brand?/:model?/:engine?/:ecu?/",
    name: "Order",
    component: () => import("../views/OrderPage.vue"),
  },
  {
    path: "/order/:id",
    name: "OrderCustom",
    component: () => import("../views/OrderCustomPage.vue"),
  },
  {
    path: "/policy",
    name: "Policy",
    component: () => import("../views/PolicyPage.vue"),
  },
  {
    path: "/prices/:type?/:brand?/:model?/:engine?/:ecu?/",
    name: "Prices",
    component: () => import("../views/PricesPage.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/ProfilePage.vue"),
  },
  {
    path: "/registration",
    name: "Registration",
    component: () => import("../views/RegistrationPage.vue"),
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("../views/ResetPasswordPage.vue"),
  },
  {
    path: "/email-success",
    name: "EmailSuccess",
    component: () => import("../views/EmailSuccessPage.vue"),
  },
  {
    path: "/about-us",
    name: "AboutUs",
    component: () => import("../views/AboutUsPage.vue"),
  },
  {
    path: "/faq",
    name: "FAQ",
    component: () => import("../views/FAQPage.vue"),
  },
  {
    path: "/stock",
    name: "Stock",
    component: () => import("../views/stock/MainPage.vue"),
  },
  {
    path: "/stock/:id",
    name: "StockSpacific",
    component: () => import("../views/stock/SpecificPage.vue"),
  },
  {
    path: "/stock/:id/:page?/",
    name: "StockSpacificPagination",
    component: () => import("../views/stock/SpecificPage.vue"),
  },
  {
    path: "/systems/immo",
    name: "Immo",
    component: () => import("../views/systems/ImmoPage.vue"),
  },
  {
    path: "/systems/euro0",
    name: "euro0",
    component: () => import("../views/systems/Euro0Page.vue"),
  },
  {
    path: "/systems/euro2",
    name: "euro2",
    component: () => import("../views/systems/Euro2Page.vue"),
  },
  {
    path: "/systems/evap-off",
    name: "evap",
    component: () => import("../views/systems/EvapPage.vue"),
  },
  {
    path: "/systems/grille-off",
    name: "grille",
    component: () => import("../views/systems/GrillePage.vue"),
  },
  {
    path: "/systems/misfire-off",
    name: "misfire",
    component: () => import("../views/systems/MisfirePage.vue"),
  },
  {
    path: "/systems/egr-off",
    name: "egr",
    component: () => import("../views/systems/EgrPage.vue"),
  },
  {
    path: "/systems/egt-off",
    name: "egt",
    component: () => import("../views/systems/EgtPage.vue"),
  },
  {
    path: "/systems/virgin",
    name: "virgin",
    component: () => import("../views/systems/VirginPage.vue"),
  },
  {
    path: "/systems/renew",
    name: "renew",
    component: () => import("../views/systems/VirginPage.vue"),
  },
  {
    path: "/news/:id",
    name: "New",
    component: () => import("../views/NewPage.vue"),
  },
  {
    path: "/news",
    name: "News",
    component: () => import("../views/NewsPage.vue"),
  },

  {
    path: "/news/page/:page",
    name: "NewsPage",
    component: () => import("../views/NewsPage.vue"),
  },

  {
    path: "/404",
    name: "404",
    component: () => import("../views/Page404.vue"),
  },
  {
    path: "/edit-instruction",
    name: "EditInstruction",
    component: () => import("../views/EditInstruction.vue"),
  },
  {
    path: "/manual-edit-instruction",
    name: "ManualEditInstruction",
    component: () => import("../views/ManualEditInstruction.vue"),
  },
  {
    path: "/top-up-balance-instruction",
    name: "TopUpBalanceInstruction",
    component: () => import("../views/TopUpBalanceInstruction.vue"),
  },
  {
    path: "/top-up-balance-for-foreigners-instruction",
    name: "TopUpBalanceForForeignersInstruction",
    component: () =>
      import("../views/TopUpBalanceForForeignersInstruction.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: () => import("../views/HomePage.vue"),
  },
  {
    path: "*",
    redirect: "404",
  },
];

// !! НЕ УДАЛЯТЬ!! нужно для того, чтобы выводить сообщение "Ведутся работы на сайте"
// routes.forEach(page => {
//   // @ts-expect-error
//   page.component = ()=> import('../views/ServerJobsPage.vue')
// })
// __________________________________________________________________________________

const router = new VueRouter({
  mode: "history",
  // base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});

// router.beforeEach((to, from ,next) => {
//   if(to.path!='/server-jobs')
//     return next('/server-jobs')
//   return next()
// })

export default router;
