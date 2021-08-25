import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import config from './../../config/config';
import Loading from './../../Shared/Loading';
import OrderCard from './../../Shared/OrderCard/OrderCard';

const Orders = (props) => {
  const serverUrl = config.SERVER_URL;
  const [orderList, setOrderList] = useState();
  const [loading, setLoading] = useState();
  const isFocused = useIsFocused();

  const getOrders = async () => {
    try {
      let response = await fetch(`${serverUrl}/orders`);
      let orders = await response.json();
      if (!orders) {
        alert('Something went wrong.Please try again later');
        return false;
      }
      setOrderList(orders);
    } catch (err) {
      console.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();

    return () => {
      setOrderList();
      setLoading();
    };
  }, [isFocused]);

  return (
    <React.Fragment>
      {loading && <Loading />}
      {!loading && (
        <View>
          <FlatList
            data={orderList}
            renderItem={({ item, index }) => (
              <OrderCard
                navigation={props.navigation}
                {...item}
                editMode={true}
              />
            )}
            keyExtractor={(item) => item._id}
          />
        </View>
      )}
    </React.Fragment>
  );
};

export default Orders;
