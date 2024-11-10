import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import Vuex from 'vuex'
import { store } from './vuex'
import { VueMaskDirective } from 'v-mask'
import Toasted from 'vue-toasted'
import Meta from 'vue-meta'
import Vuetify from '@/plugins/vuetify'
// import VueTippy from "vue-tippy";


Vue.config.productionTip = false
Vue.use(Vuex)
Vue.directive('mask', VueMaskDirective)
Vue.use(Meta)
// "vue-tippy": "v4",
// Vue.use(VueTippy, {
//   directive: "tippy", // => v-tippy
//   flipDuration: 0,
//   popperOptions: {
//     modifiers: {
//       preventOverflow: {
//         enabled: false
//       }
//     }
//   }
// })
Vue.use(Toasted, {
  duration: 3000,
  keepOnHover: true,
  position: 'top-center', // ['top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left']
  theme: 'toasted-primary', // ['toasted-primary', 'outline', 'bubble']
  iconPack: 'custom-class', // ['material', 'fontawesome', 'mdi', 'custom-class', 'callback']
})

new Vue({
  vuetify: Vuetify,
  store,
  i18n,
  router,
  render: (h) => h(App),
  mounted: () => {
    const timer = setTimeout(() => {
      document.dispatchEvent(new Event("app-prerender"));
    }, 10000);

    document.addEventListener("app-prerender", () => {
      clearTimeout(timer);
    });
  },
}).$mount("#app");

router.beforeResolve(async (to, from, next) => {
  try {
    const components = router.getMatchedComponents(to);
    // eslint--next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await Promise.all(components.map((x) => x.fetch && x.fetch({ store })));
  } catch (error) {
    console.log(error)
  }

  return next()
})
