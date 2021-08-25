import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Picker } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import TrafficLight from '../StyledComponents/TrafficLight';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from './../../config/config';
import Loading from '../Loading';
import EasyButton from '../StyledComponents/EasyButton';

const OrderCard = (props) => {
  const serverUrl = config.SERVER_URL;
  const [orderStatus, setOrderStatus] = useState();
  const [statusText, setStatusText] = useState();
  const [statusChange, setStatusChange] = useState();
  const [token, setToken] = useState();
  const [cardColor, setCardColor] = useState();
  const [loading, setLoading] = useState(false);
  const statusList = ['Pending', 'Shipped', 'Delivered'];

  useEffect(() => {
    if (props.editMode) {
      AsyncStorage.getItem('jwt')
        .then((jwt) => setToken(jwt))
        .catch((err) => console.error(err));
    }

    if (props.status === 'Pending') {
      setOrderStatus(<TrafficLight unavailable />);
      setStatusChange('Pending');
      setStatusText('Pending');
      setCardColor('coral');
    } else if (props.status === 'Shipped') {
      setOrderStatus(<TrafficLight limited />);
      setStatusText('Shipped');
      setStatusChange('Shipped');
      setCardColor('#F1C40F');
    } else {
      setOrderStatus(<TrafficLight available />);
      setStatusText('Delivered');
      setStatusChange('Delivered');
      setCardColor('#2ECC71');
    }
    return () => {
      setOrderStatus();
      setStatusText();
      setStatusChange();
      setToken();
      setCardColor();
      setLoading(false);
    };
  }, [props]);

  const updateOrder = async () => {
    let data = {
      status: statusChange,
    };
    setLoading(true);

    fetch(`${serverUrl}/orders/${props.id}`, {
      method: 'PUT',
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
          text1: 'Order Updated Successfully',
          text2: '',
        });
        setTimeout(() => {
          props.navigation.navigate('Products');
        }, 500);
      })
      .catch((err) => {
        console.error(err.message);
        Toast.show({
          topOffset: 70,
          type: 'error',
          text1: 'Failed to Update Order',
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
        <View style={[styles.container, { backgroundColor: cardColor }]}>
          <View>
            <Text style={styles.smallText}>Order Number: #{props.id}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.text}>
              Status: {statusText} {orderStatus}
            </Text>
            <Text style={styles.text}>
              Address: {props.shippingAddress1} {props.shippingAddress2}
            </Text>
            <Text style={styles.text}>City: {props.city}</Text>
            <Text style={styles.text}>Country: {props.country}</Text>
            <Text style={styles.text}>
              Date Ordered: {props.dateOrdered.split('T')[0]}
            </Text>
          </View>
          <View>
            <Text style={styles.text}>User Name: {props.user.name}</Text>
            <Text style={styles.text}>Phone No: {props.phone}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.bigText}>Price: </Text>
            <Text style={styles.price}>₹ {props.totalPrice}</Text>
          </View>
          {props.editMode ? (
            <View>
              <Picker
                mode="dropdown"
                iosIcon={<Icon color={'#007aff'} name="arrow-down" />}
                style={styles.pickerStyle}
                placeholder="Chnage Status"
                selectedValue={statusChange}
                placeholderIconColor={{ color: '#007aaf' }}
                onValueChange={(e) => setStatusChange(e)}
              >
                {statusList.map((status) => (
                  <Picker.Item key={status} label={status} value={status} />
                ))}
              </Picker>
              <EasyButton secondary large onPress={updateOrder}>
                <Text style={styles.buttonText}>Update</Text>
              </EasyButton>
            </View>
          ) : null}
        </View>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  title: {
    backgroundColor: '#62B1FF',
    padding: 5,
  },
  detailsContainer: {
    marginVertical: 10,
  },
  priceContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  price: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  text: {
    fontSize: 16,
  },
  smallText: {
    fontSize: 14,
  },
  bigText: {
    fontSize: 18,
  },
  pickerStyle: {
    width: '50%',
    marginVertical: 20,
  },
});

export default OrderCard;
