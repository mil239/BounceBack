import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { logout } from '../services/auth';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome!</Text>

            <Button title="Injury Checker" onPress={() => router.push('/Injury')} />
            <Button title="Logout"         onPress={logout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});


