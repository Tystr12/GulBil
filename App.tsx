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
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';

import {useState, useEffect, useCallback, useMemo} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons.js';
import {
  app,
  db,
  getFirestore,
  collection,
  addDoc,
  updateDoc as updateDocument,
} from './firebase/index.js';

import {doc, getDoc, setDoc} from 'firebase/firestore';
import _ from 'lodash';
//import {lightColors} from '@rneui/base';

/** This is a react native component, where you can pass a title and children.     */
const Stack = createStackNavigator();

const HomeScreen = React.memo(({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [amountOfPresses, setPresses] = useState(0);
  const [user, setUser] = useState(false);
  const userMap = useMemo(() => {
    const map = new Map();
    map.set(false, 'Live');
    map.set(true, 'Ty');
    return map;
  }, []);
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
        setPresses(prevPresses => prevPresses + 1); // add to amount of presses. for git
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
        setIsLoading(false); // Data has been fetched, set isLoading to false
      } else {
        console.log('docSnap data was empty...');
        setIsLoading(false); // Data has been fetched, set isLoading to false
      }
    };
    getDatabasePresses();
    sortDates();
  }, [sortDates, user]);

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
    // Show the loading screen while data is being fetched
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#42f2f5" />
        <Text style={styles.loadingText}>Loading..</Text>
      </View>
    );
  }

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
    </>
  );
});

const LeaderBoard = React.memo(({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [livePresses, setLivePresses] = useState(0);
  const [tyPresses, setTyPresses] = useState(0);
  const [tyTimestamps, setTyTimestamps] = useState<String[]>([]);
  const [tyDates, setTyDates] = useState<Date[]>([]);
  const [liveTimestamps, setLiveTimestamps] = useState<String[]>([]);
  const [liveDates, setLiveDates] = useState<Date[]>([]);
  const [tyToday, setTyToday] = useState(0);
  const [liveToday, setLiveToday] = useState(0);
  const [leaderBoardToday, setLeaderBoardToday] = useState(true);
  const totalPressesToday = tyToday + liveToday;
  const totalPressesAllTimeAreEqual = tyPresses === livePresses;

  const switchFilter = () => {
    console.log('Switch Filter');
    if (leaderBoardToday === true) {
      setLeaderBoardToday(false);
    } else {
      setLeaderBoardToday(true);
    }
  };
  const debouncedSwitch = _.debounce(switchFilter, 500);

  const sortDates = useCallback(() => {
    const sortedDatesTy = tyTimestamps.map(
      timestamp => new Date(String(timestamp)),
    );
    setTyDates(sortedDatesTy);
    const sortedDatesLive = liveTimestamps.map(
      timestamp => new Date(String(timestamp)),
    );
    setLiveDates(sortedDatesLive);
  }, [tyTimestamps, liveTimestamps]);

  useEffect(() => {
    const getDatabasePresses = async () => {
      try {
        const docRefLive = doc(db, 'Users', 'Live');
        const docRefTy = doc(db, 'Users', 'Ty');

        const [docSnapLive, docSnapTy] = await Promise.all([
          getDoc(docRefLive),
          getDoc(docRefTy),
        ]);

        if (docSnapLive.exists() && docSnapTy.exists()) {
          const liveData = docSnapLive.data();
          const tyData = docSnapTy.data();

          setLivePresses(liveData.total || 0);
          setLiveTimestamps(
            liveData.biler?.map(timestamp => timestamp.toString()) || [],
          );
          setTyPresses(tyData.total || 0);
          setTyTimestamps(
            tyData.biler?.map(timestamp => timestamp.toString()) || [],
          );
          setIsLoading(false);
        } else {
          console.log('docSnap data was empty...');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
        setIsLoading(false);
      }
    };

    const getPressesFromToday = () => {
      const today = new Date();
      const t = tyDates.filter(
        date => date.toDateString() === today.toDateString(),
      ).length;
      const l = liveDates.filter(
        date => date.toDateString() === today.toDateString(),
      ).length;
      setTyToday(t);
      setLiveToday(l);
      //sortDates();
    };

    getDatabasePresses();
    //sortDates();
    getPressesFromToday();
  }, []);

  // Separate useEffect to handle sorting dates
  useEffect(() => {
    const sortedDatesTy = tyTimestamps.map(
      timestamp => new Date(String(timestamp)),
    );
    setTyDates(sortedDatesTy);
    const sortedDatesLive = liveTimestamps.map(
      timestamp => new Date(String(timestamp)),
    );
    setLiveDates(sortedDatesLive);
  }, [tyTimestamps, liveTimestamps]);

  if (isLoading) {
    // Show the loading screen while data is being fetched
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#42f2f5" />
        <Text style={styles.loadingText}>Loading..</Text>
      </View>
    );
  }

  return (
    <View style={styles.leaderBoardContainer}>
      {leaderBoardToday ? (
        <View>
          <Text style={styles.highlight}>Today: </Text>
          <Text style={styles.text}>
            Leader:{' '}
            {totalPressesToday === 0 ? (
              <Text style={styles.highlight}>No one</Text>
            ) : (
              <>
                {tyToday > liveToday ? (
                  <Text style={styles.highlight}>Ty</Text>
                ) : (
                  <Text style={styles.highlight}>Live</Text>
                )}
                <Icon name="crown-outline" size={40} color={'yellow'} />
              </>
            )}
          </Text>
          <Text style={styles.text}>
            Live: <Text style={styles.highlight}>{liveToday}</Text>
          </Text>
          <Text style={styles.text}>
            Ty: <Text style={styles.highlight}>{tyToday}</Text>
          </Text>
        </View>
      ) : (
        <View>
          <Text style={styles.highlight}>All time: </Text>
          <Text style={styles.text}>
            Leader:{' '}
            {totalPressesAllTimeAreEqual ? (
              <Text style={styles.highlight}>No one</Text>
            ) : (
              <>
                {tyPresses > livePresses ? (
                  <Text style={styles.highlight}>Ty</Text>
                ) : (
                  <Text style={styles.highlight}>Live</Text>
                )}
                <Icon name="crown-outline" size={40} color={'yellow'} />
              </>
            )}
          </Text>
          <Text style={styles.text}>
            Live: <Text style={styles.highlight}>{livePresses}</Text>
          </Text>
          <Text style={styles.text}>
            Ty: <Text style={styles.highlight}>{tyPresses}</Text>
          </Text>
        </View>
      )}
      <TouchableOpacity
        onPress={debouncedSwitch}
        style={styles.switchFilterButton}>
        <Text style={styles.buttonText}>Switch Filter</Text>
      </TouchableOpacity>
    </View>
  );
});

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    padding: 140,
    backgroundColor: 'yellow',
  },
  loadingText: {
    color: 'black',
    fontSize: 20,
    padding: -10,
  },
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
  switchFilterButton: {
    backgroundColor: 'yellow',
    padding: 6,
    borderRadius: 8,
    //marginLeft: 128,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonLeft: {
    backgroundColor: 'yellow',
    padding: 6,
    borderRadius: 8,
    marginTop: 10,
    marginRight: 10,
    marginLeft: -5,
  },
  buttonRight: {
    backgroundColor: 'yellow',
    padding: 6,
    borderRadius: 8,
    marginTop: 10,
    marginLeft: 16,
  },
  bottomLeftButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  bottomRightButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
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
