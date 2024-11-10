import Vue from "vue";
import Vuex from "vuex";
import { createProxy, extractVuexModule } from "vuex-class-component";
import UserStore from "./modules/user.vuex";
import DTOStore from "./modules/dto.vuex";
Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(UserStore),
    ...extractVuexModule(DTOStore),
  },
});
export const vxm = {
  user: createProxy(store, UserStore),
  dto: createProxy(store, DTOStore),
};
