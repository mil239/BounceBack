import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signup } from '../services/auth';
import { db } from '../services/firebase';

// Lazy-load native picker only on native platforms to avoid web errors
const DateTimePicker = Platform.OS !== 'web'
    ? require('@react-native-community/datetimepicker').default
    : null;

const getFriendlyError = (code: string) => {
    switch (code) {
        case 'auth/invalid-email':        return 'Invalid email address.';
        case 'auth/email-already-in-use': return 'An account with this email already exists.';
        case 'auth/weak-password':        return 'Password must be at least 6 characters.';
        default:                          return 'Something went wrong. Please try again.';
    }
};

const calculateAge = (dob: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
};

// ─── Web DOB Dropdowns ───────────────────────────────────────────────────────

const MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 120 }, (_, i) => currentYear - i);
const getDaysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate();

const WebSelect = ({ value, onChange, options, placeholder }: {
    value: string;
    onChange: (v: string) => void;
    options: { label: string; value: string }[];
    placeholder: string;
}) => (
    <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
            flex: 1,
            padding: '12px',
            fontSize: 16,
            borderRadius: 8,
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            color: value ? '#000' : '#999',
            cursor: 'pointer',
        }}
    >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
        ))}
    </select>
);

function WebDobPicker({ dob, onChange }: { dob: Date | null; onChange: (d: Date) => void }) {
    const [month, setMonth] = useState(dob ? String(dob.getMonth() + 1) : '');
    const [day,   setDay  ] = useState(dob ? String(dob.getDate())      : '');
    const [year,  setYear ] = useState(dob ? String(dob.getFullYear())  : '');

    const daysInMonth = month && year ? getDaysInMonth(parseInt(month), parseInt(year)) : 31;
    const dayOptions  = Array.from({ length: daysInMonth }, (_, i) => ({
        label: String(i + 1), value: String(i + 1),
    }));

    const update = (m: string, d: string, y: string) => {
        if (m && d && y) onChange(new Date(parseInt(y), parseInt(m) - 1, parseInt(d)));
    };

    return (
        <View style={{ marginBottom: 14 }}>
            <Text style={styles.dobLabel}>Date of Birth</Text>
            <View style={styles.dobRow}>
                <WebSelect
                    value={month}
                    onChange={v => { setMonth(v); setDay(''); update(v, '', year); }}
                    placeholder="Month"
                    options={MONTHS.map((m, i) => ({ label: m, value: String(i + 1) }))}
                />
                <View style={{ width: 8 }} />
                <WebSelect
                    value={day}
                    onChange={v => { setDay(v); update(month, v, year); }}
                    placeholder="Day"
                    options={dayOptions}
                />
                <View style={{ width: 8 }} />
                <WebSelect
                    value={year}
                    onChange={v => { setYear(v); update(month, day, v); }}
                    placeholder="Year"
                    options={YEARS.map(y => ({ label: String(y), value: String(y) }))}
                />
            </View>
        </View>
    );
}

// ─── Native DOB Picker ───────────────────────────────────────────────────────

function NativeDobPicker({ dob, onChange }: { dob: Date | null; onChange: (d: Date) => void }) {
    const [showPicker, setShowPicker] = useState(false);

    const handleChange = (event: any, selected?: Date) => {
        if (Platform.OS === 'android') setShowPicker(false);
        if (event.type === 'dismissed') return;
        if (selected) onChange(selected);
    };

    return (
        <View style={{ marginBottom: 14 }}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowPicker(true)}
                style={styles.input}
            >
                <Text style={dob ? styles.dateText : styles.datePlaceholder}>
                    {dob
                        ? dob.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                        : 'Date of Birth'}
                </Text>
            </TouchableOpacity>
            {showPicker && DateTimePicker && (
                <DateTimePicker
                    value={dob ?? new Date(2000, 0, 1)}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                    onChange={handleChange}
                />
            )}
        </View>
    );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function SignupScreen() {
    const router = useRouter();
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm]   = useState('');
    const [error, setError]       = useState('');
    const [success, setSuccess]   = useState('');
    const [loading, setLoading]   = useState(false);
    const [dob, setDob]           = useState<Date | null>(null);

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
        if (!dob) {
            setError('Please enter your date of birth.');
            return;
        }
        const age = calculateAge(dob);
        if (age < 5) {
            setError('You must be at least 5 years old to sign up.');
            return;
        }

        setLoading(true);
        try {
            await signup(email, password);
            const user = getAuth().currentUser;
            console.log('User after signup:', user);
            if (user) {
                await setDoc(doc(db, 'users', user.uid), {
                    email,
                    dob: dob.toISOString(),
                    age,
                    createdAt: new Date().toISOString(),
                });
            }
            setSuccess('Account created! Redirecting to login...');
            setTimeout(() => router.push('/HomeScreen'), 10);
        } catch (err: any) {
            console.log('Signup error code:', err.code);
            console.log('Signup error message:', err.message);
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

            {/* Platform-aware DOB picker */}
            {Platform.OS === 'web'
                ? <WebDobPicker  dob={dob} onChange={setDob} />
                : <NativeDobPicker dob={dob} onChange={setDob} />
            }

            {dob && (
                <Text style={styles.agePreview}>Age: {calculateAge(dob)}</Text>
            )}

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
    input:          { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 16, elevation: 2, justifyContent: 'center' },
    dobLabel:       { fontSize: 14, color: '#555', marginBottom: 6 },
    dobRow:         { flexDirection: 'row' },
    dateText:       { fontSize: 16, color: '#000' },
    datePlaceholder:{ fontSize: 16, color: '#999' },
    agePreview:     { textAlign: 'center', color: '#555', marginBottom: 10, fontSize: 14 },
    message:        { textAlign: 'center', marginBottom: 12, fontSize: 14 },
    success:        { color: 'green' },
    error:          { color: 'red' },
    button:         { backgroundColor: '#2196F3', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
    buttonDisabled: { backgroundColor: '#B0BEC5' },
    buttonText:     { color: '#fff', fontSize: 16, fontWeight: '600' },
    link:           { textAlign: 'center', color: '#2196F3', marginTop: 10, fontSize: 14 },
});