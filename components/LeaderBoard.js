import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {auth, db} from '../firebase-config.js';

import {doc, getDoc, setDoc} from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons.js';
import _ from 'lodash';

const LeaderBoard = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [livePresses, setLivePresses] = useState(0);
  const [tyPresses, setTyPresses] = useState(0);
  const [tyTimestamps, setTyTimestamps] = useState([]);
  const [tyDates, setTyDates] = useState([]);
  const [liveTimestamps, setLiveTimestamps] = useState([]);
  const [liveDates, setLiveDates] = useState([]);
  const [tyToday, setTyToday] = useState(0);
  const [liveToday, setLiveToday] = useState(0);
  const [leaderBoardToday, setLeaderBoardToday] = useState(true);
  const totalPressesToday = tyToday + liveToday;
  const totalPressesAllTimeAreEqual = tyPresses === livePresses;

  const switchFilter = () => {
    console.log('Switch Filter');
    setLeaderBoardToday(prev => !prev); // Toggle the state using the previous state
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

  const fetchData = async () => {
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

  useEffect(() => {
    fetchData();
  }, []); // Fetch data only on initial mount

  useEffect(() => {
    sortDates();
  }, [sortDates]); // Sort dates whenever timestamps change

  useEffect(() => {
    const today = new Date();
    const t = tyDates.filter(
      date => date.toDateString() === today.toDateString(),
    ).length;
    const l = liveDates.filter(
      date => date.toDateString() === today.toDateString(),
    ).length;
    setTyToday(t);
    setLiveToday(l);
  }, [tyDates, liveDates, leaderBoardToday]); // Update today's presses when timestamps or the filter changes

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
};

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
  leaderBoardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    justifyAlign: 'center',
    backgroundColor: 'black',
  },
  switchFilterButton: {
    backgroundColor: 'yellow',
    padding: 6,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
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

export default LeaderBoard;
