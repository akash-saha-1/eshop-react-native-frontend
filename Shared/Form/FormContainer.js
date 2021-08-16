import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Text } from 'react-native';

const width = Dimensions.get('window').width;

const FormContainer = (props) => {
  return (
    // because scroll view is acting as a container, so contentContainerStyle
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      {props.children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginBottom: 50,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
  },
});

export default FormContainer;
