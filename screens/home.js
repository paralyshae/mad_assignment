/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LogoutScreen from './logout';
import ProfileStack from './profileStack';
import FriendRequestScreen from './friendRequest';
import SearchScreen from './search';

const Tab = createBottomTabNavigator();

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
    };
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
    const token = await AsyncStorage.getItem('@session_token');
    if (token == null) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: '',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'MyProfile') {
              iconName = focused ? 'person-outline' : 'person-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search-outline' : 'search-outline';
            } else if (route.name === 'FriendRequests') {
              iconName = focused ? 'people-outline' : 'people-outline';
            } else if (route.name === 'Logout') {
              iconName = focused ? 'log-in-outline' : 'log-in-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },

        })}
      >

        <Tab.Screen name="MyProfile" component={ProfileStack} options={{ headerShown: false }} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="FriendRequests" component={FriendRequestScreen} />
        <Tab.Screen name="Logout" component={LogoutScreen} />
      </Tab.Navigator>
    );
  }
}

export default HomeScreen;
