import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js';
import { 
  getFirestore, doc, setDoc, getDoc, collection, updateDoc, increment
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

var isTiming = false;
var StartTime = Date.now();
var LaneNum = 0;
var curTime = 0; 

document.addEventListener("DOMContentLoaded", function() {
    addTimes();
});

document.getElementById ("ToggleClock").addEventListener ("click", ToggleClock, false);
setInterval(function myFunction(){
    if (isTiming){
    curTime = Date.now() - StartTime;
    }
    
    document.getElementById("Time").textContent = formatElapsedTime(curTime);
}, 0);

function formatElapsedTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms % 1000);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
}


function ToggleClock(){
    isTiming = !isTiming;

    if (isTiming){
        console.log("Timing..");
        StartTime = Date.now();
        updateTimes("Running...");
    }
    else{
        updateTimes(curTime);
        console.log(curTime);
    }
}

async function updateTimes(time) {
    const code = new URLSearchParams(window.location.search);
    const dictionaryRef = doc(db, "dictionaries", code.get('id'));
    await updateDoc(dictionaryRef, {
        [LaneNum]: time
    }); 
    console.log(`Joined "${code.get('id')}"!`);
}


async function addTimes() {
    const code = new URLSearchParams(window.location.search);
    const dictionaryRef = doc(db, "dictionaries", code.get('id'));
    const docSnap = await getDoc(
        doc(db, "dictionaries", code.get("id"))
    );

    if (docSnap.exists()) {
        LaneNum = docSnap.data().ConnectedClients;
    }
    await updateDoc(dictionaryRef, {
        ConnectedClients: increment(1)
    }); 
    console.log(`Joined "${code.get('id')}", Current Lane Num Is ${LaneNum}!`);
}
