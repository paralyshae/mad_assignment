import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/login';
import SignupScreen from './screens/signup';
import HomeScreen from './screens/home';
import CameraScreen from './screens/camera';
import ProfileScreen from './screens/profile';

const Stack = createNativeStackNavigator();

// function Root(){
//   return(
//     <Stack.Navigator>
//     <Stack.Screen name="Login" component={LoginScreen} />
//     <Stack.Screen name="Signup" component={SignupScreen} />
//     <Stack.Screen name="Home" component={HomeScreen} />
//     </Stack.Navigator>
//   );
// }
// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ // styling options for stack navigation headers
//         headerStyle: {
//           backgroundColor: "#2F4F4F",
//         },
//         headerTintColor: "white",
//         headerBackTitle: "Back",
//       }}>
//         <Stack.Screen
//         name="Root"
//         component={Root}
//         options={{ headerShown: false}}
//         />
//         <Stack.Screen name="Camera" component={HomeScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App; 


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ // styling options for stack navigation headers
        headerStyle: {
          backgroundColor: "#2F4F4F",
        },
        headerTintColor: "white",
        headerBackTitle: "Back",
      }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App; 