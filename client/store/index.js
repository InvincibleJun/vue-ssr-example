import Vuex, { Store } from 'vuex';
import Vue from 'vue';
import user from './user';

Vue.use(Vuex);

export default function createStore() {
  const modules = {
    user
  };

  return new Store({
    modules
  });
}
