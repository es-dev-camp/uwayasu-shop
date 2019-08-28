import Vue from "vue";
import Vuex from "vuex";
import Router from "vue-router";
import { createStore } from "@/store";
import { createRouter } from "@/router";
import vuetify from "@/plugins/vuetify";
import "@/firebase/firebase";
import App from "@/App.vue";

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(Router);

const store = createStore();
const router = createRouter(store);

new Vue({
  render: h => h(App),
  router: router,
  store: store,
  components: { App },
  template: "<App/>",
  vuetify: vuetify
}).$mount("#app");
