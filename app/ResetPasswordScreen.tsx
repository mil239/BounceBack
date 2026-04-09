import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { resetPassword } from '../services/auth';

const getFriendlyError = (code: string) => {
    switch (code) {
        case 'auth/invalid-email':  return 'Invalid email address.';
        case 'auth/user-not-found': return 'No account found with this email.';
        default:                    return 'Something went wrong. Please try again.';
    }
};

export default function ResetPasswordScreen() {
    const router = useRouter();
    const [email, setEmail]     = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sent, setSent]       = useState(false);

    const handleReset = async () => {
        setMessage('');

        if (!email) {
            setIsError(true);
            setMessage('Please enter your email address.');
            return;
        }

        setLoading(true);
        try {
            await resetPassword(email);
            setIsError(false);
            setSent(true);
            setMessage('Password reset email sent! Check your inbox.');
        } catch (err: any) {
            setIsError(true);
            setMessage(getFriendlyError(err.code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
                Enter your email and we'll send you a reset link.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!sent}
            />

            {message ? (
                <Text style={[styles.message, isError ? styles.error : styles.success]}>
                    {message}
                </Text>
            ) : null}

            <TouchableOpacity
                style={[styles.button, (loading || sent) && styles.buttonDisabled]}
                onPress={handleReset}
                disabled={loading || sent}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Sending...' : sent ? 'Email Sent' : 'Send Reset Email'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}>Back to Login</Text>
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