import { createApp } from './app';

const noob = () => {};

export default ctx => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    // save userinfo into state
    if (ctx.user) {
      store.commit('user/SAVE_USERINFO', ctx.user);
    }

    router.push(ctx.url, noob, reject);
    router.onReady(async () => {
      const matchedComponents = router.getMatchedComponents();

      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }

      matchedComponents.map(({ storeModule }) => {
        if (storeModule) {
          store.registerModule(storeModule.name, storeModule);
        }
      });

      try {
        await Promise.all(
          matchedComponents.map(({ asyncData }) => {
            return (
              asyncData &&
              asyncData({
                route: router.currentRoute,
                store,
                isServer: true,
                ctx
              })
            );
          })
        );

        ctx.state = store.state;
        resolve(app);
      } catch (e) {
        reject(e);
      }
    }, reject);
  });
};
