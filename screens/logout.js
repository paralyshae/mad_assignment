/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */
import React, { Component } from 'react';
import {
  Text, ScrollView, Button, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LogoutScreen extends Component {
  logout = async () => { // check that the user is logged in
    const token = await AsyncStorage.getItem('@session_token'); // get logged in user session token
    await AsyncStorage.removeItem('@session_token'); // remove session token (received when logged in) from async storage
    return fetch('http://localhost:3333/api/1.0.0/logout', { // post logout request to URL
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => { // if the user is logged in, logout and navigate to login screen
        if (response.status === 200) {
          this.props.navigation.navigate('Login');
        } else if (response.status === 401) { // unauthorised
          this.props.navigation.navigate('Login');
        } else { // server error 500
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return ( // render buttons for user to logout of account
      <ScrollView>
        <Text style={styles.text}>
          Are you sure?
        </Text>
        <Button
          title="Yes"
          color="darkblue"
          onPress={() => this.logout()}
        />
        <Button
          title="No"
          color="red"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </ScrollView>
    );
  }
}

export default LogoutScreen;

const styles = StyleSheet.create({
  text: {
    padding: 5,
    fontSize: 18,
    fontWeight: 'bold',
    margin: 5,
  },
});
