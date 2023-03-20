import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import CourseView from "@/views/CourseView.vue";
import ChapterView from "@/views/ChapterView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/course",
      name: "Chatbot Course",
      component: CourseView,
    },
    {
      path: "/chapters",
      name: "Chapter Selection",
      component: ChapterView,
    },
  ],
});

export default router;
