import type from './types';

/**
 * state must be as function
 * https://vuex.vuejs.org/zh/guide/modules.html
 */
export default {
  namespaced: true,
  state() {
    return {
      userInfo: null,
      login: false
    };
  },
  actions: {},
  mutations: {
    [type.SAVE_USERINFO](state, userInfo) {
      state.userInfo = userInfo;
      state.login = true;
    }
  }
};
