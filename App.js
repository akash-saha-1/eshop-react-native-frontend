import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

//redux
import { Provider, Providers } from 'react-redux';
import store from './Redux/store';

//Screens
import Header from './Shared/Header';
//Navigators
import Main from './Navigators/Main';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Header />
        <Main />
      </NavigationContainer>
    </Provider>
  );
}
