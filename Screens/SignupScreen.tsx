import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { signup } from '../services/auth';

export default function SignupScreen()
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

const handleSignup = async () =>
{
    try 
    {
      await signup(email, password);
      setSuccess('Account created! You can now log in.');
    } 
    catch (err: any) 
    {
        setError(err.message);
    }
};

return
(
    <View>
        <TextInput placeholder = "Email" onChangeText = {setEmail} />
        <TextInput placeholder = "Password" secureTextEntry onChangeText = {setPassword} />

        {error ? <Text> {error} </Text> : null}
        {success ? <Text> {success} </Text> : null}

        <Button title = "Sign Up" onPress = {handleSignup} />
    </View>
);
}