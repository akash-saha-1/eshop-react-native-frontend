import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

const Input = (props) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={props.placeholder}
      name={props.name}
      id={props.id}
      value={props.value}
      autoCorrect={props.autoCorrect}
      onChangeText={props.onChangeText}
      onFocus={props.onFocus}
      secureTextEntry={props.secureTextEntry}
      keyboardType={props.keyboardType}
      //keyboardType="numeric"
    ></TextInput>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '80%',
    height: 60,
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'orange',
  },
});

export default Input;
