/* eslint-disable prettier/prettier */
import {initializeApp} from 'firebase/app';
import {getFirestore, collection, addDoc, updateDoc,query,
  orderBy,
  limit,
  onSnapshot,
  initializeFirestore,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBjjg1kP4P0AZ4o2MFIWYqSM57xNgAvElQ",
  authDomain: "my-gul-bil.firebaseapp.com",
  databaseURL: "https://my-gul-bil-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "my-gul-bil",
  storageBucket: "my-gul-bil.appspot.com",
  messagingSenderId: "868414895631",
  appId: "1:868414895631:web:da0fd58bfc32560073557a",
  measurementId: "G-LNP5HBEYY7",
  experimentalAutoDetectLongPolling: true,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {app, db, getFirestore, collection, addDoc, updateDoc, query,
  orderBy,
  limit,
  onSnapshot};
