import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Content, Left, Body, ListItem, Thumbnail, Text } from 'native-base';

let width = Dimensions.get('window').width;

const SearchedProducts = (props) => {
  const [height, setHeight] = useState(Dimensions.get('window').height);
  const { productsFiltered } = props;
  return (
    <Content
      style={styles.content}
      onLayout={(event) => {
        setHeight(event.nativeEvent.layout.height);
      }}
    >
      {productsFiltered.length > 0 ? (
        productsFiltered.map((item) => (
          <ListItem
            key={item._id.$oid}
            avatar
            onPress={() => {
              props.navigation.navigate('Product Detail', { item: item });
            }}
          >
            <Left>
              <Thumbnail
                source={{
                  uri: item.image
                    ? item.image
                    : 'https://5.imimg.com/data5/PU/TT/MY-58239331/empty-cardboard-box-500x500.jpg',
                }}
              />
            </Left>
            <Body>
              <Text>{item.name}</Text>
              <Text note>{item.description}</Text>
            </Body>
          </ListItem>
        ))
      ) : (
        <View style={{ ...styles.noProduct, height: height / 1.1 }}>
          <Text style={styles.text}>
            No product matched the selected criteria
          </Text>
        </View>
      )}
    </Content>
  );
};

const styles = StyleSheet.create({
  noProduct: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  content: {
    width: width,
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
  },
});

export default SearchedProducts;
