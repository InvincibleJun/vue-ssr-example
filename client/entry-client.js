import { createApp } from './app';
import LoadingBar from './components/LoadingBar';
import config from '../config';

const { app, router, store } = createApp();

let timer;

// config bind into winodw
window.config = config;

router.onReady(initialRoute => {
  // first render and registerModule
  const initMatched = router.getMatchedComponents(initialRoute);
  initMatched.forEach(({ storeModule }) => {
    if (storeModule && typeof storeModule === 'object') {
      store.registerModule(storeModule.name, storeModule);
    }
  });

  // when async module has been register
  if (window.__INITIAL_STATE__) {
    // store bind into window and init store state
    (window.store = store).replaceState(window.__INITIAL_STATE__);
  }

  router.beforeResolve(async (to, from, next) => {
    let r = false;
    const ctx = {
      redirect: path => {
        r = true;
        next(path);
      }
    };

    clearTimeout(timer);

    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);
    let diffed = false;

    const activated = matched.filter((c, i) => {
      return diffed || (diffed = prevMatched[i] !== c);
    });
    if (!activated.length) {
      return next();
    }

    activated.map(({ storeModule }) => {
      if (storeModule && typeof storeModule === 'object') {
        store.registerModule(storeModule.name, storeModule);
      }
    });

    LoadingBar.start({
      color: '#ff0768'
    });

    try {
      await Promise.all(
        activated.map(c => {
          if (c.asyncData) {
            return c.asyncData({ store, route: to, ctx, isServer: false });
          }
        })
      );
      timer = setTimeout(() => {
        LoadingBar.finish();
      }, 300);
    } catch (e) {
      // when request error also render view
    }

    if (!r) {
      next();
    }
  });

  app.$mount(config.root);
});
