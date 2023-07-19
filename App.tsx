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
  Image,
} from 'react-native';

import {useState, useEffect, useCallback, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Header} from 'react-native-elements/dist/header/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons.js';
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
import {lightColors} from '@rneui/base';

/** This is a react native component, where you can pass a title and children.     */
const Stack = createStackNavigator();

function HomeScreen({navigation}): JSX.Element {
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
        setPresses(amountOfPresses + 1); // add to amount of presses. for git
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

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>
          You are logged in as
          <Text style={styles.highlight}> {userMap.get(user)}</Text>
        </Text>
        <TouchableOpacity
          onPress={handleButtonPress}
          style={styles.gulBilButton}>
          <Image source={require('./assets/images.jpg')} />
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
          <TouchableOpacity onPress={changeUser} style={styles.button}>
            <Text style={styles.buttonText}>Change User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('LeaderBoard')}
            style={styles.button}>
            <Text style={styles.buttonText}>LeaderBoard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

function LeaderBoard({navigation}): JSX.Element {
  const [livePresses, setLivePresses] = useState(0);
  const [liveTimestamps, setLiveTimestamps] = useState<String[]>([]);
  const [tyPresses, setTyPresses] = useState(0);
  const [tyTimestamps, setTyTimestamps] = useState<String[]>([]);
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    const getDatabasePresses = async () => {
      const docRefLive = doc(db, 'Users', 'Live');
      const docSnapLive = await getDoc(docRefLive);

      const docRefTy = doc(db, 'Users', 'Ty');
      const docSnapTy = await getDoc(docRefTy);

      if (docSnapLive.exists() && docSnapTy.exists()) {
        const livePresses = docSnapLive.data().total;
        const liveTotal = docSnapLive.data().biler;
        const tyPresses = docSnapTy.data().total;
        const tyTotal = docSnapTy.data().biler;

        setLivePresses(livePresses);
        setLiveTimestamps(liveTotal.map(timestamp => timestamp.toString()));
        setTyPresses(tyPresses);
        setTyTimestamps(tyTotal.map(timestamp => timestamp.toString()));
      } else {
        console.log('docSnap data was empty...');
      }
    };

    getDatabasePresses();
  }, []);

  return (
    <View style={styles.leaderBoardContainer}>
      <Button title="Home" onPress={() => navigation.navigate('GulBil')} />
      <Text style={styles.text}>
        Leader:{' '}
        {tyPresses >= livePresses ? (
          <Text style={styles.highlight}>Ty</Text>
        ) : (
          <Text style={styles.highlight}>Live</Text>
        )}
        <Icon name="crown-outline" size={30} color={'yellow'} />
      </Text>
      <Text style={styles.text}>Live: {livePresses}</Text>
      <Text style={styles.text}>Ty: {tyPresses}</Text>
    </View>
  );
}

function App({}): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="GulBil"
          component={HomeScreen}
          options={{
            headerStyle: {backgroundColor: 'yellow'},
            headerTintColor: '#000',
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

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 60,
    position: 'relative',
    backgroundColor: 'black',
  },
  leaderBoardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    justifyAlign: 'center',
    backgroundColor: 'black',
  },
  gulBilButton: {
    backgroundColor: 'yellow',
    padding: 8,
    borderRadius: 8,
  },
  button: {
    backgroundColor: 'yellow',
    padding: 6,
    borderRadius: 8,
  },
  bottomLeftButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  bottomRightButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    color: 'yellow',
    fontSize: 20,
  },
  highlight: {
    color: '#42f2f5',
    fontSize: 30,
  },
});

export default App;
