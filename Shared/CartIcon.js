import React from 'react';
import { StyleSheet } from 'react-native';
import { Badge, Text } from 'native-base';
import { connect } from 'react-redux';

const CartIcon = (props) => {
  return (
    <>
      {props.cartItems.length > 0 ? (
        <Badge style={styles.badge}>
          <Text style={styles.text}>{props.cartItems.length}</Text>
        </Badge>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  badge: {
    width: 25,
    position: 'absolute',
    top: -10,
    right: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    width: 100,
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state) => {
  const { cartReducers } = state;
  return {
    cartItems: cartReducers,
  };
};

export default connect(mapStateToProps, null)(CartIcon);
