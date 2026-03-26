import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { resetPassword } from '../services/auth';

export default function ResetPasswordScreen()
{
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleReset = async () => 
    {
        try 
        {
            await resetPassword(email);
            setMessage('Password reset email sent!');
        }
        catch (err: any)
        {
            setMessage(err.message);
        }
    };

    return 
    (
        <View>
            <TextInput placeholder = "Enter your email" onChangeText = {setEmail} />
            <Button title = "Reset Password" onPress = {handleReset} />
            {message ? <Text> {message} </Text> : null}
        </View>
    );
}