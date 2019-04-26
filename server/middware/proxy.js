const proxy = require('http-proxy-middleware');

module.exports = function createProxy(app) {
  if (!config.proxy) return;
  Object.keys(config.proxy).forEach(api => {
    let { target, changeOrign = true } = config.proxy[api];
    app.use(
      api,
      proxy({
        target,
        changeOrign
      })
    );
  });
};
