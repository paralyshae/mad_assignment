/* eslint-disable linebreak-style */
/* eslint-disable react/prefer-stateless-function */

import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from './profile';
import UserProfileScreen from './user';
import CameraScreen from './camera';
import FriendsScreen from './friends';
import UserFriendsScreen from './userFriends';
import UpdateUserData from './patch';
import PostScreen from './post';
import FeedScreen from './feed';
import SinglePostScreen from './singlePost';

const ProfStack = createNativeStackNavigator();

class ProfileStack extends Component {
  render() {
    return (
      <ProfStack.Navigator>
        <ProfStack.Screen name="Profile" component={ProfileScreen} />
        <ProfStack.Screen name="UserProfile" component={UserProfileScreen} />
        <ProfStack.Screen name="Camera" component={CameraScreen} />
        <ProfStack.Screen name="Friends" component={FriendsScreen} />
        <ProfStack.Screen name="UserFriends" component={UserFriendsScreen} />
        <ProfStack.Screen name="Update" component={UpdateUserData} />
        <ProfStack.Screen name="Post" component={PostScreen} />
        <ProfStack.Screen name="SinglePost" component={SinglePostScreen} />
        <ProfStack.Screen name="Feed" component={FeedScreen} />
      </ProfStack.Navigator>
    );
  }
}

export default ProfileStack;
