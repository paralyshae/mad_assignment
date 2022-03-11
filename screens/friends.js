/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-throw-literal */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  Text, StyleSheet, ActivityIndicator, View, FlatList, Button,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      friendsList: [],
    };
  }

  componentDidMount() {
    this.getFriends();
  }

  getFriends = async () => {
    console.log('getting data...');
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          return this.props.navigation.navigate('Login');
        } if (response.status === 403) {
          throw 'Can only view the friends of yourself or your friends';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else { // 500
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          friendsList: responseJson,
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
    } if (this.state.friendsList.length === 0) {
      return (
        <View>
          <Text> You have no friends :( </Text>
          <Button
            title="Search"
            color="green"
            onPress={() => this.props.navigation.navigate('Search')}
          />
        </View>
      );
    }
    console.log('here');
    return (
      <ScrollView>
        <View>
          <FlatList
            data={this.state.friendsList}
            renderItem={({ item }) => (
              <View>
                <Text>
                  {' '}
                  {item.user_givenname}
                  {' '}
                  {item.user_familyname}
                  <Button
                    title="View"
                    color="green"
                    onPress={() => this.props.navigation.navigate('UserProfile', { profile_id: item.user_id })}
                  />
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.user_id.toString()}
          />
        </View>
      </ScrollView>
    );
  }
}

export default FriendsScreen;

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
