import type from '../types';
import {
  searchBookService,
  fetchBookService,
  fetchChapterService
} from '@/services/fiction.js';

export default {
  name: 'fiction',

  namespaced: true,

  state() {
    return {
      data: [],
      loaded: false,
      book: null,
      bookLoaded: false,
      chapter: null,
      chapterLoaded: false
    };
  },

  actions: {
    async loadListData({ commit }, params) {
      let data = await searchBookService(params);
      commit('SET_LIST_DATA', data);
    },

    async loadFictionData({ commit }, params) {
      let data = await fetchBookService(params);
      commit('SET_FICTION_DATA', data);
    },

    async loadChapterData({ commit }, { index, id }) {
      let data = await fetchChapterService({ _id: id }, { index });
      commit('SET_CHAPTER_DATA', data);
    }
  },

  mutations: {
    [type.SET_LIST_DATA](state, data) {
      state.data = data;
      state.loaded = true;
    },
    [type.SET_FICTION_DATA](state, data) {
      state.book = data;
      state.bookLoaded = true;
    },
    [type.SET_CHAPTER_DATA](state, data) {
      state.chapter = data;
      state.chapterLoaded = true;
    }
  }
};
