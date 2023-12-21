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
} from 'react-native';

import LeaderBoard from './LeaderBoard.js';
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
//import {lightColors} from '@rneui/base';
import Style from './Styles.js';

const userMap = new Map();
userMap.set(false, 'Live');
userMap.set(true, 'Ty');

const HomeScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [amountOfPresses, setPresses] = useState(0);
  const [user, setUser] = useState(false);
  const [timestamps, setTimestamps] = useState([]);
  const [dates, setDates] = useState([]);

  const changeUser = () => {
    setUser(prevUser => !prevUser);
    console.log('Switched User');
  };

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
        setPresses(prevPresses => prevPresses + 1);
        sortDates(updatedBilerArray); // Sort the timestamps into dates
        console.log('Timestamp added to the document.');
      }
    } catch (e) {
      console.error('Error adding timestamp: ', e);
    }
  };

  const sortDates = useCallback(updatedBilerArray => {
    const sortedDates = updatedBilerArray.map(
      timestamp => new Date(String(timestamp)),
    );
    setDates(sortedDates);
  }, []);

  useEffect(() => {
    const getDatabasePresses = async () => {
      const docRef = doc(db, 'Users', userMap.get(user));
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const p = docSnap.data().total;
        const t = docSnap.data().biler;
        setPresses(p);
        setTimestamps(t);
        sortDates(t); // Sort the timestamps into dates
      } else {
        console.log('docSnap data was empty...');
      }

      setIsLoading(false); // Data has been fetched, set isLoading to false
    };

    getDatabasePresses();
  }, [user, sortDates]);

  const getPressesFromToday = useCallback(() => {
    const today = new Date();
    return dates.filter(date => date.toDateString() === today.toDateString());
  }, [dates]);

  const getNewestPress = () => {
    if (dates.length === 0) {
      return '';
    }
    const data = dates[dates.length - 1];
    const date = data.toDateString();
    const hour = data.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
    return date + ' ' + hour;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#42f2f5" />
        <Text style={styles.loadingText}>Loading..</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        You are logged in as
        <Text style={styles.highlight}> {userMap.get(user)}</Text>
      </Text>
      <TouchableOpacity onPress={handleButtonPress} style={styles.gulBilButton}>
        <Image source={require('../assets/images.jpg')} />
      </TouchableOpacity>
      <Text style={styles.text}>
        Today:
        <Text style={styles.highlight}> {getPressesFromToday().length}</Text>
      </Text>
      <Text style={styles.text}>
        All time: <Text style={styles.highlight}> {amountOfPresses}</Text>
      </Text>
      <Text style={styles.text}>
        Last GulBil: <Text style={styles.highlight}>{getNewestPress()}</Text>
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={changeUser} style={styles.buttonLeft}>
          <Text style={styles.buttonText}>Change User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('LeaderBoard')}
          style={styles.buttonRight}>
          <Text style={styles.buttonText}>LeaderBoard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = Style;
export default HomeScreen;
