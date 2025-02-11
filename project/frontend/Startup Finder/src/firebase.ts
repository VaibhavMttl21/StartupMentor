import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADV3LL31ylbBIP78qBK_R-BdvX2A5Gepw",
  authDomain: "startupfinder-c931d.firebaseapp.com",
  projectId: "startupfinder-c931d",
  storageBucket: "startupfinder-c931d.firebasestorage.app",
  messagingSenderId: "301772001276",
  appId: "1:301772001276:web:7cf9a3f1aa85f541ba2c79",
  measurementId: "G-N7YJG5QPVB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    // Sign out the current user to ensure the account selection prompt appears
    await signOut(auth);
    const result = await signInWithPopup(auth, provider);
    console.log("User Info:", result.user);
    return result.user;
  } catch (error) {
    console.error("Error signing in:", error);
    return null;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};