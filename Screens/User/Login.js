import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Error from '../../Shared/Error';
import FormContainer from './../../Shared/Form/FormContainer';
import Input from './../../Shared/Form/Input';

//Context
import AuthGlobal from '../../Context/store/AuthGlobal';
import { loginUser } from '../../Context/actions/AuthActions';
import Loading from '../../Shared/Loading';

const Login = (props) => {
  const context = useContext(AuthGlobal);

  const [email, setEmail] = useState('akash@gmail.com');
  const [password, setPassword] = useState('12345');
  const [error, setError] = useState('');
  const loading = context.state.loading;

  useEffect(() => {
    if (context.state.isAuthenticated === true) {
      props.navigation.navigate('User Profile');
    }
  }, [context.state.isAuthenticated]);

  const handleSubmit = () => {
    const user = {
      email,
      password,
    };
    if (email.trim() === '' || password.trim() === '') {
      setError('Please fill in your credentials');
    } else {
      setError(false);
      loginUser(user, context.dispatch);
    }
  };

  return (
    <React.Fragment>
      {loading && <Loading />}
      {!loading && (
        <FormContainer title="input">
          <Input
            placeholder="Enter Email"
            name="email"
            id="email"
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())}
          />
          <Input
            placeholder="Enter Password"
            name="password"
            id="password"
            value={password}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
          <View style={styles.buttonGroup}>
            {error ? <Error message={error} /> : null}
            <Button title="Login" onPress={handleSubmit} />
          </View>
          <View style={[styles.buttonGroup, { marginTop: 40 }]}>
            <Text style={styles.middleText}>Dont't have an account yet?</Text>
            <Button
              title="Register"
              onPress={() => {
                props.navigation.navigate('Register');
              }}
            />
          </View>
        </FormContainer>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: '80%',
    alignItems: 'center',
  },
  middleText: {
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default Login;
