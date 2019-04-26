const express = require('express');
const path = require('path');
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

// user proxy check
app.use(require('./middware/user'));

// proxy
require('./middware/proxy')(app);

// render controller
app.get('*', render);

// catch err
app.use(function(err, req, res) {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.render('500');
});

// listen port and start
app.listen(config.port);
