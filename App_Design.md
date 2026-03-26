Purpose of the Application:

What does the app even do?

Who can benefit from this app?

What screens / components it needs

What state and user interactions are required


App name
    BounceBack

Problem statements:
What problem does this solve?

Why would you want to use this?

Target users
    Anyone who gets injuried or wants to exercise to prevent certian injuries

Core features

User Interaction Flow
A step-by-step process
    User opens app
    User goes through filling out information 
        Area of injury
        pain level
        what caused this pain?
        entering age (some discomfort is more common with older generations)
    App will give a general diagnosis 
    Will give some suggestions for treatment
Components 
    App
    Header
    Forms?

State and data
    list of items
    user input boxes
    injury data 

*NOTE* that these diagnosis results are not 100% accurate

This app will initially focus on the major joints of the body such as: 
    shoulder 
    elbow
    wrist
    hip
    knee
    ankle
these are the most common types of injuries in the body





import React, { useState } from 'react';
import {View, TextInput, Button, Text } from 'react-native';

export default function LoginScreen()
{
    const [username, setUsername] = useState('');
    const [passowrd, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => 
    {
        try 
        {
            const response = await fetch('https://your-api.com/login', 
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

          const data = await response.json();  

          if (response.ok)
          {
            console.log('Logged in!', data);
            // Save Token here
          }
          else
          {
            setError(data.message || 'Login failed');
          }
        } 
        
        catch (err) 
        {
          setError('Network Error');  
        }     
    };

    return
    (
        <View>
            <TextInput
                placeholder = 'Username'
                value = {username}
                onChangeText = {setUsername}
            />

            {error ? <Text> {error} </Text> : null}

            <Button title = "Login" onPress = {handleLogin} />
        </View>
    );

    type Screen = 'login' | 'signup' | 'reset';

    const [screen, setScreen] = useState<Screen>('login');

    if (!user)
    {
        if (screen === 'signup') return <SignupScreen />;
        if (screen === 'reset') return <ResetPasswordScreen />;
    }
}