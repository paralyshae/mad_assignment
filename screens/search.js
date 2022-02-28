import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, Button } from 'react-native';

class SearchScreen extends Component{

    search = () => {

    }

    render(){
        return (
            <ScrollView>
                <TextInput
                    placeholder="Enter a user..." // placeholder in text box
                   // onChangeText={(email) => this.setState({email})} // assign entered email value to database
                   // value={this.state.email}
                    style={{padding:5, borderWidth:1, margin:5}} // styling for text box
                />
                <Button // button to navigate to sign up screen
                    title="Search"
                    color="green"
                    onPress={() => this.props.navigation.navigate("search")}
                />
            </ScrollView>
        )
    }
    
  }

export default SearchScreen;