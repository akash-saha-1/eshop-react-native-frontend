import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Modal,
  Button,
  LogBox,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EasyButton from '../../Shared/StyledComponents/EasyButton';

let { width, height } = Dimensions.get('window');

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ListItem = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        style={{ backgroundColor: 'black' }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <TouchableOpacity
              underlayColor="#E8E8E8"
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={20} />
            </TouchableOpacity>
            <View style={(styles.button, { marginTop: 10 })}>
              <EasyButton
                medium
                secondary
                onPress={() => {
                  setModalVisible(false);
                  props.navigation.navigate('Product Form');
                }}
              >
                <Text style={styles.textStyle}>Edit</Text>
              </EasyButton>
            </View>
            <View style={styles.button}>
              <EasyButton medium danger>
                <Text style={styles.textStyle}>Delete</Text>
              </EasyButton>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Product Detail', { item: props });
        }}
        onLongPress={() => {
          setModalVisible(true);
        }}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: props.index % 2 == 0 ? 'white' : 'gainsboro' },
          ]}
        >
          <Image
            source={{
              uri: props.image
                ? props.image
                : 'https://5.imimg.com/data5/PU/TT/MY-58239331/empty-cardboard-box-500x500.jpg',
            }}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.item}>{props.brand}</Text>
          {/* number of lines default from react native to show only 1 line for big text */}
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.item}>
            {props.name}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.item}>
            {props.category.name}
          </Text>
          <Text style={styles.item}>₹ {props.price}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    width: width,
    paddingVertical: 5,
  },
  image: {
    borderRadius: 50,
    width: width / 5,
    height: 50,
  },
  item: {
    width: width / 5,
    paddingHorizontal: 2,
    alignSelf: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 10,
    right: 20,
  },
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 50,
    top: '20%',
    height: height / 3,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    //shadow does not work in android
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    marginBottom: 20,
  },
  textStyle: {
    fontWeight: 'bold',
    color: 'white',
  },
  modalBackground: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default ListItem;
