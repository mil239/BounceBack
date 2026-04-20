import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { logout } from '../services/auth';
import { auth } from '../services/firebase';

const JOINTS = ['Knee', 'Shoulder', 'Elbow', 'Wrist', 'Hip', 'Ankle', 'Back'];

export default function HomeScreen() {
    const router = useRouter();
    const [showJointPicker, setShowJointPicker] = useState(false);

    const handleJointSelect = (joint: string) => {
        setShowJointPicker(false);
        router.push({
            pathname: '/InjuryScreen' as any,
            params: { joint },
        });
    };

    const handleLogout = async () => {
        const confirmed = Platform.OS === 'web'
            ? window.confirm('Are you sure you want to log out?')
            : await new Promise((resolve) =>
                Alert.alert('Logout', 'Are you sure you want to log out?', [
                    { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                    { text: 'Logout', style: 'destructive', onPress: () => resolve(true) },
                ])
            );

        if (!confirmed) return;

        try {
            await logout();
            router.replace('/LoginScreen' as any);
        } catch (e) {
            alert("Logout error: " + e);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>{auth.currentUser?.email}</Text>

            <TouchableOpacity style={styles.btn} onPress={() => setShowJointPicker(true)}>
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

            {/* Joint Picker Modal */}
            <Modal visible={showJointPicker} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Select a Joint</Text>
                        {JOINTS.map((joint) => (
                            <TouchableOpacity
                                key={joint}
                                style={styles.jointBtn}
                                onPress={() => handleJointSelect(joint)}
                            >
                                <Text style={styles.jointBtnText}>{joint}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={() => setShowJointPicker(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container:    { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, backgroundColor: '#F9FAFB', padding: 24 },
    title:        { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
    subtitle:     { fontSize: 14, color: '#666', marginBottom: 24 },
    btn:          { width: '100%', backgroundColor: '#2196F3', padding: 16, borderRadius: 12, alignItems: 'center' },
    btnText:      { color: '#fff', fontSize: 16, fontWeight: '600' },
    logoutBtn:    { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e53935', marginTop: 12 },
    logoutText:   { color: '#e53935' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalBox:     { backgroundColor: '#fff', padding: 24, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    modalTitle:   { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    jointBtn:     { backgroundColor: '#F0F4FF', padding: 14, borderRadius: 10, marginBottom: 10 },
    jointBtnText: { fontSize: 16, textAlign: 'center', color: '#2196F3', fontWeight: '600' },
    cancelText:   { textAlign: 'center', color: '#999', marginTop: 8, fontSize: 15 },
});