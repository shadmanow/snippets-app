import React, {useContext, useState} from 'react'

import {useAlert} from 'react-alert';
import useHttpServices from '../../hooks/useHttpServices';

import Button from '../../components/button';
import {AuthContext} from '../../context/auth-context';

export default function AccountSettingsPage() {
  const auth = useContext(AuthContext);
  const alert = useAlert();
  const {
    changeUsername,
    changeEmail,
    changePassword
  } = useHttpServices();

  const [account, setAccount] = useState({
    username: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    ...auth.user
  });

  const inputHandler = e => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value
    });
  };

  const onUsernameSave = async () => {
    try {
      await changeUsername.request(account.username);
      auth.setUser({ ...auth.user, username: account.username});
      alert.success('Имя пользователя изменено');
    } catch (e) {
      alert.error(e.message);
    }
  };

  const onEmailSave = async () => {
    try {
      await changeEmail.request(account.email);
      auth.setUser({ ...auth.user, email: account.email});
      alert.success('Электронная почта изменена');
    } catch (e) {
      alert.error(e.message);
    }
  };

  const onPasswordSave = async () => {
    try {
      await changePassword.request(
        account.newPassword,
        account.oldPassword
      );
      alert.success('Пароль изменен');
    } catch (e) {
      alert.error(e.message);
    }
  };

  return (
    <div className='settings account-settings'>

      <section className='section'>
        <span className='section-title'>Username</span>
        <span className='section-description'>
          You can change username. Но будьте осторожны, все ваши старые ссылки приведут в 404.
        </span>

        <div className='section-content'>
          <div className='input-wrapper'>
            <span className='input-title'>Username</span>
            <input
              type='text'
              name='username'
              value={account.username}
              onChange={inputHandler}
            />
          </div>
          <Button onClick={onUsernameSave}>
            <span>Change username</span>
          </Button>
        </div>
      </section>

      <section className='section'>
        <span className='section-title'>Пароль</span>
        <span className='section-description'>Вы можете поменять пароль.</span>
        <div className='section-content'>
          <div className='input-wrapper'>
            <span className='input-title'>Current Password</span>
            <input
              type='password'
              name='oldPassword'
              value={account.oldPassword}
              onChange={inputHandler}
            />
          </div>
          <div className='input-wrapper'>
            <span className='input-title'>New Password</span>
            <input
              type='password'
              name='newPassword'
              value={account.newPassword}
              onChange={inputHandler}
            />
          </div>
          <Button onClick={onPasswordSave}>
            <span>Change password</span>
          </Button>
        </div>
      </section>

      <section className='section'>
        <span className='section-title'>Почта</span>
        <span className='section-description'>Сюда будут приходить все уведомления.</span>

        <div className='section-content'>
          <div className='input-wrapper'>
            <span className='input-title'>Email</span>
            <input
              type='text'
              name='email'
              value={account.email}
              onChange={inputHandler}
            />
          </div>
          <Button onClick={onEmailSave}>
            <span>Change Email</span>
          </Button>
        </div>
      </section>
    </div>
  )
}