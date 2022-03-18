/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Button, FlatList, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

class FeedScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userPostData: [],
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      // this.getSinglePost(user_id, post_id);
      this.getPostList();
    });
    this.getPostList();
  }

  componentWillUnmount() {
    this.getPostList();
  }

  checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    if (token == null) {
      this.props.navigation.navigate('Login');
    }
  };

  // getSinglePost = async (user_id, post_id) => {
  //   const token = await AsyncStorage.getItem('@session_token');
  //   return fetch(
  //     `http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}`,
  //     {
  //       method: 'get',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-Authorization': token,
  //       },
  //     },
  //   )
  //     .then((response) => {
  //       if (response.status === 200) {
  //         return response.json();
  //       } if (response.status === 401) {
  //         throw new Error('Unauthorised');
  //       } else if (response.status === 403) {
  //         throw new Error('Can only view the posts of yourself or your friends');
  //       } else if (response.status === 404) {
  //         throw new Error('Not Found');
  //       } else if (response.status === 500) {
  //         throw new Error('Server Error');
  //       } else {
  //         throw new Error('Something went wrong');
  //       }
  //     })
  //     .then((responseJson) => {
  //       this.setState({
  //         isLoading: false,
  //         userPostData: responseJson,
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  getPostList = async () => { // get list of posts for a given user
    const user_id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user_id}/post`,
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

  // eslint-disable-next-line class-methods-use-this
  deletePost = async (user_id, post_id) => { // delete a post
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}`,
      {
        method: 'delete',
        headers: {
          'X-Authorization': token,
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('Post Deleted');
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 403) {
          throw new Error('Forbidden - You can only delete your own posts');
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
        <FlatList
          data={this.state.userPostData}
          renderItem={({ item }) => (
            <View>
              <Text>
                {' '}
                {item.text}
                {' '}
                {item.author.first_name}
                {' '}
                {item.author.last_name}
                {' '}
                {/* return the date with subString (start, end) */}
                {/* {(item.timestamp).toDateString().substring(0, 10)} */}
                {(item.timestamp)}
                {' '}
                Likes:
                {item.numLikes}
              </Text>
              <Button
                title="Edit"
                color="green"
                onPress={() => this.props.navigation.navigate('Post', { post_id: item.post_id })}
              />
              <Button
                title="DELETE"
                color="red"
                onPress={() => this.deletePost(item.author.user_id, item.post_id)}
              />
            </View>
          )}
          keyExtractor={(item) => item.post_id.toString()}
        />
      </ScrollView>
    );
  }
}

export default FeedScreen;

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
});

//  load other users posts from the server
// loadUserPostData = async () => {
//   this.setState({
//     isLoading: true,
//   });
//   const user_id = await AsyncStorage.getItem('@user_id');
//   const token = await AsyncStorage.getItem('@session_token');
//   return fetch(
//     `http://localhost:3333/api/1.0.0//user/${user_id}/post/`,
//     {
//       headers: {
//         'X-Authorization': token,
//       },
//     },
//   )
//     .then((response) => {
//       if (response.status === 200) {
//         return response.json();
//       }
//       throw response.status;
//     })
//     .then((responseJson) => {
//       this.setState({
//         isLoading: false,
//         userPostData: responseJson,
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
