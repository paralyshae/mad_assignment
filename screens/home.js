import React, {Component} from 'react';
import {View, Text, FlatList, Button, Image, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator, Header } from '@react-navigation/bottom-tabs';

import LogoutScreen from './logout';
import ProfileScreen from './profile';
import FriendRequestScreen from './friendRequest';
import SearchScreen from './search';

const Tab = createBottomTabNavigator();

class HomeScreen extends Component {
  constructor(props){
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
  
    // this.getData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  // getData = async () => {
  //   const value = await AsyncStorage.getItem('@session_token');
  //   return fetch("http://localhost:3333/api/1.0.0/search", {
  //         'headers': {
  //           'X-Authorization':  value
  //         }
  //       })
  //       .then((response) => {
  //           if(response.status === 200){
  //               return response.json()
  //           }else if(response.status === 401){
  //             this.props.navigation.navigate("Login");
  //           }else{
  //               throw 'Something went wrong';
  //           }
  //       })
  //       .then((responseJson) => {
  //         this.setState({
  //           isLoading: false,
  //           listData: responseJson
  //         })
  //       })
  //       .catch((error) => {
  //           console.log(error);
  //       })
  // }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  render(){
    return (
      <Tab.Navigator
      
      screenOptions={() => ({ // tab icon changes colour when on relevant screen
        tabBarInactiveTintColor: 'grey',
        tabBarActiveTintColor: 'tomato',
      })}>

        <Tab.Screen name="MyProfile" component={ProfileScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="FriendRequests" component={FriendRequestScreen} />
        <Tab.Screen name="Logout" component={LogoutScreen} />
      </Tab.Navigator>
    )
  }
}

//   render() {
//     if (this.state.isLoading){
//       return (
//         <View
//           style={{
//             flex: 1,
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <Text>Loading..</Text>
//         </View>
//       );
//     }else{
//       return (
//         <View>
//           <FlatList
//                 data={this.state.listData}
//                 renderItem={({item}) => (
//                     <View>
//                       <Text>{item.user_givenname} {item.user_familyname}</Text>
//                       <View style={{ height: 100, width: 100, marginTop: 0 }}>
//                       <Button
//                     title="Profile"
//                     color="grey"
//                     onPress={() => this.Login()}
//                 />
//                 </View>
//                     </View>
//                 )}
//                 keyExtractor={(item,index) => item.user_id.toString()}
//               />
//         </View>
//       );
//     }
    
//   }
// }



export default HomeScreen;