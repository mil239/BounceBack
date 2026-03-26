import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { logout } from '../services/auth';

export default function HomeScreen() {
    const router = useRouter();
    const [age, setAge] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome!</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your age"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
            />

            <Button title="Injury Checker"     onPress={() => router.push({ pathname: '/Injury',   params: { age } })} />
            <Button title="Joint Exercises"    onPress={() => router.push('/Exercise')} />
            <Button title="Logout"             onPress={logout} />
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
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        elevation: 2,
        width: '80%',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});