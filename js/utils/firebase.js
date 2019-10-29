import firebase from 'firebase';
import { Alert, AsyncStorage } from 'react-native';
import 'firebase/firestore';
import 'firebase/functions';
import firebaseConfig from '../utils/firebaseConfig';

firebase.initializeApp(firebaseConfig);

function authUserExistsAsync() {
  if (window.indexedDB) {
    return new Promise((resolve, reject) => {
      const openReq = indexedDB.open('firebaseLocalStorageDb');
      openReq.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('firebaseLocalStorage', 'readonly');
        const store = transaction.objectStore('firebaseLocalStorage');
        const getRequest = store.getAllKeys();
        getRequest.onsuccess = (event) => {
          console.log(event.target.result);
          let exists = false;
          event.target.result.forEach((key) => {
            if (/firebase:authUser:/.test(key)) {
              exists = true;
            }
          });
          resolve(exists);
        };
        openReq.onerror = (error) => {
          reject(error);
        };
      };
      openReq.onerror = (error) => {
        reject(error);
      };
    });
  } else {
    return AsyncStorage.getAllKeys().then((keys) => {
      let exists = false;
      keys.forEach((key) => {
        if (/firebase:authUser:/.test(key)) {
          exists = true;
        }
      });
      return exists;
    });
  }
}

// authUserExistsAsync().then((exists) => {
//   Alert.alert(exists.toString());
// });

export const auth = firebase.auth();
export const db = firebase.firestore();
export const functions = firebase.functions();
export default firebase;
