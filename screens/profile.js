import React, { Component } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            userData: []
        }
    }

    componentDidMount(){
        this.getUserData();
        // this.getUserProfilePhoto();
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
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){ //unauthorised / not logged in
              this.props.navigation.navigate("Login");
            }else if(response.status === 404){
                throw 'Not found';
            } else{
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



    render() {
        if(this.state.isLoading){
            return(
                <View
                    style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
          }}>
          <Text>Loading...</Text>
        </View>
      );
    } else{
      return (
        <View>
            <Text>Your name is: {this.state.userData.first_name} {this.state.userData.last_name}</Text>
            <Text>Your email is: {this.state.userData.email}</Text>
            <Text>You have {this.state.userData.friend_count} friends</Text>
        </View>
      );
    }
    
  }
}

export default ProfileScreen;