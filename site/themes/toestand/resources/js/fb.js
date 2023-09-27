// const firebase = require("firebase");
import firebase from 'firebase/app';
import 'firebase/firestore';   // for cloud firestore
import 'firebase/functions';   // for cloud functions


require("firebase/firestore");

// Should go to env or statamic settings
var firebaseConfig = {
  apiKey: "AIzaSyAu2Xq9C0prgVAqns8qP9IHAFcmH2t380I",
  authDomain: "toestand-calendar.firebaseapp.com",
  databaseURL: "https://toestand-calendar.firebaseio.com",
  projectId: "toestand-calendar",
  storageBucket: "toestand-calendar.appspot.com",
  messagingSenderId: "369570259406",
  appId: "1:369570259406:web:8d32d77f819d35e1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// exports.db = firebase.firestore();

const db = firebase.firestore();
export default db;
