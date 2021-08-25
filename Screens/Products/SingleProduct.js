import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Button,
  ScrollView,
} from 'react-native';
import { Left, Right, Container, H1 } from 'native-base';
import Toast from 'react-native-toast-message';
import { connect } from 'react-redux';
import * as actions from './../../Redux/Actions/CartActions';
import TrafficLight from '../../Shared/StyledComponents/TrafficLight';
import EasyButton from '../../Shared/StyledComponents/EasyButton';

const SingleProduct = (props) => {
  const [item, setItem] = useState(props.route.params.item);
  const [availability, setAvailability] = useState(null);
  const [availabilityText, setAvailablityText] = useState('');

  useEffect(() => {
    if (props.route.params.item.countInStock == 0) {
      setAvailability(<TrafficLight unavailable></TrafficLight>);
      setAvailablityText('Unavailable');
    } else if (props.route.params.item.countInStock <= 5) {
      setAvailability(<TrafficLight limited></TrafficLight>);
      setAvailablityText('Limited Stock');
    } else {
      setAvailability(<TrafficLight available></TrafficLight>);
      setAvailablityText('Available');
    }
  }, []);

  return (
    <Container style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.image
                ? item.image
                : 'https://5.imimg.com/data5/PU/TT/MY-58239331/empty-cardboard-box-500x500.jpg',
            }}
            resizeMode="stretch"
            style={styles.image}
          />
        </View>
        <View style={styles.contentContainer}>
          <H1 style={styles.contentHeader}>{item.name}</H1>
          <Text style={styles.contentText}>{item.brand}</Text>
        </View>
        <View style={styles.availabilityContainer}>
          <View style={styles.availability}>
            <Text style={styles.availabilityText}>
              Availability: {availabilityText}
            </Text>
            {availability}
          </View>
          <Text style={{ padding: 5 }}>{item.description}</Text>
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <Left>
          <Text style={styles.price}>₹{item.price}</Text>
        </Left>
        <Right>
          <EasyButton
            primary
            large
            onPress={() => {
              props.addItemToCart(item);
              Toast.show({
                topOffset: 70,
                type: 'success',
                text1: `${item.name} added to Cart`,
                text2: 'Go to your cart to complete order',
              });
            }}
            style={{ width: 150 }}
          >
            <Text style={{ color: 'white' }}>Add Item to Cart</Text>
          </EasyButton>
        </Right>
      </View>
    </Container>
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
    position: 'relative',
    height: '100%',
  },
  scrollView: {
    marginBottom: 80,
    padding: 5,
  },
  imageContainer: {
    backgroundColor: 'white',
    padding: 0,
    margin: 0,
  },
  image: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentHeader: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  contentText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  price: {
    fontSize: 22,
    margin: 20,
    color: 'red',
  },
  availabilityContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  availability: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  availabilityText: {
    marginRight: 10,
  },
});

export default connect(null, mapDispatchToProps)(SingleProduct);
