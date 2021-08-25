import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import { Container } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import config from './../../config/config';
import AuthGlobal from '../../Context/store/AuthGlobal';
import { logout } from '../../Context/actions/AuthActions';
import Loading from '../../Shared/Loading';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import OrderCard from '../../Shared/OrderCard/OrderCard';

const UserProfile = (props) => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState();
  const serverUrl = config.SERVER_URL;
  console.log(1);

  useEffect(() => {
    if (
      context.state.isAuthenticated === false ||
      context.state.isAuthenticated === null
    ) {
      props.navigation.navigate('Login');
    }

    //loading user data
    setLoading(true);
    const loadUserData = async (jwt) => {
      try {
        let response = await fetch(
          `${serverUrl}/users/${context.state.user.userId}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        let userData = await response.json();
        setUserProfile(userData);
      } catch (err) {
        Toast.show({
          topOffset: 70,
          type: 'error',
          text1: 'Sorry! Something went wrong',
          text2: 'Please try again later',
        });
        console.error(err);
      } finally {
        //setLoading(false);
      }
    };

    AsyncStorage.getItem('jwt')
      .then((jwt) => {
        if (jwt) {
          loadUserData(jwt.trim());
        }
      })
      .catch((err) => {
        console.error('can not get jwt toke due to : ', err.message);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      setUserProfile();
      setLoading();
      setOrders();
    };
  }, [context.state.isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      console.log(2);
      setLoading(true);

      const getUserOrders = async () => {
        try {
          let response = await fetch(`${serverUrl}/orders`);
          let orders = await response.json();
          if (orders) {
            const userOrders = orders.filter(
              (order) => order.user._id === context.state.user.userId
            );
            setOrders(userOrders);
          }
        } catch (err) {
          Toast.show({
            topOffset: 70,
            type: 'error',
            text1: 'Something went wrong while loading orders',
            text2: 'Please try again later',
          });
          console.error(err.message);
        } finally {
          setLoading(false);
        }
      };
      getUserOrders();
    }, [context.state.isAuthenticated])
  );

  return (
    <React.Fragment>
      {loading && <Loading />}
      {!loading && (
        <Container style={styles.container}>
          {userProfile && (
            <ScrollView contentContainerStyle={styles.subContainer}>
              <View>
                <Text style={styles.name}>
                  {userProfile ? userProfile.name : ''}
                </Text>
              </View>
              <View style={styles.bodyView}>
                <Text style={styles.detail}>
                  Email: {userProfile ? userProfile.email : ''}
                </Text>
                <Text style={styles.detail}>
                  Phone: {userProfile ? userProfile.phone : ''}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <EasyButton
                  secondary
                  large
                  onPress={() => {
                    logout(context.dispatch);
                  }}
                >
                  <Text style={{ color: 'white' }}>Sign Out</Text>
                </EasyButton>
              </View>
              <View style={styles.order}>
                <Text style={styles.orderText}>
                  {orders && orders.length > 0
                    ? 'My Orders'
                    : 'You have No Orders'}
                </Text>
                <View>
                  {orders && orders != undefined
                    ? orders.map((order) => (
                        <OrderCard key={order._id} {...order} />
                      ))
                    : null}
                </View>
              </View>
            </ScrollView>
          )}
        </Container>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  name: {
    fontSize: 30,
  },
  bodyView: {
    marginTop: 20,
  },
  detail: {
    margin: 10,
  },
  buttonContainer: {
    marginTop: 50,
  },
  orderText: {
    fontSize: 20,
  },
  order: {
    marginTop: 50,
    alignItems: 'center',
    marginBottom: 80,
  },
});

export default UserProfile;
