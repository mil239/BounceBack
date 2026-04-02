import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

type AgeGroup = 'child' | 'adult' | 'senior';

const getAgeGroup = (age: number): AgeGroup => {
    if (age < 18) return 'child';
    if (age < 60) return 'adult';
    return 'senior';
};

const exercises: Record<string, Record<AgeGroup, { name: string; desc: string }[]>> = {
    Shoulder: {
        child:  [
            { name: 'Arm Circles',        desc: 'Small forward and backward circles for 30 seconds.' },
            { name: 'Wall Angels',         desc: 'Stand against a wall and slowly raise arms up and down.' },
            { name: 'Band Pull-Aparts',    desc: 'Hold a resistance band and pull apart at chest height.' },
        ],
        adult:  [
            { name: 'Overhead Press',      desc: '3 sets of 10 reps with light dumbbells.' },
            { name: 'Face Pulls',          desc: '3 sets of 15 reps with a resistance band at face height.' },
            { name: 'Lateral Raises',      desc: '3 sets of 12 reps, keep elbows slightly bent.' },
        ],
        senior: [
            { name: 'Pendulum Swings',     desc: 'Lean forward and gently swing arm in small circles.' },
            { name: 'Seated Band Rows',    desc: 'Sit and pull a band toward your chest, 10 slow reps.' },
            { name: 'Wall Slide',          desc: 'Slide arms up a wall slowly, hold 2 seconds at top.' },
        ],
    },
    Elbow: {
        child:  [
            { name: 'Elbow Flexion',       desc: 'Bend and straighten elbow slowly, 15 reps each arm.' },
            { name: 'Forearm Rotations',   desc: 'Rotate forearm palm-up to palm-down, 20 reps.' },
            { name: 'Light Curls',         desc: 'Use a water bottle as weight, 2 sets of 10.' },
        ],
        adult:  [
            { name: 'Dumbbell Curls',      desc: '3 sets of 12 reps, full range of motion.' },
            { name: 'Tricep Extensions',   desc: '3 sets of 12 reps overhead with one dumbbell.' },
            { name: 'Reverse Curls',       desc: '3 sets of 10 reps, palms facing down.' },
        ],
        senior: [
            { name: 'Seated Elbow Bends',  desc: 'Slowly bend and straighten elbow, 10 reps each side.' },
            { name: 'Wrist Supported Curl',desc: 'Rest forearm on table, curl a light weight 10 times.' },
            { name: 'Gentle Stretching',   desc: 'Straighten arm and gently pull fingers back, hold 15s.' },
        ],
    },
    Wrist: {
        child:  [
            { name: 'Wrist Circles',       desc: 'Rotate wrists clockwise and counterclockwise, 20 reps.' },
            { name: 'Finger Spreads',      desc: 'Spread fingers wide and close, repeat 15 times.' },
            { name: 'Prayer Stretch',      desc: 'Press palms together and hold for 20 seconds.' },
        ],
        adult:  [
            { name: 'Wrist Curls',         desc: '3 sets of 15 with a light dumbbell, palm facing up.' },
            { name: 'Reverse Wrist Curls', desc: '3 sets of 15, palm facing down.' },
            { name: 'Grip Squeezes',       desc: 'Squeeze a stress ball 20 times each hand.' },
        ],
        senior: [
            { name: 'Warm Water Flex',     desc: 'Flex and extend wrists gently in warm water.' },
            { name: 'Towel Wringing',      desc: 'Wring a small towel slowly, 10 reps.' },
            { name: 'Wrist Tilts',         desc: 'Tilt wrist side to side slowly, 10 reps each way.' },
        ],
    },
    Hip: {
        child:  [
            { name: 'Hip Circles',         desc: 'Hands on hips, make large circles, 10 each direction.' },
            { name: 'Lateral Leg Raises',  desc: 'Stand and lift leg to the side, 15 reps each.' },
            { name: 'Frog Jumps',          desc: 'Squat low and jump forward, 10 reps.' },
        ],
        adult:  [
            { name: 'Hip Flexor Stretch',  desc: 'Lunge forward, hold 30 seconds each side.' },
            { name: 'Clamshells',          desc: '3 sets of 15 with a resistance band above knees.' },
            { name: 'Glute Bridges',       desc: '3 sets of 15, hold at top for 2 seconds.' },
        ],
        senior: [
            { name: 'Seated Hip March',    desc: 'Sit and lift knees alternately, 10 reps each side.' },
            { name: 'Standing Side Steps', desc: 'Step side to side slowly, 10 reps each direction.' },
            { name: 'Supported Leg Raise', desc: 'Hold a chair and lift leg forward slowly, 10 reps.' },
        ],
    },
    Knee: {
        child:  [
            { name: 'Squat Jumps',         desc: 'Jump up from a squat position, 10 reps.' },
            { name: 'Step-Ups',            desc: 'Step up and down on a low step, 15 reps each leg.' },
            { name: 'Straight Leg Raises', desc: 'Lie down and lift straight leg to 45°, 15 reps.' },
        ],
        adult:  [
            { name: 'Wall Sit',            desc: 'Hold 45–60 seconds, 3 sets.' },
            { name: 'Terminal Knee Ext.',  desc: 'Loop band at knee height, straighten knee 15 reps.' },
            { name: 'Step-Downs',          desc: 'Stand on step, slowly lower one foot to ground, 10 reps.' },
        ],
        senior: [
            { name: 'Seated Leg Press',    desc: 'Push against a wall with feet from a chair, 10 reps.' },
            { name: 'Gentle Knee Bends',   desc: 'Hold chair, slowly bend and straighten knees, 10 reps.' },
            { name: 'Quad Sets',           desc: 'Lie flat, tighten thigh muscle, hold 5s, 15 reps.' },
        ],
    },
    Ankle: {
        child:  [
            { name: 'Ankle Hops',          desc: 'Hop side to side on both feet, 20 reps.' },
            { name: 'Calf Raises',         desc: 'Rise onto toes and lower slowly, 20 reps.' },
            { name: 'Balance Stand',       desc: 'Balance on one foot for 30 seconds each side.' },
        ],
        adult:  [
            { name: 'Single-Leg Balance',  desc: 'Balance on one foot with eyes closed, 30s each.' },
            { name: 'Banded Dorsiflexion', desc: 'Pull foot toward you against band resistance, 15 reps.' },
            { name: 'Calf Raises',         desc: '3 sets of 20, pause at top for 1 second.' },
        ],
        senior: [
            { name: 'Seated Ankle Pumps',  desc: 'Push toes up and down while seated, 20 reps.' },
            { name: 'Ankle Circles',       desc: 'Rotate ankle slowly in both directions, 10 reps.' },
            { name: 'Heel-Toe Rocks',      desc: 'Rock from heel to toe while holding a chair, 15 reps.' },
        ],
    },
};

const jointList = Object.keys(exercises);

const ageGroupLabel: Record<AgeGroup, string> = {
    child:  'Youth (under 18)',
    adult:  'Adult (18-59)',
    senior: 'Senior (60+)',
};

export default function ExerciseScreen() {
    const { age } = useLocalSearchParams<{ age: string }>();
    const parsedAge = parseInt(age as string);
    const ageGroup = !isNaN(parsedAge) ? getAgeGroup(parsedAge) : null;

    const [selectedJoint, setSelectedJoint] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);

    const results = selectedJoint && ageGroup ? exercises[selectedJoint][ageGroup] : [];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Joint Strengthening</Text>
            <Text style={styles.subtitle}>
                {ageGroup ? `Showing exercises for: ${ageGroupLabel[ageGroup]}` : 'No age provided.'}
            </Text>

            <View style={styles.jointGrid}>
                {jointList.map((joint) => (
                    <TouchableOpacity
                        key={joint}
                        style={[styles.jointBtn, selectedJoint === joint && styles.jointBtnActive]}
                        onPress={() => { setSelectedJoint(joint); setShowResults(false); }}
                    >
                        <Text style={[styles.jointBtnText, selectedJoint === joint && styles.jointBtnTextActive]}>
                            {joint}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={[styles.button, (!selectedJoint || !ageGroup) && styles.buttonDisabled]}
                disabled={!selectedJoint || !ageGroup}
                onPress={() => setShowResults(true)}
            >
                <Text style={styles.buttonText}>Get Exercises</Text>
            </TouchableOpacity>

            {showResults && ageGroup && selectedJoint && (
                <View>
                    <Text style={styles.resultHeader}>
                        {selectedJoint} exercises for {ageGroupLabel[ageGroup]}
                    </Text>
                    {results.map((ex) => (
                        <View key={ex.name} style={styles.card}>
                            <Text style={styles.exName}>{ex.name}</Text>
                            <Text style={styles.exDesc}>{ex.desc}</Text>
                        </View>
                    ))}
                    <Text style={styles.disclaimer}>
                        Not a medical prescription. Consult a physiotherapist if you have existing injuries.
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:          { padding: 20, backgroundColor: '#F9FAFB', flexGrow: 1 },
    title:              { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
    subtitle:           { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 20 },
    jointGrid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    jointBtn:           { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#E0E0E0' },
    jointBtnActive:     { backgroundColor: '#2196F3' },
    jointBtnText:       { fontSize: 14, color: '#333' },
    jointBtnTextActive: { color: '#fff', fontWeight: '600' },
    button:             { backgroundColor: '#2196F3', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 24 },
    buttonDisabled:     { backgroundColor: '#B0BEC5' },
    buttonText:         { color: '#fff', fontSize: 16, fontWeight: '600' },
    resultHeader:       { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#333' },
    card:               { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
    exName:             { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    exDesc:             { fontSize: 14, color: '#555' },
    disclaimer:         { fontSize: 12, textAlign: 'center', color: '#999', marginTop: 8, marginBottom: 20 },
});