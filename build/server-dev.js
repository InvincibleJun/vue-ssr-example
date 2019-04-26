// const connect = require('connect');
const webpack = require('webpack');
const chokidar = require('chokidar');
const path = require('path');
const FS = require('fs');
const MFS = require('memory-fs');
const consola = require('consola');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@nuxtjs/friendly-errors-webpack-plugin');
const serverConfig = require('./webpack.server.config.js');
const clientConfig = require('./webpack.client.config.js');
const connect = require('connect');

let ready = false;

module.exports = function(app, cb) {
  let r;
  let clientManifest;
  let bundle;
  let template;

  serverConfig.mode = clientConfig.mode = 'development';

  const mfs = new MFS();
  const p = new Promise(resolve => {
    r = resolve;
  });
  const update = () => {
    if (bundle && clientManifest) {
      r();
      try {
        cb(bundle, {
          clientManifest,
          template
        });
        if (!ready) {
          ready = true;
        }
      } catch (e) {
        consola.error(e);
      }
    }
  };

  template = FS.readFileSync(config.tempaltePath, 'utf-8');
  chokidar.watch(config.templatePath).on('change', () => {
    template = FS.readFileSync(config.templatePath, 'utf-8');
    consola.info('index.html template updated.');
    update();
  });

  /**
   * clientConfig针对dev模式修改
   */
  clientConfig.output.filename = '[name].js';
  // 注入webpack热更新模块
  clientConfig.entry.app = [
    'webpack-hot-middleware/client',
    clientConfig.entry.app
  ];
  clientConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`running at http://localhost:${config.port}`]
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );

  if (config.open) {
    clientConfig.plugins.push(
      new OpenBrowserPlugin({ url: `http://${config.host}: ${config.port}` })
    );
  }

  const clientCompiler = webpack(clientConfig);

  // live reloading 类似webpack-dev-server, 注入到当前服务中
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: false,
    quiet: true,
    // overlay: true,
    logLevel: 'silent'
  });

  // 注入热更新
  const hotMiddleware = require('webpack-hot-middleware')(clientCompiler, {
    heartbeat: 5000,
    log: false
  });

  app.use(devMiddleware);

  app.use(hotMiddleware);

  // // proxy
  // if (config.proxy) {
  //   Object.keys(config.proxy).forEach(api => {
  //     let {
  //       target = 'http://10.82.195.56:6868',
  //       changeOrign = true
  //     } = config.proxy[api];
  //     app.use(
  //       api,
  //       proxy({
  //         target,
  //         changeOrign
  //       })
  //     );
  //   });
  // }

  clientCompiler.plugin('done', stats => {
    stats = stats.toJson();
    if (stats.errors.length) return;

    clientManifest = JSON.parse(
      devMiddleware.fileSystem.readFileSync(
        path.join(clientConfig.output.path, 'vue-ssr-client-manifest.json')
      ),
      'utf-8'
    );

    update();
  });

  const serverCompiler = webpack(serverConfig);
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    if (stats.errors.length) return;

    bundle = JSON.parse(
      mfs.readFileSync(
        path.join(clientConfig.output.path, 'vue-ssr-server-bundle.json')
      ),
      'utf-8'
    );

    update();
  });

  return p;
};
