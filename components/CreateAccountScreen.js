/* eslint-disable prettier/prettier */
import React from 'react';
import {useState} from 'react';
import {auth} from '../firebase-config.js';
import Styles from './Styles.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
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

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(authenticate, email,password);
            console.log(response);
        } catch (error) {
            console.log(error);
            alert('sign in failed' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(authenticate, email,password);
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

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
