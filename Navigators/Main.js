import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

//Stacks
import HomeNavigator from './HomeNavigator';
import CartNavigator from './CartNavigators';
import CartIcon from '../Shared/CartIcon';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';
import AuthGlobal from '../Context/store/AuthGlobal';

const Tab = createBottomTabNavigator();

const Main = () => {
  const context = useContext(AuthGlobal);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: [{ display: 'flex' }, null],
        tabBarActiveTintColor: '#e91e63',
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <Icon name="shopping-cart" color={color} size={size} />
              <CartIcon />
            </View>
          ),
          headerShown: false,
        }}
      />
      {context.state.user.isAdmin === true && (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="cog" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
      )}
      <Tab.Screen
        name="User"
        component={UserNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;
