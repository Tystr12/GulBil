/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Button,
} from 'react-native';

import {useState, useEffect, useCallback, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Header} from 'react-native-elements/dist/header/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  app,
  db,
  getFirestore,
  collection,
  addDoc,
  updateDoc as updateDocument,
} from './firebase/index.js';

import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
  arrayUnion,
  setDoc,
} from 'firebase/firestore';

/** This is a react native component, where you can pass a title and children.     */
const Stack = createStackNavigator();

function App(): JSX.Element {
  const [amountOfPresses, setPresses] = useState(0);
  const [user, setUser] = useState(false);
  const userMap = useMemo(() => {
    const map = new Map();
    map.set(false, 'Live');
    map.set(true, 'Ty');
    return map;
  }, []);
  userMap.set(false, 'Live');
  userMap.set(true, 'Ty');
  const [timestamps, setTimestamps] = useState<String[]>([]);
  const [dates, setDates] = useState<Date[]>([]);

  const changeUser = () => {
    if (user === false) {
      setUser(true);
    } else {
      setUser(false);
    }
  };

  const getPressesFromToday = () => {
    const today = new Date();
    return dates.filter(date => date.toDateString() === today.toDateString());
  };

  const sortDates = useCallback(() => {
    const sortedDates = timestamps.map(
      timestamp => new Date(String(timestamp)),
    );
    setDates(sortedDates);
  }, [timestamps]);

  const handleButtonPress = async () => {
    const timestamp = new Date().toISOString();

    try {
      const docRef = doc(db, 'Users', userMap.get(user));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const bilerArray = docSnap.data().biler || [];
        const total = docSnap.data().total || 0;

        const updatedBilerArray = [...bilerArray, timestamp];
        const updatedData = {
          biler: updatedBilerArray,
          total: total + 1,
        };

        await setDoc(docRef, updatedData, {merge: true});
        setTimestamps(updatedBilerArray);
        sortDates(); // Sort the timestamps into dates
        setPresses(amountOfPresses + 1);
        console.log('Timestamp added to the Live document.');
      }
    } catch (e) {
      console.error('Error adding timestamp: ', e);
    }
  };
  useEffect(() => {
    const getDatabasePresses = async () => {
      const docRef = doc(db, 'Users', userMap.get(user));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const p = docSnap.data().total;
        const t = docSnap.data().biler;
        setPresses(p);
        setTimestamps(t);
        sortDates(); // Sort the timestamps into dates
      } else {
        console.log('docSnap data was empty...');
      }
    };
    getDatabasePresses();
    sortDates();
  }, [sortDates, user, userMap]);

  const getNewestPress = () => {
    if (dates.length === 0) {
      return '';
    }
    const data = dates[dates.length - 1];
    const date = data.toDateString();
    const hour = data.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
    return date + ' ' + hour;
  };
  const handleMenuPress = () => {
    // Handle menu button press
    console.log('Menu button pressed');
  };

  return (
    <NavigationContainer>
      <Header
        backgroundColor="yellow"
        leftComponent={
          <TouchableOpacity onPress={handleMenuPress}>
            <Icon name="table" color="#000" size={24} />
          </TouchableOpacity>
        }
        centerComponent={{
          text: 'GulBil',
          style: {color: '#000', fontSize: 20},
        }}
        rightComponent={{icon: 'home', color: '#000'}}
      />
      <View style={styles.buttonContainer}>
        <Button onPress={changeUser} title="Change User" />
        <Text style={styles.text}>
          You are logged in as {userMap.get(user)}
        </Text>
        <TouchableOpacity onPress={handleButtonPress} style={styles.button}>
          <Icon name="circle" size={180} color="yellow" style={styles.button} />
        </TouchableOpacity>
        <Text style={styles.text}>Today: {getPressesFromToday().length}</Text>
        <Text style={styles.text}>All time:{amountOfPresses}</Text>
        <Text style={styles.text}>Last GulBil: {getNewestPress()}</Text>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 30,
    padding: 10,
  },
  text: {
    color: 'yellow',
    fontSize: 20,
  },
});

export default App;
