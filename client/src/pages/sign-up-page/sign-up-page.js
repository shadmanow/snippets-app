import React, {useContext, useState} from 'react';
import {useHistory} from 'react-router-dom';
import './sign-up-page.scss';
import useHttpServices from '../../hooks/useHttpServices';
import {AuthContext} from '../../context/auth-context';
import Button from '../../components/button';
import Logo from '../../components/logo';
import {useAlert} from 'react-alert';


export default function SignUpPage() {
  const alert = useAlert();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const {signUp} = useHttpServices();

  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    username: false,
    name: false,
    email: false,
    password: false,
  });

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value});
    setErrors({...errors, [event.target.name]: false});
  };

  const signUpHandler = async () => {
    // if (!validation()) return;
    try {
      const data = await signUp.request(form.email, form.password, form.username, form.name);
      await auth.setAuth(data.accessToken, data.user);
      alert.success('Профиль создан.');
      history.push(`/profile/${data.user.username}`);
    } catch (e) {
      alert.error(e.message);
    }
  };

  const validation = () => {
    const _errors = {};
    if (form.email.search('".+@.+\\\\..+"') === -1) {
      _errors.email = true;
    }
    for (let field in form) {
      if (form.hasOwnProperty(field) && field !== 'email') {
        _errors[field] = form[field].length === 0;
      }
    }
    setErrors({ ...errors, ... _errors });
    return Object.keys(_errors).length === 0;
  };

  return (
    <div className='sign-up-page'>

      <header className='header'>
        <Logo/>
        <span>Регистрация</span>
      </header>

      <div className='form'>
        <div className='input-wrapper'>
          <span className='input-title'>Выберете имя пользователя</span>
          <input
            placeholder=""
            type="text"
            name="username"
            value={form.username}
            onChange={changeHandler}
          />
          {errors.username && <span className='danger'>Никнейм обязателен</span>}
        </div>

        <div className='input-wrapper'>
          <span className='input-title'>Ваше реальное имя</span>
          <input
            placeholder=""
            type="text"
            name="name"
            value={form.name}
            onChange={changeHandler}
          />
          {errors.name && <span className='danger'>Имя обязательно</span>}
        </div>

        <div className='input-wrapper'>
          <span className='input-title'>Электронная почта</span>
          <input
            placeholder=""
            type="text"
            name="email"
            value={form.email}
            onChange={changeHandler}
          />
          {errors.email && <span className='danger'>Некорректная электронная почта</span>}
        </div>

        <div className='input-wrapper'>
          <span className='input-title'>Пароль</span>
          <input
            placeholder=""
            type="password"
            name="password"
            value={form.password}
            onChange={changeHandler}
          />
          {errors.password && <span className='danger'>Пароль обязателен</span>}
        </div>

        <Button
          loading={signUp.loading}
          onClick={signUpHandler}
        >
          <span>Зарегистрироваться</span>
        </Button>
      </div>
    </div>
  )
}