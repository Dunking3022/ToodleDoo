import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.2.0/firebase-analytics.js'

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

const submitButton = document.getElementById("submit");

// const credentialsRef = doc(collection(db, "UserCredentials"));


async function submitPassword(){
    

    const username = document.getElementById("username");
    const password = document.getElementById("pass");

    if(username.value == "" || password.value == ""){
        Swal.fire('Alert!', 'You need to add both Username and Password!', 'info');
        return;
    }

    const credref = doc(db, "UserCredentials",username.value);
    const dataref = doc(db, "UserData",username.value);
    submitButton.setAttribute("loading","");
    let docSnap;
    try{
      docSnap = await getDoc(credref);
    }
    catch{
      Swal.fire('Error!', 'Request Timed Out', 'error');
    }
    finally{
      submitButton.removeAttribute("loading");
    }
    if (!docSnap.exists()) {

        Swal.fire({
            title: 'Error',
            text: 'No such user exists',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Register',
            cancelButtonText: 'Retry'
          }).then((result) => {
            if (result.isConfirmed) {
              // Function to execute when "Confirm" button is clicked
              window.open("../sign-up/signup.html","_self");
              console.log('Confirm button clicked');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Function to execute when "Cancel" button is clicked
              console.log('Cancel button clicked');
            }
          });
          
    } else {
        // const passw = querySnapshot;
        if(docSnap.data().password == password.value){
          let dataSnap;
            try{
              dataSnap = await getDoc(dataref);
            }
            catch{
              Swal.fire('Error!', 'Request Timed Out', 'error');
            }
            finally{
              submitButton.removeAttribute("loading");
            }
            let cloudData = "";
            try{
            cloudData = dataSnap.data().userData;
            }
            catch{
              console.log("New User Encountered");
            }
            localStorage.setItem("gridState",cloudData);
            console.log("Synced Cloud Data");
            Swal.fire('Success!', 'You are now logged in', 'success');
            localStorage.setItem("currentUser",username.value);
            setTimeout(function(){window.open("../mainPage/index.html","_self");},2000);

        }
        else{
            Swal.fire('Error!', 'Wrong Password. Please try again!', 'error');
        }

        // if(! /^[A-Za-z0-9_]+$/.test(username.value)){
        //     alert("Usernames can only use letters, numbers and underscores");
        // }
        // else{

        // await setDoc(doc(db, "UserCredentials", username.value), {
        // password:password.value,
        // })

        // alert("You have been registered");
        // }
    }

}

submitButton.addEventListener("click",submitPassword);

function debugAlert(){
  alert("It works!");
}