/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, FlatList, ScrollView, Button, ActivityIndicator, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendRequestScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      friendRequestData: [],
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getFriendRequestData();
    });
    this.getFriendRequestData();
  }

  getFriendRequestData = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
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
        } else {
          throw new Error('Something went wrong'); // 500 server error
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          friendRequestData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  acceptRequest = async (id) => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Request Accepted');
          this.getFriendRequestData();
        } else {
          throw new Error('Something has gone wrong');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  rejectRequest = async (id) => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'delete',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Request Rejected - I don't want no friends");
          this.getFriendRequestData();
        } else {
          throw new Error('Something has gone wrong');
        }
      })
      .catch((err) => {
        console.log(err);
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
    } if (this.state.friendRequestData.length === 0) {
      return <Text> No new friend requests </Text>;
    }
    return (
      <ScrollView>
        <FlatList
          data={this.state.friendRequestData}
          renderItem={({ item }) => (
            <View>
              <Text>{item.first_name}</Text>
              <Button
                title="Accept"
                color="green"
                onPress={() => this.acceptRequest(item.user_id)}
              />
              <Button
                title="Reject"
                color="red"
                onPress={() => this.rejectRequest(item.user_id)}
              />
            </View>
          )}
          keyExtractor={(item) => item.user_id.toString()}
        />
      </ScrollView>
    );
  }
}

export default FriendRequestScreen;

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
