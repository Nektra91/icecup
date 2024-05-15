import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkdW39XiF8HHLQYBFsMwCYhmnA3D19SeY",
  authDomain: "icecup-a2d7b.firebaseapp.com",
  projectId: "icecup-a2d7b",
  storageBucket: "icecup-a2d7b.appspot.com",
  messagingSenderId: "693481140706",
  appId: "1:693481140706:web:bde3ebe7a374c28c77c9bb",
  measurementId: "G-Y6YQTMZZCH"
};

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  export {auth, db};

