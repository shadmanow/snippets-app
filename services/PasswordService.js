const bCrypt = require('bcrypt');
const genPass = require('password-generator');
const salt = bCrypt.genSaltSync(10);

module.exports = function PasswordService() {
  this.hashPassword = (password) => {
    return bCrypt.hashSync(password, salt);
  };
  this.verifyPassword = (firstPass, secondPass) => {
    return bCrypt.compareSync(firstPass, secondPass);
  };
  this.generatePassword = () => {
    return this.hashPassword(genPass(8));
  };
};

