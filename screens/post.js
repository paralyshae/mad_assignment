/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-throw-literal */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { Button, TextInput, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: '',
    };
  }

  addPost = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');

    // eslint-disable-next-line camelcase
    const to_send = {
      text: this.state.post,
    };
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post`, {
      method: 'post',
      headers: {
        'X-Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(to_send),
    })
      .then((response) => {
        if (response.status === 201) {
          Alert.alert('Post added');
          this.props.navigation.navigate('Profile');
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else if (response.status === 500) {
          throw 'Server Error';
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <ScrollView>
        <TextInput
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
          placeholder="What would you like to post?"
          onChangeText={(text) => { this.setState({ post: text }); }}
        />
        <Button
          title="Post"
          color="green"
          onPress={() => { this.addPost(); }}
        />
      </ScrollView>
    );
  }
}

export default PostScreen;

// <ion-icon name="thumbs-down-outline"></ion-icon>
// <ion-icon name="thumbs-up-outline"></ion-icon>
// <ion-icon name="trash-outline"></ion-icon>
// <ion-icon name="search-outline"></ion-icon>
// <ion-icon name="checkmark-circle-outline"></ion-icon>
// <ion-icon name="close-circle-outline"></ion-icon>
// <ion-icon name="pencil-outline"></ion-icon>
// <ion-icon name="add-circle-outline"></ion-icon>
