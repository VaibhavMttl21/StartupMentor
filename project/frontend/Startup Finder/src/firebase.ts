import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig= JSON.parse(import.meta.env.VITE_FIREBASECONFIG);
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    // Sign out the current user to ensure the account selection prompt appears
    await signOut(auth);
    const result = await signInWithPopup(auth, provider);
    // console.log("User Info:", result.user);
    return result.user;
  } catch (error) {
    // console.error("Error signing in:", error);
    return null;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    // console.log("User signed out");
  } catch (error) {
    // console.error("Error signing out:", error);
  }
};