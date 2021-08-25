import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Button } from 'react-native';
import { Text, Left, Right, Body, ListItem, Thumbnail } from 'native-base';
import { connect } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as actions from './../../../Redux/Actions/CartActions';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';
import Toast from 'react-native-toast-message';
import config from './../../../config/config';
import Loading from '../../../Shared/Loading';

const { width, height } = Dimensions.get('window');

const Confirm = (props) => {
  const [order, setOrder] = useState();
  const [payment, setPayment] = useState();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const serverUrl = config.SERVER_URL;

  const isFocused = useIsFocused();

  useEffect(() => {
    AsyncStorage.getItem('jwt')
      .then((jwt) => setToken(jwt))
      .catch((err) => console.error(err.message));

    setOrder(
      props.route.params
        ? props.route.params.order
          ? props.route.params.order
          : null
        : null
    );
    setPayment(
      props.route.params
        ? props.route.params.payment
          ? props.route.params.payment
          : null
        : null
    );

    if (order && order.orderItems) {
      let totalCost = 0;
      order.orderItems.forEach((item) => {
        totalCost += parseInt(item.product.price);
      });
      setTotalPrice(totalCost);
    }
    return () => {
      setOrder();
      setToken();
      setTotalPrice();
      setPayment();
    };
  }, [isFocused]);

  const confirmOrder = () => {
    if (!order || !payment) {
      Toast.show({
        topOffset: 70,
        type: 'error',
        text1: 'Please fill out All Informations of Order',
        text2: '',
      });
      return false;
    }

    let data = {
      orderItems: order.orderItems,
      shippingAddress1: order.shippingAddress1,
      shippingAddress2: order.shippingAddress2,
      city: order.city,
      zip: order.zip,
      country: order.country,
      phone: order.phone,
      totalPrice: totalPrice,
      user: order.userId,
      payment: payment,
    };

    setLoading(true);
    fetch(`${serverUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        Toast.show({
          topOffset: 70,
          type: 'success',
          text1: 'Order Placed Successfully',
          text2: '',
        });
        setTimeout(() => {
          props.clearCart();
          props.navigation.navigate('cart');
        }, 1000);
      })
      .catch((err) => {
        console.error(err.message);
        Toast.show({
          topOffset: 70,
          type: 'error',
          text1: 'Failed to Place Order',
          text2: 'Please try again Later',
        });
        return false;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      {loading && <Loading />}
      {!loading && (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.text}>Confirm Order</Text>
            {order ? (
              <View style={styles.view}>
                <Text style={styles.title}>Shipping To:</Text>
                <View style={{ padding: 8 }}>
                  <Text>Address: {order.shippingAddress1}</Text>
                  <Text>Address2: {order.shippingAddress2}</Text>
                  <Text>City: {order.city}</Text>
                  <Text>Zip Code: {order.zip}</Text>
                  <Text>Country: {order.country}</Text>
                </View>
                <Text style={styles.title}>Items:</Text>
                {order.orderItems.map((item) => (
                  <ListItem style={styles.listItem} key={Math.random()} avatar>
                    <Left>
                      <Thumbnail source={{ uri: item.product.image }} />
                    </Left>
                    <Body style={styles.body}>
                      <Left>
                        <Text>{item.product.name}</Text>
                      </Left>
                      <Right>
                        <Text>₹{item.product.price}</Text>
                      </Right>
                    </Body>
                  </ListItem>
                ))}
              </View>
            ) : null}
            <View style={styles.buttonView}>
              <EasyButton primary large onPress={confirmOrder}>
                <Text style={{ color: 'white' }}>Place Order</Text>
              </EasyButton>
            </View>
          </View>
        </ScrollView>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    padding: 8,
    alignContent: 'center',
    backgroundColor: 'white',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  view: {
    borderWidth: 1,
    borderColor: 'orange',
    paddingBottom: 20,
  },
  title: {
    alignSelf: 'center',
    fontSize: 16,
    margin: 8,
    fontWeight: 'bold',
  },
  listItem: {
    width: width / 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  body: {
    margin: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonView: {
    alignItems: 'center',
    margin: 20,
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
  };
};

export default connect(null, mapDispatchToProps)(Confirm);
