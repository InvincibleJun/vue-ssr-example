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

  // const checkUserApi = `${config.server}/api/user/checktoken`;

  // check the uid and the token is correct
  // const response = await request(checkUserApi);

  // // if correct then save userinfo into req.user
  // if (response.code === 200 && response.msg.checked === 1) {
  //   req.user = { userInfo: response.msg.userInfo, token };
  // } else {
  //   // or not delete uid and token
  //   res.clearCookie('uid');
  //   res.clearCookie('token');
  // }

  // next();
}

module.exports = checkUserLogin;
