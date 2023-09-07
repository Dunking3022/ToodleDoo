    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-analytics.js";
    import {
    collection,
    getFirestore,
    doc,
    setDoc,
    addDoc,
    getDoc,
    } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
    const firebaseConfig = {
    apiKey: "AIzaSyDoaqMDojzhEbQ4pE9I8LotPOuI76o1dAA",
    authDomain: "toodledoo-c0b98.firebaseapp.com",
    projectId: "toodledoo-c0b98",
    storageBucket: "toodledoo-c0b98.appspot.com",
    messagingSenderId: "350342690270",
    appId: "1:350342690270:web:b9b9abdf6734d3d2f3d94f",
    };

    const app = initializeApp(firebaseConfig);

    const db = getFirestore(app);

    const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
    });

    document
    .getElementById("logOutButton")
    .addEventListener("click", function () {
        console.log("WYWYWYWOWY");
        Swal.fire({
            title: 'Log-Out',
            text: 'Are you sure you want to log out? Your data will be synced!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cance'
          }).then(async (result) => {
            if (result.isConfirmed) {
              // Function to execute when "Confirm" button is clicked
                
              try{
                await syncDataToCloud();
                localStorage.setItem("currentUser","");
                setTimeout(function(){
                    window.open("../log-in/login.html","_self");
                console.log('Confirm button clicked');},1500);
            }
              catch{console.log("ERROR ENCOUNTERED");}
              
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Function to execute when "Cancel" button is clicked
              console.log('Cancel button clicked');
            }
          });


    });

    async function syncDataToCloud() {
        const currentUser = localStorage.getItem("currentUser");
        const currentUserData = localStorage.getItem("gridState");
        const credref = doc(db, "UserData", currentUser);
        try {
            await setDoc(doc(db, "UserData", currentUser), {
                userData: currentUserData,
            });

            
        Toast.fire({
            icon: "success",
            title: "Synced Successfully",
        })
        }
        finally{
            console.log("Function Executed");
        }
    }

    document
    .getElementById("syncButton")
    .addEventListener("click",syncDataToCloud);
