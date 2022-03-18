/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import {
  StyleSheet, View, TextInput, Text, TouchableOpacity, Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

class PostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      text: '',
    };
  }

  componentDidMount() { // if route.params is undefined, get post data so user can edit
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      if (this.props.route.params !== undefined) {
        this.getPostData(this.props.route.params.post_id);
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    if (token == null) {
      this.props.navigation.navigate('Login');
    }
  };

  // get the post from the server for editing
  getPostData = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    const { post_id } = this.props.route.params;
    return fetch(
      `http://localhost:3333/api/1.0.0//user/${id}/post/${post_id}`,
      {
        headers: {
          'X-Authorization': token,
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw response.status;
      })
      .then((responseJson) => {
        this.setState({
          text: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  createPost = async () => { // add a new post
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    if (this.state.text.match(/^([A-z\d\s()!?#])+$/)) { // Character/empty validation
      return fetch(
        `http://localhost:3333/api/1.0.0/user/${id}/post`,
        {
          method: 'post',
          headers: {
            'X-Authorization': token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: this.state.text,
          }),
        },
      )
        .then((response) => {
          if (response.status === 201) { // created
            return response.json();
          } if (response.status === 401) {
            throw new Error('Unauthorised');
          } else if (response.status === 404) {
            throw new Error('Not Found');
          } else if (response.status === 500) {
            throw new Error('Server Error');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then((responseJson) => {
          console.log('Post Created with ID: ', responseJson);
          this.props.navigation.navigate('Feed');
        })
        .catch((error) => {
          console.log(error);
        });
    }
    this.setState({ error: 'Forbidden characters/ Empty Field: Please try again...' });
    return null;
  };

  editPost = async () => { // update a post
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    const { post_id } = this.props.route.params;
    if (this.state.text.match(/^([A-z\d\s()!?#])+$/)) { // Character/empty validation
      return fetch(
        `http://localhost:3333/api/1.0.0/user/${id}/post/${post_id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token,
          },
          body: JSON.stringify({
            text: this.state.text,
          }),
        },
      )
        .then((response) => {
          if (response.status === 200) {
            this.props.navigation.navigate('Feed');
          } if (response.status === 400) {
            throw new Error('Bad Request');
          } if (response.status === 401) {
            throw new Error('Unauthorised');
          } else if (response.status === 403) {
            throw new Error('Forbidden- You can only update your own posts');
          } else if (response.status === 404) {
            throw new Error('Not Found');
          } else if (response.status === 500) {
            throw new Error('Server Error');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    this.setState({ error: 'Forbidden characters/ Empty Field: Please try again...' });
    return null;
  };

  // use a ternary operator to return value of if/then statement
  // if route.params is not undefined show edit button, if it is undefined show create button
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <TextInput
            style={styles.textInput}
            placeholder="Write your post here..."
            placeholderTextColor="black"
            onChangeText={(text) => this.setState({ text })}
            value={this.state.post}
            multiline
            numberOfLines={5}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => (this.props.route.params !== undefined
              ? this.editPost() : this.createPost())}
          >
            <Text>{this.props.route.params !== undefined ? 'Edit' : 'Create'}</Text>
          </TouchableOpacity>
          <Text>{this.state.error}</Text>
        </View>
        <Button
          title="Feed"
          color="green"
          onPress={() => this.props.navigation.navigate('Feed')}
        />
      </ScrollView>
    );
  }
}

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    marginTop: 10,
    backgroundColor: 'green',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 5,
    padding: 5,
    width: '50%',
  },
  textInput: {
    fontSize: 12,
    textAlignVertical: 'top',
    borderTopWidth: 1,
    height: '100%',
    width: '100%',
    marginTop: 10,
    padding: 5,
    color: 'black',
  },
});
