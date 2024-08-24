import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  push,
  get,
  update,
  remove,
} from "firebase/database";
import toast from "react-hot-toast";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

export const register = async (email, password) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

export const emailVerification = async () => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("Kullanıcı bulunamadı.");
    }

    if (currentUser.emailVerified) {
      toast.success("E-posta adresiniz doğrulanmış. Hoş geldiniz!");
      return true;
    }

    await sendEmailVerification(currentUser);
    toast.success("Doğrulama Maili " + currentUser.email + " adresine gönderildi");
    return false;
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

export const login = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

// Notlar ekleme, düzenleme, silme ve alma fonksiyonları
export const addNote = async (uid, note) => {
  try {
    const notesRef = ref(db, `notes/${uid}`);
    const newNoteRef = push(notesRef);
    await set(newNoteRef, note);
    toast.success("Not başarıyla eklendi!");
  } catch (error) {
    toast.error(error.message);
  }
};

export const updateNote = async (uid, noteId, note) => {
  try {
    const noteRef = ref(db, `notes/${uid}/${noteId}`);
    await update(noteRef, note);
    toast.success("Not başarıyla güncellendi!");
  } catch (error) {
    toast.error(error.message);
  }
};

export const deleteNote = async (uid, noteId) => {
  try {
    const noteRef = ref(db, `notes/${uid}/${noteId}`);
    await remove(noteRef);
    toast.success("Not başarıyla silindi!");
  } catch (error) {
    toast.error(error.message);
  }
};

export const getNotes = async (uid) => {
  try {
    const notesRef = ref(db, `notes/${uid}`);
    const snapshot = await get(notesRef);
    return snapshot.val() || {};
  } catch (error) {
    toast.error(error.message);
    return {};
  }
};

export default app;
