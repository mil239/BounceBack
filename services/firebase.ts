import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAYV7f0XK_K9VvKWfKxgxzgg6D0_0utsro",
  authDomain: "bounceback-492115.firebaseapp.com",
  projectId: "bounceback-492115",
  storageBucket: "bounceback-492115.firebasestorage.app",
  messagingSenderId: "350575005716",
  appId: "1:350575005716:web:51e5929b258dc6ab141701",
};

console.log('Firebase Config:', firebaseConfig); 
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);