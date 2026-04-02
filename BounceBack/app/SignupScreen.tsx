import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { signup } from '../services/auth';

const getFriendlyError = (code: string) => {
    switch (code) {
        case 'auth/invalid-email':        return 'Invalid email address.';
        case 'auth/email-already-in-use': return 'An account with this email already exists.';
        case 'auth/weak-password':        return 'Password must be at least 6 characters.';
        default:                          return 'Something went wrong. Please try again.';
    }
};

export default function SignupScreen() {
    const router = useRouter();
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm]   = useState('');
    const [error, setError]       = useState('');
    const [success, setSuccess]   = useState('');
    const [loading, setLoading]   = useState(false);

    const handleSignup = async () => {
        setError('');
        setSuccess('');

        if (!email || !password) {
            setError('Please enter your email and password.');
            return;
        }

        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await signup(email, password);
            setSuccess('Account created! Redirecting to login...');
            setTimeout(() => router.replace('/Login'), 1500);
        } catch (err: any) {
            setError(getFriendlyError(err.code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started.</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
            />

            {error   ? <Text style={[styles.message, styles.error  ]}>{error  }</Text> : null}
            {success ? <Text style={[styles.message, styles.success]}>{success}</Text> : null}

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSignup}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}>Already have an account? Log In</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:      { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F9FAFB' },
    title:          { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    subtitle:       { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 32 },
    input:          { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 16, elevation: 2 },
    message:        { textAlign: 'center', marginBottom: 12, fontSize: 14 },
    success:        { color: 'green' },
    error:          { color: 'red' },
    button:         { backgroundColor: '#2196F3', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
    buttonDisabled: { backgroundColor: '#B0BEC5' },
    buttonText:     { color: '#fff', fontSize: 16, fontWeight: '600' },
    link:           { textAlign: 'center', color: '#2196F3', marginTop: 10, fontSize: 14 },
});