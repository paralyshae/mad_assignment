/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import {
  StyleSheet, View, Text, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

class SinglePostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userPostData: [],
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      const { post_id } = this.props.route.params;
      this.checkLoggedIn();
      this.getPostData(post_id);
      this.getSinglePost(post_id);
    });
  }

  checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    if (token == null) {
      this.props.navigation.navigate('Login');
    }
  };

  // get post from the server
  getPostData = async (post_id) => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${id}/post/${post_id}`,
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
          isLoading: false,
          userPostData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // get single post
  getSinglePost = async (post_id) => {
    const user_id = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}`,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 403) {
          throw new Error('Can only view the posts of yourself or your friends');
        } else if (response.status === 404) {
          throw new Error('Not Found');
        } else if (response.status === 500) {
          throw new Error('Server Error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          userPostData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator
            size="large"
            color="#00ff00"
          />
        </View>
      );
    }
    return (
      <ScrollView>
        <Text style={[styles.post]}>{this.state.userPostData.text}</Text>
        <View style={[styles.container, styles.horizontal]}>
          <Text>{this.state.userPostData.author.first_name}</Text>
          <Text>{this.state.userPostData.author.last_name}</Text>
          <Text>{this.state.userPostData.timestamp}</Text>
          Likes:
          <Text>{this.state.userPostData.numLikes}</Text>
        </View>
      </ScrollView>
    );
  }
}

export default SinglePostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  post: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
