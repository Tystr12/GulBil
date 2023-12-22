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
import CreateAccountScreen from './components/CreateAccountScreen.js';
import {Button} from 'react-native-elements';
import {useState, useEffect} from 'react';
import {User, onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase-config.js';
//import {lightColors} from '@rneui/base';

/** This is a react native component, where you can pass a title and children.     */
const loginStack = createStackNavigator();
const Stack = createStackNavigator();

function insideLayout() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccountScreen}
          options={{
            headerStyle: {backgroundColor: 'yellow'},
            headerTintColor: '#000',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function loginLayout() {
  return (
    <NavigationContainer>
      <loginStack.Navigator>
        <loginStack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerStyle: {backgroundColor: 'yellow'},
            headerTintColor: '#000',
            headerTitleAlign: 'center',
          }}
        />
        <loginStack.Screen
          name="CreateAccount"
          component={CreateAccountScreen}
          options={{
            headerStyle: {backgroundColor: 'yellow'},
            headerTintColor: '#000',
            headerTitleAlign: 'center',
          }}
        />
      </loginStack.Navigator>
    </NavigationContainer>
  );
}

function App({}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);
  return user ? insideLayout() : loginLayout();
}

export default App;
