import Vue from "vue";
import Component from "vue-class-component";
import api from "@/api";

Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate", // for vue-router 2.2+
]);

@Component
export default class AuthorizeFormMMC extends Vue {
  async beforeRouteEnter(to: any, from: any, next: () => void) {
    const ApiKey = to.query.apiKey;
    const response = await api.mmc.login(ApiKey, 60);
    // if(!response) return
    next();
  }
}
