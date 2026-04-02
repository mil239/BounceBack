import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { logout } from '../services/auth';
import { auth } from '../services/firebase';
import { useLocalSearchParams } from 'expo-router';

const { age } = useLocalSearchParams<{ age: string }>();
const ageGroup = getAgeGroup(parseInt(age as string));

export default function HomeScreen() {
    const router = useRouter();
    const [age, setAge] = useState('');

    const parsedAge = parseInt(age);
    const validAge = age.length > 0 && !isNaN(parsedAge) && parsedAge > 0 && parsedAge < 120;

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel',  style: 'cancel' },
            { text: 'Logout',  style: 'destructive', onPress: logout },
        ]);
    };

    const navigate = (path: '/Injury' | '/Exercise' | '/Recovery') => {
        router.push({ pathname: path, params: { age } });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>{auth.currentUser?.email}</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your age"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
            />
            {age.length > 0 && !validAge && (
                <Text style={styles.error}>Please enter a valid age.</Text>
            )}

            <TouchableOpacity
                style={[styles.btn, !validAge && styles.btnDisabled]}
                disabled={!validAge}
                onPress={() => navigate('/Injury')}
            >
                <Text style={styles.btnText}>🩺 Injury Checker</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.btn, !validAge && styles.btnDisabled]}
                disabled={!validAge}
                onPress={() => navigate('/Exercise')}
            >
                <Text style={styles.btnText}>💪 Joint Exercises</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.btn, !validAge && styles.btnDisabled]}
                disabled={!validAge}
                onPress={() => navigate('/Recovery')}
            >
                <Text style={styles.btnText}>🧘 Recovery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.logoutBtn]} onPress={handleLogout}>
                <Text style={[styles.btnText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:   { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, backgroundColor: '#F9FAFB', padding: 24 },
    title:       { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
    subtitle:    { fontSize: 14, color: '#666', marginBottom: 8 },
    input:       { width: '100%', backgroundColor: '#fff', borderRadius: 10, padding: 14, fontSize: 16, elevation: 2 },
    error:       { color: 'red', fontSize: 13, alignSelf: 'flex-start' },
    btn:         { width: '100%', backgroundColor: '#2196F3', padding: 16, borderRadius: 12, alignItems: 'center' },
    btnDisabled: { backgroundColor: '#B0BEC5' },
    btnText:     { color: '#fff', fontSize: 16, fontWeight: '600' },
    logoutBtn:   { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e53935', marginTop: 12 },
    logoutText:  { color: '#e53935' },
});