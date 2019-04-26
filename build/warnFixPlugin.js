module.exports = class WarnFixPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('warnfix-plugin', stats => {
      stats.compilation.warnings = stats.compilation.warnings.filter(
        () => false
      );
    });
  }
};
