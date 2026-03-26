import { View, TextInput, Button, Text } from 'react-native';
import React from 'react';

type Props = 
{
    goToSignup: () => void;
    goToReset: () => void;
};

export default function LoginScreen({ goToSignup, goToReset }: Props)
{
    return
    (
        <View>
            <Button title = "Sign Up" onPress = {goToSignup} />
            <Button title = "Forgot Password?" onPress = {goToReset} />
        </View>
    );
}