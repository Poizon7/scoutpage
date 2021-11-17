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

let calenderButtons;
let calenderBlocks;
let calenderChange;

// Function for to set up eventlistner
function listnerCalender() {
  calenderButtons = document.querySelectorAll(".calender-entry-button");
  calenderBlocks = document.querySelectorAll(".calender-entry-block");
  calenderChange = document.querySelectorAll(".calender-entry-change");

  for (let i = 0; i < calenderButtons.length; i++) {
    calenderButtons[i].addEventListener("click", viewCalender);
  }

  for (let i = 0; i < calenderChange.length; i++) {
    calenderChange[i].addEventListener("click", changeCalender);
  }
}

// function for hiding / showing calender entry block
function viewCalender(e) {
  console.log("view");
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

function changeCalender(e) {
  let block = e.target;

  while (false == block.classList.contains("calender-entry")) {
    block = block.parentNode;
  }

  const entry = block;

  block = entry.querySelector(".calender-entry-change");
  block.innerText = "Spara";
  block.removeEventListener("click", changeCalender);
  block.addEventListener("click", ChangeSave);

  const changeTitle = document.createElement("input");
  changeTitle.setAttribute("type", "text");
  changeTitle.setAttribute("id", "title");
  block = entry.querySelector(".calender-title");
  changeTitle.value = block.innerText;
  block.parentNode.insertBefore(changeTitle, block);
  block.classList.add("hidden");

  block.parentNode.parentNode.removeEventListener("click", viewCalender);

  const changeWeek = document.createElement("input");
  changeWeek.setAttribute("type", "text");
  changeWeek.setAttribute("id", "week");
  block = entry.querySelector(".calender-week");
  changeWeek.value = block.innerText.slice(block.innerText.indexOf(" ") + 1);
  block.parentNode.insertBefore(changeWeek, block);
  block.classList.add("hidden");

  const changeBlock = document.createElement("textarea");
  changeBlock.setAttribute("id", "block");
  changeBlock.setAttribute("rows", "6");
  changeBlock.setAttribute("cols", "50");
  block = entry.querySelector(".calender-description > p");
  changeBlock.value = block.innerText;
  block.parentNode.insertBefore(changeBlock, block);
  block.classList.add("hidden");
}

async function ChangeSave(e) {
  let block = e.target;

  while (false == block.classList.contains("calender-entry")) {
    block = block.parentNode;
  }

  const entry = block;

  entry
    .querySelector(".calender-entry-button")
    .addEventListener("click", viewCalender);

  block = entry.querySelector(".calender-entry-change");
  block.innerText = "Ändra";
  block.addEventListener("click", changeCalender);
  block.removeEventListener("click", ChangeSave);

  const week = entry.querySelector(".calender-week");
  const title = entry.querySelector(".calender-title");
  const desc = entry.querySelector(".calender-description > p");

  const weekChange = entry.querySelector("#week");
  const titleChange = entry.querySelector("#title");
  const descChange = entry.querySelector("#block");

  if (entry.id != "new") {
    const ref = doc(db, "calendar", entry.id);

    await updateDoc(ref, { week: parseInt(weekChange.value) });

    await updateDoc(ref, { title: titleChange.value });

    await updateDoc(ref, { text: descChange.value });
  } else {
    await addDoc(collection(db, "calendar"), {
      name: name,
      text: descChange.value,
      title: titleChange.value,
      unit: unit,
      week: parseInt(weekChange.value),
      year: new Date().getFullYear(),
    });

    addAddButton();
  }
  week.innerText = "v. " + weekChange.value;
  week.classList.remove("hidden");
  weekChange.remove();

  title.innerText = titleChange.value;
  title.classList.remove("hidden");
  titleChange.remove();

  desc.innerText = descChange.value;
  desc.classList.remove("hidden");
  descChange.remove();
}

const calender = document.querySelector(".calender");
let name;
let unit;

const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;

    const docRef = doc(db, "identification", user.email);

    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    name = data.name;
    unit = data.unit;

    const q = query(
      collection(db, "calendar"),
      where("unit", "==", data.unit),
      where("name", "==", data.name)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      addElementCalender(doc.data(), data, doc.id);
    });

    addAddButton();

    listnerCalender();
    // ...
  } else {
  }
});

function addElementCalender(data, user, id) {
  const divMain = document.createElement("div");
  divMain.setAttribute("class", "calender-entry");
  divMain.setAttribute("id", id);

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
  divDescription.setAttribute("class", "calender-description");

  const descriptionTitle = document.createElement("h2");

  const descriptionTitleText = document.createTextNode("Beskrivning");

  const descriptionText = document.createElement("p");

  const descriptionTextText = document.createTextNode(data.text);

  descriptionTitle.appendChild(descriptionTitleText);
  descriptionText.appendChild(descriptionTextText);
  divDescription.appendChild(descriptionTitle);
  divDescription.appendChild(descriptionText);
  divBlock.appendChild(divDescription);

  if (user.type == "ledare") {
    const changeButton = document.createElement("BUTTON");
    changeButton.setAttribute("class", "calender-entry-change");
    const changeButtonText = document.createTextNode("ändra");

    changeButton.appendChild(changeButtonText);
    divBlock.appendChild(changeButton);
  }

  divMain.appendChild(divBlock);

  calender.appendChild(divMain);
}

function addAddButton() {
  const mainDiv = document.createElement("div");
  mainDiv.setAttribute("id", "add-button");
  const img = document.createElement("img");
  img.setAttribute("src", "");
  img.setAttribute("alt", "");
  mainDiv.addEventListener("click", addInstance);

  const text = document.createElement("h2");
  const textText = document.createTextNode("Add");
  text.appendChild(textText);
  mainDiv.appendChild(text);

  mainDiv.appendChild(img);
  calender.appendChild(mainDiv);
}

async function addInstance(e) {
  const divMain = document.createElement("div");
  divMain.setAttribute("class", "calender-entry");
  divMain.setAttribute("id", "new");

  const button = document.createElement("BUTTON");
  button.setAttribute("class", "calender-entry-button");

  const divText = document.createElement("div");
  divText.setAttribute("class", "calender-entry-text");

  const week = document.createElement("h2");
  week.setAttribute("class", "calender-week");

  const weekText = document.createTextNode("v. ");

  const title = document.createElement("h2");
  title.setAttribute("class", "calender-title");

  const titleText = document.createTextNode("");

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
  divBlock.setAttribute("class", "calender-entry-block");

  const divDescription = document.createElement("div");
  divDescription.setAttribute("class", "calender-description");

  const descriptionTitle = document.createElement("h2");

  const descriptionTitleText = document.createTextNode("Beskrivning");

  const descriptionText = document.createElement("p");

  const descriptionTextText = document.createTextNode("");

  descriptionTitle.appendChild(descriptionTitleText);
  descriptionText.appendChild(descriptionTextText);
  divDescription.appendChild(descriptionTitle);
  divDescription.appendChild(descriptionText);
  divBlock.appendChild(divDescription);

  const changeButton = document.createElement("BUTTON");
  changeButton.setAttribute("class", "calender-entry-change");

  divBlock.appendChild(changeButton);

  divMain.appendChild(divBlock);

  calender.appendChild(divMain);
  calender.querySelector("#add-button").remove();

  let block = calender.querySelector("#new");
  const entry = block;

  block = entry.querySelector(".calender-entry-change");
  block.innerText = "Spara";
  block.addEventListener("click", ChangeSave);

  const changeTitle = document.createElement("input");
  changeTitle.setAttribute("type", "text");
  changeTitle.setAttribute("id", "title");
  block = entry.querySelector(".calender-title");
  changeTitle.value = block.innerText;
  block.parentNode.insertBefore(changeTitle, block);
  block.classList.add("hidden");

  block.parentNode.parentNode.removeEventListener("click", viewCalender);

  const changeWeek = document.createElement("input");
  changeWeek.setAttribute("type", "text");
  changeWeek.setAttribute("id", "week");
  block = entry.querySelector(".calender-week");
  block.parentNode.insertBefore(changeWeek, block);
  block.classList.add("hidden");

  const changeBlock = document.createElement("textarea");
  changeBlock.setAttribute("id", "block");
  changeBlock.setAttribute("rows", "6");
  changeBlock.setAttribute("cols", "50");
  block = entry.querySelector(".calender-description > p");
  changeBlock.value = block.innerText;
  block.parentNode.insertBefore(changeBlock, block);
  block.classList.add("hidden");

  listnerCalender();
  console.log(entry.querySelector(".calender-entry-button"));
  entry
    .querySelector(".calender-entry-button")
    .removeEventListener("click", viewCalender);
  entry
    .querySelector(".calender-entry-change")
    .removeEventListener("click", changeCalender);
}
