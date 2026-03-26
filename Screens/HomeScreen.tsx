import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { logout } from '../services/auth';
import IndexScreen from './IndexScreen';
import InjuryScreen from './InjuryScreen';
import RecoveryScreen from './RecoveryScreen';

type Screen = 'home' | 'index' | 'injury' | 'recovery';

export default function HomeScreen() 
{
    const [screen, setScreen] = useState<Screen>('home');
    
    if (screen === 'index') return <IndexScreen goBack = {() => setScreen('home')} />;
    if (screen === 'injury') return <InjuryScreen goBack = {() => setScreen('home')} />;
    if (screen === 'recovery') return <RecoveryScreen goBack = {() => setScreen('home')} />;

    return
    (
        <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style = {{ fontSize: 24, marginBottom: 20 }}> Welcome! </Text>

            <Button title = "Index" onPress = {() => setScreen('index')} />
            <Button title = "Injury" onPress = {() => setScreen('injury')} />
            <Button title = "Recovery" onPress = {() => setScreen('recovery')} />
            <Button title = "Logout" onPress = {logout} style = {{ marginTop: 20 }} />
        </View>
    );
}

