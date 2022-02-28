import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendRequestScreen extends Component{
        constructor(props){
            super(props);
    
            this.state = {
                isLoading: true,
                friendRequestData: []
            }
        }
    
        componentDidMount(){
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
                if(response.status === 200){
                    return response.json()
                }else if(response.status === 401){ //unauthorised / not logged in
                  this.props.navigation.navigate("Login");
                }else{
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

      acceptRequest = (friendRequestData) => {
        return fetch("http://localhost:3333/api/1.0.0/friendrequests" + id, {
          method: 'post'
        })
        .then(() => {
          this.getData();
        })
        .then(() => {
          console.log("Request Accepted")
        })
        .catch((err) => {
          console.log(err);
        })
      }

      rejectRequest = (friendRequestData) => {
        return fetch("http://localhost:3333/api/1.0.0/friendrequests" + id, {
          method: 'delete'
        })
        .then(() => {
          this.getData();
        })
        .then(() => {
          console.log("Request Rejected")
        })
        .catch((err) => {
          console.log(err);
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
          <ScrollView>
            <FlatList
                data={this.state.friendRequestData}
                renderItem={({item}) => (
                    <View>
                      <Text>{this.state.friendRequestData}</Text>
                      <Button // button to navigate to sign up screen
                            title="Accept"
                            color="green"
                            onPress={() => this.acceptRequest(getFriendRequestData)}
                        />
                        <Button // button to navigate to sign up screen
                            title="Reject"
                            color="red"
                            onPress={() => this.rejectRequest(getFriendRequestData)}
                        />
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />
        </ScrollView>
      );
    }
  }
}

export default FriendRequestScreen;