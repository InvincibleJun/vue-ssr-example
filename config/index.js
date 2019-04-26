const env = process.env.NODE_ENV;

const baseConfig = require('./default');

const envConfig = require(`./${env}`);

module.exports = {
  ...baseConfig,
  ...envConfig,
  env
};
