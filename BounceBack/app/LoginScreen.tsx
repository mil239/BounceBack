import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { login } from '../services/auth';

const getFriendlyError = (code: string) => {
    switch (code) {
        case 'auth/invalid-email':     return 'Invalid email address.';
        case 'auth/user-not-found':    return 'No account found with this email.';
        case 'auth/wrong-password':    return 'Incorrect password.';
        case 'auth/too-many-requests': return 'Too many attempts. Try again later.';
        default:                       return 'Login failed. Please try again.';
    }
};

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const handleLogin = async () => {
        setError('');

        if (!email || !password) {
            setError('Please enter your email and password.');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            router.replace('/');
        } catch (e: any) {
            setError(getFriendlyError(e.code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>

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

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Log In'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/ResetPassword')}>
                <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/Signup')}>
                <Text style={styles.link}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:      { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F9FAFB' },
    title:          { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
    input:          { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 16, elevation: 2 },
    error:          { color: 'red', textAlign: 'center', marginBottom: 10 },
    button:         { backgroundColor: '#2196F3', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
    buttonDisabled: { backgroundColor: '#B0BEC5' },
    buttonText:     { color: '#fff', fontSize: 16, fontWeight: '600' },
    link:           { textAlign: 'center', color: '#2196F3', marginTop: 10, fontSize: 14 },
});