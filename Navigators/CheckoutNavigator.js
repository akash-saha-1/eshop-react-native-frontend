import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Payment from '../Screens/Cart/Checkout/Payment';
import Confirm from '../Screens/Cart/Checkout/Confirm';
import Shipping from '../Screens/Cart/Checkout/Shipping';

const Tab = createMaterialTopTabNavigator();

export const CheckoutNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Shipping" component={Shipping} />
      <Tab.Screen name="Payment" component={Payment} />
      <Tab.Screen name="Confirm" component={Confirm} />
    </Tab.Navigator>
  );
};
