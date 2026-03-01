import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getDatabase } from "firebase/database"; // 👈 para Realtime DB


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtnU84zOmm9mjwJNf7Sa7g4exGjUI_kj0",
  authDomain: "vigicolera.firebaseapp.com",
  databaseURL: "https://vigicolera-default-rtdb.firebaseio.com",
  projectId: "vigicolera",
  storageBucket: "vigicolera.firebasestorage.app",
  messagingSenderId: "443742285213",
  appId: "1:443742285213:web:ce5c8ef141c46ed2ccd374"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); // 👈 inicializar Firestore

export { auth, db }; // 👈 exportar os dois