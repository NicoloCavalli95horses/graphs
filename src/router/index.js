// ==============
// Import
// ==============
import { 
  createRouter,
  createWebHistory
} from "vue-router";

// ==============
// Router
// ==============
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "nav",
      component: () => import("../views/Nav.vue"),
    },
    {
      path: "/mindmap",
      name: "mindmap",
      component: () => import("../views/Mindmap.vue"),
    },
    {
      path: "/machinestate",
      name: "machinestate",
      component: () => import("../views/StateMachine.vue"),
    },
  ],
});

export default router;