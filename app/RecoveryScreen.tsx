import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../services/firebase';
import { saveRecoveryPlan } from '../services/firestore';

const getAdvice = (answers: string[], age: number): string => {
    const severity = answers[0] ?? '';
    const isSenior = age >= 60;
    const isChild  = age < 18;

    const ageNote = isSenior
        ? 'As an older adult, your joints and bones are more vulnerable — even mild injuries can worsen quickly without attention. '
        : isChild
        ? 'Young joints are still developing — avoid high-impact activity until fully recovered. '
        : '';

    if (severity.includes('Severe')) {
        return `${ageNote}Your symptoms suggest significant discomfort. Please consult a healthcare professional as soon as possible. Avoid using the joint until assessed.`;
    }
    if (severity.includes('Moderate')) {
        return `${ageNote}Consider resting the joint, applying ice for 15–20 minutes, and taking over-the-counter pain relief if needed.${isSenior ? ' At your age, we strongly recommend seeing a doctor if symptoms persist beyond 24 hours.' : ' See a doctor if symptoms persist beyond 48 hours.'}`;
    }
    return `${ageNote}Mild discomfort can often be managed with rest and gentle stretching.${isSenior ? ' Be cautious — seniors should avoid pushing through joint pain.' : ' Monitor your symptoms and seek care if they worsen.'}`;
};

export default function RecoveryScreen() {
    const { joint, answers } = useLocalSearchParams<{ joint: string; answers: string }>();
    const router = useRouter();

    // ✅ Fetch age from Firestore
    const [parsedAge, setParsedAge] = useState<number | null>(null);

    useEffect(() => {
        const fetchAge = async () => {
            const user = auth.currentUser;
            if (!user) return;
            const snap = await getDoc(doc(db, 'users', user.uid));
            if (snap.exists()) {
                const data = snap.data();
                if (data.age) setParsedAge(Number(data.age));
            }
        };
        fetchAge();
    }, []);

    // Safe parse answers
    let parsedAnswers: string[] = [];
    try {
        parsedAnswers = answers ? JSON.parse(answers as string) : [];
    } catch {
        parsedAnswers = [];
    }

    const advice = parsedAge ? getAdvice(parsedAnswers, parsedAge) : null;

    // ✅ Save recovery plan once age is loaded
    useEffect(() => {
        if (!parsedAge || !advice || !joint) return;
        saveRecoveryPlan(joint, parsedAnswers, advice);
    }, [parsedAge]);

    if (!parsedAge) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Loading your profile...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Recovery Plan</Text>
            <Text style={styles.joint}>{joint}</Text>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Your Answers</Text>
                {parsedAnswers.map((answer) => (
                    <Text key={answer} style={styles.answer}>• {answer}</Text>
                ))}
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Recommendation</Text>
                <Text style={styles.advice}>{advice}</Text>
            </View>

            <Text style={styles.disclaimer}>
                Not a medical diagnosis. Please seek care if symptoms are severe.
            </Text>

            <TouchableOpacity style={styles.button} onPress={() => router.replace('/HomeScreen' as any)}>
                <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:    { padding: 20, backgroundColor: '#F9FAFB', flexGrow: 1, justifyContent: 'center' },
    title:        { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
    joint:        { fontSize: 18, textAlign: 'center', color: '#2196F3', marginBottom: 24 },
    card:         { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 15, marginBottom: 16, elevation: 3 },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#444' },
    answer:       { fontSize: 15, color: '#555', marginBottom: 4 },
    advice:       { fontSize: 15, color: '#333', lineHeight: 22 },
    disclaimer:   { fontSize: 12, textAlign: 'center', color: '#999', marginBottom: 20 },
    errorText:    { fontSize: 16, textAlign: 'center', color: '#333', marginBottom: 24 },
    button:       { backgroundColor: '#2196F3', padding: 16, borderRadius: 12, alignItems: 'center' },
    buttonText:   { color: '#fff', fontSize: 16, fontWeight: '600' },
});