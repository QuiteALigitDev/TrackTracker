import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js';
import { 
  getFirestore, doc, setDoc, getDoc, collection, addDoc , onSnapshot, updateDoc, increment, deleteField, runTransaction, Timestamp
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

const container = document.getElementById('Lanes');

document.getElementById("codeVis").textContent = "Code:" + code;

document.getElementById ("TimerStart").addEventListener("click", StartClock, false);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function StartClock() {
    const dictionaryRef = doc(db, "dictionaries", code);
    await updateDoc(dictionaryRef, {
        HostPipe: Date.now()
    }); 
    await delay(500)
    await updateDoc(dictionaryRef, {
        HostPipe: 0
    }); 
}

async function KickLane(lane){
    const dictionaryRef = doc(db, "dictionaries", code);

    await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(dictionaryRef);
        const current = docSnap.data().ConnectedClients;
        transaction.update(dictionaryRef, {
            ConnectedClients: Math.max(0, current - 1)
        });
    });

    await updateDoc(dictionaryRef, {
        HostPipe: "KICK_" + String(lane),
        [lane]: deleteField()
    }); 
    await delay(500)
    await updateDoc(dictionaryRef, {
        HostPipe: 0
    }); 
}

document.addEventListener("DOMContentLoaded", function() {
    createDictionary(code);
});

onSnapshot(doc(db, "dictionaries", code), (docSnap) =>{
    if (docSnap.exists()){
        console.log("Document Updated.");
        console.log(docSnap.data())

        container.innerHTML = "";
        const labeDiv = document.createElement('div');
        labeDiv.className = 'lightLabel';


        if (Object.keys(docSnap.data()).length == 2){
            labeDiv.innerHTML = "No Lanes Currently...";
            container.appendChild(labeDiv);
            return;
        }

        const data = docSnap.data();
        
        const lanes = Object.keys(data)
            .filter(key => key !== "ConnectedClients" && key !== "HostPipe")
            .map((key, index) => ({
                key,
                config: data[key],
                index
            }))
            .sort((a, b) => {
                const aTime = a.config === "Running..." ? Infinity : a.config;
                const bTime = b.config === "Running..." ? Infinity : b.config;

                return aTime - bTime; // fastest first
            });

        lanes.forEach(({ key, config, index} ) => {
            if (key == "ConnectedClients" || key == "HostPipe") return;

            const widgetDiv = document.createElement('div'); // move inside loop
            widgetDiv.className = 'Lane';
            widgetDiv.innerHTML = `
                <div class="Lane" id="lane${key}">
                    <button class="button-name" id="kick${key}"><i class="fa-solid fa-ban"></i></button>
                    <h2>Lane ${index}</h2>
                    <h2>${config === "Running..." ? "Running..." : formatElapsedTime(config)}</h2>
                </div>
            `;
            container.appendChild(widgetDiv);
            document.getElementById(`kick${key}`).addEventListener("click", () => {
                KickLane(key);
            });
        });
    }
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
        ConnectedClients: 0,
        HostPipe: 0
    }); 
    console.log(`Dictionary "${code}"!`);
}
