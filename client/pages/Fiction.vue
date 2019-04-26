<template>
  <div>
    <el-card>
      <p>{{state.book.title}}</p>
      <img :src="state.book.picture" />
      <p>{{state.book.desc}}</p>
      <p>{{state.book.auth}}</p>
      <p>{{state.book.updateTime}}</p>
      <!-- {{state.book}} -->
      <div v-for="(item, index) in state.book.content">
        <p @click="handlerClickOpenChapter(index)">{{item.name}}</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  asyncData({ store, route, ctx }) {
    return store.dispatch('fiction/loadFictionData', { id: route.params.id });
  },

  storeModule: require('@/store/modules/fiction').default,

  methods: {
    handlerClickOpenChapter(index) {
      this.$router.push(`/fiction/${this.$route.params.id}/${index}`);
    }
  }
};
</script>

