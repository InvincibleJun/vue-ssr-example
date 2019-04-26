const request = require('../../client/utils/request');
/**
 * if uid and token exits, so we need check its are correct.
 */
async function checkUserLogin(req, res, next) {
  const { uid, token } = req.cookies;

  // if request do not have uid and token as cookie
  if (!uid || !token) {
    next();
    return;
  }

  req.user = { uid: uid, token };

  const checkUserApi = `${config.server}/api/user/checktoken`;

  // check the uid and the token is correct
  try {
    const data = await request(checkUserApi);
    // if correct then save userinfo into req.user
    if (data.checked === 1) {
      req.user = { ...req.user, userInfo: data.msg };
    } else {
      // or not delete uid and token
      res.clearCookie('uid');
      res.clearCookie('token');
    }
  } catch (e) {
    // error 
    res.clearCookie('uid');
    res.clearCookie('token');
  }

  next();
}

module.exports = checkUserLogin;
