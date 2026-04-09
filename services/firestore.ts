import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebase';  // ← import both from firebase.ts

// Save a completed exercise session
export const saveExerciseSession = async (joint: string, exercises: { name: string; desc: string }[]) => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, 'users', user.uid, 'exerciseSessions'), {
        joint,
        exercises,
        completedAt: Timestamp.now(),
    });
};

// Get all past exercise sessions
export const getExerciseSessions = async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
        collection(db, 'users', user.uid, 'exerciseSessions'),
        orderBy('completedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Save an injury report
export const saveInjuryReport = async (
    joint: string,
    answers: string[],
    questions: { question: string }[]
) => {
    const user = auth.currentUser;
    if (!user) return;

    const report = questions.map((q, i) => ({
        question: q.question,
        answer: answers[i],
    }));

    await addDoc(collection(db, 'users', user.uid, 'injuryReports'), {
        joint,
        report,
        createdAt: Timestamp.now(),
    });
};

// Save a recovery plan
export const saveRecoveryPlan = async (
    joint: string,
    answers: string[],
    advice: string
) => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, 'users', user.uid, 'recoveryPlans'), {
        joint,
        answers,
        advice,
        createdAt: Timestamp.now(),
    });
};