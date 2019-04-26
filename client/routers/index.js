// router.js
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default function createRouter() {
  return new Router({
    mode: 'history',
    base: '/',
    routes: [
      {
        path: '/',
        component: () => import('../pages/Index.vue')
      },
      {
        path: '/list/:keyword',
        name: 'list',
        component: () => import('../pages/List.vue')
      },
      {
        path: '/fiction/:id',
        component: () => import('../pages/Fiction.vue')
      },
      {
        path: '/fiction/:id/:index',
        component: () => import('../pages/Chapter.vue')
      }
    ],
    fallback: false
  });
}
