// node server will use it to check user, so not use es6 module.
const axios = require('axios');
const isServer = process.env.VUE_ENV === 'server';

axios.interceptors.request.use(
  config => {
    config = {
      ...config,
      // add credential when cross origin request
      withCredentials: false,
      timeout: 1200,
      headers: {
        // request type
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    /**
     *  not use cookie get userinfo.Then we can use http only safely.
     */
    // server-slide
    if (process.domain) {
      // user has been login
      if (process.domain.ctx.login) {
        config.headers.uid = process.domain.ctx.user.uid;
        config.headers.token = process.domain.ctx.user.token;
      }
      // client-slide
    } else {
      const { user } = window.store.state;
      if (user.login) {
        config.headers.uid = user.uid;
        config.headers.token = user.token;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

module.exports = function(api, option = {}) {
  let { method = 'get', params, query = {}, data } = option;

  // resetful api replace params
  let url = api.replace(/:([\w]+)/g, (word, $1) => {
    return params[$1] ? params[$1] : word;
  });

  console.log(url, params)

  return new Promise((resolve, reject) => {
    axios({
      method,
      url: isServer ? config.server + url : url,
      params: query,
      data
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          return reject({ code: 404 });
        }
        let e = error.toString();
        reject(e);
      });
  });
};
