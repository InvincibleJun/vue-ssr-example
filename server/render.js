const fs = require('fs');
const path = require('path');
const express = require('express');
const domain = require('domain');
const { createBundleRenderer } = require('vue-server-renderer');
const Ctx = require('./ctx');

let renderer;

const isProduction = config.env !== 'development';

const createRender = function(bundle, options) {
  const defaultOption = {
    runInNewContext: false,
    // 关闭资源预加载
    shouldPrefetch: () => false,
    shouldPreload: () => false
  };
  return createBundleRenderer(bundle, Object.assign(options, defaultOption));
};

const renderController = async function(req, res) {
  let startTime = Date.now();
  const ctx = new Ctx(req, res);
  const renderDomain = domain.create();

  // add ctx to process.domain
  renderDomain.ctx = ctx;

  renderDomain.run(async () => {
    try {
      let html = await renderer.renderToString(ctx);
      res.send(html);
      // eslint-disable-next-line no-console
      console.log(`render-time: ${Date.now() - startTime}ms`);
    } catch (e) {
      if (e) {
        // 404
        if (e.code === 404) {
          return res.render('404');
        }

        // dev mode render error stack page
        if (isProduction) {
          res.render('500');
        } else {
          // eslint-disable-next-line no-console
          console.log(e);
          res.render('stack', { stack: e.stack, url: req.url });
        }
      }
    }

    // dispose domain
    // renderDomain.dispose();
  });
};

module.exports = function createRenderController(app) {
  if (isProduction) {
    renderer = createRender(require('../dist/vue-ssr-server-bundle.json'), {
      template: fs.readFileSync(config.tempaltePath, 'utf-8'),
      clientManifest: require('../dist/vue-ssr-client-manifest.json')
    });
    app.use(express.static(path.resolve(__dirname, '../dist')));
  } else {
    require('../build/server-dev')(app, (bundle, options) => {
      renderer = createRender(bundle, options);
    });
  }
  return renderController;
};
