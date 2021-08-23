import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Toast from 'react-native-toast-message';
import FormContainer from './../../Shared/Form/FormContainer';
import Input from './../../Shared/Form/Input';
import Error from '../../Shared/Error';
import Loading from '../../Shared/Loading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import config from './../../config/config';
import EasyButton from '../../Shared/StyledComponents/EasyButton';

const Register = (props) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const serverUrl = config.SERVER_URL;

  const register = useCallback(async () => {
    setLoading(false);
    setError('');
    console.log(email, password, phone, name);
    if (
      email.trim() === '' ||
      password.trim() === '' ||
      phone.trim() === '' ||
      name.trim() === ''
    ) {
      setError('Please fill your all details correctly!');
    } else {
      setLoading(true);
      let user = { name, email, password, phone, isAdmin: false };
      try {
        let response = await fetch(`${serverUrl}/users/register`, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        if (response.status === 200) {
          Toast.show({
            topOffset: 70,
            type: 'success',
            text1: 'Registration Succeeded',
            text2: 'Please login into your account',
          });
          setTimeout(() => {
            props.navigation.navigate('Login');
          }, 500);
        }
      } catch (err) {
        console.error(err.message);
        Toast.show({
          topOffset: 70,
          type: 'error',
          text1: 'Sorry! Something went wrong',
          text2: 'Please try again',
        });
        return false;
      } finally {
        setLoading(false);
      }
    }
  }, [email, password, phone, name]);

  return (
    <React.Fragment>
      {loading ? (
        <Loading />
      ) : (
        <KeyboardAwareScrollView
          viewIsInsideTabBar={true}
          extraHeight={50}
          enableOnAndroid={true}
        >
          <FormContainer title="Register">
            <Input
              placeholder="Email"
              name="email"
              id="email"
              onChangeText={(text) => {
                setEmail(text.toLowerCase());
              }}
            />
            <Input
              placeholder="Name"
              name="name"
              id="name"
              onChangeText={(text) => {
                setName(text);
              }}
            />
            <Input
              placeholder="Phone"
              name="phone"
              id="phone"
              keyboardType={'numeric'}
              onChangeText={(text) => {
                setPhone(text);
              }}
            />
            <Input
              placeholder="Password"
              name="password"
              id="password"
              secureTextEntry={true}
              onChangeText={(text) => {
                setPassword(text.toLowerCase());
              }}
            />
            <View style={styles.buttonGroup}>
              {error ? <Error message={error} /> : null}
            </View>
            <View style={styles.buttonGroup}>
              <EasyButton primary large onPress={register}>
                <Text style={{ color: 'white' }}>Register</Text>
              </EasyButton>
            </View>
            <View style={styles.buttonGroup}>
              <EasyButton
                secondary
                large
                onPress={() => {
                  props.navigation.navigate('Login');
                }}
              >
                <Text style={{ color: 'white' }}>Back to Login</Text>
              </EasyButton>
            </View>
          </FormContainer>
        </KeyboardAwareScrollView>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: '80%',
    margin: 10,
    alignItems: 'center',
  },
});

export default Register;
