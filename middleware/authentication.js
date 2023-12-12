const {validateToken} = require("../services/auth")
function checkAuthenticationCookie(req,res,next) {
    const tokenCookieValue = req.cookies?.token;
    if(!tokenCookieValue) return next();
    try {
      const userPayLoad = validateToken(tokenCookieValue);
      req.user = userPayLoad;
    } catch(error){};
    next();
}

module.exports ={
  checkAuthenticationCookie
}