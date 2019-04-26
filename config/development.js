module.exports = {
  open: false,
  host: 'localhost',
  proxy: {
    '/api': {
      target: 'http://localhost:8888',
      changeOrigin: true
      // pathRewrite: {
      // '^/api': ''
      // }
    }
  }
};
