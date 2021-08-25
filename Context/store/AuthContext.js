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

    AsyncStorage.getItem('jwt')
      .then((jwt) => {
        if (jwt && jwt.length > 0) {
          AsyncStorage.getItem('DateOfExpiration')
            .then((dateOfExpiration) => {
              if (dateOfExpiration && dateOfExpiration.length > 0) {
                const today = new Date();
                const futureDate = new Date(dateOfExpiration);
                if (futureDate.getTime() > today.getTime()) {
                  const decoded = jwtDecode(jwt);
                  dispatch(setCurrentUser(decoded));
                } else {
                  AsyncStorage.removeItem('jwt');
                  AsyncStorage.removeItem('DateOfExpiration');
                }
              }
            })
            .catch((err) => console.log(err.message));
        } else {
          console.log('jwt not found for the user');
        }
      })
      .catch((err) => console.log(err.message));
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
