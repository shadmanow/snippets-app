const {Router} = require('express');

const AuthService = require('../services/AuthService');
const authParser = require('../middleware/authParser');
const router = Router();

const setRefreshTokenCookie = (res, value) => {
  res.cookie('token', value, {
    maxAge: 3600*1000,
    httpOnly: true,
    domain: 'localhost',
    // path: '/auth/'
  });
};

router.use(authParser);

router.post('/sign-up', (req, res) => {
  const {
    email,
    password,
    username,
    name,
    fingerprint
  } = req.body;

  new AuthService()
    .signUp(email, password, username, name, fingerprint)
    .then(auth => {
      setRefreshTokenCookie(res, auth.refreshToken.value);
      res.status(200).json({user: auth.user, accessToken: auth.accessToken});
    })
    .catch(error => res.status(400).json({error}));
});

router.post('/login', (req, res) => {
  const {emailOrUsername, password, fingerprint} = req.body;
  new AuthService()
    .login(emailOrUsername, password, fingerprint)
    .then(auth => {
      setRefreshTokenCookie(res, auth.refreshToken.value);
      res.status(200).json({user: auth.user, accessToken: auth.accessToken});
    })
    .catch(error => res.status(400).json({error}));
});

router.post('/refresh-tokens', (req, res) => {
  const {
    refreshToken,
    fingerprint,
  } = req.body;

  new AuthService()
    .refreshTokens(refreshToken, fingerprint)
    .then(tokens => {
      setRefreshTokenCookie(res, tokens.refreshToken.value);
      res.status(200).json({accessToken: tokens.accessToken});
    })
    .catch(error => {
      res.status(401).json({error});
    });
});

module.exports = router;


