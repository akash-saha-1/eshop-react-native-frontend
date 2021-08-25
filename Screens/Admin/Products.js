import React, { useState, useCallback, useEffect } from 'react';
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
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../Shared/Loading';
import config from '../../config/config';
import ListItem from './ListItem';
import EasyButton from '../../Shared/StyledComponents/EasyButton';

let { width } = Dimensions.get('window');

const Products = (props) => {
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const serverUrl = config.SERVER_URL;

  const isFocused = useIsFocused();

  useEffect(() => {
    setLoading(true);

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

    //when ever component is destroyed to clean our data
    return () => {
      setProductList();
      setProductFilter();
      setLoading();
      setToken();
    };
  }, [isFocused]);

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

  const deleteProduct = useCallback(
    async (id) => {
      try {
        let response = await fetch(`${serverUrl}/products/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const products = productFilter.filter((item) => item.id !== id);
        setProductFilter(products);
      } catch (err) {
        console.error(err.message);
        return false;
      }
    },
    [productFilter]
  );

  return (
    <React.Fragment>
      {loading && <Loading />}
      {!loading && (
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <EasyButton
              secondary
              medium
              onPress={() => props.navigation.navigate('Orders')}
            >
              <Icon name="shopping-bag" size={18} color="white" />
              <Text style={styles.buttonText}>Orders</Text>
            </EasyButton>
            <EasyButton
              secondary
              medium
              onPress={() => props.navigation.navigate('ProductForm')}
            >
              <Icon name="plus" size={18} color="white" />
              <Text style={styles.buttonText}>Products</Text>
            </EasyButton>
            <EasyButton
              secondary
              medium
              onPress={() => props.navigation.navigate('Categories')}
            >
              <Icon name="plus" size={18} color="white" />
              <Text style={styles.buttonText}>Categories</Text>
            </EasyButton>
          </View>
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
          {loading && <Loading style={styles.loaderStyle} />}
          {!loading && (
            <View style={styles.listView}>
              <FlatList
                data={productFilter}
                ListHeaderComponent={listHeader}
                renderItem={({ item, index }) => (
                  <ListItem
                    {...item}
                    index={index}
                    length={productFilter.length}
                    navigation={props.navigation}
                    delete={deleteProduct}
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          )}
        </View>
      )}
    </React.Fragment>
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
    paddingBottom: 150,
  },
  boldFont: {
    fontWeight: 'bold',
  },
  container: {
    marginBottom: 70,
    backgroundColor: 'white',
  },
  buttonContainer: {
    margin: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    marginLeft: 5,
    color: 'white',
  },
  loaderStyle: {
    position: 'absolute',
    top: -50,
  },
});

export default Products;
