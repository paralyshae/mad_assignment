import React, { Component, useReducer } from 'react';
import { View, Text, FlatList, ScrollView, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendRequestScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      friendRequestData: []
    }
  }

  componentDidMount() {
    this.getFriendRequestData();
  }

  getFriendRequestData = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
      method: 'get',
      headers: {
        "X-Authorization": value
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) { //unauthorised / not logged in
          this.props.navigation.navigate("Login");
        } else {
          throw 'Something went wrong'; // 500 server error
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          userData: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  acceptRequest = async (id) => {
    return fetch("http://localhost:3333/api/1.0.0/friendrequests" + id, {
      method: 'post'
    })
      .then(() => {
        this.getFriendRequestData();
      })
      .then(() => {
        console.log("Request Accepted")
      })
      .catch((err) => {
        console.log(err);
      })
  }

  rejectRequest = async (id) => {
    return fetch("http://localhost:3333/api/1.0.0/friendrequests" + id, {
      method: 'delete'
    })
      .then(() => {
        this.getFriendRequestData();
      })
      .then(() => {
        console.log("Request Rejected")
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator
            size="large"
            color="#00ff00"
          />
        </View>
      );
    } else {
      return (
        <ScrollView>
          <FlatList
            data={this.state.friendRequestData}
            renderRequests={(userData) => (
              <View>
                <Text>{this.state.friendRequestData}</Text>
                <Button
                  title="Accept"
                  color="green"
                  onPress={() => this.acceptRequest(userData.id)}
                />
                <Button
                  title="Reject"
                  color="red"
                  onPress={() => this.rejectRequest(userData.id)}
                />
              </View>
            )}
            keyExtractor={(item, index) => this.userData.toString()}
          />
        </ScrollView>
      );
    }
  }
}

export default FriendRequestScreen;