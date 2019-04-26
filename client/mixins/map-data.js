// state/getters into component
export default {
  created() {
    const { storeModule: m } = this.$options;

    if (!this.$store) return;

    if (
      m &&
      m.name &&
      !Object.getOwnPropertyDescriptor(this, 'state') &&
      !Object.getOwnPropertyDescriptor(this, 'getters')
    ) {

      Object.defineProperty(this, 'state', {
        get: () => {
          return this.$store.state[m.name];
        },

        set: () => {
          if (process.env.NODE_ENV === 'development') {
            throw new Error('please no set state');
          }
        }
      });

      Object.defineProperty(this, 'getters', {
        get: () => {
          return this.$store.getters[m.name];
        },
        set: () => {
          if (process.env.NODE_ENV === 'development') {
            throw new Error('please no set getters');
          }
        }
      });
    }

    if (!Object.getOwnPropertyDescriptor(this, 'store')) {
      Object.defineProperty(this, 'store', {
        get: () => {
          return this.$store;
        },
        set: () => {
          if (process.env.NODE_ENV === 'development') {
            throw new Error('please no set store');
          }
        }
      });
    }
  }
};
