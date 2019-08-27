import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGEING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID
});

firebase.firestore().settings({});

export default firebase;
