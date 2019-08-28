import Router from "vue-router";
import { RouteConfig } from "vue-router";
import { Store } from "vuex";

import Home from "@/views/Home.vue";
import About from "@/views/About.vue";

export const AppRoutes: RouteConfig[] = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/about",
    name: "about",
    component: About
  }
];

export const Routes: RouteConfig[] = [...AppRoutes];

export function createRouter(store: Store<any>) {
  const router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: Routes
  });

  router.beforeEach((to, from, next) => {
    next();
  });

  return router;
}
