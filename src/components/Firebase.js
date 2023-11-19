import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA6mQy2aq8WYejbjvYgP_2ImBOZwQaPjoQ",
  authDomain: "sample-invent.firebaseapp.com",
  projectId: "sample-invent",
  storageBucket: "sample-invent.appspot.com",
  messagingSenderId: "627037978911",
  appId: "1:627037978911:web:3e42d8dce6818f2769702a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
