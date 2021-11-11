let contact = document.querySelector(".unit");

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

async function Contact() {
  const info = document.querySelector(".info");
  const docRef = doc(db, "contactInfo", "chairman");

  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  const name = document.createElement("h2");
  const nameText = document.createTextNode(data.name);
  const tel = document.createElement("h2");
  const telText = document.createTextNode("tel: " + data.number);
  const email = document.createElement("h2");
  const emailText = document.createTextNode("email: " + data.email);

  name.appendChild(nameText);
  tel.appendChild(telText);
  email.appendChild(emailText);

  info.appendChild(name);
  info.appendChild(tel);
  info.appendChild(email);
}

addElementContact("spårare", "Tisdag");
addElementContact("spårare", "Torsdag");
addElementContact("upptäckare", "Måndag");
addElementContact("upptäckare", "Onsdag");
addElementContact("äventyrare", "Tisdag");
addElementContact("utmanare", "Onsdag");
addElementContact("utmanare", "Torsdag");

async function addElementContact(unit, day) {
  const div = document.querySelector("." + unit.toLowerCase());
  const docRef = doc(db, "contactInfo", "units", unit, day);

  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  const divMain = document.createElement("div");

  const title = document.createElement("h2");
  const titleText = document.createTextNode(day);

  title.appendChild(titleText);
  divMain.appendChild(title);

  const leader = document.createElement("p");
  const leaderText = document.createTextNode(data.name);

  leader.appendChild(leaderText);
  divMain.appendChild(leader);

  const tel = document.createElement("p");
  const telText = document.createTextNode(data.number);

  tel.appendChild(telText);
  divMain.appendChild(tel);

  div.appendChild(divMain);
}

Contact();
