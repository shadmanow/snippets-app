import React, {useContext} from 'react';
import './user-menu.scss'

import {Link} from 'react-router-dom';
import {AuthContext} from '../../context/auth-context';
import Button from '../button';
import Dropdown from '../dropdown';
import {codeImg, settingsImg, signOutImg} from '../../assets/images';

export default function UserMenu() {

  const {token, user, signOut} = useContext(AuthContext);

  return (
    <div className='UserMenu'>

      {!token && <Button className='login-btn'><Link to='/login'>Войти</Link></Button>}
      {!token && <Button className='sign-up-btn'><Link to='/sign-up'>Регистрация</Link></Button>}

      {
        token &&
        <Dropdown>
          <img
            className='user-avatar'
            alt='user-img'
            src={user ? user.avatar : null}
          />
          <Link to={`/profile/${user ? user.username : null}`}>
            <span>Профиль</span>
          </Link>
          <Link to='/editor'>
            <img alt='code-img' src={codeImg}/>
            Создать
          </Link>
          <Link to='/your-snippets/'>
            Сниппеты
          </Link>
          <Link to='/your-pins'>
            Закрепленные
          </Link>
          <Link to='/settings/profile'>
            <img alt='setting-img' src={settingsImg}/>
            Настройки
          </Link>
          <Link to='/search' onClick={async () => await signOut()}>
            <img alt='sign-out-img' src={signOutImg}/>
            Выйти
          </Link>
        </Dropdown>
      }
    </div>
  )
}