import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Button,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { connect } from 'react-redux';
import * as actions from './../../Redux/Actions/CartActions';

let width = Dimensions.get('window').width;

const ProductCard = (props) => {
  const { name, price, image, countInStock } = props;
  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.image}
        source={{
          uri: image
            ? image
            : 'https://5.imimg.com/data5/PU/TT/MY-58239331/empty-cardboard-box-500x500.jpg',
        }}
      />
      <View style={styles.card}>
        <Text style={styles.title}>
          {name.length > 15 ? name.substring(0, 13) + '...' : name}
        </Text>
        <Text style={styles.price}>₹{price}</Text>
        {countInStock > 0 ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                props.addItemToCart(props);
                Toast.show({
                  topOffset: 70,
                  type: 'success',
                  text1: `${name} added to Cart`,
                  text2: 'Go to your cart to complete order',
                });
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={{ marginTop: 20 }}>Currently Unavailable</Text>
        )}
      </View>
    </View>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (product) =>
      dispatch(actions.addToCart({ quantity: 1, product })),
  };
};

const styles = StyleSheet.create({
  container: {
    width: width / 2 - 10,
    height: width / 1.5,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 5,
    alignItems: 'center',
    elevation: 8,
    backgroundColor: 'white',
  },
  image: {
    width: '90%',
    height: width / 2 - 50,
    backgroundColor: 'transparent',
    marginTop: -5,
    borderRadius: 10,
  },
  card: {
    marginBottom: 10,
    height: width / 2,
    backgroundColor: 'transparent',
    width: width / 2 - 30,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  price: {
    fontSize: 18,
    color: 'orange',
    marginTop: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    marginBottom: 60,
    width: '40%',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 30,
    width: 85,
    backgroundColor: 'green',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default connect(null, mapDispatchToProps)(ProductCard);
