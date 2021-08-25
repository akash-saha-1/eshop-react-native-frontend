import React, { useContext, useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Text, Left, Right, H1 } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { SwipeListView } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import * as actions from './../../Redux/Actions/CartActions';
import CartItem from './CartItem';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import AuthGlobal from '../../Context/store/AuthGlobal';

let { width, height } = Dimensions.get('window');

// converts button text to lower case, whihc is default upper case
String.prototype.toUpperCase = function () {
  return this + '';
};

const CartView = (props) => {
  const context = useContext(AuthGlobal);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (context.state.isAuthenticated === true) {
      setLoggedIn(true);
    }

    return () => {
      setLoggedIn();
    };
  }, [context.state]);

  let total = 0;
  props.cartItems.forEach((item) => {
    total += item.product.price;
  });

  const checkOut = () => {
    if (!loggedIn || loggedIn == false) {
      Toast.show({
        topOffset: 70,
        type: 'error',
        text1: 'Please Login to Place Order',
        text2: '',
      });
      return false;
    }
    props.navigation.navigate('Checkout');
  };

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
              <EasyButton danger medium onPress={() => props.clearCart()}>
                <Text style={{ color: 'white' }}>Clear</Text>
              </EasyButton>
            </Right>
            <Right>
              {loggedIn ? (
                <EasyButton medium primary onPress={checkOut}>
                  <Text style={{ color: 'white' }}>Checkout</Text>
                </EasyButton>
              ) : (
                <EasyButton
                  medium
                  secondary
                  onPress={() => props.navigation.navigate('Login')}
                >
                  <Text style={{ color: 'white' }}>Login</Text>
                </EasyButton>
              )}
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
