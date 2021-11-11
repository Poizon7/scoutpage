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

async function Article(page) {
  const docRef = doc(db, "mainPage", page);

  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  const orgDiv = document.createElement("article");
  orgDiv.setAttribute("id", page);
  const orgP = document.createElement("p");
  const orgPText = document.createTextNode(data.text);
  const orgImg = document.createElement("img");
  orgImg.setAttribute("src", data.img);
  orgImg.setAttribute("alt", data.imgText);
  orgP.appendChild(orgPText);
  orgDiv.appendChild(orgP);
  orgDiv.appendChild(orgImg);
  main.appendChild(orgDiv);
}

const main = document.querySelector("#main-page");

let page = "organisationInfo";

Article(page);

page = "troupeInfo";

Article(page);