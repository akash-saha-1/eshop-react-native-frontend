import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = () => {
  return (
    <SafeAreaView style={styles.header}>
      <Image
        source={require('./../assets/header-logo.jpg')}
        resizeMode="contain"
        style={styles.image}
      />
    </SafeAreaView>
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
