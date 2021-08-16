import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CartView from '../Screens/Cart/CartView';
import { CheckoutNavigator } from './CheckoutNavigator';

const Stack = createStackNavigator();

const CartNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="cart"
        component={CartView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutNavigator}
        options={{
          title: 'Checkout',
        }}
      />
    </Stack.Navigator>
  );
};

export default CartNavigator;
