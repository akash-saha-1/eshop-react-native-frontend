import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import { Container } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import config from './../../config/config';
import AuthGlobal from '../../Context/store/AuthGlobal';
import { logout } from '../../Context/actions/AuthActions';
import Loading from '../../Shared/Loading';

const UserProfile = (props) => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();
  const [loading, setLoading] = useState(true);
  const serverUrl = config.SERVER_URL;

  useEffect(() => {
    if (
      context.state.isAuthenticated === false ||
      context.state.isAuthenticated === null
    ) {
      props.navigation.navigate('Login');
    }

    //loading user data
    const loadUserData = async (jwt) => {
      try {
        let response = await fetch(
          `${serverUrl}/users/${context.state.user.userId}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        let userData = await response.json();
        setUserProfile(userData);
      } catch (err) {
        console.error(err);
      }
    };

    AsyncStorage.getItem('jwt')
      .then((jwt) => {
        if (jwt) {
          loadUserData(jwt.trim());
        }
      })
      .catch((err) => {
        console.error('can not get jwt toke due to : ', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [context.state.isAuthenticated]);

  return (
    <React.Fragment>
      {loading && <Loading />}
      {!loading && (
        <Container style={styles.container}>
          {userProfile && (
            <ScrollView contentContainerStyle={styles.subContainer}>
              <Text style={styles.name}>
                {userProfile ? userProfile.name : ''}
              </Text>
              <View style={styles.bodyView}>
                <Text style={styles.detail}>
                  Email: {userProfile ? userProfile.email : ''}
                </Text>
                <Text style={styles.detail}>
                  Phone: {userProfile ? userProfile.phone : ''}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  title="Sign Out"
                  onPress={() => {
                    logout(context.dispatch);
                  }}
                />
              </View>
            </ScrollView>
          )}
        </Container>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  name: {
    fontSize: 30,
  },
  bodyView: {
    marginTop: 20,
  },
  detail: {
    margin: 10,
  },
  buttonContainer: {
    marginTop: 80,
  },
});

export default UserProfile;
