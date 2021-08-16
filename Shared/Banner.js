import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import Swipper from 'react-native-swiper/src';

var width = Dimensions.get('window').width;

const Banner = () => {
  const [bannerData, setBannerData] = useState([]);
  useEffect(() => {
    setBannerData([
      'https://images.vexels.com/media/users/3/126443/preview2/ff9af1e1edfa2c4a46c43b0c2040ce52-macbook-pro-touch-bar-banner.jpg',
      'https://pbs.twimg.com/media/D7P_yLdX4AAvJWO.jpg',
      'https://www.yardproduct.com/blog/wp-content/uploads/2016/01/gardening-banner.jpg',
    ]);
  }, []);

  return (
    <ScrollView styles={styles.container}>
      <Swipper
        showButtons={false}
        autoplay={true}
        autoplayTimeout={5}
        style={styles.swipper}
      >
        {bannerData.map((banner) => {
          return (
            <Image
              key={banner}
              style={styles.imageBanner}
              resizeMode="cover"
              source={{ uri: banner }}
            />
          );
        })}
      </Swipper>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: 'gainsboro',
    alignItems: 'center',
  },
  swipper: {
    height: 150,
  },
  imageBanner: {
    height: 140,
    width: width - 10,
    margin: 5,
    marginTop: 0,
    borderRadius: 10,
  },
});

export default Banner;
