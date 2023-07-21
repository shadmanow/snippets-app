import {useCallback, useContext, useState} from 'react';
import {AuthContext} from '../context/auth-context';

export default function useHttpServices() {
  const {token, tryRefreshTokens} = useContext(AuthContext);
  const [loading, setLoading] = useState({
    login: false,
    signUp: false,
    forgotPassword: false,

    findProfile: false,
    findSnippets: false,
    findUserSnippets: false,
    findSnippetDetails: false,
    findSnippetComments: false,

    changeAvatar: false,
    changeBanner: false,
    changeProfile: false,
    changePassword: false,


    saveSnippet: false,
    updateSnippet: false,
    deleteSnippet: false,
    snippetViewAnalytics: false,

    addPin: false,
    findPins: false,
    deletePin: false,

    addComment: false,
    deleteComment: false,
  });

  const post = useCallback(async (url, body, headers = {}) => {
    headers['Authorization'] = `Bearer ${token}`;
    headers['Content-Type'] = 'application/json';

    if (body) body = JSON.stringify(body);

    const response = await fetch(url, {
      method: 'POST',
      body,
      headers,
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        await tryRefreshTokens();
        const response = await fetch(url, {
          method: 'POST',
          body,
          headers,
          credentials: 'include'
        });
        return await response.json();
      }
      throw new Error(data.error || 'Unknown error');
    }

    return data;
  }, []);
  const get = useCallback(async (url, headers = {}) => {
    headers['Authorization'] = `Bearer ${token}`;
    headers['Content-Type'] = 'application/json';

    const response = await fetch(url, {method: 'GET', headers});
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        await tryRefreshTokens();
        const response = await fetch(url, {method: 'GET', headers});
        const data = await response.json();
        setLoading(false);
        return data;
      }
      throw new Error(data.error || 'Unknown error');
    }
    return data;
  }, []);

  const findProfile = useCallback(async (username) => {
    setLoading({...loading, findProfile: true});
    try {
      const profile = await get(`/user/profile/${username}`);
      setLoading({...loading, findProfile: false});
      return profile;
    } catch (e) {
      setLoading({...loading, findProfile: false});
      throw e;
    }
  }, []);
  const findSnippets = useCallback(async (params) => {
    setLoading({...loading, findSnippets: true});
    try {
      const snippets = await get(`/snippet/find/${params}`);
      setLoading({...loading, findSnippets: false});
      return snippets;
    } catch (e) {
      setLoading({...loading, findSnippets: false});
      throw e;
    }
  }, []);
  const findUserSnippets = useCallback(async (params) => {
    setLoading({...loading, findUserSnippets: true});
    try {
      const snippets = await post(`/user/snippets/${params}`);
      setLoading({...loading, findUserSnippets: false});
      return snippets;
    } catch (e) {
      setLoading({...loading, findUserSnippets: false});
      throw e;
    }
  }, []);
  const findSnippetDetails = useCallback(async (snippetId) => {
    setLoading({...loading, findSnippetDetails: true});
    try {
      const details = await post(`/snippet/details`, {
        snippetId
      });
      setLoading({...loading, findSnippetDetails: false});
      return details;
    } catch (e) {
      setLoading({...loading, findSnippetDetails: false});
      throw e;
    }
  }, []);
  const findSnippetComments = useCallback(async (snippetId, skip = 0) => {
    setLoading({...loading, findSnippetComments: true});
    try {
      const comments = await post(`/snippet/comments`, {
        snippetId,
        skip
      });
      setLoading({...loading, findSnippetComments: false});
      return comments;
    } catch (e) {
      setLoading({...loading, findSnippetComments: false});
      throw e;
    }
  }, []);
  const saveSnippet = useCallback(async (snippet) => {
    setLoading({...loading, saveSnippet: true});
    try {
      const snippetId = await post(`/snippet/save`, {snippet});
      setLoading({...loading, saveSnippet: false});
      return snippetId;
    } catch (e) {
      setLoading({...loading, saveSnippet: false});
      throw e;
    }
  }, []);
  const updateSnippet = useCallback(async (snippet) => {
    setLoading({...loading, updateSnippet: true});
    try {
      const snippetId = await post(`/snippet/update`, {snippet});
      setLoading({...loading, updateSnippet: false});
      return snippetId;
    } catch (e) {
      setLoading({...loading, updateSnippet: false});
      throw e;
    }
  }, []);
  const deleteSnippet = useCallback(async (snippetId) => {
    setLoading({...loading, deleteSnippet: true});
    try {
      await post(`/snippet/delete`, {snippetId});
      setLoading({...loading, deleteSnippet: false});
    } catch (e) {
      setLoading({...loading, deleteSnippet: false});
      throw e;
    }
  }, []);
  const snippetViewAnalytics = useCallback(async (snippetId) => {
    setLoading({...loading, snippetViewAnalytics: true});
    try {
      await post(`/snippet/view-analytics`, {snippetId});
      setLoading({...loading, snippetViewAnalytics: false});
    } catch (e) {
      setLoading({...loading, snippetViewAnalytics: false});
      throw e;
    }
  }, []);

  const login = useCallback(async (emailOrUsername, password) => {
    setLoading({...loading, login: true});
    try {
      const auth = await post('/auth/login', {emailOrUsername, password});
      setLoading({...loading, logIn: false});
      return auth;
    } catch (e) {
      setLoading({...loading, logIn: false});
      throw e;
    }
  }, []);
  const signUp = useCallback(async (email, password, username, name) => {
    setLoading({...loading, signUp: true});
    try {
      const auth = await post('/auth/sign-up', {email, password, username, name});
      setLoading({...loading, signUp: false});
      return auth;
    } catch (e) {
      setLoading({...loading, signUp: false});
      throw e;
    }
  }, []);
  const forgotPassword = useCallback(async (emailOrUsername) => {
    setLoading({...loading, forgotPassword: true});
    try {
      const {message} = await post('/user/forgot-password', {emailOrUsername});
      setLoading({...loading, forgotPassword: false});
      return message;
    } catch (e) {
      setLoading({...loading, forgotPassword: false});
      throw e;
    }
  }, []);

  const changeAvatar = useCallback(async (img) => {
    setLoading({...loading, changeAvatar: true});
    try {

      const headers = {'Authorization': `Bearer ${token}`};

      const form = new FormData();
      form.append('avatar', img);

      const response = await fetch('/user/change-avatar', {
        method: 'POST',
        headers,
        body: form
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          await tryRefreshTokens();
          const response = await fetch('/user/change-avatar', {
            method: 'POST',
            headers,
            body: form
          });
          return await response.json();
        }
        throw new Error(data.error || 'Unknown error');
      }
      setLoading({...loading, changeAvatar: false});
      return data.uri;
    } catch (e) {
      setLoading({...loading, changeAvatar: false});
      throw e;
    }
  }, []);
  const changeEmail = useCallback(async (newEmail) => {
    setLoading({...loading, changeEmail: true});
    try {
      const {message} = await post('/user/change-email', {newEmail});
      setLoading({...loading, changeBanner: false});
      return message;
    } catch (e) {
      setLoading({...loading, changeEmail: false});
      throw e;
    }
  }, []);
  const changeUsername = useCallback(async (newUsername) => {
    setLoading({...loading, changeUsername: true});
    try {
      const {message} = await post('/user/change-username', {newUsername});
      setLoading({...loading, changeUsername: false});
      return message;
    } catch (e) {
      setLoading({...loading, changeUsername: false});
      throw e;
    }
  }, []);
  const changeProfile = useCallback(async (fields) => {
    setLoading({...loading, changeProfile: true});
    try {
      const {message} = await post('/user/change-profile', {fields});
      setLoading({...loading, changeProfile: false});
      return message;
    } catch (e) {
      setLoading({...loading, changeProfile: false});
      throw e;
    }
  }, []);
  const changePassword = useCallback(async (newPassword, oldPassword) => {
    setLoading({...loading, changePassword: true});
    try {
      const {message} = await post('/user/change-password', {newPassword, oldPassword});
      setLoading({...loading, changePassword: false});
      return message;
    } catch (e) {
      setLoading({...loading, changePassword: false});
      throw e;
    }
  }, []);

  const findPins = useCallback(async () => {
    setLoading({...loading, findPins: true});
    try {
      const snippets = await post('/user/pins');
      setLoading({...loading, findPins: false});
      return snippets;
    } catch (e) {
      setLoading({...loading, findPins: false});
      throw e;
    }
  }, []);
  const addPin = useCallback(async (snippetId) => {
    setLoading({...loading, addPin: true});
    try {
      const {message} = await post('/user/add-pin', {snippetId});
      setLoading({...loading, addPin: false});
      return message;
    } catch (e) {
      setLoading({...loading, addPin: false});
      throw e;
    }
  }, []);
  const deletePin = useCallback(async (snippetId) => {
    setLoading({...loading, deletePin: true});
    try {
      const {message} = await post('/user/delete-pin', {snippetId});
      setLoading({...loading, deletePin: false});
      return message;
    } catch (e) {
      setLoading({...loading, deletePin: false});
      throw e;
    }
  }, []);

  const deleteComment = useCallback(async (snippetId, commentId) => {
    setLoading({...loading, deleteComment: true});
    try {
      const {message} = await post('/snippet/delete-comment', {snippetId, commentId});
      setLoading({...loading, deleteComment: false});
      return message;
    } catch (e) {
      setLoading({...loading, deleteComment: false});
      throw e;
    }
  }, []);
  const addComment = useCallback(async (snippetId, text) => {
    setLoading({...loading, addComment: true});
    try {
      const {message} = await post('/snippet/add-comment', {snippetId, text});
      setLoading({...loading, addComment: false});
      return message;
    } catch (e) {
      setLoading({...loading, addComment: false});
      throw e;
    }
  }, []);

  return {
    findProfile: {request: findProfile, loading: loading.findProfile},
    findSnippets: {request: findSnippets, loading: loading.findSnippets},
    findUserSnippets: {request: findUserSnippets, loading: loading.findUserSnippets},
    findSnippetDetails: {request: findSnippetDetails, loading: loading.findSnippetDetails},
    findSnippetComments: {request: findSnippetComments, loading: loading.findSnippetComments},

    addComment: {request: addComment, loading: loading.addComment},
    deleteComment: {request: deleteComment, loading: loading.deleteComment},

    saveSnippet: {request: saveSnippet, loading: loading.saveSnippet},
    updateSnippet: {request: updateSnippet, loading: loading.updateSnippet},
    deleteSnippet: {request: deleteSnippet, loading: loading.deleteSnippet},
    snippetViewAnalytics: {request: snippetViewAnalytics, loading: loading.snippetViewAnalytics},

    findPins: {request: findPins, loading: loading.findPins},
    addPin: {request: addPin, loading: loading.addPin},
    deletePin: {request: deletePin, loading: loading.deletePin},

    login: {request: login, loading: loading.login},
    signUp: {request: signUp, loading: loading.signUp},
    forgotPassword: {request: forgotPassword, loading: loading.forgotPassword},

    changeAvatar: {request: changeAvatar, loading: loading.changeAvatar},
    changeUsername: {request: changeUsername, loading: loading.changeUsername},
    changeEmail: {request: changeEmail, loading: loading.changeEmail},
    changeProfile: {request: changeProfile, loading: loading.changeProfile},
    changePassword: {request: changePassword, loading: loading.changePassword},
  };
}