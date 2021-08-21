import isEmpty from '../../assets/common/isEmpty';
import {
  SET_CURRENT_USER,
  SET_LOADING_TRUE,
  SET_LOADING_FALSE,
} from '../actions/AuthActions';

export default function (state, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        userProfile: action.userProfile,
      };
    case SET_LOADING_TRUE:
      return {
        ...state,
        loading: true,
      };
    case SET_LOADING_FALSE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
