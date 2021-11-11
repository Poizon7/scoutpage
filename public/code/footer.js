// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";
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

const footer = document.querySelector("footer");

async function ChairmanContact() {
  const docRef = doc(db, "contactInfo", "chairman");

  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  const name = document.createElement("h6");
  const nameText = document.createTextNode(data.name);
  const tel = document.createElement("h6");
  const telText = document.createTextNode("tel: " + data.number);
  const email = document.createElement("h6");
  const emailText = document.createTextNode("email: " + data.email);

  name.appendChild(nameText);
  tel.appendChild(telText);
  email.appendChild(emailText);

  footer.appendChild(name);
  footer.appendChild(tel);
  footer.appendChild(email);
}

async function Address() {
  const docRef = doc(db, "contactInfo", "address");

  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  const address = document.createElement("h6");
  const addressText = document.createTextNode(
    data.address + ", " + data.postcode + " " + data.city
  );

  address.appendChild(addressText);
  footer.appendChild(address);
}

ChairmanContact();
Address();
