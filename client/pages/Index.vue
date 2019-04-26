<template>
  <div>
    <el-input
      placeholder="请输入内容"
      v-model="input"
      class="input-with-select"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="handlerSelect"
      ></el-button>
    </el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: ''
    };
  },
  
  // asyncData({ ctx }) {
  //   // return ctx.redirect('/a');
  // },
  methods: {
    handlerSelect() {
      this.$router.push({
        name: 'list',
        params: {
          keyword: this.input
        }
      });
    }
  }
};
</script>
