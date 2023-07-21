const AuthService = require('../services/AuthService');

module.exports = async (req, res, next) => {
  if (req.body.accessToken) {
    try {
      await new AuthService().verifyAccessToken(req.body.accessToken);
      next();
    }catch (e) {
      console.log(e);
      res.status(401).json({error: 'Access Token is not provided!'});
    }
  }
};

