import React, {useContext, useState} from 'react';
import {useHistory} from 'react-router-dom';

import './login-page.scss';
import {AuthContext} from '../../context/auth-context';
import useHttpServices from '../../hooks/useHttpServices';
import Button from '../../components/button';
import NavLink from '../../components/nav-link';
import {useAlert} from 'react-alert';
import Logo from '../../components/logo';

export default function LoginPage() {
  const auth = useContext(AuthContext);
  const alert = useAlert();
  const history = useHistory();

  const [forgotDisabled, setForgotDisabled] = useState(true);
  const {login, forgotPassword} = useHttpServices();

  const [form, setForm] = useState({
    forgotEmailOrUsername: '',
    emailOrUsername: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    forgotEmailOrUsername: false,
    emailOrUsername: false,
    password: false,
  });

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value});
    setErrors({...errors, [event.target.name]: false});
  };

  const loginHandler = async () => {
    if (!formValidation()) return;
    try {
      const data = await login.request(form.emailOrUsername, form.password);
      await auth.setAuth(data.accessToken, data.user);
      alert.success('Вы пошли в профиль.');
      history.push(`/profile/${data.user.username}`);
    } catch (e) {
      alert.error(e.message);
    }
  };

  const onForgotHandler = async () => {
    if (!forgotValidation()) return;
    try {
      const message = await forgotPassword.request(form.forgotEmailOrUsername);
      alert.success(message);
    } catch (e) {
      alert.error(e.message);
    }
  };

  const formValidation = () => {
    const _errors = {};
    if (form.emailOrUsername.length === 0) {
      _errors.emailOrUsername = true;
    }
    if (form.password.length === 0) {
      _errors.password = true;
    }
    setErrors({...errors, ..._errors});
    return Object.keys(_errors).length === 0;
  };

  const forgotValidation = () => {
    const _errors = {};
    if (form.forgotEmailOrUsername.length === 0) {
      _errors.forgotEmailOrUsername = true;
    }
    setErrors({...errors, ..._errors});
    return Object.keys(_errors).length === 0;
  };

  return (
    <div className='login-page'>

      <header className='header'>
        <Logo/>
        <span>Вход</span>
      </header>

      <div className='form'>

        <div className='input-wrapper'>
          <span className='input-title'>Почта или имя пользователя</span>
          <input
            type="text"
            name="emailOrUsername"
            value={form.emailOrUsername}
            onChange={changeHandler}
          />
          {errors.emailOrUsername && <span className='danger'>Поле не должно быть пустым.</span>}
        </div>

        <div className='input-wrapper'>
          <span className='input-title'>Пароль</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={changeHandler}/>
          {errors.password && <span className='danger'>Пароль обязателен.</span>}
        </div>

        <Button
          onClick={loginHandler}
          loading={login.loading}
        >
          <span>Войти</span>
        </Button>
      </div>

      <NavLink
        to='#'
        className='forgot-password-link'
        onClick={() => setForgotDisabled(!forgotDisabled)}
      >
        Забыли пароль?
      </NavLink>

      <div className={`form ${forgotDisabled ? 'disabled' : ''}`}>
        <div className='input-wrapper'>
          <span className='input-title'>Имя пользователя или электронная почта</span>
          <input
            placeholder="your@email.com"
            type="text"
            name="forgotEmailOrUsername"
            value={form.forgotEmailOrUsername}
            onChange={changeHandler}
          />
          {errors.forgotEmailOrUsername && <span className='danger'>Поле не должно быть пустым.</span>}
        </div>
        <Button onClick={onForgotHandler}>
          <span>Отправить на почту новый пароль</span>
        </Button>
      </div>


      <div className='sign-up-callout'>
        <span>Нет аккаунта? <NavLink to='/sign-up'>Зарегистрируйся сейчас!</NavLink></span>
      </div>
    </div>
  )
}