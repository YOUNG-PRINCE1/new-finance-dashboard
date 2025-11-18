import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyCheETEfwS0EuvbIb0Lq0Nl1NbyCm5aSiw",
  authDomain: "finance-tracker-7dc31.firebaseapp.com",
  projectId: "finance-tracker-7dc31",
  storageBucket: "finance-tracker-7dc31.appspot.com", 
  messagingSenderId: "905186181788",
  appId: "1:905186181788:web:360b6d53bbf7bfba866359",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app); 

export { auth, provider, signInWithPopup , storage };
