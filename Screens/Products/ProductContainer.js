import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Container, Header, Icon, Item, Input, Text } from 'native-base';
import { useIsFocused } from '@react-navigation/native';

import ProductList from './ProductList';
import SearchedProducts from './SearchedProducts';
import Banner from '../../Shared/Banner';
import CategoryFilter from './CategoryFilter';
import Loading from '../../Shared/Loading';
import config from './../../config/config';
let height = Dimensions.get('window').height;

const ProductContainer = (props) => {
  const [text, setText] = useState('');
  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductFiltered] = useState([]);
  const [focus, setFocus] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [active, setActive] = useState();
  const [loading, setLoading] = useState(true);
  const serverUrl = config.SERVER_URL;

  const isFocused = useIsFocused();

  const loadApi = async () => {
    //products
    try {
      let response = await fetch(`${serverUrl}/products`);
      let products = await response.json();
      setProducts(products);
      setProductFiltered(products);
      setProductCategory(products);
    } catch (err) {
      console.error(err.message);
      return false;
    }

    //categories
    try {
      let response = await fetch(`${serverUrl}/categories`);
      let categories = await response.json();
      setCategories(categories);
    } catch (err) {
      console.error(err.message);
      return false;
    }

    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  useEffect(() => {
    setLoading(true);
    setActive(-1);
    loadApi();

    //when ever component is destroyed to clean our data
    return () => {
      setActive();
      setProducts();
      setProductFiltered();
      setProductCategory();
      setCategories();
      setLoading();
    };
  }, [isFocused]);

  const searchProduct = (text) => {
    setText(text);
    setProductFiltered(
      products.filter(
        (product) => product.name.toLowerCase().indexOf(text.toLowerCase()) > -1
      )
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setText('');
    Keyboard.dismiss();
    setFocus(false);
    setProductFiltered(data);
  };

  // categories
  const changeCategory = (category) => {
    category == 'all'
      ? (setProductCategory(products), setActive(true))
      : (setProductCategory(
          products.filter((product) => product.category._id === category)
        ),
        setActive(true));
  };

  return (
    <React.Fragment>
      {/* {loading && (
        <Container style={styles.activityContainer}>
          <ActivityIndicator size="large" color="red" />
        </Container>
      )} */}
      {loading && <Loading />}
      {!loading && (
        <Container>
          <Header searchBar rounded>
            <Item>
              <Icon name="ios-search" />
              <Input
                placeholder="Search"
                value={text}
                onFocus={openList}
                onChangeText={(text) => {
                  searchProduct(text);
                }}
              />
              {focus == true ? (
                <Icon onPress={onBlur} name="ios-close" />
              ) : null}
            </Item>
          </Header>
          {focus == true ? (
            <ScrollView style={{ paddingBottom: 10 }}>
              <SearchedProducts
                productsFiltered={productsFiltered}
                navigation={props.navigation}
              />
            </ScrollView>
          ) : (
            <ScrollView>
              <View style={styles.banner}>
                <Banner />
              </View>
              <View style={styles.categoryFilter}>
                <CategoryFilter
                  categories={categories}
                  categoryFilter={changeCategory}
                  productCategory={productCategory}
                  active={active}
                  setActive={setActive}
                />
              </View>
              {productCategory && productCategory.length > 0 ? (
                <View
                  style={[
                    styles.listContainer,
                    productCategory.length < 3 ? styles.minHeights : '',
                  ]}
                >
                  {productCategory.map((product) => (
                    <ProductList
                      key={Math.random(1, 1000000000)}
                      item={product}
                      navigation={props.navigation}
                    />
                  ))}
                </View>
              ) : (
                <View style={[styles.center, styles.noProduct]}>
                  <Text>No Product Found</Text>
                </View>
              )}
            </ScrollView>
          )}
        </Container>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 55,
    backgroundColor: 'gainsboro',
  },
  minHeights: {
    minHeight: height - 75 - 55 - 50 - 60 - 50,
  },
  banner: {
    height: 150,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noProduct: {
    height: 100,
  },
  categoryFilter: {
    height: 60,
  },
  activityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
});

export default ProductContainer;
