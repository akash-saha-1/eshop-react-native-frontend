import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Container, Header, Icon, Item, Input, Text } from 'native-base';

import ProductList from './ProductList';
import SearchedProducts from './SearchedProducts';
import Banner from '../../Shared/Banner';
import CategoryFilter from './CategoryFilter';
const data = require('./../../assets/data/products.json');
const categoriesJson = require('./../../assets/data/categories.json');
let height = Dimensions.get('window').height;

const ProductContainer = (props) => {
  const [text, setText] = useState('');
  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductFiltered] = useState([]);
  const [focus, setFocus] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [active, setActive] = useState();

  useEffect(() => {
    setProducts(data);
    setProductFiltered(data);
    setCategories(categoriesJson);
    setProductCategory(data);
    setActive(-1);
    //To avoid memory leaks
    return () => {
      setProducts();
      setProductFiltered();
      setCategories([]);
    };
  }, []);

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
          products.filter((product) => product.category.$oid === category)
        ),
        setActive(true));
  };

  return (
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
          {focus == true ? <Icon onPress={onBlur} name="ios-close" /> : null}
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
          {productCategory.length > 0 ? (
            <View
              style={[
                styles.listContainer,
                productCategory.length < 3 ? styles.minHeights : '',
              ]}
            >
              {productCategory.map((product) => (
                <ProductList
                  key={product._id.$oid}
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
});

export default ProductContainer;
