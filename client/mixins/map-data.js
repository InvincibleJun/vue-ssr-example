
import { getModuleConfig } from '@/utils/func';

export default {
  destroyed() {
    if (this.module && this.module.destory) {
      this.$store.unregisterModule('foo');
    }
  },

  created() {
    if (!this.$store || !this.$options.storeModule) return;

    const config = getModuleConfig(this.$options.storeModule);
    const { module: m } = config;

    // dev mode can configurable
    const configurable = process.env.NODE_ENV === 'development';

    this.module = config;

    Object.defineProperty(this, 'state', {
      configurable,
      get: () => {
        return m ? this.$store.state[m.name] : this.$store.state;
      },

      set: () => {
        if (process.env.NODE_ENV === 'development') {
          throw new Error('please no set state');
        }
      }
    });

    Object.defineProperty(this, 'getters', {
      configurable,
      get: () => {
        return m ? this.$store.getters[m.name] : this.$store.getters;
      },
      set: () => {
        if (process.env.NODE_ENV === 'development') {
          throw new Error('please no set getters');
        }
      }
    });

    Object.defineProperty(this, 'store', {
      configurable,
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
};
