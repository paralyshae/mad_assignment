/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import {
  View, TextInput, Button, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IonButton, IonIcon } from '@ionic/react';
import { pencil } from 'ionicons/icons';

class UpdateUserData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      originalFirstName: '',
      originalLastName: '',
      originalEmail: '',
      firstName: '',
      lastName: '',
      email: '',

    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
        'X-Authorization': token,
      },

    })

      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) { // bad request
          throw new Error('Bad Request 400');
        } else if (response.status === 401) { // unauthorised
          throw new Error('Unauthorised 401');
        } else if (response.status === 403) { // forbidden
          throw new Error('Forbidden 403');
        } else if (response.status === 404) { // not found
          throw new Error('Not Found 404');
        } else { // server error 500
          throw new Error('Something went wrong');
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
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updateInformation = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');

    const toSend = {};

    if (this.state.firstName !== this.state.originalFirstName) {
      toSend.first_name = this.state.firstName;
    }

    if (this.state.lastName !== this.state.originalLastName) {
      toSend.last_name = this.state.lastName;
    }

    if (this.state.email !== this.state.originalEmail) {
      toSend.email = (this.state.email);
    }

    console.log(JSON.stringify(toSend));

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(toSend),
    })

      .then((response) => {
        if (response.status === 200) {
          console.log('Details updated');
        } else if (response.status === 400) { // bad request
          throw new Error('Bad Request 400');
        } else if (response.status === 401) { // unauthorised
          throw new Error('Unauthorised 401');
        } else if (response.status === 403) { // forbidden
          throw new Error('Forbidden 403');
        } else if (response.status === 404) { // not found
          throw new Error('Not Found 404');
        } else { // server error 500
          throw new Error('Something went wrong');
        }
      })
      .then(() => {
        console.log('Details updated');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <View>
        <TextInput
          placeholder="Enter your first name..."
          onChangeText={(firstName) => this.setState({ firstName })}
          value={this.state.firstName}
          style={styles.text}
        />
        <TextInput
          placeholder="Enter your last name..."
          onChangeText={(lastName) => this.setState({ lastName })}
          value={this.state.lastName}
          style={styles.text}
        />
        <TextInput
          placeholder="Enter your email address..."
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          style={styles.text}
        />
        <Button
          title="Update Details"
          onPress={() => { this.updateInformation(); }}
        />
        <IonButton>
          <IonIcon slot="icon-only" size="large" icon={pencil} />
        </IonButton>
      </View>
    );
  }
}

export default UpdateUserData;

const styles = StyleSheet.create({
  text: {
    padding: 5,
    borderWidth: 2,
    margin: 5,
  },
});
