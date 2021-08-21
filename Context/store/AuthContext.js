import React, { useReducer, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthReducers from '../reducers/AuthReducers';
import { setCurrentUser } from '../actions/AuthActions';
import AuthGlobal from './AuthGlobal';

const AuthContext = (props) => {
  const [state, dispatch] = useReducer(AuthReducers, {
    isAuthenticated: null,
    user: {},
    loading: false,
  });

  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    setShowChild(true);
    if (AsyncStorage.jwt) {
      const decoded = AsyncStorage.jwt;
      if (setShowChild) {
        dispatch(setCurrentUser(jwtDecode(decoded)));
      }
    }
  }, []);

  if (!showChild) {
    return null;
  } else {
    return (
      <AuthGlobal.Provider value={{ state, dispatch }}>
        {props.children}
      </AuthGlobal.Provider>
    );
  }
};

export default AuthContext;
