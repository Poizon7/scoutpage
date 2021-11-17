// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
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

document.getElementById("message-form").addEventListener("submit", sendMessage);

let currentUser;

const messages = document.getElementById("messages");

const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    currentUser = user;

    const docRef = doc(db, "identification", user.email);

    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    const q = query(
      collection(db, "messages"),
      where("unit", "==", data.unit),
      where("name", "==", data.name)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // Map results to an array of li elements

      const items = querySnapshot.docs.map((doc) => {
        return `<li class=${
          user.email == doc.data().user ? "sent" : "receive"
        }><span>${doc
          .data()
          .user.slice(0, doc.data().user.indexOf("@"))}: </span>${
          doc.data().message
        }</li>`;
      });

      messages.innerHTML = items.join("");
    });
    // ...
  } else {
    // User is signed out
    // Unsubscribe when the user signs out
    unsubscribe && unsubscribe();
  }
});

async function sendMessage(e) {
  console.log("form");
  e.preventDefault();
  // get values to be submitted
  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  // clear the input box
  messageInput.value = "";

  //auto scroll to bottom
  document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  const docRef = doc(db, "identification", currentUser.email);

  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  // create db collection and send in the data
  await setDoc(doc(db, "messages", timestamp.toString()), {
    user: currentUser.email,
    message: message,
    name: data.name,
    unit: data.unit,
  });
}
