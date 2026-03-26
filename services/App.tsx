import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import { subscribeToAuthChanges } from './services/auth';
import { User } from 'firebase/auth';

type Screen = 'login' | 'signup' | 'reset';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<Screen>('login');

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );

  if (!user) {
    if (screen === 'signup')
      return <SignupScreen goToLogin={() => setScreen('login')} />;
    if (screen === 'reset')
      return <ResetPasswordScreen goToLogin={() => setScreen('login')} />;

    return (
      <LoginScreen
        goToSignup={() => setScreen('signup')}
        goToReset={() => setScreen('reset')}
      />
    );
  }

  return <HomeScreen />;
}
