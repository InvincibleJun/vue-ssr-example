const chalk = require('chalk');
const log = console.log;

module.exports = {
  success: function(msg) {
    log(`${chalk.white.bgGreen.bold(' SUCESS ')} ${msg}` )
  },
  error: function(msg) {
    log(chalk.red(msg));
  }
}