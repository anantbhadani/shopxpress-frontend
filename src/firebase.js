import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBCYXeXC_ZTf_cssFKCqY0yMn-_fukLPh8",
    authDomain: "server-19d74.firebaseapp.com",
    databaseURL: "https://server-19d74-default-rtdb.firebaseio.com",
    projectId: "server-19d74",
    storageBucket: "server-19d74.firebasestorage.app",
    messagingSenderId: "392175592720",
    appId: "1:392175592720:web:d1030a805feff1fc363195",
    measurementId: "G-0DYGR19PLK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
