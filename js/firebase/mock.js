import firebasemock from "firebase-mock";
import MockFirestoreQuery from 'firebase-mock/src/firestore-query';

const mockdatabase = new firebasemock.MockFirebase();
const mockauth = new firebasemock.MockFirebase();
const mocksdk = new firebasemock.MockFirebaseSdk(
  path => (path ? mockdatabase.child(path) : mockdatabase),
  () => mockauth
);

// extend methods
MockFirestoreQuery.prototype.startAfter = function (startAfter) {
  const query = new MockFirestoreQuery(this.path, this._getData(), this.parent, this.id);
  query.startAfter = startAfter;
  return query;
};

export const auth = mocksdk.auth();
export const db = mocksdk.firestore();
export const functions = {
  httpsCallable: (name) => (name)
};
export default mocksdk;
