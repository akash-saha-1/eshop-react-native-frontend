import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Button } from 'react-native';
import { Text, Left, Right, Body, ListItem, Thumbnail } from 'native-base';
import { connect } from 'react-redux';
import * as actions from './../../../Redux/Actions/CartActions';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';

const { width, height } = Dimensions.get('window');

const Confirm = (props) => {
  const order = props.route.params
    ? props.route.params.order
      ? props.route.params.order
      : null
    : null;

  const confirmOrder = () => {
    setTimeout(() => {
      props.clearCart();
      props.navigation.navigate('cart');
    }, 100);
  };

  return (
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
              <ListItem style={styles.listItem} key={item.product.name} avatar>
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
