/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */
/* eslint-disable no-throw-literal */
/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, ScrollView, TextInput, Button, ActivityIndicator, FlatList, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      searchList: [],
      query: '',
    };
  }

  componentDidMount() {
    this.getSearchData();
  }

  getSearchData = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.query}`, {
      method: 'get',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          searchList: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // checkLoggedIn = async () => {
  //     const value = await AsyncStorage.getItem('@session_token');
  //     if (value == null) {
  //         this.props.navigation.navigate('Login');
  //     }
  // };

  addFriend = async (id) => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`, {
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 201) {
          console.log('Friend Request Sent');
        } else if (response.status === 401) {
          console.log('Unauthorised');
          this.props.navigation.navigate('Login');
        } else if (response.status === 403) {
          console.log('User is already added as a friend');
        } else if (response.status === 404) {
          throw 'Not found';
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
        <View>
          <TextInput
            placeholder="Search a user..."
            onChangeText={(query) => this.setState({ query })}
            value={this.state.query}
            style={{ padding: 5, borderWidth: 1, margin: 5 }}
          />
        </View>
        <Button
          title="Search"
          color="green"
          onPress={() => this.getSearchData()}
        />
        <FlatList
          data={this.state.searchList}
          renderItem={({ item }) => (
            <View>
              <Text>
                {' '}
                {item.user_givenname}
                {' '}
                {item.user_familyname}
                <Button
                  title="Add"
                  color="green"
                  onPress={() => { this.addFriend(item.user_id); }}
                />
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.user_id.toString()}
        />
      </ScrollView>
    );
  }
}

export default SearchScreen;

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
