function getTitle(vm) {
  const { title } = vm.$options;
  if (title) {
    return typeof title === 'function' ? title.call(vm) : title;
  } else {
    return config.title;
  }
}

const serverTitleMixin = {
  created() {
    const title = getTitle(this);
    if (this.$vnode && this.$vnode.ssrContext) {
      this.$ssrContext.title = title;
    }
  }
};

const clientTitleMixin = {
  mounted() {
    const title = getTitle(this);
    document.title = title;
  }
};

export default (process.env.VUE_ENV === 'server'
  ? serverTitleMixin
  : clientTitleMixin);
