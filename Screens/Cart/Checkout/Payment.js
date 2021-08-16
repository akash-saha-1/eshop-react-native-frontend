import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import {
  Container,
  Content,
  Header,
  ListItem,
  Text,
  Radio,
  Left,
  Right,
  Picker,
  Body,
  Title,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Font from 'expo-font';

const methods = [
  { name: 'Cash on Delivery', value: 1 },
  { name: 'Bank Transfer', value: 2 },
  { name: 'Card Payment', value: 3 },
];

const paymentCards = [
  { name: 'Wallet', value: 1 },
  { name: 'Visa', value: 2 },
  { name: 'MasterCard', value: 3 },
  { name: 'Rupay', value: 4 },
  { name: 'Other', value: 5 },
];

const Payment = (props) => {
  const [selected, setSelected] = useState();
  const [card, setCard] = useState();
  const [fontLoaded, setFontLoaded] = useState(false);

  //to avoid warning of async roboto font loading in native base
  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      });
      setFontLoaded(true);
    };
    loadFont();
  }, []);

  const order = props.route.params
    ? props.route.params.order
      ? props.route.params.order
      : null
    : null;

  return (
    <>
      {fontLoaded && (
        <Container>
          <Header>
            <Body>
              <Title>Choose your payment method</Title>
            </Body>
          </Header>
          <Content>
            {methods.map((item) => (
              <ListItem
                key={item.value}
                onPress={() => {
                  setSelected(item.value);
                }}
              >
                <Left>
                  <Text>{item.name}</Text>
                </Left>
                <Right>
                  <Radio selected={selected === item.value} />
                </Right>
              </ListItem>
            ))}
            {selected === 3 ? (
              <Picker
                mode="dropdown"
                iosIcon={<Icon name={'arrow-down'} />}
                headerStyle={{ backgroundColor: 'orange' }}
                selectedValue={card}
                style={styles.picker}
                onValueChange={(val) => setCard(val)}
              >
                {paymentCards.map((card) => (
                  <Picker.Item
                    label={card.name}
                    value={card.name}
                    key={card.value}
                  />
                ))}
              </Picker>
            ) : null}
            <View style={styles.view}>
              <Button
                title="Confirm Payment"
                onPress={() => {
                  props.navigation.navigate('Confirm', { order });
                }}
              />
            </View>
          </Content>
        </Container>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  picker: {
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  view: {
    marginTop: 50,
    alignSelf: 'center',
  },
});

export default Payment;
