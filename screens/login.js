import React, { Component } from 'react';
import { View, Text, Button, ScrollView, TextInput } from 'react-native';

class LoginScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: ""
        }
    }

    render(){
        return (
            <ScrollView>
                <TextInput
                    placeholder="Enter your email..."
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                    placeholder="Enter your password..."
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    secureTextEntry // hide user input
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <Button
                    title="Login"
                    color="blue"
                    onPress={() => this.login()}
                />
                <Button
                    title="Don't have an account?"
                    color="red"
                    onPress={() => this.props.navigation.navigate("Signup")}
                />
            </ScrollView>
        )
    }
    
  }

  export default LoginScreen;