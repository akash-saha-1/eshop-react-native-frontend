import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, Left, Right, Body, ListItem, Thumbnail } from 'native-base';

const CartItem = (props) => {
  const product = props.data.item.product;
  const [quantity, setQuantity] = useState(props.data.item.quantity);
  return (
    <ListItem style={styles.listItem} avatar key={Math.random()}>
      <Left>
        <Thumbnail
          source={{
            uri: product.image
              ? product.image
              : 'https://5.imimg.com/data5/PU/TT/MY-58239331/empty-cardboard-box-500x500.jpg',
          }}
        />
      </Left>
      <Body style={styles.body}>
        <Left>
          <Text>{product.name}</Text>
        </Left>
        <Right>
          <Text>₹{product.price}</Text>
        </Right>
      </Body>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  listItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  body: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CartItem;
