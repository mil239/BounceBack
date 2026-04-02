import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { User } from 'firebase/auth';
import { subscribeToAuthChanges } from '../services/auth';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        // Safety net — never stay stuck loading forever
        const timeout = setTimeout(() => {
            setLoading(false);
            SplashScreen.hideAsync();
        }, 3000);

        const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
            clearTimeout(timeout);
            setUser(firebaseUser);
            setLoading(false);
            SplashScreen.hideAsync();
        });

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
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

    if (loading) return null;

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