import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator, Header } from '@react-navigation/bottom-tabs';

import LogoutScreen from './logout';
import ProfileScreen from './profile';
import CameraScreen from './camera';
import FriendRequestScreen from './friendRequest';
import SearchScreen from './search';

const Tab = createBottomTabNavigator();

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      listData: []
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      <Tab.Navigator

        screenOptions={() => ({ // tab icon changes colour when on relevant screen
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'black',
        })}>

        <Tab.Screen name="MyProfile" component={ProfileScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="FriendRequests" component={FriendRequestScreen} />
        <Tab.Screen name="Logout" component={LogoutScreen} />
      </Tab.Navigator>
    )
  }
}

export default HomeScreen;