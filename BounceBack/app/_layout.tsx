import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { User } from 'firebase/auth';
import { subscribeToAuthChanges } from '../services/auth';

export default function RootLayout() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (loading) return;

        const onAuthScreen = ['Login', 'Signup', 'ResetPassword'].includes(segments[0]);

        if (!user && !onAuthScreen) {
            router.replace('/Login');
        } else if (user && onAuthScreen) {
            router.replace('/');
        }
    }, [user, loading, segments]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Screen name="index"         options={{ title: 'Home' }} />
            <Stack.Screen name="Login"         options={{ headerShown: false }} />
            <Stack.Screen name="Signup"        options={{ title: 'Sign Up' }} />
            <Stack.Screen name="ResetPassword" options={{ title: 'Reset Password' }} />
            <Stack.Screen name="Injury"        options={{ title: 'Injury Checker' }} />
            <Stack.Screen name="Exercise"      options={{ title: 'Joint Exercises' }} />
            <Stack.Screen name="Recovery"      options={{ title: 'Recovery' }} />
        </Stack>
    );
}