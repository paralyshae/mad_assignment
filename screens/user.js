/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import {
  View, Text, ActivityIndicator, Image, StyleSheet, Button, TextInput, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photo: null,
      isLoading: true,
      userData: [],
      userPostData: [],
      text: '',
      error: '',
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getUserData();
      this.getUserProfilePhoto();
      this.getPostList();
    });
    this.getUserData();
    this.getUserProfilePhoto();
    this.getPostList();
  }

  getUserProfilePhoto = async () => {
    const { profile_id } = this.props.route.params;
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${profile_id}/photo`, {
      method: 'get',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  getUserData = async () => {
    const { profile_id } = this.props.route.params;
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${profile_id}`, {
      method: 'get',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) { // unauthorised / not logged in
          this.props.navigation.navigate('Login');
        } else if (response.status === 404) {
          throw new Error('Not found');
        } else {
          throw new Error('Something went wrong'); // 500 server error
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          userData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  createPost = async () => { // add a new post
    const token = await AsyncStorage.getItem('@session_token');
    const { profile_id } = this.props.route.params;
    if (this.state.text.match(/^([A-z\d\s()!?#])+$/)) { // Character/empty validation
      return fetch(
        `http://localhost:3333/api/1.0.0/user/${profile_id}/post`,
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
        })
        .catch((error) => {
          console.log(error);
        });
    }
    this.setState({ error: 'Forbidden characters/ Empty Field: Please try again...' });
    return null;
  };

  getPostList = async () => { // get list of posts for a given user
    const { profile_id } = this.props.route.params;
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${profile_id}/post`,
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
  likePost = async (user_id, post_id) => { // like a post
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}/like`,
      {
        method: 'post',
        headers: {
          'X-Authorization': token,
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('Post Liked');
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 403) {
          throw new Error('Forbidden - You have already liked this post');
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

  // eslint-disable-next-line class-methods-use-this
  unlikePost = async (user_id, post_id) => { // unlike a post
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}/like`,
      {
        method: 'delete',
        headers: {
          'X-Authorization': token,
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('Post Unliked');
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 403) {
          throw new Error('Forbidden - You have not liked this post');
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
    if (!this.state.isLoading) {
      return (
        <View style={styles.container}>
          <Image
            source={{
              uri: this.state.photo,
            }}
            style={styles.photo}
          />

          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            {this.state.userData.first_name}
            {' '}
            {this.state.userData.last_name}
          </Text>
          <Text>
            {this.state.userData.email}
          </Text>
          <Text>
            {this.state.userData.friend_count}
            {' '}
            friend/s
          </Text>

          <Button
            title="View Friends"
            color="green"
            onPress={() => this.props.navigation.navigate('UserFriends', { user_id: this.state.userData.user_id })}
          />
          <Button
            title="Post"
            color="green"
            onPress={() => this.props.navigation.navigate('Posts')}
          />

          <View style={styles.container2}>
            <TextInput
              style={styles.textInput}
              placeholder="Write your post here..."
              placeholderTextColor="black"
              onChangeText={(text) => this.setState({ text })}
              value={this.state.post}
              multiline
              numberOfLines={5}
            />
            <Button
              title="Create"
              color="green"
              onPress={() => this.createPost()}
            />
            <Text>{this.state.error}</Text>
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
                    {(item.timestamp)}
                    {' '}
                    Likes:
                    {item.numLikes}
                  </Text>
                  {/* <Button
                    title="View Post"
                    color="green"
                    onPress={() => this.props.navigation.navigate('SinglePost',
                    { post_id: item.post_id })}
                  /> */}
                  <Button
                    title="Like"
                    color="green"
                    onPress={() => this.likePost(item.author.user_id, item.post_id)}
                  />
                  <Button
                    title="Unlike"
                    color="red"
                    onPress={() => this.unlikePost(item.author.user_id, item.post_id)}
                  />
                </View>
              )}
              keyExtractor={(item) => item.post_id.toString()}
            />
          </View>

        </View>
      );
    }
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator
          size="large"
          color="#00ff00"
        />
      </View>
    );
  }
}

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: 10,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  photo: {
    width: '60%',
    height: '35%',
    borderWidth: 2,
    marginTop: 10,
  },
  container2: {
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
