function getMetas(vm) {
  const { meta: metasOption } = vm.$options;
  let metas =
    typeof metasOption === 'function' ? metasOption.call(vm) : metasOption;
  if (!metas) metas = {};
  return { ...config.metas, ...metas };
}

function createMetasString(metas = {}) {
  return Object.keys(metas)
    .map(key => {
      return `<meta name="${key}" content="${metas[key]}" />`;
    })
    .join('');
}

const serverMatesMixin = {
  created() {
    const metas = getMetas(this);
    if (this.$vnode && this.$vnode.ssrContext) {
      this.$ssrContext.metas = createMetasString(metas);
    }
  }
};

const clientMatesMixin = {
  mounted() {
    const metas = getMetas(this);
    Object.keys(metas).forEach(key => {
      const metaEl = document.querySelector(`meta[name=${key}]`);
      // exits meta then replace meta content
      if (metaEl) {
        const content = metaEl.getAttribute('content');
        if (content && content !== metas[key]) {
          metaEl.setAttribute('content', metas[key]);
        }
      // create new meta and append into head
      } else {
        const newMateEl = document.createElement('meta');
        newMateEl.setAttribute('name', key);
        newMateEl.setAttribute('content', metas[key]);
        document.head.appendChild(newMateEl);
      }
    });
  }
};

export default (process.env.VUE_ENV === 'server'
  ? serverMatesMixin
  : clientMatesMixin);
