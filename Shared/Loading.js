import React from 'react';
import { Image, Dimensions } from 'react-native';

let { width, height } = Dimensions.get('window');

const Loading = () => {
  return (
    <Image
      source={require('./../assets/loading.gif')}
      resizeMode="cover"
      style={{ width: width, height: height - 100 }}
    />
  );
};

export default Loading;
