
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Only answers[0] is used for severity — this is intentional,
// as the first question is always the severity question.
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
    const { joint, answers, age } = useLocalSearchParams<{ joint: string; answers: string; age: string }>();
    const router = useRouter();

    // Safe parse answers
    let parsedAnswers: string[] = [];
    try {
        parsedAnswers = answers ? JSON.parse(answers as string) : [];
    } catch {
        parsedAnswers = [];
    }

    // Safe parse age
    const parsedAge = age ? parseInt(age as string) : null;

    if (!parsedAge) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No age provided. Please go back and try again.</Text>
                <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
                    <Text style={styles.buttonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const advice = getAdvice(parsedAnswers, parsedAge);

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

            <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
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