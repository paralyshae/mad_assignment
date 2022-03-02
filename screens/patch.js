import React, { Component } from 'react';
import { View, Text, Button, TextInput } from 'react-native';

class UpdateUserData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      originalFirstName: '',
      originalLastName: '',
      originalEmail: '',
      originalPassword: '',
    };
  }

  updateInformation = async () => {

    const id = await AsyncStorage.getItem('@session_id');

    // let data = { // convert my variables into the format the server expects
    //   first_name: this.state.originalFirstName,
    //   last_name: this.state.originalLastName,
    //   email: this.state.originalEmail,
    //   password: this.state.originalPassword
    // }

    let toSend = {};

    if (this.state.firstName != this.state.originalFirstName) {
      toSend['firstName'] = this.state.firstName;
    }

    if (this.state.description != this.state.originalLastName) {
      toSend['lastName'] = this.state.lastName;
    }

    if (this.state.unit_price != this.state.originalEmail) {
      toSend['email'] = parseInt(this.state.email);
    }

    if (this.state.quantity != this.state.originalPassword) {
      toSend['password'] = parseInt(this.state.password);
    }

    console.log(JSON.stringify(toSend));

    return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
      method: 'patch',
      headers: {
        'content-type': 'application/json'
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
        <Text>Update Details</Text>

        <TextInput
          placeholder="Enter your first name..."
          onChangeText={(firstName) => this.setState({ firstName })}
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
          onChangeText={(email) => this.setState({ email })} // assign entered name to relevant state within database
          value={this.state.email}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <TextInput
          placeholder="Enter your password..."
          onChangeText={(password) => this.setState({ password })} // assign entered name to relevant state within database
          value={this.state.password}
          secureTextEntry
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Button
          title="Update Information"
        //         onPress={() => this.props.navigation.navigate("")}
        />
      </View>
    );
  }
}


export default UpdateUserData;