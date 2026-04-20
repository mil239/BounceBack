import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../services/firebase';

const questions = [
    {
        question: "How severe is your pain?",
        type: "scale",
        options: ["1 - 3 (Mild)", "4 - 6 (Moderate)", "7 - 10 (Severe)"],
    },
    {
        question: "What caused the discomfort?",
        type: "choice",
        options: ["Sudden injury", "Overuse", "Unknown"],
    },
    {
        question: "Can you move the joint normally?",
        type: "yesno",
        options: ["Yes", "No"],
    },
];

export default function InjuryScreen() {
    const { joint: rawJoint } = useLocalSearchParams<{ joint: string }>();
    const joint = Array.isArray(rawJoint) ? rawJoint[0] : (rawJoint ?? "Knee");
    const router = useRouter();

    const [age, setAge]         = useState<string>("25");
    const [step, setStep]       = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);

    useEffect(() => {
        const fetchAge = async () => {
            const user = auth.currentUser;
            if (!user) return;
            const snap = await getDoc(doc(db, 'users', user.uid));
            if (snap.exists()) {
                const data = snap.data();
                if (data.age) setAge(String(data.age));
            }
        };
        fetchAge();
    }, []);

    const handleAnswer = async (answer: string) => {
        const updated = [...answers, answer];
        setAnswers(updated);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            router.push({
                pathname: '/RecoveryScreen' as any,
                params: { joint, age, answers: JSON.stringify(updated) },
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.progress}>
                Step {step + 1} of {questions.length}
            </Text>

            <Text style={styles.joint}>{joint}</Text>

            <View style={styles.card}>
                <Text style={styles.question}>
                    {questions[step].question}
                </Text>
            </View>

            <View style={styles.options}>
                {questions[step].options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={styles.button}
                        onPress={() => handleAnswer(option)}
                    >
                        <Text style={styles.buttonText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
    },
    progress: {
        textAlign: 'center',
        color: '#888',
        marginBottom: 10,
    },
    joint: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 25,
        borderRadius: 15,
        marginBottom: 30,
        elevation: 3,
    },
    question: {
        fontSize: 20,
        textAlign: 'center',
    },
    options: {
        marginTop: 10,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 12,
        marginVertical: 8,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
});