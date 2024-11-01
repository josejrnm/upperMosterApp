// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB24NOfJsLBeZtKNt3EmofLkDaJdzwYfPU",
    authDomain: "uppermoster.firebaseapp.com",
    projectId: "uppermoster",
    storageBucket: "uppermoster.firebasestorage.app",
    messagingSenderId: "158209083300",
    appId: "1:158209083300:web:04f1549daf045438f52331",
    measurementId: "G-CZN2FCVP88"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, analytics, auth, firestore };
