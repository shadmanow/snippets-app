import {useCallback, useEffect, useState} from 'react';
import jwt from 'jsonwebtoken';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [_user, _setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token && !user) {
      await signOut();
      setReady(true);
      return;
    }

    const verified = await verify(token);

    if (verified) {
      await setAuth(token, user);
      setReady(true);
      return;
    }

    try {
      const response = await fetch('/auth/refresh-tokens', {method: 'POST'});
      const data = await response.json();

      if (response.ok) {
        await setAuth(data.accessToken, user);
      } else {
        await signOut();
      }

    } catch (e) {
      console.log(e.message)
    }

    setReady(true);
  }, []);

  const tryRefreshTokens = useCallback(async () => {
    try {
      const response = await fetch('/auth/refresh-tokens', {method: 'POST'});
      const data = await response.json();

      if (response.ok) {
        await setAuth(data.accessToken, data.user);
      } else {
        await signOut();
      }

    } catch (e) {
      console.log(e.message)
    }
  }, []);

  const setAuth = useCallback((token, user) => {
    setToken(token);
    _setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }, [token, _user]);

  const setUser = useCallback((user) => {
    _setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }, []);

  const verify = useCallback((_token) => {
    const checkToken = _token ? _token : token;
    if (!checkToken) return false;
    const {exp} = jwt.decode(checkToken);
    return exp > Math.round(Date.now() / 1000);
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    _setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  return {
    ready,
    token,
    user: _user,

    setToken,
    setUser,
    setAuth,
    signOut,

    verify,
    tryRefreshTokens,
  }
};