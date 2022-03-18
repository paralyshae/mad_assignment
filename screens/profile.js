/* eslint-disable consistent-return */
/* eslint-disable no-throw-literal */
import React, { Component } from 'react';
import {
  View, Text, ActivityIndicator, Image, StyleSheet, Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photo: null,
      isLoading: true,
      userData: [],
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getUserData();
      this.getUserProfilePhoto();
    });
    this.getUserData();
    this.getUserProfilePhoto();
  }

  getUserProfilePhoto = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
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
      .catch((err) => {
        console.log('error', err);
      });
  };

  getUserData = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
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
          throw 'Not found';
        } else {
          throw 'Something went wrong'; // 500 server error
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
            title="Update Info"
            color="green"
            onPress={() => this.props.navigation.navigate('Update')}
          />
          <Button
            title="View Friends"
            color="green"
            onPress={() => this.props.navigation.navigate('Friends')}
          />
          <Button
            title="Update Photo"
            color="green"
            onPress={() => this.props.navigation.navigate('Camera')}
          />
          <Button
            title="Post"
            color="green"
            onPress={() => this.props.navigation.navigate('Post')}
          />
          <Button
            title="Feed"
            color="green"
            onPress={() => this.props.navigation.navigate('Feed')}
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

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: 10,
  },
  photo: {
    width: '60%',
    height: '35%',
    borderWidth: 2,
    marginTop: 10,
  },
});
