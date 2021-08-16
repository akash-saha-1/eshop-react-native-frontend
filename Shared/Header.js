import React from 'react';
import { StyleSheet, Image, View } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <Image
        source={require('./../assets/header-logo.jpg')}
        resizeMode="contain"
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
    backgroundColor: '#F8F8F8',
  },
  image: {
    height: 55,
    width: 150,
  },
});
export default Header;
