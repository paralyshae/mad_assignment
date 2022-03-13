/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import {
  View, Text, ActivityIndicator, Image, StyleSheet, Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photo: null,
      isLoading: true,
      userData: [],
    };
  }

  componentDidMount() {
    // const { profile_id } = this.props.route.params;
    this.props.navigation.addListener('focus', () => {
      this.getUserData();
      this.getUserProfilePhoto();
    });
    this.getUserData();
    this.getUserProfilePhoto();
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
            onPress={() => this.props.navigation.navigate('Friends')}
          />
          <Button
            title="Post"
            color="green"
            onPress={() => this.props.navigation.navigate('Posts')}
          />
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
});
