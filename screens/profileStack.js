import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import ProfileScreen from './profile';
import CameraScreen from './camera';
import UpdateUserData from './patch';
import FriendsScreen from './friends';
import PostScreen from './post';

const ProfStack = createNativeStackNavigator();

class ProfileStack extends Component {
    render() {
        return (
            <ProfStack.Navigator>
                <ProfStack.Screen name="Profile" component={ProfileScreen} />
                <ProfStack.Screen name="Camera" component={CameraScreen} />
                <ProfStack.Screen name="Friends" component={FriendsScreen} />
                <ProfStack.Screen name="Update" component={UpdateUserData} />
                <ProfStack.Screen name="Posts" component={PostScreen} />
            </ProfStack.Navigator>
        );
    }
}

export default ProfileStack;