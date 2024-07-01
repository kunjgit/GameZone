import { createRouter, createWebHistory } from "vue-router";
import { Config } from "@/models/config";
import Home from "@/views/Home.vue";
import GameView from "@/views/Game.vue";
import Tutorial from "@/views/Tutorial.vue";
import Preview from "@/views/Preview.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/play",
    name: "play",
    component: GameView,
  },
  {
    path: "/learn",
    name: "tutorial",
    component: Tutorial,
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: Home },
];

if (Config.debug) {
  routes.push({
    path: "/preview",
    name: "preview",
    component: Preview,
  });
}

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
