import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/messaging'
import firebaseConfig from "./firebaseConfig";

firebase.initializeApp(firebaseConfig)

export default firebase