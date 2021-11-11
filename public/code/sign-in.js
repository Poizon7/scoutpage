// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
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

function login(e) {
  e.preventDefault();

  const passwordField = document.querySelector("#password");
  const usernameField = document.querySelector("#username");

  const email = usernameField.value;
  const password = passwordField.value;

  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("success");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error");
    });
}

document.querySelector("form").addEventListener("submit", login);

const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;

    const docRef = doc(db, "identification", user.email);

    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    switch (data.type) {
      case "scout":
        window.open("./scout.html", "_self");
        break;
      case "ledare":
        window.open("./ledare.html", "_self");
        break;
      case "vård":
        window.open("./gardian.html", "_self");
        break;
      default:
        console.log(
          "Your accout was not configured properly, contact the organisation for help"
        );
    }
    // ...
  } else {
  }
});
