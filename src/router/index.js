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
      path: "/drawing",
      name: "drawing",
      component: () => import("../views/CanvasDrawing.vue"),
    },
  ],
});

export default router;