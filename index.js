import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js';
import { 
  getFirestore, doc, setDoc, getDoc, collection, addDoc , onSnapshot, updateDoc, increment, deleteField, runTransaction
} from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js';

const firebaseConfig = {
apiKey: "AIzaSyBAGgcQFYhWWH9368q5UNUJyRYy5VTcYu4",
authDomain: "yrsdbtracktracker.firebaseapp.com",
projectId: "yrsdbtracktracker",
storageBucket: "yrsdbtracktracker.appspot.com",
messagingSenderId: "777919976392",
appId: "1:777919976392:web:bab40a76ac13e3978d26fd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const infobox = document.querySelector(".MinorInfo");

window.redirectToLink = function(event) {
  event.preventDefault(); // Stop the form from submitting normally
  
  // Get the input value
  const inputValue = document.getElementById('userInput').value;
  
  // Create the URL with the parameter
  const targetUrl = "/TrackTracker/join.html?id=" + inputValue;

  Transfer(targetUrl, inputValue);
}

async function Transfer(targetUrl, input) {
  const docSnap = await getDoc(
    doc(db, "dictionaries", input)
  );

  if(docSnap.exists()){
    window.location.href = targetUrl;
    infobox.innerHTML = "";
  }
  else{
    infobox.innerHTML = "No Session Found With Code...";

  }
}

window.Host = function() {
    var code = Math.random().toString(36).substring(2, 8).padEnd(6, '0');
    const targetUrl = "TrackTracker/host.html?id=" + code;
    window.location.href = targetUrl;
}