// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY || process.env.FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN || process.env.FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID || process.env.FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET || process.env.FB_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID || process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID || process.env.FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID || process.env.FB_MEASUREMENT_ID,
}

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export default firebase_app
