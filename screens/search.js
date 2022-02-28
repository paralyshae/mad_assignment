import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SearchScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            getSearchData: []
        }
    }

    componentDidMount() {
        this.getSearchData();
    }

    getSearchData = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/search", {
            method: 'get',
            'headers': {
                'X-Authorization': value
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else if (response.status === 401) {
                    this.props.navigation.navigate("Login");
                } else {
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    getSearchData: responseJson
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate('Login');
        }
    };


    render() {
        if (this.state.isLoading) {
            return (
                <View>
                    <ActivityIndicator
                        size="large"
                        color="#00ff00"
                    />
                </View>
            );
        } else {
            return (
                <ScrollView>
                    <View>
                        <TextInput
                            placeholder="Search a user..." // placeholder in text box
                            style={{ padding: 5, borderWidth: 1, margin: 5 }} // styling for text box
                        />
                    </View>
                    <Button // button to navigate to sign up screen
                        title="Search"
                        color="green"
                        onPress={() => this.props.navigation.navigate("Search")}
                    />
                    )
                </ScrollView>
            )
        }


    }
}

export default SearchScreen;