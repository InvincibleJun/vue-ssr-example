import * as config from './config';

export default Vue => {
  Object.keys(config).forEach(key => {
    if (config && config[key]) {
      Vue.filter(key, config[key]);
    }
  });
  Vue.prototype.$filters = config;
};
