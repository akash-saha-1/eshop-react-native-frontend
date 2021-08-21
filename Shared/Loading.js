import React from 'react';
import { Image, Dimensions, StyleSheet, View } from 'react-native';

let { width, height } = Dimensions.get('window');

const Loading = () => {
  return (
    <View>
      <Image
        source={require('./../assets/loading.gif')}
        resizeMode="cover"
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: width,
    height: height - 100,
  },
});

export default Loading;
