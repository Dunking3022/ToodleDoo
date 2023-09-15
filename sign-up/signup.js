import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.2.0/firebase-analytics.js'
// Add Firebase products that you want to use
import { collection,getFirestore, doc, setDoc, addDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js'


const firebaseConfig = {
    apiKey: "AIzaSyDoaqMDojzhEbQ4pE9I8LotPOuI76o1dAA",
    authDomain: "toodledoo-c0b98.firebaseapp.com",
    projectId: "toodledoo-c0b98",
    storageBucket: "toodledoo-c0b98.appspot.com",
    messagingSenderId: "350342690270",
    appId: "1:350342690270:web:b9b9abdf6734d3d2f3d94f"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// const credentialsRef = doc(collection(db, "UserCredentials"));


async function submitPassword(){

    const username = document.getElementById("username");
    const password = document.getElementById("pass");

    if(username.value == "" || password.value == ""){ 
        Swal.fire('Alert!', 'You need to add both Username and Password!', 'info');
        return;
    }

    const credref = doc(db, "UserCredentials",username.value);

    const docSnap = await getDoc(credref);

    
    if (docSnap.exists()) {
        Swal.fire('Error!', 'This username is already being used, Try another one', 'error');
    } else {
        if(! /^[A-Za-z0-9_]+$/.test(username.value)){
            
            Swal.fire('Alert!', 'Username can only use letter, numbers and underscores', 'info');
        }
        else{

        await setDoc(doc(db, "UserCredentials", username.value), {
        password:password.value,
        })

        Swal.fire('Success!', 'Succesfully Registered! Redirecting to login page', 'success');
        setTimeout(function(){window.open("../index.html","_self");},1500);
        }
    }

}

document.getElementById("submit").addEventListener("click",submitPassword);