import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import FriendsScreen from './screens/friends';
// import CameraScreen from './camera';
// import updateInformation from './patch';

const Stack = createNativeStackNavigator();

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photo: null,
      isLoading: true,
      userData: []
    }
  }

  getUserProfilePhoto = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');
    fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
      method: 'get',
      headers: {
        'X-Authorization': value
      }
    })
      .then((res) => {
        return res.blob();
      })
      .then((resBlob) => {
        let data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false
        });
      })
      .catch((err) => {
        console.log("error", err)
      });
  }

  getUserData = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
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
        } else if (response.status === 404) {
          throw 'Not found';
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

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getUserData();
      this.getUserProfilePhoto();
    })
    this.getUserData();
    this.getUserProfilePhoto();
  }

  // render() {
  //   <Stack.Navigator screenOptions={{ // styling options for stack navigation headers
  //     headerStyle: {
  //       backgroundColor: "#2F4F4F",
  //     },
  //     headerTintColor: "white",
  //     headerBackTitle: "Back",
  //   }}>
  //     <Stack.Screen name="Update Infomation" component={updateInformation} />
  //     <Stack.Screen name="Camera" component={CameraScreen} />
  //     <Stack.Screen name="Friends" component={FriendsScreen} />
  //     <Stack.Screen name="Posts" component={PostScreen} />
  //   </Stack.Navigator>
  // }

  render() {
    if (!this.state.isLoading) {
      return (
        <View style={styles.container}>
          <Image
            source={{
              uri: this.state.photo,
            }}
            style={{
              width: 200,
              height: 200,
              borderWidth: 2,
            }}
          />

          <Text>Your name is: {this.state.userData.first_name} {this.state.userData.last_name}</Text>
          <Text>Your email is: {this.state.userData.email}</Text>
          <Text>You have {this.state.userData.friend_count} friends</Text>

          <Button
            title="Update Info"
            color="green"
            onPress={() => this.props.navigation.navigate(updateInformation)}

          />
          <Button
            title="Update Photo"
            color="green"
          />
        </View>
      );
    } else {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator
            size="large"
            color="#00ff00"
          /></View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: 10
  },
});

export default ProfileScreen;