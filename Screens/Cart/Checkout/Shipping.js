import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import { Item, Picker } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import FormContainer from '../../../Shared/Form/FormContainer';
import Input from '../../../Shared/Form/Input';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';
import Toast from 'react-native-toast-message';
import AuthGlobal from './../../../Context/store/AuthGlobal';

const countries = require('../../../assets/countries.json');

const Shipping = (props) => {
  const [orderItems, setOrderItems] = useState();
  const [address, setAddress] = useState();
  const [address2, setAddress2] = useState();
  const [city, setCity] = useState();
  const [zip, setZip] = useState();
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState();
  const [userId, setUserId] = useState();
  const context = useContext(AuthGlobal);

  useEffect(() => {
    setOrderItems(props.cartItems);
    setUserId(context.state.user.userId);
    //setTimeout(() => setCountry('India'), 300); //default India

    return () => {
      setOrderItems();
      setUserId();
      setAddress();
      setAddress2();
      setCity();
      setZip();
      setCountry();
      setPhone();
      setUserId();
    };
  }, []);

  const checkOut = () => {
    if (!city || !country || !orderItems || !phone || !address || !zip) {
      Toast.show({
        topOffset: 70,
        type: 'error',
        text1: 'Please fill out all the fields to proceed.',
        text2: '',
      });
      return false;
    }

    let order = {
      city,
      country,
      dateOrdered: Date.now(),
      orderItems,
      phone,
      shippingAddress1: address,
      shippingAddress2: address2,
      zip,
      userId,
    };
    props.navigation.navigate('Payment', { order: order });
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={100}
      enableOnAndroid={true}
    >
      <FormContainer title={'Shipping Address'}>
        <Input
          placeholder={'Phone'}
          name={'phone'}
          value={phone}
          keyboardType="numeric"
          onChangeText={(text) => setPhone(text)}
        />
        <Input
          placeholder={'Shipping Address 1'}
          name={'ShippingAddress1'}
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
        <Input
          placeholder={'Shipping Address 2'}
          name={'ShippingAddress2'}
          value={address2}
          onChangeText={(text) => setAddress2(text)}
        />
        <Input
          placeholder={'City'}
          name={'city'}
          value={city}
          onChangeText={(text) => setCity(text)}
        />
        <Input
          placeholder={'Zip Code'}
          name={'zip'}
          value={zip}
          keyboardType="numeric"
          onChangeText={(text) => setZip(text)}
        />
        <Item picker style={styles.picker}>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" color={'#007aff'} size={30} />}
            selectedValue={country}
            placeholder={'Select Your Country'}
            placeholderStyle={{ color: '#007aff' }}
            placeholderIconColor="#007aff"
            onValueChange={(e) => setCountry(e)}
          >
            {countries.map((country) => (
              <Picker.Item
                key={country.code}
                label={country.name}
                value={country.name}
              />
            ))}
          </Picker>
        </Item>
        <View style={styles.view}>
          <EasyButton primary large onPress={() => checkOut()}>
            <Text style={{ color: 'white' }}>Confirm Order</Text>
          </EasyButton>
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  view: {
    width: '80%',
    alignItems: 'center',
  },
  picker: {
    marginBottom: 50,
    borderBottomWidth: 0,
    width: '50%',
    padding: 10,
    margin: 10,
  },
});

const mapStateToProps = (state) => {
  const { cartReducers } = state;
  return {
    cartItems: cartReducers,
  };
};

export default connect(mapStateToProps, null)(Shipping);
