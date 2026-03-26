import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type RootStackParamList = 
{
    Injury: { joint: string };
    Recovery: { joint: string; answers: string[] };
};


type Props = 
{
    goBack: () => void;
};

<Button title = "Back" onPress = {goBack} />

export default function InjuryScreen({ route, navigation }: any)
{
    const { joint } = route.params;

    const questions = 
    [
        {
            question: " How severe is your pain?",
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

    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);

    const handleAnswer = (answer: string) => 
    {
        const updated = [...answers, answer];
        setAnswers(updated);

        if (step < questions.length -1) setStep(step + 1);
        else navigation.navigate('Revcovery', { joint, answers: updated });
    };

    return
    (
        <View style = {styles.container}>
            {/* Progress */}
            <Text style = {styles.progress}>
                Step {step + 1} of {questions.length}
            </Text>

            {/* Joint Title */}
            <Text style = {styles.card}> {joint} </Text>

            {/* Question Card */}
            <View style = {styles.card}>
                <Text style = {styles.question}>
                    {questions[step].question}
                </Text>
            </View>

            {/* Anwser Buttons */}
            <View style = {styles.options}>
                {questions[step].options.map((option) => 
                (
                    <TouchableOpacity
                        key = {option}
                        style = {styles.button}
                        onPress = {() => handleAnswer(option)}
                    >
                        <Text style = {styles.buttonText}> {option} </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create
(
    {
        container:
        {
            flex: 1,
            padding: 20,
            backgroundColor: '#F9FAFB',
            justifyContent: 'center'
        },

        progress:
        {
            textAlign: 'center',
            color: '#888',
            marginBottom: 10,
        },

        joint:
        {
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20,
        },

        card:
        {
            backgroundColor: '#FFFFFF',
            padding: 25,
            borderRadius: 15, 
            marginBottom: 30, 
            elevation: 3,
        },

        question:
        {
            fontSize: 20,
            textAlign: 'center',
        },

        options:
        {
            marginTop: 10,
        },

        button: 
        {
            backgroundColor: '#2196F3',
            padding: 15,
            borderRadius: 12,
            marginVertical: 8,
        },

        buttonText:
        {
            color: '#fff',
            textAlign: 'center',
            fontSize: 16,
        },
    });

