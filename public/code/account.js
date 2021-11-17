// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfOTYOtec4gU_4xy568g8oyg9g0l5QdTo",
  authDomain: "scoutpage-36494.firebaseapp.com",
  projectId: "scoutpage-36494",
  storageBucket: "scoutpage-36494.appspot.com",
  messagingSenderId: "116409279827",
  appId: "1:116409279827:web:382a1461197b0e7039eda6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const account = document.querySelector("#login");

const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;

    const docRef = doc(db, "identification", user.email);

    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    account.querySelector("h4").innerText = user.email;
    account.querySelector("a").setAttribute("href", "scout.html");

    const logOut = document.createElement("h4");
    logOut.addEventListener("click", SignOut);
    logOut.setAttribute("id", "logout");
    const logOutText = document.createTextNode("Logga ut");
    logOut.appendChild(logOutText);
    account.appendChild(logOut);

    // ...
  } else {
    account.querySelector("h4").innerText = "Logga in";
    account.querySelector("a").setAttribute("href", "sign-in.html");
  }
});

function SignOut() {
  signOut(auth)
    .then(() => {
      document.querySelector("#logout").remove();
      window.open("./index.html", "_self");
    })
    .catch((error) => {
      // An error happened.
    });
}
