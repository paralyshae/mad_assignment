/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */
import React, { Component } from 'react';
import {
  Button, ScrollView, TextInput, StyleSheet,
} from 'react-native';

class SignupScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };
  }

  signup = () => {
    // add further validation for correct email and password length minimum 6 characters
    const data = { // convert my variables into the format the server expects
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    };
    return fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 201) { // successful
          return response.json();
        } if (response.status === 400) { // bad request
          throw new Error('Failed validation');
        } else { // server error 500
          throw new Error('Something went wrong');
        }
      })
      .then((responseJson) => {
        console.log('User created with ID: ', responseJson); // printing ID token to console
        this.props.navigation.navigate('Login'); // once account has been created navigate back to login screen
      })
      .catch((error) => {
        console.log(error); // print error to console
      });
  };

  render() {
    return (
      // make app scrollable.
      <ScrollView>
        <TextInput
          placeholder="Enter your first name..." // placeholder within text input box
          onChangeText={(firstName) => this.setState({ firstName })} // assign entered name database
          value={this.state.firstName}
          style={styles.text}
        />
        <TextInput
          placeholder="Enter your last name..."
          onChangeText={(lastName) => this.setState({ lastName })}
          value={this.state.lastName}
          style={styles.text}
        />
        <TextInput
          placeholder="Enter your email..."
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
        <Button
          title="Create an account"
          color="blue"
          onPress={() => this.signup()}
        />
      </ScrollView>
    );
  }
}

export default SignupScreen;

const styles = StyleSheet.create({
  text: {
    padding: 5,
    fontSize: 14,
    fontWeight: 'bold',
    margin: 5,
    borderWidth: 1,
  },
});
