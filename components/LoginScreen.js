import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Button,
} from 'react-native';

import LeaderBoard from './LeaderBoard.js';
import HomeScreen from './HomeSceen.js';
import {useState, useEffect, useCallback, useMemo} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons.js';
import {
  app,
  db,
  getFirestore,
  collection,
  addDoc,
  updateDoc as updateDocument,
} from '../firebase/index.js';

import {doc, getDoc, setDoc} from 'firebase/firestore';

import Styles from './Styles.js';

const LoginScreen = ({navigation}) => {
  const text = 'this is screen';
  return (
    <View style={Styles.container}>
      <Text>{text}</Text>
      <Button title="Home" onPress={() => navigation.navigate('GulBil')} />
    </View>
  );
};

export default LoginScreen;
