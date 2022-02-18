import React, { Component } from 'react';
import { Button, ScrollView, TextInput } from 'react-native';

class SignupScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        }
    }

    render(){
        return (
            // make app scrollable.
            <ScrollView> 
                <TextInput
                    placeholder="Enter your first name..."
                    onChangeText={(firstName) => this.setState({firstName})}
                    value={this.state.firstName}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                    placeholder="Enter your last name..."
                    onChangeText={(lastName) => this.setState({lastName})}
                    value={this.state.lastName}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
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
                    title="Create an account"
                    color="blue"
                    onPress={() => this.signup()}
                />
            </ScrollView>
        )
    }
}

export default SignupScreen;