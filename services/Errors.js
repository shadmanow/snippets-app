const USER_EXISTS_ERROR = 'Пользователь с таким именем или почтой уже существует.';
const USER_NOT_EXISTS_ERROR = 'Такого пользователя не существует.';
const INVALID_PASSWORD_ERROR = 'Неправильный пароль.';
const REFRESH_TOKEN_ERROR = 'Токен обновления не предоставлен.';
const REFRESH_TOKEN_INVALID_ERROR = 'Токен обновления не валиден.';
const ACCESS_TOKEN_INVALID_ERROR = 'Токен доступа не валиден.';
const UNKNOWN_ERROR = 'Неизвестная ошибка.';

const ERRORS = [
  USER_EXISTS_ERROR,
  USER_NOT_EXISTS_ERROR,
  INVALID_PASSWORD_ERROR,
  REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN_INVALID_ERROR,
  ACCESS_TOKEN_INVALID_ERROR,
  UNKNOWN_ERROR,
];

module.exports = {
  USER_EXISTS_ERROR,
  USER_NOT_EXISTS_ERROR,
  INVALID_PASSWORD_ERROR,
  REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN_INVALID_ERROR,
  ACCESS_TOKEN_INVALID_ERROR,
  UNKNOWN_ERROR,

  checkError: (error) => {
    if (ERRORS.includes(error)) {
      return error;
    } else {
      console.error(error);
      return UNKNOWN_ERROR;
    }
  }
};