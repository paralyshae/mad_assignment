/* eslint-disable linebreak-style */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from './profile';
import UserProfileScreen from './user.js';
import CameraScreen from './camera';
import FriendsScreen from './friends';
import UpdateUserData from './patch';
import PostScreen from './post';

const ProfStack = createNativeStackNavigator();

class ProfileStack extends Component {
  render() {
    return (
      <ProfStack.Navigator>
        <ProfStack.Screen name="Profile" component={ProfileScreen} />
        <ProfStack.Screen name="UserProfile" component={UserProfileScreen} />
        <ProfStack.Screen name="Camera" component={CameraScreen} />
        <ProfStack.Screen name="Friends" component={FriendsScreen} />
        <ProfStack.Screen name="Update" component={UpdateUserData} />
        <ProfStack.Screen name="Posts" component={PostScreen} />
      </ProfStack.Navigator>
    );
  }
}

export default ProfileStack;
