import title from './title';
import meta from './meta';
import mapData from './map-data';

export default Vue => {
  Vue.mixin(title);
  Vue.mixin(meta);
  Vue.mixin(mapData);
};
