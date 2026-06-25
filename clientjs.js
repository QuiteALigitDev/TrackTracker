import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js';
import { 
  getFirestore, doc, setDoc, getDoc, collection, updateDoc, increment, onSnapshot
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
let laneReady = false;
var isTiming = false;
var StartTime = Date.now();
var LaneNum = 9999;
var curTime = 0; 
const code = new URLSearchParams(window.location.search);


document.addEventListener("DOMContentLoaded", function() {
    addTimes();
});

var timerToggle = document.getElementById ("ToggleClock");
timerToggle.addEventListener ("click", ToggleClock, false);

setInterval(function myFunction(){
    if (isTiming){
    curTime = Date.now() - StartTime;
    }
    
    document.getElementById("Time").textContent = formatElapsedTime(curTime);
}, 50);

onSnapshot(doc(db, "dictionaries", code.get("id")), (docSnap) =>{
    if (!laneReady) return;
    if (docSnap.exists()){
        console.log("Document Updated.");
        var pipeCode = docSnap.data()['HostPipe'];

        if (pipeCode === "KICK_" + LaneNum){
            LaneNum -= 1;
            window.location.href = "/TrackTracker";
            return;
        }
        else if (pipeCode != '0'){
            isTiming = true;
            timerToggle.innerHTML = "Stop";
            StartTime = pipeCode;
            updateTimes("Running...", 0);
        }
    }
});

function formatElapsedTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms % 1000);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
}

async function deleteKey(key){
    await updateDoc(dictionaryRef, {
        [key]: deleteField()
    }); 
}

function ToggleClock(){
    isTiming = !isTiming;

    if (isTiming){
        timerToggle.innerHTML = "Stop";
        StartTime = Date.now();
        updateTimes("Running...", 0);
    }
    else{
        timerToggle.innerHTML = "Start";
        updateTimes(curTime, 0);
    }
}

async function updateTimes(time, awaittime) {
    await awaittime
    const dictionaryRef = doc(db, "dictionaries", code.get('id'));
    await updateDoc(dictionaryRef, {
        [LaneNum]: time
    }); 
}


async function addTimes() {
    const dictionaryRef = doc(db, "dictionaries", code.get('id'));
    const docSnap = await getDoc(
        doc(db, "dictionaries", code.get("id"))
    );

    if (docSnap.exists()) {
        LaneNum = docSnap.data().ConnectedClients;
    }
    await updateDoc(dictionaryRef, {
        ConnectedClients: increment(1),
        [LaneNum]: "Ready..."
    }); 
    console.log(`Joined "${code.get('id')}", Current Lane Num Is ${LaneNum}!`);
    laneReady = true;
}
