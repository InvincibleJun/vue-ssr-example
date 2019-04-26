import Vue from 'vue';
import createRouter from './routers';
import createStore from './store';
// import 'idempotent-babel-polyfill';
import filters from './filters';
import mixins from './mixins';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.use(ElementUI);

mixins(Vue);
filters(Vue);

export function createApp() {
  const router = createRouter();

  const store = createStore();

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });

  return { router, app, store };
}
