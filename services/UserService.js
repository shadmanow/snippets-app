const fs = require('fs');
const {User} = require('../models');
const Errors = require('./Errors');
const GoogleStorage = require('../services/GoogleStorageService');
const MailSenderService = require('../services/MailSenderService');
const PasswordService = require('../services/PasswordService');
const SnippetService = require('../services/SnippetService');

const googleStorage = new GoogleStorage();
const passwordService = new PasswordService();

module.exports = function UserService() {
  this.uploadAvatar = (_id, file) => {
    return new Promise(async (resolve, reject) => {
      try {
        const buffer = fs.readFileSync(file.path);
        const uri = await googleStorage.upload(`${_id}/avatar.png`, buffer);
        await User.findOneAndUpdate({_id}, {avatar: uri});
        resolve({uri});
      } catch (e) {
        reject(e.message);
      }
    });
  };
  this.changeUsername = (_id, newUsername) => {
    return new Promise(async (resolve, reject) => {
      try {
        const exists = await User.findOne({username: newUsername}).exec();
        if (!exists) {
          await User.findOneAndUpdate({_id}, {username: newUsername});
        } else {
          throw new Error(Errors.USER_EXISTS_ERROR);
        }
        resolve();
      } catch (e) {
        reject(Errors.checkError(e.message));
      }
    });
  };
  this.changeEmail = (_id, newEmail) => {
    return new Promise(async (resolve, reject) => {
      try {
        try {
          const exists = await User.findOne({email: newEmail}).exec();
          if (!exists) {
            await User.findOneAndUpdate({_id}, {email: newEmail});
          } else {
            throw new Error(Errors.USER_EXISTS_ERROR);
          }
          resolve();
        } catch (e) {
          reject(Errors.checkError(e.message));
        }
      } catch (e) {
        reject(e.message);
      }
    });
  };
  this.changeProfile = (_id, fields = {}) => {
    return new Promise(async (resolve, reject) => {
      try {
        const {name, bio, contactLink, editor} = fields;
        const toUpdate = {};

        if (name && name.length) toUpdate.name = name;
        if (bio && bio.length) toUpdate.bio = bio;
        if (contactLink && contactLink.length) toUpdate.contactLink = contactLink;
        if (editor) toUpdate.editor = editor;

        console.log({...toUpdate});

        const user = await User.findOneAndUpdate(
          {_id},
          {...toUpdate},
          {new: true}
        );

        resolve({
          name: user.name,
          username: user.username,
          email: user.email,
          contactLink: user.contactLink,
          bio: user.bio,
          editor: user.editor,
          avatar: user.avatar,
          banner: user.banner
        });
      } catch (e) {
        reject(e.message);
      }
    });
  };
  this.changePassword = (_id, oldPassword, newPassword) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({_id});

        if (!passwordService.verifyPassword(oldPassword, user.password)) {
          throw new Error('Invalid password');
        }
        user.password = passwordService.hashPassword(newPassword);
        await user.save();

        resolve('Password changed');
      } catch (e) {
        reject(Errors.checkError(e.message))
      }

    });
  };
  this.findProfile = (username) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({username}).lean().exec();

        const snippets = await new SnippetService()
          .findSnippets({userId: user._id});

        delete user.password;

        resolve({
          ...user,
          snippets
        });

      } catch (e) {
        reject(e.message);
      }
    });
  };
  this.addPin = (_id, snippetId) => {
    return new Promise(async (resolve, reject) => {
      try {
        await User.findOneAndUpdate(
          {_id},
          {$addToSet: {pins: {snippetId}}});
        resolve('Pin added');
      } catch (e) {
        reject(e);
      }
    });
  };
  this.deletePin = (_id, snippetId) => {
    return new Promise(async (resolve, reject) => {
      try {
        await User.findOneAndUpdate(
          {_id},
          {$pull: {pins: {snippetId}}});
        resolve('Pin removed');
      } catch (e) {
        reject(e);
      }
    });
  };
  this.findSnippets = (selectors, skip, order) => {
    return new Promise(async (resolve, reject) => {
      try {

        const user = await User.findOne({_id: selectors.userId}).lean().exec();

        selectors.username = user.username;
        delete selectors.userId;

        const snippets = await new SnippetService()
          .findSnippets(selectors, order);

        for (let snippet of snippets) {
          snippet.canDeleted = true;
        }

        resolve(snippets);
      } catch (e) {
        reject(e.message);
      }
    });
  };
  this.findPins = (selectors, order) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({_id: selectors.userId}).exec();
        delete selectors.userId;

        selectors._id = {$in: user.pins.map(pin => pin.snippetId)};

        const snippets = await new SnippetService().findSnippets(
          selectors,
          order);

        const snippetIds = snippets.map(sp => sp._id);
        const removedIds =
          user.pins
            .map(pin => pin.snippetId)
            .filter(id => !snippetIds.includes(id));

        if (removedIds.length) {
          user.pins = user.pins.filter(pin => !removedIds.includes(pin.snippetId));
          await user.save();
        }

        resolve(snippets);
      } catch (e) {
        console.log(e);
        reject(e.message);
      }
    });
  };
  this.forgotPassword = (emailOrUsername) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({
          $or: [
            {email: emailOrUsername},
            {username: emailOrUsername}
          ]
        });

        if (!user)
          throw new Error(Errors.USER_NOT_EXISTS_ERROR);

        user.password = passwordService.generatePassword();
        await user.save();

        await new MailSenderService().send(
          user.email,
          'Forgot password',
          `Hi, ${user.username}! Your new password: ${password}`);
        resolve();
      } catch (e) {
        reject(Errors.checkError(e.message));
      }
    });
  }
};

