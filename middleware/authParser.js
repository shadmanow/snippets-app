const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let accessToken = req.get('Authorization');
  if (accessToken) {
    accessToken = accessToken.replace("Bearer ", "");
    if (accessToken !== "null" && accessToken !== "undefined") {
      const {userId} = jwt.decode(accessToken);
      req.body.userId = userId;
      req.body.accessToken = accessToken;
    }
  }
  req.body.refreshToken = req.cookies['token'];
  req.body.fingerprint = req.get('user-agent');

  next();
};

