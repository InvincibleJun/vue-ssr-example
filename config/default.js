const path = require('path');

module.exports = {
  // mounted root tag
  root:  '#app',
  port: 9998,
  title: 'vue-ssr',
  metas: {
    keywords: 'abscs',
    description: 'sadasdasdasd'
  },
  tempaltePath: path.resolve(__dirname, '../template/index.html'),
  // npm run dev then auto open brower
  open: false,
  host: 'localhost',
  server: 'http://localhost:8888'
};
