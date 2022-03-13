/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  ImageBackground, StyleSheet, Text, View, Button,
} from 'react-native';

const image = { uri: 'http://sfwallpaper.com/images/space-background-iphone-5-2.jpg' };

class SplashScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
          <Text style={styles.text}>Spacebook</Text>
          <Button // button to navigate to sign up screen
            title="Enter"
            color="blue"
            onPress={() => this.props.navigation.navigate('Login')}
          />
        </ImageBackground>
      </View>
    );
  }
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});
