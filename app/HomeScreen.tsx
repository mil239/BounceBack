import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { logout } from '../services/auth';
import { auth } from '../services/firebase';

export default function HomeScreen() {
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: logout },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>{auth.currentUser?.email}</Text>

            <TouchableOpacity style={styles.btn} onPress={() => router.push('/InjuryScreen')}>
                <Text style={styles.btnText}>🩺 Injury Checker</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => router.push('/ExerciseScreen')}>
                <Text style={styles.btnText}>💪 Joint Exercises</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => router.push('/RecoveryScreen')}>
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
    subtitle:    { fontSize: 14, color: '#666', marginBottom: 24 },
    btn:         { width: '100%', backgroundColor: '#2196F3', padding: 16, borderRadius: 12, alignItems: 'center' },
    btnText:     { color: '#fff', fontSize: 16, fontWeight: '600' },
    logoutBtn:   { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e53935', marginTop: 12 },
    logoutText:  { color: '#e53935' },
});