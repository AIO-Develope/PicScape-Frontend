
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import UploadView from '../views/UploadView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/upload', component: UploadView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
