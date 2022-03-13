/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  StyleSheet, View, TextInput, Text, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

class FeedScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      text: '',
      error: '',
      postList: [],
    };
  }
  // getSinglePost = async () => { // get single post
  //     const userID = await AsyncStorage.getItem('@user_id');
  //     const token = await AsyncStorage.getItem('@session_token');
  //     const post_id = await AsyncStorage.getItem('@post_id');
  //     return fetch(
  //       `http://localhost:3333/api/1.0.0/user/${userID}/post/${post_id}`,
  //       {
  //         method: 'get',
  //         headers: {
  //           'Contentz-Type': 'application/json',
  //           'X-Authorization': token,
  //         },
  //       },
  //     )
  //       .then((response) => {
  //         if (response.status === 200) {
  //           return response.json();
  //         } if (response.status === 401) {
  //           throw new Error('Unauthorised');
  //         } else if (response.status === 403) {
  //           throw new Error('Can only view the posts of yourself or your friends');
  //         } else if (response.status === 404) {
  //           throw new Error('Not Found');
  //         } else if (response.status === 500) {
  //           throw new Error('Server Error');
  //         } else {
  //           throw new Error('Something went wrong');
  //         }
  //       })
  //       .then((responseJson) => {
  //         this.setState({
  //           isLoading: false,
  //           post: responseJson.post_id,
  //         });
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  //   getUserPostData = async () => { // get list of posts for a given user
  //     const userID = await AsyncStorage.getItem('@user_id');
  //     const token = await AsyncStorage.getItem('@session_token');
  //     return fetch(
  //       `http://localhost:3333/api/1.0.0/user/${userID}/post`,
  //       {
  //         method: 'get',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'X-Authorization': token,
  //         },
  //       },
  //     )
  //       .then((response) => {
  //         if (response.status === 200) {
  //           return response.json();
  //         } if (response.status === 401) {
  //           this.props.navigation.navigate('Login');
  //         } else if (response.status === 403) {
  //           throw new Error('Can only view the posts of yourself or your friends');
  //         } else if (response.status === 404) {
  //           throw new Error('Not Found');
  //         } else if (response.status === 500) {
  //           throw new Error('Server Error');
  //         } else {
  //           throw new Error('Something went wrong');
  //         }
  //       })
  //       .then((responseJson) => {
  //         this.setState({
  //           isLoading: false,
  //           postList: responseJson,
  //         });
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };
  //
  // likePost = async () => { // like a post
  //     const userID = await AsyncStorage.getItem('@user_id');
  //     const token = await AsyncStorage.getItem('@session_token');
  //     const post_id = await AsyncStorage.getItem('@post_id');
  //     return fetch(
  //       `http://localhost:3333/api/1.0.0/user/${userID}/post/${post_id}/like`,
  //       {
  //         method: 'post',
  //         headers: {
  //           'X-Authorization': token,
  //         },
  //       },
  //     )
  //       .then((response) => {
  //         if (response.status === 200) {
  //           return response.json('Liked Post');
  //         } if (response.status === 401) {
  //           throw new Error('Unauthorised');
  //         } else if (response.status === 403) {
  //           throw new Error('Forbidden - You have already liked this post');
  //         } else if (response.status === 404) {
  //           throw new Error('Not Found');
  //         } else if (response.status === 500) {
  //           throw new Error('Server Error');
  //         } else {
  //           throw new Error('Something went wrong');
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  //   unlikePost = async () => { // unlike a post
  //     const userID = await AsyncStorage.getItem('@user_id');
  //     const token = await AsyncStorage.getItem('@session_token');
  //     const post_id = await AsyncStorage.getItem('@post_id');
  //     return fetch(
  //       `http://localhost:3333/api/1.0.0/user/${userID}/post/${post_id}/like`,
  //       {
  //         method: 'delete',
  //         headers: {
  //           'X-Authorization': token,
  //         },
  //       },
  //     )
  //       .then((response) => {
  //         if (response.status === 200) {
  //           return response.json('Unliked Post');
  //         } if (response.status === 401) {
  //           throw new Error('Unauthorised');
  //         } else if (response.status === 403) {
  //           throw new Error('Forbidden - You have not liked this post');
  //         } else if (response.status === 404) {
  //           throw new Error('Not Found');
  //         } else if (response.status === 500) {
  //           throw new Error('Server Error');
  //         } else {
  //           throw new Error('Something went wrong');
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  //   deletePost = async () => { // delete a post
  //     const userID = await AsyncStorage.getItem('@user_id');
  //     const token = await AsyncStorage.getItem('@session_token');
  //     const post_id = await AsyncStorage.getItem('@post_id');
  //     return fetch(
  //       `http://localhost:3333/api/1.0.0/user/${userID}/post/${post_id}`,
  //       {
  //         method: 'delete',
  //         headers: {
  //           'X-Authorization': token,
  //         },
  //       },
  //     )
  //       .then((response) => {
  //         if (response.status === 200) {
  //           return response.json('Post Deleted');
  //         } if (response.status === 401) {
  //           throw new Error('Unauthorised');
  //         } else if (response.status === 403) {
  //           throw new Error('Forbidden - You can only delete your own posts');
  //         } else if (response.status === 404) {
  //           throw new Error('Not Found');
  //         } else if (response.status === 500) {
  //           throw new Error('Server Error');
  //         } else {
  //           throw new Error('Something went wrong');
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  render() {
    return (
            <Text>I am a Feed Screen</Text>
            // view list of posts
            // view single post
            // like post
            // dislike post
            // delete post
            //
            // render posts, post author details, number of likes, time stamp
    );
  }
}

export default FeedScreen;
