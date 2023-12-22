/* eslint-disable prettier/prettier */
import React from 'react';
import {useState} from 'react';
import {auth, db} from '../firebase-config.js';
import Styles from './Styles.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import {doc, getDoc, setDoc, getFirestore} from 'firebase/firestore';
import {
    View,
    TextInput,
    Text,
    ActivityIndicator,
    Button,
  } from 'react-native';

const CreateAccountScreen = ({navigation}) => {
    const authenticate = auth;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    console.log('DB:', db);

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(authenticate, email,password);
            console.log(response);
            console.log('LOGIN SUCCESS', response.user.email);

            const currentUser = response.user;
            const userEmail = currentUser.email;
            const userDocRef = doc(db, 'Users', userEmail);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                await setDoc(userDocRef, {biler: [], total: 0});
                console.log('User document did not exist. Created a new one.');
            }
            navigation.navigate('GulBil');
        } catch (error) {
            console.log(error);
            alert('sign in failed' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(authenticate, email,password);
            console.log('SIGNUP SUCCESS',response.user.email);

            const userDocRef = doc(db, 'Users', response.user.email);
            await setDoc(userDocRef, {biler: [], total: 0});

            console.log('User document created');

        } catch (error) {
            console.log('SIGNUP ERROR', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput value={email}placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
            <TextInput value={password} placeholder="Password" autoCapitalize="none" secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
            {loading ? (
                <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#42f2f5" />
            <Text style={styles.loadingText}>Loading..</Text>
          </View>
            ) : (
                <>
                <Button title="Login" onPress={signIn} />
                <Button title="Sign Up" onPress={signUp} />
                </>
            ) }
        </View>

    );
};

const styles = Styles;

export default CreateAccountScreen;
