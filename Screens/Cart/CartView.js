import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Text,
  Left,
  Right,
  H1,
  ListItem,
  Thumbnail,
  Body,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SwipeListView } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import * as actions from './../../Redux/Actions/CartActions';
import CartItem from './CartItem';

let { width, height } = Dimensions.get('window');

// converts button text to lower case, whihc is default upper case
String.prototype.toUpperCase = function () {
  return this + '';
};

const CartView = (props) => {
  let total = 0;
  props.cartItems.forEach((item) => {
    total += item.product.price;
  });
  return (
    <React.Fragment>
      {props.cartItems.length > 0 ? (
        <Container>
          <H1 style={styles.h1}>Cart</H1>
          <SwipeListView
            data={props.cartItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(data) => <CartItem key={Math.random()} data={data} />}
            renderHiddenItem={({ item }) => (
              <View style={styles.hiddenContainer} key={Math.random()}>
                <TouchableOpacity
                  style={styles.hiddenButton}
                  onPress={() => props.removeFromCart(item)}
                >
                  <Icon name="trash" size={30} color={'white'} />
                </TouchableOpacity>
              </View>
            )}
            disableRightSwipe={true}
            previewOpenDelay={2000}
            friction={3000}
            tension={40}
            stopLeftSwipe={75}
            rightOpenValue={-75}
          />
          <View style={styles.bottomContainer}>
            <Left>
              <Text style={styles.price}>₹{total}</Text>
            </Left>
            <Right>
              <Button title="Clear Cart" onPress={() => props.clearCart()} />
            </Right>
            <Right>
              <Button
                title="Checkout"
                uppercase={false}
                onPress={() => {
                  props.navigation.navigate('Checkout');
                }}
              />
            </Right>
          </View>
        </Container>
      ) : (
        <Container style={styles.emptyContainer}>
          <Text>Your cart is empty!</Text>
          <Text>Add products to your cart to get started</Text>
        </Container>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: {
    alignSelf: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'white',
    elevation: 2,
  },
  price: {
    fontSize: 18,
    margin: 15,
    color: 'red',
  },
  hiddenContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  hiddenButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 25,
    height: 75,
    width: width / 2,
  },
});

const mapStateToProps = (state) => {
  const { cartReducers } = state;
  return {
    cartItems: cartReducers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
    removeFromCart: (item) => dispatch(actions.removeFromCart(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartView);
