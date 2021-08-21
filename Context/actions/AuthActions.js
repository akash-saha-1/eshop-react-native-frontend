import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import config from './../../config/config';
import jwtDecode from 'jwt-decode';

export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_LOADING_TRUE = 'SET_LOADING_TRUE';
export const SET_LOADING_FALSE = 'SET_LOADING_FALSE';

export const loginUser = (user, dispatch) => {
  dispatch(setLoading(true));

  fetch(`${config.SERVER_URL}/users/login`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      if (data) {
        const token = data.token;
        AsyncStorage.setItem('jwt', token);
        const decoded = jwtDecode(token);
        dispatch(setCurrentUser(decoded, user));
      } else {
        logout(dispatch);
      }
    })
    .catch((err) => {
      Toast.show({
        topOffset: 70,
        type: 'error',
        text1: 'Please provide correct credentials',
        text2: '',
      });
      logout(dispatch);
    })
    .finally(() => {
      dispatch(setLoading(false));
    });
};

export const logout = (dispatch) => {
  AsyncStorage.removeItem('jwt');
  dispatch(setCurrentUser({}));
};

export const setCurrentUser = (decoded, user) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
    userProfile: user,
  };
};

export const setLoading = (loading) => {
  if (loading === true) {
    return {
      type: SET_LOADING_TRUE,
    };
  } else {
    return {
      type: SET_LOADING_FALSE,
    };
  }
};
