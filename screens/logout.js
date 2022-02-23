import React, { Component } from 'react';
import { Text, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LogoutScreen extends Component{

    logout = async () => {
        let token = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'post',
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.props.navigation.navigate("Login");
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
            // ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    render(){
        return (
            <ScrollView>
                <Text style={{fontSize:18, fontWeight:'bold', padding:5, margin:5}}>Are you sure?</Text>
                <Button
                    title="Yes"
                    color="darkblue"
                    onPress={() => this.logout()}
                />
                <Button
                    title="No"
                    color="red"
                    onPress={() => this.props.navigation.navigate("Home")}
                />
            </ScrollView>
        )
    }
}

export default LogoutScreen;