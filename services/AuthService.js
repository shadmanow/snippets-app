const jwt = require('jsonwebtoken');
const {v4: uuid} = require('uuid');
const config = require('config');

const ERRORS = require('./Errors');
const PasswordService = require('../services/PasswordService');
const GoogleStorage = require('../services/GoogleStorageService');
const {User, Token} = require('../models');

const passwordService = new PasswordService();

module.exports = function AuthService() {

  this.signUp = (email, password, username, name, fingerprint) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({$or: [{email}, {username}]}).exec();

        if (user != null) throw new Error(ERRORS.USER_EXISTS_ERROR);

        console.log(email, password, username, name);

        const newUser = await User.create({
          email,
          name,
          username,
          password: passwordService.hashPassword(password)
        });

        await new GoogleStorage().upload(newUser._id + '/', '',
          {metadata: {email, name, username}});

        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken();

        await Token.create({
          tokenId: refreshToken.id,
          userId: newUser._id,
          exp: refreshToken.exp,
          fingerprint
        });

        resolve({
          accessToken,
          refreshToken,
          user: {
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            contactLink: newUser.contactLink,
            bio: newUser.bio,
            editor: newUser.editor,
            avatar: newUser.avatar,
            banner: newUser.banner,
          }
        });
      } catch (e) {
        reject(ERRORS.checkError(e.message));
      }
    });
  };

  this.login = (emailOrUsername, password, fingerprint) => {
    return new Promise(async (resolve, reject) => {
      try {

        const user = await User.findOne({
          $or: [
            {email: emailOrUsername},
            {username: emailOrUsername}
          ]
        }).exec();

        if (user == null) throw new Error(ERRORS.USER_NOT_EXISTS_ERROR);

        if (!passwordService.verifyPassword(password, user.password))
          throw new Error(ERRORS.INVALID_PASSWORD_ERROR);

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken();

        await Token.create({
          tokenId: refreshToken.id,
          userId: user._id,
          exp: refreshToken.exp,
          fingerprint
        });

        resolve({
          accessToken,
          refreshToken,
          user: {
            name: user.name,
            username: user.username,
            email: user.email,
            contactLink: user.contactLink,
            bio: user.bio,
            editor: user.editor,
            avatar: user.avatar,
            banner: user.banner,
          }
        });

      } catch (e) {
        reject(ERRORS.checkError(e.message));
      }
    });

  };

  this.refreshTokens = (refreshToken, fingerprint) => {
    return new Promise(async (resolve, reject) => {
      try {

        if (refreshToken == null) throw new Error(ERRORS.REFRESH_TOKEN_ERROR);

        const tokenFromDB = await verifyRefreshToken(refreshToken, fingerprint);
        const newAccessToken = generateAccessToken(tokenFromDB.userId);
        const newRefreshToken = generateRefreshToken(tokenFromDB.tokenId);

        await Token.findOneAndUpdate({tokenId: tokenFromDB.tokenId}, {
          exp: newRefreshToken.exp
        });

        resolve({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        });
      } catch (e) {
        reject(ERRORS.checkError(e.message));
      }
    });

  };

  this.verifyAccessToken = (accessToken) => {
    return new Promise((resolve, reject) => {
      try {
        jwt.verify(accessToken, config.get('jwt.secret'));
        resolve();
      } catch (e) {
        reject(ERRORS.checkError(e.message));
      }
    });
  }
};

const generateAccessToken = (userId) => {
  const payload = {userId, type: config.get('jwt.access_type')};
  const options = {expiresIn: config.get('jwt.access_expires_in')};
  return jwt.sign(payload, config.get('jwt.secret'), options);
};

const generateRefreshToken = (id) => {
  const payload = {id: id ? id : uuid(), type: config.get('jwt.refresh_type')};
  const options = {expiresIn: config.get('jwt.refresh_expires_in')};
  const value = jwt.sign(payload, config.get('jwt.secret'), options);
  const {exp} = jwt.decode(value);
  return {
    id: payload.id,
    exp,
    value
  };
};

const verifyRefreshToken = async (refreshToken, fingerprint) => {
  const {exp, id} = jwt.decode(refreshToken);
  const tokenFromDB = await Token.findOne({tokenId: id});

  if (!tokenFromDB || tokenFromDB.fingerprint !== fingerprint) {
    await Token.deleteOne({tokenId: id});
    throw new Error(ERRORS.REFRESH_TOKEN_INVALID_ERROR);
  }

  try {
    jwt.verify(refreshToken, config.get('jwt.secret'));
  } catch (e) {
    console.log(e.message);
    await Token.deleteOne({tokenId: id});
    throw new Error(ERRORS.REFRESH_TOKEN_INVALID_ERROR);
  }

  if (exp !== tokenFromDB.exp) {
    console.log(exp, tokenFromDB.exp);
    await Token.deleteMany({userId: tokenFromDB.userId});
    throw new Error(ERRORS.REFRESH_TOKEN_INVALID_ERROR);
  }

  return tokenFromDB;
};


