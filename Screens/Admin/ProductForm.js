import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { Item, Picker } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';

import config from '../../config/config';
import FormContainer from '../../Shared/Form/FormContainer';
import Input from '../../Shared/Form/Input';
import Loading from '../../Shared/Loading';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import Error from '../../Shared/Error';

let width = Dimensions.get('window').width;

const ProductForm = (props) => {
  const [picker, setPicker] = useState();
  const [brand, setBrand] = useState();
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  const [oldImage, setOldImage] = useState();
  const [mainImage, setMainImage] = useState();
  const [category, setCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState();
  const [error, setError] = useState();
  const [countInStock, setCountInStock] = useState();
  const [rating, setRating] = useState();
  const [isFeatured, setIsFeatured] = useState();
  const [richDescription, setRichDescription] = useState();
  const [numReviews, setNumReviews] = useState();
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(true);
  const serverUrl = config.SERVER_URL;

  useEffect(() => {
    if (!props.route.params) {
      setItem(null);
    } else {
      let itemData = props.route.params.item;
      setItem(itemData);
      setBrand(itemData.brand);
      setName(itemData.name);
      setPrice(itemData.price ? itemData.price.toString() : null);
      setDescription(itemData.description);
      setMainImage(itemData.image);
      setImage(itemData.image);
      setOldImage(itemData.image);
      setCategory(itemData.category._id);
      setCountInStock(
        itemData.countInStock ? itemData.countInStock.toString() : null
      );
      setRating(itemData.rating ? itemData.rating.toString() : null);
      setIsFeatured(itemData.isFeatured);
      setNumReviews(
        itemData.numReviews ? itemData.numReviews.toString() : null
      );
      setRichDescription(itemData.richDescription);
    }

    AsyncStorage.getItem('jwt')
      .then((jwt) => setToken(jwt))
      .catch((err) => console.error(err.message));

    //Categories
    const loadCategories = async () => {
      try {
        let response = await fetch(`${serverUrl}/categories`);
        let categories = await response.json();
        setCategories(categories);
      } catch (err) {
        console.error(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    };
    setTimeout(loadCategories, 500);

    //Image Picker
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry! we need camera roll permissions to make this work!');
        }
      }
    })();

    //when ever component is destroyed to clean our data
    return () => {
      setPicker();
      setBrand();
      setName();
      setPrice();
      setDescription();
      setImage();
      setOldImage();
      setMainImage();
      setCategory();
      setCategories([]);
      setToken();
      setError();
      setCountInStock();
      setRating();
      setIsFeatured();
      setRichDescription();
      setNumReviews();
      setItem();
      setLoading();
    };
  }, [props]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setMainImage(result.uri);
      setImage(result.uri);
    }
  };

  const addProduct = async () => {
    if (
      !name ||
      !brand ||
      !price ||
      !description ||
      !category ||
      !countInStock ||
      !isFeatured ||
      !rating ||
      !image
    ) {
      setError('Please fill in the form correctly with all details.');
      return false;
    }
    setError('');
    setLoading(true);

    //Default android image uri comes with 3 slash but in ios we need to add them for valid file path in backend
    const newImageUri =
      item != null ? image : 'file:///' + image.split('file:/').join('');

    let formData = new FormData();
    //const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('brand', brand);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('countInStock', countInStock);
    formData.append('richDescription', richDescription);
    formData.append('rating', rating);
    formData.append('numReviews', numReviews);
    formData.append('isFeatured', isFeatured);
    if (!oldImage || oldImage != image) {
      formData.append('image', {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split('/').pop(),
      });
    }

    let response;
    try {
      if (item != null) {
        response = await fetch(`${serverUrl}/products/${item._id}`, {
          method: 'PUT',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        response = await fetch(`${serverUrl}/products`, {
          method: 'POST',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          topOffset: 70,
          type: 'success',
          text1: `${
            item != null ? 'Product Successfully Updated' : 'New Product Added'
          }`,
          text2: '',
        });
        setTimeout(() => {
          props.navigation.navigate('Products');
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        topOffset: 70,
        type: 'error',
        text1: 'Sorry! Something went wrong',
        text2: 'Please try again later',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      {loading && <Loading />}
      {!loading && (
        <View style={styles.container}>
          <FormContainer title="Add Product">
            <View style={styles.imageContainer}>
              <Image source={{ uri: mainImage }} style={styles.image} />
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                <Icon name="camera" color="white" size={22} />
              </TouchableOpacity>
            </View>
            <View style={styles.label}>
              <Text>Brand</Text>
            </View>
            <Input
              placeholder="Brand"
              name="brand"
              id="brand"
              value={brand}
              onChangeText={(text) => {
                setBrand(text);
              }}
            />
            <View style={styles.label}>
              <Text>Name</Text>
            </View>
            <Input
              placeholder="Name"
              name="name"
              id="name"
              value={name}
              onChangeText={(text) => {
                setName(text);
              }}
            />
            <View style={styles.label}>
              <Text>Price</Text>
            </View>
            <Input
              placeholder="Price"
              name="price"
              id="price"
              value={price}
              keyboardType="numeric"
              onChangeText={(text) => {
                setPrice(text);
              }}
            />
            <View style={styles.label}>
              <Text>Count in Stock</Text>
            </View>
            <Input
              placeholder="Stock"
              name="stock"
              id="stock"
              keyboardType="numeric"
              value={countInStock}
              onChangeText={(text) => {
                setCountInStock(text);
              }}
            />
            <View style={styles.label}>
              <Text>Rating</Text>
            </View>
            <Input
              placeholder="Rating"
              name="rating"
              id="rating"
              keyboardType="numeric"
              value={rating}
              onChangeText={(text) => {
                setRating(text);
              }}
            />
            <View style={styles.label}>
              <Text>Number of Reviews</Text>
            </View>
            <Input
              placeholder="Number of Reviews"
              name="numOfReviews"
              id="numOfReviews"
              keyboardType="numeric"
              value={numReviews}
              onChangeText={(text) => {
                setNumReviews(text);
              }}
            />
            <View style={styles.label}>
              <Text>Description</Text>
            </View>
            <Input
              placeholder="Description"
              name="description"
              id="description"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
              }}
            />
            <View style={styles.label}>
              <Text>Categories</Text>
            </View>
            <Item picker style={styles.pickerStyle}>
              <Picker
                mode="dropdown"
                iosIcon={<Icon color={'#007aaf'} name="arrow-down" />}
                placeholder="Select your Category"
                selectedValue={picker}
                //style={{ width: undefined }} // just to disable inherted width from container
                placeholderStyle={{ color: '#007aaf' }}
                placeholderIconColor="#007aff"
                selectedValue={category}
                onValueChange={(e) => {
                  setPicker(e), setCategory(e);
                }}
              >
                <Picker.Item key={Math.random()} label="Select" value="" />
                {categories.map((category) => (
                  <Picker.Item
                    key={category.id}
                    label={category.name}
                    value={category.id}
                  />
                ))}
              </Picker>
            </Item>
            <View style={styles.label}>
              <Text>Featured Product</Text>
            </View>
            <Item picker style={styles.pickerStyle}>
              <Picker
                mode="dropdown"
                iosIcon={<Icon color={'#007aaf'} name="arrow-down" />}
                placeholder="Featured Product"
                selectedValue={isFeatured}
                placeholderStyle={{ color: '#007aaf' }}
                placeholderIconColor="#007aff"
                onValueChange={(e) => setIsFeatured(e)}
              >
                <Picker.Item key={Math.random()} label="Select" value="" />
                <Picker.Item key={Math.random()} label="True" value={true} />
                <Picker.Item key={Math.random()} label="False" value={false} />
              </Picker>
            </Item>
            {error ? <Error message={error} /> : null}
            <View style={styles.buttonContainer}>
              <EasyButton large primary onPress={addProduct}>
                <Text style={styles.buttonText}>
                  {item != null ? 'Edit Product' : 'Add Product'}
                </Text>
              </EasyButton>
            </View>
          </FormContainer>
        </View>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  label: {
    width: '80%',
    marginTop: 10,
  },
  container: {
    paddingBottom: 5,
  },
  pickerStyle: {
    marginBottom: 30,
    marginTop: 10,
    width: width / 2,
    borderColor: 'orange',
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
    marginBottom: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderStyle: 'solid',
    borderWidth: 3,
    padding: 0,
    justifyContent: 'center',
    borderRadius: 100,
    borderColor: 'orange',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  imagePicker: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 100,
    elevation: 3,
  },
});

export default ProductForm;
