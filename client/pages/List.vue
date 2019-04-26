<template>
  <div>
    <el-card
      v-for="item in state.data"
      :key="item._id"
    >
      <div class="card">
        <img :src="item.picture">
        <div
          class="desc"
          @click="handlerClickOpenFiction(item._id)"
        >
          <p>{{item.title}}</p>
          <p>作者：{{item.auth}}</p>
          <p>共{{item.count}}篇</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  asyncData({ store, route }) {
    return store.dispatch('fiction/loadListData', {
      keyword: route.params.keyword
    });
  },

  storeModule: require('@/store/modules/fiction').default,

  methods: {
    handlerClickOpenFiction(id) {
      this.$router.push(`/fiction/${id}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: row;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  .desc {
    font-size: 16px;
    margin-left: 20px;
  }
}
</style>

