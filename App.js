import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

//redux
import { Provider } from 'react-redux';
import store from './Redux/store';

//Screens
import Header from './Shared/Header';
//Navigators
import Main from './Navigators/Main';
//AuthContext API
import AuthContext from './Context/store/AuthContext';

export default function App() {
  return (
    <AuthContext>
      <Provider store={store}>
        <NavigationContainer>
          <Header />
          <Main />
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </Provider>
    </AuthContext>
  );
}
