import React, {useContext, useEffect} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import './main-layout.scss'
import Header from '../../components/header/header';
import SnippetsPage from '../../pages/snippets-page';
import SettingsPage from '../../pages/settings-page';
import {AuthContext} from '../../context/auth-context';
import ProtectedRoute from '../../components/protected-route';
import LoginPage from '../../pages/login-page';
import SignUpPage from '../../pages/sign-up-page';
import ProfilePage from '../../pages/profile-page';
import NavLink from '../../components/nav-link';

export default function MainLayout() {

  const auth = useContext(AuthContext);

  useEffect(() => {

  }, []);

  return (
    <div className='main-layout'>
      <Header/>
      <main className='main'>
        <Switch>
          <ProtectedRoute exact path={[
            '/your-snippets',
            '/your-pins',
          ]} component={SnippetsPage} access={auth.token} redirectTo='/login'/>

          <Route exact path='/search' component={SnippetsPage}/>

          <ProtectedRoute
            path='/login'
            component={LoginPage}
            access={!auth.token}
            redirectTo='/search'/>

          <ProtectedRoute
            path='/sign-up'
            component={SignUpPage}
            access={!auth.token}
            redirectTo='/search'/>

          <ProtectedRoute exact path={[
            '/settings',
            '/settings/profile',
            '/settings/account',
            '/settings/editor',
          ]} component={SettingsPage} access={auth.token} redirectTo='/login'/>

          <Route component={ProfilePage} path='/profile/:username'/>

          <Redirect component={SnippetsPage} to='/search'/>
        </Switch>
      </main>
      <footer className='footer'>
        <NavLink to='//vk.com/societybolt' target='_blank'>
          Kudryashov PO-74
        </NavLink> Bachelor work
      </footer>
    </div>
  )
}