import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js';
import { 
  getFirestore, doc, setDoc, getDoc, collection, addDoc 
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

const code = new URLSearchParams(window.location.search).get('id');

document.getElementById("codeVis").textContent = "Code:" + code;

document.addEventListener("DOMContentLoaded", function() {
    createDictionary(code);
});

function formatElapsedTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms % 1000);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
}


async function createDictionary(code) {
    const dictionaryRef = doc(db, "dictionaries", code);
    await setDoc(dictionaryRef, {
        ConnectedClients: 0
    }); 
    console.log(`Dictionary "${code}"!`);
}
