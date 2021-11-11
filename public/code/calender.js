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

let calenderButtons;
let calenderBlocks;

// Function for to set up eventlistner
function listnerCalender() {
  calenderButtons = document.querySelectorAll(".calender-entry-button");
  calenderBlocks = document.querySelectorAll(".calender-entry-block");

  for (let i = 0; i < calenderButtons.length; i++) {
    calenderButtons[i].onclick = function (e) {
      viewCalender(e);
    };
  }
}

// function for hiding / showing calender entry block
function viewCalender(e) {
  // Geting to the calender-entry-block no matter where you press
  let block = e.target;

  while (block.nodeName != "BUTTON") {
    block = block.parentNode;
  }

  block = block.parentNode;

  block = block.querySelector(".calender-entry-block");

  // Changeing the curent block
  for (let i = 0; i < calenderBlocks.length; i++) {
    if (!block.isSameNode(calenderBlocks[i])) {
      if (!calenderBlocks[i].classList.contains("hidden")) {
        calenderBlocks[i].classList.add("hidden");
      }
    }
  }

  block.classList.toggle("hidden");
}

const calender = document.querySelector(".calender");

const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;

    const docRef = doc(db, "identification", user.email);

    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    const q = query(
      collection(db, "calendar"),
      where("unit", "==", data.unit),
      where("name", "==", data.name)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      addElementCalender(doc.data());
    });

    listnerCalender();
    // ...
  } else {
  }
});

function addElementCalender(data) {
  const divMain = document.createElement("div");
  divMain.setAttribute("class", "calender-entry");

  const button = document.createElement("BUTTON");
  button.setAttribute("class", "calender-entry-button");

  const divText = document.createElement("div");
  divText.setAttribute("class", "calender-entry-text");

  const week = document.createElement("h2");
  week.setAttribute("class", "calender-week");

  const weekText = document.createTextNode("v. " + data.week);

  const title = document.createElement("h2");
  title.setAttribute("class", "calender-title");

  const titleText = document.createTextNode(data.title);

  const img = document.createElement("img");
  img.setAttribute("src", "img/arrow.png");
  img.setAttribute("alt", "arrow");

  week.appendChild(weekText);
  divText.appendChild(week);

  title.appendChild(titleText);
  divText.appendChild(title);
  button.appendChild(divText);

  button.appendChild(img);

  divMain.appendChild(button);

  const divBlock = document.createElement("div");
  divBlock.setAttribute("class", "calender-entry-block hidden");

  const divDescription = document.createElement("div");
  divDescription.setAttribute("class", "calender-ideas");

  const descriptionTitle = document.createElement("h2");

  const descriptionTitleText = document.createTextNode("Beskrivning");

  const descriptionText = document.createElement("p");

  const descriptionTextText = document.createTextNode(data.text);

  descriptionTitle.appendChild(descriptionTitleText);
  descriptionText.appendChild(descriptionTextText);
  divDescription.appendChild(descriptionTitle);
  divDescription.appendChild(descriptionText);
  divBlock.appendChild(divDescription);

  divMain.appendChild(divBlock);

  calender.appendChild(divMain);
}
