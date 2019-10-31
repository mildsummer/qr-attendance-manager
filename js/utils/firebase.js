import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/functions';
import firebaseConfig from '../utils/firebaseConfig';

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const functions = firebase.functions();
export default firebase;
