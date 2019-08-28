import Vue from "vue";
import Vuex from "vuex";
import Router from "vue-router";
import { createStore } from "@/store";
import { createRouter } from "@/router";
import vuetify from "@/plugins/vuetify";
import "@/firebase/firebase";
import moment from "moment";
import App from "@/App.vue";

Vue.config.productionTip = false;

Vue.filter("displayDateTime", (value: any) => {
  try {
    const dateFormat = "YYYY/MM/DD HH:mm:ss";
    const now = moment();
    const date = moment.unix(value.seconds);
    if (date.format(dateFormat) === now.format(dateFormat)) {
      return date.format("HH:mm");
    }

    if (date.format(dateFormat) === now.add(-1, "days").format(dateFormat)) {
      return `昨日 ${date.format("HH:mm")}`;
    }
    return date.format(dateFormat);
  } catch {
    return "Unknown";
  }
});

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
