import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Button,
} from 'react-native';
import { Item, Header, Input } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../Shared/Loading';
import config from './../../config/config';
import ListItem from './ListItem';

let { width, height } = Dimensions.get('window');

const Products = (props) => {
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const serverUrl = config.SERVER_URL;

  useFocusEffect(
    useCallback(() => {
      const loadProducts = async () => {
        AsyncStorage.getItem('jwt')
          .then((jwt) => setToken(jwt))
          .catch((err) => console.error(err));
        try {
          let response = await fetch(`${serverUrl}/products`);
          let products = await response.json();
          setProductList(products);
          setProductFilter(products);
        } catch (err) {
          console.error(err.message);
          return false;
        } finally {
          setLoading(false);
        }
      };
      loadProducts();
    }, [])
  );

  const listHeader = () => {
    return (
      <View style={styles.listHeader} elevation={1}>
        <View style={styles.headerImageItem}></View>
        <View style={styles.headerItem}>
          <Text style={styles.boldFont}>Brand</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={styles.boldFont}>Name</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={styles.boldFont}>Category</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={styles.boldFont}>Price</Text>
        </View>
      </View>
    );
  };

  const searchProduct = (text) => {
    if (text == '') {
      setProductFilter(productList);
    } else {
      setProductFilter(
        productList.filter((product) =>
          product.name
            .toLowerCase()
            .replace(' ', '')
            .includes(text.toLowerCase(), ' ', '')
        )
      );
    }
  };

  return (
    <View>
      <View>
        <Header searchBar rounded>
          <Item style={styles.searchBar}>
            <Icon name="search" size={18} />
            <Input
              placeholder="Search"
              onChangeText={(text) => searchProduct(text)}
            />
          </Item>
        </Header>
      </View>
      {loading && <Loading />}
      {!loading && (
        <View style={styles.listView}>
          <FlatList
            data={productFilter}
            ListHeaderComponent={listHeader}
            renderItem={({ item, index }) => (
              <ListItem {...item} index={index} navigation={props.navigation} />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    padding: 5,
    paddingLeft: 10,
  },
  listHeader: {
    flexDirection: 'row',
    backgroundColor: 'gainsboro',
    paddingVertical: 5,
  },
  headerItem: {
    margin: 3,
    width: width / 5,
    marginLeft: -5,
  },
  headerImageItem: {
    margin: 3,
    width: width / 5,
  },
  listView: {
    paddingBottom: 115,
  },
  boldFont: {
    fontWeight: 'bold',
  },
});

export default Products;
