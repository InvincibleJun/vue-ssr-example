const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const cookieParser = require('cookie-parser');
const app = express();

global.config = require('../config');

const render = require('./render')(app);

// set views template path
app.set('views', path.join(__dirname, '../template'));

// set ejs as view engine
app.set('view engine', 'ejs');

// cookie parse
app.use(cookieParser());

// proxy static source
app.use('/', express.static(path.resolve(__dirname, '../static')));

// proxy
if (config.proxy) {
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
}
// user proxy check
app.use(require('./middware/user'));

// render controller
app.get('*', render);

// listen port and start
app.listen(config.port);
