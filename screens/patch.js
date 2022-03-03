import React, { Component } from 'react';
import { View, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UpdateUserData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      originalFirstName: '',
      originalLastName: '',
      originalEmail: '',
      firstName: "",
      lastName: "",
      email: "",

    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');

    return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
        "X-Authorization": token
      },

    })

      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) { // bad request
          throw 'Bad Request 400';
        } else if (response.status === 401) { // unauthorised
          throw 'Unauthorised 401';
        } else if (response.status === 403) { // forbidden
          throw 'Forbidden 403';
        } else if (response.status === 404) { // not found
          throw 'Not Found 404';
        } else { // server error 500
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          originalFirstName: responseJson.first_name,
          originalLastName: responseJson.last_name,
          originalEmail: responseJson.email,
          firstName: responseJson.first_name,
          lastName: responseJson.last_name,
          email: responseJson.email,
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  updateInformation = async () => {

    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');

    let toSend = {};

    if (this.state.firstName != this.state.originalFirstName) {
      toSend['first_name'] = this.state.firstName;
    }

    if (this.state.lastName != this.state.originalLastName) {
      toSend['last_name'] = this.state.lastName;
    }

    if (this.state.email != this.state.originalEmail) {
      toSend['email'] = (this.state.email);
    }


    console.log(JSON.stringify(toSend));

    return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        "X-Authorization": token
      },
      body: JSON.stringify(toSend)
    })

      .then((response) => {
        if (response.status === 200) {
          console.log("Details updated");
        } else if (response.status === 400) { // bad request
          throw 'Bad Request 400';
        } else if (response.status === 401) { // unauthorised
          throw 'Unauthorised 401';
        } else if (response.status === 403) { // forbidden
          throw 'Forbidden 403';
        } else if (response.status === 404) { // not found
          throw 'Not Found 404';
        } else { // server error 500
          throw 'Something went wrong';
        }
      })
      .then(() => {
        console.log("Details updated");
      })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="Enter your first name..."
          onChangeText={(firstName) => this.setState({ firstName })}
          value={this.state.firstName}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <TextInput
          placeholder="Enter your last name..."
          onChangeText={(lastName) => this.setState({ lastName })}
          value={this.state.lastName}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <TextInput
          placeholder="Enter your email address..."
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Button
          title="Update Details"
          onPress={() => { this.updateInformation(); }}
        />
      </View>
    );
  }
}


export default UpdateUserData;