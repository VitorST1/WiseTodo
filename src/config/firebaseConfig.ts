import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, GithubAuthProvider, OAuthProvider, signInAnonymously, signInWithPopup, signOut, fetchSignInMethodsForEmail, User, AuthProvider } from "firebase/auth"
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, getDoc, setDoc, serverTimestamp, orderBy } from "firebase/firestore"

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth()
const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()
const microsoftProvider = new OAuthProvider("microsoft.com")

const db = getFirestore(app)

export { app, auth, db, googleProvider, githubProvider, microsoftProvider, signInWithPopup, signOut, signInAnonymously, fetchSignInMethodsForEmail, collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, getDoc, setDoc, serverTimestamp, orderBy }
export type { User, AuthProvider }
