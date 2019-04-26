const chalk = require('chalk');

const prefix = `[vue-server-renderer-webpack-plugin]`;
const warn = msg => console.error(chalk.red(`${prefix} ${msg}\n`)); // eslint-disable-line no-console
const tip = msg => console.log(chalk.yellow(`${prefix} ${msg}\n`)); // eslint-disable-line no-console

const validate = compiler => {
  if (compiler.options.target !== 'node') {
    warn('webpack config `target` should be "node".');
  }

  if (
    compiler.options.output &&
    compiler.options.output.libraryTarget !== 'commonjs2'
  ) {
    warn('webpack config `output.libraryTarget` should be "commonjs2".');
  }

  if (!compiler.options.externals) {
    tip(
      'It is recommended to externalize dependencies in the server build for ' +
        'better build performance.'
    );
  }
};

const onEmit = (compiler, name, hook) => {
  if (compiler.hooks) {
    // Webpack >= 4.0.0
    compiler.hooks.emit.tapAsync(name, hook);
  } else {
    // Webpack < 4.0.0
    compiler.plugin('emit', hook);
  }
};

const isJS = file => /\.js(\?[^.]+)?$/.test(file);

const isCSS = file => /\.css(\?[^.]+)?$/.test(file);

module.exports = {
  isJS,
  isCSS,
  warn,
  tip,
  validate,
  onEmit
};
