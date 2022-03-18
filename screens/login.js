import React, { Component } from 'react';
import {
  Button, TextInput, StyleSheet, ImageBackground, Text,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import image from './background/space.jpg';

/* LoginScreen - if the user has an account they can log in,
if not they will be directed to a signup page */

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      validation: '',
      error: '',
    };
  }

  login = async () => {
    if (this.state.email.length || this.state.password.length === 0) { // Character/empty validation
      return fetch('http://localhost:3333/api/1.0.0/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } if (response.status === 400) {
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
    }
    this.setState({ error: 'No details provided - Please enter your email and password' });
    return null;
  };

  render() {
    return (
      <ScrollView>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
          <TextInput
            placeholder="Enter your email..." // placeholder in text box
            placeholderTextColor="#FFFFFF"
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
            style={styles.text}
          />
          <TextInput
            placeholder="Enter your password..."
            placeholderTextColor="#FFFFFF"
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
          <Text>{this.state.error}</Text>
        </ImageBackground>
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
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});
