<template>
  <div>
    <el-card>
      <p>{{state.chapter.title}}</p>
      <div class="text">
        {{state.chapter.article}}
      </div>
      <el-tag @click="handlerClickOpenPrev">上一篇{{state.chapter.prev.name}}</el-tag>
      <el-tag @click="handlerClickOpenNext">下一篇{{state.chapter.next.name}}</el-tag>
    </el-card>
  </div>
</template>

<script>
export default {
  asyncData({ store, route }) {
    return store.dispatch('fiction/loadChapterData', {
      id: route.params.id,
      index: route.params.index
    });
  },

  methods: {
    handlerClickOpenPrev() {
      //
    },
    handlerClickOpenNext() {
      //
    }
  },

  storeModule: require('@/store/modules/fiction').default
};
</script>

<style>
.text {
  white-space: pre-line;
}
</style>
