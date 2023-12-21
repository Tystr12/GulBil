/**
 * GulBil App
 */
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import LeaderBoard from './components/LeaderBoard.js';
import HomeScreen from './components/HomeSceen.js';
import LoginScreen from './components/LoginScreen.js';
import {Button} from 'react-native-elements';
//import {lightColors} from '@rneui/base';

/** This is a react native component, where you can pass a title and children.     */
const Stack = createStackNavigator();

function App({}) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerStyle: {backgroundColor: 'yellow'},
            headerTintColor: '#000',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="GulBil"
          component={HomeScreen}
          options={{
            headerStyle: {backgroundColor: 'yellow'},
            headerTintColor: '#000',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="LeaderBoard"
          component={LeaderBoard}
          options={{
            headerStyle: {backgroundColor: 'yellow'},
            headerTintColor: '#000',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
