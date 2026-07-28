import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5KTlJKxpZ2BM9ohtx9h32zb5qj4gisY8",
  authDomain: "realstate-c5585.firebaseapp.com",
  projectId: "realstate-c5585",
  storageBucket: "realstate-c5585.firebasestorage.app",
  messagingSenderId: "216189514978",
  appId: "1:216189514978:web:1d74531d53e73dc3225abb",
  measurementId: "G-5BZXY0GPL2",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export type { User };
export { onAuthStateChanged };

// ---- Auth helpers ----

export async function loginWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function registerWithEmail(
  name: string,
  email: string,
  password: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(cred.user, { displayName: name });
  }
  // Create a starter profile doc for this user
  await setDoc(doc(db, "users", cred.user.uid), {
    name,
    email,
    favorites: [],
    createdAt: new Date().toISOString(),
  });
  return cred.user;
}

export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  // Make sure a profile doc exists (first-time Google sign-ins)
  const ref = doc(db, "users", cred.user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      name: cred.user.displayName || "",
      email: cred.user.email || "",
      favorites: [],
      createdAt: new Date().toISOString(),
    });
  }
  return cred.user;
}

export async function logout() {
  await signOut(auth);
}

// ---- Favorites sync (Firestore: users/{uid}.favorites) ----

export async function fetchFavorites(uid: string): Promise<number[]> {
  const snap = await getDoc(doc(db, "users", uid));
  if (snap.exists() && Array.isArray(snap.data().favorites)) {
    return snap.data().favorites as number[];
  }
  return [];
}

export async function saveFavorites(uid: string, favorites: number[]) {
  await updateDoc(doc(db, "users", uid), { favorites });
}
