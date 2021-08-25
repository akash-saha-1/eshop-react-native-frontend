import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Error from '../../Shared/Error';
import FormContainer from './../../Shared/Form/FormContainer';
import Input from './../../Shared/Form/Input';

//Context
import AuthGlobal from '../../Context/store/AuthGlobal';
import { loginUser } from '../../Context/actions/AuthActions';
import Loading from '../../Shared/Loading';
import EasyButton from '../../Shared/StyledComponents/EasyButton';

const Login = (props) => {
  const context = useContext(AuthGlobal);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginScreen, setLoginScreen] = useState(false);
  const loading = context.state.loading;
  console.log(3);
  useEffect(() => {
    const profilePageShift = () => {
      if (context.state.isAuthenticated === true) {
        setLoginScreen(false);
        props.navigation.navigate('User Profile');
      } else {
        setLoginScreen(true);
      }
    };
    profilePageShift();
    return () => {
      setEmail();
      setPassword('');
      setError('');
      setLoginScreen(false);
    };
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
      {!loading && loginScreen && (
        <FormContainer title="Login">
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
            <EasyButton primary large onPress={handleSubmit}>
              <Text style={{ color: 'white' }}>Login</Text>
            </EasyButton>
          </View>
          <View style={[styles.buttonGroup, { marginTop: 40 }]}>
            <Text style={styles.middleText}>Dont't have an account yet?</Text>
            <EasyButton
              secondary
              large
              onPress={() => {
                props.navigation.navigate('Register');
              }}
            >
              <Text style={{ color: 'white' }}>Register</Text>
            </EasyButton>
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
    marginTop: 10,
  },
  middleText: {
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default Login;
