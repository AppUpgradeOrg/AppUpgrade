import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCS05MTf2CwsWo9T59mwhEdQUJbxmzBoPU",
  authDomain: "app-upgrade-qa.firebaseapp.com",
  databaseURL: "https://app-upgrade-qa.firebaseio.com",
  projectId: "app-upgrade-qa",
  storageBucket: "app-upgrade-qa.appspot.com",
  messagingSenderId: "61144220322",
  appId: "1:61144220322:web:c11953c511968b22c58dfb",
  measurementId: "G-HXHRQSFST8",
};

export const app = firebase.initializeApp(firebaseConfig);
