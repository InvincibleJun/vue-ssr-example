module.exports = class Ctx {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  // @type {string} request url
  get url() {
    return this.request.url;
  }

  get redirect() {
    return this.res.redirect.bind(this.res);
  }

  get ua() {
    return this.request.reponse('User-Agent');
  }

  get reponse() {
    return this.res;
  }

  get request() {
    return this.req;
  }

  get isPC() {
    return !this.isMobile;
  }

  get isMobile() {
    return /Android|webOS|iPhone|iPad|BlackBerry/i.test(this.ua);
  }

  // @type {boolean} isLogin
  get isLogin() {
    return !!this.req.user;
  }

  // @type {object} userinfo
  get user() {
    return this.req.user;
  }
};
