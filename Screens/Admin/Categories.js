import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TextInput,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../Shared/Loading';
import config from '../../config/config';
import EasyButton from '../../Shared/StyledComponents/EasyButton';

let { width } = Dimensions.get('window');

const Item = (props) => {
  return (
    <View style={styles.item}>
      <Text>{props.item.name}</Text>
      <EasyButton danger medium onPress={() => props.delete(props.item._id)}>
        <Text style={styles.button}>Delete</Text>
      </EasyButton>
    </View>
  );
};

const Categories = (props) => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);

  const serverUrl = config.SERVER_URL;

  useEffect(() => {
    const loadCategories = async () => {
      AsyncStorage.getItem('jwt')
        .then((jwt) => setToken(jwt))
        .catch((err) => console.error(err));

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
    loadCategories();

    return () => {
      setCategories();
      setToken();
      setCategoryName();
      setToken();
    };
  }, [props]);

  const addCategory = () => {
    if (!categoryName) {
      return false;
    }

    setLoading(true);
    const category = {
      name: categoryName,
    };

    fetch(`${serverUrl}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    })
      .then((res) => res.json())
      .then((response) => {
        setCategories([...categories, response]);
      })
      .catch((err) => {
        console.error(err.message);
        alert('Error to Add category. Please try again Later');
        return false;
      })
      .finally(() => {
        setCategoryName('');
        setLoading(false);
      });
  };

  const deleteCategory = async (id) => {
    setLoading(true);
    try {
      let response = await fetch(`${serverUrl}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      response = await response.json();
      const newCategories = categories.filter((item) => item.id !== id);
      setCategories(newCategories);
    } catch (err) {
      console.error(err.message);
      alert('Category is not deleted.Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      {loading && <Loading />}
      {!loading && (
        <View style={styles.viewContainer}>
          <View style={styles.listView}>
            <FlatList
              data={categories}
              renderItem={({ item, index }) => (
                <Item item={item} index={index} delete={deleteCategory} />
              )}
              keyExtractor={(item) => item._id}
            />
          </View>
          <View style={styles.bottomBar}>
            {/* <View>
              <Text>Add Category</Text>
            </View> */}
            <View style={styles.inputContainer}>
              <TextInput
                value={categoryName}
                style={styles.input}
                placeholder="Add Category"
                onChangeText={(text) => {
                  setCategoryName(text);
                }}
              />
            </View>
            <View>
              <EasyButton medium primary onPress={addCategory}>
                <Text style={styles.button}>Add</Text>
              </EasyButton>
            </View>
          </View>
        </View>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    position: 'relative',
    height: '100%',
  },
  listView: {
    marginBottom: 60,
  },
  inputContainer: {
    paddingLeft: 20,
    width: width / 1.8,
  },
  button: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomBar: {
    backgroundColor: 'white',
    width: width,
    height: 60,
    padding: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  input: {
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  item: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
    padding: 5,
    margin: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
});

export default Categories;
