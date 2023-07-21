import React from 'react';
import './settings-page.scss';

import {Redirect, Route, Switch} from 'react-router-dom';
import NavLink from '../../components/nav-link';
import ProfileSettings from '../profile-settings-page';
import AccountSettings from '../account-settings-page';
import EditorSettings from '../editor-settings-page';

export default function SettingsPage() {
  return (
    <div className='settings-page'>

      <div className='wrapper'>
        <aside className='sidebar'>
          <span className='title'>Настройки</span>
          <NavLink to='/settings/profile'>Профиль</NavLink>
          <NavLink to='/settings/account'>Аккаунт</NavLink>
          <NavLink to='/settings/editor'>Редактор</NavLink>
        </aside>

        <div className='content'>
          <Switch>
            <Route path='/settings/profile' component={ProfileSettings}/>
            <Route path='/settings/account' component={AccountSettings}/>
            <Route path='/settings/editor' component={EditorSettings}/>
            <Redirect from='/settings' to='/settings/profile'/>
          </Switch>
        </div>
      </div>

    </div>
  )
}