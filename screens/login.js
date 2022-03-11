/* eslint-disable import/no-unresolved */
/* eslint-disable no-use-before-define */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */
import React, { Component } from 'react';
import {
  Button, TextInput, StyleSheet,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      validation: '',
    };
  }

  // if(this.state.password.length < 6){
  // alert("Password length must be more than or equal to 6 characters!");
  // return false;
  // }
  login = async () => fetch('http://localhost:3333/api/1.0.0/login', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(this.state),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } if (response.status === 400) { // invalid details
        this.setState({ validation: 'Invalid email or password' });
        alert('Invalid email or password');
        throw new Error('Invalid email or password'); // e.g. if you try to submit empty text fields this message will show in console
      } else { // server error 500
        throw new Error('Something went wrong');
      }
    })
    .then(async (responseJson) => {
      console.log(responseJson);
      await AsyncStorage.setItem('@session_id', responseJson.id);
      await AsyncStorage.setItem('@session_token', responseJson.token);
      this.props.navigation.navigate('Home'); // if login is successful navigate user to home screen
    })
    .catch((error) => { // error saving data
      console.log(error);
    });

  render() {
    return (
      <ScrollView>
        <TextInput
          placeholder="Enter your email..." // placeholder in text box
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          style={styles.text}
        />
        <TextInput
          placeholder="Enter your password..."
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry // hide user input
          style={styles.text}
        />
        <Button // login button
          title="Login"
          color="blue"
          onPress={() => this.login()}
        />
        <Button // button to navigate to sign up screen
          title="Don't have an account?"
          color="red"
          onPress={() => this.props.navigation.navigate('Signup')}
        />
      </ScrollView>

    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  text: {
    padding: 5,
    borderWidth: 2,
    margin: 5,
  },
});
