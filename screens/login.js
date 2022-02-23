import React, { Component } from 'react';
import { Button} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: ""
        }
    }

    login = async () => {

        return fetch("http://localhost:3333/api/1.0.0/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'Invalid email or password'; // e.g. if you try to submit empty text fields this message will show in console
            }else{
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {
                console.log(responseJson);
                await AsyncStorage.setItem('@session_token', responseJson.token);
                this.props.navigation.navigate("Home"); // if login is successful navigate user to home screen
        })
        .catch((error) => { // error saving data
            console.log(error);
        })
    }

    render(){
        return (
            <ScrollView>
                <TextInput
                    placeholder="Enter your email..." // placeholder in text box
                    onChangeText={(email) => this.setState({email})} // assign entered email value to database
                    value={this.state.email}
                    style={{padding:5, borderWidth:1, margin:5}} // styling for text box
                />
                <TextInput
                    placeholder="Enter your password..."
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    secureTextEntry // hide user input
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <Button // login button
                    title="Login"
                    color="blue"
                    onPress={() => this.login()}
                />
                <Button // button to navigate to sign up screen
                    title="Don't have an account?"
                    color="red"
                    onPress={() => this.props.navigation.navigate("Signup")}
                />
            </ScrollView>
        )
    }
    
  }

  export default LoginScreen;