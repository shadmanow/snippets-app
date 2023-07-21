import React from 'react';
import {positions, Provider as AlertProvider} from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import {Route, Switch} from 'react-router-dom';
import EditorPage from './pages/editor-page';
import {AuthContext} from './context/auth-context';
import {useAuth} from './hooks/useAuth';
import {ModalProvider} from 'react-modal-hook';
import MainLayout from './layouts/main-layout';


const ALERT_OPTIONS = {
  timeout: 5000,
  position: positions.BOTTOM_RIGHT
};

function App() {

  const {token, verify, user, ready, setAuth, setUser, setToken, tryRefreshTokens, signOut } = useAuth();

  if (!ready) {
    return <h1>Please wait. Loading...</h1>
  }

  console.log(user);

  return (
    <AuthContext.Provider value={{token, verify, user, setAuth, setUser, setToken, tryRefreshTokens, signOut }}>
      <AlertProvider template={AlertTemplate} {...ALERT_OPTIONS}>
        <ModalProvider>
          <Switch>
            <Route path='/editor/:username?/:snippetId?' component={EditorPage}/>
            <Route path='/' component={MainLayout}/>
          </Switch>
        </ModalProvider>
      </AlertProvider>
    </AuthContext.Provider>
  );
}

export default App;
