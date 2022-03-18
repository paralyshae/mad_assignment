/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import {
  StyleSheet, View, Text, FlatList, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

class SinglePostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      singlePost: [],
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      const { user_id, post_id } = this.props.route.params;
      this.checkLoggedIn();
      this.getSinglePost(user_id, post_id);
    });
  }

  checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    if (token == null) {
      this.props.navigation.navigate('Login');
    }
  };

  getSinglePost = async (user_id, post_id) => {
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
          singlePost: responseJson,
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
        <FlatList
          data={this.state.singlePost}
          renderItem={({ item }) => (
            <View>
              <Text>
                {' '}
                {item.text}
                {' '}
                {this.author.first_name}
                {' '}
                {item.author.last_name}
                {' '}
                {/* return the date with subString (start, end) */}
                {(item.timestamp)}
                {' '}
                Likes:
                {item.numLikes}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.post_id.toString()}
        />
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
});
